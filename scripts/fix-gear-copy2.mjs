import fs from "node:fs";
const ROOT = "D:/Projects/ronaldo-stats/";
const OLD = "a 2006-07 home shirt";
const NEW = "a Portugal national team shirt";

// --- the English shells --------------------------------------------------------
{
  const PAGES = ["index", "dashboard", "goalsbyyear", "goalsbyseason", "timeline", "achievements",
    "birthday", "latest-goal", "champions-league", "gear", "real-madrid", "ronaldo-vs-messi"];
  let n = 0;
  for (const p of PAGES) {
    const file = ROOT + p + ".html";
    let t = fs.readFileSync(file, "utf8");
    const before = t;
    t = t.split(OLD).join(NEW);
    if (t !== before) { fs.writeFileSync(file, t, "utf8"); n++; }
  }
  console.log("ok  " + n + " shells: the gear copy names the shirt that is sold");
}

// --- the dictionaries: the key is the English text ---------------------------
{
  const SHELL = ROOT + "src/i18n/shell/";
  for (const lang of ["es", "pt", "fr", "ar", "bn", "hi", "ro", "uz"]) {
    const file = SHELL + lang + ".json";
    const dict = JSON.parse(fs.readFileSync(file, "utf8"));
    const out = {};
    let n = 0;
    for (const [k, v] of Object.entries(dict)) {
      if (k.includes(OLD)) { out[k.split(OLD).join(NEW)] = v; n++; }
      else out[k] = v;
    }
    const sorted = {};
    for (const k of Object.keys(out).sort()) sorted[k] = out[k];
    fs.writeFileSync(file, JSON.stringify(sorted, null, 1), "utf8");
    console.log("  " + lang + ": " + n + " keys renamed");
  }
}
