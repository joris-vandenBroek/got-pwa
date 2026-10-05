let allHouses = [];

// === Data laden ===
async function loadData() {
  try {
    const res = await fetch('data/characters.json');
    const data = await res.json();
    allHouses = data.houses;
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
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// === Huizenoverzicht ===
function renderHouses() {
  document.getElementById('search-input').value = '';
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
  body.innerHTML = `<h3>${char.name}</h3><p class="description">${char.description}</p>`;

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

// === Zoek een personage op ID door alle huizen ===
function findCharacter(id) {
  for (const house of allHouses) {
    const char = house.characters.find(c => c.id === id);
    if (char) return { char, house };
  }
  return null;
}

// === Navigeer naar een specifiek personage ===
function navigateToCharacter(char, house) {
  showHouse(house);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const el = document.getElementById(`char-${char.id}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });
}

// === Live zoekfunctie ===
document.getElementById('search-input').addEventListener('input', function () {
  const query = this.value.trim().toLowerCase();
  if (!query) { renderHouses(); return; }

  const results = [];
  allHouses.forEach(house => {
    house.characters.forEach(char => {
      const nameMatch = char.name.toLowerCase().includes(query);
      const houseMatch = house.name.toLowerCase().includes(query);
      if (nameMatch || houseMatch) results.push({ char, house });
    });
  });

  const grid = document.getElementById('search-results');
  grid.innerHTML = '';

  if (results.length === 0) {
    grid.innerHTML = '<p class="no-results">Geen personages gevonden voor deze zoekopdracht.</p>';
  } else {
    results.forEach(({ char, house }) => {
      const card = buildCharacterCard(char, house.color);
      const badge = document.createElement('span');
      badge.className = 'house-badge';
      badge.style.color = house.color;
      badge.textContent = house.name;
      card.querySelector('.card-body').prepend(badge);
      grid.appendChild(card);
    });
  }
  showView('search-view');
});

// === Terugknop ===
document.getElementById('back-btn').addEventListener('click', renderHouses);

// === Service Worker registreren ===
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js').catch(() => {});
  });
}

// === Start ===
loadData();
