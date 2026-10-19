import fs from "node:fs";
import path from "node:path";
const ROOT = "D:/Projects/ronaldo-stats";
const SKIP = new Set([".git", "node_modules", "dist", "scratch", "scratch_audit", ".superpowers", "docs"]);

// "goals per match (0.79 to 0.79)" — Ronaldo's rate is 0.73, Messi's is 0.79.
// The first figure in the pair is Ronaldo's, so the pair must read 0.73 to 0.79.
const FIXES = [
  [/goals per match \(0\.79 to 0\.79\)/g, "goals per match (0.73 to 0.79)"],
  [/goals per game \(0\.79 to 0\.79\)/g, "goals per game (0.73 to 0.79)"],
  [/\(0\.79 to 0\.79\)/g, "(0.73 to 0.79)"],
  [/0\.79 to 0\.79/g, "0.73 to 0.79"],
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

let touched = 0, hits = 0;
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
