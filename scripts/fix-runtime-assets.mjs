/**
 * Make the localized pages load the site's runtime assets.
 *
 *   node scripts/generate-i18n-pages.mjs (the change is in there)
 *   node scripts/copy-runtime-assets.mjs
 *
 * The twelve English shells are the inputs to the Vite build, so Vite bundles
 * their stylesheet and script and rewrites the references to the hashed files
 * in /assets. The localized pages are built from the same shells, but their
 * links are relative - "src/styles.css" on /ar/index.html asks for
 * /ar/src/styles.css, which is not in the build, so every localized page
 * shipped without a stylesheet and without a script.
 *
 * The generator now writes the runtime references as absolute paths
 * (/src/styles.css, /src/app.js), and the build copies the source tree into
 * the deployment so those paths resolve.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, "$1"), "..");

// --- 1. the generator writes absolute runtime references ---------------------
{
  const P = path.join(ROOT, "scripts", "generate-i18n-pages.mjs");
  let t = fs.readFileSync(P, "utf8").replace(/\r\n/g, "\n");
  const before = t;
  const from = '  out = out.replace(/src="(src\\/[a-z0-9.-]+\\.js)"/g, \'src="/$1"\');';
  const to = `  // the renderer and the stylesheet are served from the root: a relative
  // reference on /ar/index.html would ask for /ar/src/..., which the build does
  // not contain, and the page would ship with no stylesheet and no script
  out = out.replace(/(src|href)="(src\\/[a-z0-9.\\/-]+\\.(?:js|css))"/g, '$1="/$2"');`;
  if (!t.includes(from)) {
    console.log("  (the runtime-reference rule in generate-i18n-pages.mjs was not found)");
    const i = t.indexOf("src=\"/$1\"");
    if (i > 0) console.log("  it is here: " + JSON.stringify(t.slice(i - 120, i + 40)));
  } else {
    t = t.replace(from, to);
    fs.writeFileSync(P, t.replace(/\n/g, "\r\n"), "utf8");
    console.log(before === t ? "  (the generator was already right)" : "ok  generate-i18n-pages.mjs writes absolute runtime references");
  }
}

// --- 2. the build copies the source tree into the deployment -----------------
{
  const P = path.join(ROOT, "scripts", "copy-runtime-assets.mjs");
  fs.writeFileSync(P, `/**
 * Copy the runtime source into the deployment.
 *
 *   node scripts/copy-runtime-assets.mjs
 *
 * The twelve English shells are Vite inputs, so their stylesheet and script
 * are bundled and served from /assets. The localized pages are built from the
 * same shells and are served from /src, because the build has to write the
 * runtime files the pages ask for. Without them the localized pages ship
 * without a stylesheet and without a script.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\\/([A-Za-z]:)/, "$1"), "..");
const SRC = path.join(ROOT, "src");
const OUT = path.join(ROOT, "dist", "src");

let files = 0, bytes = 0;
const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
  files++;
  bytes += fs.statSync(from).size;
};
for (const item of fs.readdirSync(SRC, { withFileTypes: true })) {
  const from = path.join(SRC, item.name);
  const to = path.join(OUT, item.name);
  if (item.isDirectory()) {
    for (const sub of fs.readdirSync(from, { withFileTypes: true })) {
      if (sub.isDirectory()) {
        for (const leaf of fs.readdirSync(path.join(from, sub.name))) {
          copy(path.join(from, sub.name, leaf), path.join(to, sub.name, leaf));
        }
      } else {
        copy(path.join(from, sub.name), path.join(to, sub.name));
      }
    }
  } else {
    copy(from, to);
  }
}
console.log("copy-runtime-assets: " + files + " files (" + (bytes / 1024 / 1024).toFixed(1) + " MB) copied into dist/src");
`, "utf8");
  console.log("ok  scripts/copy-runtime-assets.mjs written");
}
