/**
 * The orphan-page audit.
 *
 *   node scripts/check-orphans.mjs
 *
 * A page that nothing links to is a page Google can only find through the
 * sitemap, and a page a visitor can only reach by guessing a URL. This walks
 * every HTML page in the repository, follows every internal link and reports
 * the pages that no other page links to.
 *
 * The ad slots, the verification files and the embeddable pages are not
 * pages of the site: they are linked from the scripts that place them, not
 * from a page, so they are not orphans in this sense.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, "$1"), "..");
const SKIP_DIRS = new Set(["dist", "node_modules", ".git", "public/ads", "public/embed", ".vercel", "scripts", "build-cache"]);

function walk(dir, out = []) {
  for (const item of fs.readdirSync(dir)) {
    if (SKIP_DIRS.has(item) || item.startsWith(".")) continue;
    const full = path.join(dir, item);
    let st;
    try { st = fs.statSync(full); } catch (e) { continue; }
    if (st.isDirectory()) walk(full, out);
    else if (item.endsWith(".html")) out.push(full);
  }
  return out;
}

const files = walk(ROOT).map((f) => f.replace(/\\/g, "/"));
const pages = files.filter((f) => {
  const rel = f.replace(ROOT.replace(/\\/g, "/") + "/", "");
  return !/^(public\/ads|public\/embed|public\/yandex|public\/google)/.test(rel) && !/404/.test(rel);
});

// the slug of a page, and the folder it lives in
const slugOf = (f) => path.basename(f, ".html");
const folderOf = (f) => {
  const rel = f.replace(ROOT.replace(/\\/g, "/") + "/", "");
  const parts = rel.split("/");
  return parts.length > 1 ? parts[0] : "en";
};

// the internal links of every page
const incoming = new Map(pages.map((f) => [f, new Set()]));
for (const file of pages) {
  const content = fs.readFileSync(file, "utf8");
  const links = [...content.matchAll(/href=["']([^"']+)["']/g)].map((m) => m[1]);
  for (const url of links) {
    if (/^(https?:|mailto:|tel:|javascript:|#)/i.test(url)) continue;
    const clean = url.split("#")[0].split("?")[0];
    if (!clean) continue;
    for (const target of pages) {
      if (target === file) continue;
      const slug = slugOf(target);
      const folder = folderOf(target);
      let hit = false;
      if (slug === "index") {
        // /en, /es, ... or /
        hit = clean === "/" || clean === "/" + folder || clean === "/" + folder + "/" || clean === "/" + folder + "/index.html";
      } else {
        hit = clean === "/" + folder + "/" + slug || clean === "/" + folder + "/" + slug + ".html" || clean.endsWith("/" + slug + ".html") || clean.endsWith("/" + slug);
      }
      if (hit) incoming.get(target).add(file);
    }
  }
}

const orphans = [];
for (const [file, refs] of incoming) {
  if (refs.size === 0) orphans.push(file);
}

const rel = (f) => f.replace(ROOT.replace(/\\/g, "/") + "/", "");
console.log("pages audited: " + pages.length);
if (orphans.length) {
  console.log("\n[ORPHAN] these pages have no incoming internal link:");
  for (const o of orphans.sort()) console.log("   " + rel(o));
  console.log("\nFAIL  " + orphans.length + " orphan page(s)");
  process.exit(1);
}
console.log("every page is linked from at least one other page");
console.log("\nPASS  no orphan pages");
