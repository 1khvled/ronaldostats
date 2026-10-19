import fs from "node:fs";
import path from "node:path";
const ROOT = "D:/Projects/ronaldo-stats";
const P = path.join(ROOT, "worker", "smart-check.js");
let t = fs.readFileSync(P, "utf8");
const before = t;

// 1. the competition list: ESPN's public codes for the competitions Ronaldo
//    plays in. A code that errors is skipped.
t = t.replace(
  'const ESPN_MLS = "https://site.api.espn.com/apis/site/v2/sports/soccer/usa.1/scoreboard";',
  `const ESPN_COMPETITIONS = [
  { code: "ksa.1", label: "Saudi Pro League" },
  { code: "esp.1", label: "La Liga" },
  { code: "eng.1", label: "Premier League" },
  { code: "ita.1", label: "Serie A" },
  { code: "por.1", label: "Primeira Liga" },
  { code: "uefa.champions", label: "UEFA Champions League" },
  { code: "fifa.world", label: "FIFA World Cup" },
];
const ESPN_BASE = "https://site.api.espn.com/apis/site/v2/sports/soccer/";`
);

// 2. team matching: Ronaldo's clubs and Portugal
t = t.replace(
  /function mentionsMiami\(e\) \{[\s\S]*?\n\}\nfunction mentionsArgentina\(e\) \{[\s\S]*?\n\}/,
  `// Team-identity matching ONLY (never a whole-JSON substring: venue city names
// such as "Miami Gardens" and recap text caused false positives).
const RONALDO_TEAMS = /al ?nassr|real madrid|manchester united|juventus|sporting cp|portugal/i;
function mentionsRonaldo(e) {
  return competitorTeams(e).some((t) => RONALDO_TEAMS.test(t.displayName || "") || RONALDO_TEAMS.test(t.shortDisplayName || "") || RONALDO_TEAMS.test(t.name || ""));
}`
);

// 3. the World Cup side check now looks for Portugal
t = t.replace(
  '    const argSide = /argentina/i.test(home) || /argentina/i.test(away);\n    if (argSide && !(/argentina/i.test(m.team1) || /argentina/i.test(m.team2))) return false;',
  '    const portSide = /portugal/i.test(home) || /portugal/i.test(away);\n    if (portSide && !(/portugal/i.test(m.team1) || /portugal/i.test(m.team2))) return false;'
);

// 4. the fetch: every competition instead of MLS + the World Cup
t = t.replace(
  `  const results = await Promise.all([getJson(ESPN_MLS + SEASON_QS), getJson(ESPN_WC + SEASON_QS), getJson(WC_JSON)]);
  const mls = results[0];
  const wc = results[1];
  const of = results[2];
  if (!mls.ok) out.errors.push("espn mls fetch failed: " + (mls.status || mls.error));
  if (!wc.ok) out.errors.push("espn fifa.world fetch failed: " + (wc.status || wc.error));
  if (!of.ok) out.errors.push("openfootball fetch failed: " + (of.status || of.error));
  const events = []
    .concat((mls.ok ? mls.data.events || [] : []).map((e) => ({ e: e, league: "usa.1" })))
    .concat((wc.ok ? wc.data.events || [] : []).map((e) => ({ e: e, league: "fifa.world" })));
  const tracked = events.filter((x) => mentionsMiami(x.e) || mentionsArgentina(x.e));`,
  `  const boards = await Promise.all(ESPN_COMPETITIONS.map((c) => getJson(ESPN_BASE + c.code + "/scoreboard" + SEASON_QS)));
  const events = [];
  ESPN_COMPETITIONS.forEach((c, i) => {
    const b = boards[i];
    if (!b.ok) { out.errors.push("espn " + c.code + " fetch failed: " + (b.status || b.error)); return; }
    (b.data.events || []).forEach((e) => events.push({ e: e, league: c.code }));
  });
  const tracked = events.filter((x) => mentionsRonaldo(x.e));`
);

if (t === before) { console.error("no change applied"); process.exit(1); }
fs.writeFileSync(P, t, "utf8");
console.log("worker/smart-check.js adapted to Ronaldo's competitions");
const left = (t.match(/mentionsMiami|mentionsArgentina|ESPN_MLS|usa\.1/g) || []);
console.log("leftover Messi-era references:", left.length ? left.join(", ") : "none");
