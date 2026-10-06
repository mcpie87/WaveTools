const PATCH = new URL(self.location.href).searchParams.get('v') ?? 'unversioned';
const CACHE_PREFIXES = ['wuwa-leaflet-tiles-', 'wuwa-assets-'];
const ASSET_CACHE = `wuwa-assets-${PATCH}`;
const META_DB = 'wuwa-tile-meta';
const MONTH = 30 * 24 * 60 * 60 * 1000;
let dbPromise;

function openDB() {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(META_DB, 1);
      req.onupgradeneeded = () => req.result.createObjectStore('tiles');
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
  return dbPromise;
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

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names
      .filter(name => name !== ASSET_CACHE && CACHE_PREFIXES.some(prefix => name.startsWith(prefix)))
      .map(name => caches.delete(name)));
  })());
});

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = req.url;

  // Only cache images; PMTiles use range requests and are cached in IndexedDB
  if (
    req.method !== 'GET' ||
    !/\.(png|webp)$/.test(new URL(url).pathname) ||
    !url.includes('githubusercontent')
  ) {
    return;
  }

  event.respondWith((async () => {
    const cache = await caches.open(ASSET_CACHE);
    const cached = await cache.match(req);

    if (cached) {
      const ts = await getTs(url);
      if (ts && Date.now() - ts < MONTH) {
        return cached;
      }
    }

    let res;
    try {
      res = await fetch(req);
    } catch (error) {
      if (cached) return cached;
      throw error;
    }
    if (res.ok) {
      await cache.put(req, res.clone());
      await setTs(url);
    }
    return res;
  })());
});
