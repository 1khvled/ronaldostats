// merge-goal-source.mjs — reconcile the dated goal calendar with the
// sourced per-goal archive, and attach the media links.
//
//   node scripts/merge-goal-source.mjs
//
// WHAT IT DOES
//   1. Flattens the calendar into one record per goal.
//   2. Matches every goal against the source archive (cr7allgoals.com, whose
//      own list comes from Wikipedia's "List of senior career goals by
//      Cristiano Ronaldo" — revision-pinned, CC BY-SA 4.0 — which is built on
//      FBref's goal log). The match is on team + opponent + the nearest date.
//   3. Where the source has the goal, its DATE, competition, score after the
//      goal, final score, minute, finish and assist are adopted. The open
//      export the calendar was first built from has a handful of off-by-one
//      dates; the source's dates are the citable ones.
//   4. Rebuilds the calendar from the reconciled records and attaches a
//      `videos[]` entry to every goal in the shape the Messi site used:
//      the media that contains the goal, its publisher, and the stable
//      per-goal page on the archive.
//
// The calendar's totals are never changed: this only improves provenance,
// the dates and the media.
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CAL = path.join(ROOT, "public", "data", "birthday-goals.json");
const SRC = path.join(ROOT, "public", "data", "ronaldo-goals.json");

const cal = JSON.parse(fs.readFileSync(CAL, "utf8"));
const src = JSON.parse(fs.readFileSync(SRC, "utf8"));

// --- name matching ---------------------------------------------------------
const strip = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .replace(/\b(fc|cf|ac|as|sc|afc|ss|cds|calcio|club|cd|sd|rc|us|do|la|le|el|il|der|and|1913)\b/g, " ")
  .replace(/[^a-z0-9]+/g, " ").trim();
const norm = (s) => strip(s).replace(/\b(al ?nassr|nassr)\b/g, "alnassr");
const sameName = (a, b) => {
  const x = norm(a), y = norm(b);
  if (!x || !y) return false;
  if (x === y) return true;
  if (x.startsWith(y) || y.startsWith(x)) return true;
  return x.replace(/ /g, "") === y.replace(/ /g, "");
};
const dayDiff = (a, b) => Math.round((Date.parse(a + "T00:00:00Z") - Date.parse(b + "T00:00:00Z")) / 86400000);

// --- source pools ----------------------------------------------------------
const pool = new Map();   // "team|opp" -> goals[]
for (const g of src.goals) {
  const k = norm(g.team) + "|" + norm(g.opponent);
  (pool.get(k) || pool.set(k, []).get(k)).push(g);
}
// a looser pool, keyed by the first word of the opponent
const loose = new Map();
for (const g of src.goals) {
  const k = norm(g.team) + "|" + norm(g.opponent).split(" ")[0];
  (loose.get(k) || loose.set(k, []).get(k)).push(g);
}
const used = new Set();

/** The best source goal for one of our goals, or null. */
function findSource(rec) {
  const key = norm(rec.team) + "|" + norm(rec.opponent);
  let poolList = pool.get(key);
  if (!poolList) {
    // try the opponent's first word
    const first = norm(rec.opponent).split(" ")[0];
    poolList = (loose.get(norm(rec.team) + "|" + first) || []).filter((g) => sameName(g.opponent, rec.opponent));
  }
  if (!poolList || !poolList.length) return null;
  let best = null, bestDiff = Infinity;
  for (const g of poolList) {
    if (used.has(g.number)) continue;
    const d = Math.abs(dayDiff(g.date, rec.date));
    if (d < bestDiff) { bestDiff = d; best = g; }
  }
  if (!best) return null;
  // a goal can only be a different match if the dates are close
  if (bestDiff > 4) return null;
  used.add(best.number);
  return { goal: best, diff: bestDiff };
}

// --- per-goal details: minute / finish / assist ----------------------------
const detailPool = new Map();
for (const list of Object.values(src.details || {})) {
  for (const d of list) {
    const k = d.date + "|" + norm(d.opponent);
    (detailPool.get(k) || detailPool.set(k, []).get(k)).push(d);
  }
}
const detailsUsed = new Set();
function findDetail(date, opponent) {
  const exact = detailPool.get(date + "|" + norm(opponent));
  if (exact) {
    for (const d of exact) {
      const k = date + "|" + norm(opponent) + "|" + (d.minute || "") + "|" + (d.finish || "");
      if (!detailsUsed.has(k)) { detailsUsed.add(k); return d; }
    }
  }
  for (const [k, list] of detailPool) {
    if (!k.startsWith(date + "|")) continue;
    const o = k.split("|")[1];
    if (!sameName(o, opponent)) continue;
    for (const d of list) {
      const dk = k + "|" + (d.minute || "") + "|" + (d.finish || "");
      if (!detailsUsed.has(dk)) { detailsUsed.add(dk); return d; }
    }
  }
  return null;
}

