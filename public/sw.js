/* HSC Study Tracker offline app shell. Bump VERSION when changing cache behavior. */
const VERSION = "v3";
const CACHE_PREFIX = "hsc-study-tracker-";
const CACHE_NAME = CACHE_PREFIX + VERSION;
const APP_SCOPE = new URL("./", self.registration.scope);

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    const pageResponse = await fetch(APP_SCOPE.href, { cache: "reload" });
    if (!pageResponse.ok) throw new Error("Unable to load the app shell");
    await cache.put(APP_SCOPE.href, pageResponse.clone());

    const html = await pageResponse.clone().text();
    const candidates = [
      "manifest.webmanifest",
      "icon-192.svg",
      "icon-512.svg",\n      "icon-192.png",\n      "icon-512.png",
      ...Array.from(html.matchAll(/(?:src|href)=["']([^"']+\.(?:js|css)(?:\?[^"']*)?)["']/g), match => match[1])
    ];
    const urls = [...new Set(candidates.map(path => new URL(path, APP_SCOPE).href))]
      .filter(url => new URL(url).origin === self.location.origin && url.startsWith(APP_SCOPE.href));
    await Promise.allSettled(urls.map(async url => {
      const response = await fetch(url, { cache: "reload" });
      if (response.ok) await cache.put(url, response);
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("message", event => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !url.href.startsWith(APP_SCOPE.href)) return;

  if (request.mode === "navigate") {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      try {
        const response = await fetch(request);
        if (response.ok) await cache.put(APP_SCOPE.href, response.clone());
        return response;
      } catch {
        return (await cache.match(APP_SCOPE.href)) || new Response("You are offline. Reconnect to open the Study Tracker.", {
          status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" }
        });
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response.ok) await cache.put(request, response.clone());
      return response;
    } catch {
      return new Response("", { status: 504, statusText: "Offline resource unavailable" });
    }
  })());
});
