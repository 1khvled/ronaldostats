/**
 * The keyword list of every page, in every dictionary.
 *
 *   node scripts/merge-keyword-i18n.mjs
 *
 * The pages carry a keyword list for the search engines. The list is a set of
 * search phrases, and the same list is written into every dictionary, so that
 * the localized pages carry the same list and the page generator finds it
 * when it writes the meta tag.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, "$1"), "..");
const SHELL = path.join(ROOT, "src", "i18n", "shell");
const LANGS = ["es", "pt", "fr", "ar", "bn", "hi", "ro", "uz"];

const en = JSON.parse(fs.readFileSync(path.join(SHELL, "en.json"), "utf8"));
const keywordLists = Object.keys(en).filter((k) => k.includes("ronaldo stats, ") || k.includes("ronaldo goals by year") || k.includes("ronaldo timeline") || k.includes("ronaldo trophies") || k.includes("did ronaldo score") || k.includes("ronaldo goal today") || k.includes("ronaldo champions league,") || k.includes("ronaldo gear") || k.includes("ronaldo real madrid,") || k.includes("ronaldo vs messi,"));

for (const lang of LANGS) {
  const P = path.join(SHELL, lang + ".json");
  const dict = JSON.parse(fs.readFileSync(P, "utf8"));
  let n = 0;
  for (const list of keywordLists) {
    if (dict[list] === undefined) { dict[list] = list; n++; }
  }
  const sorted = {};
  for (const k of Object.keys(dict).sort()) sorted[k] = dict[k];
  fs.writeFileSync(P, JSON.stringify(sorted, null, 1), "utf8");
  console.log("  " + lang + ": " + n + " keyword lists (" + keywordLists.length + " on the page)");
}
