/**
 * The runtime translation gate.
 *
 *   node scripts/check-runtime-i18n.mjs
 *
 * The copy that JavaScript renders is written in English in the source, and
 * the runtime translation pass (src/app.js) translates it with the shell
 * dictionaries. For that to work, every such string must be in the
 * dictionaries - and in every language.
 *
 * The strings that count are the ones the source shares with the page shells:
 * they are the same copy, so they are the same key. A string that only
 * appears in the script and in no shell has no translation and is a gap.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const LANGS = ["es","pt","fr"];

const app = fs.readFileSync(path.join(ROOT, "src", "app.js"), "utf8");
const en = JSON.parse(fs.readFileSync(path.join(ROOT, "src", "i18n", "shell", "en.json"), "utf8"));

// the string literals the script writes
const literals = new Set();
for (const m of app.matchAll(/"((?:[^"\\]|\\.){4,160})"/g)) {
  const s = m[1];
  if (!/[A-Za-z]{3,}/.test(s)) continue;
  if (/<[a-z/]/.test(s)) continue;      // markup
  if (/^[A-Za-z0-9_.-]+$/.test(s)) continue; // an id, a class, a key
  if (/^[a-z0-9-]+\.[a-z]{2,}/.test(s)) continue; // a host or a file
  if (s.includes("://")) continue;
  if (!/^[A-Z]/.test(s)) continue;      // UI copy starts with a capital
  if (!/ /.test(s)) continue;            // and is a phrase
  literals.add(s);
}

// the strings the shells also carry: those are the shared copy
const shared = [...literals].filter((s) => s in en);
console.log("the script writes " + literals.size + " phrases; " + shared.length + " of them are shared with the page shells");

let bad = 0;
for (const lang of LANGS) {
  const d = JSON.parse(fs.readFileSync(path.join(ROOT, "src", "i18n", "shell", lang + ".json"), "utf8"));
  const missing = shared.filter((s) => !(s in d));
  // a proper noun (a club, a competition, a button label in Latin script) may
  // stay in English; prose with an English function word may not
  const PROSE = /\b(the|and|for|with|all|per|from|your|total|every|each|goals|matches|apps|assists|show|showing|select|click|tap|open|view|watch|search|filter|choose|more|less|this|that|was|were|are|is|of|to|in|on)\b/i;
  const untranslated = shared.filter((s) => s in d && d[s] === s && PROSE.test(s));
  if (missing.length || untranslated.length) {
    bad++;
    console.log("\n" + lang + ": " + missing.length + " missing, " + untranslated.length + " still in English");
    for (const m of missing.slice(0, 8)) console.log("   missing: " + m.slice(0, 80));
    for (const m of untranslated.slice(0, 5)) console.log("   English: " + m.slice(0, 80));
  } else {
    console.log(lang + ": every shared runtime string is translated");
  }
}
if (bad) {
  console.log("\nFAILED: " + bad + " language(s) still show English where the runtime writes copy");
  process.exit(1);
}
console.log("\nevery language translates the copy the runtime writes");
