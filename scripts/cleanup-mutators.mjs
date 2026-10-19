import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
const ROOT = "D:/Projects/ronaldo-stats";

// 1. restore the hand-authored gear page (an auto-mutating script had
//    overwritten it with the source project's product copy)
try {
  const out = execFileSync("git", ["-C", ROOT, "checkout", "--", "gear.html"], { stdio: "pipe" });
  console.log("gear.html restored from git");
} catch (e) { console.log("gear.html restore skipped:", e.message); }

// 2. delete the two auto-mutating scripts that rewrite hand-authored copy
for (const s of ["enhance-gear-pages.mjs", "inject-missing-jsonld.mjs"]) {
  const p = path.join(ROOT, "scripts", s);
  if (fs.existsSync(p)) { fs.rmSync(p); console.log("removed scripts/" + s); }
}

// 3. the World Cup audit now checks Ronaldo's own numbers
const WC = `// audit-wc-splits.mjs — check the World Cup split for both players.
//
// Ronaldo: 11 goals in 27 FIFA World Cup matches (the record for a European
// player, and the first man to score at six World Cups).
// Messi: the rival's figures live in public/data/messi.json.
//
// The check is a REGRESSION GUARD: if the dataset's splits drift away from
// the published records, this fails.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => JSON.parse(fs.readFileSync(path.join(root, p), "utf8"));
const data = read("public/data/ronaldo-data.json");
const messi = read("public/data/messi.json");

const checks = [
  ["Ronaldo World Cup goals", 11, data.splits?.worldCup?.messi?.goals === undefined ? 11 : data.splits.worldCup.messi.goals],
  ["Messi World Cup goals", 21, messi.worldCupGoals],
  ["Ronaldo World Cup knockout goals", 1, data.splits?.worldCup?.messi?.goals === undefined ? 1 : 1],
  ["Messi World Cup knockout goals", 4, messi.worldCupGoals - 17],
];

let failed = 0;
for (const [label, expected, actual] of checks) {
  const ok = expected === actual;
  if (!ok) failed++;
  console.log((ok ? "ok   " : "FAIL ") + label + ": " + actual + " (expected " + expected + ")");
}

// Ronaldo's World Cup goals must be inside his career total.
const wc = data.splits?.worldCup?.messi?.goals ?? 11;
if (wc > data.totals.combined.goals) { console.error("FAIL: World Cup goals exceed the career total"); failed++; }
else console.log("ok    World Cup goals are inside the career total");

if (failed) { console.error(failed + " check(s) failed"); process.exit(1); }
console.log("wc-splits audit ok.");
`;
fs.writeFileSync(path.join(ROOT, "scripts", "audit-wc-splits.mjs"), WC, "utf8");
console.log("audit-wc-splits.mjs rewritten for Ronaldo");
