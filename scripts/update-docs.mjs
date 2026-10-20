import fs from "node:fs";
const ROOT = "D:/Projects/ronaldo-stats/";

// --- CONTEXT.md: record the new source pipeline ----------------------------
{
  const P = ROOT + "CONTEXT.md";
  let t = fs.readFileSync(P, "utf8");
  const anchor = "<!-- ADD NEW ENTRIES BELOW THIS LINE — DO NOT EDIT ABOVE -->";
  const entry = anchor + `

- 2026-10-20 — claude-opus-4.8 (1M context) — goal-source pipeline + runtime fixes — the birthday explorer now has a real per-goal media source, and the browser pass fixed two bugs the build could not see. **The source**: cr7allgoals.com, the Ronaldo counterpart to messiallgoals.com — a per-goal archive whose own list is Wikipedia's "List of senior career goals by Cristiano Ronaldo" (revision-pinned, CC BY-SA 4.0, built on FBref's goal log), with the reviewed event data (finish, assist, body part, xG) from StatsBomb open data, and a media catalogue that links each asset to the exact goal. \`scripts/fetch-goal-source.mjs\` vendors an attributed snapshot into \`public/data/ronaldo-goals.json\` (979 goals, 62 media assets, 35 exact clips, 858 in a compilation); \`scripts/merge-goal-source.mjs\` reconciles the calendar with it — 794 of 974 goals matched, 10 off-by-one dates corrected to the source's, 342 goals given a sourced minute and finish, and every goal given an archive link (the per-goal page, or an opponent-and-year search when the archive has no page for it). \`scripts/smoke-i18n.mjs\` calls all 558 dictionary functions in all nine languages. **Bugs found by running the site in a browser, not by the build**: the dictionary modules called \`n()\`, \`esc()\` and \`LIVE\` from app.js's scope, which the module split had broken (every home page threw "n is not defined"); and the rivalry page carried a different AdSense publisher id from the other 90 pages, which would have misrouted its ad revenue. Both are fixed, and the smoke test and \`scripts/audit-adsense.mjs\` are now gates. Files: scripts/fetch-goal-source.mjs, scripts/merge-goal-source.mjs, scripts/smoke-i18n.mjs, scripts/audit-adsense.mjs, public/data/ronaldo-goals.json, public/data/birthday-goals.json, src/app.js, src/i18n/*.js, src/styles.css, birthday.html, 9 rivalry pages. Verify: \`npm run verify:all\` (14 gates green); browser pass over all twelve pages (no console errors, no NaN) and the birthday modal (embedded clip, archive link, assist, finish, minute, score).`;
  if (!t.includes("cr7allgoals.com")) {
    t = t.replace(anchor, entry);
    fs.writeFileSync(P, t, "utf8");
    console.log("ok  CONTEXT.md updated");
  } else {
    console.log("ok  CONTEXT.md already records it");
  }
}

// --- README: the new source ------------------------------------------------
{
  const P = ROOT + "README.md";
  let t = fs.readFileSync(P, "utf8");
  const find = `- **Transfermarkt / worldfootball.net** — the season-by-season cross-check.`;
  const replace = find + `
- **cr7allgoals.com** — the per-goal archive behind the birthday explorer: every
  goal with its date, competition, scoreline, minute, finish and assist, plus
  the media that shows it. Its own list is Wikipedia's *List of senior career
  goals by Cristiano Ronaldo* (CC BY-SA 4.0, built on FBref's goal log) and its
  reviewed event data comes from StatsBomb open data. \`npm run fetch:goals\`
  refreshes the vendored, attributed snapshot in
  \`public/data/ronaldo-goals.json\`.`;
  if (!t.includes("cr7allgoals.com")) {
    t = t.replace(find, replace);
    fs.writeFileSync(P, t, "utf8");
    console.log("ok  README.md updated");
  } else {
    console.log("ok  README.md already records it");
  }
}
