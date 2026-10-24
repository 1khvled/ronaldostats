import fs from "node:fs";
import path from "node:path";
const ROOT = "D:/Projects/ronaldo-stats/";
const LANGS = ["es","pt","fr"];
const PAGES = ["index", "dashboard", "goalsbyyear", "goalsbyseason", "timeline", "achievements",
  "birthday", "latest-goal", "champions-league", "gear", "real-madrid", "ronaldo-vs-messi"];

// the earlier blanket replacement caught these two longer strings
const COPY = [
  ["⚔️ Real Madrid years", "🏟️ Ronaldo at Real Madrid"],
  ["Ronaldo Real Madrid years", "Ronaldo at Real Madrid"],
];
const T = {
  es: { "🏟️ Ronaldo at Real Madrid": "🏟️ Ronaldo en el Real Madrid", "Ronaldo at Real Madrid": "Ronaldo en el Real Madrid" },
  pt: { "🏟️ Ronaldo at Real Madrid": "🏟️ Ronaldo no Real Madrid", "Ronaldo at Real Madrid": "Ronaldo no Real Madrid" },
  fr: { "🏟️ Ronaldo at Real Madrid": "🏟️ Ronaldo au Real Madrid", "Ronaldo at Real Madrid": "Ronaldo au Real Madrid" },
};

let n = 0;
for (const p of PAGES) {
  const f = path.join(ROOT, p + ".html");
  let t = fs.readFileSync(f, "utf8");
  const before = t;
  for (const [a, b] of COPY) t = t.split(a).join(b);
  if (t !== before) { fs.writeFileSync(f, t, "utf8"); n++; }
}
console.log("ok  " + n + " English shells: the last two mangled labels are fixed");

{
  const dir = path.join(ROOT, "src/i18n/shell");
  for (const lang of LANGS) {
    const f = path.join(dir, lang + ".json");
    const d = JSON.parse(fs.readFileSync(f, "utf8"));
    let k = 0;
    for (const [a, b] of COPY) {
      if (!(a in d)) continue;
      delete d[a];
      d[b] = T[lang][b];
      k++;
    }
    // the two keys the old markup used
    for (const [a, b] of [["⚔️ vs Real Madrid", "🏟️ Ronaldo at Real Madrid"], ["Ronaldo vs Real Madrid", "Ronaldo at Real Madrid"]]) {
      if (!(a in d)) continue;
      delete d[a];
      d[b] = T[lang][b];
      k++;
    }
    fs.writeFileSync(f, JSON.stringify(d, null, 2) + "\n", "utf8");
    console.log("ok  " + lang + ": " + k + " keys updated");
  }
}
