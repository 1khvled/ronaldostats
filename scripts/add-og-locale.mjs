import fs from "node:fs";
import path from "node:path";
const ROOT = "D:/Projects/ronaldo-stats/";
const PAGES = ["index", "dashboard", "goalsbyyear", "goalsbyseason", "timeline", "achievements",
  "birthday", "latest-goal", "champions-league", "gear", "real-madrid", "ronaldo-vs-messi"];
let added = 0;
for (const p of PAGES) {
  const f = path.join(ROOT, p + ".html");
  let t = fs.readFileSync(f, "utf8");
  if (t.includes('property="og:locale"')) continue;
  // insert it right after og:site_name
  const re = /(<meta[^>]*property="og:site_name"[^>]*>)/i;
  if (!re.test(t)) { console.log("no og:site_name in " + p + ".html"); continue; }
  t = t.replace(re, '$1\r\n<meta content="en_US" property="og:locale"/>');
  fs.writeFileSync(f, t, "utf8");
  added++;
  console.log("og:locale added to " + p + ".html");
}
console.log("added " + added);
