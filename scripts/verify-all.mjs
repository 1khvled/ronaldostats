// verify-all.mjs — the one gate.
//
//   node scripts/verify-all.mjs
//
// Runs every check the project has, in order, and prints a single verdict:
//   1. the data build and its 20 assertions
//   2. the dated goal calendar
//   3. the i18n dictionaries (runtime + shell)
//   4. the production build
//   5. the dist audit
//   6. a leftover-reference sweep of the English shells
//   7. every referenced image exists
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const NODE = process.execPath;
// On Windows a shell wrapper hides the real exit code, so the commands are
// spawned directly and the Vite build goes through node_modules.
const VITE = path.join(ROOT, "node_modules", "vite", "bin", "vite.js");
const run = (cmd, args, label) => {
  process.stdout.write(`\n=== ${label} ===\n`);
  const r = spawnSync(cmd, args, { cwd: ROOT, stdio: "inherit" });
  const status = r.status === null ? 1 : r.status;
  if (status !== 0) console.error("--- " + label + " exited with " + status + " ---");
  return status === 0;
};

let failed = 0;
const step = (ok, label) => {
  console.log((ok ? "PASS  " : "FAIL  ") + label);
  if (!ok) failed++;
};

step(run(process.execPath, ["scripts/build-ronaldo-data.mjs"], "data build"), "data build and its 20 assertions");
step(run(process.execPath, ["scripts/build-latest-goal.mjs"], "latest-goal feed"), "latest-goal feed");
step(run(process.execPath, ["scripts/extract-goal-calendar.mjs"], "goal calendar extract"), "goal calendar extract");
step(run(process.execPath, ["scripts/check-dated-calendar.mjs"], "dated goal calendar"), "dated goal calendar");
step(run(process.execPath, ["scripts/merge-goal-source.mjs"], "goal source reconciliation"), "goal source reconciliation");
step(run(process.execPath, ["scripts/extract-shell-strings.mjs"], "shell strings"), "shell string extraction");
step(run(process.execPath, ["scripts/generate-i18n-pages.mjs"], "localized pages"), "localized page generation");
step(run(process.execPath, ["scripts/verify-all-i18n.cjs"], "i18n audit"), "i18n audit");
step(run(process.execPath, ["scripts/check-runtime-i18n.mjs"], "runtime i18n"), "runtime i18n");
step(run(process.execPath, ["scripts/check-language-theme.mjs"], "language and theme"), "the language choice and the theme");
step(run(process.execPath, ["scripts/smoke-i18n.mjs"], "i18n runtime smoke test"), "i18n runtime smoke test");
step(run(process.execPath, ["scripts/audit-adsense.mjs"], "adsense audit"), "adsense audit");
step(run(process.execPath, ["scripts/audit-wc-splits.mjs"], "world cup audit"), "world cup splits audit");
step(run(process.execPath, ["scripts/check-orphans.mjs"], "orphan pages"), "orphan page audit");
step(run(process.execPath, ["scripts/clean-runtime-copy.mjs"], "clean the runtime source"), "the runtime source does not shadow the bundle");
step(run(NODE, [VITE, "build"], "vite build"), "production build");
step(run(process.execPath, ["scripts/copy-en.mjs"], "copy the English pages"), "the English pages in the deployment");
step(run(process.execPath, ["scripts/generate-programmatic-pages.mjs"], "the day pages"), "the birthday day pages in the deployment");
step(run(process.execPath, ["scripts/generate-days-hub.mjs"], "the days hub"), "the days hub in the deployment");
step(run(process.execPath, ["scripts/check-runtime-bundle.mjs"], "the runtime bundle"), "every page runs the bundled runtime");
step(run(process.execPath, ["scripts/check-deploy-assets.mjs"], "the deployment's assets"), "every page points at a file the deployment has");
step(run(process.execPath, ["scripts/check-internal-links.mjs"], "the deployment's links"), "every internal link points at a page the deployment has");
step(run(process.execPath, ["scripts/dist-audit.cjs"], "dist audit"), "dist audit");

// ---- 6. leftover Messi references in the English shells --------------------
process.stdout.write("\n=== leftover reference sweep ===\n");
const PAGES = ["index", "dashboard", "goalsbyyear", "goalsbyseason", "timeline", "achievements",
  "birthday", "latest-goal", "champions-league", "gear", "real-madrid", "ronaldo-vs-messi"];
// "24 June" is NOT in the list: it is a legitimate calendar-day title on the
// birthday heatmap (Ronaldo scored on 24 June 2017). His birthday is
// 5 February, and the copy around it is checked by the i18n audit.
const TOKENS = ["MessiStats", "messistat", "Inter Miami", "Camp Nou", "Rosario", "Albacete", "messi-vs-ronaldo", "Barcelona CF", "PSG"];
// The sister site is part of the site now: the footer links to MessiStat, the
// accounts the site points at are the ones MessiStat runs, and the keyword
// list names the sister brand. Those are the only allowed references;
// everything else from the Messi project is a leak.
const ALLOWED = [
  "https://www.messistat.com",
  "https://x.com/messistat1",
  "https://twitter.com/messistat1",
  "https://t.me/messistatdotcom",
  "@messistat1",
  "@messistatdotcom",
  "messistat, messistats",
  ", messistat",
];
let leaks = 0;
for (const p of PAGES) {
  const t = fs.readFileSync(path.join(ROOT, p + ".html"), "utf8");
  for (const tok of TOKENS) {
    let probe = t;
    for (const ok of ALLOWED) probe = probe.split(ok).join(" ");
    if (probe.includes(tok)) { console.log("  " + p + ".html still contains " + JSON.stringify(tok)); leaks++; }
  }
}
step(leaks === 0, "no Messi-era tokens in the English shells (" + leaks + " found)");

// ---- 7. every referenced image exists --------------------------------------
process.stdout.write("\n=== image references ===\n");
let missing = 0;
for (const p of PAGES) {
  const t = fs.readFileSync(path.join(ROOT, p + ".html"), "utf8");
  for (const m of t.matchAll(/(?:src|href)="(\/img\/[^"]+)"/g)) {
    const f = path.join(ROOT, "public", m[1].replace(/^\//, ""));
    if (!fs.existsSync(f)) { console.log("  MISSING " + m[1] + " (in " + p + ".html)"); missing++; }
  }
}
step(missing === 0, "every referenced image exists (" + missing + " missing)");

console.log("\n" + "=".repeat(60));
if (failed) {
  console.error("VERIFICATION FAILED — " + failed + " step(s) failed.");
  process.exit(1);
}
console.log("VERIFICATION PASSED — every gate is green.");
