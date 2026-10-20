// fetch-goal-source.mjs — vendor the per-goal source archive.
//
//   node scripts/fetch-goal-source.mjs           refresh from the source
//   node scripts/fetch-goal-source.mjs --check   report what would change
//
// SOURCE
//   https://cr7allgoals.com — the Ronaldo counterpart of messiallgoals.com.
//   It publishes a per-goal archive for Cristiano Ronaldo with, for every goal:
//   the date, the team, the opponent, the competition, the venue, the score
//   after the goal and the final score; the media that contains the goal
//   (an exact clip, the match highlights, or a compilation it appears in);
//   and, for the competitions it has reviewed, the finish, the assist, the
//   body part and the xG.
//
//   The archive's own per-goal list is sourced from Wikipedia's
//   "List of senior career goals by Cristiano Ronaldo" (revision 1376603231,
//   CC BY-SA 4.0), which cites FBref's goal log. The archive's media catalogue
//   links each asset to the exact goal it shows.
//
// WHAT THIS WRITES
//   public/data/ronaldo-goals.json — a vendored, attributed snapshot of that
//   archive, so the site builds offline and every figure keeps its source.
//
//   Per-goal pages are stable: https://cr7allgoals.com/goal/<number>
import fs from "node:fs";
import path from "node:path";

const ROOT = "D:/Projects/ronaldo-stats";
const OUT = path.join(ROOT, "public", "data", "ronaldo-goals.json");
const SOURCE = "https://cr7allgoals.com";
const UA = "Mozilla/5.0 (compatible; ronaldostats/1.0; +https://www.ronaldostats.site)";

