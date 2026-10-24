/**
 * Merge the gear card translations into the shell dictionaries.
 *
 *   node scripts/merge-gear-i18n.mjs
 *
 * The gear cards carry the wording of the store: the product names, the
 * photograph descriptions, the price note and the two notes that explain where
 * the picture and the price come from. Those sentences live in
 * scripts/gear-i18n.json in every language; this writes them into
 * src/i18n/shell/<lang>.json so the page generator can translate the English
 * page into the eight localized ones.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, "$1"), "..");
const SHELL = path.join(ROOT, "src", "i18n", "shell");
const table = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts", "gear-i18n.json"), "utf8"));

const LANGS = ["es","pt","fr"];
let added = 0;
for (const lang of LANGS) {
  const file = path.join(SHELL, lang + ".json");
  const dict = JSON.parse(fs.readFileSync(file, "utf8"));
  let n = 0;
  for (const [en, values] of Object.entries(table)) {
    const value = values[lang];
    if (!value) { console.error("  (" + lang + ") no translation for: " + en); continue; }
    if (dict[en] === undefined) { dict[en] = value; n++; }
    else if (dict[en] !== value) console.warn("  (" + lang + ") kept the existing translation for: " + en);
  }
  // keep the file sorted the way the generator writes it
  const sorted = {};
  for (const k of Object.keys(dict).sort()) sorted[k] = dict[k];
  fs.writeFileSync(file, JSON.stringify(sorted, null, 1), "utf8");
  added += n;
  console.log("  " + lang + ": " + n + " new strings (" + Object.keys(sorted).length + " in total)");
}
console.log("\n" + added + " strings written into the eight dictionaries");
