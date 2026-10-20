const fs = require('fs');
const p = 'src/i18n/shell/';
const en = JSON.parse(fs.readFileSync(p + 'en.json', 'utf8'));
const ar = JSON.parse(fs.readFileSync(p + 'ar.json', 'utf8'));
const enK = Object.keys(en), arK = Object.keys(ar);
const enS = new Set(enK);

const missing = JSON.parse(fs.readFileSync(p + 'ar.missing.json', 'utf8'));
const newSet = new Set(missing);
const kept = arK.filter(k => !newSet.has(k));
const keptEn = enK.filter(k => !newSet.has(k));
console.log('kept count:', kept.length, 'expected:', enK.length - missing.length);
console.log('kept order == en relative order:', JSON.stringify(kept) === JSON.stringify(keptEn));
const tail = arK.slice(-missing.length);
console.log('tail == missing.json order:', JSON.stringify(tail) === JSON.stringify(missing));
console.log('tail strictly increasing in en index:',
  tail.every((k, i) => i === 0 || enK.indexOf(k) > enK.indexOf(tail[i - 1])));

// keywords meta
const html = fs.readFileSync('index.html', 'utf8');
const kw = html.match(/<meta[^>]*name="keywords"[^>]*>/i);
console.log('index.html keywords meta:', kw ? kw[0] : 'none');
for (const [k, v] of Object.entries(en)) {
  if (typeof v === 'string' && /messi/i.test(v) && /ronaldo/i.test(v) && /keyword/i.test(v))
    console.log('en candidate:', JSON.stringify(k), JSON.stringify(v));
}
