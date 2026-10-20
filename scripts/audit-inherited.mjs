import fs from "node:fs";
import path from "node:path";
const ROOT = "D:/Projects/ronaldo-stats/";
const PAGES = ["index", "dashboard", "goalsbyyear", "goalsbyseason", "timeline", "achievements",
  "birthday", "latest-goal", "champions-league", "gear", "real-madrid", "ronaldo-vs-messi"];

const strip = (s) => String(s || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

console.log("=== every page: title, h1, eyebrow, h2s ===\n");
for (const p of PAGES) {
  const t = fs.readFileSync(path.join(ROOT, p + ".html"), "utf8");
  const title = (t.match(/<title>([^<]*)<\/title>/) || [])[1];
  const h1 = strip(((t.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1] || ""));
  const eyebrow = strip(((t.match(/class="eyebrow">([\s\S]*?)<\/p>/) || [])[1] || ""));
  const h2 = [...t.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)].map((m) => strip(m[1]));
  console.log("--- " + p + " ---");
  console.log("  title   : " + title);
  console.log("  h1      : " + h1);
  console.log("  eyebrow : " + eyebrow);
  console.log("  h2      : " + h2.join(" | ").slice(0, 200));
}

console.log("\n\n=== the rail nav, in English ===");
const idx = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const rail = idx.slice(idx.indexOf('<aside class="rail"'), idx.indexOf("</aside>"));
for (const m of rail.matchAll(/<a[^>]*href="(\/en\/[a-z-]*)"[^>]*>(?:<svg[\s\S]*?<\/svg>)?\s*<span>([^<]*)<\/span>/g)) {
  console.log("  " + m[2].trim().padEnd(28) + m[1]);
}

console.log("\n\n=== every 'Messi' mention in the English shells ===");
for (const p of PAGES) {
  const t = fs.readFileSync(path.join(ROOT, p + ".html"), "utf8");
  const hits = [...t.matchAll(/[^<>]{0,70}Messi[^<>]{0,70}/g)].map((m) => m[0].replace(/\s+/g, " ").trim());
  if (hits.length) {
    console.log("  --- " + p + " (" + hits.length + ") ---");
    const uniq = [...new Set(hits)].slice(0, 6);
    uniq.forEach((h) => console.log("      " + h.slice(0, 130)));
  }
}
