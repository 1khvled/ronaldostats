import fs from "node:fs";
import path from "node:path";
const ROOT = "D:/Projects/ronaldo-stats";
const SKIP = new Set([".git", "node_modules", "dist", "scratch", "scratch_audit", ".superpowers", "docs"]);

// These four spellings are Ronaldo's own copy everywhere they appear; the
// rival's figure is always written as "0.79 per game" inside a comparison.
const FIXES = [
  [/0\.79 goals per game/g, "0.73 goals per game"],
  [/0\.79 goals per match/g, "0.73 goals per match"],
  [/0\.79 goals\/game/g, "0.73 goals/game"],
  [/<td>0\.79<\/td>/g, "<td>0.73</td>"],
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
  if (t !== before) { fs.writeFileSync(full, t, "utf8"); touched++; }
}
console.log(`files fixed: ${touched}, replacements: ${hits}`);

// remove the stale rivalry pages the old generator produced
for (const { full } of walk(ROOT)) {
  if (path.basename(full) === "messi-vs-ronaldo.html") { fs.rmSync(full); }
}
console.log("stale messi-vs-ronaldo.html pages removed");
