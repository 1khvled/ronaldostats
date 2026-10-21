// Extract Ronaldo's dated goals into normalised intermediate JSON files.
//   tmp/cr-rsssf-matches.json   - every Portugal international with goals
//   tmp/cr-club-goals.json      - every dated club goal
//   tmp/cr-intl-goals.json      - every dated Portugal goal
import fs, { existsSync, writeFileSync } from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

const TMP = path.join(os.tmpdir(), "ronaldostats-build") + path.sep;
// the fetched inputs are kept in the repository: a build that cannot reach
// the network (a Vercel deploy, a rate-limited source) still works
const CACHE = path.join(path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."), "build-cache") + path.sep;
fs.mkdirSync(TMP, { recursive: true });
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..") + "/";

// ---------- CSV ----------
function parseCSV(text, sep) {
  const rows = [];
  let row = [], field = "", inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; } else { inQ = false; }
      } else { field += c; }
      continue;
    }
    if (c === '"') { inQ = true; continue; }
    if (c === sep) { row.push(field); field = ""; continue; }
    if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; continue; }
    if (c === "\r") continue;
    field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  const head = rows.shift().map(h => h.trim());
  return rows
    .filter(r => r.some(c => c !== ""))
    .map(r => {
      const o = {};
      head.forEach((h, i) => { o[h] = (r[i] ?? "").trim(); });
      return o;
    });
}

// ---------- date helpers ----------
const iso = (y, m, d) => y + "-" + String(m).padStart(2, "0") + "-" + String(d).padStart(2, "0");

function parseLooseDate(s) {
  if (!s) return null;
  s = s.trim();
  let m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (m) return { y: +m[1], m: +m[2], d: +m[3] };
  m = s.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{2,4})$/);
  if (m) {
    let y = +m[3];
    if (y < 100) y += y < 50 ? 2000 : 1900;
    return { y: y, m: +m[2], d: +m[1] };
  }
  m = s.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
  if (m) return { y: +m[3], m: +m[1], d: +m[2] };
  return null;
}

// ---------- 0. inputs: fetch anything that is not cached -------------------
const GH = {
  "gh-mvr-1.csv": "https://raw.githubusercontent.com/joana-neves-correia/CR7-Goals-Project/HEAD/data_1_clean.csv",
  "gh-mvr-2.csv": "https://raw.githubusercontent.com/joana-neves-correia/CR7-Goals-Project/HEAD/data_2_clean.csv",
  "gh-mvr-sel.csv": "https://raw.githubusercontent.com/joana-neves-correia/CR7-Goals-Project/HEAD/sele%C3%A7%C3%A3o.csv",
};
for (const [name, url] of Object.entries(GH)) {
  const p = TMP + name;
  if (existsSync(p)) continue;
  const r = await fetch(url, { headers: { "User-Agent": "ronaldostats/1.0 (data build)" } });
  if (!r.ok) { console.error("could not fetch " + name + " (" + r.status + ")"); process.exit(1); }
  writeFileSync(p, await r.text(), "utf8");
  console.log("fetched " + name);
}

// ---------- 0b. RSSSF: fetch it when it is not cached ----------
if (!existsSync(TMP + "cr-rsssf.html")) {
  const r = await fetch("https://www.rsssf.org/miscellaneous/cronaldo-intlg.html", { headers: { "User-Agent": "ronaldostats/1.0 (data build)" } });
  if (!r.ok) { console.error("could not fetch RSSSF (" + r.status + ")"); process.exit(1); }
  writeFileSync(TMP + "cr-rsssf.html", await r.text(), "utf8");
  console.log("fetched cr-rsssf.html");
}

// ---------- 1. RSSSF Portugal matches ----------
const rsssfHtml = fs.readFileSync(TMP + "cr-rsssf.html", "utf8");
const rsssfText = rsssfHtml
  .replace(/<pre>/gi, "\n")
  .replace(/<\/pre>/gi, "\n")
  .replace(/<[^>]+>/g, "")
  .replace(/&nbsp;/g, " ");

const COMP_RE = /(European Champ\.?|European Ch\. Qual\.|World Cup Qualifier|World Cup|Nations League|Confederations Cup)/;

