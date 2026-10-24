import fs from "node:fs";
const ROOT = "D:/Projects/ronaldo-stats/";

// --- the timeline: the last goal is dated 9 October 2026 ---------------------
{
  const P = ROOT + "/timeline.html";
  let t = fs.readFileSync(P, "utf8");
  const before = t;
  t = t.replace('<span class="tl-date">12 Oct 2026</span>', '<span class="tl-date">9 Oct 2026</span>');
  fs.writeFileSync(P, t, "utf8");
  console.log(before === t ? "  (the timeline was already right)" : "ok  timeline.html: the last goal is dated 9 Oct 2026");
}

// --- the dictionaries: the same date ------------------------------------------
{
  const SHELL = ROOT + "/src/i18n/shell/";
  for (const lang of ["es","pt","fr"]) {
    const file = SHELL + lang + ".json";
    const dict = JSON.parse(fs.readFileSync(file, "utf8"));
    if (dict["12 Oct 2026"] && dict["9 Oct 2026"]) {
      dict["9 Oct 2026"] = dict["12 Oct 2026"];
      delete dict["12 Oct 2026"];
    }
    const sorted = {};
    for (const k of Object.keys(dict).sort()) sorted[k] = dict[k];
    fs.writeFileSync(file, JSON.stringify(sorted, null, 1), "utf8");
  }
  console.log("ok  the eight dictionaries: the date of the last goal");
}

// --- the roulette: the last goal is his 981st --------------------------------
{
  const P = ROOT + "/src/app.js";
  let t = fs.readFileSync(P, "utf8");
  const before = t;
  t = t.replace('{ num: 0, date: "2026-10-09"', '{ num: 981, date: "2026-10-09"');
  fs.writeFileSync(P, t, "utf8");
  console.log(before === t ? "  (the roulette was already right)" : "ok  app.js: the last goal is numbered 981");
}
