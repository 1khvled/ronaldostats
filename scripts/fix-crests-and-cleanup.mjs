import fs from "node:fs";
import path from "node:path";
const ROOT = "D:/Projects/ronaldo-stats/";
const PAGES = ["index", "dashboard", "goalsbyyear", "goalsbyseason", "timeline", "achievements",
  "birthday", "latest-goal", "champions-league", "gear", "vs-real-madrid", "ronaldo-vs-messi"];

// ---------------------------------------------------------------------------
// 1. the club crests used a page-relative path, so on /en/dashboard the
//    browser asked for /en/img/teams/real-madrid.png and got a 404. Every
//    crest was therefore broken on every page except the site root.
// ---------------------------------------------------------------------------
{
  const P = path.join(ROOT, "src", "app.js");
  let t = fs.readFileSync(P, "utf8");
  const before = t;
  t = t.replace(/src="img\/teams\//g, 'src="/img/teams/');
  t = t.replace(/crest: "img\/teams\//g, 'crest: "/img/teams/');
  fs.writeFileSync(P, t, "utf8");
  console.log(before === t ? "app.js: crests already absolute" : "ok  app.js: the crest paths are absolute");
}
{
  let n = 0;
  for (const p of PAGES) {
    const f = path.join(ROOT, p + ".html");
    let t = fs.readFileSync(f, "utf8");
    const before = t;
    t = t.replace(/src="img\/teams\//g, 'src="/img/teams/');
    if (t !== before) { fs.writeFileSync(f, t, "utf8"); n++; }
  }
  console.log("ok  " + n + " shells: the crest paths are absolute");
}

// ---------------------------------------------------------------------------
// 2. delete what the Messi project left behind that nothing references
// ---------------------------------------------------------------------------
const MESSI_GEAR = [
  "adilette-slides.jpg", "agility-cones.jpg", "argentina-away.jpg", "argentina-home.jpg",
  "barca-2011.jpg", "biography-book.jpg", "f50-cleats.jpg", "framed-canvas.jpg",
  "hoodie.jpg", "inter-miami-away.jpg", "inter-miami-home.jpg", "kids-kit.jpg",
  "popup-goal.jpg", "samba-turf.jpg", "snapback-cap.jpg", "track-jacket.jpg",
  "training-ball.jpg", "wc-trophy.jpg",
];
let deleted = 0;
for (const f of MESSI_GEAR) {
  const p = path.join(ROOT, "public", "img", "gear", f);
  if (fs.existsSync(p)) { fs.unlinkSync(p); deleted++; }
}
console.log("ok  " + deleted + " Messi's gear photos deleted");

for (const f of ["messi-clasico.webp", "ronaldo.webp"]) {
  const p = path.join(ROOT, "public", "img", f);
  if (fs.existsSync(p)) { fs.unlinkSync(p); console.log("ok  deleted " + f); }
}
for (const f of ["barcelona.png", "argentina.png", "miami.png", "psg.png"]) {
  const p = path.join(ROOT, "public", "img", "teams", f);
  if (fs.existsSync(p)) { fs.unlinkSync(p); console.log("ok  deleted teams/" + f); }
}
