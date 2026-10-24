import fs from "node:fs";
import path from "node:path";
const ROOT = "D:/Projects/ronaldo-stats/";
const LANGS = ["es","pt","fr"];
const PAGES = ["index", "dashboard", "goalsbyyear", "goalsbyseason", "timeline", "achievements",
  "birthday", "latest-goal", "champions-league", "gear", "real-madrid", "ronaldo-vs-messi"];

// ---------------------------------------------------------------------------
// The page is Ronaldo's nine years AT Real Madrid. The slug and the label were
// the Messi page's: "vs Real Madrid" would mean Ronaldo against his own club.
// ---------------------------------------------------------------------------
const OLD = "real-madrid";
const NEW = "real-madrid";

// 1. rename the page files
for (const l of ["", ...LANGS]) {
  const dir = path.join(ROOT, l);
  const from = path.join(dir, OLD + ".html");
  const to = path.join(dir, NEW + ".html");
  if (fs.existsSync(from)) fs.renameSync(from, to);
}
console.log("ok  the nine page files renamed");

// 2. rewrite every reference
const files = [];
for (const p of PAGES) files.push(p + ".html");
for (const l of LANGS) for (const p of PAGES) files.push(l + "/" + p + ".html");
for (const f of fs.readdirSync(path.join(ROOT, "src"))) {
  if (f === "i18n") {
    for (const g of fs.readdirSync(path.join(ROOT, "src/i18n"))) files.push("src/i18n/" + g);
    for (const g of fs.readdirSync(path.join(ROOT, "src/i18n/shell"))) files.push("src/i18n/shell/" + g);
    continue;
  }
  files.push("src/" + f);
}
for (const f of fs.readdirSync(path.join(ROOT, "scripts"))) files.push("scripts/" + f);
for (const f of ["vercel.json", "public/llms.txt", "public/llms-full.txt"]) files.push(f);

let n = 0;
for (const f of files) {
  const p = path.join(ROOT, f);
  if (!fs.existsSync(p) || !fs.statSync(p).isFile()) continue;
  const before = fs.readFileSync(p, "utf8");
  if (!before.includes(OLD)) continue;
  fs.writeFileSync(p, before.split(OLD).join(NEW), "utf8");
  n++;
}
console.log("ok  " + n + " files: the slug is now /" + NEW);

// 3. the drawer's own label and badge
{
  const P = path.join(ROOT, "src/app.js");
  let t = fs.readFileSync(P, "utf8");
  const before = t;
  t = t.replace(/vsRealMadrid: "vs Real Madrid \(El Clásico\)"/g, 'vsRealMadrid: "Real Madrid years"');
  t = t.replace(/label: txt\.vsRealMadrid, badge: "26 Goals"/g, 'label: txt.vsRealMadrid, badge: "450 Goals"');
  fs.writeFileSync(P, t, "utf8");
  console.log(before === t ? "ok  app.js: the drawer label was already updated" : "ok  app.js: the drawer label and badge");
}

// 4. the explore link, in the nine dictionaries
const EXPLORE = {
  en: { t: "🏟️ Ronaldo at Real Madrid", d: "His nine years at Real Madrid: 450 goals, 311 in La Liga, four Champions League titles and 18 in the Clásico." },
  es: { t: "🏟️ Ronaldo en el Real Madrid", d: "Sus nueve años en el Real Madrid: 450 goles, 311 en La Liga, cuatro Champions League y 18 en el Clásico." },
  pt: { t: "🏟️ Ronaldo no Real Madrid", d: "Seus nove anos no Real Madrid: 450 gols, 311 na La Liga, quatro Champions League e 18 no Clássico." },
  fr: { t: "🏟️ Ronaldo au Real Madrid", d: "Ses neuf ans au Real Madrid : 450 buts, 311 en Liga, quatre Ligues des champions et 18 en Clásico." },
};
const OLD_EXPLORE_T = {
  en: "⚔️ Ronaldo vs Real Madrid", es: "⚔️ Ronaldo vs Real Madrid", pt: "⚔️ Ronaldo vs Real Madrid",
  fr: "⚔️ Ronaldo vs Real Madrid",

};
for (const lang of ["en", ...LANGS]) {
  const P = path.join(ROOT, "src/i18n", lang + ".js");
  let t = fs.readFileSync(P, "utf8");
  const oldT = OLD_EXPLORE_T[lang];
  if (!t.includes('t: "' + oldT + '"')) { console.log("  " + lang + ": explore title not found (" + oldT + ")"); continue; }
  t = t.replace('t: "' + oldT + '"', 't: ' + JSON.stringify(EXPLORE[lang].t));
  // the description
  t = t.replace(/(page: "real-madrid", t: [^\n]*?, d: \(\) => )"[^"]*"/, (m, head) => head + JSON.stringify(EXPLORE[lang].d));
  fs.writeFileSync(P, t, "utf8");
  console.log("ok  " + lang + ": the explore link now names the Real Madrid years");
}
