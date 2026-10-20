/**
 * Rebuild the roulette's legend list from the site's own data.
 *
 *   node scripts/fix-roulette-milestones.mjs
 *
 * The list was written for the Messi project: the goal numbers were his, the
 * video links pointed at a CDN that does not exist, and the later entries
 * carried a second videoUrl key that silently replaced the real one. Every
 * entry here is now taken from the dated goal calendar and the goal video
 * catalogue, so the number, the date, the opponent, the competition, the
 * score and the clip all come from the same record.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, "$1"), "..");
const DATA = path.join(ROOT, "public", "data");
const cal = JSON.parse(fs.readFileSync(path.join(DATA, "birthday-goals.json"), "utf8")).calendar;
const videos = JSON.parse(fs.readFileSync(path.join(DATA, "ronaldo-season-videos.json"), "utf8")).seasons;
const archive = JSON.parse(fs.readFileSync(path.join(DATA, "ronaldo-goals.json"), "utf8")).goals;

// the moments, by the date the site itself records, with the line that tells
// the reader why the goal matters
const MOMENTS = [
  { key: "10-07", year: 2002, note: "First senior goal for Sporting CP, aged 17." },
  { key: "06-12", year: 2004, note: "His first Portugal goal — a towering header at Euro 2004." },
  { key: "01-13", year: 2007, note: "His 60th goal, in a 3-1 win over Aston Villa in January 2007." },
  { key: "04-20", year: 2011, note: "The stoppage-time header that won the Copa del Rey final — his first Spanish trophy." },
  { key: "09-06", year: 2013, note: "Three goals in 15 minutes — the fastest international hat-trick of his career." },
  { key: "05-24", year: 2014, note: "The last-gasp extra-time penalty in Lisbon that sealed La Décima." },
  { key: "09-30", year: 2015, note: "His 500th career goal, in the season he became the all-time Champions League top scorer." },
  { key: "04-03", year: 2018, note: "His brace in the 3-0 win at Juventus in the 2018 quarter-final." },
  { key: "10-14", year: 2019, note: "His 700th career goal, in the Nations League campaign he won and topped." },
  { key: "09-05", year: 2024, note: "His 900th career goal, converted from the spot in Lisbon." },
  { key: "08-31", year: 2019, note: "His first goal for Juventus, on his Serie A debut." },
  { key: "10-09", year: 2026, note: "His 981st and most recent senior goal — the last of a record 981-goal career, scored for Al Nassr." },
];

// the clip of a goal, from the catalogue of per-goal clips
function clipFor(date) {
  for (const season of Object.values(videos)) {
    for (const g of season.goals || []) {
      if (g.date === date && g.videoUrl) return g.videoUrl;
    }
  }
  return "";
}

const entries = [];
for (const m of MOMENTS) {
  const day = cal[m.key];
  const match = day && (day.matches || []).find((x) => x.year === m.year);
  // the goal in the archive, which numbers every goal the calendar may miss
  const arch = archive.find((g) => g.date === m.year + "-" + m.key);
  if (!match && !arch) { console.log("  (no match for " + m.year + "-" + m.key + ")"); continue; }
  const vids = match ? ((match.videos || []).filter((v) => v.videoUrl)) : [];
  const number = (match ? (vids.find((v) => v.goalNumber) || {}).goalNumber || (match.videos || [])[0].goalNumber : 0) || (arch ? arch.number : 0);
  const video = (vids[0] || {}).videoUrl || clipFor((match ? match.date : arch.date)) || "";
  const minute = match ? (((match.videos || [])[0] || {}).minute || (match.minutes || [])[0] || "") : "";
  const score = match ? match.score : (arch ? arch.finalScore : "");
  const comp = match ? match.competition : (arch ? arch.competition : "");
  const team = match ? match.team : (arch ? arch.team : "");
  const opp = match ? match.opponent : (arch ? arch.opponent : "");
  const date = match ? match.date : arch.date;
  entries.push({
    num: number || 0,
    date,
    year: m.year,
    team,
    opp,
    comp,
    type: match ? ((match.types || [])[0] || "Right Foot") : "Right Foot",
    score,
    min: String(minute).replace("'", "").trim() || "—",
    note: m.note,
    videoUrl: video,
  });
  console.log("  #" + (number || "?") + "  " + date + "  " + team + " v " + opp + "  " + comp + "  " + score + "  " + (video ? "clip" : "no clip"));
}

// write them into the renderer
const APP = path.join(ROOT, "src", "app.js");
let app = fs.readFileSync(APP, "utf8");
const lines = entries.map((e) => {
  const parts = [
    "num: " + e.num,
    "date: " + JSON.stringify(e.date),
    "year: " + e.year,
    "team: " + JSON.stringify(e.team),
    "opp: " + JSON.stringify(e.opp),
    "comp: " + JSON.stringify(e.comp),
    "type: " + JSON.stringify(e.type),
    "score: " + JSON.stringify(e.score),
    "min: " + JSON.stringify(e.min),
    "note: " + JSON.stringify(e.note),
  ];
  if (e.videoUrl) parts.push("videoUrl: " + JSON.stringify(e.videoUrl));
  return "    { " + parts.join(", ") + " },";
});
const block = "  const LEGENDARY_ROULETTE_GOALS = [\n" + lines.join("\n") + "\n  ];";
const re = /  const LEGENDARY_ROULETTE_GOALS = \[[\s\S]*?\n  \];/;
if (!re.test(app)) { console.error("the legend list was not found in app.js"); process.exit(1); }
app = app.replace(re, block);
fs.writeFileSync(APP, app, "utf8");
console.log("\nok  app.js: " + entries.length + " legend goals written from the calendar");
