import fs from "node:fs";
const P = "D:/Projects/ronaldo-stats/src/app.js";
let t = fs.readFileSync(P, "utf8");
const pairs = [
  ["Cristiano Ronaldo posing with the Manchester United shirt in 2003", "Cristiano Ronaldo in the Manchester United number 7 shirt against Chelsea"],
  ["Cristiano Ronaldo holding his first Ballon d'Or trophy in 2008", "Cristiano Ronaldo in 2008, the year of his first Ballon d'Or"],
  ["Cristiano Ronaldo presented as a Real Madrid player in 2009", "Kaka and Ronaldo together for Real Madrid"],
  ["Cristiano Ronaldo celebrating a goal for Al Nassr in 2025", "Cristiano Ronaldo in the Al Nassr number 7 shirt"],
  ["Cristiano Ronaldo celebrating his 981st career goal in 2026", "Cristiano Ronaldo in the Portugal number 7 shirt at the 2026 World Cup"],
];
let n = 0;
for (const [a, b] of pairs) { if (t.includes(a)) { t = t.split(a).join(b); n++; } }
fs.writeFileSync(P, t, "utf8");
console.log("ok  app.js: " + n + " runtime alt texts describe the photographs");
