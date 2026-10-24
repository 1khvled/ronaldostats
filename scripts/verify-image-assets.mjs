/**
 * Verify the RonaldoStats image assets.
 *
 *   node scripts/verify-image-assets.mjs
 *
 * - lists every file under public/img/ and public/img/gear/
 * - asserts the 16 stale Messi "era-*" files are gone and are not referenced
 * - asserts every /img/... reference in the HTML resolves to a real file
 * - asserts the five cabinet photos and the eight gear photos are real
 *   photographs: > 4 KB, magic bytes matching the extension and the
 *   expected pixel dimensions (parsed straight from the JPEG / PNG / WebP
 *   headers, no image library required)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const IMG = path.join(ROOT, 'public/img');
const GEAR = path.join(IMG, 'gear');

const MIN_BYTES = 4 * 1024;

const STALE_ERA = [
  'era-2008-olympic.webp', 'era-2011.webp', 'era-2011-wembley.webp', 'era-2012-ballon.webp',
  'era-2014-stare.webp', 'era-2015-supercup.webp', 'era-2016.webp', 'era-2019-ballon.webp',
  'era-2021-ballon7.webp', 'era-2021-copa.webp', 'era-2021-psg-signing.webp', 'era-2021-tears.webp',
  'era-2022.webp', 'era-2023-ballon8.webp', 'era-2023-miami.webp', 'era-2024-copa.webp',
];

const CABINET = [
  { file: 'cab-ucl-2026.webp', w: 800, h: 600 },
  { file: 'cab-ballon-2026.webp', w: 800, h: 600 },
  { file: 'cab-liga.webp', w: 800, h: 600 },
  { file: 'cab-wc.webp', w: 800, h: 600 },
  { file: 'cab-copa.webp', w: 800, h: 600 },
];

const GEAR_FILES = [
  'ronaldo-home-jersey.jpg', 'ronaldo-away-jersey.jpg', 'ronaldo-cape-jersey.jpg',
  'ronaldo-boot.jpg', 'ronaldo-ball.jpg', 'ronaldo-hoodie.jpg', 'ronaldo-cap.jpg',
  'ronaldo-poster.jpg',
];

const SHOWDOWN = { file: 'ronaldo-vs-messi.webp', w: 1107, h: 800 };

let failures = 0;
const fail = (msg) => { failures++; console.log(`  FAIL  ${msg}`); };
const pass = (msg) => console.log(`  ok    ${msg}`);

/* ----------------------------------------------------------------- headers */
function magic(buf) {
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'jpeg';
  if (buf.length >= 8 && buf.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'png';
  if (buf.length >= 12 && buf.slice(0, 4).toString('ascii') === 'RIFF' && buf.slice(8, 12).toString('ascii') === 'WEBP') return 'webp';
  return 'unknown';
}

function jpegSize(buf) {
  let i = 2;
  while (i < buf.length - 9) {
    if (buf[i] !== 0xff) { i++; continue; }
    const marker = buf[i + 1];
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) };
    }
    i += 2 + buf.readUInt16BE(i + 2);
  }
  return null;
}

function pngSize(buf) {
  return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
}

function webpSize(buf) {
  const chunk = buf.slice(12, 16).toString('ascii');
  if (chunk === 'VP8X') {
    const w = 1 + (buf[24] | (buf[25] << 8) | (buf[26] << 16));
    const h = 1 + (buf[27] | (buf[28] << 8) | (buf[29] << 16));
    return { w, h };
  }
  if (chunk === 'VP8 ') {
    // frame header: 3-byte tag, 3-byte sync code (0x9d 0x01 0x2a), 2-byte width, 2-byte height
    const w = buf.readUInt16LE(26) & 0x3fff;
    const h = buf.readUInt16LE(28) & 0x3fff;
    return { w, h };
  }
  if (chunk === 'VP8L') {
    const b = buf.readUInt32LE(21);
    return { w: (b & 0x3fff) + 1, h: ((b >> 14) & 0x3fff) + 1 };
  }
  return null;
}

function dimensions(buf, kind) {
  if (kind === 'jpeg') return jpegSize(buf);
  if (kind === 'png') return pngSize(buf);
  if (kind === 'webp') return webpSize(buf);
  return null;
}

