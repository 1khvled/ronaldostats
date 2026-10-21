/**
 * Every page must load the site's runtime from the bundle.
 *
 *   node scripts/check-runtime-bundle.mjs
 *
 * The eight localized pages shipped the raw ES module from /src/app.js
 * instead of the bundle Vite builds. The raw module imports
 * "@vercel/analytics", a bare specifier a browser cannot resolve, so the
 * module never evaluated: those pages ran with no JavaScript at all - no
 * charts, no milestone stream, no filters, no dark mode.
 *
 * Nothing caught it. The page returned 200, the stylesheet was there, and
 * the asset check only asked whether the file existed - which it did.
 *
 * This gate asks the question a browser asks: does the page's script tag
 * point at a bundled asset, and does that asset exist?
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");

if (!fs.existsSync(DIST)) {
  console.error("no dist folder - run the build first");
  process.exit(1);
}

const pages = [];
const walk = (dir) => {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, item.name);
    if (item.isDirectory()) walk(p);
    else if (item.name.endsWith(".html")) pages.push(p);
  }
};
walk(DIST);

let raw = 0;
let missing = 0;
const languages = new Map();

for (const page of pages) {
  const html = fs.readFileSync(page, "utf8");
  const rel = path.relative(DIST, page).replace(/\\/g, "/");
  const lang = rel.split("/")[0];

  // the script tags the page loads
  const scripts = [...html.matchAll(/<script[^>]*\bsrc="([^"]+)"/gi)].map((m) => m[1]);
  const local = scripts.filter((s) => s.startsWith("/") && !/^https?:\/\//i.test(s));
  const styles = [...html.matchAll(/<link[^>]*\brel="stylesheet"[^>]*\bhref="([^"]+)"/gi)].map((m) => m[1]);

  // a page of the site must load the site's own runtime
  const appScript = local.find((s) => /\/src\/app\.js$/.test(s));
  if (appScript) {
    raw++;
    console.log("  " + rel + "  loads the raw source: " + appScript + "  (the browser cannot run it)");
    continue;
  }

  // and every local script and stylesheet it names must be in the build
  for (const ref of [...local, ...styles]) {
    const clean = ref.split("#")[0].split("?")[0];
    if (!clean || !clean.startsWith("/")) continue;
    if (!fs.existsSync(path.join(DIST, clean))) {
      missing++;
      console.log("  " + rel + "  ->  " + ref + "   (not in the deployment)");
    }
  }

  // the runtime the page runs. A page with no script at all (the verification
  // stubs) is not a page that runs the raw source - it runs nothing.
  if (!languages.has(lang)) languages.set(lang, { pages: 0, bundled: 0, raw: 0, none: 0 });
  const l = languages.get(lang);
  l.pages++;
  if (local.some((s) => /^\/assets\//.test(s))) l.bundled++;
  else if (appScript) l.raw++;
  else l.none++;
}

console.log("pages checked: " + pages.length);
for (const [lang, l] of [...languages.entries()].sort()) {
  console.log("  " + lang + ": " + l.pages + " pages, " + l.bundled + " on the bundle, " + l.raw + " on the raw source, " + l.none + " with no script");
}

if (raw || missing) {
  console.log("\nFAIL  " + raw + " page(s) load the raw runtime source and " + missing + " reference a file the build does not have");
  process.exit(1);
}
console.log("every page runs the bundled runtime");
console.log("\nPASS  the runtime is bundled on every page");
