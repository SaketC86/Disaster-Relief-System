const CACHE_NAME = 'reliefsos-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/needhelp.html',
  '/help.html',
  '/feed.html',
  '/map.html',
  '/admin.html',
  '/css/style.css',
  '/js/storage.js',
  '/js/map.js',
  '/js/feed.js',
  '/js/admin.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