/* ------------------------------------------------------------------ checks */
function checkPhoto(rel, expected) {
  const abs = path.join(IMG, rel);
  const label = `public/img/${rel.replace(/\\/g, '/')}`;
  if (!fs.existsSync(abs)) return fail(`${label} — missing`);
  const buf = fs.readFileSync(abs);
  const ext = path.extname(abs).slice(1).toLowerCase();
  const kind = magic(buf);
  const expectedKind = ext === 'jpg' || ext === 'jpeg' ? 'jpeg' : ext;
  if (kind !== expectedKind) return fail(`${label} — magic bytes say "${kind}", expected "${expectedKind}"`);
  if (buf.length < MIN_BYTES) return fail(`${label} — only ${buf.length} bytes (< 4 KB)`);
  const dim = dimensions(buf, kind);
  if (!dim) return fail(`${label} — could not parse ${kind} dimensions`);
  if (expected && (dim.w !== expected.w || dim.h !== expected.h)) {
    return fail(`${label} — ${dim.w}x${dim.h}, expected ${expected.w}x${expected.h}`);
  }
  pass(`${label} — ${kind}, ${dim.w}x${dim.h}, ${(buf.length / 1024).toFixed(1)} KB`);
}

function walk(dir, base = dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(abs, base, out);
    else out.push({ rel: path.relative(base, abs).replace(/\\/g, '/'), abs, size: fs.statSync(abs).size });
  }
  return out;
}

/* -------------------------------------------------------------------- run */
console.log('== 1. stale Messi era files must be gone ==');
for (const f of STALE_ERA) {
  if (fs.existsSync(path.join(IMG, f))) fail(`public/img/${f} still exists`);
  else pass(`public/img/${f} deleted`);
}

console.log('\n== 2. five cabinet photographs ==');
for (const c of CABINET) checkPhoto(c.file, c);

console.log('\n== 3. showdown photograph ==');
checkPhoto(SHOWDOWN.file, SHOWDOWN);

console.log('\n== 4. eight gear product photographs ==');
for (const g of GEAR_FILES) checkPhoto(`gear/${g}`, { w: 800, h: 800 });

console.log('\n== 5. HTML references resolve ==');
const htmlFiles = [];
const LOCALES = ["es","fr","pt"];
for (const loc of LOCALES) {
  const dir = path.join(ROOT, loc);
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir)) if (f.endsWith('.html')) htmlFiles.push(path.join(dir, f));
}
for (const entry of fs.readdirSync(ROOT, { withFileTypes: true })) {
  if (entry.isFile() && entry.name.endsWith('.html')) htmlFiles.push(path.join(ROOT, entry.name));
}
const missingRefs = new Map();
const staleRefs = new Map();
let refCount = 0;
for (const hf of htmlFiles) {
  const html = fs.readFileSync(hf, 'utf8');
  for (const m of html.matchAll(/\/img\/([A-Za-z0-9._\-\/]+)/g)) {
    refCount++;
    const target = path.join(IMG, m[1]);
    if (!fs.existsSync(target)) {
      const key = m[1];
      if (!missingRefs.has(key)) missingRefs.set(key, []);
      missingRefs.get(key).push(path.relative(ROOT, hf).replace(/\\/g, '/'));
    }
    if (STALE_ERA.includes(path.basename(m[1]))) {
      const key = m[1];
      if (!staleRefs.has(key)) staleRefs.set(key, []);
      staleRefs.get(key).push(path.relative(ROOT, hf).replace(/\\/g, '/'));
    }
  }
}
if (staleRefs.size) for (const [k, v] of staleRefs) fail(`${k} still referenced in ${v.join(', ')}`);
else pass(`no HTML references any of the 16 deleted era-* files (${refCount} /img/ references scanned)`);
if (missingRefs.size) for (const [k, v] of missingRefs) fail(`dangling reference /img/${k} in ${v.join(', ')}`);
else pass('every /img/... reference in the HTML resolves to a file on disk');

console.log('\n== 6. final inventory ==');
const all = walk(IMG).sort((a, b) => a.rel.localeCompare(b.rel));
for (const f of all) {
  console.log(`  ${String(f.size).padStart(8)} B  public/img/${f.rel}`);
}
console.log(`\n  ${all.length} files under public/img/ (${all.filter((f) => f.rel.startsWith('gear/')).length} in public/img/gear/)`);

console.log(failures ? `\nRESULT: ${failures} FAILURE(S)` : '\nRESULT: all checks passed');
process.exit(failures ? 1 : 0);
