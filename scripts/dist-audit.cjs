// One-shot dist audit. Run: node scripts/dist-audit.cjs
const fs = require("fs");
const dist = "./dist";
const must = ["index.html", "goalsbyyear.html", "goalsbyseason.html", "dashboard.html",
  "timeline.html", "achievements.html", "birthday.html", "vs-real-madrid.html", "ronaldo-vs-messi.html", "champions-league.html", "latest-goal.html",
  "es/index.html", "es/birthday.html", "es/latest-goal.html", "pt/index.html", "fr/index.html", "ar/index.html", "bn/index.html", "hi/index.html", "ro/index.html", "uz/index.html",
  "404.html", "sitemap.xml", "robots.txt", "llms.txt", "18188f5363f745f1bbf821767e0f0daf.txt",
  "data/ronaldo-data.json", "data/birthday-goals.json", "data/messi.json", "data/latest-goal.json",
  "fonts/dm-sans-latin.woff2", "img/og-ronaldo.jpg", "img/og-ronaldo.webp",
  "img/era/era-2008-ballon1.webp", "img/teams/real-madrid.png",
  "img/teams/man-utd.png", "img/teams/juventus.png", "img/teams/al-nassr.png", "img/teams/sporting.png",
  "img/teams/portugal.png", "favicon.svg", "favicon.ico", "favicon-48x48.png",
  // the Ronaldo photograph set: five cabinet shots, eight product photos and
  // the head-to-head card, all sourced from Wikimedia Commons
  "img/cab-ballon.webp", "img/cab-copa.webp", "img/cab-liga.webp", "img/cab-ucl.webp", "img/cab-wc.webp",
  "img/ronaldo-vs-messi.webp", "img/CREDITS.md",
  "img/gear/ronaldo-home-jersey.jpg", "img/gear/ronaldo-away-jersey.jpg", "img/gear/ronaldo-cape-jersey.jpg",
  "img/gear/ronaldo-boot.jpg", "img/gear/ronaldo-ball.jpg", "img/gear/ronaldo-hoodie.jpg",
  "img/gear/ronaldo-cap.jpg", "img/gear/ronaldo-poster.jpg",
  "apple-touch-icon.png", "site.webmanifest", "img/logo.png", "img/ronaldo-450.webp"];
let ok = true;
for (const f of must) {
  if (!fs.existsSync(dist + "/" + f)) { ok = false; console.log("MISSING " + f); }
}
for (const p of ["index.html", "goalsbyyear.html", "goalsbyseason.html", "dashboard.html", "timeline.html", "achievements.html", "birthday.html", "vs-real-madrid.html", "ronaldo-vs-messi.html", "champions-league.html", "latest-goal.html", "es/index.html", "es/birthday.html", "es/latest-goal.html", "pt/index.html", "fr/index.html", "ar/index.html", "bn/index.html", "hi/index.html", "ro/index.html", "uz/index.html"]) {
  const s = fs.readFileSync(dist + "/" + p, "utf8");
  if (!s.includes('class="skip"') || !s.includes('id="main"')) { ok = false; console.log("NO SKIP in " + p); }
  if (!s.includes('G-FERBLJWWWZ')) { ok = false; console.log("NO GTAG in " + p); }
}
const d = JSON.parse(fs.readFileSync(dist + "/data/ronaldo-data.json", "utf8"));
const totalGoalsStr = String(d.totals?.combined?.goals || 981);
const bnDigits = ["\u09E6", "\u09E7", "\u09E8", "\u09E9", "\u09EA", "\u09EB", "\u09EC", "\u09ED", "\u09EE", "\u09EF"];
const bnGoalsStr = totalGoalsStr.split("").map((c) => bnDigits[c] || c).join("");
for (const p of ["index.html", "es/index.html", "pt/index.html", "fr/index.html", "ar/index.html", "bn/index.html", "hi/index.html", "ro/index.html", "uz/index.html"]) {
  const s = fs.readFileSync(dist + "/" + p, "utf8");
  const hasGoals = s.includes(totalGoalsStr) || (p.startsWith("bn/") && s.includes(bnGoalsStr));
  if (!s.includes('id="ronaldo-total-goals"') || !hasGoals) {
    ok = false;
    console.log("MISSING ground-truth " + totalGoalsStr + " goals in " + p);
  }
}
const jsFiles = fs.readdirSync(dist + "/assets").filter((f) => f.endsWith(".js"));
const b = jsFiles.map((f) => fs.readFileSync(dist + "/assets/" + f, "utf8")).join("\n");
for (const needle of ["copyStats", "replaceState", "btn-primary"]) {
  if (!b.includes(needle)) { ok = false; console.log("JS MISSING " + needle); }
}
// there may be more than one CSS bundle (the gear page has its own), so
// check the main styles bundle and fall back to all of them
const cssFiles = fs.readdirSync(dist + "/assets").filter((f) => f.endsWith(".css"));
const c = cssFiles.map((f) => fs.readFileSync(dist + "/assets/" + f, "utf8")).join("\n");
for (const needle of [".skip", "@media print", ".btn-primary"]) {
  if (!c.includes(needle)) { ok = false; console.log("CSS MISSING " + needle); }
}
// 404 must be self-contained (no src/ link, which never exists in dist)
const nf = fs.readFileSync(dist + "/404.html", "utf8");
if (nf.includes('href="src/styles.css"')) { ok = false; console.log("404 still links src/styles.css"); }
const sum = (a) => a.reduce((x, r) => x + r.goals, 0);
console.log("dist sums:", sum(d.calendarYears), sum(d.byCompetition), sum(d.byBodyPart));
console.log(ok ? "ALL DIST CHECKS PASS" : "DIST CHECKS FAILED");
process.exit(ok ? 0 : 1);
