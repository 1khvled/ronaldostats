import fs from "node:fs";
import path from "node:path";
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, "$1"), "..");
const SHELL = path.join(ROOT, "src", "i18n", "shell");
const LANGS = ["es", "pt", "fr", "ar", "bn", "hi", "ro", "uz"];

const en = JSON.parse(fs.readFileSync(path.join(SHELL, "en.json"), "utf8"));

// the day the dictionaries still hold: it is the day in the "Updated ..." entry
let oldDay = null;
let stamp = null;
for (const lang of LANGS) {
  const dict = JSON.parse(fs.readFileSync(path.join(SHELL, lang + ".json"), "utf8"));
  for (const k of Object.keys(dict)) {
    const m = k.match(/^Updated (\d{1,2}) ([A-Z][a-z]+) (\d{4})$/);
    if (m) { oldDay = m[1]; stamp = m[0]; break; }
  }
  if (oldDay) break;
}
if (!oldDay) { console.log("  (no dated stamp in the dictionaries - nothing to do)"); process.exit(0); }
console.log("  the dictionaries hold \"" + stamp + "\"");

// the English strings whose day changed: the same month and year, a new day
const moved = [];
for (const key of Object.keys(en)) {
  const m = key.match(/\b(\d{1,2}) ([A-Z][a-z]+) (\d{4})\b/);
  if (!m || m[1] === oldDay) continue;
  const oldKey = key.replace(m[0], oldDay + " " + m[2] + " " + m[3]);
  moved.push({ oldKey, newKey: key, oldDay, newDay: m[1] });
}
console.log("  the English strings that moved: " + moved.length);

for (const lang of LANGS) {
  const file = path.join(SHELL, lang + ".json");
  const dict = JSON.parse(fs.readFileSync(file, "utf8"));
  let n = 0;
  for (const m of moved) {
    if (dict[m.oldKey] === undefined) continue;
    const value = String(dict[m.oldKey]).split(m.oldDay).join(m.newDay);
    delete dict[m.oldKey];
    dict[m.newKey] = value;
    n++;
  }
  const sorted = {};
  for (const k of Object.keys(dict).sort()) sorted[k] = dict[k];
  fs.writeFileSync(file, JSON.stringify(sorted, null, 1), "utf8");
  console.log("  " + lang + ": " + n + " strings moved to the new day");
}
