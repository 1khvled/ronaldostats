import fs from "node:fs";
import path from "node:path";
const ROOT = "D:/Projects/ronaldo-stats/";
const LANGS = ["es", "pt", "fr", "ar", "bn", "hi", "ro", "uz"];
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
  t = t.replace(/vsRealMadrid: "ضد ريال مدريد \(الكلاسيكو\)"/g, 'vsRealMadrid: "سنواته في ريال مدريد"');
  t = t.replace(/vsRealMadrid: "বনাম রিয়াল মাদ্রিদ \(এল ক্লাসিকো\)"/g, 'vsRealMadrid: "রিয়াল মাদ্রিদের বছরগুলো"');
  t = t.replace(/vsRealMadrid: "बनाम रियल मैड्रिड \(एल क्लासिको\)"/g, 'vsRealMadrid: "रियल मैड्रिड के वर्ष"');
  t = t.replace(/vsRealMadrid: "Real Madridga Qarshi \(El Klasiko\)"/g, 'vsRealMadrid: "Real Madridga yillari"');
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
  ar: { t: "🏟️ رونالدو في ريال مدريد", d: "تسع سنوات في ريال مدريد: 450 هدفاً، 311 في الليغا، أربعة أبطال أوروبا و18 في الكلاسيكو." },
  bn: { t: "🏟️ রিয়াল মাদ্রিদে রোনালদো", d: "রিয়াল মাদ্রিদে নয় বছর: ৪৫০ গোল, লা লিগায় ৩১১, চারটি চ্যাম্পিয়ন্স লিগ এবং ক্লাসিকোতে ১৮।" },
  hi: { t: "🏟️ रियल मैड्रिड में रोनाल्डो", d: "रियल मैड्रिड में नौ साल: 450 गोल, ला लीगा में 311, चार चैंपियंस लीग और क्लासिको में 18।" },
  ro: { t: "🏟️ Ronaldo la Real Madrid", d: "Cei nouă ani la Real Madrid: 450 de goluri, 311 în La Liga, patru Ligi ale Campionilor și 18 în Clásico." },
  uz: { t: "🏟️ Real Madridda Ronaldo", d: "Real Madridda to'qqiz yil: 450 gol, La Ligada 311, to'rtta Chempionlar Ligasi va Klassikoda 18." },
};
const OLD_EXPLORE_T = {
  en: "⚔️ Ronaldo vs Real Madrid", es: "⚔️ Ronaldo vs Real Madrid", pt: "⚔️ Ronaldo vs Real Madrid",
  fr: "⚔️ Ronaldo vs Real Madrid", ar: "⚔️ رونالدو ضد ريال مدريد", bn: "⚔️ রোনালদো বনাম রিয়াল মাদ্রিদ",
  hi: "⚔️ रोनाल्डो बनाम रियल मैड्रिड", ro: "⚔️ Ronaldo vs Real Madrid", uz: "⚔️ Ronaldo va Real Madrid",
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
