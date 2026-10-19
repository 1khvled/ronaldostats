import fs from "node:fs";
import path from "node:path";
const dir = "D:/Projects/ronaldo-stats/src/i18n";
const LANGS = ["en", "es", "pt", "fr", "ar", "bn", "hi", "ro", "uz"];
const EXPORTS = ["HOME", "BY_YEAR", "BY_SEASON", "DASH", "TIMELINE", "ACH", "BDAY", "LATEST_GOAL", "ARG_STREAM", "EXPLORE_LANGS", "ERA_INTROS", "CABINET"];
let bad = 0;
for (const lang of LANGS) {
  const f = path.join(dir, `${lang}.js`);
  const t = fs.readFileSync(f, "utf8");
  for (const ex of EXPORTS) {
    if (!new RegExp(`export const ${ex}\\s*=`).test(t)) { console.log(`MISSING export ${ex} in ${lang}`); bad++; }
  }
  // syntax check
  const tmp = `C:/Users/Abdelli/AppData/Local/Temp/opencode/chk-${lang}.mjs`;
  fs.copyFileSync(f, tmp);
  const { execFileSync } = await import("node:child_process");
  try { execFileSync(process.execPath, ["--check", tmp], { stdio: "pipe" }); }
  catch (e) { console.log(`SYNTAX FAIL ${lang}: ${e.stderr.toString().split("\n").slice(0, 6).join("\n")}`); bad++; }
}
console.log(bad === 0 ? "ALL 9 LANGUAGE MODULES OK" : `PROBLEMS: ${bad}`);
