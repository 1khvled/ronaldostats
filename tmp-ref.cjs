const fs = require('fs');
const ar = JSON.parse(fs.readFileSync('src/i18n/shell/ar.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('src/i18n/shell/en.json', 'utf8'));
const mj = JSON.parse(fs.readFileSync('src/i18n/shell/ar.missing.json', 'utf8'));
for (const L of ['es', 'pt', 'fr', 'ro', 'uz', 'bn', 'hi']) {
  const d = JSON.parse(fs.readFileSync('src/i18n/shell/' + L + '.json', 'utf8'));
  console.log('===== ' + L + ' =====');
  for (const k of mj) {
    if (k in d) console.log('KEY: ' + JSON.stringify(k) + '\n  => ' + JSON.stringify(d[k]));
  }
}
