import fs from "node:fs";
import path from "node:path";
const ROOT = "D:/Projects/ronaldo-stats/";
const LANGS = ["es", "pt", "fr", "ar", "bn", "hi", "ro", "uz"];

// three alts that no longer describe the photograph they label
const CHANGES = [
  ["Ronaldo in the Manchester United number 7 shirt at Old Trafford",
   "Ronaldo in the Manchester United number 7 shirt against Chelsea"],
  ["Ronaldo in the Al Nassr shirt, celebrating his all-time record",
   "Ronaldo in the Portugal number 7 shirt at the 2026 World Cup"],
];

const T = {
  es: ["Ronaldo con la camiseta número 7 del Manchester United contra el Chelsea",
       "Ronaldo con la camiseta número 7 de Portugal en el Mundial de 2026"],
  pt: ["Ronaldo com a camisa número 7 do Manchester United contra o Chelsea",
       "Ronaldo com a camisa número 7 de Portugal na Copa do Mundo de 2026"],
  fr: ["Ronaldo en maillot numéro 7 de Manchester United contre Chelsea",
       "Ronaldo en maillot numéro 7 du Portugal lors de la Coupe du monde 2026"],
  ar: ["رونالدو بقميص مانشستر يونايتد رقم 7 أمام تشيلسي",
       "رونالدو بقميص البرتغال رقم 7 في كأس العالم 2026"],
  bn: ["চেলসির বিপক্ষে ম্যানচেস্টার ইউনাইটেডের ৭ নম্বর জার্সিতে রোনালদো",
       "২০২৬ বিশ্বকাপে পর্তুগালের ৭ নম্বর জার্সিতে রোনালদো"],
  hi: ["चेल्सी के खिलाफ मैनचेस्टर यूनाइटेड की 7 नंबर की जर्सी में रोनाल्डो",
       "2026 विश्व कप में पुर्तगाल की 7 नंबर की जर्सी में रोनाल्डो"],
  ro: ["Ronaldo în tricoul cu numărul 7 de la Manchester United contra Chelsea",
       "Ronaldo în tricoul cu numărul 7 al Portugaliei la Cupa Mondială din 2026"],
  uz: ["Chelsea ga qarshi Manchester Unitedning 7-raqamli futbolkasida Ronaldo",
       "2026 Jahon Kupida Portugaliyaning 7-raqamli futbolkasida Ronaldo"],
};

// 1. the English shell
{
  const P = path.join(ROOT, "timeline.html");
  let t = fs.readFileSync(P, "utf8");
  let n = 0;
  for (const [a, b] of CHANGES) { if (t.includes(a)) { t = t.split(a).join(b); n++; } }
  fs.writeFileSync(P, t, "utf8");
  console.log("ok  timeline.html: " + n + " alt texts corrected");
}

// 2. the eight dictionaries
{
  const dir = path.join(ROOT, "src/i18n/shell");
  for (const lang of LANGS) {
    const f = path.join(dir, lang + ".json");
    const d = JSON.parse(fs.readFileSync(f, "utf8"));
    let n = 0;
    for (let i = 0; i < CHANGES.length; i++) {
      const [a] = CHANGES[i];
      if (!(a in d)) continue;
      delete d[a];
      d[CHANGES[i][1]] = T[lang][i];
      n++;
    }
    fs.writeFileSync(f, JSON.stringify(d, null, 2) + "\n", "utf8");
    console.log("ok  " + lang + ": " + n + " alt texts corrected");
  }
}

// 3. the runtime alt texts
{
  const P = path.join(ROOT, "src", "app.js");
  let t = fs.readFileSync(P, "utf8");
  const pairs = [
    ["Cristiano Ronaldo in the Manchester United shirt at Old Trafford", "Cristiano Ronaldo in the Manchester United number 7 shirt against Chelsea"],
    ["Cristiano Ronaldo in the Al Nassr shirt, celebrating his all-time record", "Cristiano Ronaldo in the Portugal number 7 shirt at the 2026 World Cup"],
    ["Cristiano Ronaldo in the Manchester United shirt during his second spell", "Cristiano Ronaldo in the Manchester United number 7 shirt against Everton"],
    ["Cristiano Ronaldo presented as an Al Nassr player in Riyadh", "Cristiano Ronaldo in the Al Nassr number 7 shirt"],
  ];
  let n = 0;
  for (const [a, b] of pairs) { if (t.includes(a)) { t = t.split(a).join(b); n++; } }
  fs.writeFileSync(P, t, "utf8");
  console.log("ok  app.js: " + n + " runtime alt texts corrected");
}
