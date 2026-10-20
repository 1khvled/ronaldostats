// Extract every translatable string from the English page shells into
// src/i18n/shell/en.json.
//
// The generator then rewrites the eight localized pages by looking each
// string up in src/i18n/shell/<lang>.json. A string that appears on several
// pages is one dictionary entry, so the translators work on a single flat
// list instead of eight copies of every page.
//
// Run: node scripts/extract-shell-strings.mjs
import fs from "node:fs";
import path from "node:path";
import { tokenize, isMachineText } from "./lib/html-tokenizer.mjs";

const ROOT = path.resolve("D:/Projects/ronaldo-stats");
const OUT_DIR = path.join(ROOT, "src", "i18n", "shell");

const PAGES = [
  "index", "dashboard", "goalsbyyear", "goalsbyseason", "timeline",
  "achievements", "birthday", "latest-goal", "champions-league", "gear",
  "real-madrid", "ronaldo-vs-messi",
];

// Attributes whose values are prose and must be translated.
const TRANSLATABLE_ATTRS = new Set([
  "title", "alt", "placeholder", "aria-label", "label", "content", "value", "aria-description", "data-label",
]);

const found = new Map(); // string -> { count, pages: Set, ctx: string }

function record(str, page, ctx) {
  if (!str) return;
  const core = str.trim();
  if (!core) return;
  if (isMachineText(core)) return;
  if (core.length > 4000) return;   // long paragraphs are still translated; only pathological nodes are skipped
  if (!found.has(core)) found.set(core, { count: 0, pages: new Set(), ctx: ctx || "" });
  const e = found.get(core);
  e.count++;
  e.pages.add(page);
  if (!e.ctx && ctx) e.ctx = ctx;
}

// Collect the text nodes of a document with their neighbours so the
// translator can see whether a string is a whole sentence or a fragment
// split across an inline element.
for (const page of PAGES) {
  const file = path.join(ROOT, page + ".html");
  if (!fs.existsSync(file)) { console.error("missing shell: " + page + ".html"); process.exit(1); }
  const html = fs.readFileSync(file, "utf8");
  const tokens = tokenize(html);
  const texts = tokens.filter((t) => t.type === "text").map((t) => t.value.trim()).filter(Boolean);
  let ti = -1;
  for (const tok of tokens) {
    if (tok.type === "text") {
      const core = tok.value.trim();
      if (core) ti++;
      const prev = ti > 0 ? texts[ti - 1] : "";
      const next = ti >= 0 && ti + 1 < texts.length ? texts[ti + 1] : "";
      record(tok.value, page, (prev ? prev + " " : "") + " [" + core + "] " + (next ? next : ""));
      continue;
    }
    if (tok.type === "tag") {
      for (const a of tok.attrs) {
        if (!TRANSLATABLE_ATTRS.has(a.name)) continue;
        // a long content attribute is still prose: the keyword list of the home
        // page is over a thousand characters and has to be translated too
        if (a.name === "content" && a.value.length > 2000) continue;
        record(a.value, page, "[attr " + a.name + "]");
      }
    }
  }
}

const out = {};
for (const key of [...found.keys()].sort()) {
  const e = found.get(key);
  out[key] = { count: e.count, pages: [...e.pages].sort(), ctx: e.ctx.slice(0, 300) };
}
fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(path.join(OUT_DIR, "en.json"), JSON.stringify(out, null, 1), "utf8");

const chars = Object.keys(out).reduce((a, k) => a + k.length, 0);
console.log(`strings: ${Object.keys(out).length}`);
console.log(`characters: ${chars}`);
console.log(`written: src/i18n/shell/en.json`);
