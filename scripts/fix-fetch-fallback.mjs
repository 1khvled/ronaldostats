import fs from "node:fs";
import path from "node:path";
const P = "D:/Projects/ronaldo-stats/scripts/extract-goal-calendar.mjs";
let t = fs.readFileSync(P, "utf8");
const before = t;

// the inputs the build needs are cached in the repository, so a build that
// cannot reach the network still works
t = t.replace(
  'const TMP = path.join(os.tmpdir(), "ronaldostats-build") + path.sep;',
  'const TMP = path.join(os.tmpdir(), "ronaldostats-build") + path.sep;\n' +
  '// the fetched inputs are kept in the repository: a build that cannot reach\n' +
  '// the network (a Vercel deploy, a rate-limited source) still works\n' +
  'const CACHE = path.join(path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."), "build-cache") + path.sep;\n' +
  'fs.mkdirSync(TMP, { recursive: true });'
);

t = t.replace(
  `for (const [name, url] of Object.entries(GH)) {
  const p = TMP + name;
  if (existsSync(p)) continue;
  const r = await fetch(url, { headers: { "User-Agent": "ronaldostats/1.0 (data build)" } });
  if (!r.ok) { console.error("could not fetch " + name + " (" + r.status + ")"); process.exit(1); }
  writeFileSync(p, await r.text(), "utf8");
  console.log("fetched " + name);
}`,
  `for (const [name, url] of Object.entries(GH)) {
  const p = TMP + name;
  if (existsSync(p)) continue;
  let text = null;
  try {
    const r = await fetch(url, { headers: { "User-Agent": "ronaldostats/1.0 (data build)" } });
    if (r.ok) text = await r.text();
    else console.warn("could not fetch " + name + " (" + r.status + ")");
  } catch (e) {
    console.warn("could not fetch " + name + ": " + e.message);
  }
  if (!text) {
    const cached = CACHE + name;
    if (!existsSync(cached)) { console.error("no cached copy of " + name + " either"); process.exit(1); }
    text = fs.readFileSync(cached, "utf8");
    console.log("using the cached " + name);
  }
  writeFileSync(p, text, "utf8");
}`
);

t = t.replace(
  `if (!existsSync(TMP + "cr-rsssf.html")) {
  const r = await fetch("https://www.rsssf.org/miscellaneous/cronaldo-intlg.html", { headers: { "User-Agent": "ronaldostats/1.0 (data build)" } });
  if (!r.ok) { console.error("could not fetch RSSSF (" + r.status + ")"); process.exit(1); }
  writeFileSync(TMP + "cr-rsssf.html", await r.text(), "utf8");
  console.log("fetched cr-rsssf.html");
}`,
  `if (!existsSync(TMP + "cr-rsssf.html")) {
  let text = null;
  try {
    const r = await fetch("https://www.rsssf.org/miscellaneous/cronaldo-intlg.html", { headers: { "User-Agent": "ronaldostats/1.0 (data build)" } });
    if (r.ok) text = await r.text();
    else console.warn("could not fetch RSSSF (" + r.status + ")");
  } catch (e) {
    console.warn("could not fetch RSSSF: " + e.message);
  }
  if (!text) {
    const cached = CACHE + "cr-rsssf.html";
    if (!existsSync(cached)) { console.error("no cached copy of the RSSSF page either"); process.exit(1); }
    text = fs.readFileSync(cached, "utf8");
    console.log("using the cached cr-rsssf.html");
  }
  writeFileSync(TMP + "cr-rsssf.html", text, "utf8");
}`
);

fs.writeFileSync(P, t, "utf8");
console.log(before === t ? "  (nothing changed)" : "ok  the calendar build falls back to the cached inputs");
console.log("   the cache fallback: " + (t.includes("using the cached") ? "in place" : "MISSING"));
