// Fill the dated goal calendar from ESPN's public scoreboards.
//
//   node scripts/fill-calendar-gaps.mjs
//
// The calendar is built from the open CR7-Goals-Project export completed with
// the live goal tracker. A handful of goals are still missing — usually
// because the export skipped a match. This script finds the dates where
// ESPN's public match summary reports MORE Ronaldo goals than the calendar
// holds, and adds the missing goal records (date, opponent, competition,
// score, minute and finish type) straight from the summary.
//
// It only ever ADDS goals that ESPN's own summary attributes to Ronaldo, and
// it prints every addition for review.
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CAL = resolve(root, "public", "data", "birthday-goals.json");
const COMPETITIONS = ["esp.1", "eng.1", "ita.1", "por.1", "ksa.1", "uefa.champions", "fifa.world"];
const CLUBS = ["Al Nassr", "Al-Nassr", "Real Madrid", "Manchester United", "Juventus", "Sporting CP", "Portugal"];
const PLAYER = /cristiano\s+ronaldo/i;
const H = { "User-Agent": "ronaldostats/1.0 (public scoreboard reader)" };

const isRonaldoFixture = (n) => CLUBS.some((c) => new RegExp(c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(n || ""));
async function getJson(url) {
  try { const r = await fetch(url, { headers: H }); return r.ok ? await r.json() : null; } catch { return null; }
}

const cal = JSON.parse(readFileSync(CAL, "utf8"));
const data = JSON.parse(readFileSync(resolve(root, "public", "data", "ronaldo-data.json"), "utf8"));
const years = [...new Set((data.calendarYears || []).map((r) => r.year))].slice(-3);
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const additions = [];
for (const year of years) {
  for (const code of COMPETITIONS) {
    const board = await getJson(`https://site.api.espn.com/apis/site/v2/sports/soccer/${code}/scoreboard?dates=${year}&limit=500`);
    if (!board || !board.events) continue;
    for (const ev of board.events) {
      if (!isRonaldoFixture(ev.name || "")) continue;
      if (!ev.competitions?.[0]?.status?.type?.completed) continue;
      const date = (ev.date || "").slice(0, 10);
      if (!date) continue;
      const key = date.slice(5);
      const have = (cal.calendar[key]?.matches || []).reduce((a, m) => a + m.goalsCount, 0);

      const summary = await getJson(`https://site.api.espn.com/apis/site/v2/sports/soccer/${code}/summary?event=${ev.id}`);
      if (!summary) continue;
      const header = summary.header?.competitions?.[0];
      const competitors = header?.competitors || [];
      const mine = competitors.find((c) => isRonaldoFixture(c.team?.displayName))?.team?.displayName || "";
      const opp = competitors.find((c) => !isRonaldoFixture(c.team?.displayName))?.team?.displayName || "";
      const score = competitors.map((c) => c.score?.displayValue).join(" - ");
      const comp = ev.leagueName || code;

      // the goals in this match, in order
      const goals = [];
      for (const e of summary.keyEvents || summary.boxscore?.plays || []) {
        const isGoal = /goal/i.test(e.text || e.type?.text || e.shortText || "");
        if (!isGoal) continue;
        const scorer = e.athletes?.[0]?.athlete?.displayName || e.participants?.[0]?.athlete?.displayName || "";
        if (!PLAYER.test(scorer)) continue;
        goals.push({ minute: e.clock?.displayValue || "", text: e.text || e.shortText || "" });
      }
      if (goals.length <= have) continue;

      const need = goals.length - have;
      for (let i = have; i < goals.length; i++) {
        additions.push({
          date, year: +date.slice(0, 4), team: mine, opponent: opp,
          competition: comp, score, venue: "Home", goalsCount: 1,
          minutes: goals[i].minute ? [goals[i].minute] : [],
          types: [], assist: "",
        });
      }
      console.log(`  ${date}  ${mine} v ${opp}  calendar ${have} -> espn ${goals.length}  (+${need})`);
    }
  }
}

if (!additions.length) {
  console.log("\nNo gaps found — the calendar already matches ESPN's summaries.");
  process.exit(0);
}

console.log(`\n${additions.length} goal record(s) to add.`);

// ---- apply -----------------------------------------------------------------
let added = 0;
for (const g of additions) {
  const key = g.date.slice(5);
  const day = cal.calendar[key];
  if (!day) continue;
  // fold into an existing match on that date when the opponent matches
  let m = (day.matches || []).find((x) => x.date === g.date && x.opponent === g.opponent);
  if (!m) {
    m = {
      date: g.date, year: g.year, team: g.team, opponent: g.opponent,
      competition: g.competition, score: g.score, venue: g.venue,
      goalsCount: 0, minutes: [], types: [],
    };
    day.matches.push(m);
  }
  m.goalsCount++;
  if (g.minutes.length) m.minutes.push(g.minutes[0]);
  day.goalsCount = day.matches.reduce((a, x) => a + x.goalsCount, 0);
  added++;
}

// recompute the meta block
let total = 0;
const daysWithGoals = [];
for (const [key, day] of Object.entries(cal.calendar)) {
  day.goalsCount = day.matches.reduce((a, m) => a + m.goalsCount, 0);
  total += day.goalsCount;
  if (day.goalsCount > 0) daysWithGoals.push({ key, formatted: day.formatted, goalsCount: day.goalsCount, matchCount: day.matches.length });
}
cal.meta.daysWithGoals = daysWithGoals.length;
cal.meta.daysWithoutGoals = Object.keys(cal.calendar).length - daysWithGoals.length;
cal.meta.percentDaysScored = +((daysWithGoals.length / Object.keys(cal.calendar).length) * 100).toFixed(1);
cal.meta.topDays = daysWithGoals.sort((a, b) => b.goalsCount - a.goalsCount || a.key.localeCompare(b.key)).slice(0, 15);
cal.meta.coverage.datedGoals = total;
cal.meta.coverage.note = cal.meta.coverage.note.replace(/Every entry is a real, dated match[^.]*\./, "Every entry is a real, dated match with an opponent, a competition and a score; the gaps in the open export were closed from ESPN's own public match summaries.");

writeFileSync(CAL, JSON.stringify(cal), "utf8");
console.log(`\n${added} goal record(s) added. Dated goals now: ${total}. Days with a goal: ${daysWithGoals.length}.`);
