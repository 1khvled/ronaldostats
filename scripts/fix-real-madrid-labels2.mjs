import fs from "node:fs";
import path from "node:path";
const ROOT = "D:/Projects/ronaldo-stats/";
const LANGS = ["es","pt","fr"];

const t = fs.readFileSync(path.join(ROOT, "real-madrid.html"), "utf8");
console.log("=== the mangled / leftover strings in the English shell ===");
t.split(/\r?\n/).forEach((l, k) => {
  if (/Real Madrid years|vs Real Madrid/.test(l)) console.log("  " + (k + 1) + ": " + l.trim().slice(0, 170));
});

// the explore card in the markup carries the old title
const FIXES = [
  ["⚔️ Ronaldo Real Madrid years (El Clásico)", "🏟️ Ronaldo at Real Madrid"],
  ["vs Real Madrid", "Real Madrid years"],
];
{
  const P = path.join(ROOT, "real-madrid.html");
  let s = fs.readFileSync(P, "utf8");
  let n = 0;
  for (const [a, b] of FIXES) { if (s.includes(a)) { s = s.split(a).join(b); n++; } }
  fs.writeFileSync(P, s, "utf8");
  console.log("ok  real-madrid.html: " + n + " strings fixed");
}

// the eight dictionaries
const T = {
  es: ["🏟️ Ronaldo en el Real Madrid", "Años en el Real Madrid"],
  pt: ["🏟️ Ronaldo no Real Madrid", "Anos no Real Madrid"],
  fr: ["🏟️ Ronaldo au Real Madrid", "Les années au Real Madrid"],
};
{
  const dir = path.join(ROOT, "src/i18n/shell");
  for (const lang of LANGS) {
    const f = path.join(dir, lang + ".json");
    const d = JSON.parse(fs.readFileSync(f, "utf8"));
    let n = 0;
    if ("⚔️ Ronaldo Real Madrid years (El Clásico)" in d) {
      delete d["⚔️ Ronaldo Real Madrid years (El Clásico)"];
      d["🏟️ Ronaldo at Real Madrid"] = T[lang][0];
      n++;
    }
    if ("vs Real Madrid" in d) {
      delete d["vs Real Madrid"];
      d["Real Madrid years"] = T[lang][1];
      n++;
    }
    fs.writeFileSync(f, JSON.stringify(d, null, 2) + "\n", "utf8");
    console.log("ok  " + lang + ": " + n + " keys fixed");
  }
}
