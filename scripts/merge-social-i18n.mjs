/**
 * Write the new social and footer copy into the eight localized dictionaries.
 *
 *   node scripts/merge-social-i18n.mjs
 *
 * The X and Telegram accounts the site points at changed, and the footer
 * gained a link to the sister site, so the strings that carry them changed
 * too. The account strings are the old ones with the handle swapped; the new
 * footer link and the two new video buttons are written out here.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, "$1"), "..");
const SHELL = path.join(ROOT, "src", "i18n", "shell");
const LANGS = ["es", "pt", "fr", "ar", "bn", "hi", "ro", "uz"];

// the old account strings, and the strings that replace them
const SWAPS = [
  ["@ronaldostat1", "@messistat1"],
  ["@ronaldostats1", "@messistat1"],
  ["Follow @ronaldostat1 on X", "Follow @messistat1 on X"],
  ["Follow @ronaldostats1 on X", "Follow @messistat1 on X"],
  ["Follow RonaldoStats on X (@ronaldostat1)", "Follow RonaldoStats on X (@messistat1)"],
  ["Follow RonaldoStats on X (@ronaldostats1)", "Follow RonaldoStats on X (@messistat1)"],
  ["Telegram @ronaldostatdotcom", "Telegram @messistatdotcom"],
  ["Telegram @ronaldostatsdotcom", "Telegram @messistatdotcom"],
];

// the strings that are new
const NEW = {
  "🐐 MessiStat — Lionel Messi Stats": {
    es: "🐐 MessiStat — Estadísticas de Lionel Messi",
    pt: "🐐 MessiStat — Estatísticas de Lionel Messi",
    fr: "🐐 MessiStat — Statistiques de Lionel Messi",
    ar: "🐐 ميسيستات — إحصائيات ليونيل ميسي",
    bn: "🐐 মেসিস্ট্যাট — লিওনেল মেসির পরিসংখ্যান",
    hi: "🐐 मेसीस्टैट — लियोनेल मेसी के आँकड़े",
    ro: "🐐 MessiStat — Statisticile lui Lionel Messi",
    uz: "🐐 MessiStat — Lionel Messi statistikasi",
  },
  "Watch the 2010-11 Goals ⚽": {
    es: "Mira los goles de 2010-11 ⚽",
    pt: "Assista aos gols de 2010-11 ⚽",
    fr: "Voir les buts de 2010-11 ⚽",
    ar: "شاهد أهداف 2010-11 ⚽",
    bn: "২০১০-১১ সালের গোল দেখুন ⚽",
    hi: "2010-11 के गोल देखें ⚽",
    ro: "Vezi golurile din 2010-11 ⚽",
    uz: "2010-11-yil gollarini ko'ring ⚽",
  },
  "Watch the 2017-18 Goals ⚽": {
    es: "Mira los goles de 2017-18 ⚽",
    pt: "Assista aos gols de 2017-18 ⚽",
    fr: "Voir les buts de 2017-18 ⚽",
    ar: "شاهد أهداف 2017-18 ⚽",
    bn: "২০১৭-১৮ সালের গোল দেখুন ⚽",
    hi: "2017-18 के गोल देखें ⚽",
    ro: "Vezi golurile din 2017-18 ⚽",
    uz: "2017-18-yil gollarini ko'ring ⚽",
  },
};

for (const lang of LANGS) {
  const file = path.join(SHELL, lang + ".json");
  const dict = JSON.parse(fs.readFileSync(file, "utf8"));
  let n = 0;

  // the account strings: the same words with the new handle
  for (const [from, to] of SWAPS) {
    if (dict[from] === undefined) continue;
    const translated = String(dict[from]).split(from).join(to);
    if (dict[to] === undefined) { dict[to] = translated; n++; }
  }

  // the new strings
  for (const [en, values] of Object.entries(NEW)) {
    const value = values[lang];
    if (!value) { console.error("  (" + lang + ") no translation for: " + en); continue; }
    if (dict[en] === undefined) { dict[en] = value; n++; }
  }

  const sorted = {};
  for (const k of Object.keys(dict).sort()) sorted[k] = dict[k];
  fs.writeFileSync(file, JSON.stringify(sorted, null, 1), "utf8");
  console.log("  " + lang + ": " + n + " new strings");
}
