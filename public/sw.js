const PATCH = 'wuwa-patch-3.1';
const TILE_CACHE = `wuwa-leaflet-tiles-${PATCH}`;
const META_DB = 'wuwa-tile-meta';
const MONTH = 30 * 24 * 60 * 60 * 1000;

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(META_DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore('tiles');
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function getTs(url) {
  const db = await openDB();
  return new Promise(res => {
    const r = db.transaction('tiles').objectStore('tiles').get(url);
    r.onsuccess = () => res(r.result);
    r.onerror = () => res(null);
  });
}

async function setTs(url) {
  const db = await openDB();
  return new Promise(res => {
    const tx = db.transaction('tiles', 'readwrite');
    tx.objectStore('tiles').put(Date.now(), url);
    tx.oncomplete = () => res();
  });
}

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = req.url;

  // Only cache tiles
  if (
    req.method !== 'GET' ||
    !url.endsWith('.png') ||
    (!url.includes('githubusercontent') && !url.includes('/Game/Aki/UI/'))
  ) {
    return;
  }

  event.respondWith((async () => {
    const cache = await caches.open(TILE_CACHE);
    const cached = await cache.match(req);

    if (cached) {
      const ts = await getTs(url);
      if (ts && Date.now() - ts < MONTH) {
        return cached;
      }
    }

    const res = await fetch(req);
    if (res.ok) {
      await cache.put(req, res.clone());
      await setTs(url);
    }
    return res;
  })());
});