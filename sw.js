// يحدّث نفسه تلقائيًا: الشبكة أولًا، والمخزَّن عند انقطاع الإنترنت فقط.
const CACHE="waqtuk-auto";
const FILES=["./","./index.html","./manifest.json","./icon-192x192.png","./icon-512x512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>Promise.all(FILES.map(f=>c.add(f).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const q=e.request;
  if(q.method!=="GET"||new URL(q.url).origin!==location.origin)return;
  e.respondWith(fetch(q,{cache:"no-cache"}).then(r=>{if(r&&r.ok){const cp=r.clone();caches.open(CACHE).then(c=>c.put(q,cp))}return r}).catch(()=>caches.match(q,{ignoreSearch:true}).then(h=>h||caches.match("./index.html"))));
});
