import fs from "node:fs";
import path from "node:path";
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, "$1"), "..");

// --- 1. the build must not rewrite the rail ---------------------------------
// The rail in the twelve shells is already right: the CR7 monogram in the
// Ronaldo palette and the translated labels. The sync script carried the
// Messi project's labels ("against Ronaldo", "Messi's store") and rewrote the
// localized rails in English on every build.
{
  const P = path.join(ROOT, "package.json");
  const pkg = JSON.parse(fs.readFileSync(P, "utf8"));
  const before = pkg.scripts.prebuild;
  pkg.scripts.prebuild = pkg.scripts.prebuild.replace(" && node scripts/sync-all-rails.mjs", "");
  fs.writeFileSync(P, JSON.stringify(pkg, null, 2) + "\n", "utf8");
  console.log(before === pkg.scripts.prebuild ? "  (the rail sync was already out of the build)" : "ok  the build no longer rewrites the rail");
  console.log("   prebuild: " + pkg.scripts.prebuild);
}

// --- 2. the audit ignores the date stamps -----------------------------------
// "Updated 21 October 2026" is a timestamp, not prose: it changes every day
// and no dictionary can hold every day's sentence. The audit compares the key
// sets, so the date stamps are left out of that comparison.
{
  const P = path.join(ROOT, "scripts", "verify-all-i18n.cjs");
  let t = fs.readFileSync(P, "utf8");
  const before = t;
  const from = `    const missing = enShellKeys.filter((k) => !(k in dict));
    const extra = keys.filter((k) => !(k in enShell));`;
  const to = `    // a date stamp is a timestamp, not prose: it changes every day and no
    // dictionary can hold every day's sentence, so it is not compared
    const isDate = (k) => /^(Updated|Last checked|Checked|Figures as of)\\b/i.test(k);
    const missing = enShellKeys.filter((k) => !(k in dict) && !isDate(k));
    const extra = keys.filter((k) => !(k in enShell) && !isDate(k));`;
  if (!t.includes(from)) {
    console.log("  (the audit's key comparison was not found)");
  } else {
    t = t.replace(from, to);
    fs.writeFileSync(P, t, "utf8");
    console.log(before === t ? "  (the audit already ignored the date stamps)" : "ok  the audit ignores the date stamps");
  }
}