// --- 1. flatten the calendar into one record per goal ----------------------
const records = [];
for (const day of Object.values(cal.calendar)) {
  for (const m of day.matches) {
    const minutes = m.minutes || [];
    const types = m.types || [];
    for (let i = 0; i < m.goalsCount; i++) {
      const minute = minutes[i] || "";
      // the goal number the calendar already carries: the published one when
      // the source has numbered it, the curated one for the goals that are
      // newer than the source's last entry
      const vid = (m.videos || []).find((v) => v.minute === minute) || (m.videos || [])[i] || {};
      records.push({
        date: m.date,
        team: m.team,
        opponent: m.opponent,
        competition: m.competition,
        score: m.score,
        venue: m.venue,
        minute,
        type: types[i] || "",
        curatedNumber: vid.goalNumber != null ? vid.goalNumber : null,
      });
    }
  }
}
console.log("calendar goals before reconciliation:", records.length);

// --- 2. reconcile ----------------------------------------------------------
let matched = 0, moved = 0, withMedia = 0, withDetail = 0;
for (const rec of records) {
  const hit = findSource(rec);
  if (!hit) { rec.sourceNumber = null; rec.sourcePage = null; rec.media = []; continue; }  matched++;
  const g = hit.goal;
  if (g.date !== rec.date) moved++;
  rec.date = g.date;
  rec.competition = g.competition || rec.competition;
  rec.score = g.finalScore || rec.score;
  rec.scoreAfterGoal = g.scoreAfterGoal || null;
  rec.venue = g.venue || rec.venue;
  rec.sourceNumber = g.number;
  rec.sourcePage = g.sourcePage;
  rec.media = g.media || [];
  if (rec.media.length) withMedia++;

  const det = findDetail(g.date, g.opponent);
  if (det) {
    withDetail++;
    rec.minute = det.minute ? String(det.minute).replace(/′/g, "'").replace(/’/g, "'") : rec.minute;
    rec.type = det.finish || rec.type;
    rec.assist = det.assistedBy || "";
  }
}
console.log("matched to the source:", matched, "| dates corrected:", moved);
console.log("goals with a media link:", withMedia, "| goals with a sourced minute/finish:", withDetail);

