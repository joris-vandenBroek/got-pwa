let allHouses = [];
let worldData = {};
let timelineData = [];
let familyTreeData = [];
let gotWorldData = {}; // GoT world data altijd in geheugen voor draken-gecombineerde weergave
let activeTab = 'houses';
let currentShow = 'got'; // 'got' of 'hotd'
let currentLang = localStorage.getItem('lang') || 'nl';

// Zet class op basis van echte schermgrootte — werkt ook in Chrome desktopmodus
if (Math.min(screen.width, screen.height) < 600) {
  document.documentElement.classList.add('small-screen');
}

// === I18N ===
const I18N = {
  nl: {
    houses: 'Huizen',
    locations: 'Locaties',
    creatures: 'Wezens',
    organizations: 'Organisaties',
    glossary: 'Woordenlijst',
    seasons: 'Seizoenen',
    timeline: 'Tijdlijn',
    familytree: 'Stamboom',
    searchPlaceholder: 'Zoek personages, locaties, termen...',
    searchLabel: 'Zoeken',
    showSelectorLabel: 'Kies serie',
    langToggle: '&#127468;&#127463; EN',
    backBtn: '← Terug',
    backBtnLabel: 'Terug naar huizen',
    characters: 'personages',
    playedBy: 'Gespeeld door:',
    playedBySearch: 'Gespeeld door',
    dragons: 'Draken',
    otherCreatures: 'Overige wezens',
    season: 'Seizoen',
    episodes: 'afleveringen',
    spoilerLabels: {
      laag:    '&#128994; Lage spoilergraad',
      middel:  '&#128993; Gemiddelde spoilergraad',
      hoog:    '&#128308; Hoge spoilergraad',
      maximum: '&#128308; Maximale spoilergraad — alleen lezen na volledig kijken'
    },
    spoilerNotice: '⚠ De seizoensamenvattingen bevatten spoilers. Open ze pas nadat je dat seizoen hebt gekeken.',
    searchResultsHeading: 'Zoekresultaten',
    noResults: 'Geen resultaten gevonden voor deze zoekopdracht.',
    searchTypeCharacter: 'Personage',
    searchTypeLocation: 'Locatie',
    searchTypeCreature: 'Wezen',
    searchTypeOrganization: 'Organisatie',
    searchTypeTerm: 'Term',
    noFamilyTree: 'Geen stamboom beschikbaar voor deze serie.',
    familySelectorLabel: 'Kies een familie:',
    allEvents: 'Alle events',
    mapTitle: 'Kaart van de Bekende Wereld',
    mapAriaLabel: 'Kaart van Westeros en Essos',
    mapNarrowSea: 'Smalle',
    mapNarrowSeaLine2: 'Zee',
    mapDothrakiSea: 'Dothraki Zee',
    mapFreeCities: 'Vrije Steden',
    mapRegionNorth: 'Het Noorden',
    mapRegionRiverlands: 'Rivierland',
    mapRegionWesterlands: 'Westerlanden',
    mapRegionVale: 'Het Dal',
    mapRegionCrownlands: 'Kroonland',
    mapRegionStormlands: 'Stormgronden',
    mapRegionReach: 'Het Bereik',
    mapRegionDorne: 'Dorne',
    mapPinDothrakiSea: 'Dothraki Zee',
    mapLegendPin: 'Locatie (klik om te bekijken)',
    mapLegendWall: 'The Wall',
    mapLegendRiver: 'Rivier',
    mapExtLink: 'Interactieve kaart',
    loadError: 'Fout bij laden van data. Probeer de pagina te herladen.',
    donateText: 'Vond je dit leuk? Koop me een koffie'
  },
  en: {
    houses: 'Houses',
    locations: 'Locations',
    creatures: 'Creatures',
    organizations: 'Organizations',
    glossary: 'Glossary',
    seasons: 'Seasons',
    timeline: 'Timeline',
    familytree: 'Family Tree',
    searchPlaceholder: 'Search characters, locations, terms...',
    searchLabel: 'Search',
    showSelectorLabel: 'Choose series',
    langToggle: '&#127475;&#127473; NL',
    backBtn: '← Back',
    backBtnLabel: 'Back to houses',
    characters: 'characters',
    playedBy: 'Played by:',
    playedBySearch: 'Played by',
    dragons: 'Dragons',
    otherCreatures: 'Other creatures',
    season: 'Season',
    episodes: 'episodes',
    spoilerLabels: {
      laag:    '&#128994; Low spoiler level',
      middel:  '&#128993; Moderate spoiler level',
      hoog:    '&#128308; High spoiler level',
      maximum: '&#128308; Maximum spoiler level — read only after watching fully'
    },
    spoilerNotice: '⚠ Season summaries contain spoilers. Only open them after watching that season.',
    searchResultsHeading: 'Search Results',
    noResults: 'No results found for this search.',
    searchTypeCharacter: 'Character',
    searchTypeLocation: 'Location',
    searchTypeCreature: 'Creature',
    searchTypeOrganization: 'Organization',
    searchTypeTerm: 'Term',
    noFamilyTree: 'No family tree available for this series.',
    familySelectorLabel: 'Choose a family:',
    allEvents: 'All events',
    mapTitle: 'Map of the Known World',
    mapAriaLabel: 'Map of Westeros and Essos',
    mapNarrowSea: 'Narrow',
    mapNarrowSeaLine2: 'Sea',
    mapDothrakiSea: 'Dothraki Sea',
    mapFreeCities: 'Free Cities',
    mapRegionNorth: 'The North',
    mapRegionRiverlands: 'Riverlands',
    mapRegionWesterlands: 'Westerlands',
    mapRegionVale: 'The Vale',
    mapRegionCrownlands: 'Crownlands',
    mapRegionStormlands: 'Stormlands',
    mapRegionReach: 'The Reach',
    mapRegionDorne: 'Dorne',
    mapPinDothrakiSea: 'Dothraki Sea',
    mapLegendPin: 'Location (click to view)',
    mapLegendWall: 'The Wall',
    mapLegendRiver: 'River',
    mapExtLink: 'Interactive map',
    loadError: 'Error loading data. Please reload the page.',
    donateText: 'Enjoyed this? Buy me a coffee'
  }
};

