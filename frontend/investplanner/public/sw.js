// Spendly Service Worker
const CACHE_VERSION = 'spendly-v1.0.0';
const STATIC_CACHE_NAME = `spendly-static-${CACHE_VERSION}`;
const RUNTIME_CACHE_NAME = `spendly-runtime-${CACHE_VERSION}`;

// Critical assets to pre-cache immediately for offline shell
const PRECACHE_ASSETS = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/favicon.ico',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/icon-maskable-512x512.png',
  '/icons/apple-touch-icon.png',
  '/icons/icon.svg',
];

// 1. INSTALL: Pre-cache App Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE_NAME)
      .then((cache) => {
        return cache.addAll(PRECACHE_ASSETS).catch((err) => {
          console.warn('[SW] Pre-caching partial failure:', err);
        });
      })
      .then(() => self.skipWaiting())
  );
});

// 2. ACTIVATE: Purge stale versions and take immediate control
self.addEventListener('activate', (event) => {
  const currentCaches = [STATIC_CACHE_NAME, RUNTIME_CACHE_NAME];
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!currentCaches.includes(cacheName)) {
              console.log(`[SW] Purging obsolete cache: ${cacheName}`);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// 3. FETCH: Smart Strategy Router
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // A. Guard clause: Ignore non-HTTP(S) protocols (like chrome-extension://)
  if (!url.protocol.startsWith('http')) return;

  // B. Guard clause: Never cache write/mutation operations (POST, PUT, DELETE, PATCH)
  if (request.method !== 'GET') return;

  // C. Strategy 1: Network-First for Navigation (HTML page loads)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(RUNTIME_CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(async () => {
          // Offline fallback: try cache, then return dedicated offline page
          const cachedResponse = await caches.match(request);
          if (cachedResponse) return cachedResponse;
          return caches.match('/offline.html');
        })
    );
    return;
  }

  // D. Strategy 2: Stale-While-Revalidate for Static Assets (Next.js bundles, CSS, JS, Images, Fonts)
  const isStaticAsset =
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname.match(/\.(css|js|png|jpg|jpeg|svg|webp|woff2?|ico)$/);

  if (isStaticAsset) {
    event.respondWith(
      caches.open(STATIC_CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(request);

        // Fetch fresh copy in the background
        const networkFetch = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => cachedResponse); // Gracefully return cached if network fails

        // Return cached version immediately if available, else await network
        return cachedResponse || networkFetch;
      })
    );
    return;
  }

  // E. Strategy 3: Network with Cache Fallback for general GET requests
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (!response || response.status !== 200) return response;
        const responseClone = response.clone();
        caches.open(RUNTIME_CACHE_NAME).then((cache) => {
          cache.put(request, responseClone);
        });
        return response;
      })
      .catch(() => caches.match(request))
  );
});
