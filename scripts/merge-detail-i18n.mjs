/**
 * The last dictionary entries for the corrected copy.
 *
 *   node scripts/merge-detail-i18n.mjs
 *
 * The dashboard's first row names PSV Eindhoven instead of Inter, the date of
 * the last senior goal is 9 October 2026, and the FAQ asks about the 500th
 * goal on 30 September 2015. The keyword list of each page is a list of
 * search phrases in English: it is what the page carries, and it is written
 * into every dictionary as it stands, so that the localized pages carry the
 * same list.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, "$1"), "..");
const SHELL = path.join(ROOT, "src", "i18n", "shell");
const LANGS = ["es","pt","fr"];

// the opponent of the debut, in each language
const DEBUT = {
  es: "PSV Eindhoven (clasificación de la Champions League)",
  pt: "PSV Eindhoven (classificação da Champions League)",
  fr: "PSV Eindhoven (qualifications de la Ligue des champions)",
};

// the FAQ sentence: the old key, the new key, and the date phrase inside it
const FAQ_OLD = "On <b>4 May 2015</b>, against Malmö, in the season he passed Gerd Müller to become the all-time Champions League top scorer.";
const FAQ_NEW = "On <b>30 Sep 2015</b>, against Malmö, in the season he passed Gerd Müller to become the all-time Champions League top scorer.";

for (const lang of LANGS) {
  const P = path.join(SHELL, lang + ".json");
  const dict = JSON.parse(fs.readFileSync(P, "utf8"));
  let n = 0;

  // the date of the last senior goal
  if (dict["12 Oct 2026"]) {
    dict["9 Oct 2026"] = dict["12 Oct 2026"].split("12").join("9");
    n++;
  }

  // the opponent of the debut
  if (dict["Inter (Champions League qualifying)"] !== undefined) delete dict["Inter (Champions League qualifying)"];
  dict["PSV Eindhoven (Champions League qualifying)"] = DEBUT[lang];
  n++;

  // the FAQ
  const faqKey = Object.keys(dict).find((k) => k.includes("4 May 2015") && k.includes("Malm"));
  if (faqKey) {
    const value = dict[faqKey].split(dict["4 May 2015"] || "4 May 2015").join(dict["30 Sep 2015"] || "30 Sep 2015");
    delete dict[faqKey];
    dict[faqKey.replace("4 May 2015", "30 Sep 2015")] = value;
    n++;
  }

  const sorted = {};
  for (const k of Object.keys(dict).sort()) sorted[k] = dict[k];
  fs.writeFileSync(P, JSON.stringify(sorted, null, 1), "utf8");
  console.log("  " + lang + ": " + n + " entries");
}
