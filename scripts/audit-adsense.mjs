// audit-adsense.mjs — one publisher id for the whole site.
//
//   node scripts/audit-adsense.mjs
//
// AdSense pays on the publisher id in the script tag, so a page carrying a
// different one sends its revenue somewhere else. public/ads.txt must agree
// with the pages, or the site is not authorised to serve those ads.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const LANGS = ["es", "pt", "fr", "ar", "bn", "hi", "ro", "uz"];
const PAGES = ["index", "dashboard", "goalsbyyear", "goalsbyseason", "timeline", "trophies",
  "champions-league", "gear", "real-madrid", "ronaldo-vs-messi"];

const files = [];
for (const p of PAGES) files.push(p + ".html");
for (const l of LANGS) for (const p of PAGES) files.push(l + "/" + p + ".html");

const adsTxt = fs.readFileSync(path.join(ROOT, "public", "ads.txt"), "utf8");
const m = adsTxt.match(/pub-(\d+)/);
if (!m) { console.error("[FAIL] public/ads.txt has no publisher id"); process.exit(1); }
const pub = m[1];

let problems = 0;
for (const f of files) {
  const t = fs.readFileSync(path.join(ROOT, f), "utf8");
  const ids = [...new Set(t.match(/ca-pub-\d+/g) || [])];
  // the gear page carries no display ads by design (it is the affiliate
  // store), so a missing script is fine; a WRONG id never is.
  if (!ids.length) continue;
  if (ids.length > 1) { console.error("[FAIL] " + f + " has several publisher ids: " + ids.join(", ")); problems++; continue; }
  if (ids[0] !== "ca-pub-" + pub) { console.error("[FAIL] " + f + " uses " + ids[0] + " but ads.txt declares pub-" + pub); problems++; }
}
if (problems) { console.error(problems + " AdSense problem(s)."); process.exit(1); }
console.log("[OK] every page that carries AdSense uses ca-pub-" + pub + ", matching public/ads.txt.");
