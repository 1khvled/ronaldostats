/**
 * Sweep the stale career facts out of the English shells and the runtime
 * dictionaries.
 *
 * The shells are the i18n source, so a fact fixed here has to be fixed in the
 * runtime dictionaries too — they carry their own copy of the FAQ.
 *
 *   node scripts/fix-stale-facts.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// the shell corrections: [file, from, to, how many times it must appear]
const SHELL_FIXES = [
  // the dashboard's landmark table
  ["dashboard.html",
    '<td>PSV Eindhoven (Champions League qualifying)</td>',
    '<td>Inter (Champions League third qualifying round)</td>', 1],
  ["dashboard.html", "<td>16 Aug 2002</td>", "<td>14 Aug 2002</td>", 1],
  ["dashboard.html", "<td>17y 192d</td>", "<td>17y 190d</td>", 1],
  ["dashboard.html",
    "Last senior goal, Saudi Pro League",
    "Last senior goal, AFC Champions League Elite", 1],
  ["dashboard.html", "<td>9 Oct 2026</td>", "<td>12 Oct 2026</td>", 1],
  ["dashboard.html", "<td>41y 246d</td>", "<td>41y 249d</td>", 1],
  ["dashboard.html", "<td>Cagliari</td>", "<td>SPAL</td>", 1],

  // the timeline: the key dates, the era intro and the FAQ
  ["timeline.html", '<span class="kd-date">16 Aug 2002</span>', '<span class="kd-date">14 Aug 2002</span>', 1],
  ["timeline.html",
    "Ballon d'Or at 23, named on all 96 ballots, with the Champions League",
    "Ballon d'Or at 23, named on 77 of 96 ballots, with the Champions League", 1],
  ["timeline.html",
    "was named the world's best player at 23 — on all 96 ballots.",
    "was named the world's best player at 23 — on 77 of 96 ballots.", 1],
  ["timeline.html",
    "his first senior goals came two months later against Moreirense.",
    "his first senior goals came seven weeks later against Moreirense.", 2],
  ["timeline.html",
    "his 1,000th senior appearance against Cagliari.",
    "his 1,000th senior appearance against SPAL.", 1],

  // the achievements page
  ["achievements.html",
    "The first came at 23, with the vote on all 96 ballots.",
    "The first came at 23, with the vote on 77 of 96 ballots.", 1],
  ["achievements.html",
    "On <b>22 February 2020</b>, for Juventus against Cagliari.",
    "On <b>22 February 2020</b>, for Juventus against SPAL.", 1],
  ["achievements.html",
    "in the season he passed Gerd Müller to become the all-time Champions League top scorer.",
    "in the season he passed Messi to become the all-time Champions League top scorer.", 1],
];

// the runtime dictionaries carry their own copy of the FAQ
const FAQ_FIXES = {
  en: ["his first senior goals came two months later against Moreirense.", "his first senior goals came seven weeks later against Moreirense."],
  es: ["sus primeros goles profesionales llegaron dos meses después, ante el Moreirense.", "sus primeros goles profesionales llegaron siete semanas después, ante el Moreirense."],
  pt: ["seus primeiros gols profissionais vieram dois meses depois, contra o Moreirense.", "seus primeiros gols profissionais vieram sete semanas depois, contra o Moreirense."],
  fr: ["ses premiers buts en équipe première sont tombés deux mois plus tard contre Moreirense.", "ses premiers buts en équipe première sont tombés sept semaines plus tard contre Moreirense."],
};

let problems = 0;

for (const [file, from, to, expected] of SHELL_FIXES) {
  const p = path.join(ROOT, file);
  let src = fs.readFileSync(p, "utf8");
  const count = src.split(from).length - 1;
  if (count !== expected) {
    console.log("  [SKIP] " + file + ": \"" + from.slice(0, 50) + "\" appears " + count + " times, expected " + expected);
    problems++;
    continue;
  }
  src = src.split(from).join(to);
  fs.writeFileSync(p, src, "utf8");
  console.log("  [ok] " + file + ": " + JSON.stringify(from.slice(0, 54)) + " -> " + JSON.stringify(to.slice(0, 54)));
}

for (const [lang, [from, to]] of Object.entries(FAQ_FIXES)) {
  const p = path.join(ROOT, "src/i18n/" + lang + ".js");
  let src = fs.readFileSync(p, "utf8");
  const count = src.split(from).length - 1;
  if (count !== 1) {
    console.log("  [SKIP] " + lang + ".js: the FAQ phrase appears " + count + " times");
    problems++;
    continue;
  }
  src = src.split(from).join(to);
  fs.writeFileSync(p, src, "utf8");
  console.log("  [ok] " + lang + ".js: the FAQ now says seven weeks");
}

console.log(problems ? "\n" + problems + " correction(s) did not apply" : "\nevery correction applied");
