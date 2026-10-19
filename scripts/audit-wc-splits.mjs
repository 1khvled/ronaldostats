// audit-wc-splits.mjs — check the World Cup split for both players.
//
// Ronaldo: 11 goals in 27 FIFA World Cup matches — the record for a European
// player, and the first man to score at six World Cups.
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

const R = data.splits?.ronaldo || {};
const M = data.splits?.worldCup?.messi || {};

const checks = [
  ["Ronaldo World Cup goals", 11, R.worldCup?.goals],
  ["Ronaldo World Cup appearances", 27, R.worldCup?.apps],
  ["Ronaldo World Cup knockout goals", 1, R.worldCup?.koGoals],
  ["Messi World Cup goals", 21, M.goals],
  ["Messi World Cup knockout goals", 4, M.koGoals],
  ["Ronaldo Champions League goals", 140, R.continental?.goals],
  ["Ronaldo Champions League assists", 42, R.continental?.assists],
  ["Ronaldo senior team trophies", 35, R.trophies],
  ["Ronaldo Ballons d'Or", 5, R.ballons],
  ["Messi senior team trophies", 46, messi.trophies],
  ["Messi Ballons d'Or", 8, messi.ballonsDO],
];

let failed = 0;
for (const [label, expected, actual] of checks) {
  const ok = expected === actual;
  if (!ok) failed++;
  console.log((ok ? "ok   " : "FAIL ") + label + ": " + actual + " (expected " + expected + ")");
}

if ((R.worldCup?.goals ?? 0) > data.totals.combined.goals) {
  console.error("FAIL: the World Cup goals exceed the career total");
  failed++;
} else {
  console.log("ok    the World Cup goals are inside the career total");
}

if (failed) { console.error(failed + " check(s) failed"); process.exit(1); }
console.log("wc-splits audit ok.");
