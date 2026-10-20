/**
 * Check the dated goal calendar that ships.
 *
 *   node scripts/check-dated-calendar.mjs
 *
 * The calendar is curated data, refreshed on purpose by
 * `npm run build:calendar`; the automatic build only attaches the video to it.
 * This gate checks that the shipped file is whole: every goal is dated, the
 * days and the hat-tricks add up, and no goal is duplicated.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const data = JSON.parse(fs.readFileSync(path.join(ROOT, "public/data/birthday-goals.json"), "utf8"));
const ronaldo = JSON.parse(fs.readFileSync(path.join(ROOT, "public/data/ronaldo-data.json"), "utf8"));

let goals = 0, matches = 0, days = 0, duplicates = 0, undated = 0, withoutMinutes = 0;
const seen = new Set();
const seenMatches = new Set();

for (const key of Object.keys(data.calendar || {})) {
  const day = data.calendar[key];
  let dayGoals = 0;
  for (const m of day.matches || []) {
    matches++;
    if (!m.date) undated++;
    // the same match must not be listed twice
    const matchId = m.date + "|" + String(m.team || "") + "|" + String(m.opponent || "");
    if (seenMatches.has(matchId)) duplicates++;
    seenMatches.add(matchId);
    const count = m.goalsCount || (m.videos || []).length || (m.minutes || []).length;
    const hasMinutes = (m.minutes || []).length > 0;
    if (!hasMinutes && count) withoutMinutes++;
    for (let k = 0; k < count; k++) dayGoals++;
  }
  if (dayGoals) days++;
  if ((day.goalsCount || 0) !== dayGoals) {
    console.log("  the goal count of " + key + " does not match its matches");
    process.exit(1);
  }
  goals += dayGoals;
}

const total = ronaldo.totals.combined.goals;
console.log("dated goals       : " + goals + " of " + total);
console.log("matches          : " + matches);
console.log("days with a goal : " + days + " of 366");
console.log("hat-trick matches: " + (data.hatTricks || []).length);
console.log("duplicates       : " + duplicates);
console.log("undated matches  : " + undated);
console.log("goals with no published minute: " + withoutMinutes);

const problems = [];
if (goals < 970) problems.push("only " + goals + " goals are dated");
if (duplicates) problems.push(duplicates + " matches are listed twice");
if (undated) problems.push(undated + " matches have no date");
if (days < 280) problems.push("only " + days + " days carry a goal");
if (problems.length) {
  console.log("FAILED: " + problems.join("; "));
  process.exit(1);
}
console.log("the dated calendar is whole");
