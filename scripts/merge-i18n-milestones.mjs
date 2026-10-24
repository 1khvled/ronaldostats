/**
 * Merge the translated milestone strings into the locale shell dictionaries.
 *
 *   node scripts/merge-i18n-milestones.mjs
 *
 * The dictionaries are the translation of the English shell: they must carry
 * exactly the keys of src/i18n/shell/en.json. This adds the strings the new
 * milestone copy introduced, translates the ones that were still English, and
 * drops the ones the copy replaced.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TASKS = "C:/Users/Abdelli/AppData/Local/Temp/opencode/i18n/";
const LANGS = ["es","pt","fr"];

const en = JSON.parse(fs.readFileSync(path.join(ROOT, "src/i18n/shell/en.json"), "utf8"));
const enKeys = Object.keys(en);

let merged = 0;
const skipped = [];

for (const lang of LANGS) {
  const outPath = TASKS + lang + "-out3.json";
  if (!fs.existsSync(outPath)) { skipped.push(lang + " (no output)"); continue; }
  const out = JSON.parse(fs.readFileSync(outPath, "utf8"));

  const p = path.join(ROOT, "src/i18n/shell/" + lang + ".json");
  const dict = JSON.parse(fs.readFileSync(p, "utf8"));

  // the milestone copy changed: drop the keys it replaced
  let dropped = 0;
  for (const k of Object.keys(dict)) {
    if (!(k in en)) { delete dict[k]; dropped++; }
  }
  // and add the new ones
  let added = 0;
  for (const [k, v] of Object.entries(out)) {
    if (!(k in dict)) added++;
    dict[k] = v;
  }

  // the dictionary must carry exactly the keys of the English source
  const keys = Object.keys(dict).sort();
  const extra = keys.filter((k) => !(k in en));
  const missing = enKeys.filter((k) => !(k in dict));
  if (extra.length || missing.length) {
    console.log("  [SKIP] " + lang + ": " + extra.length + " extra, " + missing.length + " missing");
    for (const k of missing.slice(0, 6)) console.log("      missing: " + JSON.stringify(k).slice(0, 92));
    for (const k of extra.slice(0, 6)) console.log("      extra:   " + JSON.stringify(k).slice(0, 92));
    skipped.push(lang);
    continue;
  }

  // the hand-maintained dictionaries use CRLF
  const body = JSON.stringify(Object.fromEntries(keys.map((k) => [k, dict[k]])), null, 1).replace(/\n/g, "\r\n");
  fs.writeFileSync(p, body, "utf8");
  merged++;
  console.log("  [ok] " + lang + ": " + added + " added, " + dropped + " dropped, " + keys.length + " keys");
}

if (skipped.length) console.log("\nnot merged: " + skipped.join(", "));
console.log("\nmerged: " + merged + " of " + LANGS.length);
