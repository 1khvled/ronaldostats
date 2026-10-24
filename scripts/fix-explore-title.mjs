import fs from "node:fs";
import path from "node:path";
const ROOT = "D:/Projects/ronaldo-stats/";
const LANGS = ["es","pt","fr"];
const OLD_KEY = "⚔️ Ronaldo vs Real Madrid (El Clásico)";
const NEW_KEY = "🏟️ Ronaldo at Real Madrid";
const T = {
  es: "🏟️ Ronaldo en el Real Madrid",
  pt: "🏟️ Ronaldo no Real Madrid",
  fr: "🏟️ Ronaldo au Real Madrid",
};
const dir = path.join(ROOT, "src/i18n/shell");
for (const lang of LANGS) {
  const f = path.join(dir, lang + ".json");
  const d = JSON.parse(fs.readFileSync(f, "utf8"));
  let n = 0;
  if (OLD_KEY in d) { delete d[OLD_KEY]; n++; }
  if (!(NEW_KEY in d)) { d[NEW_KEY] = T[lang]; n++; }
  fs.writeFileSync(f, JSON.stringify(d, null, 2) + "\n", "utf8");
  console.log("ok  " + lang + ": " + n + " explore-title keys updated");
}
