import fs from "node:fs";
import path from "node:path";
const ROOT = "D:/Projects/ronaldo-stats/";
const LANGS = ["es", "pt", "fr", "ar", "bn", "hi", "ro", "uz"];
const PAGES = ["index", "dashboard", "goalsbyyear", "goalsbyseason", "timeline", "achievements",
  "birthday", "latest-goal", "champions-league", "gear", "real-madrid", "ronaldo-vs-messi"];

// every page carries the rail link and the explore cards for this page
const COPY = [
  ["⚔️ Ronaldo vs Real Madrid (El Clásico)", "🏟️ Ronaldo at Real Madrid"],
  ["⚔️ Ronaldo vs Real Madrid", "🏟️ Ronaldo at Real Madrid"],
  ["vs Real Madrid", "Real Madrid years"],
  ["Every Ronaldo goal in the Clásico, and every goal he has scored against Real Madrid in a different shirt.",
   "His nine years at Real Madrid: 450 goals, 311 in La Liga, four Champions League titles and 18 in the Clásico."],
];

const T = {
  es: {
    "🏟️ Ronaldo at Real Madrid": "🏟️ Ronaldo en el Real Madrid",
    "His nine years at Real Madrid: 450 goals, 311 in La Liga, four Champions League titles and 18 in the Clásico.": "Sus nueve años en el Real Madrid: 450 goles, 311 en La Liga, cuatro Champions League y 18 en el Clásico.",
  },
  pt: {
    "🏟️ Ronaldo at Real Madrid": "🏟️ Ronaldo no Real Madrid",
    "His nine years at Real Madrid: 450 goals, 311 in La Liga, four Champions League titles and 18 in the Clásico.": "Seus nove anos no Real Madrid: 450 gols, 311 na La Liga, quatro Champions League e 18 no Clássico.",
  },
  fr: {
    "🏟️ Ronaldo at Real Madrid": "🏟️ Ronaldo au Real Madrid",
    "His nine years at Real Madrid: 450 goals, 311 in La Liga, four Champions League titles and 18 in the Clásico.": "Ses neuf ans au Real Madrid : 450 buts, 311 en Liga, quatre Ligues des champions et 18 en Clásico.",
  },
  ar: {
    "🏟️ Ronaldo at Real Madrid": "🏟️ رونالدو في ريال مدريد",
    "His nine years at Real Madrid: 450 goals, 311 in La Liga, four Champions League titles and 18 in the Clásico.": "تسع سنوات في ريال مدريد: 450 هدفاً، 311 في الليغا، أربعة أبطال أوروبا و18 في الكلاسيكو.",
  },
  bn: {
    "🏟️ Ronaldo at Real Madrid": "🏟️ রিয়াল মাদ্রিদে রোনালদো",
    "His nine years at Real Madrid: 450 goals, 311 in La Liga, four Champions League titles and 18 in the Clásico.": "রিয়াল মাদ্রিদে নয় বছর: ৪৫০ গোল, লা লিগায় ৩১১, চারটি চ্যাম্পিয়ন্স লিগ এবং ক্লাসিকোতে ১৮।",
  },
  hi: {
    "🏟️ Ronaldo at Real Madrid": "🏟️ रियल मैड्रिड में रोनाल्डो",
    "His nine years at Real Madrid: 450 goals, 311 in La Liga, four Champions League titles and 18 in the Clásico.": "रियल मैड्रिड में नौ साल: 450 गोल, ला लीगा में 311, चार चैंपियंस लीग और क्लासिको में 18।",
  },
  ro: {
    "🏟️ Ronaldo at Real Madrid": "🏟️ Ronaldo la Real Madrid",
    "His nine years at Real Madrid: 450 goals, 311 in La Liga, four Champions League titles and 18 in the Clásico.": "Cei nouă ani la Real Madrid: 450 de goluri, 311 în La Liga, patru Ligi ale Campionilor și 18 în Clásico.",
  },
  uz: {
    "🏟️ Ronaldo at Real Madrid": "🏟️ Real Madridda Ronaldo",
    "His nine years at Real Madrid: 450 goals, 311 in La Liga, four Champions League titles and 18 in the Clásico.": "Real Madridda to'qqiz yil: 450 gol, La Ligada 311, to'rtta Chempionlar Ligasi va Klassikoda 18.",
  },
};

// 1. the twelve English shells
let n = 0;
for (const p of PAGES) {
  const f = path.join(ROOT, p + ".html");
  let t = fs.readFileSync(f, "utf8");
  const before = t;
  for (const [a, b] of COPY) t = t.split(a).join(b);
  if (t !== before) { fs.writeFileSync(f, t, "utf8"); n++; }
}
console.log("ok  " + n + " English shells: the label and the explore cards name the Real Madrid years");

// 2. the eight shell dictionaries
{
  const dir = path.join(ROOT, "src/i18n/shell");
  for (const lang of LANGS) {
    const f = path.join(dir, lang + ".json");
    const d = JSON.parse(fs.readFileSync(f, "utf8"));
    let k = 0;
    for (const [a, b] of COPY) {
      if (!(a in d)) continue;
      const tr = T[lang][b];
      if (!tr) { console.log("  " + lang + ": no translation for " + b.slice(0, 40)); continue; }
      delete d[a];
      d[b] = tr;
      k++;
    }
    fs.writeFileSync(f, JSON.stringify(d, null, 2) + "\n", "utf8");
    console.log("ok  " + lang + ": " + k + " keys updated");
  }
}
