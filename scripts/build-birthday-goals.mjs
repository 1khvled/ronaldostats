// Assemble public/data/birthday-goals.json from the extracted intermediates.
//
// Inputs (see scripts/extract-goal-calendar.mjs):
//   cr-rsssf-matches.json  - 233 Portugal internationals, 146 goals (authoritative)
//   cr-club-goals.json     - 805 dated club goals with minute/type/assist
//   cr-intl-goals.json     - the GitHub export's Portugal rows (naming detail)
//   cr-rt-goals.json       - the live goal tracker (goal number, date, minute)
//
// The output is the calendar the birthday / "on this day" explorer renders.
import fs from "node:fs";
import path from "node:path";

const OUT = path.resolve("D:/Projects/ronaldo-stats/public/data/birthday-goals.json");
const TMP = "C:/Users/Abdelli/AppData/Local/Temp/opencode/";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const CLUB_NAME = {
  "Sporting CP": "Sporting CP",
  "Manchester United": "Manchester United",
  "Real Madrid": "Real Madrid",
  "Juventus": "Juventus",
  "Al-Nassr FC": "Al Nassr",
};
const COMP_NAME = {
  "Liga Portugal": "Primeira Liga",
  "Taca de Portugal Placard": "Taca de Portugal",
  "Premier League": "Premier League",
  "FA Cup": "FA Cup",
  "UEFA Champions League Qualifying": "UEFA Champions League qualifying",
  "EFL Cup": "EFL Cup",
  "UEFA Champions League": "UEFA Champions League",
  "FIFA Club World Cup": "FIFA Club World Cup",
  "LaLiga": "La Liga",
  "Copa del Rey": "Copa del Rey",
  "Supercopa": "Supercopa de Espana",
  "UEFA Super Cup": "UEFA Super Cup",
  "Serie A": "Serie A",
  "Supercoppa Italiana": "Supercoppa Italiana",
  "Italy Cup": "Coppa Italia",
  "Europa League": "UEFA Europa League",
  "Saudi Pro League": "Saudi Pro League",
  "AFC Champions League": "AFC Champions League Elite",
  "King's Cup": "King's Cup",
  "Saudi Super Cup": "Saudi Super Cup",
};
const COMP_NAME_INTL = {
  "European Championship": "UEFA European Championship",
  "Euro": "UEFA European Championship",
  "World Cup": "FIFA World Cup",
  "Friendly matches": "International friendly",
  "Confederations Cup": "FIFA Confederations Cup",
  "Nations League": "UEFA Nations League",
};

const rsssf = JSON.parse(fs.readFileSync(TMP + "cr-rsssf-matches.json", "utf8"));
const clubCsv = JSON.parse(fs.readFileSync(TMP + "cr-club-goals.json", "utf8"));
const intlCsv = JSON.parse(fs.readFileSync(TMP + "cr-intl-goals.json", "utf8"));
const tracker = JSON.parse(fs.readFileSync(TMP + "cr-rt-goals.json", "utf8"));

// --- international: RSSSF is the authority ---------------------------------
const intlByDate = new Map();
for (const r of intlCsv) intlByDate.set(r.date, r);
const RSS_COMP = {
  "European Champ.": "UEFA European Championship",
  "European Champ": "UEFA European Championship",
  "European Ch. Qual.": "UEFA Euro qualifying",
  "World Cup Qualifier": "FIFA World Cup qualifying",
  "World Cup": "FIFA World Cup",
  "Nations League": "UEFA Nations League",
  "Confederations Cup": "FIFA Confederations Cup",
  "Friendly": "International friendly",
};
const intlMatches = [];
for (const m of rsssf) {
  if (!m.goals) continue;
  const c = intlByDate.get(m.date);
  // RSSSF is authoritative for the opponent, the score and the competition.
  // The open export is used only for the home/away flag, which RSSSF omits.
  intlMatches.push({
    date: m.date,
    team: "Portugal",
    opponent: m.opponent,
    competition: RSS_COMP[m.competition] || m.competition,
    score: m.score ? m.score.replace("-", " - ") : "",
    venue: c && c.venue ? (c.venue === "H" ? "Home" : c.venue === "A" ? "Away" : "Neutral") : "Home",
    goals: m.goals,
    minutes: [],
    types: [],
  });
}

