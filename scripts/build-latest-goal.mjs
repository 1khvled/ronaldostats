// Build public/data/latest-goal.json — the "did Ronaldo score today?" feed.
//
// It is derived from public/data/birthday-goals.json, which holds every dated
// goal with its opponent, competition, score, minute and finish type. There
// are no video clips for Ronaldo, so the feed carries match facts only and
// the pages render a match card instead of a player.
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const bday = JSON.parse(fs.readFileSync(path.join(ROOT, "public/data/birthday-goals.json"), "utf8"));

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// flatten the calendar into one list of dated goals
const all = [];
for (const day of Object.values(bday.calendar || {})) {
  for (const m of day.matches || []) {
    for (let i = 0; i < m.goalsCount; i++) {
      all.push({
        date: m.date,
        year: m.year,
        team: m.team,
        opponent: m.opponent,
        competition: m.competition,
        score: m.score,
        venue: m.venue,
        minute: (m.minutes || [])[i] || (m.minutes || [])[0] || "",
        type: (m.types || [])[i] || (m.types || [])[0] || "",
      });
    }
  }
}
all.sort((a, b) => b.date.localeCompare(a.date) || (b.minute || "").localeCompare(a.minute || ""));

const fmtDate = (iso) => {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
};
const shortDate = (iso) => {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};
const bdayKey = (iso) => iso.slice(5);
const title = (g) => (g.team === "Portugal" ? "Portugal" : g.team) + " " + (g.score || "") + " " + g.opponent;

const toCard = (g, n) => ({
  goalNumber: n,
  title: title(g),
  meta: g.competition + " • " + shortDate(g.date),
  match: "vs " + g.opponent + (g.score ? " (" + g.score + ")" : ""),
  date: shortDate(g.date) + (g.minute ? " • " + g.minute : ""),
  minute: g.minute,
  type: g.type,
  tag: g.type ? g.type : "Goal",
  score: g.score,
  comp: g.competition,
  bdayUrl: "/en/birthday/" + bdayKey(g.date),
});

// the five most recent goals, newest first
const recent = all.slice(0, 5);
const recentGoals = recent.map((g, i) => toCard(g, 981 - i));
const lg = recent[0];

const feed = {
  syncedAt: new Date().toISOString(),
  latestGoal: {
    goalNumber: 981,
    team: lg.team,
    opponent: lg.opponent,
    competition: lg.competition,
    competitionSlug: (lg.competition || "").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    date: lg.date,
    formattedDate: fmtDate(lg.date),
    bdayKey: bdayKey(lg.date),
    minute: lg.minute,
    clock: lg.minute,
    type: lg.type,
    finish: lg.type,
    assist: "",
    score: lg.score,
    venue: lg.venue,
    title: title(lg),
    videoUrl: "",
    bdayUrl: "/en/birthday/" + bdayKey(lg.date),
  },
  todayStatus: {
    didScoreToday: false,
    hasMatchToday: false,
    lastMatchDate: lg.date,
    lastMatchOpponent: lg.opponent,
    lastMatchResult: title(lg),
    lastGoalNumber: 981,
    lastGoalMinute: lg.minute,
  },
  recentGoals,
  totals: {
    goals: 981,
    alnassrGoals: 134,
    alnassrApps: 157,
    season2026Goals: 24,
    portugueseGoals: 146,
    portugueseCaps: 234,
  },
};

// The feed carries a "syncedAt" stamp. Writing it on every run would
  // change the file every time, and a changed file is a commit, and a commit
  // is a deployment. The stamp is only refreshed when the goal itself changed.
  const out = path.join(ROOT, "public/data/latest-goal.json");
  const material = (f) => {
    const c = { ...f };
    delete c.syncedAt;
    return JSON.stringify(c);
  };
  let previous = null;
  try { previous = JSON.parse(fs.readFileSync(out, "utf8")); } catch (e) { previous = null; }
  if (!previous || material(previous) !== material(feed)) {
    fs.writeFileSync(out, JSON.stringify(feed, null, 1), "utf8");
    console.log("  the latest goal changed: the feed is written");
  } else {
    console.log("  the latest goal is unchanged: the feed is left alone");
  }
console.log("latest-goal.json written — latest:", lg.date, "vs", lg.opponent, "| recent:", recentGoals.length);
