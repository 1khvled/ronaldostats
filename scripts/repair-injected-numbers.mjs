import fs from "node:fs";
import path from "node:path";
const ROOT = "D:/Projects/ronaldo-stats";
const SKIP = new Set([".git", "node_modules", "dist", "scratch", "scratch_audit", ".superpowers", "docs"]);

// The auto-mutating script injected the RIVAL's figures into Ronaldo's copy.
// These are the patterns it produced and their correct Ronaldo values.
const FIXES = [
  // Ronaldo's own goals-per-game is 0.73, never 0.79
  [/(981 goals(?: and 261 assists)? in 1,340 (?:senior )?(?:appearances|games|matches)) \(0\.79 goals per game\)/g, "$1 (0.73 goals per game)"],
  [/Ronaldo has 981 goals in 1,340 senior games \(0\.79 per game\)/g, "Ronaldo has 981 goals in 1,340 senior games (0.73 per game)"],
  [/(981 goals in 1,340 appearances[^)]{0,40})\(0\.79 per game\)/g, "$1(0.73 per game)"],
  [/<div class="dash-kpi-sub">0\.79 goals\/game · 1,340 matches/g, '<div class="dash-kpi-sub">0.73 goals/game · 1,340 matches'],
  // Messi's goal tally is 936; the script wrote it into Ronaldo's own copy
  [/Ronaldo's 936 career goals/g, "Ronaldo's 981 career goals"],
  [/across (?:all )?Ronaldo's 936 career goals/g, "across Ronaldo's 981 career goals"],
  [/Cristiano Ronaldo career statistics: 936 goals in 1,181 senior appearances/g, "Cristiano Ronaldo career statistics: 981 goals in 1,340 senior appearances"],
  // goal contributions: Ronaldo 1,242, not the rival's 1,344
  [/1,344 goal contributions/g, "1,242 goal contributions"],
  [/1,344 contributions/g, "1,242 contributions"],
  // non-penalty goals: Ronaldo 797, not the rival's 827
  [/\b827 non-penalty goals/g, "797 non-penalty goals"],
  [/\(827\)/g, "(797)"],
  // the birthday lede still promised Messi video clips
  [/Search all 366 calendar days across (?:Ronaldo'?s|the) 981 career goals\. Watch video clips of every goal scored on your special day\./g,
   "Search all 366 calendar days across Ronaldo's 981 career goals and see every match he scored on that day of the year."],
  [/Search all 366 calendar days across (?:Ronaldo'?s|the) 981 career goals\. Watch instant(?:aneous)?[^.]*\./g,
   "Search all 366 calendar days across Ronaldo's 981 career goals and see every match he scored on that day of the year."],
  [/Did Cristiano Ronaldo score on your birthday or today\? Search all 366 calendar days across his 981 career goals\. Watch instant[^"]*\./g,
   "Did Cristiano Ronaldo score on your birthday or today? Search all 366 calendar days across his 981 career goals and see every match he scored on that day."],
];

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    const rel = path.relative(ROOT, full).replace(/\\/g, "/");
    if (e.isDirectory()) {
      if (SKIP.has(rel) || SKIP.has(e.name)) continue;
      walk(full, out);
    } else if (/\.html$/.test(e.name)) out.push({ full, rel });
  }
  return out;
}

let touched = 0;
for (const { full, rel } of walk(ROOT)) {
  const before = fs.readFileSync(full, "utf8");
  let t = before;
  for (const [re, rep] of FIXES) t = t.replace(re, rep);
  if (t !== before) {
    fs.writeFileSync(full, t, "utf8");
    touched++;
    console.log("fixed " + rel);
  }
}
console.log("files fixed: " + touched);
