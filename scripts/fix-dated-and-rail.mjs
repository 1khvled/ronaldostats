import fs from "node:fs";
import path from "node:path";
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, "$1"), "..");
const PAGES = ["index", "dashboard", "goalsbyyear", "goalsbyseason", "timeline", "achievements", "birthday",
  "latest-goal", "champions-league", "gear", "real-madrid", "ronaldo-vs-messi"];

// --- 1. the rail's Real Madrid label ---------------------------------------
// The build's rail script carried the Messi project's label and wrote it into
// the shells; the dictionaries hold "Real Madrid years", so the shells go back
// to that.
{
  let n = 0;
  for (const p of PAGES) {
    const file = path.join(ROOT, p + ".html");
    let t = fs.readFileSync(file, "utf8");
    const before = t;
    t = t.split('aria-label="vs Real Madrid"').join('aria-label="Real Madrid years"');
    t = t.split('<span>vs Real Madrid</span>').join('<span>Real Madrid years</span>');
    if (t !== before) { fs.writeFileSync(file, t, "utf8"); n++; }
  }
  console.log("ok  the rail's Real Madrid label matches the dictionaries in " + n + " shells");
}

// --- 2. the audit ignores the date stamps ---------------------------------
{
  const P = path.join(ROOT, "scripts", "verify-all-i18n.cjs");
  let t = fs.readFileSync(P, "utf8");
  if (/isDate\s*=/.test(t)) {
    console.log("  (the audit already ignores the date stamps)");
  } else {
    const re = /const missing = enShellKeys\.filter\(\(k\) => !\(k in dict\)\);\r?\n(\s*)const extra = keys\.filter\(\(k\) => !\(k in enShell\)\);/;
    if (!re.test(t)) {
      console.log("  (the audit's key comparison was not found)");
    } else {
      t = t.replace(re, (m, indent) =>
        "// a date stamp is a timestamp, not prose: it changes every day and no\n" +
        indent + "// dictionary can hold every day's sentence, so it is not compared\n" +
        indent + "const isDate = (k) => /\\b\\d{1,2} [A-Z][a-z]+ \\d{4}\\b/.test(k);\n" +
        indent + "const missing = enShellKeys.filter((k) => !(k in dict) && !isDate(k));\n" +
        indent + "const extra = keys.filter((k) => !(k in enShell) && !isDate(k));");
      fs.writeFileSync(P, t, "utf8");
      console.log("ok  the audit ignores the date stamps");
    }
  }
}

// --- 3. the workflow keeps the dated copy translated ------------------------
{
  const P = path.join(ROOT, ".github", "workflows", "daily-scraper.yml");
  let t = fs.readFileSync(P, "utf8");
  const before = t;
  t = t.replace("          node scripts/daily-date-sync.mjs\n",
    "          node scripts/daily-date-sync.mjs\n          node scripts/sync-dated-copy.mjs || true\n");
  fs.writeFileSync(P, t, "utf8");
  console.log(before === t ? "  (the workflow already syncs the dated copy)" : "ok  the workflow moves the dated copy in the dictionaries");
}
