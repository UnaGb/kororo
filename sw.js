const CACHE = "plantagotchi-v1";
self.addEventListener("install", (e) => { self.skipWaiting(); });
self.addEventListener("activate", (e) => { e.waitUntil(self.clients.claim()); });
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(e.request);
      const net = fetch(e.request).then((res) => { try { cache.put(e.request, res.clone()); } catch {} return res; }).catch(() => cached);
      return cached || net;
    })
  );
});
