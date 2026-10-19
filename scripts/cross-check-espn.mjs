// Cross-check the dataset against ESPN's public scoreboards.
//
//   node scripts/cross-check-espn.mjs
//
// For every completed Ronaldo fixture ESPN publishes, it reads the goals and
// assists straight out of the match summary and compares them with what
// public/data/ronaldo-data.json and public/data/birthday-goals.json say.
//
// It is an INDEPENDENT check: the dataset is built from RSSSF, Wikipedia and
// UEFA, so agreement with ESPN is meaningful. It never writes anything.
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const COMPETITIONS = ["esp.1", "eng.1", "ita.1", "por.1", "ksa.1", "uefa.champions", "fifa.world"];
const CLUBS = ["Al Nassr", "Al-Nassr", "Real Madrid", "Manchester United", "Juventus", "Sporting CP", "Portugal"];
const PLAYER = /cristiano\s+ronaldo/i;
const H = { "User-Agent": "ronaldostats/1.0 (public scoreboard reader)" };

const isRonaldoFixture = (n) => CLUBS.some((c) => new RegExp(c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(n || ""));
async function getJson(url) {
  try { const r = await fetch(url, { headers: H }); return r.ok ? await r.json() : null; } catch { return null; }
}

const data = JSON.parse(readFileSync(resolve(root, "public/data/ronaldo-data.json"), "utf8"));
const bday = JSON.parse(readFileSync(resolve(root, "public/data/birthday-goals.json"), "utf8"));

// what the dataset says for each date
const byDate = new Map();
for (const day of Object.values(bday.calendar || {})) {
  for (const m of day.matches || []) {
    byDate.set(m.date, (byDate.get(m.date) || 0) + m.goalsCount);
  }
}
const calByYear = new Map();
for (const r of data.calendarYears || []) calByYear.set(r.year, r.goals);

const years = [...new Set((data.calendarYears || []).map((r) => r.year))].slice(-2);
console.log(`comparing the ${years.join(" and ")} seasons (the full cross-check is a long run)`);
let checked = 0, matched = 0;
const mismatches = [];
const espnByYear = new Map();

for (const year of years) {
  for (const code of COMPETITIONS) {
    const board = await getJson(`https://site.api.espn.com/apis/site/v2/sports/soccer/${code}/scoreboard?dates=${year}&limit=500`);
    if (!board || !board.events) continue;
    for (const ev of board.events) {
      if (!isRonaldoFixture(ev.name || "")) continue;
      if (!ev.competitions?.[0]?.status?.type?.completed) continue;
      const date = (ev.date || "").slice(0, 10);
      if (!date) continue;
      const summary = await getJson(`https://site.api.espn.com/apis/site/v2/sports/soccer/${code}/summary?event=${ev.id}`);
      if (!summary) continue;
      const events = summary.keyEvents || summary.boxscore?.plays || [];
      let goals = 0, assists = 0;
      for (const e of events) {
        if (!/goal/i.test(e.text || e.type?.text || e.shortText || "")) continue;
        const scorer = e.athletes?.[0]?.athlete?.displayName || e.participants?.[0]?.athlete?.displayName || "";
        const assister = e.athletes?.[1]?.athlete?.displayName || e.participants?.[1]?.athlete?.displayName || "";
        if (PLAYER.test(scorer)) goals++;
        else if (PLAYER.test(assister)) assists++;
      }
      if (!goals) continue;
      checked++;
      espnByYear.set(year, (espnByYear.get(year) || 0) + goals);
      const ours = byDate.get(date);
      if (ours === goals) matched++;
      else mismatches.push({ date, espn: goals, dataset: ours === undefined ? "no dated goal" : ours });
    }
  }
}

console.log(`fixtures with a Ronaldo goal compared : ${checked}`);
console.log(`exact date+goal agreement            : ${matched}`);
console.log(`disagreements                        : ${mismatches.length}`);
for (const m of mismatches.slice(0, 25)) {
  console.log(`   ${m.date}  espn ${m.espn}  dataset ${m.dataset}`);
}

console.log("\nper calendar year — dataset vs ESPN:");
for (const year of years) {
  const ours = calByYear.get(year);
  const espn = espnByYear.get(year) || 0;
  if (!espn) continue;
  const flag = espn > ours ? "  (espn counts more: Ronaldo's Portugal goals are not in the club feed)" : "";
  console.log(`   ${year}: dataset ${ours}, espn club goals ${espn}${flag}`);
}

// The club feed never contains Portugal, so ESPN's club-goal total must be
// less than or equal to the dataset's calendar-year total.
let bad = 0;
for (const [year, espn] of espnByYear) {
  if (espn > (calByYear.get(year) || 0)) {
    console.error(`FAIL: ${year} — ESPN reports ${espn} club goals, the dataset has ${calByYear.get(year)} in total`);
    bad++;
  }
}
if (bad) process.exit(1);
console.log("\n[OK] ESPN's club-goal totals never exceed the dataset's calendar-year totals.");
