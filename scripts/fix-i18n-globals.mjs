import fs from "node:fs";
const ROOT = "D:/Projects/ronaldo-stats/";

// --- 1. expose the shared helpers the dictionary modules call ---------------
{
  const P = ROOT + "src/app.js";
  let t = fs.readFileSync(P, "utf8");
  const EOL = t.includes("\r\n") ? "\r\n" : "\n";
  const find = `const LIVE = {`;
  if (!t.includes(find)) { console.error("LIVE not found"); process.exit(1); }
  const inject = `// The dictionary modules are separate files, so the helpers
// they call have to be reachable from their scope. Publishing them on the
// global object keeps the dictionaries self-contained: they format numbers
// with n(), escape with esc() and read the live registry with LIVE.
globalThis.n = n;
globalThis.esc = esc;
globalThis.LIVE = LIVE;

const LIVE = {`;
  t = t.replace(find, inject.split("\n").join(EOL));
  fs.writeFileSync(P, t, "utf8");
  console.log("ok  app.js publishes n / esc / LIVE for the dictionaries");
}

// --- 2. a runtime smoke test: call every dictionary function --------------
{
  const P = ROOT + "scripts/smoke-i18n.mjs";
  const body = `// smoke-i18n.mjs — call every dictionary function and fail loudly.
//
//   node scripts/smoke-i18n.mjs
//
// The dictionaries live in their own modules, so a missing helper (n, esc,
// LIVE) only shows up when a page actually renders. This calls every function
// in every language with mock data and reports the first throw, so the
// failure is caught in CI rather than in a browser.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\\//, ""), "..");
const LANGS = ["en","es","pt","fr"];

// the helpers app.js publishes
globalThis.n = (v) => Number(v).toLocaleString("en-US");
globalThis.esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
globalThis.LIVE = {
  goals: 981, apps: 1340, clubGoals: 835, argGoals: 146, argCaps: 234,
  assists: 261, tmAssists: 291, ga: 1242, tmGa: 1272,
  trophies: 35, rTrophies: 46, tBarca: 15, tArg: 3, tPsg: 2, tMiami: 1,
  gap: -45, fewer: 159, road: 19, rGoals: 936, rApps: 1181, rAssists: 408,
  rGpg: "0.79", rGa: 1344, astLead: -147, npg: 797, npgR: 827, npgLead: -30,
  miamiGoals: 134, miamiApps: 157,
};

const mock = {
  t: { goals: 981, apps: 1340, club: { goals: 835, appearances: 1106 }, country: { goals: 146, appearances: 234 } },
  p: { name: "Cristiano Ronaldo", birthplace: "Funchal, Madeira, Portugal", age: 41, position: "Forward", current: ["Al Nassr"], number: 7, short: "CR7" },
  d: { lastUpdated: "19 October 2026", meta: { updated: "2026-10-19" } },
  goals: 981, apps: 1340, seasons: 25, clubs: 5, caps: 234, gpg: 0.73,
  best: { goals: 69, year: 2013, apps: 43, season: "2011/12" },
  last: { year: 2026, goals: 24, apps: 39 },
  ys: [{ year: 2013, goals: 69, careerTotal: 398, age: 28, status: "cross-checked" }, { year: 2026, goals: 24, careerTotal: 981, age: 41, status: "provisional-ongoing" }],
  ss: [{ club: "Real Madrid", season: "2011/12", apps: 55, goals: 60, league: { apps: 38, goals: 46 }, cup: { apps: 5, goals: 3 }, continental: { apps: 10, goals: 10 }, other: { apps: 2, goals: 1 } }],
  team: "all",
  r: 261, rm: 291, ga: 1242, tmGa: 1272,
  date: "2026-10-09", opponent: "Al-Diriyah FC", comp: "Saudi Pro League", score: "3-0", min: "42", g: 981,
  s: "2026", n: 1, u: 3, k: "x", v: "y", z: 2, idx: 0, len: 3, arr: [1, 2, 3], m: 1, i: 0,
};

let calls = 0, problems = [];
for (const lang of LANGS) {
  const file = path.join(ROOT, "src", "i18n", lang + ".js");
  if (!fs.existsSync(file)) { problems.push(lang + ": no dictionary"); continue; }
  const mod = await import(pathToFileURL(file).href);
  for (const [name, dict] of Object.entries(mod)) {
    if (name === "default" || typeof dict !== "object" || dict === null) continue;
    const visit = (v, path) => {
      if (typeof v === "function") {
        calls++;
        try {
          const out = v(mock.t, mock.p, mock.d, mock.goals, mock.best, mock.last, mock.ys, mock.ss, mock.team, mock.date, mock.opponent, mock.comp, mock.score, mock.min, mock.g);
          if (typeof out === "string" && /undefined|NaN|\\[object Object\\]/.test(out)) {
            problems.push(lang + "." + name + "." + path + ": placeholder in the output -> " + out.slice(0, 90));
          }
        } catch (e) {
          problems.push(lang + "." + name + "." + path + ": " + e.message);
        }
      } else if (Array.isArray(v)) {
        v.forEach((x, i) => visit(x, path + "[" + i + "]"));
      } else if (v && typeof v === "object") {
        for (const [k, x] of Object.entries(v)) visit(x, path ? path + "." + k : k);
      }
    };
    visit(dict, name);
  }
}
console.log("dictionary functions called:", calls);
if (problems.length) {
  console.error("\\n" + problems.length + " problem(s):");
  for (const p of problems.slice(0, 30)) console.error("  " + p);
  process.exit(1);
}
console.log("[OK] every dictionary function renders without a missing helper or a placeholder.");
`;
  fs.writeFileSync(P, body, "utf8");
  console.log("ok  scripts/smoke-i18n.mjs written");
}

// --- 3. add the smoke test to the verification gate -------------------------
{
  const P = ROOT + "scripts/verify-all.mjs";
  let t = fs.readFileSync(P, "utf8");
  const EOL = t.includes("\r\n") ? "\r\n" : "\n";
  const find = `step(run(process.execPath, ["scripts/verify-all-i18n.cjs"], "i18n audit"), "i18n audit");`;
  const replace = find + EOL + `step(run(process.execPath, ["scripts/smoke-i18n.mjs"], "i18n runtime smoke test"), "i18n runtime smoke test");`;
  if (!t.includes(find)) { console.error("verify-all anchor not found"); process.exit(1); }
  t = t.replace(find, replace);
  fs.writeFileSync(P, t, "utf8");
  console.log("ok  verify-all.mjs: the runtime smoke test is a gate");
}
