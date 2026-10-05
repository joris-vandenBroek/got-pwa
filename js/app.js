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

// === Locaties ===
function renderLocations() {
  const list = document.getElementById('locations-list');
  list.innerHTML = '';
  (worldData.locations || []).forEach(loc => {
    const card = document.createElement('div');
    card.className = 'info-card';
    card.innerHTML = `
      <h3>${loc.name}</h3>
      <p class="info-meta">${loc.region}</p>
      <p>${loc.description}</p>
      ${loc.significance ? `<span class="info-tag">${loc.significance}</span>` : ''}
    `;
    list.appendChild(card);
  });
  showView('locations-view');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// === Wezens ===
function renderCreatures() {
  const list = document.getElementById('creatures-list');
  list.innerHTML = '';
  (worldData.creatures || []).forEach(c => {
    const card = document.createElement('div');
    card.className = 'info-card';
    card.innerHTML = `
      <h3>${c.name}</h3>
      ${c.associated_with ? `<p class="info-meta">${c.associated_with}</p>` : ''}
      <p>${c.description}</p>
    `;
    list.appendChild(card);
  });
  showView('creatures-view');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// === Organisaties ===
function renderOrganizations() {
  const list = document.getElementById('organizations-list');
  list.innerHTML = '';
  (worldData.organizations || []).forEach(org => {
    const card = document.createElement('div');
    card.className = 'info-card';
    card.innerHTML = `
      <h3>${org.name}</h3>
      ${org.base ? `<p class="info-meta">${org.base}</p>` : ''}
      <p>${org.description}</p>
      ${org.motto ? `<span class="info-tag">"${org.motto}"</span>` : ''}
    `;
    list.appendChild(card);
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
