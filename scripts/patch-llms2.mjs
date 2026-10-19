import fs from "node:fs";
const p = "D:/Projects/ronaldo-stats/scripts/build-llms.mjs";
let t = fs.readFileSync(p, "utf8");
const clubs = ["Real Madrid", "Manchester United", "Juventus", "Al Nassr", "Sporting CP"];
for (const c of clubs) {
  const re = new RegExp("\\{U\\(clubSum\\(\"" + c + "\"\\)\\.(goals|apps)\\)\\}", "g");
  t = t.replace(re, '${U(clubSum("' + c + '").$1)}');
}
fs.writeFileSync(p, t, "utf8");
console.log("patched");
