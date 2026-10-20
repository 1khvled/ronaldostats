/**
 * The last of the cloned dates and labels.
 *
 *   node scripts/fix-cloned-details.mjs
 *
 * The dashboard's milestone table and the achievements FAQ were cloned with
 * the Messi project's dates and, in two cases, its details. The corrected
 * values come from the site's own dated goal calendar and goal archive:
 *
 *   the Sporting debut was 16 August 2002 against PSV Eindhoven, not
 *   14 August against Inter;
 *   the last senior goal was 9 October 2026, not 12 October;
 *   the 500th goal was on 30 September 2015, not 4 May;
 *   the first Portugal goal was his 12th goal overall.
 *
 * The three video buttons on the Real Madrid page also had to learn the
 * wording the dictionaries already carry, and the page generator now
 * translates the meta tags (the description, the Open Graph and Twitter
 * cards) as well as the body, which is what the MessiStat site does.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, "$1"), "..");
const SHELL = path.join(ROOT, "src", "i18n", "shell");
const LANGS = ["es", "pt", "fr", "ar", "bn", "hi", "ro", "uz"];

// --- 1. the dashboard's milestone table --------------------------------------
{
  const P = path.join(ROOT, "dashboard.html");
  let t = fs.readFileSync(P, "utf8");
  const before = t;
  t = t.replace("Inter (Champions League qualifying)", "PSV Eindhoven (Champions League qualifying)");
  t = t.replace(">14 Aug 2002<", ">16 Aug 2002<");
  t = t.replace(">17y 190d<", ">17y 192d<");
  t = t.replace(">12 Oct 2026<", ">9 Oct 2026<");
  t = t.replace(">41y 249d<", ">41y 246d<");
  t = t.replace(">Goal #1 (Portugal)<", ">Goal #12<");
  fs.writeFileSync(P, t, "utf8");
  console.log(before === t ? "  (the dashboard table was already right)" : "ok  dashboard.html: the milestone table is corrected");
}

// --- 2. the achievements FAQ --------------------------------------------------
{
  const P = path.join(ROOT, "achievements.html");
  let t = fs.readFileSync(P, "utf8");
  const before = t;
  t = t.replace("On <b>4 May 2015</b>, against Malmö", "On <b>30 September 2015</b>, against Malmö");
  fs.writeFileSync(P, t, "utf8");
  console.log(before === t ? "  (the FAQ was already right)" : "ok  achievements.html: the 500th goal is dated correctly");
}

// --- 3. the video buttons on the Real Madrid page ----------------------------
{
  const P = path.join(ROOT, "scripts", "apply-seo-parity.mjs");
  let t = fs.readFileSync(P, "utf8");
  t = t.replace('label: "Watch the 2010-11 goals ↗"', 'label: "Watch the 2010-11 Goals ⚽"');
  t = t.replace('label: "Watch the Penalty ↗"', 'label: "Watch the Penalty ⚽"');
  t = t.replace('label: "Watch the 2017-18 goals ↗"', 'label: "Watch the 2017-18 Goals ⚽"');
  fs.writeFileSync(P, t, "utf8");
  console.log("ok  apply-seo-parity.mjs: the button labels match the dictionaries");
}

// --- 4. the page generator translates the meta tags ---------------------------
{
  const P = path.join(ROOT, "scripts", "generate-i18n-pages.mjs");
  let t = fs.readFileSync(P, "utf8");
  const before = t;
  t = t.replace(
    'const TRANSLATABLE_ATTRS = ["title", "alt", "placeholder", "aria-label", "label", "value", "aria-description", "data-label"];',
    '// "content" is the meta description, the Open Graph card and the Twitter card:\n  // the MessiStat site translates them, and so does this one.\n  const TRANSLATABLE_ATTRS = ["title", "alt", "placeholder", "aria-label", "label", "value", "aria-description", "data-label", "content"];'
  );
  fs.writeFileSync(P, t, "utf8");
  console.log(before === t ? "  (the generator already translated the meta tags)" : "ok  generate-i18n-pages.mjs: the meta tags are translated");
}

// --- 5. the dictionaries ------------------------------------------------------
{
  // the dates and the ages that changed, with the date whose wording the new
  // one uses
  const DATES = [
    { from: "14 Aug 2002", to: "16 Aug 2002", donor: "14 Aug 2002" },
    { from: "4 May 2015", to: "30 Sep 2015", donor: "5 Sep 2024" },
  ];
  const LITERAL = ["17y 192d", "41y 246d", "Goal #12"];
  for (const lang of LANGS) {
    const P = path.join(SHELL, lang + ".json");
    const dict = JSON.parse(fs.readFileSync(P, "utf8"));
    for (const d of DATES) {
      const donor = dict[d.donor];
      if (!donor) continue;
      const day = d.donor.match(/^(\d{1,2}) /)[1];
      const year = d.donor.match(/(\d{4})$/)[1];
      const value = donor.split(day).join(d.to.match(/^(\d{1,2}) /)[1]).split(year).join(d.to.match(/(\d{4})$/)[1]);
      if (dict[d.from] !== undefined) delete dict[d.from];
      dict[d.to] = value;
    }
    for (const l of LITERAL) if (dict[l] === undefined) dict[l] = l;
    // the FAQ sentence, which names the day of the 500th goal
    for (const key of Object.keys(dict)) {
      if (!/500th career goal/.test(key)) continue;
      const oldDate = dict["4 May 2015"];
      const newDate = dict["30 Sep 2015"];
      if (oldDate && newDate && dict[key].includes(oldDate)) {
        const value = dict[key].split(oldDate).join(newDate);
        delete dict[key];
        dict[key.replace("4 May 2015", "30 September 2015")] = value;
      }
    }
    const sorted = {};
    for (const k of Object.keys(dict).sort()) sorted[k] = dict[k];
    fs.writeFileSync(P, JSON.stringify(sorted, null, 1), "utf8");
  }
  console.log("ok  the eight dictionaries: the corrected dates and the new labels");
}
