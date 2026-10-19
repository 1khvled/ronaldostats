// Apply the RonaldoStats identity tokens to src/styles.css and install the
// new brand assets at the site root.
import fs from "node:fs";
import path from "node:path";

const ROOT = "D:/Projects/ronaldo-stats";
const CSS = path.join(ROOT, "src", "styles.css");
let css = fs.readFileSync(CSS, "utf8");

// ---- 1. token blocks ------------------------------------------------------
const TOKENS = `:root {
  --bg-1: #f2f3f0;
  --bg-2: #f2f3f0;
  --bg-3: #e9ebe6;
  --surface: #ffffff;
  --card: #ffffff;
  --surface-solid: #f4f5f2;
  --line: #d3d6ce;
  --line-soft: #e2e5dd;
  --ink: #10130f;
  --ink-soft: #363c33;
  --muted: #5c6357;
  --faint: #676e61;
  --brand: #b31217;
  --brand-ink: #8c0e12;
  --brand-soft: #f7e3e2;
  --navy: #122a5e;
  --hero-grad: linear-gradient(112deg, #046a38 6%, #13295c 50%, #b31217 94%);
  --accent: #0e7a4f;
  --accent-soft: #e1f0e9;
  --gold: #8a6300;
  --gold-soft: #f7eecb;
  --gold-bright: #f2ce6b;
  --pink: #a61e63;
  --sky: #0e6fa8;
  --bar-1: #e2a0a0;
  --bar-2: #b31217;
  /* Sharp archive geometry. Pills only where a pill is semantically right. */
  --radius: 3px;
  --radius-lg: 4px;
  --radius-pill: 2px;
  /* Depth comes from a 1px hairline + one hard offset stamp, never a soft blur. */
  --shadow: 2px 2px 0 var(--line);
  --shadow-sm: 1px 1px 0 var(--line);
  --hairline: 1px solid var(--line);
  --rule: 2px solid var(--ink);
  --rail-w: 76px;
  --rail-open: 248px;
  --font-body: "DM Sans", system-ui, -apple-system, "Segoe UI", sans-serif;
  --font-head: "Plus Jakarta Sans", "DM Sans", system-ui, sans-serif;
  --bday-tier-0: #eceee9;
  --bday-tier-0-ink: #8a9184;
  --bday-tier-1: #d9e6ef;
  --bday-tier-1-ink: #14425e;
  --bday-tier-2: #8fbed9;
  --bday-tier-2-ink: #0b3247;
  --bday-tier-3: #2b7fae;
  --bday-tier-3-ink: #ffffff;
  --bday-tier-4: #c98a08;
  --bday-tier-4-ink: #1e1300;
}`;

const DARK = `[data-theme="dark"] {
  color-scheme: dark;
  --bg-1: #000000;
  --bg-2: #0a0a0a;
  --bg-3: #121212;
  --surface: #0d0d0d;
  --card: #121212;
  --surface-solid: #1a1a1a;
  --line: #2b2b2b;
  --line-soft: #1f1f1f;
  --ink: #f2f2f0;
  --ink-soft: #d2d2ce;
  --muted: #9d9d97;
  --faint: #83837c;
  --brand: #f2666b;
  --brand-ink: #ff9a9d;
  --brand-soft: #3a1618;
  --navy: #26262a;
  --hero-grad: linear-gradient(112deg, #06301c 6%, #1b1f3d 50%, #4a1114 94%);
  --accent: #3fbf8c;
  --accent-soft: #0e2a20;
  --gold: #e8b93a;
  --gold-soft: #33280a;
  --gold-bright: #f2ce6b;
  --pink: #f58bbe;
  --sky: #6fb6dd;
  --bar-1: #6e2a2c;
  --bar-2: #f2666b;
}`;

/** Replace a top-level block that starts with `selector {` and ends at the matching `}`. */
function replaceBlock(text, selector, replacement) {
  const idx = text.indexOf(selector + " {");
  if (idx < 0) return { text, ok: false };
  const open = text.indexOf("{", idx);
  let depth = 0, i = open;
  for (; i < text.length; i++) {
    if (text[i] === "{") depth++;
    else if (text[i] === "}") { depth--; if (depth === 0) break; }
  }
  return { text: text.slice(0, idx) + replacement + text.slice(i + 1), ok: true };
}

const before = css;
let r = replaceBlock(css, ":root", TOKENS);
css = r.text;
console.log("root block replaced:", r.ok);
r = replaceBlock(css, '[data-theme="dark"]', DARK);
css = r.text;
console.log("dark block replaced:", r.ok);

// the leading comment still names Messi
css = css.replace(/^\/\* MessiStats[^*]*\*\//m, `/* RonaldoStats — light editorial paper theme. Own code, own data, own copy.
   Portugal red / Real Madrid navy / Portugal green, gold reserved for records.
   DM Sans (body) + Plus Jakarta Sans (headings), self-hosted. */`);

fs.writeFileSync(CSS, css, "utf8");
console.log("styles.css:", before.length, "->", css.length, "bytes");

// ---- 2. brand assets at the site root ------------------------------------
const PUB = path.join(ROOT, "public");
const IMG = path.join(PUB, "img");
const copies = [
  ["logo.png", "logo.png"],
  ["logo-192.png", "logo-192.png"],
  ["favicon.ico", "favicon.ico"],
  ["favicon.svg", "favicon.svg"],
  ["favicon-48x48.png", "favicon-48x48.png"],
  ["favicon-96x96.png", "favicon-96x96.png"],
  ["favicon-192x192.png", "favicon-192x192.png"],
  ["favicon-512x512.png", "favicon-512x512.png"],
  ["apple-touch-icon.png", "apple-touch-icon.png"],
  ["site.webmanifest", "site.webmanifest"],
];
for (const [from, to] of copies) {
  const src = path.join(IMG, from);
  const dst = path.join(PUB, to);
  if (!fs.existsSync(src)) { console.log("  missing " + from); continue; }
  fs.copyFileSync(src, dst);
}
console.log("brand assets copied to public/");

// the old Messi hero images are replaced by the Ronaldo ones
for (const stale of ["messi.jpg", "messi.webp", "messi-450.webp", "og-messi.jpg", "og-messi.webp", "messi-vs-ronaldo.webp"]) {
  const p = path.join(IMG, stale);
  if (fs.existsSync(p)) { fs.rmSync(p); console.log("  removed stale " + stale); }
}
