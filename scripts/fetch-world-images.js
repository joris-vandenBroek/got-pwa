/**
 * Downloads infobox images from the Game of Thrones Fandom wiki
 * for locations, creatures and organizations.
 * Run with: node scripts/fetch-world-images.js
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const DIRS = {
  locations: 'images/locations',
  creatures: 'images/creatures',
  organizations: 'images/organizations',
};

Object.values(DIRS).forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// Map id -> direct image URL (full-size from wiki CDN)
// These are the /revision/latest URLs (no scale param = full size)
const IMAGES = {
  locations: {
    'kings-landing':    'https://static.wikia.nocookie.net/gameofthrones/images/8/83/King%27s_Landing_HotD.png/revision/latest',
    'winterfell':       'https://static.wikia.nocookie.net/gameofthrones/images/7/71/Winterfell_1x01.jpg/revision/latest',
    'the-wall':         'https://static.wikia.nocookie.net/gameofthrones/images/c/c1/TheWall.jpg/revision/latest',
    'casterly-rock':    'https://static.wikia.nocookie.net/gameofthrones/images/e/ea/CasterlyRock.jpg/revision/latest',
    'dragonstone':      'https://static.wikia.nocookie.net/gameofthrones/images/8/85/Dragonstone_7x01.jpg/revision/latest',
    'the-eyrie':        'https://static.wikia.nocookie.net/gameofthrones/images/e/eb/TheEyrie.jpg/revision/latest',
    'storm-s-end':      'https://static.wikia.nocookie.net/gameofthrones/images/a/ae/Storm%27s_End_2x05.jpg/revision/latest',
    'highgarden':       'https://static.wikia.nocookie.net/gameofthrones/images/8/84/Highgarden_7x03.jpg/revision/latest',
    'pyke':             'https://static.wikia.nocookie.net/gameofthrones/images/7/73/Pyke_2x01.jpg/revision/latest',
    'sunspear':         'https://static.wikia.nocookie.net/gameofthrones/images/e/e9/Sunspear_5x01.jpg/revision/latest',
    'the-godswood':     'https://static.wikia.nocookie.net/gameofthrones/images/7/76/Godswood_Winterfell_1x01.jpg/revision/latest',
    'castle-black':     'https://static.wikia.nocookie.net/gameofthrones/images/6/6e/CastleBlack.jpg/revision/latest',
    'braavos':          'https://static.wikia.nocookie.net/gameofthrones/images/c/c3/Braavos_5x02.jpg/revision/latest',
    'pentos':           'https://static.wikia.nocookie.net/gameofthrones/images/3/35/Pentos_1x01.jpg/revision/latest',
    'the-dothraki-sea': 'https://static.wikia.nocookie.net/gameofthrones/images/d/d2/Dothraki_Sea_1x01.jpg/revision/latest',
  },
  creatures: {
    'dragons':        'https://static.wikia.nocookie.net/gameofthrones/images/3/3b/Drogon_7x04.jpg/revision/latest',
    'white-walkers':  'https://static.wikia.nocookie.net/gameofthrones/images/f/f4/Night_King_S8_Ep3.jpg/revision/latest',
    'wights':         'https://static.wikia.nocookie.net/gameofthrones/images/f/fb/WightArmy_7x06.jpg/revision/latest',
    'direwolves':     'https://static.wikia.nocookie.net/gameofthrones/images/7/73/Ghost_8x04.jpg/revision/latest',
    'giants':         'https://static.wikia.nocookie.net/gameofthrones/images/2/27/Wun_Wun_6x09.jpg/revision/latest',
    'shadowcats':     'https://static.wikia.nocookie.net/gameofthrones/images/5/5e/Shadowcat_1x04.jpg/revision/latest',
    'sea-monsters':   null, // geen goed beeld beschikbaar
  },
  organizations: {
    'nights-watch':   'https://static.wikia.nocookie.net/gameofthrones/images/6/61/NightsWatch_5x07.jpg/revision/latest',
    'kingsguard':     'https://static.wikia.nocookie.net/gameofthrones/images/2/22/Kingsguard_5x10.jpg/revision/latest',
    'small-council':  'https://static.wikia.nocookie.net/gameofthrones/images/8/8e/SmallCouncil_7x03.jpg/revision/latest',
    'dothraki':       'https://static.wikia.nocookie.net/gameofthrones/images/b/b6/DothrakhiHorde_7x04.jpg/revision/latest',
    'wildlings':      'https://static.wikia.nocookie.net/gameofthrones/images/4/42/Wildlings_5x08.jpg/revision/latest',
    'faceless-men':   'https://static.wikia.nocookie.net/gameofthrones/images/e/ea/FacelessMen_5x10.jpg/revision/latest',
    'maesters':       'https://static.wikia.nocookie.net/gameofthrones/images/d/d7/Maester_5x07.jpg/revision/latest',
    'lords-of-westeros': 'https://static.wikia.nocookie.net/gameofthrones/images/8/8a/NorthernLords_8x01.jpg/revision/latest',
  }
};

// Returns the actual saved filename (ext may differ from expected)
function download(url, destBase) {
  return new Promise((resolve, reject) => {
    function get(u, redirects) {
      if (redirects > 5) { reject(new Error('Too many redirects')); return; }
      const mod = u.startsWith('https') ? https : http;
      const options = {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
          'Referer': 'https://gameofthrones.fandom.com/',
          'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        }
      };
      mod.get(u, options, res => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          get(res.headers.location, redirects + 1); return;
        }
        if (res.statusCode === 200) {
          const ct = res.headers['content-type'] || '';
          const ext = ct.includes('webp') ? 'webp' : ct.includes('png') ? 'png' : 'jpg';
          const dest = `${destBase}.${ext}`;
          if (fs.existsSync(dest)) { res.resume(); console.log(`skip`); resolve(dest); return; }
          const file = fs.createWriteStream(dest);
          res.pipe(file);
          file.on('finish', () => { file.close(); resolve(dest); });
          file.on('error', reject);
        } else {
          reject(new Error(`HTTP ${res.statusCode} for ${u}`));
        }
      }).on('error', reject);
    }
    get(url, 0);
  });
}

async function run() {
  const results = { ok: [], failed: [] };

  for (const [category, map] of Object.entries(IMAGES)) {
    for (const [id, url] of Object.entries(map)) {
      if (!url) {
        console.log(`  skip (no url): ${category}/${id}`);
        continue;
      }
      const destBase = `${DIRS[category]}/${id}`;
      process.stdout.write(`Downloading ${category}/${id}... `);
      try {
        const saved = await download(url, destBase);
        console.log('ok → ' + path.basename(saved));
        results.ok.push(`${category}/${id}`);
      } catch (e) {
        console.log(`FAILED: ${e.message}`);
        results.failed.push(`${category}/${id}: ${e.message}`);
      }
      await new Promise(r => setTimeout(r, 300));
    }
  }

  console.log('\n=== Resultaat ===');
  console.log(`OK: ${results.ok.length}`);
  console.log(`Mislukt: ${results.failed.length}`);
  if (results.failed.length) results.failed.forEach(f => console.log('  FAILED: ' + f));
}

run();