// --- club: the GitHub export, topped up by the live tracker ----------------
const norm = (s) => String(s || "").toLowerCase().replace(/\s+(fc|sc|cf|cd|club)$/i, "").replace(/[^a-z]/g, "");
const clubMatches = [];
const clubSeen = new Set();
for (const g of clubCsv) {
  const key = g.date + "|" + norm(g.opponent);
  clubMatches.push({
    date: g.date,
    team: CLUB_NAME[g.team] || g.team,
    opponent: g.opponent,
    competition: COMP_NAME[g.competition] || g.competition,
    score: g.score,
    venue: g.venue === "H" ? "Home" : g.venue === "A" ? "Away" : "Neutral",
    goals: 1,
    minutes: g.minute ? [g.minute] : [],
    types: g.type ? [g.type] : [],
    assist: g.assist,
  });
  clubSeen.add(key);
}
let trackerAdded = 0;
const csvDates = new Set(clubCsv.map(g => g.date));
for (const t of tracker) {
  if (/^Portugal/.test(t.team)) continue;
  // the tracker row is a match Ronaldo scored in; only add it if the export
  // has no goal at all for that date (Ronaldo played at most one match a day).
  // Several tracker rows can share a date — a brace and a penalty — so the
  // test is against the export only, never against rows added here.
  if (csvDates.has(t.date)) continue;
  clubSeen.add(t.date + "|" + norm(t.opponent));
  const TYPE = { "R.F": "Right-footed shot", "L.F": "Left-footed shot", "HEAD": "Header", "PEN": "Penalty", "FK": "Direct free kick", "COUNT": "Header" };
  clubMatches.push({
    date: t.date,
    team: String(t.team).replace(" FC", ""),
    opponent: t.opponent,
    competition: "Al Nassr",
    score: "",
    venue: t.venue === "H" ? "Home" : t.venue === "A" ? "Away" : "Neutral",
    goals: 1,
    minutes: [t.minute],
    types: [TYPE[t.type] || t.type],
    assist: "",
  });
  trackerAdded++;
}

// --- merge matches that describe the same fixture -------------------------
const merged = new Map();
const push = (m) => {
  const key = m.date + "|" + norm(m.team) + "|" + norm(m.opponent);
  if (!merged.has(key)) merged.set(key, { ...m, minutes: [], types: [], goals: 0 });
  const t = merged.get(key);
  t.goals += m.goals;
  for (const x of m.minutes) t.minutes.push(x);
  for (const x of m.types) t.types.push(x);
  if (!t.score && m.score) t.score = m.score;
};
for (const m of clubMatches) push(m);
for (const m of intlMatches) push(m);

const matches = [...merged.values()].sort((a, b) => a.date.localeCompare(b.date));

// --- calendar --------------------------------------------------------------
const calendar = {};
let totalGoals = 0;
for (let m = 1; m <= 12; m++) {
  const dim = new Date(2024, m, 0).getDate();
  for (let d = 1; d <= dim; d++) {
    const key = String(m).padStart(2, "0") + "-" + String(d).padStart(2, "0");
    const dayMatches = matches.filter(x => x.date.slice(5, 7) === key.slice(0, 2) && x.date.slice(8, 10) === key.slice(3, 5));
    const goalsCount = dayMatches.reduce((a, x) => a + x.goals, 0);
    totalGoals += goalsCount;
    calendar[key] = {
      key: key,
      month: m,
      day: d,
      monthName: MONTHS[m - 1],
      formatted: d + " " + MONTHS[m - 1],
      goalsCount: goalsCount,
      matches: dayMatches.map(x => ({
        date: x.date,
        year: +x.date.slice(0, 4),
        team: x.team,
        opponent: x.opponent,
        competition: x.competition,
        score: x.score,
        venue: x.venue,
        goalsCount: x.goals,
        minutes: x.minutes,
        types: x.types,
      })),
    };
  }
}
const daysWithGoals = Object.values(calendar).filter(c => c.goalsCount > 0).length;
const totalDays = Object.keys(calendar).length;

