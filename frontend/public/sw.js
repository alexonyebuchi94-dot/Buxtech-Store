// Minimal service worker — its presence is what makes the browser treat
// this site as "installable". It doesn't cache pages or work offline;
// every request still goes to the network like a normal website.

self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  // Pass every request straight through to the network.
  event.respondWith(fetch(event.request))
})
