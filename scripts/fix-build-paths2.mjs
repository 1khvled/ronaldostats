import fs from "node:fs";
import path from "node:path";
const P = "D:/Projects/ronaldo-stats/scripts/build-birthday-goals.mjs";
let t = fs.readFileSync(P, "utf8");
const before = t;

t = t.replace(/const OUT = path\.resolve\("D:\/Projects\/ronaldo-stats\/public\/data\/birthday-goals\.json"\);/,
  'const OUT = path.join(ROOT, "public", "data", "birthday-goals.json");');
t = t.replace(/const TMP = "C:\/Users\/Abdelli\/AppData\/Local\/Temp\/opencode\/";/,
  'const TMP = path.join(os.tmpdir(), "ronaldostats-build") + path.sep;');
// the repository root, found from this script
t = t.replace(/^(import path from "node:path";)/m,
  '$1\nimport os from "node:os";\nimport { fileURLToPath } from "node:url";\n\nconst ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");');

fs.writeFileSync(P, t, "utf8");
console.log(before === t ? "  (nothing changed)" : "ok  build-birthday-goals.mjs is portable");
for (const m of t.matchAll(/^const (ROOT|OUT|TMP) = .*$/gm)) console.log("   " + m[0]);
console.log("   the imports: " + (t.match(/^import .*$/gm) || []).slice(0, 5).join(" | "));
