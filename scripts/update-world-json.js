/**
 * Adds image paths to world.json based on world-image-manifest.json
 */
const fs = require('fs');
const manifest = require('./world-image-manifest.json');
const world = JSON.parse(fs.readFileSync('data/world.json', 'utf8'));

// Add images to locations
world.locations.forEach(loc => {
  if (manifest[loc.id]) loc.image = manifest[loc.id];
});

// Add images to creatures
world.creatures.forEach(c => {
  if (manifest[c.id]) c.image = manifest[c.id];
});

// Add images to organizations
world.organizations.forEach(org => {
  if (manifest[org.id]) org.image = manifest[org.id];
});

fs.writeFileSync('data/world.json', JSON.stringify(world, null, 2));
console.log('world.json bijgewerkt met afbeeldingen.');

// Report
const total = world.locations.length + world.creatures.length + world.organizations.length;
const withImage = [
  ...world.locations.filter(l => l.image),
  ...world.creatures.filter(c => c.image),
  ...world.organizations.filter(o => o.image),
].length;
console.log(`${withImage}/${total} items hebben een afbeelding.`);
