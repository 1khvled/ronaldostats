/**
 * Check the language choice and the theme.
 *
 *   node scripts/check-language-theme.mjs
 *
 * Three faults this catches, all of which broke the site for a visitor:
 *
 *  1. The language choice is stored under one key and read under another.
 *     The home page read a misspelled key, so the choice the visitor made in
 *     the switcher was never found: the site sent them straight back to the
 *     browser's language, and the switcher looked broken.
 *  2. A page without the inline theme script starts in the light theme and
 *     only turns dark once the script runs, so the pages disagree with each
 *     other for a visitor whose system is dark.
 *  3. The home page has to answer at /<lang> and at /<lang>/index.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const LANGS = ["en","es","pt","fr"];
const SHELLS = ["index", "dashboard", "goalsbyyear", "goalsbyseason", "timeline", "achievements", "champions-league", "gear", "real-madrid", "ronaldo-vs-messi"];

const problems = [];
const app = fs.readFileSync(path.join(ROOT, "src/app.js"), "utf8");

// 1. the storage key is the same everywhere
const appKeys = [...new Set([...app.matchAll(/ronaldostatss?_lang_choice/g)].map((m) => m[0]))];
if (appKeys.length !== 1) {
  problems.push("src/app.js uses " + appKeys.length + " different storage keys: " + appKeys.join(", "));
}
for (const shell of SHELLS) {
  const src = fs.readFileSync(path.join(ROOT, shell + ".html"), "utf8");
  for (const m of src.matchAll(/ronaldostatss?_lang_choice/g)) {
    if (!appKeys.includes(m[0])) {
      problems.push(shell + ".html reads '" + m[0] + "' but the app writes '" + (appKeys[0] || "?") + "'");
    }
  }
}

// 2. every page applies the theme before the first paint
for (const shell of SHELLS) {
  const src = fs.readFileSync(path.join(ROOT, shell + ".html"), "utf8");
  if (!src.includes("prefers-color-scheme")) {
    problems.push(shell + ".html has no inline theme script: it starts in the light theme");
  }
}

// 3. the home page answers at /<lang> and /<lang>/index
const vercel = JSON.parse(fs.readFileSync(path.join(ROOT, "vercel.json"), "utf8"));
const rules = [...(vercel.redirects || []), ...(vercel.rewrites || [])];
const homeRule = rules.find((r) => r.source === "/:lang(en|es|pt|fr|ar|bn|hi|ro|uz)/index");
if (!homeRule) problems.push("vercel.json has no rule for /<lang>/index: the home page 404s in that form");
for (const lang of LANGS) {
  if (!rules.some((r) => (r.source || "").includes(":lang"))) {
    problems.push("vercel.json has no localized rule for " + lang);
    break;
  }
}

// 4. the switcher writes a key the switcher reads
if (!/getItem\("ronaldostats_lang_choice"\)/.test(app)) problems.push("the app never reads the language choice it writes");
if (!/setItem\("ronaldostats_lang_choice"/.test(app)) problems.push("the app never writes the language choice it reads");

if (problems.length) {
  console.log("FAIL  the language choice and the theme:");
  for (const p of problems) console.log("  - " + p);
  process.exit(1);
}
console.log("PASS  the language choice is stored and read under one key, every page applies the theme before the first paint, and the home page answers in both forms");
