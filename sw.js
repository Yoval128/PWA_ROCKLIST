const CACHE_NAME = 'rocklist-v3';
const RECURSOS = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './manifest.json'
];

// Instalar y guardar recursos en caché
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Archivos en caché correctamente');
            return cache.addAll(RECURSOS);
        })
    );
});

// Interceptar peticiones para que funcione sin conexión
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then(respuesta => {
            return respuesta || fetch(e.request);
        })
    );
});