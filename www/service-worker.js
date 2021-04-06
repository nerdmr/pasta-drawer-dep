// Installing service worker
const CACHE_NAME = 'pasta-drawer-v1.0.1';

/* Add relative URL of all the static content you want to store in
 * cache storage (this will help us use our app offline)*/
let resourcesToCache = ['/', '/bundle.js', '/index.html', '/img/192.png', '/img/512.png'];

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

// self.addEventListener("fetch", (event) => {
//   const url = new URL(event.request.url);
  
//   if (event.request.method === "POST" && url.pathname === "/bookmark") {
//     event.respondWith(
//       (async () => {
//         const formData = await event.request.formData();
//         const link = formData.get("link") || "";
        
//         return new Response('Bookmark saved: ' + link);

//         // const responseUrl = await saveBookmark(link);
//         // return Response.redirect(responseUrl, 303);
//       })()
//     );
//   } else {
//     event.respondWith(
//       caches.match(event.request).then((response) => {
//         return response || fetch(event.request);
//       })
//     );
//   }
// });

// Update a service worker
const cacheWhitelist = ['pasta-drawer'];
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
