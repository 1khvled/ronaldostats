import fs from "node:fs";
import path from "node:path";
const ROOT = "D:/Projects/ronaldo-stats/";
const SHARP = "C:/Users/Abdelli/AppData/Local/Temp/opencode/sharpnode/node_modules/sharp";
const SRC = "C:/Users/Abdelli/AppData/Local/Temp/opencode/cwc/fifa-club-world-cup-silver-and-golden-ball-trophies-cr7museum-jpg.jpg";

// ---------------------------------------------------------------------------
// 1. the new photograph: the Club World Cup Golden Ball trophies in the CR7
//    Museum, Madeira (Tkotw12, CC BY-SA 4.0)
// ---------------------------------------------------------------------------
{
  const { createRequire } = await import("node:module");
  const require = createRequire(import.meta.url);
  const sharp = require(SHARP);
  const out = path.join(ROOT, "public/img/cab-cwc-2026.webp");
  await sharp(SRC)
    .resize(800, 600, { fit: "cover", position: "centre" })
    .webp({ quality: 82 })
    .toFile(out);
  const st = fs.statSync(out);
  const meta = await sharp(out).metadata();
  console.log("ok  cab-cwc-2026.webp: " + st.size + " bytes, " + meta.width + "x" + meta.height + " " + meta.format);
}

// ---------------------------------------------------------------------------
// 2. the alt texts: every one now describes the photograph it labels
// ---------------------------------------------------------------------------
const CHANGES = [
  // the cabinet: five photographs of Ronaldo and of the trophies he won
  ["The Ballon d'Or trophy, won five times by Cristiano Ronaldo",
   "Cristiano Ronaldo holding the Ballon d'Or he has won a record five times"],
  ["The La Liga championship trophy, won twice by Cristiano Ronaldo with Real Madrid",
   "Cristiano Ronaldo in the Real Madrid number 7 shirt, in a La Liga he won twice"],
  ["The FIFA Club World Cup trophy, won four times by Cristiano Ronaldo",
   "The FIFA Club World Cup Golden Ball trophies in the CR7 Museum in Madeira"],
  ["The FIFA World Cup trophy, in a competition Ronaldo has played in six times",
   "Cristiano Ronaldo in the Portugal number 7 shirt at the 2018 FIFA World Cup"],
  // the Champions League hero: the photograph is the trophies themselves
  ["Cristiano Ronaldo holding the UEFA Champions League trophy in the Real Madrid dressing room",
   "The UEFA Champions League trophy, won five times by Cristiano Ronaldo"],
  // the head-to-head card: they are holding player-of-the-match medals
  ["Cristiano Ronaldo and Lionel Messi holding their Ballon d'Or trophies",
   "Cristiano Ronaldo and Lionel Messi with their player-of-the-match medals after Portugal v Argentina in 2011"],
];

