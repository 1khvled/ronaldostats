import fs from "node:fs";
import path from "node:path";
const ROOT = "D:/Projects/ronaldo-stats/";

// the calendar build reads a scratch file that extract-goal-calendar.mjs
// writes; the verification gate must produce it itself, not rely on a file
// left behind in %TEMP%
const P = path.join(ROOT, "scripts", "verify-all.mjs");
let t = fs.readFileSync(P, "utf8");
const find = 'step(run(process.execPath, ["scripts/build-birthday-goals.mjs"], "dated goal calendar"), "dated goal calendar");';
const repl = [
  'step(run(process.execPath, ["scripts/extract-goal-calendar.mjs"], "goal calendar extract"), "goal calendar extract");',
  'step(run(process.execPath, ["scripts/build-birthday-goals.mjs"], "dated goal calendar"), "dated goal calendar");',
].join("\n");
if (t.includes(find)) {
  t = t.split(find).join(repl);
  fs.writeFileSync(P, t, "utf8");
  console.log("ok  scripts/verify-all.mjs: the calendar gate now builds its own input");
} else {
  console.log("  (the step was not found — check the file)");
}
