/**
 * Uses puppeteer-less approach: navigates via browser fetch with JS-rendered content
 * Since the wiki is SPA, we need the actual rendered img src.
 *
 * Strategy: use the wiki's internal API to get image info
 * The MediaWiki API endpoint: /api.php?action=query&titles=X&prop=pageimages&format=json&pithumbsize=600
 */
const https = require('https');

const WIKI_PAGES = {
  // locations
  'kings-landing': "King's Landing",
  'winterfell': 'Winterfell',
  'the-wall': 'The Wall (Game of Thrones)',
  'casterly-rock': 'Casterly Rock',
  'dragonstone': 'Dragonstone',
  'the-eyrie': 'The Eyrie',
  'storm-s-end': "Storm's End",
  'highgarden': 'Highgarden',
  'pyke': 'Pyke',
  'sunspear': 'Sunspear',
  'the-godswood': 'Godswood',
  'castle-black': 'Castle Black',
  'braavos': 'Braavos',
  'pentos': 'Pentos',
  'the-dothraki-sea': 'Dothraki Sea',
  // creatures
  'dragons': 'Dragon',
  'white-walkers': 'White Walkers',
  'wights': 'Wight',
  'direwolves': 'Direwolf',
  'giants': 'Giant (Game of Thrones)',
  'shadowcats': 'Shadowcat',
  // organizations
  'nights-watch': "Night's Watch",
  'kingsguard': 'Kingsguard',
  'small-council': 'Small Council',
  'dothraki': 'Dothraki',
  'wildlings': 'Free Folk',
  'faceless-men': 'Faceless Men',
  'maesters': 'Maester',
  'lords-of-westeros': 'Great Houses of Westeros',
};

function fetchPageImage(title) {
  return new Promise((resolve) => {
    const params = new URLSearchParams({
      action: 'query',
      titles: title,
      prop: 'pageimages',
      format: 'json',
      pithumbsize: 600,
      piprop: 'thumbnail|original',
    });
    const url = 'https://gameofthrones.fandom.com/api.php?' + params.toString();
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; GoT-PWA/1.0)',
        'Accept': 'application/json',
      }
    }, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pages = json.query && json.query.pages;
          if (!pages) { resolve(null); return; }
          const page = Object.values(pages)[0];
          if (page.thumbnail) {
            // Get full-size from original if available
            const src = (page.original && page.original.source) || page.thumbnail.source;
            resolve(src);
          } else {
            resolve(null);
          }
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

async function run() {
  const results = {};
  for (const [id, title] of Object.entries(WIKI_PAGES)) {
    process.stdout.write(`${id}... `);
    const url = await fetchPageImage(title);
    if (url) {
      results[id] = url;
      console.log('OK: ' + url.slice(url.lastIndexOf('/') - 30));
    } else {
      console.log('not found');
    }
    await new Promise(r => setTimeout(r, 300));
  }

  const fs = require('fs');
  fs.writeFileSync('scripts/image-urls.json', JSON.stringify(results, null, 2));
  console.log('\nGesaved naar scripts/image-urls.json');
  console.log('Gevonden: ' + Object.keys(results).length + '/' + Object.keys(WIKI_PAGES).length);
}

run();
