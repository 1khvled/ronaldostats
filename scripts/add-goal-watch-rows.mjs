import fs from "node:fs";
import path from "node:path";
const ROOT = "D:/Projects/ronaldo-stats/";

// ---------------------------------------------------------------------------
// 1. one more string for the new per-goal watch action, in every language
// ---------------------------------------------------------------------------
const WATCH = {
  en: "▶ Watch this goal",
  es: "▶ Ver este gol",
  pt: "▶ Ver este gol",
  fr: "▶ Voir ce but",
  ar: "▶ شاهد هذا الهدف",
  bn: "▶ এই গোলটি দেখুন",
  hi: "▶ यह गोल देखें",
  ro: "▶ Uitează acest gol",
  uz: "▶ Shu golni ko‘ring",
};
{
  const dir = path.join(ROOT, "src", "i18n");
  for (const [lang, text] of Object.entries(WATCH)) {
    const f = path.join(dir, lang + ".js");
    let t = fs.readFileSync(f, "utf8");
    if (t.includes("watchGoal:")) { console.log(lang + ": already has watchGoal"); continue; }
    t = t.replace(/(\n\s*watchOn:)/, '\n  watchGoal: ' + JSON.stringify(text) + ',$1');
    fs.writeFileSync(f, t, "utf8");
    console.log(lang + ": watchGoal added");
  }
}

// ---------------------------------------------------------------------------
// 2. the birthday card: one row per goal, each with its own watch action
// ---------------------------------------------------------------------------
{
  const P = path.join(ROOT, "src", "app.js");
  let t = fs.readFileSync(P, "utf8");
  const EOL = t.includes("\r\n") ? "\r\n" : "\n";

  const find = `          const hasVideos = match.videos && match.videos.length > 0;
          const videoBtn = hasVideos
            ? \`<button type="button" class="bday-watch-video-btn" data-idx="\${matchIdx}">
                <svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                \${bDict.watchClip(match.videos.length)}
               </button>\`
            : \`<a href="https://www.youtube.com/results?search_query=Cristiano+Ronaldo+goal+vs+\${encodeURIComponent(match.opponent)}+\${match.date}" target="_blank" rel="noopener noreferrer" class="bday-yt-search-btn">
                \${bDict.searchYt}
               </a>\`;`;

  const replace = `          const hasVideos = match.videos && match.videos.length > 0;
          const videoBtn = hasVideos
            ? \`<button type="button" class="bday-watch-video-btn" data-idx="\${matchIdx}">
                <svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                \${bDict.watchClip(match.videos.length)}
               </button>\`
            : \`<a href="https://www.youtube.com/results?search_query=Cristiano+Ronaldo+goal+vs+\${encodeURIComponent(match.opponent)}+\${match.date}" target="_blank" rel="noopener noreferrer" class="bday-yt-search-btn">
                \${bDict.searchYt}
               </a>\`;

          // One row per goal. Every goal gets a watch action: the published
          // clip when the archive has one, otherwise a search for that exact
          // goal — so every goal on the page is watchable.
          const goalRows = (match.videos && match.videos.length ? match.videos : []).map((v, gi) => {
            const min = v.minute ? v.minute + "'" : (gi + 1) + "";
            const fin = v.finish || (match.types || [])[gi] || "";
            const q = encodeURIComponent("Cristiano Ronaldo goal vs " + match.opponent + " " + match.date + " " + (match.competition || ""));
            const watchUrl = "https://www.youtube.com/results?search_query=" + q;
            const archiveUrl = v.sourcePage || "";
            const watch = (v.videoUrl && v.kind === "clip")
              ? \`<button type="button" class="bday-goal-watch" data-idx="\${matchIdx}" data-gidx="\${gi}">\${MEDIA.watchGoal || "▶ Watch this goal"}</button>\`
              : \`<a class="bday-goal-watch" href="\${watchUrl}" target="_blank" rel="noopener noreferrer">\${MEDIA.watchGoal || "▶ Watch this goal"}</a>\`;
            const archive = archiveUrl
              ? \`<a class="bday-goal-archive" href="\${archiveUrl}" target="_blank" rel="noopener noreferrer" title="cr7allgoals.com">↗</a>\`
              : "";
            return \`<div class="bday-goal-row">
                <span class="bday-goal-min">⚽ \${esc(min)}</span>
                \${fin ? \`<span class="bday-goal-type">\${esc(fin)}</span>\` : ""}
                \${watch}\${archive}
              </div>\`;
          }).join("");
          const goalList = goalRows ? \`<div class="bday-goal-list">\${goalRows}</div>\` : "";`;

  if (!t.includes(find.split("\n").join(EOL))) {
    console.error("the card block not found");
    process.exit(1);
  }
  t = t.replace(find.split("\n").join(EOL), (find.split("\n").join(EOL)).replace(find, replace));

  // put the per-goal list on the card
  const cardFind = `              <div class="bday-goals-summary">
                <strong>\${bDict.goalSummary(match.goalsCount)}</strong>
                <div class="bday-minute-tags">\${minTags}</div>
                \${typeTags}
              </div>`;
  const cardReplace = `              <div class="bday-goals-summary">
                <strong>\${bDict.goalSummary(match.goalsCount)}</strong>
                <div class="bday-minute-tags">\${minTags}</div>
                \${typeTags}
              </div>
              \${goalList}`;
  if (!t.includes(cardFind.split("\n").join(EOL))) { console.error("the goals-summary block not found"); process.exit(1); }
  t = t.replace(cardFind.split("\n").join(EOL), cardReplace.split("\n").join(EOL));

  // a per-goal watch button opens the modal on that goal
  const clickFind = `      const watchBtn = e.target.closest(".bday-watch-video-btn");
      if (watchBtn) {
        const idx = +watchBtn.dataset.idx;
        const match = currentMatches[idx];
        if (match) {
          openGoalVideo(match, 0);
        }
        return;
      }`;
  const clickReplace = `      const watchBtn = e.target.closest(".bday-watch-video-btn");
      if (watchBtn) {
        const idx = +watchBtn.dataset.idx;
        const match = currentMatches[idx];
        if (match) {
          openGoalVideo(match, 0);
        }
        return;
      }

      const goalWatch = e.target.closest(".bday-goal-watch");
      if (goalWatch && goalWatch.tagName === "BUTTON") {
        const idx = +goalWatch.dataset.idx;
        const gidx = +(goalWatch.dataset.gidx || 0);
        const match = currentMatches[idx];
        if (match) openGoalVideo(match, gidx);
        return;
      }`;
  if (!t.includes(clickFind.split("\n").join(EOL))) { console.error("the click handler not found"); process.exit(1); }
  t = t.replace(clickFind.split("\n").join(EOL), clickReplace.split("\n").join(EOL));

  fs.writeFileSync(P, t, "utf8");
  console.log("ok  app.js: every goal now has its own watch action");
}

