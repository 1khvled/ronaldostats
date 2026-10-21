/**
 * Rebuild the live tracker's rows the dated calendar needs.
 *
 *   node scripts/rebuild-tracker-input.mjs
 *
 * The calendar build reads the most recent goals from a live tracker. That
 * source is not reproducible on a clean machine, so the rows it supplies live
 * in the repository instead: public/data/tracker-goals.json.
 *
 * They are the goals the CSV and RSSSF sources do not cover: the rows are
 * recovered from the shipped calendar, which already carries them with their
 * minute and finish type, and the intermediate files say which goals the CSV
 * and RSSSF sources date. Only the difference is taken, so a match the CSV
 * already has contributes just the goals the CSV is missing.
 */
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TMP = path.join(os.tmpdir(), "ronaldostats-build") + path.sep;
const cal = JSON.parse(fs.readFileSync(path.join(ROOT, "public/data/birthday-goals.json"), "utf8"));
const src = JSON.parse(fs.readFileSync(path.join(ROOT, "public/data/ronaldo-goals.json"), "utf8"));

// how many goals each source already dates, per day
const have = new Map();
for (const f of ["cr-club-goals.json", "cr-intl-goals.json"]) {
  const p = TMP + f;
  if (!fs.existsSync(p)) { console.log("  (missing " + f + " — run extract-goal-calendar.mjs first)"); continue; }
  for (const g of JSON.parse(fs.readFileSync(p, "utf8"))) {
    if (!g.date) continue;
    have.set(g.date, (have.get(g.date) || 0) + (g.goalsInMatch || 1));
  }
}

// the goals nobody else dates
const rows = [];
for (const day of Object.values(cal.calendar || {})) {
  for (const m of day.matches || []) {
    const missing = (m.goalsCount || 0) - (have.get(m.date) || 0);
    if (missing <= 0) continue;
    const list = m.videos || [];
    for (let i = Math.max(0, list.length - missing); i < list.length; i++) {
      const v = list[i] || {};
      rows.push({
        num: v.goalNumber != null ? String(v.goalNumber) : "N.O",
        date: m.date,
        home: m.team,
        opp: m.opponent,
        venue: m.venue || "",
        minute: (m.minutes || [])[i] || "",
        type: (m.types || [])[i] || "",
      });
    }
  }
}
rows.sort((a, b) => a.date.localeCompare(b.date) || String(a.minute).localeCompare(String(b.minute)));

// the goals the tracker knows but the calendar cannot number: they carry on
// from the last published goal number
const archivedMax = Math.max(...(src.goals || []).map((g) => Number(g.number) || 0));
let counter = Math.max(archivedMax, ...rows.map((r) => Number(r.num) || 0));
for (const r of rows) {
  if (r.num === "N.O") { counter++; r.num = String(counter); }
  else counter = Math.max(counter, Number(r.num));
}

// the tracker renders its dates US-style (M/D/YY), which is what the build parses
const usDate = (iso) => {
  const y = Number(iso.slice(0, 4)), m = Number(iso.slice(5, 7)), d = Number(iso.slice(8, 10));
  return m + "/" + d + "/" + y;
};
for (const r of rows) r.date = usDate(r.date);

const out = path.join(ROOT, "public/data/tracker-goals.json");
fs.writeFileSync(out, JSON.stringify(rows, null, 1), "utf8");
console.log("wrote " + path.relative(ROOT, out) + " — " + rows.length + " goals the CSV and RSSSF sources do not date");
for (const r of rows) console.log("   #" + r.num + "  " + r.date + "  " + r.home + " v " + r.opp + "  " + r.minute + "'  " + r.type);
