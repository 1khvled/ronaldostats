// Refactor: extract the 9-language dictionaries out of src/app.js into
// per-language ES modules under src/i18n/.
//
// Why line-based instead of brace matching: the dictionaries contain NESTED
// template literals (e.g. `Goal ${idx}${min ? ` (${min}')` : ""}`), which
// defeats a naive brace/string scanner. The source is, however, laid out with
// a very regular indent convention, so a line-based parser is exact.
//
// Rule (project CONTEXT.md): Node fs utf8 only, never PowerShell Set-Content.
import fs from "node:fs";
import path from "node:path";

const root = "D:/Projects/ronaldo-stats";
const APP = path.join(root, "src", "app.js");
const raw = fs.readFileSync(APP, "utf8");
const EOL = raw.includes("\r\n") ? "\r\n" : "\n";
const lines = raw.split("\n"); // each element keeps a trailing "\r" if CRLF

const LANGS = ["en","es","pt","fr"];
const strip = (s) => s.replace(/\r$/, "");

function findConstBlock(name) {
  for (let i = 0; i < lines.length; i++) {
    const l = strip(lines[i]);
    if (new RegExp(`^(?:const|let)\\s+${name}\\s*=\\s*[\\[{]`).test(l)) {
      const isArr = /=\s*\[/.test(l);
      const closeRe = isArr ? /^\];\s*$/ : /^\};\s*$/;
      for (let j = i + 1; j < lines.length; j++) {
        if (closeRe.test(strip(lines[j]))) return { start: i, end: j };
      }
      return null;
    }
  }
  return null;
}

// Split a const block into { lang: <literal> } by the `  <lang>: {` convention.
// Each entry is normalised into a bare object/array literal (the `lang:` key is
// dropped) so it can be emitted as `export const NAME = <literal>;`.
function splitLangEntries(block) {
  const out = {};
  const body = lines.slice(block.start, block.end + 1);
  let cur = null;
  let buf = [];
  const flush = () => {
    if (!cur || !buf.length) return;
    const first = strip(buf[0]).replace(/^  (en|es|pt|fr|ar|bn|hi|ro|uz):\s*/, "  ");
    const last = buf.length > 1 ? strip(buf[buf.length - 1]).replace(/,(\s*)$/, "$1") : first;
    buf[0] = buf[0].replace(strip(buf[0]), first);
    if (buf.length > 1) buf[buf.length - 1] = buf[buf.length - 1].replace(strip(buf[buf.length - 1]), last);
    out[cur] = buf.join("\n");
  };
  for (const ln of body) {
    const s = strip(ln);
    const m = s.match(/^  (en|es|pt|fr|ar|bn|hi|ro|uz):\s*[\[{]\s*$/);
    if (m) { flush(); cur = m[1]; buf = [ln]; continue; }
    if (cur) {
      buf.push(ln);
      if (/^  [}\]][,\]]?\s*$/.test(s)) { flush(); cur = null; buf = []; }
    }
  }
  flush();
  return out;
}

// The inline English fallback of `X_I18N[lang] || { ... };`
function findFallback(constName) {
  for (let i = 0; i < lines.length; i++) {
    const s = strip(lines[i]);
    if (s.includes(`${constName}[lang] || {`)) {
      const openIdx = lines[i].indexOf("{");
      for (let j = i + 1; j < lines.length; j++) {
        if (/^  \};?\s*$/.test(strip(lines[j]))) {
          const closeIdx = lines[j].indexOf("}");
          const head = lines[i].slice(openIdx);
          const body = lines.slice(i + 1, j).join("\n");
          return head + "\n" + body + "\n" + lines[j].slice(0, closeIdx + 1);
        }
      }
    }
  }
  return null;
}

// ---- dictionary specs -----------------------------------------------------
const SPECS = [
  { exportName: "HOME",          constName: "HOME_I18N" },
  { exportName: "BY_YEAR",       constName: "BY_YEAR_I18N",    fallback: "BY_YEAR_I18N" },
  { exportName: "BY_SEASON",     constName: "BY_SEASON_I18N",  fallback: "BY_SEASON_I18N" },
  { exportName: "DASH",          constName: "DASH_I18N",       enConst: "DASH_EN" },
  { exportName: "TIMELINE",      constName: "TIMELINE_I18N",   enConst: "TIMELINE_EN" },
  { exportName: "ACH",           constName: "ACH_I18N",        enConst: "ACH_EN" },
  { exportName: "BDAY",          constName: "BDAY_I18N" },
  { exportName: "LATEST_GOAL",   constName: "LATEST_GOAL_I18N" },
  { exportName: "ARG_STREAM",    constName: "ARGENTINA_STREAM_I18N" },
  { exportName: "EXPLORE_LANGS", constName: "EXPLORE_LANGS",   enConst: "EXPLORE" },
  { exportName: "ERA_INTROS",    constName: "ERA_INTROS",      enConst: "ERA_INTRO" },
  { exportName: "CABINET",       constName: "CABINET_I18N" },
];

// ---- 1. gather ------------------------------------------------------------
const perLang = {};
for (const lang of LANGS) perLang[lang] = {};
const removals = [];

