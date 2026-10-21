/**
 * Make the build chain portable.
 *
 *   node scripts/fix-build-paths.mjs
 *
 * The build scripts pointed at this machine's directories:
 *
 *   const ROOT = "D:/Projects/ronaldo-stats";
 *   const TMP  = "C:/Users/Abdelli/AppData/Local/Temp/opencode/";
 *
 * A Vercel build runs in its own directory on Linux, so both of those break
 * the deployment. The build chain now finds the repository from the script's
 * own location and works in a temporary directory of the operating system's
 * making.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, "$1"), "..");

// the file, the line to replace, and the replacement
const PATCHES = [
  ["build-birthday-goals.mjs",
    'const OUT = path.resolve("D:/Projects/ronaldo-stats/public/data/birthday-goals.json");\nconst TMP = "C:/Users/Abdelli/AppData/Local/Temp/opencode/";',
    'const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");\nconst OUT = path.join(ROOT, "public", "data", "birthday-goals.json");\nconst TMP = path.join(os.tmpdir(), "ronaldostats-build") + path.sep;'],
  ["build-birthday-goals.mjs",
    'const CANON = JSON.parse(fs.readFileSync("D:/Projects/ronaldo-stats/public/data/ronaldo-data.json", "utf8"));',
    'const CANON = JSON.parse(fs.readFileSync(path.join(ROOT, "public", "data", "ronaldo-data.json"), "utf8"));'],
  ["extract-goal-calendar.mjs",
    'const TMP = "C:/Users/Abdelli/AppData/Local/Temp/opencode/";',
    'const TMP = path.join(os.tmpdir(), "ronaldostats-build") + path.sep;'],
  ["rebuild-tracker-input.mjs",
    'const TMP = "C:/Users/Abdelli/AppData/Local/Temp/opencode/";',
    'const TMP = path.join(os.tmpdir(), "ronaldostats-build") + path.sep;'],
  ["build-ronaldo-data.mjs",
    'const OUT = path.resolve("D:/Projects/ronaldo-stats/public/data/ronaldo-data.json");',
    'const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");\nconst OUT = path.join(ROOT, "public", "data", "ronaldo-data.json");'],
  ["build-latest-goal.mjs",
    'const ROOT = "D:/Projects/ronaldo-stats";',
    'const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");'],
  ["extract-shell-strings.mjs",
    'const ROOT = path.resolve("D:/Projects/ronaldo-stats");',
    'const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");'],
  ["generate-i18n-pages.mjs",
    'const ROOT = path.resolve("D:/Projects/ronaldo-stats");',
    'const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");'],
  ["merge-goal-source.mjs",
    'const ROOT = "D:/Projects/ronaldo-stats";',
    'const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");'],
  ["build-llms.mjs",
    'const ROOT = "D:/Projects/ronaldo-stats";',
    'const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");'],
  ["check-i18n-modules.mjs",
    'const dir = "D:/Projects/ronaldo-stats/src/i18n";',
    'const dir = path.join(path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."), "src", "i18n");'],
  ["check-i18n-modules.mjs",
    'const tmp = `C:/Users/Abdelli/AppData/Local/Temp/opencode/chk-${lang}.mjs`;',
    'const tmp = path.join(os.tmpdir(), `chk-${lang}.mjs`);'],
];

let changed = 0;
for (const [file, from, to] of PATCHES) {
  const P = path.join(ROOT, "scripts", file);
  if (!fs.existsSync(P)) { console.log("  (no " + file + ")"); continue; }
  let t = fs.readFileSync(P, "utf8");
  if (!t.includes(from)) { console.log("  (the line in " + file + " was already changed)"); continue; }
  t = t.replace(from, to);

  // the imports the replacement needs
  if (to.includes("fileURLToPath") && !/import\s*\{[^}]*fileURLToPath[^}]*\}\s*from\s*["']node:url["']/.test(t)) {
    t = t.replace(/^(import\s+path\s+from\s+"node:path";)/m, '$1\nimport os from "node:os";\nimport { fileURLToPath } from "node:url";');
  }
  if (to.includes("os.tmpdir()") && !/import\s+os\s+from\s+"node:os";/.test(t)) {
    t = t.replace(/^(import\s+path\s+from\s+"node:path";)/m, '$1\nimport os from "node:os";');
  }
  if (to.includes("fileURLToPath") && !/import\s+\{\s*fileURLToPath\s*\}/.test(t)) {
    t = t.replace(/^(import\s+path\s+from\s+"node:path";)/m, '$1\nimport { fileURLToPath } from "node:url";');
  }
  fs.writeFileSync(P, t, "utf8");
  changed++;
  console.log("  ok  " + file);
}
console.log("\n" + changed + " files made portable");
