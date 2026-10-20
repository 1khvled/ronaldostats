import fs from "node:fs";
import path from "node:path";
const ROOT = "D:/Projects/ronaldo-stats/";
const LANGS = ["es", "pt", "fr", "ar", "bn", "hi", "ro", "uz"];

// the page's own files still carry the old slug in their canonical and
// hreflang URLs
for (const l of ["", ...LANGS]) {
  const f = path.join(ROOT, l, "real-madrid.html");
  if (!fs.existsSync(f)) continue;
  const before = fs.readFileSync(f, "utf8");
  if (!before.includes("vs-real-madrid")) { console.log("  " + (l || "en") + ": already clean"); continue; }
  fs.writeFileSync(f, before.split("vs-real-madrid").join("real-madrid"), "utf8");
  console.log("  " + (l || "en") + ": the canonical and hreflang URLs are updated");
}

// the dev server's route map
{
  const P = path.join(ROOT, "vite.config.js");
  let t = fs.readFileSync(P, "utf8");
  const before = t;
  t = t.split("'vs-real-madrid'").join("'real-madrid'");
  t = t.split("vs-real-madrid.html").join("real-madrid.html");
  t = t.split("vs_real_madrid:").join("real_madrid:");
  fs.writeFileSync(P, t, "utf8");
  console.log(before === t ? "ok  vite.config.js: already updated" : "ok  vite.config.js: the route map is updated");
}

// the documentation
{
  const docs = {
    "README.md": [
      ["| El Clásico | `/vs-real-madrid` |", "| Real Madrid years | `/real-madrid` |"],
    ],
    "docs/content-spec.md": [
      ["| vs Real Madrid | `vs-real-madrid.html` | `vs-real-madrid` | |", "| Real Madrid years | `real-madrid.html` | `real-madrid` | |"],
    ],
    "X_POSTS_SCHEDULE.md": [
      ["https://www.ronaldostats.site/en/vs-real-madrid", "https://www.ronaldostats.site/en/real-madrid"],
    ],
  };
  for (const [f, pairs] of Object.entries(docs)) {
    const P = path.join(ROOT, f);
    if (!fs.existsSync(P)) { console.log("  " + f + ": not found"); continue; }
    let t = fs.readFileSync(P, "utf8");
    let n = 0;
    for (const [a, b] of pairs) { if (t.includes(a)) { t = t.split(a).join(b); n++; } }
    fs.writeFileSync(P, t, "utf8");
    console.log("ok  " + f + ": " + n + " references updated");
  }
}
