const CACHE = 'campo-v1';
const ASSETS = [
  '/campo-mariscala/campo_lavalleja.html',
  '/campo-mariscala/manifest.json',
  '/campo-mariscala/icon-192.png',
  '/campo-mariscala/icon-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Firebase siempre va a la red
  if(e.request.url.includes('firebaseio.com') || e.request.url.includes('firebase')){
    e.respondWith(fetch(e.request));
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
