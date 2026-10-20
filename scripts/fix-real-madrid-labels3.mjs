import fs from "node:fs";
import path from "node:path";
const ROOT = "D:/Projects/ronaldo-stats/";
const LANGS = ["es", "pt", "fr", "ar", "bn", "hi", "ro", "uz"];

const T = {
  es: "🏟️ Ronaldo en el Real Madrid",
  pt: "🏟️ Ronaldo no Real Madrid",
  fr: "🏟️ Ronaldo au Real Madrid",
  ar: "🏟️ رونالدو في ريال مدريد",
  bn: "🏟️ রিয়াল মাদ্রিদে রোনালদো",
  hi: "🏟️ रियल मैड्रिड में रोनाल्डो",
  ro: "🏟️ Ronaldo la Real Madrid",
  uz: "🏟️ Real Madridda Ronaldo",
};

const dir = path.join(ROOT, "src/i18n/shell");
for (const lang of LANGS) {
  const f = path.join(dir, lang + ".json");
  const d = JSON.parse(fs.readFileSync(f, "utf8"));
  const oldKeys = Object.keys(d).filter((k) => /Real Madrid/.test(k) && /⚔️|vs |Ronaldo/.test(k) && /El Clásico|Clásico|Clásico/.test(k));
  const newKey = "🏟️ Ronaldo at Real Madrid";
  let n = 0;
  for (const k of oldKeys) {
    if (k === newKey) continue;
    delete d[k];
    d[newKey] = T[lang];
    n++;
  }
  if (!(newKey in d)) { d[newKey] = T[lang]; n++; }
  fs.writeFileSync(f, JSON.stringify(d, null, 2) + "\n", "utf8");
  console.log("ok  " + lang + ": " + n + " explore-title keys updated");
}
