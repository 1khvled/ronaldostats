/**
 * Drop the strings the English shells no longer use from the eight localized
 * dictionaries.
 *
 *   node scripts/prune-shell-dictionaries.mjs
 *
 * The page generator looks every string up in the dictionary, so a key that
 * the English shells do not have can never be used. The i18n audit compares the
 * dictionaries with the English source and fails on the difference, so the
 * stale keys are removed here.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, "$1"), "..");
const SHELL = path.join(ROOT, "src", "i18n", "shell");
const en = JSON.parse(fs.readFileSync(path.join(SHELL, "en.json"), "utf8"));
const keys = new Set(Object.keys(en));

for (const lang of ["es", "pt", "fr", "ar", "bn", "hi", "ro", "uz"]) {
  const file = path.join(SHELL, lang + ".json");
  const dict = JSON.parse(fs.readFileSync(file, "utf8"));
  const stale = Object.keys(dict).filter((k) => !keys.has(k));
  for (const k of stale) delete dict[k];
  fs.writeFileSync(file, JSON.stringify(dict, null, 1), "utf8");
  console.log("  " + lang + ": " + stale.length + " stale strings removed (" + Object.keys(dict).length + " left)");
  for (const k of stale.slice(0, 3)) console.log("      - " + JSON.stringify(k).slice(0, 90));
}