// IMDB name IDs per acteur → directe profielpagina
const IMDB_IDS = {
  'Sean Bean':              'nm0000293',
  'Michelle Fairley':       'nm0265610',
  'Richard Madden':         'nm0534635',
  'Sophie Turner':          'nm3849842',
  'Maisie Williams':        'nm3586035',
  'Isaac Hempstead Wright': 'nm3652842',
  'Kit Harington':          'nm3229685',
  'Joseph Mawle':           'nm1152798',
  'Charles Dance':          'nm0001097',
  'Lena Headey':            'nm0372176',
  'Nikolaj Coster-Waldau':  'nm0182666',
  'Peter Dinklage':         'nm0227759',
  'Jack Gleeson':           'nm0322416',
  'Emilia Clarke':          'nm3592338',
  'Harry Lloyd':            'nm0516003',
  'Jason Momoa':            'nm0597388',
  'Iain Glen':              'nm0322513',
  'Mark Addy':              'nm0004692',
  'Stephen Dillane':        'nm0226820',
  'Gethin Anthony':         'nm2167445',
  'Natalie Dormer':         'nm1754059',
  'Diana Rigg':             'nm0001671',
  'Finn Jones':             'nm3645691',
  'Alfie Allen':            'nm0654295',
  'Patrick Malahide':       'nm0538869',
  'Gemma Whelan':           'nm2247629',
  'Pedro Pascal':           'nm0050959',
  'Alexander Siddig':       'nm0796502',
  'Indira Varma':           'nm0890055',
  'Kate Dickie':            'nm0225483',
  'Lino Facioli':           'nm2996220',
  'James Cosmo':            'nm0181920',
  'John Bradley':           'nm4263213',
  'Aidan Gillen':           'nm0318821',
  'Conleth Hill':           'nm0384152',
  // House of the Dragon
  'Paddy Considine':        'nm0175916',
  'Emma D\'Arcy':           'nm8458664',
  'Matt Smith':             'nm1741002',
  'Olivia Cooke':           'nm4972453',
  'Rhys Ifans':             'nm0406975',
  'Steve Toussaint':        'nm0869750',
  'Eve Best':               'nm0078925',
  'Fabien Frankel':         'nm8844328',
  'Tom Glynn-Carney':       'nm6077951',
  'Ewan Mitchell':          'nm7359071',
  'Phia Saban':             'nm11064417',
  'Ryan Corr':              'nm1507708',
  'Matthew Needham':        'nm2765916',
  'Gavin Spokes':           'nm2418667',
  'Sonoya Mizuno':          'nm4420495',
  'Harry Collett':          'nm6708646',
  'Elliot Grihault':        'nm14083364',
  'Bethany Antonia':        'nm8565845',
  'Phoebe Campbell':        'nm8666310',
  'John Macmillan':         'nm3025293',
  'Savannah Steyn':         'nm8449814',
  'Milly Alcock':           'nm6854116',
  'Emily Carey':            'nm6917958',
};

function actorImdbUrl(actorName) {
  const id = IMDB_IDS[actorName];
  return id
    ? `https://www.imdb.com/name/${id}/`
    : `https://www.imdb.com/find/?q=${encodeURIComponent(actorName)}&s=nm`;
}

// === Taalwisselaar ===
function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  // Wis taalafhankelijke cache
  timelineData = [];
  familyTreeData = [];
  gotWorldData = {};
  // Herlaad data zonder tab te resetten
  loadData(currentShow, false);
}

// === UI-labels bijwerken (statische HTML-elementen) ===
function updateUILabels() {
  const t = I18N[currentLang];

  // HTML lang-attribuut
  document.documentElement.setAttribute('lang', currentLang);

  // Navigatietabs
  document.querySelectorAll('.nav-tab').forEach(tab => {
    const key = tab.dataset.tab;
    if (t[key]) tab.textContent = t[key];
  });

  // Zoekveld
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.placeholder = t.searchPlaceholder;
    searchInput.setAttribute('aria-label', t.searchLabel);
  }

  // Lang-toggle knop
  const langBtn = document.getElementById('lang-toggle');
  if (langBtn) langBtn.innerHTML = t.langToggle;

  // Show-selector aria-label
  const showSelector = document.querySelector('.show-selector');
  if (showSelector) showSelector.setAttribute('aria-label', t.showSelectorLabel);

  // Terug-knop
  const backBtn = document.getElementById('back-btn');
  if (backBtn) {
    backBtn.innerHTML = t.backBtn;
    backBtn.setAttribute('aria-label', t.backBtnLabel);
  }

  // Spoiler-notice
  const spoilerNotice = document.querySelector('.spoiler-notice');
  if (spoilerNotice) spoilerNotice.textContent = t.spoilerNotice;

  // Zoekresultaten-heading
  const searchHeading = document.querySelector('#search-view .section-heading');
  if (searchHeading) searchHeading.textContent = t.searchResultsHeading;

  // Familie-selector label
  const familyLabel = document.querySelector('.family-selector-label');
  if (familyLabel) familyLabel.textContent = t.familySelectorLabel;

  // Tijdlijn alle-events knop
  const allEventsBtn = document.querySelector('.tl-filter-btn[data-filter="all"]');
  if (allEventsBtn) allEventsBtn.textContent = t.allEvents;

  // Doneer-tekst
  const donateText = document.getElementById('donate-text');
  if (donateText) donateText.textContent = t.donateText;
}

// === Huidige tab opnieuw renderen ===
function renderCurrentTab() {
  switch (activeTab) {
    case 'houses':        renderHouses(); break;
    case 'locations':     renderLocations(); break;
    case 'creatures':     renderCreatures(); break;
    case 'organizations': renderOrganizations(); break;
    case 'glossary':      renderGlossary(); break;
    case 'seasons':       renderSeasons(); break;
    case 'timeline':      renderTimeline(); break;
    case 'familytree':    renderFamilyTree(); break;
    default:              renderHouses();
  }
}

