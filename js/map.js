document.addEventListener('DOMContentLoaded', () => {

  const map = L.map('map', { zoomControl: false }).setView([9.10616, 76.4984], 14); 
  L.control.zoom({ position: 'topright' }).addTo(map);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { 
    attribution: '&copy; CARTO', maxZoom: 19 
  }).addTo(map);

  const markers = L.markerClusterGroup({ spiderfyOnMaxZoom: true, showCoverageOnHover: false, zoomToBoundsOnClick: true });
  const posts = JSON.parse(localStorage.getItem('reliefPosts')) || [];
  let userLatLng = null; let routingControl = null;

  // We only need 3 icons now: SOS, Resources, and Volunteer Requests
  const sosIcon = L.divIcon({ className: 'custom-pin', html: '<i class="fa-solid fa-location-dot" style="color: #e11d48; font-size: 40px; filter: drop-shadow(0px 5px 5px rgba(225, 29, 72, 0.4)); text-shadow: 0px 0px 2px #fff;"></i>', iconSize: [40, 40], iconAnchor: [20, 40] });
  const resIcon = L.divIcon({ className: 'custom-pin', html: '<i class="fa-solid fa-location-dot" style="color: #10b981; font-size: 40px; filter: drop-shadow(0px 5px 5px rgba(16, 185, 129, 0.4)); text-shadow: 0px 0px 2px #fff;"></i>', iconSize: [40, 40], iconAnchor: [20, 40] });
  const volReqIcon = L.divIcon({ className: 'custom-pin', html: '<i class="fa-solid fa-location-dot" style="color: #9333ea; font-size: 40px; filter: drop-shadow(0px 5px 5px rgba(147, 51, 234, 0.4)); text-shadow: 0px 0px 2px #fff;"></i>', iconSize: [40, 40], iconAnchor: [20, 40] });

  L.Control.geocoder({ defaultMarkGeocode: false, position: 'topright', placeholder: "Search city or sector..." }).on('markgeocode', function(e) { map.flyToBounds(e.geocode.bbox); }).addTo(map);

  map.locate({setView: true, maxZoom: 14, enableHighAccuracy: true});

  map.on('locationfound', function(e) {
    userLatLng = e.latlng;
    const userIcon = L.divIcon({ className: 'custom-pin', html: '<div style="background: #09090b; width: 20px; height: 20px; border-radius: 50%; border: 3px solid #fff; box-shadow: 0 0 15px rgba(0,0,0, 0.8); animation: pulse 2s infinite;"></div>', iconSize: [20, 20], iconAnchor: [10, 10] });
    L.marker(userLatLng, {icon: userIcon, zIndexOffset: 1000}).addTo(map).bindPopup("<b>Command Center</b><br>Live GPS").openPopup();
    generateDatabasePins(userLatLng.lat, userLatLng.lng); fetchLiveWeatherAPI(userLatLng.lat, userLatLng.lng);
  });

  map.on('locationerror', function() {
    map.setView([17.3850, 78.4867], 12); generateDatabasePins(17.3850, 78.4867);
  });

  function analyzeSeverity(description) {
    const text = description.toLowerCase();
    if (['trapped', 'unconscious', 'bleeding', 'heart', 'critical', 'fire'].some(w => text.includes(w))) return { level: 'Code Red', color: '#e11d48' };
    if (['water', 'food', 'shelter', 'fever', 'pain', 'broken'].some(w => text.includes(w))) return { level: 'Code Yellow', color: '#f59e0b' };
    return { level: 'Code Green', color: '#10b981' };
  }

  function generateDatabasePins(baseLat, baseLng) {
    // FILTER OUT PERSONNEL SO THEY NEVER SHOW ON THE MAP
    const publicPosts = posts.filter(post => post.category !== 'PERSONNEL');

    publicPosts.forEach((post) => {
      let lat = parseFloat(post.lat) || (baseLat + ((Math.random() - 0.5) * 0.05));
      let lng = parseFloat(post.lng) || (baseLng + ((Math.random() - 0.5) * 0.05));

      let markerIcon, triage, btnIcon, btnText, headerColor;
      
      if (post.category === 'SOS') {
        if(post.type === 'Need Volunteer / Manpower') {
          markerIcon = volReqIcon; triage = { level: 'Manpower Needed', color: '#9333ea' }; btnIcon = 'fa-users'; btnText = 'Route Volunteers'; headerColor = '#9333ea';
        } else {
          markerIcon = sosIcon; triage = analyzeSeverity(post.type); btnIcon = 'fa-truck-medical'; btnText = 'Plot Rescue Route'; headerColor = '#09090b';
        }
      } else if (post.category === 'RESOURCE') {
        markerIcon = resIcon; triage = { level: 'Resource Hub', color: '#10b981' }; btnIcon = 'fa-box-open'; btnText = 'Plot Supply Pickup'; headerColor = '#09090b';
      }

      const popupText = `
        <div style="font-family: Inter; padding: 5px;">
          <h3 style="margin: 0 0 8px 0; font-size: 1.1rem; color: ${headerColor};">${post.type}</h3>
          <span style="background: ${triage.color}; color: #fff; padding: 3px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 800; display: inline-block; margin-bottom: 8px;">${triage.level}</span>
          <p style="margin: 4px 0; color: #3f3f46; font-size: 0.9rem;"><b>Contact:</b> ${post.name}</p>
          <button onclick="calculateRoute(${lat}, ${lng})" style="margin-top: 10px; width: 100%; padding: 10px; background: #09090b; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; transition: 0.3s;">
            <i class="fa-solid ${btnIcon}" style="color: ${triage.color};"></i> ${btnText}
          </button>
        </div>
      `;

      const marker = L.marker([lat, lng], { icon: markerIcon }).bindPopup(popupText);
      markers.addLayer(marker);
    });
    map.addLayer(markers);
  }

  window.calculateRoute = function(destLat, destLng) {
    if (!userLatLng) { alert("GPS coordinates required to calculate transit route."); return; }
    document.getElementById('routeStatus').innerHTML = '<p style="color: #3b82f6;"><i class="fa-solid fa-spinner fa-spin"></i> Calculating optimal transit path...</p>';
    if (routingControl) { map.removeControl(routingControl); }

    routingControl = L.Routing.control({
      waypoints: [ L.latLng(userLatLng.lat, userLatLng.lng), L.latLng(destLat, destLng) ],
      routeWhileDragging: false, lineOptions: { styles: [{ color: '#3b82f6', opacity: 0.9, weight: 6, dashArray: '10, 10' }] },
      createMarker: function() { return null; }, show: false 
    }).addTo(map);

    routingControl.on('routesfound', function(e) {
      const distance = (e.routes[0].summary.totalDistance / 1000).toFixed(2); 
      const time = Math.round(e.routes[0].summary.totalTime / 60); 
      document.getElementById('routeStatus').innerHTML = `
        <p style="font-size: 1.2rem; font-weight: bold; color: #fff; margin-bottom: 4px;">Logistics Route Established</p>
        <p style="color: #a1a1aa; margin: 0 0 10px 0;"><i class="fa-solid fa-truck"></i> Est. Transit Time: <span style="color: #10b981;">${time} mins</span></p>
        <p style="color: #a1a1aa; margin: 0;"><i class="fa-solid fa-ruler"></i> Distance: <span>${distance} km</span></p>
      `;
      document.getElementById('clearRouteBtn').style.display = 'block';
    });
  };

  window.clearCurrentRoute = function() {
    if (routingControl) { 
      map.removeControl(routingControl); routingControl = null;
      document.getElementById('routeStatus').innerHTML = '<p style="color: #a1a1aa;">Click on any pin on the map to plot a safe transit route.</p>';
      document.getElementById('clearRouteBtn').style.display = 'none';
    }
  }

  function fetchLiveWeatherAPI(lat, lng) {
    const weatherContent = document.getElementById('weatherContent');
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`)
      .then(response => response.json()).then(data => {
        weatherContent.innerHTML = `
          <div class="weather-row"><i class="fa-solid fa-temperature-half"></i> <span>${data.current_weather.temperature}°C</span></div>
          <div class="weather-row"><i class="fa-solid fa-wind"></i> <span>${data.current_weather.windspeed} km/h Wind</span></div>
          <div class="hazard-warning"><i class="fa-solid fa-circle-info"></i> Monitoring Exposure Risks</div>
        `;
      }).catch(() => { weatherContent.innerHTML = "<p style='color: #e11d48;'>API Connection Failed.</p>"; });
  }

  const style = document.createElement('style');
  style.innerHTML = `@keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(0,0,0, 0.7); } 70% { box-shadow: 0 0 0 15px rgba(0,0,0, 0); } 100% { box-shadow: 0 0 0 0 rgba(0,0,0, 0); } }`;
  document.head.appendChild(style);
});