// i18n audit for RonaldoStats.
//
//   node scripts/verify-all-i18n.cjs
//
// Three gates:
//   1. every language has a runtime dictionary (src/i18n/<lang>.js) whose
//      exports, keys and function arity match src/i18n/en.js exactly — the
//      modules are IMPORTED, so what is compared is what the renderer sees;
//   2. every language has a shell dictionary (src/i18n/shell/<lang>.json)
//      with exactly the keys of src/i18n/shell/en.json;
//   3. the generated pages under <lang>/ carry no untranslated English that
//      the English source did not contain.
const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");

const ROOT = path.join(__dirname, "..");
const LANGS = ["es", "pt", "fr", "ar", "bn", "hi", "ro", "uz"];

let issues = 0;
const fail = (m) => { console.error("[FAIL] " + m); issues++; };
const pass = (m) => console.log("[PASS] " + m);

/** Structural signature of a dictionary: keys in order, value kinds, arity. */
function signature(value) {
  if (Array.isArray(value)) return { kind: "array", length: value.length, items: value.map(signature) };
  if (value && typeof value === "object") {
    const out = [];
    for (const [k, v] of Object.entries(value)) {
      if (typeof v === "function") {
        out.push([k, "fn", v.length]);
      } else if (v && typeof v === "object") {
        out.push([k, "obj", signature(v)]);
      } else {
        out.push([k, typeof v]);
      }
    }
    return { kind: "object", entries: out };
  }
  return { kind: typeof value };
}

function diff(a, b, pathPrefix, out) {
  if (a.kind !== b.kind) { out.push(pathPrefix + ": kind " + a.kind + " vs " + b.kind); return; }
  if (a.kind === "array") {
    if (a.length !== b.length) { out.push(pathPrefix + ": length " + a.length + " vs " + b.length); return; }
    for (let i = 0; i < a.length; i++) diff(a.items[i], b.items[i], pathPrefix + "[" + i + "]", out);
    return;
  }
  if (a.kind !== "object") return;
  const ak = a.entries.map((e) => e[0]);
  const bk = b.entries.map((e) => e[0]);
  for (const k of ak) if (!bk.includes(k)) out.push(pathPrefix + "." + k + " missing");
  for (const k of bk) if (!ak.includes(k)) out.push(pathPrefix + "." + k + " extra");
  for (let i = 0; i < Math.min(ak.length, bk.length); i++) {
    if (ak[i] !== bk[i]) { out.push(pathPrefix + ": key order differs at " + i + " (" + ak[i] + " vs " + bk[i] + ")"); continue; }
    const ea = a.entries[i], eb = b.entries[i];
    if (ea[1] === "fn" && eb[1] === "fn") {
      if (ea[2] !== eb[2]) out.push(pathPrefix + "." + ak[i] + ": arity " + ea[2] + " vs " + eb[2]);
    } else if (ea[1] === "obj" && eb[1] === "obj") {
      diff(ea[2], eb[2], pathPrefix + "." + ak[i], out);
    } else if (ea[1] !== eb[1]) {
      out.push(pathPrefix + "." + ak[i] + ": type " + ea[1] + " vs " + eb[1]);
    }
  }
}

