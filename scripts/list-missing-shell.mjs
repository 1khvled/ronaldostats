// Write the exact list of strings each language is still missing into
// src/i18n/shell/<lang>.missing.json, so a translator can fill exactly
// those and nothing else.
import fs from "node:fs";
import path from "node:path";
const DIR = "D:/Projects/ronaldo-stats/src/i18n/shell";
const LANGS = ["es","pt","fr"];
const en = JSON.parse(fs.readFileSync(path.join(DIR, "en.json"), "utf8"));
const enKeys = Object.keys(en);
for (const lang of LANGS) {
  const f = path.join(DIR, lang + ".json");
  if (!fs.existsSync(f)) { console.log(lang + ": no dictionary yet"); continue; }
  const dict = JSON.parse(fs.readFileSync(f, "utf8"));
  const missing = enKeys.filter((k) => !(k in dict));
  const extra = Object.keys(dict).filter((k) => !(k in en));
  fs.writeFileSync(path.join(DIR, lang + ".missing.json"), JSON.stringify(missing, null, 1), "utf8");
  console.log(lang + ": missing " + missing.length + ", extra " + extra.length);
}
