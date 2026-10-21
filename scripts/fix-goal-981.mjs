/**
 * Correct the last two goals of the career:
 *
 *   #980  9 Oct 2026  Al-Nassr v Al-Diriyah FC   Saudi Pro League        23'  (3–0)
 *   #981  12 Oct 2026 Al-Nassr v Neftchi Fergana  AFC Champions League Elite 42'  (3–1)
 *
 * The live tracker logged both goals against Al-Diriyah on 9 October, which
 * merged them into one match on the calendar. The 42' goal is the Neftchi
 * Fergana goal, three days later, in the AFC Champions League Elite.
 *
 *   node scripts/fix-goal-981.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CAL = path.join(ROOT, "public", "data", "birthday-goals.json");
const TRACKER = path.join(ROOT, "public", "data", "tracker-goals.json");

const cal = JSON.parse(fs.readFileSync(CAL, "utf8"));

// --- 1. the 9 October match: one goal, the Saudi Pro League ---------------
const day9 = cal.calendar["10-09"];
const m9 = day9.matches.find((m) => m.opponent === "Al-Diriyah FC");
if (!m9) throw new Error("the 9 October Al-Diriyah match is missing");
const vid9 = (m9.videos || []).find((v) => v.minute === "23'") || m9.videos[0];
m9.competition = "Saudi Pro League";
m9.score = "3–0";
m9.goalsCount = 1;
m9.minutes = ["23'"];
m9.types = ["Right-footed shot"];
m9.videos = [
  {
    ...vid9,
    goalNumber: 980,
    minute: "23'",
    opponent: "Al-Diriyah FC",
    finish: "Right-footed shot",
    type: "Right-footed shot",
    sourcePage: "https://cr7allgoals.com/?opponent=Al-Diriyah%20FC&year=2026",
  },
];
day9.goalsCount = day9.matches.reduce((a, m) => a + (m.goalsCount || 0), 0);

// --- 2. the 12 October match: the Neftchi Fergana goal --------------------
const day12 = cal.calendar["10-12"];
if (!day12) throw new Error("the 12 October day is missing");
const already = day12.matches.find((m) => m.opponent === "Neftchi Fergana");
if (already) {
  already.competition = "AFC Champions League Elite";
  already.score = "3–1";
  already.goalsCount = 1;
  already.minutes = ["42'"];
  already.types = ["Right-footed shot"];
  already.videos = [
    {
      ...(already.videos || [])[0],
      goalNumber: 981,
      minute: "42'",
      opponent: "Neftchi Fergana",
      finish: "Right-footed shot",
      type: "Right-footed shot",
      sourcePage: "https://cr7allgoals.com/?opponent=Neftchi%20Fergana&year=2026",
    },
  ];
} else {
  day12.matches.push({
    date: "2026-10-12",
    year: 2026,
    team: "Al-Nassr",
    opponent: "Neftchi Fergana",
    competition: "AFC Champions League Elite",
    score: "3–1",
    venue: "Home",
    goalsCount: 1,
    minutes: ["42'"],
    types: ["Right-footed shot"],
    videos: [
      {
        goalNumber: 981,
        videoUrl: "",
        minute: "42'",
        opponent: "Neftchi Fergana",
        assist: "",
        xg: null,
        frekick: false,
        penalty: false,
        kind: null,
        publisher: null,
        finish: "Right-footed shot",
        type: "Right-footed shot",
        sourcePage: "https://cr7allgoals.com/?opponent=Neftchi%20Fergana&year=2026",
        sourceName: null,
      },
    ],
  });
}
// the day's matches are ordered by date, then by opponent
day12.matches.sort((a, b) => a.date.localeCompare(b.date) || a.opponent.localeCompare(b.opponent));
day12.goalsCount = day12.matches.reduce((a, m) => a + (m.goalsCount || 0), 0);

fs.writeFileSync(CAL, JSON.stringify(cal), "utf8");
console.log("the calendar is corrected");
console.log("  10-09: " + day9.goalsCount + " goals | 10-12: " + day12.goalsCount + " goals");

// --- 3. the tracker's rows ------------------------------------------------
const rows = JSON.parse(fs.readFileSync(TRACKER, "utf8"));
let fixed = 0;
for (const r of rows) {
  if (r.opp !== "Al-Diriyah FC") continue;
  if (r.minute === "23'") {
    r.num = "980";
    r.date = "10/9/2026";
    fixed++;
  } else if (r.minute === "42'") {
    r.num = "981";
    r.date = "10/12/2026";
    r.opp = "Neftchi Fergana";
    r.venue = "Home";
    fixed++;
  }
}
fs.writeFileSync(TRACKER, JSON.stringify(rows, null, 1), "utf8");
console.log("the tracker is corrected (" + fixed + " rows)");
for (const r of rows.slice(-3)) console.log("   #" + r.num + "  " + r.date + "  " + r.home + " v " + r.opp + "  " + r.minute + "'");
