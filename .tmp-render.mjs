import fs from "node:fs";
import { substitute } from "./scripts/lib/html-tokenizer.mjs";

const ROOT = "D:/Projects/ronaldo-stats";
const dict = JSON.parse(fs.readFileSync(ROOT + "/src/i18n/shell/es.json", "utf8"));
const map = {};
for (const [k, v] of Object.entries(dict)) map[k] = v;

function show(file, needles) {
  const html = fs.readFileSync(ROOT + "/" + file, "utf8");
  const { html: out, missing } = substitute(html, map, {
    text: true,
    attrs: ["title", "alt", "placeholder", "aria-label", "label", "value", "aria-description", "data-label"],
  });
  console.log("==== " + file);
  for (const n of needles) {
    const i = out.indexOf(n);
    if (i < 0) { console.log("  [NOT FOUND] " + n); continue; }
    console.log("  >> " + out.slice(Math.max(0, i - 120), i + n.length + 320).replace(/\s+/g, " "));
    console.log();
  }
  const leftovers = missing.filter((m) => /[A-Za-z]{3}/.test(m) && !/^(https?:|[a-zA-Z]{2,5}$)/.test(m));
  console.log("  -- leftover untranslated text nodes: " + leftovers.length);
  leftovers.slice(0, 40).forEach((m) => console.log("     * " + JSON.stringify(m)));
  console.log();
}

show("index.html", ["id=\"lede\"", "ground-truth-lead", "identity-facts", "community-strip", "desktop-brand-sub", "Player profile", "eyebrow"]);
show("ronaldo-vs-messi.html", ["showdown-caption", "class=\"eyebrow\"", "lede", "showdown-overlay-badge"]);
show("birthday.html", ["Copy Embed Code", "bday-copy-embed-btn"]);
