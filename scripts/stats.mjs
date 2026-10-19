#!/usr/bin/env node
/**
 * scripts/stats.mjs — THE variables file for ronaldostats.site.
 *
 * Every number the site displays lives here as a named variable, read from
 * the JSON source files (the database) with all derived values computed —
 * never hand-typed. Update a JSON (or let the auto-syncs do it after a
 * match) and every consumer picks it up:
 *
 *   build time : generators (build-ronaldo-vs-messi, build-sitemap,
 *                sync-latest-goal-html, ...) + scripts/sync-totals-everywhere.mjs
 *   runtime    : src/app.js LIVE object (populated from the same JSONs via
 *                fetch; same names, same derivation — see normalize())
 *
 * Two data sets:
 *   ronaldo — public/data/ronaldo-data.json   the subject of the site
 *   messi   — public/data/messi.json           the rival, for the head-to-head
 *
 * Usage (build scripts):
 *   import { S } from "./stats.mjs";
 *   console.log(S.goals); // 981
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const readJson = (p, fallback = null) => {
  try {
    return JSON.parse(fs.readFileSync(path.join(root, p), "utf8"));
  } catch {
    return fallback;
  }
};

const ronaldo = readJson("public/data/ronaldo-data.json", {});
const messi = readJson("public/data/messi.json", null);
const latest = readJson("public/data/latest-goal.json", {});
const bday = readJson("public/data/birthday-goals.json", {});

// ---- base totals (Ronaldo) ------------------------------------------------
const goals = ronaldo.totals?.combined?.goals ?? 981;
const apps = ronaldo.totals?.combined?.appearances ?? 1340;
const clubGoals = ronaldo.totals?.club?.goals ?? 835;
const clubApps = ronaldo.totals?.club?.appearances ?? 1106;
const countryGoals = ronaldo.totals?.country?.goals ?? 146;
const countryCaps = ronaldo.totals?.country?.appearances ?? 234;
const assists = ronaldo.totals?.assists?.official ?? 261;
const tmAssists = ronaldo.totals?.assists?.transfermarkt ?? 291;
const ga = ronaldo.totals?.goalContributions?.official ?? 1242;
const tmGa = ronaldo.totals?.goalContributions?.transfermarkt ?? 1272;
const gpg = ronaldo.totals?.goalsPerGame ?? 0.73;
const gaPerGame = ronaldo.totals?.goalContributions?.perGameOfficial ?? 0.93;
const assistsByTeam = ronaldo.totals?.assists?.byTeam ?? {};
const alnassrGoals = ronaldo.totals?.club?.goals ?? 835;
const alnassrApps = assistsByTeam.al_nassr?.appearances ?? 157;
const season2026Goals = (ronaldo.calendarYears || []).find((r) => r.year === 2026)?.goals ?? 24;

// ---- breakdowns -------------------------------------------------------------
const fin = {};
(ronaldo.byFinish || []).forEach((r) => { fin[r.finish] = r.goals; });
const byFinish = { openPlay: fin["Open play"] ?? 731, penalties: fin["Penalties"] ?? 184, freeKicks: fin["Free kicks"] ?? 66 };
const bp = {};
(ronaldo.byBodyPart || []).forEach((r) => { bp[r.part] = r.goals; });
const byBody = { left: bp["Left foot"] ?? 186, right: bp["Right foot"] ?? 634, head: bp["Head"] ?? 158, other: bp["Other (chest etc.)"] ?? 3 };
const hatTricks = ronaldo.hatTricks ?? 66;
const cal2026 = (ronaldo.calendarYears || []).find((r) => r.year === 2026) || { goals: 24, careerTotal: goals };

// Trophy count per team, derived from the itemised list (years.length).
const trophiesByTeam = {};
(ronaldo.trophies || []).forEach((x) => {
  if (x.team === "Individual") return;
  trophiesByTeam[x.team] = (trophiesByTeam[x.team] || 0) + (x.years?.length ?? 0);
});
const trophies = Object.values(trophiesByTeam).reduce((a, b) => a + b, 0) || 35;
const individualHonours = (ronaldo.trophies || []).filter((x) => x.team === "Individual");
const rTrophies = messi?.trophies ?? 46;
const rBallons = messi?.ballonsDO ?? 8;
const wc = ronaldo.splits?.worldCup || {};
const finals = ronaldo.splits?.finals || {};
const continental = ronaldo.splits?.continental || { messi: 3 };

// ---- Messi baseline (the rival) ---------------------------------------------
const rGoals = messi?.goals ?? 936;
const rApps = messi?.appearances ?? 1181;
const rAssists = messi?.assists ?? 408;

// ---- latest goal ------------------------------------------------------------
const latestGoal = latest.latestGoal || {};
const recentGoals = latest.recentGoals || [];

// ---- derived (computed, never stored) ---------------------------------------
const gap = goals - rGoals;          // Ronaldo leads on goals
const fewer = apps - rApps;          // Ronaldo plays more
const road = 1000 - goals;
const rGpg = rApps ? +(rGoals / rApps).toFixed(2) : 0.79;
const rGa = rGoals + rAssists;
const astLead = assists - rAssists;  // Messi leads on assists
const penRonaldo = byFinish.penalties;
const penMessi = messi?.penalties ?? 109;
const npg = goals - penRonaldo;
const npgR = rGoals - penMessi;
const npgLead = npg - npgR;

export const S = {
  goals, apps, clubGoals, clubApps, countryGoals, countryCaps,
  assists, tmAssists, ga, tmGa, gpg, gaPerGame, assistsByTeam,
  alnassrGoals, alnassrApps, season2026Goals,
  byFinish, byBody, hatTricks, cal2026, trophiesByTeam,
  trophies, individualHonours, rTrophies, rBallons, wc, finals, continental,
  rGoals, rApps, rAssists, gap, fewer, road, rGpg, rGa, astLead,
  npg, npgR, npgLead,
  latestGoal, recentGoals,
  bdayTotalGoals: bday.meta?.totalGoals ?? 981,
  byCompetition: ronaldo.byCompetition || [],
};

export default S;
