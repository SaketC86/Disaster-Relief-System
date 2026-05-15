#  ReliefSOS — Hyper-Local Disaster Relief & SOS Coordinator

A real-time disaster coordination web app that connects people in critical need
with nearby volunteers and emergency resources instantly.

## Team Members
1.Saket.C -Main UI building (index.html,styles.css)  
2.S.V.Karthik -SOS and help forms(help.html,needhelp.html)  
3.Swapnil.N -Live feed(feed.html,feed.js)   
4.P.Sputhnik -Radar Map(map.html,map.js)  
5.M.Yaswanth -Admin and PWA(admin.html,admin.js)  

## Live Demo
https://saketc86.github.io/Disaster-Relief-System/
---

## Features

-  **SOS Request System** — Submit emergency alerts with GPS-pinned location
-  **Volunteer Resource Registry** — List available supplies for routing
-  **Live Community Feed** — Real-time log of all active SOS & resource posts
-  **Radar Map** — Interactive Leaflet map with marker clustering & route plotting
-  **Auto Triage Engine** — Keyword-based severity classification (Code Red/Yellow/Green)
-  **Live Weather API** — Open-Meteo integration for local hazard monitoring
-  **Logistics Routing** — Leaflet Routing Machine for optimal transit paths
-  **Admin Dashboard** — Resolve tickets, view stats, purge data
-  **PWA Ready** — Installable on mobile with offline caching via Service Worker

---

##  Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Maps | Leaflet.js, MarkerCluster, Routing Machine |
| Geocoding | Leaflet Control Geocoder |
| Weather | Open-Meteo API |
| Charts | Chart.js |
| Storage | localStorage (client-side) |
| PWA | Web App Manifest + Service Worker |

---

##  Project Structure

ReliefSOS/   
├── index.html           
├── needhelp.html         
├── help.html             
├── feed.html             
├── map.html             
├── admin.html           
├── css/  
│   └── style.css  
├── js/  
│   ├── app.js    
│   ├── storage.js        
│   ├── feed.js          
│   ├── map.js            
│   └── admin.js          
├── img/  
│   └── hyd.jpeg  
├── manifest.json         
└── sw.js                 



