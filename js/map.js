const map = L.map('map').setView([8.5241, 76.9366], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'OpenStreetMap'
}).addTo(map);

navigator.geolocation.getCurrentPosition((position) => {

  const lat = position.coords.latitude;
  const lng = position.coords.longitude;

  map.setView([lat, lng], 13);

  L.marker([lat, lng])
    .addTo(map)
    .bindPopup("You are here")
    .openPopup();

  const posts = JSON.parse(localStorage.getItem("posts")) || [];

  posts.forEach((post) => {

    const randomLat = lat + (Math.random() - 0.5) * 0.02;
    const randomLng = lng + (Math.random() - 0.5) * 0.02;

    let message = "";

    if (post.type === "SOS") {
      message = "<b>SOS Request</b><br>Name: " + post.name + "<br>Emergency: " + post.emergency;
    } else {
      message = "<b>Resource</b><br>Volunteer: " + post.helper + "<br>Resource: " + post.resource;
    }

    L.marker([randomLat, randomLng]).addTo(map).bindPopup(message);

  });

});