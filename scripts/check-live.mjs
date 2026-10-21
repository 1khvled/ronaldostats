/**
 * Check the live deployment: every page URL in every language, and the
 * internal links the pages carry.
 *
 *   node scripts/check-live.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BASE = "https://ronaldomstats-app.vercel.app";
const LANGS = ["en", "es", "pt", "fr", "ar", "bn", "hi", "ro", "uz"];
const PAGES = ["index", "dashboard", "goalsbyyear", "goalsbyseason", "timeline", "achievements", "birthday", "latest-goal", "champions-league", "gear", "real-madrid", "ronaldo-vs-messi"];

const get = async (url) => {
  // the deployment redirects a few forms to their canonical URL, so the
  // redirect is followed and the page that answers is the one that counts
  const r = await fetch(url, { redirect: "follow", headers: { "user-agent": "Mozilla/5.0 (compatible; RonaldoStatsCheck/1.0)" } });
  const text = await r.text();
  return { status: r.status, location: r.url, text };
};

let bad = 0;
console.log("=== the page URLs ===");
for (const lang of LANGS) {
  const row = [];
  for (const page of PAGES) {
    const url = `${BASE}/${lang}/${page}`;
    const r = await get(url);
    if (r.status !== 200) { bad++; row.push(page + ":" + r.status + (r.location ? "->" + r.location : "")); }
  }
  // the bare language root
  const root = await get(`${BASE}/${lang}/`);
  if (root.status !== 200) { bad++; row.push("(root):" + root.status); }
  const idx = await get(`${BASE}/${lang}/index`);
  if (idx.status !== 200) { bad++; row.push("(/index):" + idx.status); }
  console.log("  " + lang.padEnd(4) + (row.length ? "  " + row.join("  ") : "  every page is 200"));
}

console.log("\n=== the internal links the pages carry ===");
for (const lang of ["en", "es", "ar"]) {
  const seen = new Map();
  for (const page of PAGES) {
    const r = await get(`${BASE}/${lang}/${page}`);
    if (r.status !== 200) continue;
    for (const m of r.text.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
      const href = m[1];
      if (href.startsWith("/assets/") || href.startsWith("/data/") || href.startsWith("/img/") || href.startsWith("/js/") || href.startsWith("/fonts/")) continue;
      if (!seen.has(href)) seen.set(href, page);
    }
  }
  const broken = [];
  for (const [href, from] of seen) {
    const r = await get(BASE + href);
    if (r.status !== 200) broken.push(href + " (" + r.status + ", from " + from + ")");
  }
  if (broken.length) { bad += broken.length; console.log("  " + lang + ": " + broken.length + " broken"); for (const b of broken.slice(0, 12)) console.log("      " + b); }
  else console.log("  " + lang + ": every internal link resolves (" + seen.size + " links)");
}

console.log("\n" + (bad ? bad + " problem(s)" : "the live deployment is clean"));
