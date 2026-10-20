/**
 * Harvest the Ronaldo goal videos ronaldo7.net publishes.
 *
 *   node scripts/fetch-season-videos.mjs
 *
 * ronaldo7.net keeps one page per Ronaldo season. Two of the pages list every
 * single goal with its own video, named with the opponent, the date, the
 * score and a description; the rest carry one long video of that season's
 * goals. Both are useful, so both are captured:
 *
 *   - 2013/14  51 per-goal clips (Dailymotion)
 *   - 2019/20  34 per-goal clips (YouTube)
 *   - the other ten seasons: one "every goal of the season" video
 *
 * The videos are third-party uploads. They are linked and embedded, never
 * re-hosted, and every record keeps the page it came from.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const H = {
  "User-Agent": "RonaldoStats/1.0 (https://www.ronaldostats.site; build script)",
  Accept: "text/html,application/xhtml+xml",
};
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const PAGES = [
  ["2021-2022", "https://www.ronaldo7.net/video/goals-2021-2022/goals-2021-2022.html"],
  ["2020-2021", "https://www.ronaldo7.net/video/goals-2020-2021/goals-2020-2021.html"],
  ["2019-2020", "https://www.ronaldo7.net/video/goals-2019-2020/goals-2019-2020.html"],
  ["2018-2019", "https://www.ronaldo7.net/video/goals-2018-2019/goals-2018-2019.html"],
  ["2017-2018", "https://www.ronaldo7.net/video/goals-2017-2018/goals-2017-2018.html"],
  ["2016-2017", "https://www.ronaldo7.net/video/goals-2016-2017/goals-2016-2017.html"],
  ["2015-2016", "https://www.ronaldo7.net/video/goals-2015-2016/goals-2015-2016.html"],
  ["2014-2015", "https://www.ronaldo7.net/video/goals-2014-2015/goals-2014-2015.html"],
  ["2013-2014", "https://www.ronaldo7.net/video/goals-2013-2014/goals-2013-2014.html"],
  ["2012-2013", "https://www.ronaldo7.net/video/goals-2012-2013/goals-2012-2013.html"],
  ["2011-2012", "https://www.ronaldo7.net/video/goals-2011-2012/goals-2011-2012.html"],
  ["2010-2011", "https://www.ronaldo7.net/video/goalscurrent/11/goalscurrent11.html"],
];

const MONTHS = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };

const strip = (s) => s.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();

// "Aug 31, 2019" or "31-08-2019" -> "2019-08-31"
function toIso(text) {
  const s = String(text || "").trim();
  let m = s.match(/([A-Za-z]{3,9})\.?\s+(\d{1,2}),?\s+(\d{4})/);
  if (m) {
    const mo = MONTHS[m[1].slice(0, 3).toLowerCase()];
    if (mo) return `${m[3]}-${String(mo).padStart(2, "0")}-${String(m[2]).padStart(2, "0")}`;
  }
  m = s.match(/(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})/);
  if (m) return `${m[3]}-${String(m[2]).padStart(2, "0")}-${String(m[1]).padStart(2, "0")}`;
  return null;
}

// the video in a fragment
function videoIn(seg) {
  const yt = seg.match(/(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
  if (yt) return { provider: "youtube", id: yt[1], url: "https://www.youtube.com/watch?v=" + yt[1], embed: "https://www.youtube-nocookie.com/embed/" + yt[1] };
  const dm = seg.match(/dailymotion\.com\/(?:embed\/video\/)?(x[a-z0-9]+)/i);
  if (dm) return { provider: "dailymotion", id: dm[1], url: "https://www.dailymotion.com/video/" + dm[1], embed: "https://www.dailymotion.com/embed/video/" + dm[1] };
  return null;
}

const seasons = {};
let goalCount = 0;
let seasonVideoCount = 0;

for (const [season, url] of PAGES) {
  let html = "";
  try {
    const r = await fetch(url, { headers: H, redirect: "follow" });
    if (r.status === 200) html = await r.text();
  } catch (e) {
    console.log("  " + season + " -> " + e.message.slice(0, 50));
  }
  if (!html) { console.log("  " + season + ": unreachable"); continue; }

  const title = strip((html.match(/<title>([^<]*)<\/title>/) || [])[1] || "");
  // the page is about one club: "All Cristiano Ronaldo goals for Juventus in
  // 2019-2020" / "All Cristiano Ronaldo goals in Real Madrid in the 2013/2014 season"
  const clubM = title.match(/(?:for|with)\s+([A-ZÀ-Ý][A-Za-zÀ-ÿ'.\s]+?)\s+in\s+\d{4}/) ||
                title.match(/in\s+([A-ZÀ-Ý][A-Za-zÀ-ÿ'.\s]+?)\s+in\s+the\s+\d{4}/);
  const ronaldoClub = clubM ? clubM[1].trim() : "";

  // ---- format A: "Goal N / Match: X vs Y / Date: ... / Description: ..."
  // and format B: "GOAL #N  X vs Y (Mon D, YYYY)" followed by the video
  const headsA = [...html.matchAll(/Goal\s*#?\s*(\d+)\s*</gi)];
  const goals = [];
  const seen = new Set();
  for (const h of headsA) {
    const start = h.index;
    // cut the page at the next goal heading
    const rest = html.slice(start);
    const next = rest.slice(1).search(/Goal\s+\d+\s*</i);
    const seg = next > 0 ? rest.slice(0, next + 1) : rest.slice(0, 4000);
    const text = strip(seg);
    const num = Number((h[1] || h[2] || "0"));
    if (seen.has(num)) continue;

    // format A: "Match : Real Madrid vs Athletic Bilbao   Date : 01-09-2013"
    // format B: "Juventus vs Napoli (Aug 31, 2019)"
    const aM = text.match(/Match\s*:\s*(.+?)\s+vs\s+(.+?)\s+Date\s*:/i);
    const bM = text.match(/([A-Za-zÀ-ÿ'.\d ]{2,30}?)\s+vs\s+([^()]{2,45}?)\s*\(([^)]{4,40})\)/i);
    const dateM = text.match(/Date\s*:\s*([0-9]{1,2}[-/.][0-9]{1,2}[-/.][0-9]{4}|[A-Za-z]{3,9}\.?\s+[0-9]{1,2},?\s+[0-9]{4})/i);
    const scoreM = text.match(/Final score\s*:\s*([0-9]+\s*-\s*[0-9]+)/i);
    const compM = text.match(/Competition\s*:\s*([^:]{2,40}?)\s+(?:Description|Stadium|Link to watch)/i);
    const descM = text.match(/Description\s*:\s*(.+?)(?:Link to watch|$)/i);
    const vid = videoIn(seg);
    if (!aM && !bM && !vid) continue;
    seen.add(num);

    // the fixture names both sides; Ronaldo's own club is the one the page is
    // about, so the other side is the opponent
    const sideA = (aM ? aM[1] : (bM ? bM[1] : "")).replace(/^[^A-Za-zÀ-ÿ]+/, "").trim();
    const sideB = (aM ? aM[2] : (bM ? bM[2] : "")).trim();

    const rec = {
      n: num,
      team: "",
      fixture: (sideA && sideB) ? sideA + " vs " + sideB : "",
      home: sideA,
      away: sideB,
      opponent: "",
      date: dateM ? toIso(dateM[1]) : (bM ? toIso(bM[3]) : null),
      score: scoreM ? scoreM[1].replace(/\s+/g, "") : "",
      competition: compM ? compM[1].trim() : "",
      description: descM ? descM[1].trim().slice(0, 220) : "",
    };
    if (vid) { rec.provider = vid.provider; rec.videoId = vid.id; rec.videoUrl = vid.url; rec.embedUrl = vid.embed; }
    goals.push(rec);
  }

  // ---- the season video, when the page is one long video
  const firstVid = videoIn(html);

  // Ronaldo's own club is the side that appears in nearly every fixture of the
  // season; the other side of each fixture is the opponent
  const freq = new Map();
  for (const g of goals) {
    for (const side of [g.home, g.away]) {
      if (!side) continue;
      freq.set(side, (freq.get(side) || 0) + 1);
    }
  }
  let club = ronaldoClub;
  if (!club && freq.size) {
    club = [...freq.entries()].sort((a, b) => b[1] - a[1])[0][0];
  }
  for (const g of goals) {
    g.team = club;
    g.opponent = g.home.toLowerCase() === club.toLowerCase() ? g.away : g.home;
  }

  const seasonVideo = goals.length === 0 && firstVid
    ? { provider: firstVid.provider, videoId: firstVid.id, videoUrl: firstVid.url, embedUrl: firstVid.embed }
    : null;

  seasons[season] = {
    season,
    sourcePage: url,
    sourceTitle: title,
    seasonVideo,
    goals,
  };
  goalCount += goals.length;
  if (seasonVideo) seasonVideoCount++;
  console.log("  " + season.padEnd(10) + " per-goal: " + String(goals.length).padStart(3) +
    (goals.length ? "   e.g. #" + goals[0].n + " " + (goals[0].opponent || "?") + " " + (goals[0].date || "?") : "") +
    (seasonVideo ? "   season video: " + seasonVideo.provider + "/" + seasonVideo.videoId : ""));
  await wait(1300);
}

const out = {
  source: "ronaldo7.net",
  sourceNote:
    "ronaldo7.net publishes one page per Ronaldo season. Where the page lists each goal on its own, the entry names the opponent, the date, the score, the competition and a description, and carries that goal's own video. " +
    "The videos are third-party uploads on YouTube and Dailymotion; they are linked and embedded, never re-hosted. The season pages are the source of the video, the dates and the descriptions.",
  retrieved: new Date().toISOString().slice(0, 10),
  seasons,
};
const dest = path.join(ROOT, "public/data/ronaldo-season-videos.json");
fs.writeFileSync(dest, JSON.stringify(out, null, 1), "utf8");
console.log("\nwrote " + path.relative(ROOT, dest));
console.log("seasons: " + Object.keys(seasons).length + "   per-goal videos: " + goalCount + "   season videos: " + seasonVideoCount);