const rsssfMatches = [];
for (const raw of rsssfText.split(/\r?\n/)) {
  const tokens = raw.trim().split(/\s+/);
  if (!tokens.length) continue;
  const cap = parseInt(tokens[0], 10);
  if (!Number.isFinite(cap) || cap < 1 || cap > 400) continue;

  let day = 0, mon = 0, yr = 0, dateIdx = -1;
  for (let i = 1; i < tokens.length - 1; i++) {
    const a = tokens[i];
    const b = tokens[i + 1] || "";
    const dm = a.match(/^(\d{1,2})-$/);
    const bm = b.match(/^(\d{1,2})-(\d{2,4})$/);
    if (dm && bm) { day = +dm[1]; mon = +bm[1]; yr = +bm[2]; dateIdx = i; break; }
    const full = a.match(/^(\d{1,2})-(\d{1,2})-(\d{2,4})$/);
    if (full) { day = +full[1]; mon = +full[2]; yr = +full[3]; dateIdx = i; break; }
  }
  if (!dateIdx) continue;
  // RSSSF row shape: "Cap | goals | cumulative | date | ..." for a scoring
  // match and "Cap | cumulative | date | ..." for a goalless one — so the
  // date starts at index 3 exactly when the goals column is present.
  const goals = dateIdx === 3 ? (parseInt(tokens[1], 10) || 0) : 0;
  if (yr < 100) yr += yr < 50 ? 2000 : 1900;
  if (mon < 1 || mon > 12 || day < 1 || day > 31) continue;

  // RSSSF row shape after the date: venue, opponent (one or more words),
  // score, competition. The date is written either as two tokens
  // ("24-" "6-17") or as one ("13-10-04"), so the content starts one or two
  // tokens further on.
  const dateSplit = /^\d{1,2}-$/.test(tokens[dateIdx] || "");
  const after = tokens.slice(dateIdx + (dateSplit ? 2 : 1));
  let scoreIdx = -1;
  for (let i = 0; i < after.length; i++) {
    if (/^\d+[-:]\d+/.test(after[i])) { scoreIdx = i; break; }
  }
  const venue = after[0] || "";
  const opponent = after.slice(1, scoreIdx > 0 ? scoreIdx : after.length).join(" ").trim();
  const score = scoreIdx > 0 ? after[scoreIdx].replace(":", "-") : "";
  const rest = after.slice(scoreIdx > 0 ? scoreIdx : after.length).join(" ");
  const cm = rest.match(COMP_RE);
  const comp = cm ? cm[1] : "Friendly";
  rsssfMatches.push({
    cap: cap,
    date: iso(yr, mon, day),
    year: yr,
    venue,
    opponent,
    competition: comp,
    goals: goals,
    score: score,
  });
}
const rsssfGoals = rsssfMatches.reduce((a, r) => a + r.goals, 0);
console.log("RSSSF matches:", rsssfMatches.length, "goals:", rsssfGoals);
fs.writeFileSync(TMP + "cr-rsssf-matches.json", JSON.stringify(rsssfMatches, null, 1), "utf8");

// ---------- 2. Club goals ----------
const clubRows = parseCSV(fs.readFileSync(TMP + "gh-mvr-1.csv", "utf8"), ",")
  .concat(parseCSV(fs.readFileSync(TMP + "gh-mvr-2.csv", "utf8"), ","));

const clubGoals = [];
const seen = new Set();
for (const r of clubRows) {
  const dt = parseLooseDate(r.Date_clean || r.Date);
  if (!dt) continue;
  const key = [iso(dt.y, dt.m, dt.d), r.Minute, r.Opponent, r.Season].join("|");
  if (seen.has(key)) continue;
  seen.add(key);
  clubGoals.push({
    date: iso(dt.y, dt.m, dt.d),
    year: dt.y,
    team: r.Club,
    opponent: r.Opponent,
    competition: r.Competition,
    score: (r.Result_clean || r.Result || "").replace(/:/g, "-"),
    minute: r.Minute_clean || r.Minute || "",
    type: r.Type || "",
    assist: (r.Goal_assist && r.Goal_assist !== "No assist") ? r.Goal_assist : "",
    venue: r.Venue,
    source: "cr7-goals-project",
  });
}
console.log("club goals:", clubGoals.length);
fs.writeFileSync(TMP + "cr-club-goals.json", JSON.stringify(clubGoals, null, 1), "utf8");

// ---------- 3. International goals (GitHub export, match level) ----------
const intlRows = parseCSV(fs.readFileSync(TMP + "gh-mvr-sel.csv", "utf8"), ";");
const intlGoals = [];
for (const r of intlRows) {
  const dt = parseLooseDate(r.Date);
  if (!dt) continue;
  const n = parseInt(r.Goals, 10) || 0;
  if (!n) continue;
  intlGoals.push({
    date: iso(dt.y, dt.m, dt.d),
    year: dt.y,
    team: "Portugal",
    opponent: r.Opponent,
    competition: r.Competition,
    score: (r.Result || "").replace(/:/g, "-"),
    minute: "",
    type: "",
    assist: "",
    venue: r.Venue,
    goalsInMatch: n,
    source: "cr7-goals-project",
  });
}
console.log("intl goals:", intlGoals.reduce((a, r) => a + r.goalsInMatch, 0));
fs.writeFileSync(TMP + "cr-intl-goals.json", JSON.stringify(intlGoals, null, 1), "utf8");

// The live tracker renders dates US-style (M/D/YY).
function parseUSDate(s) {
  if (!s) return null;
  s = s.trim();
  let m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (m) {
    let y = +m[3];
    if (y < 100) y += y < 50 ? 2000 : 1900;
    return { y: y, m: +m[1], d: +m[2] };
  }
  return parseLooseDate(s);
}

// ---------- 4. Recent goals from the live tracker ----------
// the live tracker's rows are kept in the repository: the career goals the
// CR7 goal archive has not published yet
const rtRaw = JSON.parse(fs.readFileSync(ROOT + "public/data/tracker-goals.json", "utf8"));
const rtGoals = [];
for (const r of rtRaw) {
  if (r.num === "N.O") continue;
  const dt = parseUSDate(r.date);
  if (!dt) continue;
  rtGoals.push({
    num: parseInt(r.num, 10),
    date: iso(dt.y, dt.m, dt.d),
    year: dt.y,
    team: r.home,
    opponent: r.opp,
    venue: r.venue,
    minute: r.minute,
    type: r.type,
    source: "roadto1000goals",
  });
}
console.log("tracker goals:", rtGoals.length, "range:", rtGoals[rtGoals.length - 1].num, "-", rtGoals[0].num);
fs.writeFileSync(TMP + "cr-rt-goals.json", JSON.stringify(rtGoals, null, 1), "utf8");
console.log("intermediate files written");
