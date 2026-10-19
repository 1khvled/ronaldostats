import fs from "node:fs";
import path from "node:path";
const ROOT = "D:/Projects/ronaldo-stats";
const SKIP = new Set([".git", "node_modules", "dist", "scratch", "scratch_audit", ".superpowers", "docs"]);

// Rule: inside one text node, if Ronaldo's own figures (981 or 1,340) appear
// BEFORE the 0.79, the 0.79 is Ronaldo's and must be 0.73. When 0.79 comes
// first and is followed by Messi's 936/1,181, it is Messi's and must stay.
function fixLine(line) {
  if (!line.includes("0.79")) return line;
  const idx = line.indexOf("0.79");
  const before = line.slice(0, idx);
  const isRonaldo = /981|1,340|1340/.test(before);
  const isMessi = /936|1,181|1181/.test(before);
  if (isRonaldo && !isMessi) return line.slice(0, idx) + "0.73" + line.slice(idx + 4);
  return line;
}

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
  const lines = before.split(/\r?\n/);
  let changed = false;
  for (let i = 0; i < lines.length; i++) {
    const fixed = fixLine(lines[i]);
    if (fixed !== lines[i]) { lines[i] = fixed; changed = true; hits++; }
  }
  if (changed) {
    fs.writeFileSync(full, lines.join("\n"), "utf8");
    touched++;
    console.log("fixed " + rel);
  }
}
console.log(`files fixed: ${touched}, lines fixed: ${hits}`);
