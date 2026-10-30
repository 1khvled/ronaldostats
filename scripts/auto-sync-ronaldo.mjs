/**
 * Auto-Sync Ronaldo Tracker (scripts/auto-sync-ronaldo.mjs)
 *
 * Ronaldo has no ESPN pipeline on this repo, so this script uses
 * https://www.ronaldovsronaldo.app/ (All Time Career section) as the primary
 * source, with our own ronaldo-data.json as a cross-check anchor:
 *
 *   - The page's Ronaldo goals/apps MUST equal our ronaldo-data.json totals.
 *     If they don't, the page may have changed methodology — stage a review
 *     row and exit 0 without touching anything.
 *   - Ronaldo goals/apps/assists/penalties/FK/HT are compared against
 *     public/data/ronaldo-data.json. Small deltas (|goals|<=3, |apps|<=6) are
 *     applied to ronaldo-data.json + propagated into
 *     scripts/build-ronaldo-vs-messi.mjs (same masking discipline as
 *     reconcile-932: SVG path data, video files and goal refs protected).
 *     Anything bigger stages a review row and exits 1 (loud: never deploy a
 *     half-updated rivalry page).
 *   - Derived diffs (goal lead, apps-fewer, NPG lead, G+A, penalty lead) are
 *     recomputed from the two sources of truth, never hand-synced.
 *
 * Usage:
 *   node scripts/auto-sync-ronaldo.mjs            (detect, update, propagate)
 *   node scripts/auto-sync-ronaldo.mjs --check    (inspect without writing)
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ronaldoPath = resolve(root, "public", "data", "ronaldo-data.json");

const builderPath = resolve(root, "scripts", "build-ronaldo-vs-messi.mjs");
const pendingPath = resolve(root, "public", "data", "pending.json");

const SOURCE_URL = "https://www.messivsronaldo.app/";
const isCheckOnly = process.argv.includes("--check");

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml",
};

async function fetchText(url) {
  const res = await fetch(url, { headers: HEADERS, signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.text();
}

function stripTags(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ");
}

function num(s) {
  return Number(String(s || "").replace(/,/g, ""));
}

function stageReview(reason, detail) {
  let store = { updated: null, provisional: [], needs_review: [] };
  try {
    if (existsSync(pendingPath)) store = JSON.parse(readFileSync(pendingPath, "utf8"));
  } catch {}
  store.needs_review = store.needs_review || [];
  if (!store.needs_review.some((r) => r.match_id === "ronaldo-tracker")) {
    store.needs_review.push({
      match_id: "ronaldo-tracker",
      status: "needs_review",
      reason,
      detail,
      sources: [SOURCE_URL],
      stagedAt: new Date().toISOString(),
    });
  }
  if (!isCheckOnly) writeFileSync(pendingPath, JSON.stringify(store, null, 2), "utf8");
  console.log(`[STAGED FOR REVIEW] ${reason}: ${detail}`);
}

function mask(h) {
  const store = [];
  const put = (m) => { store.push(m); return `__ADMASK__MASK${store.length - 1}__ADMASK__`; };
  h = h.replace(/<svg[\s\S]*?<\/svg>/g, put);
  h = h.replace(/Goal\d+\.mp4/g, put);
  h = h.replace(/Goal #\d+/g, put);
  h = h.replace(/#\d{3}\b/g, put);
  return [h, store];
}
function unmask(h, store) {
  return h.replace(/__ADMASK__MASK(\d+)__ADMASK__/g, (_, i) => store[Number(i)]);
}

function modalVal(html, label) {
  const parts = html.split("statRonaldo--");
  for (let k = 1; k < parts.length; k++) {
    const seg = parts[k].slice(0, 700);
    if (!seg.includes("Ronaldo <\/span>")) continue;
    const vm = seg.match(/<span[^>]*>([\d,\.]+)[\s\S]{0,400}?<span class="sr-only"> <!-- -->([^<]+)<\/span>/);
    if (vm && vm[2].trim() === label) {
      const att = seg.match(/\/<!-- -->(\d+)/);
      return { value: num(vm[1]), extra: att ? num(att[1]) : null };
    }
  }
  return { value: null, extra: null };
}
function modalRonaldoVal(html) {
  const m = html.match(/ModalDetailedStats-module--stat--[^"]*"><span[^>]*>Ronaldo <\/span><span[^>]*>([\d,]+)<\/span><span class="sr-only"> <!-- -->Appearances<\/span>/);
  return m ? num(m[1]) : null;
}
export async function runRonaldoSync() {
  console.log(`[${new Date().toISOString()}] Ronaldo tracker: fetching ${SOURCE_URL}`);
  const d = JSON.parse(readFileSync(ronaldoPath, "utf8"));
  const base = JSON.parse(readFileSync(ronaldoPath, "utf8"));

  let html;
  try {
    html = await fetchText(SOURCE_URL);
  } catch (err) {
    console.warn("ronaldovsronaldo.app unreachable:", err.message, "— keeping baseline.");
    return { status: "SOURCE_DOWN" };
  }

  // Parse from raw markup (verified against live HTML Oct 2026):
  //  1. StatsBlock <li> pairs arrive Ronaldo-then-Ronaldo per section:
  //     pairs[0] = Ronaldo all-time, pairs[1] = Ronaldo all-time.
  //  2. Modal stat rows repeat per section in document order: FIRST
  //     occurrence of each label = All Time Career value.
  // The Ronaldo cross-check below guards against reordering.
  const liGoals = [...html.matchAll(/StatsBlock-module--goals--[a-z0-9-]*"[^>]*>\s*<span[^>]*>(\d+)<\/span>\s*<span[^>]*>\s*Goals<\/span>/g)].map((m) => num(m[1]));
  const liAssists = [...html.matchAll(/StatsBlock-module--assists--[a-z0-9-]*"[^>]*>\s*<span[^>]*>(\d+)<\/span>\s*<span[^>]*>\s*Assists<\/span>/g)].map((m) => num(m[1]));
  const apps = modalVal(html, "Appearances");
  const pens = modalVal(html, "Penalties");
  const fk = modalVal(html, "Free Kick Goals");
  const ht = modalVal(html, "Hat-tricks");
  const modalRonaldoApps = modalRonaldoVal(html);
  const live = {
    messiGoals: liGoals[0] ?? null,
    messiApps: modalRonaldoApps,
    ronaldoGoals: liGoals[1] ?? null,
    ronaldoApps: apps.value,
    ronaldoAssists: liAssists[1] ?? null,
    ronaldoPens: pens.value,
    ronaldoPenAtt: pens.extra,
    ronaldoFK: fk.value,
    ronaldoHT: ht.value,
  };
  console.log("parsed:", JSON.stringify(live));

  if (!live.messiGoals || !live.ronaldoGoals || !live.ronaldoApps) {
    stageReview("ronaldo-parse-failed", "Could not parse totals from ronaldovsronaldo.app (markup changed?)");
    return { status: "PARSE_FAILED" };
  }

  // Cross-check anchor: their Ronaldo numbers must equal our ground truth.
  // If they don't, methodology changed — do NOT apply anything.
  if (live.ronaldoGoals === d.totals.combined.goals && live.ronaldoApps === d.totals.combined.appearances) {
    console.log(`Cross-check OK: their Ronaldo ${live.ronaldoGoals}/${live.ronaldoApps} == our ground truth.`);
    console.log(`Ronaldo unchanged at ${d.totals.combined.goals}/${d.totals.combined.appearances}. Nothing to do.`);
    return { status: "UP_TO_DATE" };
  } else {
    stageReview(
      "ronaldo-cross-check-mismatch",
      `Their Ronaldo ${live.ronaldoGoals}/${live.ronaldoApps} vs our ${d.totals.combined.goals}/${d.totals.combined.appearances} — methodology may have changed, human check needed.`
    );
    return { status: "CROSS_CHECK_MISMATCH" };
  }
  console.log(`Cross-check OK: their Ronaldo ${live.ronaldoGoals}/${live.ronaldoApps} == our ground truth.`);

  const deltas = {
    goals: live.ronaldoGoals - base.goals,
    apps: (live.ronaldoApps ?? base.appearances) - base.appearances,
  };
  if (deltas.goals === 0 && deltas.apps === 0) {
    console.log(`Ronaldo unchanged at ${base.goals}/${base.appearances}. Nothing to do.`);
    return { status: "UP_TO_DATE" };
  }
  console.log(`Ronaldo delta: goals ${deltas.goals >= 0 ? "+" : ""}${deltas.goals}, apps ${deltas.apps >= 0 ? "+" : ""}${deltas.apps}`);

  if (Math.abs(deltas.goals) > 3 || Math.abs(deltas.apps) > 6) {
    stageReview("ronaldo-big-jump", `goals ${base.goals}->${live.ronaldoGoals}, apps ${base.appearances}->${live.ronaldoApps} exceeds auto-apply limits`);
    process.exitCode = 1;
    return { status: "NEEDS_REVIEW" };
  }

  // Apply: baseline file + builder propagation
  const next = {
    ...base,
    goals: live.ronaldoGoals,
    appearances: live.ronaldoApps ?? base.appearances,
    assists: live.ronaldoAssists ?? base.assists,
    penalties: live.ronaldoPens ?? base.penalties,
    penaltyAttempts: live.ronaldoPenAtt ?? base.penaltyAttempts,
    freeKicks: live.ronaldoFK ?? base.freeKicks,
    hatTricks: live.ronaldoHT ?? base.hatTricks,
    updated: new Date().toISOString().split("T")[0],
    source: "ronaldovsronaldo.app All Time Career (cross-checked vs our ronaldo-data.json)",
  };
  const ronaldoG = d.totals.combined.goals;
  const ronaldoA = d.totals.combined.appearances;
  const ronaldoAst = d.totals.assists.official;
  const ronaldoNPG = d.byFinish.find((f) => f.finish === "Open play").goals + d.byFinish.find((f) => f.finish === "Free kicks").goals;
  const derived = {
    lead: next.goals - ronaldoG,
    appsFewer: next.appearances - ronaldoA,
    rNPG: next.goals - next.penalties,
    npgLead: ronaldoNPG - (next.goals - next.penalties),
    rGA: next.goals + next.assists,
    astLead: ronaldoAst - next.assists,
    penLead: next.penalties - d.byFinish.find((f) => f.finish === "Penalties").goals,
  };
  console.log("derived:", JSON.stringify(derived));

  if (!isCheckOnly) {
    writeFileSync(ronaldoPath, JSON.stringify(next, null, 2), "utf8");
    propagateBuilder(base, next, derived, ronaldoG, ronaldoA);
    console.log(`[SUCCESS] ronaldo-data.json -> ${next.goals}/${next.appearances}; builder propagated. Run prebuild to regenerate pages.`);
  } else {
    console.log("[CHECK] would update baseline + builder (dry run, nothing written).");
  }
  return { status: "UPDATED", next, derived };
}

function propagateBuilder(base, next, derived, ronaldoG, ronaldoA) {
  let h = readFileSync(builderPath, "utf8");
  const orig = h;
  const [masked, store] = mask(h);
  let m = masked;
  const esc = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // thousands-grouped variants per locale: 1,339 / 1.339 / 1 339
  const forms = (v) => {
    const digits = String(v).replace(/,/g, "");
    if (!/^\d{4}$/.test(digits)) return [String(v)];
    return [
      `${digits.slice(0, 1)},${digits.slice(1)}`,
      `${digits.slice(0, 1)}.${digits.slice(1)}`,
      `${digits.slice(0, 1)} ${digits.slice(1)}`,
      digits,
    ];
  };
  const swap = (oldV, newV) => {
    if (oldV === newV) return;
    const of = forms(oldV), nf = forms(newV);
    of.forEach((f, i) => { m = m.replace(new RegExp(`\\b${esc(f)}\\b`, "g"), nf[i]); });
  };
  // base numbers (blanket is safe post-mask: builder holds no minutes/scores with these magnitudes)
  swap(base.goals, next.goals);
  swap(base.appearances.toLocaleString("en-US"), next.appearances.toLocaleString("en-US"));
  swap(base.assists, next.assists);
  swap(base.penalties, next.penalties);
  swap(base.penaltyAttempts, next.penaltyAttempts);
  swap(base.freeKicks, next.freeKicks);
  swap(base.hatTricks, next.hatTricks);
  // derived diffs: recompute, don't hand-sync
  const oldLead = base.goals - ronaldoG, oldFewer = base.appearances - ronaldoA;
  swap(`+${oldLead} goals`, `+${derived.lead} goals`);
  swap(`leads by ${oldLead} goals`, `leads by ${derived.lead} goals`);
  swap(`${oldFewer} fewer`, `${derived.appsFewer} fewer`);
  h = unmask(m, store);
  if (h === orig) console.log("  builder: no textual changes needed beyond baseline");
  else writeFileSync(builderPath, h, "utf8");
}

if (process.argv[1] && process.argv[1].endsWith("auto-sync-ronaldo.mjs")) {
  runRonaldoSync().catch((err) => {
    console.error("Ronaldo sync failed:", err);
    process.exit(1);
  });
}
