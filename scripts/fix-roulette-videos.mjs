/**
 * Give the two goal roulettes the real video of every goal they can match.
 *
 *   node scripts/fix-roulette-videos.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const snap = JSON.parse(fs.readFileSync(path.join(ROOT, "public/data/ronaldo-goals.json"), "utf8"));
const BT = String.fromCharCode(96);

const norm = (s) => String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");

const WANTED = [
  { num: 1, year: 2002, opp: "Moreirense" }, { num: 8, year: 2004, opp: "Greece" },
  { num: 50, year: 2007, opp: "Newcastle United" }, { num: 100, year: 2017, opp: "Bayern Munich" },
  { num: 200, year: 2011, opp: "Barcelona" }, { num: 300, year: 2013, opp: "Northern Ireland" },
  { num: 400, year: 2014, opp: "Atletico Madrid" }, { num: 500, year: 2015, opp: "Malmo" },
  { num: 640, year: 2018, opp: "Juventus" }, { num: 700, year: 2019, opp: "Ukraine" },
  { num: 900, year: 2024, opp: "Croatia" }, { num: 981, year: 2026, opp: "Al-Diriyah" },
];

const found = new Map();
for (const g of WANTED) {
  const pref = norm(g.opp).slice(0, 6);
  const cands = snap.goals.filter((x) => {
    if (!x.date) return false;
    if (g.num !== 50 && String(x.date).slice(0, 4) !== String(g.year)) return false;
    const opp = norm(x.opponent);
    return opp.includes(pref) || pref.includes(opp.slice(0, 5));
  });
  if (!cands.length) continue;
  const withClip = cands.find((x) => (x.media || []).some((m) => m.kind === "clip"));
  const pick = withClip || cands[0];
  const clip = (pick.media || []).find((m) => m.kind === "clip");
  const comp = (pick.media || []).find((m) => m.kind === "compilation" || m.kind === "highlights");
  found.set(g.num, { date: pick.date, videoUrl: clip ? clip.url : (comp ? comp.url : "") });
}
console.log("matched " + found.size + " of " + WANTED.length + " roulette goals to the archive");

// 1. the data: insert the date and the video right after the goal number
const P = path.join(ROOT, "src", "app.js");
let t = fs.readFileSync(P, "utf8");
let n = 0;
for (const [num, info] of found) {
  const find = "{ num: " + num + ",";
  const add = '{ num: ' + num + ', date: "' + info.date + '"' + (info.videoUrl ? ', videoUrl: "' + info.videoUrl + '"' : "") + ",";
  const count = t.split(find).length - 1;
  t = t.split(find).join(add);
  n += count;
}
fs.writeFileSync(P, t, "utf8");
console.log("ok  app.js: " + n + " roulette entries carry their date" + (found.size ? " and their video" : ""));

// 2. the arcade roulette's watch link
{
  const find = '<a href="/en/latest-goal" class="btn-roulette-watch">';
  if (t.includes(find)) {
    t = t.split(find).join('<a href="#" class="btn-roulette-watch">');
    const find2 = "    const g = LEGENDARY_GOALS[Math.floor(Math.random() * LEGENDARY_GOALS.length)];";
    const repl2 = find2 + "\n    const gBday = g.date ? " + BT + "/${getCurrentLangCode()}/birthday/${g.date.slice(5)}" + BT + ' : "";';
    if (t.includes(find2)) {
      t = t.split(find2).join(repl2);
      const find3 = '    spinBtn.textContent = "🎲 Spin Another Goal";';
      const repl3 = [
        '    const watchLink = rouletteDisplay.querySelector(".btn-roulette-watch");',
        "    if (watchLink) {",
        "      watchLink.setAttribute(" + BT + "href" + BT + ", gBday || " + BT + "/${getCurrentLangCode()}/birthday" + BT + ");",
        "    }",
        find3,
      ].join("\n");
      if (t.includes(find3)) {
        t = t.split(find3).join(repl3);
        fs.writeFileSync(P, t, "utf8");
        console.log("ok  app.js: the arcade roulette's watch link opens the goal's date");
      } else console.log("  (the arcade spin's anchor was not found)");
    } else console.log("  (the arcade roulette's render block was not found)");
  } else console.log("  (the arcade watch link was not found)");
}

// 3. the dedicated roulette: a goal with no clip opens the explorer
{
  const t2 = fs.readFileSync(P, "utf8");
  const find4 = [
    "    if (video && g.videoUrl) {",
    "    video.src = g.videoUrl;",
    "    video.load();",
    "    video.play().catch(() => {});",
    '    video.scrollIntoView({ behavior: "smooth", block: "center" });',
    "  }",
  ].join("\n");
  const repl4 = [
    "    if (video && g.videoUrl) {",
    "    video.src = g.videoUrl;",
    "    video.load();",
    "    video.play().catch(() => {});",
    '    video.scrollIntoView({ behavior: "smooth", block: "center" });',
    "  } else if (g.date) {",
    "    // the archive has no clip of this goal: open its date in the explorer,",
    "    // where the season's video plays",
    "    window.location.href = " + BT + "/${getCurrentLangCode()}/birthday/${g.date.slice(5)}" + BT + ";",
    "    return;",
    "  }",
  ].join("\n");
  if (t2.includes(find4)) {
    fs.writeFileSync(P, t2.split(find4).join(repl4), "utf8");
    console.log("ok  app.js: the dedicated roulette falls back to the goal's date");
  } else console.log("  (the dedicated roulette's video block was not found)");
}
