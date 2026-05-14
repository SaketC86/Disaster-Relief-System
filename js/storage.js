document.addEventListener('DOMContentLoaded', () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => { navigator.serviceWorker.register('/sw.js').catch(err => console.error('Service Worker Failed!', err)); });
  }

  const sosForm = document.getElementById('sosForm');
  const resourceForm = document.getElementById('resourceForm');

  if (sosForm) {
    sosForm.addEventListener('submit', (e) => {
      e.preventDefault();
      saveData('SOS', {
        name: document.getElementById('name').value,
        type: document.getElementById('emergency').value,
        location: document.getElementById('location').value,
        lat: document.getElementById('lat').value || null,
        lng: document.getElementById('lng').value || null,
        contact: document.getElementById('contact').value,
        timestamp: new Date().toISOString()
      });
      window.location.href = 'feed.html';
    });
  }

  if (resourceForm) {
    resourceForm.addEventListener('submit', (e) => {
      e.preventDefault();
      saveData('RESOURCE', {
        name: document.getElementById('helper').value,
        type: document.getElementById('resource').value,
        quantity: document.getElementById('quantity').value,
        location: document.getElementById('location').value,
        lat: document.getElementById('lat').value || null,
        lng: document.getElementById('lng').value || null,
        timestamp: new Date().toISOString()
      });
      window.location.href = 'feed.html';
    });
  }

});

function saveData(category, data) {
  let posts = JSON.parse(localStorage.getItem('reliefPosts')) || [];
  data.category = category;
  data.id = Date.now();
  posts.unshift(data);
  localStorage.setItem('reliefPosts', JSON.stringify(posts));
}