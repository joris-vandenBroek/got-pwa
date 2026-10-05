/**
 * Downloads all world images using the URLs from image-urls.json
 * Run with: node scripts/download-world-images.js
 */
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const urls = require('./image-urls.json');

// Map id prefix to directory
const CATEGORY_DIRS = {
  // locations
  'kings-landing': 'images/locations',
  'winterfell': 'images/locations',
  'the-wall': 'images/locations',
  'casterly-rock': 'images/locations',
  'dragonstone': 'images/locations',
  'the-eyrie': 'images/locations',
  'storm-s-end': 'images/locations',
  'highgarden': 'images/locations',
  'pyke': 'images/locations',
  'sunspear': 'images/locations',
  'the-godswood': 'images/locations',
  'castle-black': 'images/locations',
  'braavos': 'images/locations',
  'pentos': 'images/locations',
  'the-dothraki-sea': 'images/locations',
  // creatures
  'dragons': 'images/creatures',
  'white-walkers': 'images/creatures',
  'wights': 'images/creatures',
  'direwolves': 'images/creatures',
  'giants': 'images/creatures',
  // organizations
  'nights-watch': 'images/organizations',
  'kingsguard': 'images/organizations',
  'small-council': 'images/organizations',
  'dothraki': 'images/organizations',
  'wildlings': 'images/organizations',
  'faceless-men': 'images/organizations',
  'maesters': 'images/organizations',
  'lords-of-westeros': 'images/organizations',
};

// Create directories
new Set(Object.values(CATEGORY_DIRS)).forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

function guessExt(url) {
  if (url.includes('.svg')) return 'svg';
  if (url.includes('.png')) return 'png';
  if (url.includes('.jpg') || url.includes('.jpeg')) return 'jpg';
  return 'jpg';
}

function download(url, destBase, expectedExt) {
  return new Promise((resolve, reject) => {
    // Check if any extension variant already exists
    for (const ext of ['webp', 'jpg', 'png', 'svg']) {
      if (fs.existsSync(`${destBase}.${ext}`)) {
        resolve({ file: `${destBase}.${ext}`, status: 'skip' });
        return;
      }
    }

    function get(u, redirects) {
      if (redirects > 5) { reject(new Error('Too many redirects')); return; }
      const mod = u.startsWith('https') ? https : http;
      mod.get(u, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
          'Referer': 'https://gameofthrones.fandom.com/',
          'Accept': 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        }
      }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          get(res.headers.location, redirects + 1);
          return;
        }
        if (res.statusCode === 200) {
          const ct = res.headers['content-type'] || '';
          let ext = expectedExt;
          if (ct.includes('webp')) ext = 'webp';
          else if (ct.includes('svg')) ext = 'svg';
          else if (ct.includes('png')) ext = 'png';
          else if (ct.includes('jpeg') || ct.includes('jpg')) ext = 'jpg';

          const dest = `${destBase}.${ext}`;
          const file = fs.createWriteStream(dest);
          res.pipe(file);
          file.on('finish', () => { file.close(); resolve({ file: dest, status: 'ok' }); });
          file.on('error', reject);
        } else {
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      }).on('error', reject);
    }
    get(url, 0);
  });
}

async function run() {
  const results = { ok: [], skip: [], failed: [] };
  const manifest = {}; // id -> relative file path

  for (const [id, url] of Object.entries(urls)) {
    const dir = CATEGORY_DIRS[id] || 'images/locations';
    const destBase = `${dir}/${id}`;
    const ext = guessExt(url);
    process.stdout.write(`${id}... `);
    try {
      const { file, status } = await download(url, destBase, ext);
      console.log(status === 'skip' ? 'skip' : 'ok → ' + path.basename(file));
      results[status].push(id);
      manifest[id] = file.replace(/\\/g, '/');
    } catch (e) {
      console.log(`FAILED: ${e.message}`);
      results.failed.push(id);
    }
    await new Promise(r => setTimeout(r, 300));
  }

  fs.writeFileSync('scripts/world-image-manifest.json', JSON.stringify(manifest, null, 2));

  console.log('\n=== Resultaat ===');
  console.log(`OK: ${results.ok.length}`);
  console.log(`Skip (al aanwezig): ${results.skip.length}`);
  console.log(`Mislukt: ${results.failed.length}`);
  if (results.failed.length) console.log('Mislukt:', results.failed.join(', '));
  console.log('\nManifest gesaved naar scripts/world-image-manifest.json');
}

run();
