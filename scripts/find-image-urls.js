/**
 * Fetches the correct og:image URL for each item from the GoT wiki.
 * Outputs a JSON map of id -> image URL.
 */
const https = require('https');

const WIKI_PAGES = {
  // locations
  'kings-landing': 'King\'s_Landing',
  'winterfell': 'Winterfell',
  'the-wall': 'The_Wall_(Game_of_Thrones)',
  'casterly-rock': 'Casterly_Rock',
  'dragonstone': 'Dragonstone',
  'the-eyrie': 'The_Eyrie',
  'storm-s-end': 'Storm\'s_End',
  'highgarden': 'Highgarden',
  'pyke': 'Pyke',
  'sunspear': 'Sunspear',
  'the-godswood': 'Godswood',
  'castle-black': 'Castle_Black',
  'braavos': 'Braavos',
  'pentos': 'Pentos',
  'the-dothraki-sea': 'Dothraki_Sea',
  // creatures
  'dragons': 'Dragon',
  'white-walkers': 'White_Walkers',
  'wights': 'Wight',
  'direwolves': 'Direwolf',
  'giants': 'Giant_(Game_of_Thrones)',
  'shadowcats': 'Shadowcat',
  // organizations
  'nights-watch': "Night's_Watch",
  'kingsguard': 'Kingsguard',
  'small-council': 'Small_Council',
  'dothraki': 'Dothraki',
  'wildlings': 'Free_Folk',
  'faceless-men': 'Faceless_Men',
  'maesters': 'Maester',
  'lords-of-westeros': 'Lords_of_Westeros',
};

function fetchOgImage(slug) {
  return new Promise((resolve) => {
    const url = 'https://gameofthrones.fandom.com/wiki/' + encodeURIComponent(slug);
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        resolve(fetchOgImage(res.headers.location.replace('https://gameofthrones.fandom.com/wiki/', '')));
        return;
      }
      let html = '';
      res.on('data', chunk => { html += chunk; if (html.length > 50000) req.destroy(); });
      res.on('end', () => {
        // try og:image
        const ogMatch = html.match(/property="og:image" content="([^"]+)"/);
        if (ogMatch) {
          const raw = ogMatch[1];
          // Strip thumbnail params to get /revision/latest
          const base = raw.split('/revision/latest')[0];
          resolve(base + '/revision/latest');
        } else {
          resolve(null);
        }
      });
    });
    req.on('error', () => resolve(null));
    setTimeout(() => { req.destroy(); resolve(null); }, 10000);
  });
}

async function run() {
  const results = {};
  for (const [id, slug] of Object.entries(WIKI_PAGES)) {
    process.stdout.write(`Fetching ${id} (${slug})... `);
    const url = await fetchOgImage(slug);
    if (url) {
      results[id] = url;
      console.log('OK: ' + url.slice(-60));
    } else {
      console.log('NOT FOUND');
    }
    await new Promise(r => setTimeout(r, 500));
  }
  const fs = require('fs');
  fs.writeFileSync('scripts/image-urls.json', JSON.stringify(results, null, 2));
  console.log('\nGesaved naar scripts/image-urls.json');
}

run();
