/**
 * Make the automatic run cheap: it must only commit when the site really
 * changed.
 *
 *   node scripts/fix-auto-run.mjs
 *
 * Three things made every run produce a commit, and every commit produces a
 * Vercel deployment:
 *
 *   1. scripts/build-latest-goal.mjs stamped a fresh "syncedAt" on the feed
 *      every time it ran, so the file changed even when the goal did not. It
 *      now writes the file only when the goal itself changed.
 *   2. the dated calendar was regenerated from the upstream sources on every
 *      build. The calendar is curated data - it lives in the repository and
 *      the build attaches the videos to it - so the build no longer rebuilds
 *      it, and the two scripts that write it write the same shape, so the
 *      file does not flip between the two formats.
 *   3. the package script that built the calendar asked for the regeneration.
 *      It now only reconciles the calendar with the goal archive and
 *      attaches the season videos.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, "$1"), "..");

// --- 1. the latest-goal feed: write it only when the goal changed ------------
{
  const P = path.join(ROOT, "scripts", "build-latest-goal.mjs");
  let t = fs.readFileSync(P, "utf8");
  const before = t;
  const from = 'fs.writeFileSync(path.join(ROOT, "public/data/latest-goal.json"), JSON.stringify(feed, null, 1), "utf8");';
  const to = `// The feed carries a "syncedAt" stamp. Writing it on every run would
  // change the file every time, and a changed file is a commit, and a commit
  // is a deployment. The stamp is only refreshed when the goal itself changed.
  const out = path.join(ROOT, "public/data/latest-goal.json");
  const material = (f) => {
    const c = { ...f };
    delete c.syncedAt;
    return JSON.stringify(c);
  };
  let previous = null;
  try { previous = JSON.parse(fs.readFileSync(out, "utf8")); } catch (e) { previous = null; }
  if (!previous || material(previous) !== material(feed)) {
    fs.writeFileSync(out, JSON.stringify(feed, null, 1), "utf8");
    console.log("  the latest goal changed: the feed is written");
  } else {
    console.log("  the latest goal is unchanged: the feed is left alone");
  }`;
  if (!t.includes(from)) console.error("  (the write in build-latest-goal.mjs was not found)");
  t = t.replace(from, to);
  fs.writeFileSync(P, t, "utf8");
  console.log(before === t ? "  (build-latest-goal.mjs was already fixed)" : "ok  build-latest-goal.mjs writes only a real change");
}

// --- 2a. the season-video merge writes the same shape as the goal merge ------
{
  const P = path.join(ROOT, "scripts", "merge-season-videos.mjs");
  let t = fs.readFileSync(P, "utf8");
  const before = t;
  t = t.replace('fs.writeFileSync(CAL, JSON.stringify(cal, null, 1), "utf8");', 'fs.writeFileSync(CAL, JSON.stringify(cal), "utf8");');
  fs.writeFileSync(P, t, "utf8");
  console.log(before === t ? "  (merge-season-videos.mjs already writes the same shape)" : "ok  merge-season-videos.mjs writes the calendar in the same shape");
}

// --- 2b. the build chain no longer regenerates the curated calendar ---------
{
  const P = path.join(ROOT, "package.json");
  const pkg = JSON.parse(fs.readFileSync(P, "utf8"));
  const before = pkg.scripts["build:calendar"];
  // the calendar is curated: reconcile it with the goal archive and attach the
  // season videos, but never rebuild it from the upstream sources
  pkg.scripts["build:calendar"] = "node scripts/merge-goal-source.mjs && node scripts/merge-season-videos.mjs";
  // the prebuild fetches the upstream sources on every build; the calendar
  // they feed is curated, so the fetch is not part of the build
  pkg.scripts.prebuild = pkg.scripts.prebuild
    .replace(" && node scripts/extract-goal-calendar.mjs", "")
    .replace("node scripts/merge-goal-source.mjs &&", "node scripts/merge-goal-source.mjs && node scripts/merge-season-videos.mjs &&");
  fs.writeFileSync(P, JSON.stringify(pkg, null, 2) + "\n", "utf8");
  console.log("  build:calendar: " + before + "  ->  " + pkg.scripts["build:calendar"]);
  console.log("  prebuild: " + pkg.scripts.prebuild);
}
