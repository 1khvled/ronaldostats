import fs from "node:fs";
import path from "node:path";
const ROOT = "D:/Projects/ronaldo-stats/";
const LANGS = ["es", "pt", "fr", "ar", "bn", "hi", "ro", "uz"];
const PAGES = ["index", "dashboard", "goalsbyyear", "goalsbyseason", "timeline", "trophies",
  "birthday", "latest-goal", "champions-league", "gear", "real-madrid", "ronaldo-vs-messi"];

const files = [];
for (const p of PAGES) files.push(p + ".html");
for (const l of LANGS) for (const p of PAGES) files.push(l + "/" + p + ".html");

const refs = new Map();
let missingRef = 0;
for (const f of files) {
  const t = fs.readFileSync(path.join(ROOT, f), "utf8");
  for (const m of t.matchAll(/(?:src|href)="(\/img\/[^"]+)"/g)) {
    refs.set(m[1], (refs.get(m[1]) || 0) + 1);
  }
  for (const m of t.matchAll(/(?:src|href)="(\/img\/[^"]+)"/g)) {
    const p = path.join(ROOT, "public", m[1].replace(/^\//, ""));
    if (!fs.existsSync(p)) { console.log("MISSING", m[1], "referenced by", f); missingRef++; }
  }
}
console.log("=== referenced images ===");
for (const [img, n] of [...refs].sort((a, b) => a[0].localeCompare(b[0]))) {
  const p = path.join(ROOT, "public", img.replace(/^\//, ""));
  const ok = fs.existsSync(p);
  const kb = ok ? Math.round(fs.statSync(p).size / 1024) : 0;
  console.log(`  ${ok ? "ok " : "MISS"} ${img.padEnd(44)} ${String(n).padStart(3)} refs ${String(kb).padStart(4)} KB`);
}
console.log(missingRef === 0 ? "OK: every referenced image exists" : `PROBLEM: ${missingRef} broken references`);

// any file on disk nobody references (and not a manifest/credit sheet)
const onDisk = [];
const walk = (dir) => {
  for (const e of fs.readdirSync(path.join(ROOT, "public", dir), { withFileTypes: true })) {
    const rel = path.posix.join(dir, e.name);
    if (e.isDirectory()) walk(rel);
    else onDisk.push("/img/" + rel);
  }
};
walk("img");
const orphans = onDisk.filter((f) => !refs.has(f) && !/CREDITS|manifest|favicon|apple-touch|og-|logo-|site\.webmanifest/.test(f));
console.log("\n=== files on disk that no page references ===");
for (const o of orphans) console.log("  " + o);
