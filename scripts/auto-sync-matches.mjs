// Auto-sync for RonaldoStats.
//
//   node scripts/auto-sync-matches.mjs           (detect + stage for review)
//   node scripts/auto-sync-matches.mjs --check   (inspect without writing)
//
// It polls ESPN's PUBLIC scoreboards for the competitions Ronaldo plays in
// (La Liga, Premier League, Serie A, Primeira Liga, the Saudi Pro League,
// the Champions League and the World Cup), finds completed fixtures that
// involve one of his clubs or Portugal, and reads his goals and assists out
// of the match summary.
//
// IMPORTANT — the hard rule of this project:
//   this script NEVER writes a total. It only stages rows into
//   public/data/pending.json, where a human confirms them with
//   `npm run pending` before anything is folded into
//   public/data/ronaldo-data.json.
//
// No API key, no login, no paid feed.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CHECK_ONLY = process.argv.includes("--check");

// ESPN's public competition codes. A code that errors is skipped, so the
// list can grow without breaking the run.
const COMPETITIONS = [
  { code: "esp.1", label: "La Liga" },
  { code: "eng.1", label: "Premier League" },
  { code: "ita.1", label: "Serie A" },
  { code: "por.1", label: "Primeira Liga" },
  { code: "ksa.1", label: "Saudi Pro League" },
  { code: "uefa.champions", label: "UEFA Champions League" },
  { code: "fifa.world", label: "FIFA World Cup" },
];

const CLUBS = [
  "Al Nassr", "Al-Nassr", "Real Madrid", "Manchester United", "Juventus", "Sporting CP", "Portugal",
];
const PLAYER = /cristiano\s+ronaldo/i;

const H = { "User-Agent": "ronaldostats/1.0 (public scoreboard reader)" };

async function getJson(url) {
  try {
    const r = await fetch(url, { headers: H });
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}

const isRonaldoFixture = (name) => CLUBS.some((c) => new RegExp(c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(name || ""));

/** Pull Ronaldo's goal and assist counts out of a match summary. */
function readSummary(summary) {
  if (!summary) return null;
  const header = summary.header?.competitions?.[0];
  const competitors = header?.competitors || [];
  const teamName = competitors.find((c) => isRonaldoFixture(c.team?.displayName))?.team?.displayName || "";
  const events = summary.keyEvents || summary.boxscore?.plays || [];
  let goals = 0, assists = 0, minutes = [];
  for (const ev of events) {
    const athletes = ev.athletes || [];
    const scorer = athletes[0]?.athlete?.displayName || ev.participants?.[0]?.athlete?.displayName || "";
    const assister = athletes[1]?.athlete?.displayName || ev.participants?.[1]?.athlete?.displayName || "";
    const isGoal = /goal/i.test(ev.text || ev.type?.text || ev.shortText || "");
    if (!isGoal) continue;
    if (PLAYER.test(scorer)) { goals++; minutes.push(ev.clock?.displayValue || ""); }
    else if (PLAYER.test(assister)) { assists++; }
  }
  if (!goals && !assists) return null;
  return { team: teamName, goals, assists, minutes };
}

async function main() {
  const dataPath = resolve(root, "public", "data", "ronaldo-data.json");
  const data = JSON.parse(readFileSync(dataPath, "utf8"));
  const known = new Set((data.calendarYears || []).map((r) => r.year));

  const pendingPath = resolve(root, "public", "data", "pending.json");
  const pending = existsSync(pendingPath)
    ? JSON.parse(readFileSync(pendingPath, "utf8"))
    : { updated: null, generator: "scripts/auto-sync-matches.mjs", provisional: [], needs_review: [] };

  const year = new Date().getUTCFullYear();
  const candidates = new Map();

  for (const comp of COMPETITIONS) {
    const board = await getJson(`https://site.api.espn.com/apis/site/v2/sports/soccer/${comp.code}/scoreboard?dates=${year}&limit=400`);
    if (!board || !board.events) {
      console.log(`  ${comp.code.padEnd(16)} unavailable — skipped`);
      continue;
    }
    let found = 0;
    for (const ev of board.events) {
      const name = ev.name || "";
      if (!isRonaldoFixture(name)) continue;
      if (!ev.competitions?.[0]?.status?.type?.completed) continue;
      const date = ev.date?.slice(0, 10);
      if (!date) continue;
      const key = comp.code + "|" + ev.id;
      candidates.set(key, {
        id: String(ev.id),
        date,
        name,
        league: comp.label,
        competition: comp.label,
        season_year: +date.slice(0, 4),
        source: `espn:${comp.code}`,
        source_url: `https://site.api.espn.com/apis/site/v2/sports/soccer/${comp.code}/summary?event=${ev.id}`,
      });
      found++;
    }
    console.log(`  ${comp.code.padEnd(16)} ${board.events.length} events, ${found} Ronaldo fixtures`);
  }

  console.log(`\n${candidates.size} completed Ronaldo fixture(s) found.`);

  const staged = [];
  for (const c of candidates.values()) {
    const summary = await getJson(c.source_url);
    const r = readSummary(summary);
    if (!r) continue;
    const already = (pending.needs_review || []).some((row) => row.match_id === c.id);
    if (already) continue;
    staged.push({
      match_id: c.id,
      competition: c.competition,
      match_date: c.date,
      home: r.team,
      away: "",
      score_espn: "",
      score_openfootball: "",
      sources_agree: false,
      ronaldo_goals: r.goals,
      ronaldo_assists: r.assists,
      ronaldo_named: true,
      minutes: r.minutes,
      status: "needs_review",
      sources: [c.source_url],
      note: "Staged from ESPN's public scoreboard. A human confirms it before any total changes.",
    });
  }

  if (!staged.length) {
    console.log("Nothing new to stage.");
    return;
  }
  console.log(`\n${staged.length} new fixture(s) staged for human review:`);
  for (const s of staged) console.log(`  ${s.match_date}  ${s.home}  ${s.ronaldo_goals}G ${s.ronaldo_assists}A`);

  if (CHECK_ONLY) {
    console.log("\n--check: nothing written.");
    return;
  }
  pending.needs_review = [...(pending.needs_review || []), ...staged];
  pending.updated = new Date().toISOString();
  writeFileSync(pendingPath, JSON.stringify(pending, null, 2), "utf8");
  console.log("\nStaged into public/data/pending.json. Run `npm run pending` to review and confirm.");
  console.log("NOTE: no total was changed. ronaldo-data.json is untouched.");
}

main().catch((e) => { console.error("auto-sync failed:", e.message); process.exit(1); });
