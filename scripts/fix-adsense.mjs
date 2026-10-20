import fs from "node:fs";
import path from "node:path";
const ROOT = "D:/Projects/ronaldo-stats/";
const CORRECT = "ca-pub-8397501846754760";
const WRONG = "ca-pub-8397501846854760";

const files = [];
for (const f of fs.readdirSync(ROOT)) if (f.endsWith(".html")) files.push(f);
for (const d of ["es", "pt", "fr", "ar", "bn", "hi", "ro", "uz"]) {
  for (const f of fs.readdirSync(path.join(ROOT, d))) if (f.endsWith(".html")) files.push(d + "/" + f);
}
let fixed = 0;
for (const f of files) {
  const p = path.join(ROOT, f);
  const t = fs.readFileSync(p, "utf8");
  if (!t.includes(WRONG)) continue;
  fs.writeFileSync(p, t.split(WRONG).join(CORRECT), "utf8");
  fixed++;
  console.log("fixed " + f);
}
console.log("files fixed:", fixed);

// ---- the audit -------------------------------------------------------------
const audit = `// audit-adsense.mjs — one publisher id for the whole site.
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
const PAGES = ["index", "dashboard", "goalsbyyear", "goalsbyseason", "timeline", "achievements",
  "birthday", "latest-goal", "champions-league", "gear", "real-madrid", "ronaldo-vs-messi"];

const files = [];
for (const p of PAGES) files.push(p + ".html");
for (const l of LANGS) for (const p of PAGES) files.push(l + "/" + p + ".html");

const adsTxt = fs.readFileSync(path.join(ROOT, "public", "ads.txt"), "utf8");
const m = adsTxt.match(/pub-(\\d+)/);
if (!m) { console.error("[FAIL] public/ads.txt has no publisher id"); process.exit(1); }
const pub = m[1];

let problems = 0;
for (const f of files) {
  const t = fs.readFileSync(path.join(ROOT, f), "utf8");
  const ids = [...new Set(t.match(/ca-pub-\\d+/g) || [])];
  if (!ids.length) { console.error("[FAIL] " + f + " has no AdSense script"); problems++; continue; }
  if (ids.length > 1) { console.error("[FAIL] " + f + " has several publisher ids: " + ids.join(", ")); problems++; continue; }
  if (ids[0] !== "ca-pub-" + pub) { console.error("[FAIL] " + f + " uses " + ids[0] + " but ads.txt declares pub-" + pub); problems++; }
}
if (problems) { console.error(problems + " AdSense problem(s)."); process.exit(1); }
console.log("[OK] all " + files.length + " pages use ca-pub-" + pub + ", matching public/ads.txt.");
`;
fs.writeFileSync(path.join(ROOT, "scripts", "audit-adsense.mjs"), audit, "utf8");
console.log("ok  scripts/audit-adsense.mjs written");

// ---- add it to the gate ---------------------------------------------------
{
  const P = path.join(ROOT, "scripts", "verify-all.mjs");
  let t = fs.readFileSync(P, "utf8");
  const EOL = t.includes("\r\n") ? "\r\n" : "\n";
  const find = `step(run(process.execPath, ["scripts/smoke-i18n.mjs"], "i18n runtime smoke test"), "i18n runtime smoke test");`;
  const replace = find + EOL + `step(run(process.execPath, ["scripts/audit-adsense.mjs"], "adsense audit"), "adsense audit");`;
  if (!t.includes(find)) { console.error("verify-all anchor not found"); process.exit(1); }
  t = t.replace(find, replace);
  fs.writeFileSync(P, t, "utf8");
  console.log("ok  verify-all.mjs: the adsense audit is a gate");
}
