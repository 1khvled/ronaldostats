/**
 * Put the runtime source where the pages can load it.
 *
 *   node scripts/copy-runtime-assets.mjs
 *
 * The twelve English shells are Vite inputs, so Vite bundles their stylesheet
 * and script and rewrites the references to the hashed files in /assets. The
 * localized pages are built from the same shells and are served from /src,
 * because the build has to write the runtime files the pages ask for.
 *
 * The files therefore have to be in public/ when Vite builds: Vite copies
 * public/ into the deployment and leaves a /src/... reference alone. Without
 * them it drops the reference, and the eight localized pages ship with no
 * stylesheet and no script.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, "$1"), "..");
const SRC = path.join(ROOT, "src");
const OUT = path.join(ROOT, "public", "src");

fs.rmSync(OUT, { recursive: true, force: true });

let files = 0, bytes = 0;
const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
  files++;
  bytes += fs.statSync(from).size;
};
const walk = (dir) => {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const from = path.join(dir, item.name);
    if (item.isDirectory()) walk(from);
    else copy(from, path.join(OUT, path.relative(SRC, from)));
  }
};
walk(SRC);
console.log("copy-runtime-assets: " + files + " files (" + (bytes / 1024 / 1024).toFixed(1) + " MB) copied into public/src");
