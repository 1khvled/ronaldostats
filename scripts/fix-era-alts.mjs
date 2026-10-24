import fs from "node:fs";
import path from "node:path";
const ROOT = "D:/Projects/ronaldo-stats/";
const LANGS = ["es","pt","fr"];

// the old alt described the card; now that the cards are photographs, the alt
// describes the photograph
const OLD = [
  "Career archive card: 2002–03 Sporting CP, debut season and first senior goals",
  "Career archive card: 2004–09 Manchester United, the Premier League and the first golden era",
  "Career archive card: 2009–18 Real Madrid, La Liga and Champions League dominance",
  "Career archive card: 2008, the first Ballon d'Or won by a Portuguese player",
  "Career archive card: 2018–19 Juventus, Serie A and a return to Italy",
  "Career archive card: 2021–22 Manchester United, the second spell",
  "Career archive card: 2023–26 Al Nassr, the Saudi Pro League",
  "Career archive card: 2026, the all-time record of 981 goals",
];
const NEW = [
  "The Sporting CP museum in Lisbon, with Ronaldo's number 28 shirt from his debut season",
  "Ronaldo in the Manchester United number 7 shirt at Old Trafford",
  "Kaka and Ronaldo celebrating together for Real Madrid",
  "Ronaldo in the Manchester United number 7 shirt in 2008, the year of his first Ballon d'Or",
  "Ronaldo in the Juventus shirt during his Serie A title season",
  "Ronaldo in the Manchester United shirt during his second spell",
  "Ronaldo in the Al Nassr number 7 shirt",
  "Ronaldo in the Al Nassr shirt, celebrating his all-time record",
];

const T = {
  en: NEW,
  es: [
    "El museo del Sporting CP en Lisboa, con la camiseta número 28 de Ronaldo de su primera temporada",
    "Ronaldo con la camiseta número 7 del Manchester United en Old Trafford",
    "Kaka y Ronaldo celebrando juntos con el Real Madrid",
    "Ronaldo con la camiseta número 7 del Manchester United en 2008, el año de su primer Ballon d'Or",
    "Ronaldo con la camiseta del Juventus durante su temporada de Serie A",
    "Ronaldo con la camiseta del Manchester United en su segunda etapa",
    "Ronaldo con la camiseta número 7 del Al Nassr",
    "Ronaldo con la camiseta del Al Nassr, celebrando su récord histórico",
  ],
  pt: [
    "O museu do Sporting CP em Lisboa, com a camisa número 28 de Ronaldo da sua primeira época",
    "Ronaldo com a camisa número 7 do Manchester United em Old Trafford",
    "Kaka e Ronaldo a celebrar juntos pelo Real Madrid",
    "Ronaldo com a camisa número 7 do Manchester United em 2008, o ano da sua primeira Ballon d'Or",
    "Ronaldo com a camisa da Juventus durante a sua época de Serie A",
    "Ronaldo com a camisa do Manchester United na sua segunda passagem",
    "Ronaldo com a camisa número 7 do Al Nassr",
    "Ronaldo com a camisa do Al Nassr, a celebrar o recorde de sempre",
  ],
  fr: [
    "Le musée du Sporting CP à Lisbonne, avec le maillot numéro 28 de Ronaldo lors de sa première saison",
    "Ronaldo en maillot numéro 7 de Manchester United à Old Trafford",
    "Kaka et Ronaldo fêtant ensemble sous le maillot du Real Madrid",
    "Ronaldo en maillot numéro 7 de Manchester United en 2008, l'année de son premier Ballon d'Or",
    "Ronaldo en maillot de la Juventus pendant sa saison de Serie A",
    "Ronaldo en maillot de Manchester United lors de son second passage",
    "Ronaldo en maillot numéro 7 d'Al Nassr",
    "Ronaldo en maillot d'Al Nassr, célébrant son record de tous les temps",
  ],
};

// 1. the English shell
{
  const P = path.join(ROOT, "timeline.html");
  let t = fs.readFileSync(P, "utf8");
  let n = 0;
  for (let i = 0; i < OLD.length; i++) {
    if (!t.includes(OLD[i])) { console.log("  (missing) " + OLD[i].slice(0, 40)); continue; }
    t = t.split(OLD[i]).join(NEW[i]);
    n++;
  }
  fs.writeFileSync(P, t, "utf8");
  console.log("ok  timeline.html: " + n + " alt texts now describe the photographs");
}

// 2. the eight dictionaries
{
  const dir = path.join(ROOT, "src/i18n/shell");
  for (const lang of LANGS) {
    const f = path.join(dir, lang + ".json");
    const d = JSON.parse(fs.readFileSync(f, "utf8"));
    let n = 0;
    for (let i = 0; i < OLD.length; i++) {
      if (!(OLD[i] in d)) continue;
      delete d[OLD[i]];
      d[NEW[i]] = T[lang][i];
      n++;
    }
    fs.writeFileSync(f, JSON.stringify(d, null, 2) + "\n", "utf8");
    console.log("ok  " + lang + ": " + n + " alt texts updated");
  }
}

// 3. the runtime alts in app.js
{
  const P = path.join(ROOT, "src", "app.js");
  let t = fs.readFileSync(P, "utf8");
  const pairs = [
    ["Cristiano Ronaldo in the Sporting CP shirt during his debut season", "The Sporting CP museum in Lisbon, with Ronaldo's number 28 shirt from his debut season"],
    ["Cristiano Ronaldo making his senior debut for Sporting CP in 2002", "The Sporting CP museum in Lisbon, with Ronaldo's number 28 shirt from his debut season"],
    ["Cristiano Ronaldo holding up the Real Madrid shirt at the Santiago Bernabéu", "Kaka and Ronaldo celebrating together for Real Madrid"],
    ["Cristiano Ronaldo holding the Ballon d'Or trophy he won in 2008", "Ronaldo in the Manchester United number 7 shirt in 2008, the year of his first Ballon d'Or"],
    ["Cristiano Ronaldo presented as an Al Nassr player in Riyadh", "Ronaldo in the Al Nassr number 7 shirt"],
    ["Cristiano Ronaldo celebrating a record milestone for Al Nassr", "Ronaldo in the Al Nassr shirt, celebrating his all-time record"],
  ];
  let n = 0;
  for (const [a, b] of pairs) { if (t.includes(a)) { t = t.split(a).join(b); n++; } }
  fs.writeFileSync(P, t, "utf8");
  console.log("ok  app.js: " + n + " runtime alt texts updated");
}
