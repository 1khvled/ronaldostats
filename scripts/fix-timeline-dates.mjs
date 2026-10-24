/**
 * Correct the timeline's milestone dates and the one qualifier that named the
 * wrong competition.
 *
 *   node scripts/fix-timeline-dates.mjs
 *
 * The timeline was cloned from the Messi project and kept some of its dates:
 * the first senior goal, the Real Madrid signing, the 500th goal and the 2013
 * hat-trick were dated for the wrong matches. The corrected dates are taken
 * from the site's own dated goal calendar and goal archive:
 *
 *   14 Aug 2002  senior debut for Sporting CP   -> 16 Aug 2002
 *   21 Oct 2002  first senior goal               -> 7 Oct 2002
 *   1 Jul 2009   signs for Real Madrid           -> 10 Jun 2009
 *   4 May 2015   the 500th goal (vs Malmo)      -> 30 Sep 2015
 *   16 Jun 2013  the Northern Ireland hat-trick -> 6 Sep 2013
 *
 * The hat-trick was in a World Cup 2014 qualifier, not a Euro 2012 one.
 *
 * The eight dictionaries carry the same dates, in each language's own month
 * names, so a corrected date is written from a date with the same month in
 * that language.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, "$1"), "..");
const SHELL = path.join(ROOT, "src", "i18n", "shell");
const LANGS = ["es","pt","fr"];

// the old date, the new date, and the date whose month name the new one uses
const DATES = [
  { from: "14 Aug 2002", to: "16 Aug 2002", donor: "14 Aug 2002" },
  { from: "21 Oct 2002", to: "7 Oct 2002", donor: "21 Oct 2002" },
  { from: "1 Jul 2009", to: "10 Jun 2009", donor: "16 Jun 2013" },
  { from: "4 May 2015", to: "30 Sep 2015", donor: "5 Sep 2024" },
  { from: "16 Jun 2013", to: "6 Sep 2013", donor: "5 Sep 2024" },
];

// the qualifier that named the wrong competition
const SENTENCE = "— against Northern Ireland in a Euro 2012 qualifier, Ronaldo scores three times inside 15 minutes, the fastest international hat-trick of his career, in the season he sets his 69-goal calendar-year record.";
const NEW_SENTENCE = SENTENCE.replace("a Euro 2012 qualifier", "a World Cup 2014 qualifier");
const QUALIFIER = {
  es: ["clasificatorio de la Euro 2012", "clasificatorio del Mundial 2014"],
  pt: ["eliminatória da Euro 2012", "eliminatória da Copa do Mundo 2014"],
  fr: ["éliminatoire de l'Euro 2012", "éliminatoire de la Coupe du monde 2014"],
};

// --- the English shell -------------------------------------------------------
{
  const P = path.join(ROOT, "timeline.html");
  let t = fs.readFileSync(P, "utf8");
  for (const d of DATES) t = t.split(">" + d.from + "<").join(">" + d.to + "<");
  t = t.split(SENTENCE).join(NEW_SENTENCE);
  fs.writeFileSync(P, t, "utf8");
  console.log("ok  timeline.html: the dates and the qualifier are corrected");
}

// --- the eight dictionaries --------------------------------------------------
for (const lang of LANGS) {
  const P = path.join(SHELL, lang + ".json");
  const dict = JSON.parse(fs.readFileSync(P, "utf8"));

  for (const d of DATES) {
    const donor = dict[d.donor];
    if (!donor) { console.error("  (" + lang + ") no donor for " + d.donor); continue; }
    const day = d.donor.match(/^(\d{1,2}) /)[1];
    const year = d.donor.match(/(\d{4})$/)[1];
    const toDay = d.to.match(/^(\d{1,2}) /)[1];
    const toYear = d.to.match(/(\d{4})$/)[1];
    let value = donor.split(day).join(toDay).split(year).join(toYear);
    if (dict[d.from] !== undefined) delete dict[d.from];
    dict[d.to] = value;
  }

  if (dict[SENTENCE] !== undefined) {
    const [from, to] = QUALIFIER[lang];
    let v = dict[SENTENCE];
    if (v.includes(from)) v = v.split(from).join(to);
    else console.error("  (" + lang + ") the qualifier phrase was not found: " + from);
    delete dict[SENTENCE];
    dict[NEW_SENTENCE] = v;
  }

  const sorted = {};
  for (const k of Object.keys(dict).sort()) sorted[k] = dict[k];
  fs.writeFileSync(P, JSON.stringify(sorted, null, 1), "utf8");
  console.log("  " + lang + ": the dates and the qualifier are corrected");
}
