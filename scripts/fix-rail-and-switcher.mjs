import fs from "node:fs";
import path from "node:path";
const ROOT = "D:/Projects/ronaldo-stats/";

// ---------------------------------------------------------------------------
// 1. the language switcher: fixLocaleLinks() was rewriting the switcher's own
//    links back to the current language, so every card pointed at the page
//    you were already on.
// ---------------------------------------------------------------------------
{
  const P = path.join(ROOT, "src", "app.js");
  let t = fs.readFileSync(P, "utf8");
  const before = t;
  const EOL = t.includes("\r\n") ? "\r\n" : "\n";

  // remove the debug line
  t = t.replace(/\r?\n?\s*\/\*DEBUG\*\/[^\n]*\n/, "\n");

  const find = `  const anchors = document.querySelectorAll("a[href]");
  for (const a of anchors) {
    const href = a.getAttribute("href") || "";
    if (!re.test(href)) continue;
    a.setAttribute("href", href.replace(re, "/" + lang));
  }`.split("\n").join(EOL);
  const replace = `  const anchors = document.querySelectorAll("a[href]");
  for (const a of anchors) {
    // The language switcher's own links point at the OTHER languages by
    // definition — rewriting them would send the visitor back where they
    // came from, which is exactly what broke the switcher.
    if (a.hasAttribute("data-code")) continue;
    if (a.closest("#lang-modal")) continue;
    if (a.id === "lang-suggest-switch") continue;
    if (a.classList.contains("lang-suggest-btn-primary")) continue;
    const href = a.getAttribute("href") || "";
    if (!re.test(href)) continue;
    a.setAttribute("href", href.replace(re, "/" + lang));
  }`.split("\n").join(EOL);
  if (!t.includes(find)) {
    if (t.includes("a.hasAttribute(\"data-code\")")) {
      console.log("ok  app.js: the language switcher's links are already left alone");
    } else {
      console.error("fixLocaleLinks block not found");
      process.exit(1);
    }
  } else {
    t = t.replace(find, replace);
    fs.writeFileSync(P, t, "utf8");
    console.log("ok  app.js: the language switcher's links are left alone");
  }
}

// ---------------------------------------------------------------------------
// 2. the rail still carried Messi's crest: an Argentina-coloured shield with
//    "M10" on it. Replace it with the CR7 monogram in the site's palette.
// ---------------------------------------------------------------------------
const PAGES = ["index", "dashboard", "goalsbyyear", "goalsbyseason", "timeline", "achievements",
  "birthday", "latest-goal", "champions-league", "gear", "real-madrid", "ronaldo-vs-messi"];

const CR7_MARK = `<svg class="rail-mark" viewBox="0 0 64 64" aria-hidden="true"><path d="M9 9h46v33L32 55 9 42Z" fill="none" stroke="#f2ce6b" stroke-width="3" stroke-linejoin="round"></path><text fill="#ffffff" font-family="'Plus Jakarta Sans',Arial,sans-serif" font-size="21" font-weight="800" text-anchor="middle" x="32" y="37">CR7</text></svg>`;

const MARK_RE = /<svg[^>]*class="rail-mark"[\s\S]*?<\/svg>/g;
let fixed = 0;
for (const p of PAGES) {
  const f = path.join(ROOT, p + ".html");
  let t = fs.readFileSync(f, "utf8");
  const before = t;
  t = t.replace(MARK_RE, CR7_MARK);
  if (t !== before) { fs.writeFileSync(f, t, "utf8"); fixed++; }
}
console.log(`ok  the CR7 rail mark replaced Messi's crest in ${fixed} English shells`);

// ---------------------------------------------------------------------------
// 3. the mobile drawer's brand mark, if it still shows the old crest
// ---------------------------------------------------------------------------
{
  const f = path.join(ROOT, "index.html");
  let t = fs.readFileSync(f, "utf8");
  const n = (t.match(/M10/g) || []).length;
  console.log(`   "M10" occurrences left in index.html: ${n}`);
}

// ---------------------------------------------------------------------------
// 4. the same for the rail badge's gradient id (one per document)
// ---------------------------------------------------------------------------
for (const p of PAGES) {
  const f = path.join(ROOT, p + ".html");
  let t = fs.readFileSync(f, "utf8");
  const before = t;
  t = t.replace(/id="msg-en-home"/g, 'id="cr7-mark"');
  t = t.replace(/url\(#msg-en-home\)/g, "url(#cr7-mark)");
  if (t !== before) fs.writeFileSync(f, t, "utf8");
}
console.log("ok  the rail mark's gradient id renamed");
