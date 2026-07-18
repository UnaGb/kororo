const CACHE = "kororo-v2";

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

// Réseau d'abord : on récupère toujours la dernière version en ligne,
// le cache ne sert que de secours hors-ligne.
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      const net = await fetch(e.request);
      try { cache.put(e.request, net.clone()); } catch {}
      return net;
    } catch {
      const cached = await cache.match(e.request);
      return cached || Response.error();
    }
  })());
});
