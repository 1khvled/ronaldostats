/**
 * Remove the stale raw-source copy so it cannot shadow the bundle.
 *
 *   node scripts/clean-runtime-copy.mjs
 *
 * The twelve English shells and the ninety-six localized pages are all Vite
 * inputs, so Vite bundles their stylesheet and script and rewrites the
 * references to the hashed files in /assets. That is the only shape that
 * works: the runtime source is an ES module with bare imports
 * ("@vercel/analytics"), which a browser cannot resolve.
 *
 * A copy of the source tree in public/src shadowed that: Vite treats a file
 * in publicDir as an asset to copy verbatim, so it left "/src/app.js" alone
 * and shipped the raw module. The browser then failed to resolve the bare
 * import, the module never evaluated, and every one of the eight localized
 * pages ran with no JavaScript at all - no charts, no milestone stream, no
 * filters, no dark mode. The page still returned 200 and still looked
 * styled, so nothing caught it.
 *
 * public/src is not tracked, so a stale copy survives on any machine that
 * ran an earlier build. This removes it before Vite runs, and the deployment
 * loses the duplicated 3 MB of source it was carrying.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "public", "src");

if (fs.existsSync(OUT)) {
  fs.rmSync(OUT, { recursive: true, force: true });
  console.log("clean-runtime-copy: removed the stale public/src (it shadowed the bundle)");
} else {
  console.log("clean-runtime-copy: no public/src to remove");
}
