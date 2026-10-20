import fs from "node:fs";
const P = "D:/Projects/ronaldo-stats/src/gear.css";
let css = fs.readFileSync(P, "utf8");
const before = css;

// the product photographs come in portrait, square and landscape shapes, so
// the frame takes the shape of a product photo instead of a thin strip: the
// photograph is shown whole, with the listing's own white background around it
css = css.replace(
  /\.gear-card-header \{\s*position: relative;\s*background: #ffffff;\s*height: 250px;/,
  ".gear-card-header {\n  position: relative;\n  background: #ffffff;\n  height: auto;\n  aspect-ratio: 4 / 5;\n  max-height: 430px;"
);
// the two narrow-screen overrides
css = css.replace(
  /\.gear-card-header \{\s*height: 240px;\s*padding: 14px 14px 10px;/g,
  ".gear-card-header {\n    height: auto;\n    aspect-ratio: 4 / 5;\n    max-height: 380px;\n    padding: 14px 14px 10px;"
);

fs.writeFileSync(P, css, "utf8");
console.log(before === css ? "  (the gear frame was not changed)" : "ok  the gear frame now fits a product photograph on every width");
let i = -1;
let n = 0;
while ((i = css.indexOf(".gear-card-header {", i + 1)) >= 0) {
  n++;
  console.log("\n--- rule " + n + " ---");
  console.log(css.slice(i, i + 240).split("}")[0] + "}");
}
