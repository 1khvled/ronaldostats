// smoke-i18n.mjs — call every dictionary function and fail loudly.
//
//   node scripts/smoke-i18n.mjs
//
// The dictionaries live in their own modules, so a helper they call but
// app.js does not publish (n, esc, LIVE) only shows up when a page actually
// renders — and the build would still pass. This calls every function in
// every language with mock data and fails on a ReferenceError, which is
// exactly that class of bug.
//
// A throw caused by the mock's shape is reported as a note, not a failure:
// the real call sites are exercised by the browser pass.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const LANGS = ["en", "es", "pt", "fr", "ar", "bn", "hi", "ro", "uz"];

// the helpers app.js publishes on the global object
globalThis.n = (v) => Number(v).toLocaleString("en-US");
globalThis.esc = (s) =>
  String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
globalThis.bn = (v) => String(v).replace(/[0-9]/g, (d) => "০১২৩৪৫৬৭৮৯"[+d]);
globalThis.LIVE = {
  goals: 981, apps: 1340, clubGoals: 835, argGoals: 146, argCaps: 234,
  assists: 261, tmAssists: 291, ga: 1242, tmGa: 1272,
  trophies: 35, rTrophies: 46, tBarca: 15, tArg: 3, tPsg: 2, tMiami: 1,
  gap: -45, fewer: 159, road: 19, rGoals: 936, rApps: 1181, rAssists: 408,
  rGpg: "0.79", rGa: 1344, astLead: -147, npg: 797, npgR: 827, npgLead: -30,
  miamiGoals: 134, miamiApps: 157,
};

/** A forgiving mock: any property resolves to something shaped like it. */
function smart(seed) {
  const base = {
    goals: 981, apps: 1340, appearances: 1340, year: 2013, age: 28, season: "2011/12",
    date: "2026-10-09", opponent: "Al-Diriyah FC", competition: "Saudi Pro League",
    comp: "Saudi Pro League", score: "3-0", minute: "42", name: "Cristiano Ronaldo",
    birthplace: "Funchal, Madeira, Portugal", position: "Forward", current: ["Al Nassr"],
    number: 7, short: "CR7", lastUpdated: "19 October 2026", club: "Real Madrid",
    team: "all", updated: "2026-10-19", length: 3, careerTotal: 981,
  };
  return new Proxy(base, {
    get(target, key) {
      if (key in target) return target[key];
      if (key === Symbol.toPrimitive) return () => "x";
      if (typeof key === "string" && /^(toString|valueOf|constructor)$/.test(key)) return () => "x";
      return "x";
    },
    has() { return true; },
  });
}

const MOCKS = [smart(), smart(), smart(), 981, smart(), smart(), [smart()], [smart()], "all",
  "2026-10-09", "Al-Diriyah FC", "Saudi Pro League", "3-0", "42", 981];

let calls = 0;
const missingHelpers = [];
const shapeNotes = [];

for (const lang of LANGS) {
  const file = path.join(ROOT, "src", "i18n", lang + ".js");
  if (!fs.existsSync(file)) { missingHelpers.push(lang + ": no dictionary file"); continue; }
  const mod = await import(pathToFileURL(file).href);
  for (const [name, dict] of Object.entries(mod)) {
    if (name === "default" || !dict || typeof dict !== "object") continue;
    const visit = (v, p) => {
      if (typeof v === "function") {
        calls++;
        try {
          v(...MOCKS);
        } catch (e) {
          if (e instanceof ReferenceError) missingHelpers.push(lang + "." + p + ": " + e.message);
          else shapeNotes.push(lang + "." + p + ": " + e.message);
        }
      } else if (Array.isArray(v)) {
        v.forEach((x, i) => visit(x, p + "[" + i + "]"));
      } else if (v && typeof v === "object") {
        for (const [k, x] of Object.entries(v)) visit(x, p ? p + "." + k : k);
      }
    };
    visit(dict, name);
  }
}

console.log("dictionary functions called:", calls);
if (shapeNotes.length) console.log("mock-shape notes (not failures):", shapeNotes.length);
if (missingHelpers.length) {
  console.error("\n" + missingHelpers.length + " missing-helper failure(s):");
  for (const p of missingHelpers.slice(0, 30)) console.error("  " + p);
  process.exit(1);
}
console.log("[OK] every dictionary function resolves its helpers; no ReferenceError in any language.");
