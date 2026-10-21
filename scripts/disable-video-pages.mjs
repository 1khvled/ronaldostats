/**
 * Take the two video pages off the site.
 *
 *   node scripts/disable-video-pages.mjs
 *
 * The birthday explorer and the latest-goal replay are the two pages that
 * promise a video for every goal. The Messi site can keep that promise; this
 * one cannot, because the footage for most of the 981 goals does not exist
 * yet, and a page that promises a video and does not have one is worse than
 * no page. They are taken off the site until the sources are found: the
 * navigation entries, the explore cards, the promotional cards, the links
 * from the goal log and the day pages that hang off them.
 *
 * The data stays - the dated goal calendar, the goal archive and the clip
 * catalogue are what the pages are built from, and the day pages come back
 * the moment there is footage to put in them.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const SHELLS = ["index", "dashboard", "goalsbyyear", "goalsbyseason", "timeline", "achievements", "champions-league", "gear", "real-madrid", "ronaldo-vs-messi"];

// the elements that point at the two pages
const RULES = [
  // the rail: the two navigation entries
  { re: /<a[^>]*href="\/en\/latest-goal"[^>]*>[\s\S]*?<\/a>/g, what: "the rail's latest-goal entry" },
  { re: /<a[^>]*class="nav-bday-link"[^>]*href="\/en\/birthday"[^>]*>[\s\S]*?<\/a>/g, what: "the rail's birthday entry" },
  { re: /<a[^>]*href="\/en\/birthday"[^>]*class="nav-bday-link"[^>]*>[\s\S]*?<\/a>/g, what: "the rail's birthday entry" },
  // the explore cards
  { re: /<a class="link-card" href="\/en\/birthday">[\s\S]*?<\/a>/g, what: "the explore card for the birthday explorer" },
  { re: /<a class="link-card" href="\/en\/latest-goal">[\s\S]*?<\/a>/g, what: "the explore card for the latest goal" },
  // the promotional card
  { re: /<!-- VIRAL MAIN ATTRACTION: Birthday Promo Card -->\s*<aside class="bday-promo-card"[\s\S]*?<\/aside>/g, what: "the birthday promotional card" },
  { re: /<aside class="bday-promo-card"[\s\S]*?<\/aside>/g, what: "the birthday promotional card" },
  // the buttons that open a day page
  { re: /<a href="\/en\/birthday\/\d{2}-\d{2}"[^>]*>[^<]*<\/a>/g, what: "a link to a day page" },
  { re: /<a[^>]*href="\/en\/birthday\/\d{2}-\d{2}"[^>]*>[^<]*<\/a>/g, what: "a link to a day page" },
];

let total = 0;
for (const f of [...SHELLS.map((s) => s + ".html"), "public/404.html"]) {
  const p = path.join(ROOT, f);
  let src = fs.readFileSync(p, "utf8");
  const before = src;
  const counts = [];
  for (const rule of RULES) {
    const n = src.match(rule.re);
    if (!n) continue;
    counts.push(rule.what + " x" + n.length);
    src = src.replace(rule.re, "");
  }
  if (src === before) { console.log("  [skip] " + f + ": nothing to remove"); continue; }
  fs.writeFileSync(p, src, "utf8");
  total++;
  console.log("  [ok] " + f + ": " + counts.join(", "));
}

// the 404 page's own navigation
const p404 = path.join(ROOT, "public/404.html");
let s404 = fs.readFileSync(p404, "utf8");
const navLink = /<a[^>]*href="\/en\/birthday"[^>]*>[\s\S]*?<\/a>/g;
if (navLink.test(s404)) {
  s404 = s404.replace(navLink, "");
  fs.writeFileSync(p404, s404, "utf8");
  console.log("  [ok] public/404.html: the birthday entry in the navigation");
}

console.log("\n" + total + " shell(s) cleaned");
