import fs from "node:fs";
import path from "node:path";
const ROOT = "D:/Projects/ronaldo-stats/";
const LANGS = ["es", "pt", "fr", "ar", "bn", "hi", "ro", "uz"];
const PAGES = ["index", "dashboard", "goalsbyyear", "goalsbyseason", "timeline", "achievements",
  "birthday", "latest-goal", "champions-league", "gear", "real-madrid", "ronaldo-vs-messi"];

const files = [];
for (const p of PAGES) files.push(p + ".html");
for (const l of LANGS) for (const p of PAGES) files.push(l + "/" + p + ".html");
for (const f of fs.readdirSync(path.join(ROOT, "src"))) if (f.endsWith(".js") || f.endsWith(".css")) files.push("src/" + f);
for (const f of fs.readdirSync(path.join(ROOT, "public", "data"))) files.push("public/data/" + f);
for (const f of fs.readdirSync(path.join(ROOT, "scripts"))) if (f.endsWith(".mjs")) files.push("scripts/" + f);

const refs = new Map();
for (const f of files) {
  const p = path.join(ROOT, f);
  if (!fs.existsSync(p)) continue;
  const t = fs.readFileSync(p, "utf8");
  for (const m of t.matchAll(/\/img\/[A-Za-z0-9_\-./]+/g)) {
    const k = m[0];
    if (!refs.has(k)) refs.set(k, new Set());
    refs.get(k).add(f);
  }
}

const onDisk = [];
const walk = (rel) => {
  const dir = path.join(ROOT, "public", rel);
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const r = rel ? rel + "/" + e.name : e.name;
    if (e.isDirectory()) walk(r);
    else onDisk.push("/" + r);
  }
};
walk("img");

console.log("=== files on disk that NOTHING references ===");
const dead = [];
for (const f of onDisk.sort()) {
  if (!refs.has(f)) { dead.push(f); console.log("  " + f); }
}
console.log("\ntotal unreferenced:", dead.length);
fs.writeFileSync("D:/Projects/ronaldo-stats/scripts/.dead-images.txt", dead.join("\n") + "\n", "utf8");