// === Data laden ===
async function loadData(show, resetToHouses = true) {
  show = show || currentShow;
  currentShow = show;
  const suf = currentLang === 'en' ? '-en' : '';
  const charFile  = show === 'hotd' ? `data/hotd-characters${suf}.json` : `data/characters${suf}.json`;
  const worldFile = show === 'hotd' ? `data/hotd-world${suf}.json`      : `data/world${suf}.json`;
  try {
    const fetches = [fetch(charFile), fetch(worldFile)];
    const needTimeline    = !timelineData.length;
    const needFamilyTrees = !familyTreeData.length;
    const needGotWorld    = !Object.keys(gotWorldData).length && show === 'hotd';

    if (needTimeline)    fetches.push(fetch(`data/timeline${suf}.json`));
    if (needFamilyTrees) fetches.push(fetch(`data/family-trees${suf}.json`));
    if (needGotWorld)    fetches.push(fetch(`data/world${suf}.json`));

    const results = await Promise.all(fetches);
    const charData = await results[0].json();
    worldData = await results[1].json();
    allHouses = charData.houses;

    // Als GoT-show actief is, IS worldData de GoT-world — zet gotWorldData direct
    if (show === 'got') gotWorldData = worldData;

    let idx = 2;
    if (needTimeline)    { const d = await results[idx++].json(); timelineData = d.events || []; }
    if (needFamilyTrees) { const d = await results[idx++].json(); familyTreeData = d.families || []; }
    if (needGotWorld)    { gotWorldData = await results[idx].json(); }

    // Pas thema-kleur aan op de actieve show
    document.documentElement.dataset.show = show;

    // Labels bijwerken en tab renderen
    updateUILabels();

    if (resetToHouses) {
      activeTab = 'houses';
      setActiveTab('houses');
      renderHouses();
    } else {
      renderCurrentTab();
    }
  } catch (e) {
    const t = I18N[currentLang];
    document.getElementById('houses-grid').innerHTML =
      `<p class="no-results">${t.loadError}</p>`;
    showView('houses-view');
  }
}

// === Views wisselen ===
function showView(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// === Navigatietabbladen ===
document.querySelectorAll('.nav-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.nav-tab').forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    activeTab = tab.dataset.tab;
    document.getElementById('search-input').value = '';

    switch (activeTab) {
      case 'houses':        renderHouses(); break;
      case 'locations':     renderLocations(); break;
      case 'creatures':     renderCreatures(); break;
      case 'organizations': renderOrganizations(); break;
      case 'glossary':      renderGlossary(); break;
      case 'seasons':       renderSeasons(); break;
      case 'timeline':      renderTimeline(); break;
      case 'familytree':    renderFamilyTree(); break;
    }
  });
});

