// Alamat Arena cache: game page is network-first (always newest), other files cache-first with background refresh.
const C='alamat-arena-v20';
const CORE=['/','/index.html','/manifest.webmanifest','/icons/icon-192.png','/icons/icon-512.png','https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||r.url.endsWith('.apk'))return;
  const page=r.mode==='navigate'||r.destination==='document'||/\/(index\.html)?(\?|$)/.test(new URL(r.url).pathname+new URL(r.url).search);
  if(page){e.respondWith(fetch(r,{cache:'no-store'}).then(res=>{if(res&&res.ok){const cl=res.clone();caches.open(C).then(c=>c.put('/index.html',cl))}return res}).catch(()=>caches.match('/index.html')));return}
  e.respondWith(caches.open(C).then(async c=>{const hit=await c.match(r);
    const net=fetch(r).then(res=>{if(res&&(res.ok||res.type==='opaque'))c.put(r,res.clone());return res}).catch(()=>hit||Response.error());
    return hit||net}))});
