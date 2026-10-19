import fs from "node:fs";
import path from "node:path";
const P = "D:/Projects/ronaldo-stats/scripts/dist-audit.cjs";
let t = fs.readFileSync(P, "utf8");
const before = t;

// the Messi-era asset list -> the Ronaldo one
t = t.replace(
  '"img/era-2008-olympic.webp", "img/teams/barcelona.png", "favicon.svg", "favicon.ico", "favicon-48x48.png",',
  '"img/era/era-2008-ballon1.webp", "img/teams/barcelona.png", "img/teams/real-madrid.png",\n  "img/teams/man-utd.png", "img/teams/juventus.png", "img/teams/al-nassr.png", "img/teams/sporting.png",\n  "img/teams/portugal.png", "favicon.svg", "favicon.ico", "favicon-48x48.png",'
);
t = t.replace(
  '"data/ronaldo-data.json", "data/birthday-goals.json", "fonts/dm-sans-latin.woff2", "img/og-ronaldo.jpg",',
  '"data/ronaldo-data.json", "data/birthday-goals.json", "data/messi.json", "data/latest-goal.json",\n  "fonts/dm-sans-latin.woff2", "img/og-ronaldo.jpg", "img/og-ronaldo.webp",'
);
// the ground-truth total must be Ronaldo's, and the id is the Ronaldo one
t = t.replace(/const totalGoalsStr = String\(d\.totals\?\.combined\?\.goals \|\| 931\);/, 'const totalGoalsStr = String(d.totals?.combined?.goals || 981);');
t = t.replace(/if \(!s\.includes\('id="ronaldo-total-goals"'\)/, 'if (!s.includes(\'id="ronaldo-total-goals"\')');
// the bn digit table was mangled by the brand migration; rebuild it
t = t.replace(/const bnDigits = \[[^\]]*\];/, 'const bnDigits = ["\\u09E6", "\\u09E7", "\\u09E8", "\\u09E9", "\\u09EA", "\\u09EB", "\\u09EC", "\\u09ED", "\\u09EE", "\\u09EF"];');

if (t === before) { console.error("no change applied"); process.exit(1); }
fs.writeFileSync(P, t, "utf8");
console.log("dist-audit.cjs updated for the Ronaldo asset set");
