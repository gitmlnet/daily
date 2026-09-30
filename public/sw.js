const CACHE="hsc-study-tracker-v1";const ASSETS=["./","./index.html","./manifest.webmanifest"];
self.addEventListener("install",event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener("activate",event=>event.waitUntil(self.clients.claim()));
self.addEventListener("fetch",event=>{if(event.request.method!=="GET")return;event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(res=>{if(res.ok&&new URL(event.request.url).origin===self.location.origin){const clone=res.clone();caches.open(CACHE).then(c=>c.put(event.request,clone))}return res}).catch(()=>cached)))});
