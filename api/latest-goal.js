// api/latest-goal.js — Vercel serverless function.
//
// Answers "did Ronaldo score today?" from ESPN's PUBLIC scoreboards for the
// competitions he plays in. It never returns a video URL: the project does
// not host or stream match footage, only the match record.
//
// Free sources, no API key, no login.
//
//   GET /api/latest-goal            -> the current status
//   GET /api/latest-goal?days=7     -> the fixtures of the last N days
const COMPETITIONS = [
  { code: "esp.1", label: "La Liga" },
  { code: "eng.1", label: "Premier League" },
  { code: "ita.1", label: "Serie A" },
  { code: "por.1", label: "Primeira Liga" },
  { code: "ksa.1", label: "Saudi Pro League" },
  { code: "uefa.champions", label: "UEFA Champions League" },
  { code: "fifa.world", label: "FIFA World Cup" },
];

const CLUBS = ["Al Nassr", "Al-Nassr", "Real Madrid", "Manchester United", "Juventus", "Sporting CP", "Portugal"];
const PLAYER = /cristiano\s+ronaldo/i;
const H = { "User-Agent": "ronaldostats/1.0 (public scoreboard reader)" };

const isRonaldoFixture = (name) =>
  CLUBS.some((c) => new RegExp(c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(name || ""));

async function getJson(url) {
  try {
    const r = await fetch(url, { headers: H });
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}

function readSummary(summary) {
  if (!summary) return null;
  const header = summary.header?.competitions?.[0];
  const competitors = header?.competitors || [];
  const team = competitors.find((c) => isRonaldoFixture(c.team?.displayName))?.team?.displayName || "";
  const events = summary.keyEvents || summary.boxscore?.plays || [];
  let goals = 0, assists = 0, minutes = [];
  for (const ev of events) {
    const isGoal = /goal/i.test(ev.text || ev.type?.text || ev.shortText || "");
    if (!isGoal) continue;
    const scorer = ev.athletes?.[0]?.athlete?.displayName || ev.participants?.[0]?.athlete?.displayName || "";
    const assister = ev.athletes?.[1]?.athlete?.displayName || ev.participants?.[1]?.athlete?.displayName || "";
    if (PLAYER.test(scorer)) { goals++; minutes.push(ev.clock?.displayValue || ""); }
    else if (PLAYER.test(assister)) { assists++; }
  }
  if (!goals && !assists) return null;
  return { team, goals, assists, minutes };
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "s-maxage=120, stale-while-revalidate=300");
  res.setHeader("Access-Control-Allow-Origin", "*");

  const days = Math.min(Number(new URL(req.url, "http://x").searchParams.get("days")) || 1, 30);
  const now = new Date();
  const dates = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(now.getTime() - i * 86400000);
    dates.push(d.toISOString().slice(0, 10));
  }

  const fixtures = [];
  for (const comp of COMPETITIONS) {
    for (const date of dates) {
      const board = await getJson(
        `https://site.api.espn.com/apis/site/v2/sports/soccer/${comp.code}/scoreboard?dates=${date}&limit=60`
      );
      if (!board || !board.events) continue;
      for (const ev of board.events) {
        if (!isRonaldoFixture(ev.name || "")) continue;
        const summary = await getJson(
          `https://site.api.espn.com/apis/site/v2/sports/soccer/${comp.code}/summary?event=${ev.id}`
        );
        const r = readSummary(summary);
        fixtures.push({
          date: ev.date,
          name: ev.name,
          competition: comp.label,
          status: ev.status?.type?.description || "",
          completed: !!ev.competitions?.[0]?.status?.type?.completed,
          ronaldo_goals: r ? r.goals : 0,
          ronaldo_assists: r ? r.assists : 0,
          minutes: r ? r.minutes : [],
        });
      }
    }
  }

  const today = now.toISOString().slice(0, 10);
  const todays = fixtures.filter((f) => (f.date || "").slice(0, 10) === today);
  const scoredToday = todays.some((f) => f.ronaldo_goals > 0);
  const last = fixtures
    .filter((f) => f.completed && f.ronaldo_goals + f.ronaldo_assists > 0)
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))[0] || null;

  res.status(200).json({
    didScoreToday: scoredToday,
    hasMatchToday: todays.length > 0,
    todayFixtures: todays,
    lastGoalMatch: last,
    fixtures,
    note: "No video is hosted or streamed. The site publishes the match record only.",
    checkedAt: new Date().toISOString(),
  });
}
