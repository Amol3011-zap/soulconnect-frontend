/* SoulConnect service worker.
 *
 * Deliberately simple: it does NOT cache the app's JS or CSS, so users can
 * never get stuck on an old version (the problem the previous kill switch
 * worker was cleaning up). Pages always come from the network. The only
 * thing cached is a small offline page, shown when there is no connection.
 */
const CACHE = 'sc-offline-v1';
const OFFLINE_URL = '/offline.html';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll([OFFLINE_URL, '/icon-192.png']))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  // Only page navigations get the offline fallback. Everything else
  // (API calls, scripts, images) goes straight to the network untouched.
  if (req.mode !== 'navigate') return;
  event.respondWith(
    fetch(req).catch(() => caches.match(OFFLINE_URL))
  );
});
