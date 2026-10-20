import fs from "node:fs";
import path from "node:path";
const P = path.join("D:/Projects/ronaldo-stats/", "latest-goal.html");
let t = fs.readFileSync(P, "utf8");

const OLD = "<b>Text record, not a video.</b> RonaldoStats does not host, embed or stream match footage. The panel below is the published record of the goal: number, date, opponent, competition, score, minute, finish type and career total. Where a scoreline is not published it is shown as an em dash.";
const NEW = "<b>Watch the goal.</b> RonaldoStats does not host the footage, but it links to it: the clip the CR7 goal archive publishes for this goal, the video of every goal of that season, and a search for the goal itself — and it plays the clips it can, in the player above. The panel below is the published record: number, date, opponent, competition, score, minute, finish type and career total. Where a scoreline is not published it is shown as an em dash.";

if (t.includes(OLD)) {
  t = t.split(OLD).join(NEW);
  fs.writeFileSync(P, t, "utf8");
  console.log("ok  latest-goal.html: the panel now points to the video");
} else {
  console.log("  (already updated)");
}
