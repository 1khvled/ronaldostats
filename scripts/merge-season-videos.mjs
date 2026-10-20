/**
 * Fold the season videos into the dated goal calendar.
 *
 *   node scripts/merge-season-videos.mjs
 *
 * ronaldo7.net publishes an individual clip for some goals (the 2013/14
 * season has 51 of them, the 2019/20 season 32) and one long video of every
 * goal for the other seasons. This matches the individual clips to the
 * calendar by date and opponent, and gives every goal of a covered season a
 * season video to fall back on, so the birthday explorer always has something
 * to play.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CAL = path.join(ROOT, "public/data/birthday-goals.json");
const SEASONS = path.join(ROOT, "public/data/ronaldo-season-videos.json");

const cal = JSON.parse(fs.readFileSync(CAL, "utf8"));
const seasons = JSON.parse(fs.readFileSync(SEASONS, "utf8"));

// ---- team names: compare them the way a human would
const NOISE = [
  "fc", "cf", "ac", "as", "sc", "afc", "ssc", "us", "ss", "ssd", "cd", "ud", "sd", "rc", "rcd", "cp",
  "if", "fk", "bk", "ca", "cl", "club", "calcio", "spa", "football", "de", "of", "the", "&", "0",
];
const norm = (name) => String(name || "")
  .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/[^a-z0-9 ]+/g, " ")
  .split(/\s+/)
  .filter((w) => w && !NOISE.includes(w))
  .join(" ")
  .trim();

const similar = (a, b) => {
  const x = norm(a), y = norm(b);
  if (!x || !y) return false;
  if (x === y) return true;
  if (x.includes(y) || y.includes(x)) return true;
  const xt = new Set(x.split(" ")), yt = new Set(y.split(" "));
  let shared = 0;
  for (const w of xt) if (yt.has(w)) shared++;
  return shared > 0 && shared >= Math.min(xt.size, yt.size) - 1 && shared >= 1;
};

// the season a date belongs to (August to July)
const seasonOf = (iso) => {
  if (!iso) return null;
  const y = Number(iso.slice(0, 4)), m = Number(iso.slice(5, 7));
  const start = m >= 7 ? y : y - 1;
  return start + "-" + (start + 1);
};

const byDate = new Map();
for (const key of Object.keys(cal.calendar)) {
  for (const m of cal.calendar[key].matches || []) {
    if (!byDate.has(m.date)) byDate.set(m.date, []);
    byDate.get(m.date).push(m);
  }
}

let exact = 0;
let seasonLinked = 0;
let unmatched = [];

// group the harvested records by the date they belong to, so a brace can be
// matched goal by goal instead of all landing on the first one
const harvestedByDate = new Map();
for (const sk of Object.keys(seasons.seasons)) {
  const s = seasons.seasons[sk];
  for (const g of s.goals) {
    if (!g.videoId || !g.date) continue;
    if (!harvestedByDate.has(g.date)) harvestedByDate.set(g.date, []);
    harvestedByDate.get(g.date).push({ g, s });
  }
}
// the same date, then a day either side (the two lists disagree on a few)
const nearDate = (date) => {
  if (harvestedByDate.has(date)) return [date];
  const d = new Date(date + "T00:00:00Z");
  for (const off of [-1, 1]) {
    const x = new Date(d.getTime() + off * 86400000).toISOString().slice(0, 10);
    if (harvestedByDate.has(x)) return [x];
  }
  return [];
};

for (const key of Object.keys(cal.calendar)) {
  for (const m of cal.calendar[key].matches || []) {
    const dates = nearDate(m.date);
    if (!dates.length) continue;
    const pool = dates.flatMap((d) => harvestedByDate.get(d));
    const mine = pool.filter((p) => similar(m.opponent, p.g.opponent) || similar(m.team, p.g.home));
    if (!mine.length) continue;

    const videos = m.videos || (m.videos = []);
    // the calendar lists one entry per goal, in the order the goals were
    // scored; the harvested list is in the same order for that date
    const slots = videos.filter((v) => !v.exactFrom);
    mine.forEach((p, i) => {
      const g = p.g, s = p.s;
      const slot = slots[i];
      if (!slot) return;
      slot.videoUrl = g.videoUrl;
      slot.embedUrl = g.embedUrl;
      slot.provider = g.provider;
      slot.kind = "clip";
      slot.publisher = g.provider === "dailymotion" ? "Dailymotion" : "ronaldo7.net";
      slot.sourcePage = s.sourcePage;
      slot.sourceName = "ronaldo7.net";
      slot.exactFrom = "ronaldo7.net";
      if (g.description) slot.description = g.description;
      if (g.competition && !slot.competition) slot.competition = g.competition;
      if (g.score && !slot.seasonScore) slot.seasonScore = g.score;
      exact++;
    });
    // the records for that date that did not fit a slot
    for (const p of mine.slice(slots.length)) unmatched.push(p.g);
  }
}

// ---- every goal of a covered season gets the season video as well: it is
// the most targeted thing we have for that goal (every goal of that season,
// in order), while the archive's compilation is the generic one.
// The calendar keeps ONE entry per goal, so the season video replaces the
// entry's video rather than adding a second one; the archive's own link is
// kept on the entry.
for (const key of Object.keys(cal.calendar)) {
  for (const m of cal.calendar[key].matches || []) {
    const sk = seasonOf(m.date);
    const s = sk && seasons.seasons[sk];
    if (!s || !s.seasonVideo) continue;
    const videos = m.videos || (m.videos = []);
    const exactEntry = videos.find((v) => v.exactFrom);
    if (exactEntry) {
      exactEntry.seasonVideoUrl = s.seasonVideo.videoUrl;
      exactEntry.seasonEmbedUrl = s.seasonVideo.embedUrl;
      exactEntry.seasonProvider = s.seasonVideo.provider;
      exactEntry.seasonSourcePage = s.sourcePage;
      exactEntry.seasonLabel = sk;
      seasonLinked++;
      continue;
    }
    for (const v of videos) {
      if (v.exactFrom) continue;
      if (v.videoUrl) {
        v.archiveUrl = v.sourcePage;
        v.archiveVideoUrl = v.videoUrl;
      }
      v.videoUrl = s.seasonVideo.videoUrl;
      v.embedUrl = s.seasonVideo.embedUrl;
      v.provider = s.seasonVideo.provider;
      v.kind = "season";
      v.publisher = "ronaldo7.net";
      v.sourcePage = s.sourcePage;
      v.sourceName = "ronaldo7.net";
      v.seasonLabel = sk;
      v.seasonVideo = true;
      seasonLinked++;
    }
  }
}

cal.meta = cal.meta || {};
cal.meta.seasonVideos = {
  source: "ronaldo7.net",
  note: seasons.sourceNote,
  retrieved: seasons.retrieved,
  exactClips: exact,
  seasonVideos: seasonLinked,
  seasons: Object.keys(seasons.seasons).length,
};

fs.writeFileSync(CAL, JSON.stringify(cal, null, 1), "utf8");
console.log("exact per-goal clips attached: " + exact);
console.log("goals given a season video:   " + seasonLinked);
console.log("harvested records unmatched:   " + unmatched.length);
for (const g of unmatched.slice(0, 12)) console.log("   #" + g.n + " " + g.fixture + " " + g.date + " " + g.videoId);
