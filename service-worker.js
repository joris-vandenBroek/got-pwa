const CACHE_NAME = 'got-pwa-v9';

// Alleen statische assets die zelden veranderen (afbeeldingen, data, manifest)
// CSS en JS hebben version strings en worden door de browser zelf gecached
const ASSETS = [
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
  // Personages GoT
  './images/characters/benjen-stark.webp',
  './images/characters/renly-baratheon.webp',
  './images/characters/loras-tyrell.webp',
  './images/characters/balon-greyjoy.webp',
  './images/characters/doran-martell.webp',
  './images/characters/lysa-arryn.webp',
  './images/characters/robin-arryn.webp',
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

  // HTML en JSON data: altijd van netwerk (meest recente versie), cache als fallback
  if (event.request.mode === 'navigate' ||
      url.pathname.endsWith('.html') ||
      url.pathname.endsWith('.json') ||
      url.pathname === '/got-pwa/' ||
      url.pathname === '/got-pwa') {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.match(event.request) || caches.match('./index.html')
      )
    );
    return;
  }

  // CSS en JS (hebben version strings): altijd van netwerk
  if (url.pathname.endsWith('.css') || url.pathname.endsWith('.js')) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // Afbeeldingen en overige: cache-first voor offline gebruik
  event.respondWith(
    caches.match(event.request)
      .then(cached => cached || fetch(event.request))
  );
});
