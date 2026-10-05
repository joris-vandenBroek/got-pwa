const https = require('https');

const MISSING = {
  'the-wall': 'The Wall',
  'the-eyrie': 'The Eyrie (Game of Thrones)',
  'giants': 'Wun Weg Wun Dar Wun',
  'shadowcats': 'Shadowcat (animal)',
  'maesters': 'The Citadel',
  'lords-of-westeros': 'Great Houses',
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
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' } }, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pages = json.query && json.query.pages;
          if (!pages) { resolve(null); return; }
          const page = Object.values(pages)[0];
          if (page.thumbnail) {
            const src = (page.original && page.original.source) || page.thumbnail.source;
            resolve(src);
          } else resolve(null);
        } catch (e) { resolve(null); }
      });
    }).on('error', () => resolve(null));
  });
}

async function run() {
  for (const [id, title] of Object.entries(MISSING)) {
    process.stdout.write(`${id} (${title})... `);
    const url = await fetchPageImage(title);
    console.log(url ? 'OK: ' + url.slice(-70) : 'NOT FOUND');
    await new Promise(r => setTimeout(r, 300));
  }
}
run();
