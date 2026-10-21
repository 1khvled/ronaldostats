/**
 * Every page must only reference files the deployment actually contains.
 *
 *   node scripts/check-deploy-assets.mjs
 *
 * The eight localized pages once shipped with no stylesheet and no script:
 * their links were relative, so on /ar/index.html "src/styles.css" asked for
 * /ar/src/styles.css, which is not in the build. Nothing caught it, because a
 * page whose asset is missing still returns 200 - it just arrives unstyled.
 *
 * This walks every page in the deployment, resolves each local reference the
 * way a browser would (relative to the page) and fails when the file is not
 * there.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, "$1"), "..");
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

let missing = 0;
for (const page of pages) {
  const html = fs.readFileSync(page, "utf8");
  const refs = new Set();
  for (const m of html.matchAll(/(?:src|href)="([^"]+)"/g)) refs.add(m[1]);
  for (const m of html.matchAll(/srcset="([^"]+)"/g)) {
    for (const part of m[1].split(",")) refs.add(part.trim().split(/\s+/)[0]);
  }
  for (const ref of refs) {
    if (!ref || /^(https?:|data:|mailto:|tel:|javascript:|#|\/\/)/i.test(ref)) continue;
    const clean = ref.split("#")[0].split("?")[0];
    if (!clean) continue;
    // a reference without a file extension is a route, and the router serves
    // those; only a reference to a file can 404
    if (!/\.[a-z0-9]{2,6}$/i.test(clean)) continue;
    // a browser resolves a relative reference against the page's own folder
    const target = clean.startsWith("/")
      ? path.join(DIST, decodeURIComponent(clean))
      : path.resolve(path.dirname(page), decodeURIComponent(clean));
    if (fs.existsSync(target)) continue;
    missing++;
    console.log("  " + path.relative(DIST, page) + "  ->  " + ref + "   (not in the deployment)");
  }
}

console.log("pages checked: " + pages.length);
if (missing) {
  console.log("\nFAIL  " + missing + " reference(s) point at files the deployment does not have");
  process.exit(1);
}
console.log("every local reference on every page resolves to a file in the deployment");
console.log("\nPASS  the deployment has every file its pages ask for");
