import fs from "node:fs";
import path from "node:path";
const ROOT = "D:/Projects/ronaldo-stats/";

// The cabinet is rendered at runtime from DICT.CABINET, so the alt texts and
// the picture itself live in the nine dictionary modules, not in the page.
const CHANGES = [
  ["Cristiano Ronaldo in Portugal's shirt at a FIFA World Cup",
   "Cristiano Ronaldo in the Portugal number 7 shirt at the 2018 FIFA World Cup"],
  ["Cristiano Ronaldo holding his fifth Ballon d'Or trophy aloft",
   "Cristiano Ronaldo holding the Ballon d'Or he has won a record five times"],
  ["Cristiano Ronaldo celebrating with the Champions League trophy",
   "The European Cup and UEFA Champions League trophies, won five times by Cristiano Ronaldo"],
  ["Cristiano Ronaldo kissing the FIFA Club World Cup trophy",
   "The FIFA Club World Cup Golden Ball trophies in the CR7 Museum in Madeira"],
  ["Cristiano Ronaldo with the La Liga championship trophy",
   "Cristiano Ronaldo in the Real Madrid number 7 shirt, in a La Liga he won twice"],
];

const T = {
  en: {},
  es: {
    "Cristiano Ronaldo in the Portugal number 7 shirt at the 2018 FIFA World Cup": "Cristiano Ronaldo con la camiseta número 7 de Portugal en el Mundial de la FIFA de 2018",
    "Cristiano Ronaldo holding the Ballon d'Or he has won a record five times": "Cristiano Ronaldo sosteniendo el Ballon d'Or que ha ganado un récord de cinco veces",
    "The European Cup and UEFA Champions League trophies, won five times by Cristiano Ronaldo": "Las copas de la Copa de Europa y de la UEFA Champions League, ganadas cinco veces por Cristiano Ronaldo",
    "The FIFA Club World Cup Golden Ball trophies in the CR7 Museum in Madeira": "Los trofeos Golden Ball de la FIFA Club World Cup en el museo CR7 de Madeira",
    "Cristiano Ronaldo in the Real Madrid number 7 shirt, in a La Liga he won twice": "Cristiano Ronaldo con la camiseta número 7 del Real Madrid, en una La Liga que ganó dos veces",
  },
  pt: {
    "Cristiano Ronaldo in the Portugal number 7 shirt at the 2018 FIFA World Cup": "Cristiano Ronaldo com a camisa número 7 de Portugal na Copa do Mundo da FIFA de 2018",
    "Cristiano Ronaldo holding the Ballon d'Or he has won a record five times": "Cristiano Ronaldo com o Ballon d'Or que ganhou um recorde de cinco vezes",
    "The European Cup and UEFA Champions League trophies, won five times by Cristiano Ronaldo": "As taças da Taça Europeia e da UEFA Champions League, ganhas cinco vezes por Cristiano Ronaldo",
    "The FIFA Club World Cup Golden Ball trophies in the CR7 Museum in Madeira": "Os troféus Golden Ball da FIFA Club World Cup no museu CR7 da Madeira",
    "Cristiano Ronaldo in the Real Madrid number 7 shirt, in a La Liga he won twice": "Cristiano Ronaldo com a camisa número 7 do Real Madrid, numa La Liga que ganhou duas vezes",
  },
  fr: {
    "Cristiano Ronaldo in the Portugal number 7 shirt at the 2018 FIFA World Cup": "Cristiano Ronaldo en maillot numéro 7 du Portugal lors de la Coupe du monde 2018",
    "Cristiano Ronaldo holding the Ballon d'Or he has won a record five times": "Cristiano Ronaldo tenant le Ballon d'Or qu'il a remporté un record de cinq fois",
    "The European Cup and UEFA Champions League trophies, won five times by Cristiano Ronaldo": "Les coupes de la Coupe d'Europe et de la UEFA Champions League, remportées cinq fois par Cristiano Ronaldo",
    "The FIFA Club World Cup Golden Ball trophies in the CR7 Museum in Madeira": "Les trophées Golden Ball de la FIFA Club World Cup au musée CR7 de Madère",
    "Cristiano Ronaldo in the Real Madrid number 7 shirt, in a La Liga he won twice": "Cristiano Ronaldo en maillot numéro 7 du Real Madrid, dans une Liga qu'il a remportée deux fois",
  },
};

const dir = path.join(ROOT, "src", "i18n");
for (const lang of Object.keys(T)) {
  const f = path.join(dir, lang + ".js");
  let t = fs.readFileSync(f, "utf8");
  let n = 0;
  for (const [oldS, newS] of CHANGES) {
    if (!t.includes(oldS)) { console.log("  " + lang + ": no " + oldS.slice(0, 34)); continue; }
    const tr = T[lang][newS];
    if (!tr) { console.log("  " + lang + ": no translation for " + newS.slice(0, 34)); continue; }
    t = t.split(oldS).join(tr);
    n++;
  }
  // the Club World Cup card now shows the Golden Ball trophies
  if (t.includes('src: "/img/cab-copa.webp"')) {
    t = t.replace('src: "/img/cab-copa.webp"', 'src: "/img/cab-cwc-2026.webp"');
    n++;
  }
  fs.writeFileSync(f, t, "utf8");
  console.log("ok  " + lang + ": " + n + " cabinet entries updated");
}
