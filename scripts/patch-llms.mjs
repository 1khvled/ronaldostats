import fs from "node:fs";
const p = "D:/Projects/ronaldo-stats/scripts/build-llms.mjs";
let t = fs.readFileSync(p, "utf8");
const clubs = ["Real Madrid", "Manchester United", "Juventus", "Al Nassr", "Sporting CP"];
for (const c of clubs) {
  const gRe = new RegExp("\\$\\{U\\(d\\.clubSeasons\\.filter\\(r => r\\.club === \"" + c + "\"\\)\\.reduce\\(\\(a, r\\) => a \\+ r\\.goals, 0\\)\\)\\}", "g");
  const aRe = new RegExp("\\$\\{U\\(d\\.clubSeasons\\.filter\\(r => r\\.club === \"" + c + "\"\\)\\.reduce\\(\\(a, r\\) => a \\+ r\\.apps, 0\\)\\)\\}", "g");
  t = t.replace(gRe, "{U(clubSum(\"" + c + "\").goals)}");
  t = t.replace(aRe, "{U(clubSum(\"" + c + "\").apps)}");
}
t = t.replace(/t\.goalContributions\.official/g, "ga.official");
t = t.replace(/t\.goalContributions\.perGameOfficial/g, "ga.perGameOfficial");
t = t.replace(/t\.byFinish\.openPlay/g, 'fin["Open play"]');
t = t.replace(/t\.byFinish\.penalties/g, 'fin["Penalties"]');
t = t.replace(/t\.byFinish\.freeKicks/g, 'fin["Free kicks"]');
fs.writeFileSync(p, t, "utf8");
console.log("patched build-llms.mjs");
