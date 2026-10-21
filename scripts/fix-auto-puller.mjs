import fs from "node:fs";
const P = "D:/Projects/ronaldo-stats/scripts/auto-sync-latest-goal.mjs";
let t = fs.readFileSync(P, "utf8").replace(/\r\n/g, "\n");
const before = t;

// The auto-puller refreshes the feed the page reads. It must not rewrite the
// page's copy: the copy in scripts/sync-latest-goal-html.mjs is the Messi
// project's, and running it put "Inter Miami", "1,179 appearances" and the
// wrong goal total into the Ronaldo pages on every run.
t = t.replace('import { syncLatestGoalHtml } from "./sync-latest-goal-html.mjs";\n', "");
t = t.replace(/\n *try \{\n *syncLatestGoalHtml\(\);\n *\} catch \(err\) \{\n *console\.warn\("syncLatestGoalHtml error:", err\.message\);\n *\}\n/g, "\n");
t = t.replace(/\n *syncLatestGoalHtml\(\);\n/g, "\n");

// the national team is Portugal
t = t.replace('team: newlyFoundGoal.isPortugal ? "Argentina" : "Al Nassr",', 'team: newlyFoundGoal.isPortugal ? "Portugal" : "Al Nassr",');
t = t.replace('const title = newlyFoundGoal.isPortugal\n          ? `Argentina ${newlyFoundGoal.score} ${newlyFoundGoal.opponent}`\n          : `Inter Miami ${newlyFoundGoal.score} ${newlyFoundGoal.opponent}`;',
  'const title = newlyFoundGoal.isPortugal\n          ? `Portugal ${newlyFoundGoal.score} ${newlyFoundGoal.opponent}`\n          : `Al Nassr ${newlyFoundGoal.score} ${newlyFoundGoal.opponent}`;');

fs.writeFileSync(P, t.replace(/\n/g, "\r\n"), "utf8");
console.log(before === t ? "  (nothing changed)" : "ok  the auto-puller refreshes the feed and leaves the page's copy alone");
console.log("   the page sync is gone: " + !/syncLatestGoalHtml/.test(t));
console.log("   the Messi's club names are gone: " + !/Inter Miami|"Argentina"/.test(t));
