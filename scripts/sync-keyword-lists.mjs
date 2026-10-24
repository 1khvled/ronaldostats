/**
 * Keep the keyword lists in step with the English shells.
 *
 *   node scripts/sync-keyword-lists.mjs
 *
 * Every page carries a keyword list for the search engines. The list is a set
 * of search phrases, so the same list is written into every dictionary; when
 * a list changes, this writes the new one into the eight dictionaries and
 * removes the old one.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, "$1"), "..");
const SHELL = path.join(ROOT, "src", "i18n", "shell");
const LANGS = ["es","pt","fr"];
const PAGES = ["index", "dashboard", "goalsbyyear", "goalsbyseason", "timeline", "trophies",
  "birthday", "latest-goal", "champions-league", "gear", "real-madrid", "ronaldo-vs-messi"];

// the list of every page, read from the English shell
const lists = [];
for (const p of PAGES) {
  const t = fs.readFileSync(path.join(ROOT, p + ".html"), "utf8");
  const m = t.match(/name="keywords"[^>]*content="([^"]*)"/) || t.match(/content="([^"]*)"[^>]*name="keywords"/);
  if (m) lists.push(m[1]);
}
console.log("the pages with a keyword list: " + lists.length);

for (const lang of LANGS) {
  const file = path.join(SHELL, lang + ".json");
  const dict = JSON.parse(fs.readFileSync(file, "utf8"));
  // the old lists: the ones that look like a list of search phrases
  const stale = Object.keys(dict).filter((k) => k.split(",").length > 8 && /ronaldo/i.test(k) && !lists.includes(k));
  for (const k of stale) delete dict[k];
  for (const l of lists) if (dict[l] === undefined) dict[l] = l;
  const sorted = {};
  for (const k of Object.keys(dict).sort()) sorted[k] = dict[k];
  fs.writeFileSync(file, JSON.stringify(sorted, null, 1), "utf8");
  console.log("  " + lang + ": " + stale.length + " old lists removed, " + lists.length + " lists written");
}
