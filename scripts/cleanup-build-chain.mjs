import fs from "node:fs";
import path from "node:path";
const ROOT = "D:/Projects/ronaldo-stats";

// 1. remove the two auto-mutating scripts (they rewrite hand-authored HTML
//    with hard-coded regexes and corrupted the Ronaldo figures)
for (const s of ["sync-totals-everywhere.mjs", "sync-twitter-and-logo.mjs"]) {
  const p = path.join(ROOT, "scripts", s);
  if (fs.existsSync(p)) { fs.rmSync(p); console.log("removed scripts/" + s); }
}

// 2. repair the build chain in package.json
const pkgPath = path.join(ROOT, "package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
pkg.scripts.prebuild = [
  "node scripts/daily-date-sync.mjs",
  "node scripts/prebuild-check.mjs",
  "node scripts/build-ronaldo-data.mjs",
  "node scripts/build-latest-goal.mjs",
  "node scripts/extract-shell-strings.mjs",
  "node scripts/generate-i18n-pages.mjs",
  "node scripts/sync-all-rails.mjs",
  "node scripts/inject-latest-goal-nav.mjs",
  "node scripts/generate-og.mjs",
].join(" && ");
pkg.scripts.build = [
  "node scripts/build-sitemap.mjs",
  "vite build",
  "node scripts/copy-en.mjs",
  "node scripts/generate-programmatic-pages.mjs",
  "node scripts/generate-days-hub.mjs",
  "node scripts/inject-yandex-verification.mjs",
  "node scripts/guard-ad-redirects.mjs",
].join(" && ");
delete pkg.scripts["build:rivalry"];
delete pkg.scripts["sync:totals"];
pkg.scripts["build:data"] = "node scripts/build-ronaldo-data.mjs && node scripts/build-latest-goal.mjs";
pkg.scripts["build:i18n"] = "node scripts/extract-shell-strings.mjs && node scripts/generate-i18n-pages.mjs";
pkg.scripts["build:bday"] = "node scripts/extract-goal-calendar.mjs && node scripts/build-birthday-goals.mjs";
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf8");
console.log("package.json scripts updated");
