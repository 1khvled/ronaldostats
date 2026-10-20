import fs from "node:fs";
import path from "node:path";
const ROOT = "D:/Projects/ronaldo-stats";
const PAGES = ["index", "dashboard", "goalsbyyear", "goalsbyseason", "timeline", "achievements", "birthday", "latest-goal", "champions-league", "gear", "real-madrid", "ronaldo-vs-messi"];
for (const p of PAGES) {
  const f = path.join(ROOT, p + ".html");
  const before = fs.readFileSync(f, "utf8");
  const after = before.replace(/<meta name="geo\.placename" content="[^"]*" \/>/g, '<meta name="geo.placename" content="Funchal, Madeira, Portugal" />');
  if (after !== before) { fs.writeFileSync(f, after, "utf8"); console.log("geo fixed " + p + ".html"); }
}
const values = new Set();
for (const p of PAGES) {
  const t = fs.readFileSync(path.join(ROOT, p + ".html"), "utf8");
  for (const m of t.matchAll(/<meta name="geo\.placename" content="([^"]*)"/g)) values.add(m[1]);
}
console.log("geo.placename values now:", [...values].join(" | "));
