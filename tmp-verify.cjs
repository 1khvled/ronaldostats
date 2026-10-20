const fs = require('fs');
const p = 'src/i18n/shell/';
const raw = fs.readFileSync(p + 'ar.json');
const s = raw.toString('utf8');
const en = JSON.parse(fs.readFileSync(p + 'en.json', 'utf8'));
const ar = JSON.parse(s);

const enK = Object.keys(en), arK = Object.keys(ar);
const enS = new Set(enK), arS = new Set(arK);
console.log('en keys:', enK.length, '| ar keys:', arK.length);
console.log('missing in ar:', JSON.stringify(enK.filter(k => !arS.has(k))));
console.log('extra in ar  :', JSON.stringify(arK.filter(k => !enS.has(k))));
console.log('duplicates in ar:', arK.length - new Set(arK).size);
console.log('parses: yes');
console.log('BOM:', raw[0] === 0xEF && raw[1] === 0xBB && raw[2] === 0xBF);
console.log('U+FFFD present:', s.includes('\uFFFD'));
const dir = [];
for (const ch of s) {
  const c = ch.codePointAt(0);
  if (c === 0x200e || c === 0x200f || (c >= 0x202a && c <= 0x202e) || (c >= 0x2066 && c <= 0x2069) || c === 0x061c)
    dir.push('U+' + c.toString(16).toUpperCase());
}
console.log('directional marks:', dir.length ? [...new Set(dir)].join(',') : 'none');
console.log('CRLF present:', s.includes('\r\n'));
console.log('ends with newline:', s.endsWith('\n'));
console.log('round-trip stable:', JSON.stringify(JSON.parse(s), null, 2) + '\n' === s);
// the 56 new keys must sit at the tail, in en.json relative order
const tail = arK.slice(-56);
console.log('tail matches en relative order:', tail.every((k, i) => enK.indexOf(k) < (i ? enK.indexOf(tail[i - 1]) : -1)));
// shared keys keep en.json relative order
const shared = arK.filter(k => enS.has(k));
const sharedEn = enK.filter(k => shared.includes(k));
console.log('shared order preserved:', JSON.stringify(shared) === JSON.stringify(sharedEn));
// no empty values
console.log('empty values:', arK.filter(k => !ar[k] || !String(ar[k]).trim()));
// digits: check the new keys still carry the same digit sequences as the English source
const missing = JSON.parse(fs.readFileSync(p + 'ar.missing.json', 'utf8'));
const digits = (x) => (x.match(/\d+(?:[.,]\d+)?/g) || []);
let digitMismatch = [];
for (const k of missing) {
  const a = digits(k).join('|'), b = digits(ar[k]).join('|');
  if (a !== b) digitMismatch.push([k, a, b]);
}
console.log('digit-sequence mismatches in new keys:', JSON.stringify(digitMismatch, null, 1));
// latin-script checks
for (const k of missing) {
  const v = ar[k];
  if (/Ballon/i.test(k) && !/Ballon/.test(v)) console.log('Ballon not latin in', k, '->', v);
}
console.log('keywords meta:', JSON.stringify(Object.entries(ar).filter(([k]) => /keyword/i.test(k))));
