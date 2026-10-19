import fs from "node:fs";
import path from "node:path";
const P = "D:/Projects/ronaldo-stats/worker/smart-check.js";
let t = fs.readFileSync(P, "utf8");
const before = t;

// the openfootball World Cup list is still fetched: it is the only second
// source for a Portugal World Cup scoreline
t = t.replace(
  `  const boards = await Promise.all(ESPN_COMPETITIONS.map((c) => getJson(ESPN_BASE + c.code + "/scoreboard" + SEASON_QS)));`,
  `  const boards = await Promise.all(ESPN_COMPETITIONS.map((c) => getJson(ESPN_BASE + c.code + "/scoreboard" + SEASON_QS)));
  const of = await getJson(WC_JSON);
  if (!of.ok) out.errors.push("openfootball fetch failed: " + (of.status || of.error));`
);

t = t.replace("    const isArg = mentionsArgentina(e);", "    const isPortugal = mentionsRonaldo(e);");
t = t.replace("    const prov = [src(ESPN_MLS + SEASON_QS), src(WC_JSON)];", "    const prov = [src(ESPN_BASE + x.league + \"/scoreboard\" + SEASON_QS), src(WC_JSON)];");
t = t.replace("      if (isArg && of.ok) {", "      if (isPortugal && of.ok) {");
t = t.replace(
  'let note = "single-source (ESPN only): openfootball has no MLS coverage, so auto-publish is impossible";',
  'let note = "single-source (ESPN only): openfootball covers World Cup results only, so auto-publish is impossible";'
);

// the header comment still describes the old pipeline
t = t.replace(
  "// 1. Fetch ESPN usa.1 scoreboard (MLS) + ESPN fifa.world scoreboard + the",
  "// 1. Fetch ESPN's public scoreboards for every competition Ronaldo plays in"
);
t = t.replace(
  "//   cheap check (3 scoreboard fetches + 1 D1 read). If no Inter Miami or\n//   Argentina match is scheduled today AND no unseen completed match exists,",
  "//   cheap check (7 scoreboard fetches + 1 D1 read). If no Ronaldo fixture is\n//   scheduled today AND no unseen completed match exists,"
);
t = t.replace(
  "// 2. Find newly COMPLETED Inter Miami / Argentina matches not in seen_matches.",
  "// 2. Find newly COMPLETED Al Nassr / club / Portugal matches not in seen_matches."
);

if (t === before) { console.error("no change applied"); process.exit(1); }
fs.writeFileSync(P, t, "utf8");
console.log("worker staged");
const left = (t.match(/mentionsArgentina|ESPN_MLS|isArg\b/g) || []);
console.log("leftover Messi-era identifiers:", left.length ? left.join(", ") : "none");
