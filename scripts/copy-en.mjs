import fs from "fs";
import path from "path";

const dist = "./dist";
const enDir = path.join(dist, "en");

if (!fs.existsSync(enDir)) {
  fs.mkdirSync(enDir, { recursive: true });
}

const htmlPages = [
  "index.html",
  "goalsbyyear.html",
  "goalsbyseason.html",
  "dashboard.html",
  "timeline.html",
  "trophies.html",
  "real-madrid.html",
  "ronaldo-vs-messi.html",
  "champions-league.html",
  "gear.html",
];

for (const p of htmlPages) {
  const src = path.join(dist, p);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(enDir, p));
  }
}

console.log("copy-en: successfully mirrored HTML pages to dist/en/");