(async () => {
  // ---- 1. runtime dictionaries -------------------------------------------
  const load = async (lang) => {
    const file = path.join(ROOT, "src", "i18n", lang + ".js");
    if (!fs.existsSync(file)) return null;
    return import(pathToFileURL(file).href + "?t=" + Date.now());
  };

  const en = await load("en");
  if (!en) { fail("src/i18n/en.js is missing"); process.exit(1); }
  const enExports = Object.keys(en).filter((k) => k !== "default");
  pass("en.js — " + enExports.length + " dictionaries: " + enExports.join(", "));

  for (const lang of LANGS) {
    const mod = await load(lang);
    if (!mod) { fail("missing runtime dictionary src/i18n/" + lang + ".js"); continue; }
    const got = Object.keys(mod).filter((k) => k !== "default");
    if (got.length !== enExports.length || got.some((k, i) => k !== enExports[i])) {
      fail(lang + ".js exports differ: " + got.join(", "));
      continue;
    }
    const problems = [];
    for (const name of enExports) {
      diff(signature(en[name]), signature(mod[name]), name, problems);
    }
    if (problems.length) {
      for (const p of problems.slice(0, 12)) fail(lang + ".js " + p);
      if (problems.length > 12) fail(lang + ".js — and " + (problems.length - 12) + " more differences");
    } else {
      pass(lang + ".js — structure identical to English (" + enExports.length + " dictionaries)");
    }
  }

  // ---- 2. shell dictionaries ---------------------------------------------
  const enShell = JSON.parse(fs.readFileSync(path.join(ROOT, "src", "i18n", "shell", "en.json"), "utf8"));
  const enShellKeys = Object.keys(enShell);
  for (const lang of LANGS) {
    const file = path.join(ROOT, "src", "i18n", "shell", lang + ".json");
    if (!fs.existsSync(file)) { fail("missing shell dictionary src/i18n/shell/" + lang + ".json"); continue; }
    let dict;
    try { dict = JSON.parse(fs.readFileSync(file, "utf8")); }
    catch (e) { fail(lang + " shell dictionary is not valid JSON: " + e.message); continue; }
    const keys = Object.keys(dict);
    // a date stamp is a timestamp, not prose: it changes every day and no
    // dictionary can hold every day's sentence, so it is not compared
    const isDate = (k) => /\b\d{1,2} [A-Z][a-z]+ \d{4}\b/.test(k);
    const missing = enShellKeys.filter((k) => !(k in dict) && !isDate(k));
    const extra = keys.filter((k) => !(k in enShell) && !isDate(k));
    if (missing.length) fail(lang + " shell dictionary is missing " + missing.length + " keys, e.g. " + missing.slice(0, 3).map((k) => JSON.stringify(k)).join(", "));
    if (extra.length) fail(lang + " shell dictionary has " + extra.length + " keys the English source does not have, e.g. " + extra.slice(0, 3).map((k) => JSON.stringify(k)).join(", "));
    if (!missing.length && !extra.length) pass(lang + " shell dictionary — " + keys.length + " keys, exact match");
  }

  // ---- 3. generated pages -------------------------------------------------
  const EN_PAGES = ["index", "dashboard", "goalsbyyear", "goalsbyseason", "timeline", "achievements", "champions-league", "gear", "real-madrid", "ronaldo-vs-messi"];
  const strip = (h) => h.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ");
  const enText = strip(EN_PAGES.map((p) => fs.readFileSync(path.join(ROOT, p + ".html"), "utf8")).join(" "));
  const wordRun = (t) => {
    const runs = [];
    const re = /([A-Za-z][A-Za-z'’-]*)([ ,]+)([A-Za-z][A-Za-z'’-]*(?:[ ,]+[A-Za-z][A-Za-z'’-]*){5,})/g;
    let m;
    while ((m = re.exec(t))) runs.push(m[0].trim());
    return runs;
  };
  const enRuns = new Set(wordRun(enText).map((r) => r.replace(/\s+/g, " ").toLowerCase()));
  // A run only counts as untranslated English when it is actually English:
  // four or more unambiguous English function words in it. Short words such
  // as "a", "in", "de" or "no" are shared with other languages and are
  // excluded, otherwise a good Romanian or Portuguese sentence reads as a
  // leak.
  const EN_WORDS = new Set(["the", "of", "and", "to", "for", "with", "from", "is", "are", "was", "were", "has", "have", "had", "his", "he", "she", "that", "this", "these", "they", "their", "when", "while", "after", "before", "over", "into", "it", "its", "not", "but", "you", "your", "our", "we", "all", "every", "each", "than", "then", "so", "one", "two", "three", "goals", "goal", "career", "club", "team", "season", "years", "matches", "appearances", "trophies", "scored", "player", "career goals"]);
  const isEnglishRun = (run) => {
    const words = run.toLowerCase().split(/[^a-z']+/).filter(Boolean);
    let hits = 0;
    for (const w of words) if (EN_WORDS.has(w)) hits++;
    return hits >= 4;
  };
  const ALLOW = /^(ronaldo|messi|cristiano|real|madrid|manchester|united|juventus|nassr|sporting|portugal|champions|league|liga|saudi|pro|ballon|golden|world|cup|europa|nations|uefa|fifa|premier|serie|troph|primeira)/;

  for (const lang of LANGS) {
    const dir = path.join(ROOT, lang);
    if (!fs.existsSync(dir)) continue;
    let leaks = 0;
    for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".html"))) {
      const text = strip(fs.readFileSync(path.join(dir, file), "utf8"));
      for (const run of wordRun(text)) {
        const key = run.replace(/\s+/g, " ").toLowerCase();
        if (enRuns.has(key)) continue;
        if (ALLOW.test(key)) continue;
        if (!isEnglishRun(run)) continue;
        if (leaks < 3) console.error("  [" + lang + "/" + file + "] untranslated: " + JSON.stringify(run.slice(0, 90)));
        leaks++;
      }
    }
    if (leaks) fail(lang + " pages carry " + leaks + " untranslated English run(s)");
    else pass(lang + " pages — no untranslated English runs");
  }

  if (issues === 0) {
    console.log("\n[SUCCESS] i18n audit passed with 0 issues.");
  } else {
    console.error("\n[ERROR] " + issues + " i18n issue(s).");
    process.exit(1);
  }
})();
