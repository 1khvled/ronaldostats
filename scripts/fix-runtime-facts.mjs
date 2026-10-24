/**
 * Correct the stale facts in the runtime dictionaries.
 *
 *   node scripts/fix-runtime-facts.mjs
 *
 * The Ballon d'Or of 2008 was won on 77 of the 96 ballots, and the 1,000th
 * senior appearance was against SPAL, not Cagliari. The shell pages carried
 * the corrections; the runtime dictionaries - which the script renders - still
 * carried the old ones.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// [language, [from, to, how many times it must appear]]
const FIXES = {
  en: [
    ["on all 96 ballots", "on 77 of 96 ballots", 3],
    ["against Cagliari in February 2020", "against SPAL in February 2020", 1],
  ],
  es: [
    ["en las 96 papeletas", "en 77 de las 96 papeletas", 3],
    ["ante el Cagliari en febrero de 2020", "ante el SPAL en febrero de 2020", 1],
  ],
  pt: [
    ["em todos os 96 votos", "em 77 dos 96 votos", 2],
    ["com os 96 votos", "com 77 dos 96 votos", 1],
    ["contra o Cagliari, em fevereiro de 2020", "contra o SPAL, em fevereiro de 2020", 1],
  ],
  fr: [
    ["sur les 96 bulletins de vote", "sur 77 des 96 bulletins de vote", 3],
    ["contre le Cagliari en février 2020", "contre le SPAL en février 2020", 1],
  ],
};

let problems = 0;
for (const [lang, fixes] of Object.entries(FIXES)) {
  const p = path.join(ROOT, "src/i18n/" + lang + ".js");
  let src = fs.readFileSync(p, "utf8");
  for (const [from, to, expected] of fixes) {
    const count = src.split(from).length - 1;
    if (count !== expected) {
      console.log("  [SKIP] " + lang + ": \"" + from + "\" appears " + count + " times, expected " + expected);
      problems++;
      continue;
    }
    src = src.split(from).join(to);
    console.log("  [ok] " + lang + ": " + JSON.stringify(from) + " -> " + JSON.stringify(to));
  }
  fs.writeFileSync(p, src, "utf8");
}
console.log(problems ? "\n" + problems + " correction(s) did not apply" : "\nevery correction applied");
