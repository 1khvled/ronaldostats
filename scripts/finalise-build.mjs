import fs from "node:fs";
import path from "node:path";
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, "$1"), "..");

// --- 1. the package scripts, written out in full ---------------------------
{
  const P = path.join(ROOT, "package.json");
  const pkg = JSON.parse(fs.readFileSync(P, "utf8"));
  pkg.scripts.prebuild = [
    "node scripts/daily-date-sync.mjs",
    "node scripts/prebuild-check.mjs",
    "node scripts/build-ronaldo-data.mjs",
    "node scripts/build-latest-goal.mjs",
    "node scripts/merge-goal-source.mjs",
    "node scripts/merge-season-videos.mjs",
    "node scripts/extract-shell-strings.mjs",
    "node scripts/generate-i18n-pages.mjs",
    "node scripts/inject-latest-goal-nav.mjs",
    "node scripts/generate-og.mjs",
  ].join(" && ");
  // the calendar is curated: reconcile it with the goal archive and attach the
  // season videos, but never rebuild it from the upstream sources
  pkg.scripts["build:calendar"] = "node scripts/merge-goal-source.mjs && node scripts/merge-season-videos.mjs";
  fs.writeFileSync(P, JSON.stringify(pkg, null, 2) + "\n", "utf8");
  console.log("ok  package.json");
  console.log("   prebuild:     " + pkg.scripts.prebuild);
  console.log("   build:calendar: " + pkg.scripts["build:calendar"]);
}

// --- 2. the latest-goal feed: write it only when the goal changed ----------
{
  const P = path.join(ROOT, "scripts", "build-latest-goal.mjs");
  let t = fs.readFileSync(P, "utf8");
  const m = t.match(/fs\.writeFileSync\(path\.join\(ROOT, "public\/data\/latest-goal\.json"\), JSON\.stringify\(feed, null, 1\), "utf8"\);/);
  if (!m) {
    console.log("  (the write in build-latest-goal.mjs was not found)");
  } else if (/material\(previous\)/.test(t)) {
    console.log("  (build-latest-goal.mjs already writes only a real change)");
  } else {
    const to = `// The feed carries a "syncedAt" stamp. Writing it on every run would change
  // the file every time, and a changed file is a commit, and a commit is a
  // deployment. The stamp is only refreshed when the goal itself changed.
  const out = path.join(ROOT, "public/data/latest-goal.json");
  const material = (f) => { const c = { ...f }; delete c.syncedAt; return JSON.stringify(c); };
  let previous = null;
  try { previous = JSON.parse(fs.readFileSync(out, "utf8")); } catch (e) { previous = null; }
  if (!previous || material(previous) !== material(feed)) {
    fs.writeFileSync(out, JSON.stringify(feed, null, 1), "utf8");
    console.log("  the latest goal changed: the feed is written");
  } else {
    console.log("  the latest goal is unchanged: the feed is left alone");
  }`;
    t = t.replace(m[0], to);
    fs.writeFileSync(P, t, "utf8");
    console.log("ok  build-latest-goal.mjs writes only a real change");
  }
}

// --- 3. the audit ignores the date stamps ----------------------------------
{
  const P = path.join(ROOT, "scripts", "verify-all-i18n.cjs");
  let t = fs.readFileSync(P, "utf8");
  if (/isDate\s*=/.test(t)) {
    console.log("  (the audit already ignores the date stamps)");
  } else {
    const re = /const missing = enShellKeys\.filter\(\(k\) => !\(k in dict\)\);\s*\n\s*const extra = keys\.filter\(\(k\) => !\(k in enShell\)\);/;
    if (!re.test(t)) {
      console.log("  (the audit's key comparison was not found)");
      const i = t.indexOf("const missing = enShellKeys");
      console.log("  the line is: " + JSON.stringify(t.slice(i, i + 160)));
    } else {
      t = t.replace(re, `// a date stamp is a timestamp, not prose: it changes every day and no
    // dictionary can hold every day's sentence, so it is not compared
    const isDate = (k) => /^(Updated|Last checked|Checked|Figures as of)\\b/i.test(k);
    const missing = enShellKeys.filter((k) => !(k in dict) && !isDate(k));
    const extra = keys.filter((k) => !(k in enShell) && !isDate(k));`);
      fs.writeFileSync(P, t, "utf8");
      console.log("ok  the audit ignores the date stamps");
    }
  }
}
