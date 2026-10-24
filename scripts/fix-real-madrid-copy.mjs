import fs from "node:fs";
import path from "node:path";
const ROOT = "D:/Projects/ronaldo-stats/";
const LANGS = ["es","pt","fr"];

// The page is Ronaldo's nine years AT Real Madrid. Rename it and say so.
const COPY = [
  ["Ronaldo's El Clásico Record: 18 Goals Against Barcelona | RonaldoStats",
   "Ronaldo at Real Madrid: 450 Goals, 311 in La Liga, 18 in the Clásico | RonaldoStats"],
  ["Frequently Asked Questions: Ronaldo's El Clásico Record",
   "Frequently Asked Questions: Ronaldo at Real Madrid"],
  ["Cristiano Ronaldo's El Clásico record: 18 goals against Barcelona in nine years at Real Madrid, 311 La Liga goals and four Champions League titles.",
   "Cristiano Ronaldo at Real Madrid: 450 goals in nine years, 311 in La Liga, four Champions League titles and 18 goals in the El Clásico."],
  ["All-Time El Clásico Record", "His Nine Years at the Bernabéu"],
  ["Ronaldo's El Clásico Record", "Ronaldo at Real Madrid"],
  ["vs Real Madrid", "Real Madrid years"],
];

const T = {
  es: {
    "Ronaldo at Real Madrid: 450 Goals, 311 in La Liga, 18 in the Clásico | RonaldoStats": "Ronaldo en el Real Madrid: 450 goles, 311 en La Liga, 18 en el Clásico | RonaldoStats",
    "Frequently Asked Questions: Ronaldo at Real Madrid": "Preguntas frecuentes: Ronaldo en el Real Madrid",
    "Cristiano Ronaldo at Real Madrid: 450 goals in nine years, 311 in La Liga, four Champions League titles and 18 goals in the El Clásico.": "Cristiano Ronaldo en el Real Madrid: 450 goles en nueve años, 311 en La Liga, cuatro Champions League y 18 goles en el Clásico.",
    "His Nine Years at the Bernabéu": "Sus nueve años en el Bernabéu",
    "Ronaldo at Real Madrid": "Ronaldo en el Real Madrid",
    "Real Madrid years": "Años en el Real Madrid",
  },
  pt: {
    "Ronaldo at Real Madrid: 450 Goals, 311 in La Liga, 18 in the Clásico | RonaldoStats": "Ronaldo no Real Madrid: 450 gols, 311 na La Liga, 18 no Clássico | RonaldoStats",
    "Frequently Asked Questions: Ronaldo at Real Madrid": "Perguntas frequentes: Ronaldo no Real Madrid",
    "Cristiano Ronaldo at Real Madrid: 450 goals in nine years, 311 in La Liga, four Champions League titles and 18 goals in the El Clásico.": "Cristiano Ronaldo no Real Madrid: 450 gols em nove anos, 311 na La Liga, quatro Champions League e 18 gols no Clássico.",
    "His Nine Years at the Bernabéu": "Seus nove anos no Bernabéu",
    "Ronaldo at Real Madrid": "Ronaldo no Real Madrid",
    "Real Madrid years": "Anos no Real Madrid",
  },
  fr: {
    "Ronaldo at Real Madrid: 450 Goals, 311 in La Liga, 18 in the Clásico | RonaldoStats": "Ronaldo au Real Madrid : 450 buts, 311 en Liga, 18 en Clásico | RonaldoStats",
    "Frequently Asked Questions: Ronaldo at Real Madrid": "Questions fréquentes : Ronaldo au Real Madrid",
    "Cristiano Ronaldo at Real Madrid: 450 goals in nine years, 311 in La Liga, four Champions League titles and 18 goals in the El Clásico.": "Cristiano Ronaldo au Real Madrid : 450 buts en neuf ans, 311 en Liga, quatre Ligues des champions et 18 buts en Clásico.",
    "His Nine Years at the Bernabéu": "Ses neuf ans au Bernabéu",
    "Ronaldo at Real Madrid": "Ronaldo au Real Madrid",
    "Real Madrid years": "Les années au Real Madrid",
  },
};

// 1. the English shell
{
  const P = path.join(ROOT, "real-madrid.html");
  let t = fs.readFileSync(P, "utf8");
  let n = 0;
  for (const [oldS, newS] of COPY) {
    if (!t.includes(oldS)) { console.log("  (not in the shell) " + oldS.slice(0, 50)); continue; }
    t = t.split(oldS).join(newS);
    n++;
  }
  fs.writeFileSync(P, t, "utf8");
  console.log("ok  real-madrid.html: " + n + " strings updated");
}

// 2. the eight shell dictionaries
{
  const dir = path.join(ROOT, "src/i18n/shell");
  for (const lang of LANGS) {
    const f = path.join(dir, lang + ".json");
    const d = JSON.parse(fs.readFileSync(f, "utf8"));
    let n = 0;
    for (const [oldS, newS] of COPY) {
      if (!(oldS in d)) { console.log("  " + lang + ": no key " + oldS.slice(0, 44)); continue; }
      const tr = T[lang][newS];
      if (!tr) { console.log("  " + lang + ": no translation for " + newS.slice(0, 44)); continue; }
      delete d[oldS];
      d[newS] = tr;
      n++;
    }
    fs.writeFileSync(f, JSON.stringify(d, null, 2) + "\n", "utf8");
    console.log("ok  " + lang + ": " + n + " keys updated");
  }
}

// 3. the home page's FAQ question and its link text
const QUESTION = {
  en: ["What is Ronaldo's record against Real Madrid?", "What is Ronaldo's record at Real Madrid?", "Ronaldo vs Real Madrid page", "Ronaldo at Real Madrid page"],
  es: ["¿Cuál es el récord de Ronaldo contra el Real Madrid?", "¿Cuál es el récord de Ronaldo en el Real Madrid?", "página de Ronaldo contra el Real Madrid", "página de Ronaldo en el Real Madrid"],
  pt: ["Qual é o retrospecto de Ronaldo contra o Real Madrid?", "Qual é o retrospecto de Ronaldo no Real Madrid?", "página de Ronaldo contra o Real Madrid", "página de Ronaldo no Real Madrid"],
  fr: ["Quel est le bilan de Ronaldo contre le Real Madrid ?", "Quel est le bilan de Ronaldo au Real Madrid ?", "page Ronaldo contre le Real Madrid", "page Ronaldo au Real Madrid"],
};
{
  const dir = path.join(ROOT, "src/i18n");
  for (const lang of ["en", ...LANGS]) {
    const f = path.join(dir, lang + ".js");
    let t = fs.readFileSync(f, "utf8");
    const [qOld, qNew, lOld, lNew] = QUESTION[lang];
    let n = 0;
    if (t.includes(qOld)) { t = t.split(qOld).join(qNew); n++; }
    else console.log("  " + lang + ": the FAQ question was not found (" + qOld.slice(0, 40) + ")");
    if (t.includes(lOld)) { t = t.split(lOld).join(lNew); n++; }
    else console.log("  " + lang + ": the FAQ link text was not found (" + lOld.slice(0, 40) + ")");
    fs.writeFileSync(f, t, "utf8");
    console.log("ok  " + lang + ": " + n + " FAQ strings updated");
  }
}
