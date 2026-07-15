const CACHE_NAME = 'fullmoon-bal-cargo-v2';
const ASSETS_TO_CACHE = [
  'index.html',
  'manifest.json',
  'head.png',
  'bg1.png'
];

// Install Service Worker dan simpan aset penting ke dalam cache lokal
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(ASSETS_TO_CACHE);
        }).then(() => self.skipWaiting())
    );
});

// Bersihkan cache versi lama jika ada pembaruan sistem
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cache) {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Ambil aset dari cache jika offline, atau ambil dari jaringan jika online
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request).catch(() => {
                // Return respon kosong jika benar-benar offline dan request gagal
                return new Response('Koneksi internet diperlukan.');
            });
        })
    );
});
