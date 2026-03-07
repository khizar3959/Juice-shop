const CACHE_NAME = 'juicedash-cache-v1';
const ASSETS = [
    './',
    './index.html',
    './app.js',
    './manifest.json',
    './icons/icon.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) return response; 
        
        const fetchRequest = event.request.clone();
        return fetch(fetchRequest).then(
          response => {
            if(!response || (response.status !== 200 && response.type !== 'opaque')) {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                if (event.request.url.startsWith('http')) {
                    cache.put(event.request, responseToCache);
                }
              });
            return response;
          }
        ).catch(err => {
            console.log('Fetch error. User might be offline.', err);
        });
      })
  );
});
