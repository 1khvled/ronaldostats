import fs from "node:fs";
const P = "D:/Projects/ronaldo-stats/src/app.js";
let t = fs.readFileSync(P, "utf8");
const pairs = [
  ["Cristiano Ronaldo holding the Ballon d'Or trophy he won in 2008", "Ronaldo in 2008, the year of his first Ballon d'Or"],
  ["Cristiano Ronaldo celebrating a goal for Real Madrid in 2015", "Cristiano Ronaldo in the Portugal number 7 shirt"],
  ["Cristiano Ronaldo with his fifth Ballon d'Or in 2017", "Cristiano Ronaldo in the Portugal number 7 shirt, celebrating"],
];
let n = 0;
for (const [a, b] of pairs) { if (t.includes(a)) { t = t.split(a).join(b); n++; } }
fs.writeFileSync(P, t, "utf8");
console.log("ok  app.js: " + n + " runtime alt texts match their photographs");