/** Pull a `JSON.parse('...')` blob out of a JS bundle and parse it. */
function extractBlobs(src) {
  const re = /JSON\.parse\('/g;
  const out = [];
  let m;
  while ((m = re.exec(src))) {
    let i = m.index + m[0].length;
    while (i < src.length) {
      if (src[i] === "\\") { i += 2; continue; }
      if (src[i] === "'") break;
      i++;
    }
    const inner = src.slice(m.index + m[0].length, i);
    let s = "";
    for (let k = 0; k < inner.length; k++) {
      const c = inner[k];
      if (c !== "\\") { s += c; continue; }
      const n = inner[++k];
      if (n === "x") { s += String.fromCharCode(parseInt(inner.substr(k + 1, 2), 16)); k += 2; }
      else if (n === "u") { s += String.fromCharCode(parseInt(inner.substr(k + 1, 4), 16)); k += 4; }
      else if (n === "n") s += "\n";
      else if (n === "t") s += "\t";
      else if (n === "r") s += "\r";
      else if (n === "b") s += "\b";
      else if (n === "f") s += "\f";
      else if (n === "v") s += "\v";
      else s += n;
    }
    try { out.push(JSON.parse(s)); } catch { /* not a JSON literal */ }
  }
  return out;
}

async function grab() {
  const page = await fetch(SOURCE + "/", { headers: { "User-Agent": UA } });
  const html = await page.text();
  const srcs = [...html.matchAll(/<script[^>]+src="([^"]+\.js)"/g)].map((m) => m[1]);
  let bundle = "";
  for (const s of srcs) {
    if (!s.startsWith("/_next/")) continue;
    const r = await fetch(SOURCE + s, { headers: { "User-Agent": UA } });
    if (!r.ok) continue;
    bundle += "\n" + await r.text();
  }
  return { html, bundle, chunks: srcs.length };
}

const { bundle, chunks } = await grab();
const blobs = extractBlobs(bundle);
console.log(`fetched ${chunks} chunks, ${bundle.length} bytes, ${blobs.length} JSON blobs`);

const goalsBlob = blobs.find((b) => Array.isArray(b.fu) && b.fu.length);
const mediaBlob = blobs.find((b) => Array.isArray(b.assets) && Array.isArray(b.links));
const detailsBlobs = blobs.filter((b) => Array.isArray(b.I) || Array.isArray(b.Ix) || Array.isArray(b.s));
if (!goalsBlob) { console.error("could not find the per-goal list in the source bundle"); process.exit(1); }
if (!mediaBlob) { console.error("could not find the media catalogue in the source bundle"); process.exit(1); }

const assets = mediaBlob.assets;
const links = mediaBlob.links;
const byId = new Map(assets.map((a) => [a.assetId, a]));

// ---- per-goal media -------------------------------------------------------
const media = [];
const goalMedia = {};
for (const l of links) {
  if (!["exact-goal", "match-highlights", "compilation-member"].includes(l.relation)) continue;
  const a = byId.get(l.assetId);
  if (!a) continue;
  const key = a.assetId;
  if (!media.find((m) => m.assetId === key)) {
    media.push({
      assetId: a.assetId,
      kind: a.kind,
      mediaType: a.mediaType,
      publisher: a.publisher || null,
      title: a.title || null,
      url: a.url,
      sourceUrl: a.sourceUrl || a.url,
      rights: a.rights || null,
      availability: a.availability || null,
      editorialState: a.editorialState || null,
    });
  }
  if (!l.goalIdentity) continue;
  const num = goalsBlob.fu.find((g) => g.date === l.goalIdentity.split("|")[0] && g.team === l.goalIdentity.split("|")[1] && g.opponent === l.goalIdentity.split("|")[2] && String(g.scorerOrdinal) === l.goalIdentity.split("|")[3])?.number;
  if (!num) continue;
  (goalMedia[num] = goalMedia[num] || []).push({ relation: l.relation, assetId: a.assetId, url: a.url, publisher: a.publisher || null, kind: a.kind, title: a.title || null });
}

// ---- per-goal details: minute, finish, assist -----------------------------
const details = {};
const addDetail = (g) => {
  if (!g || !g.date || !g.opponent) return;
  const key = g.date + "|" + g.opponent;
  (details[key] = details[key] || []).push(g);
};
for (const b of detailsBlobs) {
  if (Array.isArray(b.I)) for (const g of b.I) addDetail(g);
  if (Array.isArray(b.Ix)) for (const g of b.Ix) addDetail(g);
}
// the StatsBomb event stream: xG and body part for the reviewed matches
const statsbomb = [];
for (const b of detailsBlobs) {
  if (Array.isArray(b.s)) for (const e of b.s) if (e.outcome === "Goal" || e.goalScoreAfter) statsbomb.push(e);
}

// ---- assemble -------------------------------------------------------------
const goals = goalsBlob.fu.map((g) => ({
  number: g.number,
  date: g.date,
  team: g.team,
  opponent: g.opponent,
  competition: g.competition,
  venue: g.venue,
  scoreAfterGoal: g.scoreAfterGoal,
  finalScore: g.finalScore,
  scorerOrdinal: g.scorerOrdinal,
  sourcePage: SOURCE + "/goal/" + g.number,
  media: goalMedia[g.number] || [],
}));

const out = {
  meta: {
    source: "cr7allgoals.com",
    sourceHome: SOURCE,
    retrievedAt: new Date().toISOString(),
    perGoalPagePattern: SOURCE + "/goal/{number}",
    goals: goals.length,
    mediaAssets: media.length,
    goalsWithExactClip: goals.filter((g) => g.media.some((m) => m.relation === "exact-goal")).length,
    goalsWithHighlight: goals.filter((g) => g.media.some((m) => m.relation === "match-highlights")).length,
    goalsInCompilation: goals.filter((g) => g.media.some((m) => m.relation === "compilation-member")).length,
    provenance: goalsBlob.sP || null,
    attribution:
      "Per-goal records: Wikipedia contributors, 'List of senior career goals by Cristiano Ronaldo' (CC BY-SA 4.0), as published by cr7allgoals.com; the underlying goal log is FBref's. Per-goal finishes, assists and xG: StatsBomb open data via hudl/open-data. Media links point at the publishers' own pages (Manchester United, UEFA, YouTube, Wikimedia Commons); rights and availability are reproduced from the source catalogue.",
    licence: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
  goals,
  media,
  details,
  statsbomb,
};

if (process.argv.includes("--check")) {
  console.log("would write", goals.length, "goals and", media.length, "media assets");
  process.exit(0);
}
fs.writeFileSync(OUT, JSON.stringify(out, null, 1), "utf8");
console.log(`wrote public/data/ronaldo-goals.json — ${goals.length} goals, ${media.length} media assets`);
console.log(`  exact clip: ${out.meta.goalsWithExactClip} | highlight: ${out.meta.goalsWithHighlight} | compilation: ${out.meta.goalsInCompilation}`);
