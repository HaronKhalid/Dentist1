// Cache-first for the hashed static assets under /_a/ (bump VERSION on every deploy).
const VERSION = "v3";
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) =>
  e.waitUntil(
    caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => clients.claim())
  )
);
self.addEventListener("fetch", (e) => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== "GET" || u.origin !== location.origin || !u.pathname.includes("/_a/") || r.headers.has("range") || u.pathname.endsWith(".mp4")) return;
  e.respondWith(
    caches.open(VERSION).then(async (c) => {
      const hit = await c.match(r);
      if (hit) return hit;
      const res = await fetch(r);
      if (res.status === 200) c.put(r, res.clone());
      return res;
    })
  );
});
