/**
 * Replace the drawn club crests and the drawn career cards with the real
 * thing: the actual badges and actual photographs of Ronaldo.
 *
 *   node scripts/fetch-real-images.mjs            (crests only)
 *   node scripts/fetch-real-images.mjs --photos   (crests and career cards)
 *
 * Crests: the public crest service at crests.football-data.org carries Real
 * Madrid, Manchester United, Juventus, Portugal and Barcelona; the two it does
 * not carry (Sporting CP and Al Nassr) come from the club's own crest file on
 * Wikipedia. Club crests are trademarks of their owners.
 *
 * Career cards: every card is a photograph of Ronaldo from that era, taken
 * from Wikimedia Commons under CC0, public domain, CC BY or CC BY-SA. Each
 * one is credited in public/img/CREDITS.md.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const H = { "User-Agent": "RonaldoStats/1.0 (https://www.ronaldostats.site; build script)" };
const withPhotos = process.argv.includes("--photos");

let sharp = null;
try {
  const { createRequire } = await import("node:module");
  const require = createRequire(import.meta.url);
  sharp = require("sharp");
} catch (e) {
  console.log("sharp is not installed in this repo; install it temporarily to resize the images:");
  console.log("  npm install --no-save sharp");
  process.exit(1);
}

// ---------------------------------------------------------------------------
// the crests
// ---------------------------------------------------------------------------
const CRESTS = [
  ["real-madrid.png", 86, "Real Madrid"],
  ["man-utd.png", 33, "Manchester United"],
  ["juventus.png", 109, "Juventus"],
  ["portugal.png", 16, "Portugal"],
  ["barcelona.png", 81, "FC Barcelona"],
];
const OUT = path.join(ROOT, "public/img/teams/");
fs.mkdirSync(OUT, { recursive: true });

for (const [file, id, label] of CRESTS) {
  try {
    const r = await fetch("https://crests.football-data.org/" + id + ".png", { headers: H, redirect: "follow" });
    const buf = Buffer.from(await r.arrayBuffer());
    const meta = await sharp(buf).metadata();
    if (!meta.width || meta.width < 40) { console.log("  " + file + ": no crest at that id"); continue; }
    const out = await sharp(buf)
      .resize({ width: 256, height: 256, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ compressionLevel: 9 })
      .toBuffer();
    fs.writeFileSync(OUT + file, out);
    console.log("  ok  " + file.padEnd(18) + label.padEnd(22) + meta.width + "x" + meta.height);
  } catch (e) { console.log("  " + file + ": " + e.message.slice(0, 50)); }
}

// the two the service does not carry
for (const [file, page] of [["sporting.png", "Sporting_CP"], ["al-nassr.png", "Al_Nassr_FC"]]) {
  try {
    const j = await (await fetch("https://en.wikipedia.org/api/rest_v1/page/summary/" + page, { headers: H })).json();
    const src = j.originalimage && j.originalimage.source;
    if (!src) { console.log("  " + file + ": no image on the Wikipedia page"); continue; }
    const buf = Buffer.from(await (await fetch(src, { headers: H })).arrayBuffer());
    const meta = await sharp(buf).metadata();
    const out = await sharp(buf)
      .resize({ width: 256, height: 256, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ compressionLevel: 9 })
      .toBuffer();
    fs.writeFileSync(OUT + file, out);
    console.log("  ok  " + file.padEnd(18) + (j.title || page).padEnd(22) + meta.width + "x" + meta.height);
  } catch (e) { console.log("  " + file + ": " + e.message.slice(0, 50)); }
}

// ---------------------------------------------------------------------------
// the career cards
// ---------------------------------------------------------------------------
if (withPhotos) {
  const CARDS = [
    ["era-2002-sporting.webp", "Cristiano Ronaldo Sporting", /Sporting/i, /museu|museum|shirt|ball|logo|statue/i],
    ["era-2004-manutd.webp", "Cristiano Ronaldo Manchester United", /Manchester|United/i, /museu|museum|shirt|ball|logo/i],
    ["era-2008-ballon1.webp", "Cristiano Ronaldo 2008 Ballon d'Or", /2008|ballon/i, /museu|museum|shirt|ball|logo/i],
    ["era-2009-real.webp", "Cristiano Ronaldo Real Madrid", /Real Madrid/i, /museu|museum|shirt|ball|logo/i],
    ["era-2013-ballon3.webp", "Cristiano Ronaldo 2013", /2013|ballon/i, /museu|museum|shirt|ball|logo/i],
    ["era-2014-ballon4.webp", "Cristiano Ronaldo Ballon d'Or", /ballon/i, /museu|museum|shirt|ball|logo/i],
    ["era-2016-ballon5.webp", "Cristiano Ronaldo 2016", /2016|ballon/i, /museu|museum|shirt|ball|logo|entrenando/i],
    ["era-2017-ucl.webp", "Cristiano Ronaldo Champions League 2017", /2017|champions/i, /museu|museum|shirt|ball|logo/i],
    ["era-2018-juve.webp", "Cristiano Ronaldo Juventus", /Juventus/i, /museu|museum|shirt|ball|logo/i],
    ["era-2021-manutd.webp", "Cristiano Ronaldo Manchester United 2021", /2021|Manchester/i, /museu|museum|shirt|ball|logo/i],
    ["era-2023-alnassr.webp", "Cristiano Ronaldo Al Nassr", /nassr/i, /museu|museum|shirt|ball|logo/i],
    ["era-2026-record.webp", "Cristiano Ronaldo Al Nassr 2024", /nassr|2024|2025/i, /museu|museum|shirt|ball|logo/i],
  ];
  const ERA = path.join(ROOT, "public/img/era/");
  const ALLOWED = /^(CC0|Public domain|CC BY|CC BY-SA)/i;
  const used = new Set();

  for (const [file, query, prefer, reject] of CARDS) {
    const url = "https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=" +
      encodeURIComponent(query) + "&gsrnamespace=6&gsrlimit=30&prop=imageinfo&iiprop=url|extmetadata|mime&iiurlwidth=1600&format=json&origin=*";
    const j = await (await fetch(url, { headers: H })).json();
    let done = false;
    for (const p of Object.values((j.query && j.query.pages) || {})) {
      if (done) break;
      const ii = (p.imageinfo || [])[0];
      if (!ii || !/^image\/(jpeg|png|webp)$/.test(ii.mime || "")) continue;
      const em = ii.extmetadata || {};
      const lic = (em.LicenseShortName && em.LicenseShortName.value) || "";
      if (!ALLOWED.test(lic)) continue;
      if (!/Ronaldo/i.test(p.title)) continue;
      if (used.has(p.title)) continue;
      if (reject.test(p.title)) continue;
      if (prefer && !prefer.test(p.title)) continue;
      try {
        const r = await fetch(ii.thumburl, { headers: H });
        if (!r.ok) continue;
        const buf = Buffer.from(await r.arrayBuffer());
        const meta = await sharp(buf).metadata();
        if (!meta.width || meta.width < 800) continue;
        const out = await sharp(buf).resize(1200, 675, { fit: "cover", position: "attention" }).webp({ quality: 82 }).toBuffer();
        fs.writeFileSync(ERA + file, out);
        used.add(p.title);
        console.log("  ok  " + file.padEnd(24) + p.title.replace("File:", "").slice(0, 52) + "  " + lic);
        done = true;
      } catch (e) { /* try the next one */ }
    }
    if (!done) console.log("  --  " + file.padEnd(24) + "no usable photograph (the card keeps its current picture)");
    await new Promise((r) => setTimeout(r, 500));
  }
}
console.log("\ndone. Credit every photograph in public/img/CREDITS.md.");
