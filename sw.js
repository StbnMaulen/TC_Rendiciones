/* Mis Boletas — Service Worker
   VERSION debe coincidir con APP_VERSION en index.html. */
const VERSION = 'mb-v2.1.0';
const SHELL = 'shell-' + VERSION;
const RUNTIME = 'runtime-' + VERSION;

const SHELL_FILES = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/maskable-192.png',
  './icons/maskable-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png',
  // sin esto, el primer arranque sin conexión se vería con la fuente del sistema
  './fonts/ChakraPetch-Medium.woff2',
  './fonts/ChakraPetch-SemiBold.woff2',
  './fonts/ChakraPetch-Bold.woff2',
  './fonts/ShareTechMono-Regular.woff2'
];

/* Sin skipWaiting(): el service worker nuevo espera. La app muestra la barra
   "Hay una versión nueva" y solo cuando el usuario la toca se activa y recarga.
   Antes se activaba solo y podía recargar la página en medio de un formulario. */
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(SHELL).then(c => c.addAll(SHELL_FILES))
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== SHELL && k !== RUNTIME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== location.origin) return;   // la app no usa recursos de terceros

  // Navegación: red primero, cache como respaldo (así ves la versión nueva al toque).
  // Solo se cachea una respuesta buena: antes un 404 de Pages quedaba guardado como la app.
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then(res => {
          if (res && res.ok && res.type === 'basic') {
            const copy = res.clone();
            caches.open(SHELL).then(c => c.put('./index.html', copy));
          }
          return res;
        })
        .catch(() => caches.match('./index.html').then(r => r || caches.match('./')))
    );
    return;
  }

  // Resto del mismo origen: cache primero
  e.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(res => {
      if (res && res.ok && res.type === 'basic') {
        const copy = res.clone();
        caches.open(RUNTIME).then(c => c.put(req, copy));
      }
      return res;
    }))
  );
});

self.addEventListener('message', e => {
  if (e.data === 'skipWaiting') self.skipWaiting();
});