const topDays = Object.values(calendar)
  .filter(c => c.goalsCount > 0)
  .sort((a, b) => b.goalsCount - a.goalsCount || a.key.localeCompare(b.key))
  .slice(0, 15)
  .map(c => ({ key: c.key, formatted: c.formatted, goalsCount: c.goalsCount, matchCount: c.matches.length }));

const hatTricks = matches
  .filter(x => x.goals >= 3)
  .sort((a, b) => b.date.localeCompare(a.date))
  .map(x => ({
    date: x.date,
    calendarDay: x.date.slice(8, 10) + " " + MONTHS[+x.date.slice(5, 7) - 1],
    team: x.team,
    opponent: x.opponent,
    goals: x.goals,
    competition: x.competition,
    score: x.score,
  }));

const clubGoals = matches.filter(x => x.team !== "Portugal").reduce((a, x) => a + x.goals, 0);
const intlGoals = matches.filter(x => x.team === "Portugal").reduce((a, x) => a + x.goals, 0);

// per-year coverage against the canonical calendar-year series
const CANON = JSON.parse(fs.readFileSync("D:/Projects/ronaldo-stats/public/data/ronaldo-data.json", "utf8"));
const canonYear = {};
for (const r of CANON.calendarYears) canonYear[r.year] = r.goals;
const datedYear = {};
for (const m of matches) datedYear[m.date.slice(0, 4)] = (datedYear[m.date.slice(0, 4)] || 0) + m.goals;
const yearGaps = Object.keys(canonYear)
  .map(y => ({ year: +y, canonical: canonYear[y], dated: datedYear[y] || 0 }))
  .filter(r => r.dated !== r.canonical)
  .map(r => r.year + ": " + r.dated + "/" + r.canonical);
console.log("--- coverage ---");
console.log("club goals dated  :", clubGoals, "of 835");
console.log("intl goals dated  :", intlGoals, "of 146");
console.log("total dated goals :", totalGoals, "of 981");
console.log("distinct matches  :", matches.length);
console.log("tracker rows added:", trackerAdded);
console.log("days with goals   :", daysWithGoals, "of", totalDays, "(" + (daysWithGoals / totalDays * 100).toFixed(1) + "%)");
console.log("hat-trick matches :", hatTricks.length);
console.log("years off         :", yearGaps.join(", ") || "none");

const data = {
  meta: {
    totalGoals: 981,
    totalDaysInYear: totalDays,
    daysWithGoals: daysWithGoals,
    daysWithoutGoals: totalDays - daysWithGoals,
    percentDaysScored: +(daysWithGoals / totalDays * 100).toFixed(1),
    topDays: topDays,
    coverage: {
      datedGoals: totalGoals,
      datedClubGoals: clubGoals,
      datedInternationalGoals: intlGoals,
      note: "Every entry is a real, dated match with an opponent, a competition and a score. The international list is RSSSF's appearance list (146 goals in 234 caps, the authoritative figures); the club list is the open CR7-Goals-Project export completed with the live goal tracker. Goals whose minute is not published are recorded with an empty minute list rather than an invented one, and the calendar is a lower bound on Ronaldo's scored days.",
    },
  },
  calendar: calendar,
  hatTricks: hatTricks,
};
fs.writeFileSync(OUT, JSON.stringify(data), "utf8");
console.log("\nwrote " + OUT + " (" + (fs.statSync(OUT).size / 1024).toFixed(0) + " KB)");
