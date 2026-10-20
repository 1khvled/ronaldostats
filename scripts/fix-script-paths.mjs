import fs from "node:fs";
import path from "node:path";
const ROOT = "D:/Projects/ronaldo-stats/";

// two scripts still point at the source project's file names
const FIXES = [
  ["scripts/auto-sync-ronaldo.mjs", [
    ['resolve(root, "public", "data", "ronaldo.json")', 'resolve(root, "public", "data", "ronaldo-data.json")'],
    ["public/data/ronaldo.json", "public/data/ronaldo-data.json"],
    ["ronaldo.json ->", "ronaldo-data.json ->"],
    ["applied to ronaldo.json", "applied to ronaldo-data.json"],
  ]],
  ["scripts/build-ronaldo-vs-messi.mjs", [
    ['path.join(rootDir, "public", "data", "messi-data.json")', 'path.join(rootDir, "public", "data", "messi.json")'],
    ["public/data/messi-data.json", "public/data/messi.json"],
  ]],
];
for (const [file, pairs] of FIXES) {
  const P = path.join(ROOT, file);
  if (!fs.existsSync(P)) { console.log("  " + file + ": not found"); continue; }
  let t = fs.readFileSync(P, "utf8");
  const before = t;
  for (const [a, b] of pairs) t = t.split(a).join(b);
  fs.writeFileSync(P, t, "utf8");
  console.log((before === t ? "  " : "ok  ") + file + (before === t ? ": already correct" : ": the data file path is fixed"));
}
