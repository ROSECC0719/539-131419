const CACHE='539-pro-v6.27.12';
const CORE=['./','./index.html'];
self.addEventListener('install',event=>{
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).catch(()=>{}));
});
self.addEventListener('activate',event=>{
  event.waitUntil(Promise.all([
    caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))),
    self.clients.claim()
  ]));
});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  const req=event.request;
  if(req.mode==='navigate' || new URL(req.url).pathname.endsWith('/index.html')){
    event.respondWith(fetch(req,{cache:'no-store'}).then(res=>{
      const copy=res.clone(); caches.open(CACHE).then(c=>c.put('./index.html',copy)).catch(()=>{}); return res;
    }).catch(()=>caches.match('./index.html')));
    return;
  }
  event.respondWith(fetch(req).catch(()=>caches.match(req)));
});
