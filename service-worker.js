const CACHE_NAME = 'got-pwa-v8';

const ASSETS = [
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
  // Ontbrekende personages
  './images/characters/benjen-stark.webp',
  './images/characters/renly-baratheon.webp',
  './images/characters/loras-tyrell.webp',
  './images/characters/balon-greyjoy.webp',
  './images/characters/doran-martell.webp',
  './images/characters/lysa-arryn.webp',
  './images/characters/robin-arryn.webp',
  // HotD data
  './data/hotd-characters.json',
  './data/hotd-world.json',
  // HotD personages
  './images/hotd/characters/viserys-targaryen.webp',
  './images/hotd/characters/rhaenyra-targaryen.webp',
  './images/hotd/characters/daemon-targaryen.webp',
  './images/hotd/characters/alicent-hightower.webp',
  './images/hotd/characters/otto-hightower.webp',
  './images/hotd/characters/corlys-velaryon.webp',
  './images/hotd/characters/rhaenys-targaryen-velaryon.webp',
  './images/hotd/characters/laena-velaryon.webp',
  './images/hotd/characters/laenor-velaryon.webp',
  './images/hotd/characters/aegon-ii-targaryen.webp',
  './images/hotd/characters/aemond-targaryen.webp',
  './images/hotd/characters/helaena-targaryen.webp',
  './images/hotd/characters/criston-cole.webp',
  './images/hotd/characters/harwin-strong.webp',
  './images/hotd/characters/larys-strong.webp',
  './images/hotd/characters/lyonel-strong.webp',
  './images/hotd/characters/mysaria.webp',
  './images/hotd/characters/jacaerys-velaryon.webp',
  './images/hotd/characters/lucerys-velaryon.webp',
  './images/hotd/characters/baela-targaryen.webp',
  './images/hotd/characters/rhaena-targaryen.webp',
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
  const url = new URL(event.request.url);

  // HTML altijd van netwerk (meest recente versie), met cache als fallback
  if (event.request.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname === '/got-pwa/' || url.pathname === '/got-pwa') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Alles overige: cache-first
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true })
      .then(cached => cached || fetch(event.request))
  );
});
