// Installing service worker
const CACHE_NAME = 'pasta-drawer-v1.1.0';

/* Add relative URL of all the static content you want to store in
 * cache storage (this will help us use our app offline)*/
let resourcesToCache = [
    '/',
    '/bundle.js',
    '/index.html',
    '/img/192.png',
    '/img/512.png',
    'https://fonts.gstatic.com/s/materialicons/v83/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2',
    'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400&family=Roboto+Mono:wght@300&family=Roboto:ital,wght@0,100;0,300;1,100;1,300&family=Zen+Antique&display=swap'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(resourcesToCache);
    })
  );
});

// Cache and return requests
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});

// Update a service worker
const cacheWhitelist = [CACHE_NAME];
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