// ---------------------------------------------------------------------------
// 3. the styles for the new rows
// ---------------------------------------------------------------------------
{
  const P = path.join(ROOT, "src", "styles.css");
  let css = fs.readFileSync(P, "utf8");
  if (css.includes(".bday-goal-row")) { console.log("ok  styles.css already has the goal rows"); }
  else {
    css += `
/* ---------- birthday: per-goal watch rows ---------- */
.bday-goal-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid var(--line-soft);
}
.bday-goal-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 0.82rem;
}
.bday-goal-min {
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--ink);
  min-width: 52px;
}
.bday-goal-type {
  color: var(--muted);
  flex: 1 1 auto;
  min-width: 0;
}
.bday-goal-watch {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--brand-ink);
  background: var(--brand-soft);
  border: 1px solid var(--line);
  border-radius: 999px;
  text-decoration: none;
  cursor: pointer;
  white-space: nowrap;
}
.bday-goal-watch:hover { background: var(--brand); color: #fff; }
.bday-goal-archive {
  font-size: 0.8rem;
  color: var(--faint);
  text-decoration: none;
  padding: 2px 4px;
  border: 1px solid var(--line);
  border-radius: 4px;
}
.bday-goal-archive:hover { color: var(--brand); border-color: var(--brand); }
`;
    fs.writeFileSync(P, css, "utf8");
    console.log("ok  styles.css: the goal rows");
  }
}
