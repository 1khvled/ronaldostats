import fs from "node:fs";
const ROOT = "D:/Projects/ronaldo-stats/";

// --- package.json ---------------------------------------------------------
{
  const p = ROOT + "package.json";
  const pkg = JSON.parse(fs.readFileSync(p, "utf8"));
  pkg.scripts.prebuild = [
    "node scripts/daily-date-sync.mjs",
    "node scripts/prebuild-check.mjs",
    "node scripts/build-ronaldo-data.mjs",
    "node scripts/build-latest-goal.mjs",
    "node scripts/extract-goal-calendar.mjs",
    "node scripts/build-birthday-goals.mjs",
    "node scripts/merge-goal-source.mjs",
    "node scripts/extract-shell-strings.mjs",
    "node scripts/generate-i18n-pages.mjs",
    "node scripts/sync-all-rails.mjs",
    "node scripts/inject-latest-goal-nav.mjs",
    "node scripts/generate-og.mjs",
  ].join(" && ");
  pkg.scripts["build:calendar"] = "node scripts/extract-goal-calendar.mjs && node scripts/build-birthday-goals.mjs && node scripts/merge-goal-source.mjs";
  pkg.scripts["fetch:goals"] = "node scripts/fetch-goal-source.mjs";
  fs.writeFileSync(p, JSON.stringify(pkg, null, 2) + "\n", "utf8");
  console.log("ok  package.json: the goal-source steps are in the build chain");
}

// --- verify-all.mjs -------------------------------------------------------
{
  const p = ROOT + "scripts/verify-all.mjs";
  let t = fs.readFileSync(p, "utf8");
  const before = t;
  t = t.replace(
    `step(run(NODE, ["scripts/build-birthday-goals.mjs"], "dated goal calendar"), "dated goal calendar");`,
    `step(run(NODE, ["scripts/build-birthday-goals.mjs"], "dated goal calendar"), "dated goal calendar");
step(run(NODE, ["scripts/merge-goal-source.mjs"], "goal source reconciliation"), "goal source reconciliation");`
  );
  if (t === before) { console.error("verify-all patch failed"); process.exit(1); }
  fs.writeFileSync(p, t, "utf8");
  console.log("ok  verify-all.mjs: the reconciliation is a gate");
}
