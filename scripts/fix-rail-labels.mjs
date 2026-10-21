import fs from "node:fs";
const P = "D:/Projects/ronaldo-stats/src/styles.css";
let css = fs.readFileSync(P, "utf8");
const before = css;

// The mobile rail is a horizontal strip of icon-and-label pills that scrolls.
// Its labels were capped at 78 pixels, so "Goals by Year" and "Goals by
// Season" were cut to "Goals by Ye..." and "Goals by Se...". The strip
// scrolls, so a wider label costs nothing: the cap now fits the longest
// label in every language, and the ellipsis stays for the ones that are
// longer still.
css = css.replace(/(\.rail nav a span \{[^}]*?)max-width: 84px;/, "$1max-width: 116px;");
css = css.replace(/(\.rail nav a span \{[^}]*?)max-width: 78px;/, "$1max-width: 116px;");

fs.writeFileSync(P, css, "utf8");
console.log(before === css ? "  (nothing changed)" : "ok  the mobile rail labels are no longer cut short");
for (const m of css.matchAll(/\.rail nav a span \{[^}]*?max-width: (\d+)px;/g)) console.log("   a rail label cap: " + m[1] + "px");
