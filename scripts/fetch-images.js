const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Mapping: lokaal ID → naam in de thronesapi.com API
const NAME_MAP = {
  'eddard-stark': 'Ned Stark',
  'catelyn-stark': 'Catelyn Stark',
  'robb-stark': 'Rob Stark',
  'sansa-stark': 'Sansa Stark',
  'arya-stark': 'Arya Stark',
  'bran-stark': 'Brandon Stark',
  'jon-snow': 'Jon Snow',
  'tywin-lannister': 'Tywin Lannister',
  'cersei-lannister': 'Cersei Lannister',
  'jaime-lannister': 'Jamie Lannister',
  'tyrion-lannister': 'Tyrion Lannister',
  'joffrey-baratheon': 'Joffrey Baratheon',
  'daenerys-targaryen': 'Daenerys Targaryen',
  'viserys-targaryen': 'Viserys Targaryn',
  'khal-drogo': 'Khal Drogo',
  'jorah-mormont': 'Jorah Mormont',
  'robert-baratheon': 'Robert Baratheon',
  'stannis-baratheon': 'Stannis Baratheon',
  'margaery-tyrell': 'Margaery Tyrell',
  'olenna-tyrell': 'Olenna Tyrell',
  'theon-greyjoy': 'Theon Greyjoy',
  'yara-greyjoy': 'Yara Greyjoy',
  'oberyn-martell': 'Oberyn Martell',
  'ellaria-sand': 'Ellaria Sand',
  'jeor-mormont': 'Jeor Mormont',
  'samwell-tarly': 'Samwell Tarly',
  'petyr-baelish': 'Petyr Baelish',
  'varys': 'Varys'
};

const OUT_DIR = path.join(__dirname, '..', 'images', 'characters');

function getClient(url) {
  return url.startsWith('https') ? https : http;
}

function download(url, dest, redirects = 0) {
  if (redirects > 5) return Promise.reject(new Error('Te veel redirects'));
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    getClient(url).get(url, { headers: { 'User-Agent': 'got-pwa/1.0' } }, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlink(dest, () => {});
        download(res.headers.location, dest, redirects + 1).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        file.close();
        fs.unlink(dest, () => {});
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
      file.on('error', err => { fs.unlink(dest, () => {}); reject(err); });
    }).on('error', err => { fs.unlink(dest, () => {}); reject(err); });
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  const apiUrl = 'https://thronesapi.com/api/v2/Characters';
  console.log('Ophalen van karakterlijst via thronesapi.com...');

  const apiData = await new Promise((resolve, reject) => {
    https.get(apiUrl, { headers: { 'User-Agent': 'got-pwa/1.0' } }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(body)); }
        catch (e) { reject(new Error('Ongeldige JSON van API')); }
      });
    }).on('error', reject);
  });

  // Bouw naam-naar-imageUrl mapping
  const byName = {};
  apiData.forEach(c => {
    if (c.fullName && c.imageUrl) byName[c.fullName] = c.imageUrl;
  });

  console.log(`${apiData.length} karakters gevonden in API\n`);

  let found = 0, skipped = 0, failed = 0;

  for (const [id, apiName] of Object.entries(NAME_MAP)) {
    const imageUrl = byName[apiName];
    const dest = path.join(OUT_DIR, `${id}.jpg`);

    if (fs.existsSync(dest)) {
      console.log(`⏭  al aanwezig: ${id}`);
      skipped++;
      continue;
    }

    if (!imageUrl) {
      console.warn(`⚠  niet gevonden in API: ${apiName} (${id})`);
      failed++;
      continue;
    }

    try {
      await download(imageUrl, dest);
      console.log(`✓  ${id}`);
      found++;
    } catch (e) {
      console.warn(`✗  ${id}: ${e.message}`);
      failed++;
    }

    await sleep(250);
  }

  console.log(`\nKlaar! Gedownload: ${found}, al aanwezig: ${skipped}, mislukt: ${failed}`);
}

main().catch(console.error);
