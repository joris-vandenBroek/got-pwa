const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svg = fs.readFileSync(path.join(__dirname, 'icon.svg'));
const out = __dirname;

sharp(svg).resize(192, 192).toFile(path.join(out, 'icon-192.png'), (err) => {
  if (err) console.error('192 fout:', err);
  else console.log('icon-192.png aangemaakt');
});

sharp(svg).resize(512, 512).toFile(path.join(out, 'icon-512.png'), (err) => {
  if (err) console.error('512 fout:', err);
  else console.log('icon-512.png aangemaakt');
});