const T = {
  es: {
    "Cristiano Ronaldo holding the Ballon d'Or he has won a record five times": "Cristiano Ronaldo sosteniendo el Ballon d'Or que ha ganado un récord de cinco veces",
    "Cristiano Ronaldo in the Real Madrid number 7 shirt, in a La Liga he won twice": "Cristiano Ronaldo con la camiseta número 7 del Real Madrid, en una La Liga que ganó dos veces",
    "The FIFA Club World Cup Golden Ball trophies in the CR7 Museum in Madeira": "Los trofeos Golden Ball de la FIFA Club World Cup en el museo CR7 de Madeira",
    "Cristiano Ronaldo in the Portugal number 7 shirt at the 2018 FIFA World Cup": "Cristiano Ronaldo con la camiseta número 7 de Portugal en el Mundial de la FIFA de 2018",
    "Cristiano Ronaldo and Lionel Messi with their player-of-the-match medals after Portugal v Argentina in 2011": "Cristiano Ronaldo y Lionel Messi con sus medallas al mejor jugador tras Portugal-Argentina en 2011",
  },
  pt: {
    "Cristiano Ronaldo holding the Ballon d'Or he has won a record five times": "Cristiano Ronaldo com o Ballon d'Or que ganhou um recorde de cinco vezes",
    "Cristiano Ronaldo in the Real Madrid number 7 shirt, in a La Liga he won twice": "Cristiano Ronaldo com a camisa número 7 do Real Madrid, numa La Liga que ganhou duas vezes",
    "The FIFA Club World Cup Golden Ball trophies in the CR7 Museum in Madeira": "Os troféus Golden Ball da FIFA Club World Cup no museu CR7 da Madeira",
    "Cristiano Ronaldo in the Portugal number 7 shirt at the 2018 FIFA World Cup": "Cristiano Ronaldo com a camisa número 7 de Portugal na Copa do Mundo da FIFA de 2018",
    "Cristiano Ronaldo and Lionel Messi with their player-of-the-match medals after Portugal v Argentina in 2011": "Cristiano Ronaldo e Lionel Messi com as suas medalhas de melhor jogador após Portugal-Argentina em 2011",
  },
  fr: {
    "Cristiano Ronaldo holding the Ballon d'Or he has won a record five times": "Cristiano Ronaldo tenant le Ballon d'Or qu'il a remporté un record de cinq fois",
    "Cristiano Ronaldo in the Real Madrid number 7 shirt, in a La Liga he won twice": "Cristiano Ronaldo en maillot numéro 7 du Real Madrid, dans une Liga qu'il a remportée deux fois",
    "The FIFA Club World Cup Golden Ball trophies in the CR7 Museum in Madeira": "Les trophées Golden Ball de la FIFA Club World Cup au musée CR7 de Madère",
    "Cristiano Ronaldo in the Portugal number 7 shirt at the 2018 FIFA World Cup": "Cristiano Ronaldo en maillot numéro 7 du Portugal lors de la Coupe du monde 2018",
    "Cristiano Ronaldo and Lionel Messi with their player-of-the-match medals after Portugal v Argentina in 2011": "Cristiano Ronaldo et Lionel Messi avec leurs médailles de meilleur joueur après Portugal-Argentine en 2011",
  },
};

// the English shells
{
  const PAGES = ["index", "dashboard", "goalsbyyear", "goalsbyseason", "timeline", "achievements",
    "birthday", "latest-goal", "champions-league", "gear", "real-madrid", "ronaldo-vs-messi"];
  let n = 0;
  for (const p of PAGES) {
    const f = path.join(ROOT, p + ".html");
    let t = fs.readFileSync(f, "utf8");
    const before = t;
    for (const [oldS, newS] of CHANGES) t = t.split(oldS).join(newS);
    // the Club World Cup card now shows the Club World Cup Golden Balls
    t = t.replace(/(<img[^>]*src=")\/img\/cab-copa\.webp(")/, "$1/img/cab-cwc-2026.webp$2");
    if (t !== before) { fs.writeFileSync(f, t, "utf8"); n++; }
  }
  console.log("ok  " + n + " shells: the alt texts now describe the photographs");
}

// the eight dictionaries
{
  const dir = path.join(ROOT, "src", "i18n", "shell");
  for (const lang of Object.keys(T)) {
    const f = path.join(dir, lang + ".json");
    const d = JSON.parse(fs.readFileSync(f, "utf8"));
    let n = 0;
    for (const [oldS, newS] of CHANGES) {
      if (!(oldS in d)) continue;
      if (newS === "The UEFA Champions League trophy, won five times by Cristiano Ronaldo") {
        // the same wording as the cabinet card: reuse the existing key
        delete d[oldS];
        n++;
        continue;
      }
      const tr = T[lang][newS];
      if (!tr) { console.log("  " + lang + ": no translation for " + newS.slice(0, 40)); continue; }
      delete d[oldS];
      d[newS] = tr;
      n++;
    }
    fs.writeFileSync(f, JSON.stringify(d, null, 2) + "\n", "utf8");
    console.log("ok  " + lang + ": " + n + " keys updated");
  }
}

// The Portugal photograph that the cabinet no longer uses went to the
// timeline's 2016 Euro moment, which had no picture at all. That edit and the
// CREDITS entry are in the same commit.
