import fs from "node:fs";
import path from "node:path";
const P = "D:/Projects/ronaldo-stats/src/app.js";
let t = fs.readFileSync(P, "utf8");
const EOL = t.includes("\r\n") ? "\r\n" : "\n";

if (t.includes("const goalRows = (match.videos")) {
  console.log("ok  app.js: the goal rows are already defined");
  process.exit(0);
}

const anchorLines = [
  `          const hasVideos = match.videos && match.videos.length > 0;`,
];
const anchor = anchorLines.join(EOL);
if (!t.includes(anchor)) { console.error("anchor not found"); process.exit(1); }

const block = [
  `          // One row per goal. Every goal gets a watch action: the published`,
  `          // clip when the archive has one, otherwise a search for that exact`,
  `          // goal — so every goal on the page is watchable.`,
  `          const goalRows = (match.videos && match.videos.length ? match.videos : []).map((v, gi) => {`,
  `            const min = v.minute ? v.minute + "'" : (gi + 1) + "";`,
  `            const fin = v.finish || (match.types || [])[gi] || "";`,
  `            const q = encodeURIComponent("Cristiano Ronaldo goal vs " + match.opponent + " " + match.date + " " + (match.competition || ""));`,
  `            const watchUrl = "https://www.youtube.com/results?search_query=" + q;`,
  `            const archiveUrl = v.sourcePage || "";`,
  `            const watch = (v.videoUrl && v.kind === "clip")`,
  `              ? \`<button type="button" class="bday-goal-watch" data-idx="\${matchIdx}" data-gidx="\${gi}">\${MEDIA.watchGoal || "▶ Watch this goal"}</button>\``,
  `              : \`<a class="bday-goal-watch" href="\${watchUrl}" target="_blank" rel="noopener noreferrer">\${MEDIA.watchGoal || "▶ Watch this goal"}</a>\`;`,
  `            const archive = archiveUrl`,
  `              ? \`<a class="bday-goal-archive" href="\${archiveUrl}" target="_blank" rel="noopener noreferrer" title="cr7allgoals.com">↗</a>\``,
  `              : "";`,
  `            return \`<div class="bday-goal-row">`,
  `                <span class="bday-goal-min">⚽ \${esc(min)}</span>`,
  `                \${fin ? \`<span class="bday-goal-type">\${esc(fin)}</span>\` : ""}`,
  `                \${watch}\${archive}`,
  `              </div>\`;`,
  `          }).join("");`,
  `          const goalList = goalRows ? \`<div class="bday-goal-list">\${goalRows}</div>\` : "";`,
  ``,
];

t = t.replace(anchor, block.join(EOL) + anchor);
fs.writeFileSync(P, t, "utf8");
console.log("ok  app.js: the per-goal rows are defined");