for (const spec of SPECS) {
  const block = findConstBlock(spec.constName);
  if (!block) { console.error("MISSING const " + spec.constName); process.exit(1); }
  const entries = splitLangEntries(block);
  removals.push(block);

  let enBody = null;
  if (spec.enConst) {
    const eb = findConstBlock(spec.enConst);
    if (!eb) { console.error("MISSING const " + spec.enConst); process.exit(1); }
    const text = lines.slice(eb.start, eb.end + 1).join("\n");
    const eq = text.indexOf("=");
    enBody = text.slice(eq + 1).trim().replace(/;+\s*$/, "");
    removals.push(eb);
  }
  let fb = null;
  if (spec.fallback) {
    fb = findFallback(spec.fallback);
    if (!fb) { console.error("MISSING fallback for " + spec.fallback); process.exit(1); }
  }

  for (const lang of LANGS) {
    let body = entries[lang] || null;
    if (!body && lang === "en") body = enBody || fb;
    if (!body) { console.error(`MISSING ${spec.exportName}.${lang}`); process.exit(1); }
    perLang[lang][spec.exportName] = body;
  }
}

// ---- 2. write per-language modules ----------------------------------------
const i18nDir = path.join(root, "src", "i18n");
fs.mkdirSync(i18nDir, { recursive: true });

for (const lang of LANGS) {
  const parts = [
    `// ${lang.toUpperCase()} dictionary — RonaldoStats`,
    `// Extracted verbatim from the original inline dictionaries by`,
    `// scripts/refactor-i18n.mjs. Structure is identical across all 9 languages.`,
    "",
  ];
  for (const spec of SPECS) {
    parts.push(`export const ${spec.exportName} = ${perLang[lang][spec.exportName].trim()};`);
    parts.push("");
  }
  fs.writeFileSync(path.join(i18nDir, `${lang}.js`), parts.join("\n"), "utf8");
}

// ---- 3. index module ------------------------------------------------------
const idx = [
  `// Per-language dictionary registry.`,
  `import * as en from "./en.js";`,
  ...LANGS.filter((l) => l !== "en").map((l) => `import * as ${l} from "./${l}.js";`),
  "",
  `export const LANGS = ${JSON.stringify(LANGS)};`,
  `const REGISTRY = { en, ${LANGS.filter((l) => l !== "en").join(", ")} };`,
  "",
  `export function getDict(lang) {`,
  `  return REGISTRY[lang] || REGISTRY.en;`,
  `}`,
  "",
  `export default REGISTRY;`,
  "",
];
fs.writeFileSync(path.join(i18nDir, "index.js"), idx.join("\n"), "utf8");

// ---- 4. strip the constants from app.js -----------------------------------
const sorted = [...removals].sort((a, b) => b.start - a.start);
let out = lines.slice();
for (const r of sorted) {
  out = out.slice(0, r.start).concat(["/* __removed__ */"], out.slice(r.end + 1));
}
// drop the placeholder lines
out = out.filter((l) => strip(l) !== "/* __removed__ */");
// collapse 3+ blank lines
const collapsed = [];
for (const l of out) {
  if (strip(l) === "" && collapsed.length && strip(collapsed[collapsed.length - 1]) === "" && strip(collapsed[collapsed.length - 2] || "") === "") continue;
  collapsed.push(l);
}
out = collapsed;

// ---- 5. rewire references -------------------------------------------------
let t = out.join("\n");
const rewires = [
  [/HOME_I18N\[lang\] \|\| HOME_I18N\.en/g, "DICT.HOME"],
  [/BY_YEAR_I18N\[lang\] \|\| \{[\s\S]*?\n  \};/g, "DICT.BY_YEAR"],
  [/BY_SEASON_I18N\[lang\] \|\| \{[\s\S]*?\n  \};/g, "DICT.BY_SEASON"],
  [/DASH_I18N\[lang\] \|\| DASH_EN/g, "DICT.DASH"],
  [/TIMELINE_I18N\[lang\] \|\| TIMELINE_EN/g, "DICT.TIMELINE"],
  [/ACH_I18N\[lang\] \|\| ACH_EN/g, "DICT.ACH"],
  [/EXPLORE_LANGS\[lang\] \|\| EXPLORE/g, "DICT.EXPLORE_LANGS"],
  [/ERA_INTROS\[lang\] && ERA_INTROS\[lang\]\[key\] \|\| ERA_INTRO\[era\] \|\| ERA_INTRO\[key\]/g, "DICT.ERA_INTROS[key] || DICT.ERA_INTROS[era]"],
  [/\bBDAY_I18N\[lang\] \|\| BDAY_I18N\.en/g, "DICT.BDAY"],
  [/\bLATEST_GOAL_I18N\[lang\] \|\| LATEST_GOAL_I18N\.en/g, "DICT.LATEST_GOAL"],
  [/\bARGENTINA_STREAM_I18N\[lang\] \|\| ARGENTINA_STREAM_I18N\.en/g, "DICT.ARG_STREAM"],
  [/\bCABINET_I18N\[lang\] \|\| CABINET_I18N\.en/g, "DICT.CABINET"],
  [/const CABINET = CABINET_I18N\.en;/g, "const CABINET = DICT.CABINET;"],
];
for (const [re, rep] of rewires) {
  const before = t;
  t = t.replace(re, rep);
  if (before === t) console.error("REWIRE NO-OP: " + re);
}

// import + DICT resolution
t = t.replace(/^(import .*\r?\n)+/m, (m) => m + `import { getDict } from "./i18n/index.js";\n`);

// getLang() refreshes DICT
const glRe = /function getLang\(\)\s*\{([\s\S]*?)\r?\n\}/;
if (!glRe.test(t)) { console.error("getLang not found"); process.exit(1); }
t = t.replace(glRe, (m, body) => `function getLang() {${body}\n  DICT = getDict(getLangCode());\n  return getLangCode();\n}`);

// declare DICT before first use
t = t.replace(/^(function initTheme\(\) \{)/m, `let DICT = getDict("en");\n\n$1`);

fs.writeFileSync(APP, t, "utf8");
console.log(`wrote ${LANGS.length} language modules; app.js ${raw.length} -> ${t.length} bytes`);
