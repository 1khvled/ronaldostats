import fs from "node:fs";
const DIR = "D:/Projects/ronaldo-stats/src/i18n/shell/";
const langs = ["es", "pt", "fr", "bn", "ro", "uz", "ar", "hi"];
const keys = [
  "The Verified Cristiano Ronaldo Statistics &amp; Video Database",
  "Head-to-Head &amp; Complete Career Comparison",
  "Cristiano Ronaldo Stats: 981 Goals, 1,340 Matches &amp; 35 Trophies",
  "Cristiano Ronaldo Official Career Record: 981 Goals &amp; 261 Assists",
  "Never miss a Ronaldo goal — join us &amp; support RonaldoStats",
  "Cristiano Ronaldo &amp; Lionel Messi — two overlapping careers, 36 direct club meetings, and a statistical archive that records the results without ruling on them.",
  "Ronaldo &amp; Messi",
  "Cristiano Ronaldo · Portugal &amp; Al Nassr",
];
for (const L of langs) {
  const d = JSON.parse(fs.readFileSync(DIR + L + ".json", "utf8"));
  console.log("===== " + L);
  for (const k of keys) {
    const v = d[k];
    if (v === undefined) { console.log("  (absent) " + k.slice(0, 50)); continue; }
    const ents = v.match(/&amp;|&mdash;|&middot;|&bull;|&times;|&lt;|&gt;|&quot;|&apos;/g) || [];
    console.log("  " + JSON.stringify(v) + "   ents=" + JSON.stringify(ents));
  }
}