// === Huizenoverzicht ===
function renderHouses() {
  const t = I18N[currentLang];
  const grid = document.getElementById('houses-grid');
  grid.innerHTML = '';
  allHouses.forEach(house => {
    const card = document.createElement('div');
    card.className = 'house-card';
    card.style.setProperty('--house-color', house.color);
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.innerHTML = `
      <h3>${house.name}</h3>
      <p class="sigil">${house.sigil}</p>
      <p class="house-motto">"${house.motto}"</p>
      <p class="count">${house.characters.length} ${t.characters}</p>
    `;
    card.addEventListener('click', () => showHouse(house));
    card.addEventListener('keydown', e => { if (e.key === 'Enter') showHouse(house); });
    grid.appendChild(card);
  });
  showView('houses-view');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// === Personageoverzicht van een huis ===
function showHouse(house) {
  const title = document.getElementById('house-title');
  title.textContent = house.name;
  title.style.color = house.color;
  document.getElementById('house-motto').textContent = `"${house.motto}"`;

  const grid = document.getElementById('characters-grid');
  grid.innerHTML = '';
  house.characters.forEach(char => {
    grid.appendChild(buildCharacterCard(char, house.color));
  });
  showView('house-view');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// === Personagekaart bouwen ===
function buildCharacterCard(char, houseColor) {
  const t = I18N[currentLang];
  const card = document.createElement('div');
  card.className = 'character-card';
  card.id = `char-${char.id}`;
  card.style.setProperty('--house-color', houseColor || '#CFB53B');

  const img = document.createElement('img');
  img.src = char.image;
  img.alt = char.name;
  img.loading = 'lazy';
  img.onerror = () => { img.src = 'images/characters/placeholder.jpg'; img.onerror = null; };

  const body = document.createElement('div');
  body.className = 'card-body';
  const actorLine = char.actor
    ? `<p class="actor-badge">${t.playedBy} <a class="actor-link" href="${actorImdbUrl(char.actor)}" target="_blank" rel="noopener noreferrer">${char.actor}</a></p>`
    : '';
  body.innerHTML = `<h3>${char.name}</h3>${actorLine}<p class="description">${char.description}</p>`;

  card.appendChild(img);
  card.appendChild(body);

  const rels = buildRelationships(char.relationships || []);
  if (rels) card.appendChild(rels);

  return card;
}

// === Relatie-chips bouwen ===
function buildRelationships(relationships) {
  if (relationships.length === 0) return null;
  const container = document.createElement('div');
  container.className = 'relationships';

  relationships.forEach(rel => {
    const target = findCharacter(rel.id);
    if (!target) return;

    const chip = document.createElement('div');
    chip.className = 'rel-chip';
    chip.title = `${rel.label}: ${target.char.name}`;

    const relImg = document.createElement('img');
    relImg.src = target.char.image;
    relImg.alt = target.char.name;
    relImg.onerror = () => { relImg.src = 'images/characters/placeholder.jpg'; relImg.onerror = null; };

    const info = document.createElement('span');
    info.className = 'rel-info';
    info.innerHTML = `<span class="rel-name">${target.char.name}</span><span class="rel-label">${rel.label}</span>`;

    chip.appendChild(relImg);
    chip.appendChild(info);
    chip.addEventListener('click', () => navigateToCharacter(target.char, target.house));
    container.appendChild(chip);
  });

  return container.children.length > 0 ? container : null;
}

// === Zoek een personage op ID ===
function findCharacter(id) {
  for (const house of allHouses) {
    const char = house.characters.find(c => c.id === id);
    if (char) return { char, house };
  }
  return null;
}

// === Navigeer naar een specifiek personage ===
function navigateToCharacter(char, house) {
  setActiveTab('houses');
  showHouse(house);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const el = document.getElementById(`char-${char.id}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });
}

function setActiveTab(tabId) {
  document.querySelectorAll('.nav-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.tab === tabId);
    t.setAttribute('aria-selected', t.dataset.tab === tabId ? 'true' : 'false');
  });
  activeTab = tabId;
}

// === Info-kaart bouwen met optionele afbeelding ===
function buildInfoCard(item, { meta, body, tag } = {}) {
  const card = document.createElement('div');
  card.className = 'info-card';
  card.id = `info-${item.id || ''}`;

  if (item.image) {
    const isSvg = item.image.endsWith('.svg');
    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.name;
    img.loading = 'lazy';
    img.className = 'info-card-img' + (isSvg ? ' is-svg' : '');
    img.onerror = () => { img.style.display = 'none'; img.onerror = null; };
    card.appendChild(img);
  }

  const bodyEl = document.createElement('div');
  bodyEl.className = 'info-card-body';
  bodyEl.innerHTML = `
    <h3>${item.name}</h3>
    ${meta ? `<p class="info-meta">${meta}</p>` : ''}
    <p>${body || item.description || ''}</p>
    ${tag ? `<span class="info-tag">${tag}</span>` : ''}
  `;
  card.appendChild(bodyEl);
  return card;
}

// === Westeros kaart ===
function buildWesterosMap(locations) {
  const t = I18N[currentLang];
  const container = document.createElement('div');
  container.className = 'map-container';
  container.innerHTML = `
    <div class="map-header">
      <h2>${t.mapTitle}</h2>
      <a href="https://quartermaester.info" target="_blank" rel="noopener noreferrer" class="map-ext-link">🗺 ${t.mapExtLink} ↗</a>
    </div>`;

  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', '0 0 500 680');
  svg.setAttribute('class', 'westeros-map');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', t.mapAriaLabel);

  // Teardrop pin path: tip at (cx,cy), head at (cx,cy-12), total height 19px
  const P = (cx, cy) =>
    `M${cx},${cy} C${cx-7},${cy-4} ${cx-8},${cy-12} ${cx},${cy-19} C${cx+8},${cy-12} ${cx+7},${cy-4} ${cx},${cy}Z`;
  const mkPin = (cx, cy, id, extraStyle = '') =>
    `<path d="${P(cx,cy)}" class="map-pin" data-loc="${id}"${extraStyle ? ` style="${extraStyle}"` : ''} stroke="rgba(0,0,0,0.35)" stroke-width="0.7"/>` +
    `<circle cx="${cx}" cy="${cy-12}" r="2.6" fill="rgba(255,255,255,0.45)" pointer-events="none"/>`;

  svg.innerHTML = `
    <defs>
      <radialGradient id="vigG" cx="50%" cy="50%" r="68%">
        <stop offset="52%" stop-color="transparent"/>
        <stop offset="100%" stop-color="rgba(0,0,0,0.26)"/>
      </radialGradient>
    </defs>

    <!-- Zee achtergrond -->
    <rect width="500" height="680" class="map-sea"/>

    <!-- Decoratief frame -->
    <rect x="5" y="5" width="490" height="670" rx="3" fill="none" stroke="#3a2e1e" stroke-width="1.5"/>
    <rect x="8" y="8" width="484" height="664" rx="2" fill="none" stroke="#5a4a2a" stroke-width="0.5" stroke-dasharray="3,2"/>
    <text x="11" y="20" font-size="10" fill="#5a4a2a" opacity="0.55">✦</text>
    <text x="489" y="20" font-size="10" fill="#5a4a2a" opacity="0.55" text-anchor="end">✦</text>
    <text x="11" y="676" font-size="10" fill="#5a4a2a" opacity="0.55">✦</text>
    <text x="489" y="676" font-size="10" fill="#5a4a2a" opacity="0.55" text-anchor="end">✦</text>

    <!-- Lands of Always Winter -->
    <polygon points="85,10 230,10 240,50 220,68 182,79 132,74 97,59" class="map-ice"/>
    <text x="162" y="42" class="map-label" fill="#6a8aa8" font-size="5.5">Lands of Always Winter</text>

    <!-- The Wall -->
    <line x1="97" y1="90" x2="215" y2="90" stroke="#4a7a9b" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="5,3"/>
    <text x="156" y="84" class="map-label" fill="#5a8aab" font-size="6.5" font-weight="600">The Wall</text>

    <!-- === WESTEROS REGIO'S === -->
    <!-- Het Noorden -->
    <polygon points="97,90 215,90 226,138 210,182 175,212 140,217 104,195 88,154 83,116" class="map-region north"/>
    <text x="155" y="152" class="map-region-label">${t.mapRegionNorth}</text>

    <!-- IJzeren Eilanden -->
    <ellipse cx="58" cy="218" rx="14" ry="8" class="map-region iron-islands"/>
    <ellipse cx="47" cy="229" rx="9" ry="5" class="map-region iron-islands"/>
    <ellipse cx="66" cy="231" rx="10" ry="5" class="map-region iron-islands"/>
    <text x="60" y="221" class="map-label" font-size="5.5">IJz. Eilanden</text>

    <!-- Rivierland -->
    <polygon points="88,195 140,217 175,212 210,182 225,222 216,266 186,287 154,291 118,274 88,249 79,224" class="map-region riverlands"/>
    <text x="146" y="244" class="map-region-label">${t.mapRegionRiverlands}</text>

    <!-- Westerland -->
    <polygon points="79,224 88,249 85,296 69,322 58,292 62,256" class="map-region westerlands"/>
    <text x="68" y="279" class="map-region-label" font-size="5.5">${t.mapRegionWesterlands}</text>

    <!-- Het Dal -->
    <polygon points="212,180 225,138 266,129 280,160 270,212 245,226 225,222" class="map-region vale"/>
    <text x="248" y="180" class="map-region-label">${t.mapRegionVale}</text>

    <!-- Kroonland -->
    <polygon points="186,287 216,266 225,222 245,226 260,260 255,295 234,316 204,316 186,299" class="map-region crownlands"/>
    <text x="224" y="278" class="map-region-label">${t.mapRegionCrownlands}</text>

    <!-- Stormgronden -->
    <polygon points="204,316 234,316 255,295 270,311 265,355 244,375 213,370 199,345" class="map-region stormlands"/>
    <text x="233" y="346" class="map-region-label">${t.mapRegionStormlands}</text>

    <!-- Het Bereik -->
    <polygon points="84,296 118,274 154,291 186,299 185,340 164,376 134,390 104,380 77,354 73,320" class="map-region reach"/>
    <text x="128" y="344" class="map-region-label">${t.mapRegionReach}</text>

    <!-- Dorne -->
    <polygon points="77,354 104,380 134,390 164,376 200,382 213,370 214,413 180,443 140,447 100,431 73,398" class="map-region dorne"/>
    <text x="146" y="414" class="map-region-label">${t.mapRegionDorne}</text>

    <!-- Dragonstone -->
    <ellipse cx="279" cy="306" rx="14" ry="8" fill="#1e1e2a" stroke="#3a3a5a" stroke-width="0.8"/>

    <!-- === RIVIEREN === -->
    <path d="M140,217 Q148,238 155,260 Q160,275 168,287" class="map-river"/>
    <path d="M175,212 Q168,234 162,254 Q160,268 168,287" class="map-river"/>
    <path d="M104,380 Q116,364 130,350 Q136,338 118,315 Q102,298 84,296" class="map-river"/>
    <path d="M186,299 Q205,304 220,308" class="map-river" style="stroke-width:1.6;opacity:0.5"/>

    <!-- === BERGEN === -->
    <text x="260" y="150" class="map-mountain-mark" font-size="8" text-anchor="middle">⛰</text>
    <text x="270" y="160" class="map-mountain-mark" font-size="7" text-anchor="middle">⛰</text>
    <text x="148" y="377" class="map-mountain-mark" font-size="7">⛰</text>
    <text x="160" y="372" class="map-mountain-mark" font-size="8">⛰</text>
    <text x="174" y="377" class="map-mountain-mark" font-size="7">⛰</text>
    <text x="156" y="232" class="map-label" font-size="5.5" fill="#5a7a4a" opacity="0.65" font-style="italic">~ The Neck ~</text>

    <!-- === ESSOS === -->
    <polygon points="328,60 436,60 470,103 482,162 462,222 440,262 420,292 360,300 330,260 323,200 317,140 312,100" class="map-region essos"/>
    <polygon points="360,182 444,162 482,204 480,280 440,262 420,292 360,300 338,260 330,222" class="map-region dothraki"/>
    <text x="416" y="240" class="map-region-label">${t.mapDothrakiSea}</text>
    <text x="375" y="138" class="map-region-label">${t.mapFreeCities}</text>

    <!-- Smalle Zee -->
    <text x="290" y="200" class="map-label" fill="#2a5a8a" font-size="7">${t.mapNarrowSea}</text>
    <text x="290" y="210" class="map-label" fill="#2a5a8a" font-size="7">${t.mapNarrowSeaLine2}</text>

    <!-- === PINS === -->
    ${mkPin(220, 305, 'kings-landing')}
    <text x="220" y="281" class="map-pin-label" pointer-events="none">King's Landing</text>

    ${mkPin(158, 160, 'winterfell')}
    <text x="158" y="136" class="map-pin-label" pointer-events="none">Winterfell</text>

    <circle cx="155" cy="91" r="4" class="map-pin" data-loc="the-wall" fill="#4a9abf" stroke="rgba(0,0,0,0.3)" stroke-width="0.7"/>
    <circle cx="148" cy="91" r="3" class="map-pin" data-loc="castle-black" fill="#8a8a8a" stroke="rgba(0,0,0,0.3)" stroke-width="0.7"/>
    <text x="152" y="98" class="map-label" font-size="5.5" fill="#6a8aaa">Castle Black</text>

    ${mkPin(72, 285, 'casterly-rock')}
    <text x="72" y="261" class="map-pin-label" pointer-events="none">Casterly Rock</text>

    ${mkPin(279, 306, 'dragonstone', 'fill:#8a5abf')}
    <text x="279" y="282" class="map-pin-label" pointer-events="none">Dragonstone</text>

    ${mkPin(252, 185, 'the-eyrie')}
    <text x="252" y="161" class="map-pin-label" pointer-events="none">The Eyrie</text>

    ${mkPin(245, 360, 'storm-s-end')}
    <text x="245" y="336" class="map-pin-label" pointer-events="none">Storm's End</text>

    ${mkPin(130, 360, 'highgarden')}
    <text x="130" y="336" class="map-pin-label" pointer-events="none">Highgarden</text>

    ${mkPin(57, 222, 'pyke')}
    <text x="57" y="198" class="map-pin-label" pointer-events="none">Pyke</text>

    ${mkPin(178, 430, 'sunspear')}
    <text x="178" y="406" class="map-pin-label" pointer-events="none">Sunspear</text>

    ${mkPin(344, 80, 'braavos')}
    <text x="344" y="56" class="map-pin-label" pointer-events="none">Braavos</text>

    ${mkPin(325, 130, 'pentos')}
    <text x="325" y="106" class="map-pin-label" pointer-events="none">Pentos</text>

    <circle cx="420" cy="222" r="4" class="map-pin" data-loc="the-dothraki-sea" stroke="rgba(0,0,0,0.3)" stroke-width="0.7"/>
    <text x="420" y="212" class="map-pin-label" pointer-events="none">${t.mapPinDothrakiSea}</text>

    <!-- Vignette overlay -->
    <rect width="500" height="680" fill="url(#vigG)" pointer-events="none"/>

    <!-- === KOMPASROOS === -->
    <g transform="translate(456,618)" pointer-events="none">
      <circle r="20" class="map-compass-bg" stroke="#4a3820" stroke-width="0.8"/>
      <circle r="16" fill="none" stroke="#3a2810" stroke-width="0.4"/>
      <path d="M0,-16 L2.5,-7 L0,-10 L-2.5,-7 Z" fill="#CFB53B"/>
      <path d="M0,16 L2.5,7 L0,10 L-2.5,7 Z" fill="#6a6a6a"/>
      <path d="M16,0 L7,2.5 L10,0 L7,-2.5 Z" fill="#6a6a6a"/>
      <path d="M-16,0 L-7,2.5 L-10,0 L-7,-2.5 Z" fill="#6a6a6a"/>
      <circle r="2.8" fill="#CFB53B" stroke="#2a1a0a" stroke-width="0.5"/>
      <text x="0" y="-20" text-anchor="middle" font-size="7" font-family="Cinzel,serif" fill="#CFB53B" font-weight="bold">N</text>
    </g>

    <!-- === LEGENDA === -->
    <rect x="10" y="616" width="215" height="60" rx="3" class="map-legend-box" stroke="#3a2e1e" stroke-width="0.8"/>
    <path d="${P(22, 635)}" class="map-pin" data-loc="" stroke="rgba(0,0,0,0.3)" stroke-width="0.6" pointer-events="none"/>
    <circle cx="22" cy="623" r="2.4" fill="rgba(255,255,255,0.45)" pointer-events="none"/>
    <text x="32" y="628" class="map-label" text-anchor="start" font-size="6.5">${t.mapLegendPin}</text>
    <line x1="14" y1="643" x2="32" y2="643" stroke="#4a7a9b" stroke-width="2.5" stroke-dasharray="5,3" stroke-linecap="round"/>
    <text x="38" y="646" class="map-label" text-anchor="start" font-size="6.5">${t.mapLegendWall}</text>
    <line x1="14" y1="659" x2="32" y2="659" class="map-river" style="stroke-width:1.4;opacity:0.7"/>
    <text x="38" y="662" class="map-label" text-anchor="start" font-size="6.5">${t.mapLegendRiver}</text>

    <!-- Kaart ondertitel -->
    <text x="250" y="672" text-anchor="middle" font-size="6" font-family="Cinzel,serif" fill="#5a4a2a" opacity="0.5" letter-spacing="0.28em">✦ WESTEROS &amp; ESSOS ✦</text>
  `;

  // Klikbare pins → scroll naar locatiekaart
  svg.querySelectorAll('.map-pin[data-loc]').forEach(el => {
    if (!el.dataset.loc) return;
    el.addEventListener('click', () => {
      const card = document.getElementById(`info-${el.dataset.loc}`);
      if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

  container.appendChild(svg);
  return container;
}

// === Locaties ===
function renderLocations() {
  const view = document.getElementById('locations-view');
  const list = document.getElementById('locations-list');
  list.innerHTML = '';

  // Verwijder eventuele bestaande kaart (herbouw altijd voor taalwisseling)
  const existingMap = view.querySelector('.map-container');
  if (existingMap) existingMap.remove();

  view.insertBefore(buildWesterosMap(worldData.locations || []), list);

  (worldData.locations || []).forEach(loc => {
    list.appendChild(buildInfoCard(loc, {
      meta: loc.region,
      tag: loc.significance || null
    }));
  });
  showView('locations-view');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// === Wezens ===
function renderCreatures() {
  const t = I18N[currentLang];
  const list = document.getElementById('creatures-list');
  list.innerHTML = '';

  // Verzamel draken van BEIDE shows (GoT uit gotWorldData, HotD uit worldData als currentShow=hotd)
  const gotDragons  = (gotWorldData.creatures || []).filter(c => c.show === 'got' || ['drogon','rhaegal','viserion'].includes(c.id));
  const hotdDragons = (currentShow === 'hotd') ? (worldData.creatures || []) : [];

  // Gecombineerde drakenlijst: GoT draken + HotD draken
  const allDragons = [];
  gotDragons.forEach(c => { allDragons.push({ ...c, _fromShow: 'got' }); });
  hotdDragons.forEach(c => { allDragons.push({ ...c, _fromShow: 'hotd' }); });

  if (allDragons.length > 0) {
    const dragonHeader = document.createElement('div');
    dragonHeader.className = 'section-heading';
    dragonHeader.style.cssText = 'max-width:900px;margin:0 auto 0.75rem;';
    dragonHeader.textContent = t.dragons;
    list.appendChild(dragonHeader);

    allDragons.forEach(c => {
      const showLabel = c._fromShow === 'hotd' ? 'House of the Dragon' : 'Game of Thrones';
      const showClass = c._fromShow === 'hotd' ? 'hotd' : 'got';
      const card = buildInfoCard(c, { meta: c.associated_with || null });
      const body = card.querySelector('.info-card-body');
      if (body) {
        const badge = document.createElement('span');
        badge.className = `tl-show-badge ${showClass}`;
        badge.textContent = showLabel;
        body.insertBefore(badge, body.firstChild);
      }
      list.appendChild(card);
    });
  }

  // Overige wezens van de actieve show (niet-draken)
  const dragonIds = new Set(allDragons.map(c => c.id));
  const otherCreatures = currentShow === 'hotd'
    ? []
    : (worldData.creatures || []).filter(c => !dragonIds.has(c.id));

  if (otherCreatures.length > 0) {
    if (allDragons.length > 0) {
      const divider = document.createElement('div');
      divider.className = 'section-heading';
      divider.style.cssText = 'max-width:900px;margin:1.5rem auto 0.75rem;';
      divider.textContent = t.otherCreatures;
      list.appendChild(divider);
    }
    otherCreatures.forEach(c => {
      list.appendChild(buildInfoCard(c, { meta: c.associated_with || null }));
    });
  }

  showView('creatures-view');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// === Organisaties ===
function renderOrganizations() {
  const list = document.getElementById('organizations-list');
  list.innerHTML = '';
  (worldData.organizations || []).forEach(org => {
    list.appendChild(buildInfoCard(org, {
      meta: org.base || null,
      tag: org.motto ? `"${org.motto}"` : null
    }));
  });
  showView('organizations-view');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// === Woordenlijst ===
function renderGlossary() {
  const list = document.getElementById('glossary-list');
  list.innerHTML = '';
  (worldData.glossary || []).forEach(item => {
    const el = document.createElement('dl');
    el.className = 'glossary-item';
    el.innerHTML = `<dt>${item.term}</dt><dd>${item.definition}</dd>`;
    list.appendChild(el);
  });
  showView('glossary-view');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// === Seizoenen ===
function renderSeasons() {
  const t = I18N[currentLang];
  const list = document.getElementById('seasons-list');
  list.innerHTML = '';
  (worldData.seasons || []).forEach(s => {
    const details = document.createElement('details');
    details.className = 'season-card';
    details.innerHTML = `
      <summary>
        <div>
          <div class="season-title">${t.season} ${s.number} (${s.year})</div>
          <div class="season-meta">${s.episodes} ${t.episodes}</div>
        </div>
        <span class="season-chevron">&#9660;</span>
      </summary>
      <div class="season-body">
        <p class="spoiler-label">${t.spoilerLabels[s.spoiler_level] || ''}</p>
        <p>${s.summary}</p>
      </div>
    `;
    list.appendChild(details);
  });
  showView('seasons-view');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// === Tijdlijn ===
function renderTimeline() {
  const list = document.getElementById('timeline-list');
  list.innerHTML = '';

  const activeFilter = list.dataset.filter || 'all';

  (timelineData || []).forEach(ev => {
    if (ev.type === 'gap') {
      const gapEl = document.createElement('div');
      gapEl.className = 'tl-gap-card';
      gapEl.innerHTML = `
        <div class="tl-gap-inner">
          <div class="tl-gap-title">${ev.year}</div>
          <div class="tl-gap-sub">${ev.title}</div>
        </div>
      `;
      if (activeFilter !== 'hotd' && activeFilter !== 'got') {
        list.appendChild(gapEl);
      }
      return;
    }

    if (activeFilter !== 'all' && ev.show !== activeFilter) return;

    const details = document.createElement('details');
    details.className = 'tl-event-card';

    const showLabel = ev.show === 'hotd' ? 'House of the Dragon' : 'Game of Thrones';
    details.innerHTML = `
      <summary>
        <span class="tl-year-badge">${ev.year}</span>
        <span class="tl-event-title">${ev.title}</span>
        <span class="tl-chevron">&#9660;</span>
      </summary>
      <div class="tl-event-body">
        <span class="tl-show-badge ${ev.show}">${showLabel}</span>
        <p>${ev.description}</p>
      </div>
    `;

    const wrapper = document.createElement('div');
    wrapper.className = 'tl-event';
    wrapper.dataset.show = ev.show || '';
    wrapper.appendChild(details);
    list.appendChild(wrapper);
  });

  showView('timeline-view');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Filter-knoppen voor tijdlijn
document.querySelectorAll('.tl-filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tl-filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const list = document.getElementById('timeline-list');
    list.dataset.filter = btn.dataset.filter;
    renderTimeline();
  });
});

// === Stamboom ===
let currentFamilyId = null;

function renderFamilyTree() {
  const t = I18N[currentLang];
  const select = document.getElementById('family-select');
  const container = document.getElementById('family-tree-container');

  // Vul selector met families gefilterd op huidige show
  const filteredFamilies = (familyTreeData || []).filter(f => f.show === currentShow);

  // Herbouw selector altijd (naam kan veranderen bij taalwisseling)
  const previousValue = select.value;
  select.innerHTML = '';
  filteredFamilies.forEach(f => {
    const opt = document.createElement('option');
    opt.value = f.id;
    opt.textContent = f.name;
    select.appendChild(opt);
  });

  // Herstel vorige selectie indien nog geldig
  if (previousValue && filteredFamilies.find(f => f.id === previousValue)) {
    select.value = previousValue;
    currentFamilyId = previousValue;
  } else {
    currentFamilyId = filteredFamilies.length > 0 ? filteredFamilies[0].id : null;
    select.value = currentFamilyId || '';
  }

  // Render de gekozen familie
  const chosen = filteredFamilies.find(f => f.id === (select.value || currentFamilyId));
  container.innerHTML = '';
  if (!chosen) {
    container.innerHTML = `<p class="no-results">${t.noFamilyTree}</p>`;
    showView('familytree-view');
    return;
  }

  chosen.units.forEach(unit => {
    const unitEl = document.createElement('div');
    unitEl.className = 'family-unit';
    unitEl.style.setProperty('--family-color', chosen.color || 'var(--gold)');

    // Ouders-rij
    const parentsRow = document.createElement('div');
    parentsRow.className = 'parents-row';

    unit.parents.forEach((parent, idx) => {
      if (idx > 0) {
        const connector = document.createElement('div');
        connector.className = 'partner-connector';
        connector.textContent = '♥';
        parentsRow.appendChild(connector);
      }
      parentsRow.appendChild(buildPersonCard(parent, 'parent-card', 'parent-name'));
    });
    unitEl.appendChild(parentsRow);

    // Kinderen-rij
    if (unit.children && unit.children.length > 0) {
      const childrenRow = document.createElement('div');
      childrenRow.className = 'children-row';
      unit.children.forEach(child => {
        childrenRow.appendChild(buildPersonCard(child, 'child-card', 'child-name'));
      });
      unitEl.appendChild(childrenRow);
    }

    // Noot
    if (unit.note) {
      const noteEl = document.createElement('p');
      noteEl.className = 'family-unit-note';
      noteEl.textContent = unit.note;
      unitEl.appendChild(noteEl);
    }

    container.appendChild(unitEl);
  });

  showView('familytree-view');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function buildPersonCard(person, cardClass, nameClass) {
  const card = document.createElement('div');
  card.className = cardClass;

  const img = document.createElement('img');
  img.src = person.image || 'images/characters/placeholder.jpg';
  img.alt = person.name;
  img.loading = 'lazy';
  img.onerror = () => { img.src = 'images/characters/placeholder.jpg'; img.onerror = null; };

  const name = document.createElement('span');
  name.className = nameClass;
  name.textContent = person.name;

  card.appendChild(img);
  card.appendChild(name);

  if (person.houseId) {
    card.addEventListener('click', () => {
      const house = allHouses.find(h => h.id === person.houseId);
      if (house) {
        setActiveTab('houses');
        showHouse(house);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            const charEl = document.getElementById(`char-${person.id}`);
            if (charEl) charEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          });
        });
      }
    });
  }

  return card;
}

// Selector change handler
document.getElementById('family-select').addEventListener('change', function () {
  currentFamilyId = this.value;
  renderFamilyTree();
});

// === Live zoekfunctie (zoekt door alles) ===
document.getElementById('search-input').addEventListener('input', function () {
  const t = I18N[currentLang];
  const query = this.value.trim().toLowerCase();
  if (!query) {
    switch (activeTab) {
      case 'houses': renderHouses(); break;
      case 'locations': renderLocations(); break;
      case 'creatures': renderCreatures(); break;
      case 'organizations': renderOrganizations(); break;
      case 'glossary': renderGlossary(); break;
      case 'seasons': renderSeasons(); break;
      case 'timeline': renderTimeline(); break;
      case 'familytree': renderFamilyTree(); break;
      default: renderHouses();
    }
    return;
  }

  const results = [];

  // Personages
  allHouses.forEach(house => {
    house.characters.forEach(char => {
      if (
        char.name.toLowerCase().includes(query) ||
        house.name.toLowerCase().includes(query) ||
        (char.actor && char.actor.toLowerCase().includes(query)) ||
        char.description.toLowerCase().includes(query)
      ) {
        results.push({
          type: t.searchTypeCharacter,
          typeLabel: house.name,
          title: char.name,
          subtitle: char.actor ? `${t.playedBySearch} ${char.actor}` : '',
          text: char.description,
          image: char.image,
          action: () => navigateToCharacter(char, house)
        });
      }
    });
  });

  // Locaties
  (worldData.locations || []).forEach(loc => {
    if (loc.name.toLowerCase().includes(query) || loc.description.toLowerCase().includes(query)) {
      results.push({
        type: t.searchTypeLocation,
        typeLabel: loc.region,
        title: loc.name,
        subtitle: loc.region,
        text: loc.description,
        image: null,
        action: null
      });
    }
  });

  // Wezens
  (worldData.creatures || []).forEach(c => {
    if (c.name.toLowerCase().includes(query) || c.description.toLowerCase().includes(query)) {
      results.push({
        type: t.searchTypeCreature,
        typeLabel: c.associated_with || '',
        title: c.name,
        subtitle: c.associated_with || '',
        text: c.description,
        image: null,
        action: null
      });
    }
  });

  // Organisaties
  (worldData.organizations || []).forEach(org => {
    if (org.name.toLowerCase().includes(query) || org.description.toLowerCase().includes(query)) {
      results.push({
        type: t.searchTypeOrganization,
        typeLabel: org.base || '',
        title: org.name,
        subtitle: org.base || '',
        text: org.description,
        image: null,
        action: null
      });
    }
  });

  // Woordenlijst
  (worldData.glossary || []).forEach(item => {
    if (item.term.toLowerCase().includes(query) || item.definition.toLowerCase().includes(query)) {
      results.push({
        type: t.searchTypeTerm,
        typeLabel: '',
        title: item.term,
        subtitle: '',
        text: item.definition,
        image: null,
        action: null
      });
    }
  });

  const grid = document.getElementById('search-results');
  grid.innerHTML = '';

  if (results.length === 0) {
    grid.innerHTML = `<p class="no-results">${t.noResults}</p>`;
  } else {
    results.forEach(r => {
      const el = document.createElement('div');
      el.className = 'result-item' + (r.action ? ' clickable' : '');
      if (r.action) el.addEventListener('click', r.action);

      let imgHtml = '';
      if (r.image) {
        imgHtml = `<img src="${r.image}" alt="${r.title}" onerror="this.src='images/characters/placeholder.jpg';this.onerror=null">`;
      }

      el.innerHTML = `
        ${imgHtml}
        <div class="result-body">
          <div class="result-type">${r.type}${r.typeLabel ? ' · ' + r.typeLabel : ''}</div>
          <h3>${r.title}</h3>
          ${r.subtitle ? `<p style="font-size:0.78rem;color:var(--text-muted);margin-bottom:0.2rem">${r.subtitle}</p>` : ''}
          <p>${r.text.length > 140 ? r.text.slice(0, 140) + '…' : r.text}</p>
        </div>
      `;
      grid.appendChild(el);
    });
  }

  setActiveTab(activeTab);
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  showView('search-view');
});

// === Terugknop ===
document.getElementById('back-btn').addEventListener('click', () => {
  document.getElementById('search-input').value = '';
  renderHouses();
});

// === Show-selector (GOT / HOTD) ===
(function () {
  const btns = document.querySelectorAll('.show-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const show = btn.dataset.show;
      if (show === currentShow) return;
      btns.forEach(b => b.classList.toggle('active', b.dataset.show === show));
      document.getElementById('search-input').value = '';
      loadData(show);
    });
  });
})();

// === Taal-toggle (NL / EN) ===
(function () {
  const btn = document.getElementById('lang-toggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    applyLanguage(currentLang === 'nl' ? 'en' : 'nl');
  });
})();

// === Thema-toggle (donker/licht) ===
(function () {
  const btn = document.getElementById('theme-toggle');
  const saved = localStorage.getItem('got-theme');
  if (saved === 'light') document.documentElement.classList.add('light-mode');
  updateThemeIcon();

  btn.addEventListener('click', () => {
    const isLight = document.documentElement.classList.toggle('light-mode');
    localStorage.setItem('got-theme', isLight ? 'light' : 'dark');
    updateThemeIcon();
  });

  function updateThemeIcon() {
    const isLight = document.documentElement.classList.contains('light-mode');
    btn.textContent = isLight ? '🌙' : '☀️';
    btn.title = isLight ? (currentLang === 'en' ? 'Switch to dark mode' : 'Schakel naar donkere modus')
                        : (currentLang === 'en' ? 'Switch to light mode' : 'Schakel naar lichte modus');
  }
})();

// === Service Worker registreren ===
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js').then(reg => {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    }).catch(() => {});
  });
}

// === Start ===
updateUILabels();
loadData();
