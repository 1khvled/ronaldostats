/**
 * Take the two video pages off the build.
 *
 *   node scripts/disable-video-pages-build.mjs
 *
 * The pages are gone from the shells; this removes what would still ship
 * them: the copy step, the sitemap, the router rules and the i18n generator's
 * page list. The dated goal calendar, the goal archive and the clip
 * catalogue stay - they are what the pages are built from.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const edit = (rel, fixes) => {
  const p = path.join(ROOT, rel);
  const raw = fs.readFileSync(p, "utf8");
  const crlf = raw.includes("\r\n");
  let src = raw.replace(/\r\n/g, "\n");
  for (const [from, to, expected] of fixes) {
    const count = src.split(from).length - 1;
    if (count !== expected) {
      console.log("  [SKIP] " + rel + ": " + JSON.stringify(from.slice(0, 60)) + " appears " + count + " times, expected " + expected);
      continue;
    }
    src = src.split(from).join(to);
    console.log("  [ok] " + rel + ": " + JSON.stringify(from.slice(0, 60)));
  }
  fs.writeFileSync(p, crlf ? src.replace(/\n/g, "\r\n") : src, "utf8");
};

// 1. the router: the rules for the two pages and the day pages
{
  const p = path.join(ROOT, "vercel.json");
  const v = JSON.parse(fs.readFileSync(p, "utf8"));
  const before = v.redirects.length + v.rewrites.length;
  v.redirects = v.redirects.filter((r) => !/birthday|latest-goal/.test(r.source + " " + (r.destination || "")));
  v.rewrites = v.rewrites.filter((r) => !/birthday|latest-goal|days/.test(r.source + " " + (r.destination || "")));
  fs.writeFileSync(p, JSON.stringify(v, null, 2) + "\n", "utf8");
  console.log("  [ok] vercel.json: " + (before - v.redirects.length - v.rewrites.length) + " rules removed");
}

// 2. the copy step
edit("scripts/copy-en.mjs", [
  ['    "birthday.html",\n', "", 1],
  ['    "latest-goal.html",\n', "", 1],
]);

// 3. the sitemap
edit("scripts/build-sitemap.mjs", [
  ['      { slug: "birthday", changefreq: "daily", priority: "0.95", lastmod: todayIso },\n', "", 1],
  ['      { slug: "latest-goal", changefreq: "daily", priority: "0.95", lastmod: todayIso },\n', "", 1],
  ['  // 2b. English-only hub for all 366 day pages.\n  // Deliberately NOT in SUBPAGES: that array is reused for the other 8\n  // languages, and /es/days, /ar/days etc. do not exist. The day pages\n  // themselves are English-only too, so their hreflangs stay x-default+en.\n  urlBlocks.push(`  <url>\n      <loc>https://www.ronaldostats.site/en/days</loc>\n      <lastmod>${todayIso}</lastmod>\n      <changefreq>weekly</changefreq>\n      <priority>0.9</priority>\n    </url>`);\n  \n', "", 1],
  ['    birthday: `    <image:image>\n        <image:loc>https://www.ronaldostats.site/img/og-ronaldo.jpg</image:loc>\n        <image:title>Cristiano Ronaldo Birthday Goal Explorer: ${CAREER_GOALS} Career Goals Across 366 Days</image:title>\n        <image:caption>Interactive visual map and video player showing all goals Cristiano Ronaldo scored across 366 calendar days.</image:caption>\n        <image:geo_location>Lisbon, Portugal / Madrid, Spain / Riyadh, Saudi Arabia</image:geo_location>\n      </image:image>`,\n', "", 1],
]);

// the sitemap's programmatic day pages: the whole block
{
  const p = path.join(ROOT, "scripts/build-sitemap.mjs");
  const raw = fs.readFileSync(p, "utf8");
  const crlf = raw.includes("\r\n");
  let src = raw.replace(/\r\n/g, "\n");
  const start = src.indexOf("  // 5. Programmatic Birthday Pages");
  const end = src.indexOf("  // 6.", start);
  if (start > 0 && end > start) {
    src = src.slice(0, start) + src.slice(end);
    fs.writeFileSync(p, crlf ? src.replace(/\n/g, "\r\n") : src, "utf8");
    console.log("  [ok] scripts/build-sitemap.mjs: the programmatic day pages are out of the sitemap");
  } else {
    console.log("  [SKIP] scripts/build-sitemap.mjs: the day page block was not found");
  }
}

// 4. the analytics tag
edit("scripts/inject-google-tag.mjs", [
  ['  "birthday.html",\n', "", 1],
  ['  "latest-goal.html",\n', "", 1],
]);

// 5. the i18n generator's page list
edit("scripts/generate-i18n-pages.mjs", [
  ['  birthday: "birthday",\n', "", 1],
  ['  "latest-goal": "latest-goal",\n', "", 1],
]);

// 6. the build and the verification
edit("package.json", [
  [" && node scripts/generate-programmatic-pages.mjs && node scripts/generate-days-hub.mjs", "", 1],
  [" && node scripts/inject-latest-goal-nav.mjs", "", 1],
]);
edit("scripts/verify-all.mjs", [
  ['step(run(process.execPath, ["scripts/generate-programmatic-pages.mjs"], "the day pages"), "the birthday day pages in the deployment");\n', "", 1],
  ['step(run(process.execPath, ["scripts/generate-days-hub.mjs"], "the days hub"), "the days hub in the deployment");\n', "", 1],
]);
