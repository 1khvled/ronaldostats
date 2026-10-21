import fs from "node:fs";
const P = "D:/Projects/ronaldo-stats/CONTEXT.md";
const marker = "<!-- ADD NEW ENTRIES BELOW THIS LINE";
const entry = `
- 2026-10-21 — minimax-m3.1-flash-free — the eight localized pages were live with no stylesheet and no script. **What happened**: the twelve English shells are Vite inputs, so Vite bundles their stylesheet and script and rewrites the references to the hashed files in /assets. The localized pages are built from the same shells, and their links were relative - on /ar/index.html "src/styles.css" asks for /ar/src/styles.css, which is not in the build - so every page in eight languages shipped unstyled and dead. Nothing caught it: a page whose stylesheet is missing still returns 200, and the checks looked at the HTML rather than at the assets it asks for. **The fix**: the page generator now writes the runtime references as absolute paths (/src/styles.css, /src/app.js), and the build copies the source tree into public/src before Vite runs, so the deployment carries the files the pages ask for. **The gate**: scripts/check-deploy-assets.mjs walks all 495 pages of the deployment, resolves every local reference the way a browser would - relative to the page's own folder - and fails when the file is not there. It is part of the verification suite, and it fails on the exact bug it was written for. The verification suite now also runs the two post-build copies, so the dist it checks is the one that is deployed. **Live**: the Arabic, Spanish, Portuguese, French, Bengali, Hindi, Romanian and Uzbek pages now serve /src/styles.css and /src/app.js with 200, the rail is a fixed sidebar again, the fonts load, and the pages carry their content. Files: scripts/generate-i18n-pages.mjs, scripts/copy-runtime-assets.mjs, scripts/check-deploy-assets.mjs, scripts/verify-all.mjs, package.json, .gitignore, the twelve English shells and their 96 generated pages. Verify: \`npm run verify:all\` (19 gates green), the deployment's own asset gate (495 pages, every reference resolves), and the live site in eight languages.
`;
let t = fs.readFileSync(P, "utf8");
if (t.includes("the eight localized pages were live with no stylesheet")) { console.log("  (the entry is already there)"); }
else {
  const i = t.indexOf(marker);
  const lineEnd = t.indexOf("\n", i);
  t = t.slice(0, lineEnd + 1) + entry + t.slice(lineEnd + 1);
  fs.writeFileSync(P, t, "utf8");
  console.log("ok  CONTEXT.md: the entry is appended");
}
