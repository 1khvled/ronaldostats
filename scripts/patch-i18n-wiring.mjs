import fs from "node:fs";
const APP = "D:/Projects/ronaldo-stats/src/app.js";
let t = fs.readFileSync(APP, "utf8");
const fixes = [
  [/\(ERA_INTROS\[lang\] && ERA_INTROS\[lang\]\[key\]\) \|\| ERA_INTRO\[era\] \|\| ERA_INTRO\[key\]/g, "DICT.ERA_INTROS[key] || DICT.ERA_INTROS[era]"],
  [/HOME_I18N\.en\.faq/g, "DICT.HOME.faq"],
];
for (const [re, rep] of fixes) {
  const before = t;
  t = t.replace(re, rep);
  if (before === t) console.error("NO-OP: " + re);
}
fs.writeFileSync(APP, t, "utf8");

// syntax check as ESM
const tmp = "C:/Users/Abdelli/AppData/Local/Temp/opencode/app-syntax-check.mjs";
fs.copyFileSync(APP, tmp);
console.log("patched; syntax-check copy at " + tmp);
