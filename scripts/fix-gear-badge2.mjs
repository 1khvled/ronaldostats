import fs from "node:fs";
import path from "node:path";
const ROOT = "D:/Projects/ronaldo-stats/";

// The badge text keeps its emoji, so the dictionary key does too.
const BADGE_OLD = "🐐 Iconic Cape";
const BADGE_NEW = "🐐 Iconic Shirt";
const CAT_OLD = "Matchday &amp; Celebration";   // the shell keeps the & escaped
const CAT_NEW = "Official Matchwear";           // already a key, used by the other jerseys

{
  const P = path.join(ROOT, "gear.html");
  let t = fs.readFileSync(P, "utf8");
  let n = 0;
  if (t.includes(CAT_OLD)) { t = t.split(CAT_OLD).join(CAT_NEW); n++; }
  fs.writeFileSync(P, t, "utf8");
  console.log("ok  gear.html: " + n + " category label fixed");
}

{
  const dir = path.join(ROOT, "src", "i18n", "shell");
  const badge = {
    es: "🐐 Camiseta icónica", pt: "🐐 Camisa icónica", fr: "🐐 Maillot emblématique",
    ar: "🐐 قميص أيقوني", bn: "🐐 আইকনিক জার্সি", hi: "🐐 आइकॉनिक जर्सी",
    ro: "🐐 Tricou iconic", uz: "🐐 Ikony futbolka",
  };
  for (const lang of Object.keys(badge)) {
    const f = path.join(dir, lang + ".json");
    const d = JSON.parse(fs.readFileSync(f, "utf8"));
    let n = 0;
    if (BADGE_OLD in d) { delete d[BADGE_OLD]; d[BADGE_NEW] = badge[lang]; n++; }
    if (CAT_OLD in d) { delete d[CAT_OLD]; n++; }
    fs.writeFileSync(f, JSON.stringify(d, null, 2) + "\n", "utf8");
    console.log("ok  " + lang + ": " + n + " keys fixed");
  }
}
