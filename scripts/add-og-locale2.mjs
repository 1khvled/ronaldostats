import fs from "node:fs";
import path from "node:path";
const ROOT = "D:/Projects/ronaldo-stats/";
for (const p of ["birthday", "latest-goal"]) {
  const f = path.join(ROOT, p + ".html");
  let t = fs.readFileSync(f, "utf8");
  if (t.includes('property="og:locale"')) continue;
  // anchor on og:title, which every page carries
  const re = /(<meta[^>]*property="og:title"[^>]*>)/i;
  if (!re.test(t)) { console.log("no og:title in " + p + ".html"); continue; }
  t = t.replace(re, '$1\r\n<meta content="en_US" property="og:locale"/>');
  fs.writeFileSync(f, t, "utf8");
  console.log("og:locale added to " + p + ".html");
}
