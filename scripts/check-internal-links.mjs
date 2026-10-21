/**
 * Every internal route link must resolve to a page the deployment serves.
 *
 *   node scripts/check-internal-links.mjs
 *
 * The eight localized birthday hubs linked to /es/birthday/MM-DD, /pt/... and
 * so on - 219 of them, one per locale per date - and none of those pages
 * existed: the build writes the programmatic date pages in English only. Every
 * one of them was a 404 in the live site.
 *
 * check-deploy-assets.mjs could not see it: it only checks references that
 * carry a file extension, and a route has none. This one resolves the routes
 * the way the router does - a page in the build, or a rewrite or a redirect in
 * vercel.json - and fails when a link points at nothing.
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

// ---- the routes the build serves as files ------------------------------------
const fileRoutes = new Set();
const walk = (dir, prefix) => {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, item.name);
    if (item.isDirectory()) walk(p, prefix + "/" + item.name);
    else if (item.name.endsWith(".html")) {
      const rel = prefix + "/" + item.name;
      fileRoutes.add(rel.replace(/\/index\.html$/, "").replace(/\.html$/, ""));
    }
  }
};
walk(DIST, "");

// ---- the routes vercel.json serves through a rewrite or a redirect ----------
// Vercel source syntax: "/:lang(es|pt)/birthday/:key". Each entry becomes a
// regular expression, so a link is checked against the rule the router applies
// to it rather than against a guessed list of URLs.
const sourceToRegex = (source) => {
  let out = "";
  let i = 0;
  while (i < source.length) {
    const ch = source[i];
    if (ch === ":") {
      // a named parameter, with an optional pattern: :name, :name(a|b)
      let j = i + 1;
      while (j < source.length && /[A-Za-z0-9_]/.test(source[j])) j++;
      const name = source.slice(i + 1, j);
      let pattern = "[^/]+";
      if (source[j] === "(") {
        let depth = 1, k = j + 1;
        while (k < source.length && depth) {
          if (source[k] === "(") depth++;
          if (source[k] === ")") depth--;
          k++;
        }
        pattern = source.slice(j + 1, k - 1);
        j = k;
      }
      out += "(?:" + pattern + ")";
      i = j;
      continue;
    }
    if (ch === "*") {
      // a wildcard segment
      out += "[^/]*";
      i++;
      continue;
    }
    out += ch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    i++;
  }
  return new RegExp("^" + out + "$");
};

const vercel = JSON.parse(fs.readFileSync(path.join(ROOT, "vercel.json"), "utf8"));
const servedByConfig = [];
for (const rule of [...(vercel.rewrites || []), ...(vercel.redirects || [])]) {
  if (!rule.source || !rule.source.startsWith("/")) continue;
  servedByConfig.push({ re: sourceToRegex(rule.source), source: rule.source });
}

// a route the router serves
const resolves = (route) => {
  if (fileRoutes.has(route)) return true;
  for (const r of servedByConfig) if (r.re.test(route)) return true;
  return false;
};

// ---- walk every page and check its internal route links ----------------------
const pages = [];
const collect = (dir) => {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, item.name);
    if (item.isDirectory()) collect(p);
    else if (item.name.endsWith(".html")) pages.push(p);
  }
};
collect(DIST);

let broken = 0;
const reported = new Set();
for (const page of pages) {
  const html = fs.readFileSync(page, "utf8");
  const refs = new Set();
  for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) refs.add(m[1]);
  for (const ref of refs) {
    if (!ref || /^(https?:|data:|mailto:|tel:|javascript:|#|\/\/)/i.test(ref)) continue;
    const clean = ref.split("#")[0].split("?")[0];
    if (!clean.startsWith("/")) continue;
    // a reference with a file extension is a file: check-deploy-assets has it
    if (/\.[a-z0-9]{2,6}$/i.test(clean)) continue;
    const route = clean.replace(/\/+$/, "") || "/";
    if (resolves(route)) continue;
    // a route that exists as a file in the deployment (an extension the
    // router strips, a manifest, a font)
    const asFile = path.join(DIST, clean);
    if (fs.existsSync(asFile) || fs.existsSync(path.join(DIST, clean, "index.html"))) continue;
    if (reported.has(route)) continue;
    reported.add(route);
    broken++;
    console.log("  " + path.relative(DIST, page) + "  ->  " + ref + "   (no such page)");
  }
}

console.log("pages checked: " + pages.length + "   routes as files: " + fileRoutes.size + "   rules in vercel.json: " + servedByConfig.length);
if (broken) {
  console.log("\nFAIL  " + broken + " internal link(s) point at a page the deployment does not have");
  process.exit(1);
}
console.log("every internal route link resolves to a page the deployment has");
console.log("\nPASS  no broken internal links");
