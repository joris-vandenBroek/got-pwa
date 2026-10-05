const CACHE_NAME = 'got-pwa-v3';

const ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/app.js',
  './data/characters.json',
  './data/world.json',
  './manifest.json',
  './images/icons/icon-192.png',
  './images/icons/icon-512.png',
  // Locaties
  './images/locations/braavos.webp',
  './images/locations/casterly-rock.webp',
  './images/locations/castle-black.webp',
  './images/locations/dragonstone.webp',
  './images/locations/highgarden.webp',
  './images/locations/kings-landing.webp',
  './images/locations/pentos.webp',
  './images/locations/pyke.webp',
  './images/locations/storm-s-end.webp',
  './images/locations/sunspear.webp',
  './images/locations/the-dothraki-sea.webp',
  './images/locations/the-eyrie.webp',
  './images/locations/the-godswood.webp',
  './images/locations/the-wall.webp',
  './images/locations/winterfell.webp',
  // Wezens
  './images/creatures/direwolves.webp',
  './images/creatures/dragons.webp',
  './images/creatures/giants.webp',
  './images/creatures/white-walkers.webp',
  './images/creatures/wights.webp',
  // Organisaties
  './images/organizations/dothraki.webp',
  './images/organizations/faceless-men.svg',
  './images/organizations/kingsguard.svg',
  './images/organizations/lords-of-westeros.webp',
  './images/organizations/maesters.webp',
  './images/organizations/nights-watch.svg',
  './images/organizations/small-council.webp',
  './images/organizations/wildlings.webp',
  // Ontbrekende personages (batch 2)
  './images/characters/benjen-stark.webp',
  './images/characters/renly-baratheon.webp',
  './images/characters/loras-tyrell.webp',
  './images/characters/balon-greyjoy.webp',
  './images/characters/doran-martell.webp',
  './images/characters/lysa-arryn.webp',
  './images/characters/robin-arryn.webp',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