// --- 3. rebuild the calendar ----------------------------------------------
const matches = new Map();
for (const rec of records) {
  const key = rec.date + "|" + norm(rec.team) + "|" + norm(rec.opponent);
  if (!matches.has(key)) {
    matches.set(key, {
      date: rec.date,
      year: +rec.date.slice(0, 4),
      team: rec.team,
      opponent: rec.opponent,
      competition: rec.competition,
      score: rec.score,
      venue: rec.venue,
      goalsCount: 0,
      minutes: [],
      types: [],
      videos: [],
    });
  }
  const m = matches.get(key);
  m.goalsCount++;
  if (rec.minute) m.minutes.push(rec.minute);
  if (rec.type) m.types.push(rec.type);
  const pick = (rec.media || []).find((x) => x.relation === "exact-goal")
    || (rec.media || []).find((x) => x.relation === "match-highlights")
    || (rec.media || []).find((x) => x.relation === "compilation-member")
    || null;
  m.videos.push({
    goalNumber: rec.sourceNumber != null ? rec.sourceNumber : rec.curatedNumber,
    videoUrl: pick ? pick.url : "",
    minute: rec.minute || "",
    opponent: rec.opponent,
    assist: rec.assist || "",
    xg: null,
    frekick: /free kick/i.test(rec.type || ""),
    penalty: /penalt/i.test(rec.type || ""),
    kind: pick ? pick.kind : null,
    publisher: pick ? pick.publisher : null,
    finish: rec.type || "",
    type: rec.type || "",
    sourcePage: rec.sourcePage || ("https://cr7allgoals.com/?opponent=" + encodeURIComponent(rec.opponent) + "&year=" + rec.date.slice(0, 4)),
    sourceName: rec.sourcePage ? "cr7allgoals.com" : null,
  });
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
// a goal number belongs to one goal: the published number always wins, a
// curated number that would repeat one is dropped rather than shown twice
const takenNumbers = new Set();
for (const m of matches.values()) {
  for (const v of m.videos) {
    if (v.goalNumber == null) continue;
    if (takenNumbers.has(v.goalNumber)) { v.goalNumber = null; continue; }
    takenNumbers.add(v.goalNumber);
  }
}
const calendar = {};
let totalGoals = 0;
for (let mo = 1; mo <= 12; mo++) {
  const dim = new Date(2024, mo, 0).getDate();
  for (let d = 1; d <= dim; d++) {
    const key = String(mo).padStart(2, "0") + "-" + String(d).padStart(2, "0");
    const dayMatches = [...matches.values()].filter((x) => x.date.slice(5, 7) === key.slice(0, 2) && x.date.slice(8, 10) === key.slice(3, 5))
      .sort((a, b) => a.date.localeCompare(b.date) || a.opponent.localeCompare(b.opponent));
    const goalsCount = dayMatches.reduce((a, x) => a + x.goalsCount, 0);
    totalGoals += goalsCount;
    calendar[key] = {
      key,
      month: mo,
      day: d,
      monthName: MONTHS[mo - 1],
      formatted: d + " " + MONTHS[mo - 1],
      goalsCount,
      matches: dayMatches.map((x) => ({
        date: x.date,
        year: x.year,
        team: x.team,
        opponent: x.opponent,
        competition: x.competition,
        score: x.score,
        venue: x.venue,
        goalsCount: x.goalsCount,
        minutes: x.minutes,
        types: x.types,
        videos: x.videos,
      })),
    };
  }
}
cal.calendar = calendar;

// --- 4. hat-tricks ---------------------------------------------------------
cal.hatTricks = (cal.hatTricks || []).map((h) => {
  const key = String(+h.calendarDay.split(" ")[1]).padStart(2, "0") + "-" + String(+h.calendarDay.split(" ")[0]).padStart(2, "0");
  const day = calendar[key];
  const m = (day?.matches || []).find((x) => x.opponent === h.opponent);
  return { ...h, videos: m ? m.videos : [] };
});

// --- 5. meta ---------------------------------------------------------------
const daysWithGoals = Object.values(calendar).filter((c) => c.goalsCount > 0).length;
cal.meta.daysWithGoals = daysWithGoals;
cal.meta.daysWithoutGoals = Object.keys(calendar).length - daysWithGoals;
cal.meta.percentDaysScored = +((daysWithGoals / Object.keys(calendar).length) * 100).toFixed(1);
cal.meta.topDays = Object.values(calendar)
  .filter((c) => c.goalsCount > 0)
  .sort((a, b) => b.goalsCount - a.goalsCount || a.key.localeCompare(b.key))
  .slice(0, 15)
  .map((c) => ({ key: c.key, formatted: c.formatted, goalsCount: c.goalsCount, matchCount: c.matches.length }));
cal.meta.coverage.datedGoals = totalGoals;
cal.meta.coverage.source = {
  name: "cr7allgoals.com",
  home: src.meta.sourceHome,
  perGoalPage: src.meta.perGoalPagePattern,
  attribution: src.meta.attribution,
  licence: src.meta.licence,
  retrievedAt: src.meta.retrievedAt,
  goalsIndexed: src.meta.goals,
  goalsMatched: matched,
  goalsWithExactClip: src.meta.goalsWithExactClip,
  goalsInCompilation: src.meta.goalsInCompilation,
  datesCorrected: moved,
};
cal.meta.coverage.note =
  "Every entry is a real, dated match with an opponent, a competition and a score. The international list is RSSSF's appearance list — 234 caps, 146 goals — with the per-year competitive/friendly split parsed from it. The per-goal dates, competitions, scores, minutes, finishes and assists come from cr7allgoals.com, whose own list is Wikipedia's 'List of senior career goals by Cristiano Ronaldo' (CC BY-SA 4.0, built on FBref's goal log); the reviewed event data is StatsBomb open data. Where a minute is not published it is left empty rather than invented.";

fs.writeFileSync(CAL, JSON.stringify(cal), "utf8");
console.log("rebuilt calendar:", totalGoals, "goals across", matches.size, "matches; days with a goal:", daysWithGoals);
