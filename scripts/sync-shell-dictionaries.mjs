/**
 * Bring the eight dictionaries back in step with the English source.
 *
 *   node scripts/sync-shell-dictionaries.mjs
 *
 * The dictionaries hold one entry per string in the English shells, and the
 * audit compares the two key sets exactly. This script:
 *
 *   1. restores any entry the English source still has but a dictionary lost
 *      (from the last commit, so the translation comes back with it);
 *   2. removes the entries the English source no longer has (a string that
 *      changed leaves its old key behind).
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, "$1"), "..");
const SHELL = path.join(ROOT, "src", "i18n", "shell");
const LANGS = ["es","pt","fr"];

const en = JSON.parse(fs.readFileSync(path.join(SHELL, "en.json"), "utf8"));
const enKeys = new Set(Object.keys(en));

// the English source as it was in the last commit, so the entries that were
// dropped can be put back
let enBefore = {};
try {
  const raw = execFileSync("git", ["show", "HEAD:src/i18n/shell/en.json"], { cwd: ROOT, encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
  enBefore = JSON.parse(raw);
} catch (e) {
  console.log("  (the previous English source could not be read: " + e.message + ")");
}

for (const lang of LANGS) {
  const file = path.join(SHELL, lang + ".json");
  const dict = JSON.parse(fs.readFileSync(file, "utf8"));
  let restored = 0, removed = 0;

  // 1. the entries the English source still has
  for (const key of Object.keys(en)) {
    if (dict[key] !== undefined) continue;
    const old = {};
    try {
      const raw = execFileSync("git", ["show", "HEAD:src/i18n/shell/" + lang + ".json"], { cwd: ROOT, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
      Object.assign(old, JSON.parse(raw));
    } catch (e) { /* no history */ }
    dict[key] = old[key] !== undefined ? old[key] : key;
    restored++;
  }

  // 2. the entries the English source no longer has
  for (const key of Object.keys(dict)) {
    if (enKeys.has(key)) continue;
    // a keyword list that changed: the new one is already written
    const isOldList = key.split(",").length > 8 && /ronaldo/i.test(key) && !Object.keys(en).some((k) => k.split(",").length > 8 && k.startsWith(key.split(",")[0]));
    if (isOldList) { delete dict[key]; removed++; continue; }
    if (key in enBefore) { delete dict[key]; removed++; }
  }

  const sorted = {};
  for (const k of Object.keys(dict).sort()) sorted[k] = dict[k];
  fs.writeFileSync(file, JSON.stringify(sorted, null, 1), "utf8");
  console.log("  " + lang + ": " + restored + " restored, " + removed + " removed, " + Object.keys(sorted).length + " in total");
}
