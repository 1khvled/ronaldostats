import fs from "node:fs";
import path from "node:path";
const ROOT = "D:/Projects/ronaldo-stats";
const SKIP = new Set([".git", "node_modules", "dist", "scratch", "scratch_audit", ".superpowers", "docs"]);

// Precise, context-aware repairs. The bare "0.79" is Messi's figure and must
// survive; only Ronaldo's own copy is corrected. "<td>0.79</td>" (Ronaldo's
// column) is distinct from "<td><b ...>0.79</b></td>" (Messi's column).
const FIXES = [
  [/(981 official goals and 261 official assists \(291 under Transfermarkt criteria\) in 1,340 matches) — 0\.79 goals per game/g, "$1 — 0.73 goals per game"],
  [/a rate of 0\.79 goals per game/g, "a rate of 0.73 goals per game"],
  [/(1,340 senior appearances) \(0\.79 goals per game\)/g, "$1 (0.73 goals per game)"],
  [/(981 official goals<\/strong>, <strong>261 assists<\/strong> in <strong>1,340 senior appearances<\/strong>) \(0\.79 goals per game\)/g, "$1 (0.73 goals per game)"],
  [/(981 official goals and 261 official assists \(291 under Transfermarkt criteria\) in 1,340 appearances) \(0\.79 goals per game\)/g, "$1 (0.73 goals per game)"],
  [/0\.79 goals per game across 27 club seasons/g, "0.73 goals per game across 27 club seasons"],
  [/<b>0\.79 goals\/game<\/b>/g, "<b>0.73 goals/game</b>"],
  [/\(0\.79 goals per match\)/g, "(0.73 goals per match)"],
  [/(1,340 senior appearances) \(0\.79 per game\)/g, "$1 (0.73 per game)"],
  [/<td>0\.79<\/td>/g, "<td>0.73</td>"],
  [/(Ronaldo has 981 goals in 1,340 senior games) \(0\.79 per game\)/g, "$1 (0.73 per game)"],
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
let hits = 0;
for (const { full, rel } of walk(ROOT)) {
  const before = fs.readFileSync(full, "utf8");
  let t = before;
  for (const [re, rep] of FIXES) {
    const m = t.match(re);
    if (m) hits += m.length;
    t = t.replace(re, rep);
  }
  if (t !== before) { fs.writeFileSync(full, t, "utf8"); touched++; console.log("fixed " + rel); }
}
console.log(`files fixed: ${touched}, replacements: ${hits}`);
