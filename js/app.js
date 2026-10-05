let allHouses = [];
let worldData = {};
let activeTab = 'houses';

// === Data laden ===
async function loadData() {
  try {
    const [charRes, worldRes] = await Promise.all([
      fetch('data/characters.json'),
      fetch('data/world.json')
    ]);
    const charData = await charRes.json();
    worldData = await worldRes.json();
    allHouses = charData.houses;
    renderHouses();
  } catch (e) {
    document.getElementById('houses-grid').innerHTML =
      '<p class="no-results">Fout bij laden van data. Probeer de pagina te herladen.</p>';
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
      case 'houses':       renderHouses(); break;
      case 'locations':    renderLocations(); break;
      case 'creatures':    renderCreatures(); break;
      case 'organizations': renderOrganizations(); break;
      case 'glossary':     renderGlossary(); break;
      case 'seasons':      renderSeasons(); break;
    }
  });
});

// === Huizenoverzicht ===
function renderHouses() {
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
      <p class="count">${house.characters.length} personages</p>
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
    ? `<p class="actor-badge">Gespeeld door: <span>${char.actor}</span></p>`
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
  // Zet de tab op 'huizen' als die nog niet actief is
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
  const container = document.createElement('div');
  container.className = 'map-container';
  container.innerHTML = '<h2>Kaart van de Bekende Wereld</h2>';

  // SVG map — simplified but recognizable geography
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', '0 0 500 680');
  svg.setAttribute('class', 'westeros-map');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', 'Kaart van Westeros en Essos');

  svg.innerHTML = `
    <!-- Zee achtergrond -->
    <rect width="500" height="680" class="map-sea"/>

    <!-- === WESTEROS === -->
    <!-- Het Hoge Noorden (ijzig) -->
    <polygon points="85,10 230,10 240,50 220,70 180,80 130,75 95,60" class="map-ice"/>
    <!-- The Wall lijn -->
    <line x1="95" y1="90" x2="215" y2="90" stroke="#4a7a9b" stroke-width="3" stroke-dasharray="4,2"/>
    <text x="155" y="86" class="map-label" fill="#4a7a9b">The Wall</text>

    <!-- Het Noorden -->
    <polygon points="95,90 215,90 225,140 210,180 175,210 140,215 105,195 90,155 85,115" class="map-region north"/>
    <text x="155" y="155" class="map-region-label">Het Noorden</text>

    <!-- De Ijzeren Eilanden -->
    <ellipse cx="60" cy="220" rx="22" ry="14" class="map-region" fill="#1e2020"/>
    <text x="60" y="223" class="map-label">IJz. Eilanden</text>

    <!-- De Rivierland + Westerland -->
    <polygon points="90,195 140,215 175,210 210,180 225,220 215,265 185,285 155,290 120,275 90,250 80,225" class="map-region"/>
    <text x="130" y="245" class="map-region-label">Rivierland</text>

    <!-- Westerland (Casterly Rock) -->
    <polygon points="80,225 90,250 85,295 70,320 60,290 65,255" class="map-region" fill="#2a1e08"/>
    <text x="68" y="280" class="map-region-label" font-size="6">Westerlanden</text>

    <!-- Het Dal (The Vale) -->
    <polygon points="215,180 225,140 265,130 280,160 270,210 245,225 225,220" class="map-region" fill="#1e2218"/>
    <text x="248" y="180" class="map-region-label">Het Dal</text>

    <!-- De Kroonlanden (King's Landing) -->
    <polygon points="185,285 215,265 225,220 245,225 260,260 255,295 235,315 205,315 185,300" class="map-region crownlands"/>
    <text x="223" y="278" class="map-region-label">Kroonland</text>

    <!-- Stormgronden -->
    <polygon points="205,315 235,315 255,295 270,310 265,355 245,375 215,370 200,345" class="map-region"/>
    <text x="233" y="345" class="map-region-label">Stormgronden</text>

    <!-- Het Bereik -->
    <polygon points="85,295 120,275 155,290 185,300 185,340 165,375 135,390 105,380 80,355 75,320" class="map-region" fill="#1a2a10"/>
    <text x="128" y="345" class="map-region-label">Het Bereik</text>

    <!-- Dorne -->
    <polygon points="80,355 105,380 135,390 165,375 200,380 215,370 215,410 180,440 140,445 100,430 75,400" class="map-region" fill="#2a2010"/>
    <text x="145" y="415" class="map-region-label">Dorne</text>

    <!-- Dragonstone eiland -->
    <ellipse cx="278" cy="305" rx="12" ry="8" class="map-region" fill="#1e1e2a"/>

    <!-- === ESSOS === -->
    <!-- Westkust Essos -->
    <polygon points="330,60 430,60 470,100 480,160 460,220 440,260 420,290 360,300 330,260 325,200 320,140 315,100" class="map-region essos"/>
    <!-- Dothraki Zee -->
    <polygon points="360,180 440,160 480,200 480,280 440,260 420,290 360,300 340,260 330,220" class="map-region" fill="#2a2208"/>
    <text x="415" y="240" class="map-region-label">Dothraki Zee</text>
    <text x="378" y="140" class="map-region-label">Vrije Steden</text>

    <!-- Smalle Zee -->
    <text x="290" y="200" class="map-label" fill="#2a4a6a">Smalle</text>
    <text x="290" y="210" class="map-label" fill="#2a4a6a">Zee</text>

    <!-- === LOCATIE-PINS === -->
    <!-- King's Landing -->
    <circle cx="220" cy="305" r="5" class="map-pin" data-loc="kings-landing" title="King's Landing"/>
    <text x="220" y="296" class="map-pin-label">King's Landing</text>

    <!-- Winterfell -->
    <circle cx="158" cy="160" r="5" class="map-pin" data-loc="winterfell" title="Winterfell"/>
    <text x="158" y="151" class="map-pin-label">Winterfell</text>

    <!-- The Wall -->
    <circle cx="155" cy="91" r="4" class="map-pin" data-loc="the-wall" title="The Wall" fill="#4a9abf"/>

    <!-- Castle Black -->
    <circle cx="150" cy="93" r="3" class="map-pin" data-loc="castle-black" fill="#9a9a9a"/>

    <!-- Casterly Rock -->
    <circle cx="72" cy="285" r="4" class="map-pin" data-loc="casterly-rock"/>
    <text x="72" y="277" class="map-pin-label">Casterly Rock</text>

    <!-- Dragonstone -->
    <circle cx="278" cy="305" r="4" class="map-pin" data-loc="dragonstone"/>
    <text x="278" y="297" class="map-pin-label">Dragonstone</text>

    <!-- The Eyrie -->
    <circle cx="252" cy="185" r="4" class="map-pin" data-loc="the-eyrie"/>
    <text x="252" y="177" class="map-pin-label">The Eyrie</text>

    <!-- Storm's End -->
    <circle cx="245" cy="360" r="4" class="map-pin" data-loc="storm-s-end"/>
    <text x="245" y="352" class="map-pin-label">Storm's End</text>

    <!-- Highgarden -->
    <circle cx="130" cy="360" r="4" class="map-pin" data-loc="highgarden"/>
    <text x="130" y="352" class="map-pin-label">Highgarden</text>

    <!-- Pyke (Iron Islands) -->
    <circle cx="60" cy="222" r="4" class="map-pin" data-loc="pyke"/>

    <!-- Sunspear -->
    <circle cx="178" cy="430" r="4" class="map-pin" data-loc="sunspear"/>
    <text x="178" y="422" class="map-pin-label">Sunspear</text>

    <!-- Braavos -->
    <circle cx="345" cy="80" r="4" class="map-pin" data-loc="braavos"/>
    <text x="345" y="72" class="map-pin-label">Braavos</text>

    <!-- Pentos -->
    <circle cx="325" cy="130" r="4" class="map-pin" data-loc="pentos"/>
    <text x="325" y="122" class="map-pin-label">Pentos</text>

    <!-- Dothraki Zee -->
    <circle cx="420" cy="220" r="4" class="map-pin" data-loc="the-dothraki-sea"/>
    <text x="420" y="212" class="map-pin-label">Dothraki Zee</text>

    <!-- Legenda -->
    <rect x="10" y="620" width="200" height="55" fill="#0f0802" rx="4" stroke="#3a2e1e" stroke-width="0.5"/>
    <circle cx="22" cy="633" r="4" fill="#CFB53B"/>
    <text x="30" y="637" class="map-label" text-anchor="start">Locatie (klik om te bekijken)</text>
    <line x1="14" y1="648" x2="35" y2="648" stroke="#4a7a9b" stroke-width="2" stroke-dasharray="4,2"/>
    <text x="40" y="651" class="map-label" text-anchor="start">The Wall</text>
  `;

  // Maak pins klikbaar → scroll naar locatiekaart
  svg.querySelectorAll('.map-pin').forEach(pin => {
    pin.style.cursor = 'pointer';
    pin.addEventListener('click', () => {
      const locId = pin.dataset.loc;
      const card = document.getElementById(`info-${locId}`);
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

  // Voeg kaart toe (één keer bovenaan)
  const existingMap = view.querySelector('.map-container');
  if (!existingMap) {
    view.insertBefore(buildWesterosMap(worldData.locations || []), list);
  }

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
  const list = document.getElementById('creatures-list');
  list.innerHTML = '';
  (worldData.creatures || []).forEach(c => {
    list.appendChild(buildInfoCard(c, {
      meta: c.associated_with || null
    }));
  });
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
  const list = document.getElementById('seasons-list');
  list.innerHTML = '';
  const spoilerLabels = {
    laag: '&#128994; Lage spoilergraad',
    middel: '&#128993; Gemiddelde spoilergraad',
    hoog: '&#128308; Hoge spoilergraad',
    maximum: '&#128308; Maximale spoilergraad — alleen lezen na volledig kijken'
  };
  (worldData.seasons || []).forEach(s => {
    const details = document.createElement('details');
    details.className = 'season-card';
    details.innerHTML = `
      <summary>
        <div>
          <div class="season-title">Seizoen ${s.number} (${s.year})</div>
          <div class="season-meta">${s.episodes} afleveringen</div>
        </div>
        <span class="season-chevron">&#9660;</span>
      </summary>
      <div class="season-body">
        <p class="spoiler-label">${spoilerLabels[s.spoiler_level] || ''}</p>
        <p>${s.summary}</p>
      </div>
    `;
    list.appendChild(details);
  });
  showView('seasons-view');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// === Live zoekfunctie (zoekt door alles) ===
document.getElementById('search-input').addEventListener('input', function () {
  const query = this.value.trim().toLowerCase();
  if (!query) {
    switch (activeTab) {
      case 'houses': renderHouses(); break;
      case 'locations': renderLocations(); break;
      case 'creatures': renderCreatures(); break;
      case 'organizations': renderOrganizations(); break;
      case 'glossary': renderGlossary(); break;
      case 'seasons': renderSeasons(); break;
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
          type: 'Personage',
          typeLabel: house.name,
          title: char.name,
          subtitle: char.actor ? `Gespeeld door ${char.actor}` : '',
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
        type: 'Locatie',
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
        type: 'Wezen',
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
        type: 'Organisatie',
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
        type: 'Term',
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
    grid.innerHTML = '<p class="no-results">Geen resultaten gevonden voor deze zoekopdracht.</p>';
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

  setActiveTab(activeTab); // bewaar de huidige tab
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  showView('search-view');
});

// === Terugknop ===
document.getElementById('back-btn').addEventListener('click', () => {
  document.getElementById('search-input').value = '';
  renderHouses();
});

// === Service Worker registreren ===
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js').catch(() => {});
  });
}

// === Start ===
loadData();
