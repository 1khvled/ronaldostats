import fs from "node:fs";
import path from "node:path";
const ROOT = "D:/Projects/ronaldo-stats/";

// 1. the gear store's two remaining small captions
{
  const P = path.join(ROOT, "src", "gear.css");
  let css = fs.readFileSync(P, "utf8");
  const before = css;
  css = css.replace(/(\.gear-rating-count \{[^}]*?font-size: )0\.74rem;/, "$10.78rem;");
  css = css.replace(/(\.gear-price-note \{[^}]*?font-size: )0\.7rem;/, "$10.78rem;");
  fs.writeFileSync(P, css, "utf8");
  console.log("ok  gear.css: the rating and price captions are at least 12px (" + (before === css ? "no change" : "updated") + ")");
}

// 2. the mobile floor and the inline-link hit area
{
  const P = path.join(ROOT, "src", "styles.css");
  let css = fs.readFileSync(P, "utf8");
  if (!css.includes("/* ---------- mobile: the 12px floor, everywhere ---------- */")) {
    css += `
/* ---------- mobile: the 12px floor, everywhere ----------
   A <small> is "smaller" than its parent by default, which quietly took the
   metadata below the floor. And a link inside a sentence is only as tall as
   the line, so its hit area is grown without moving the text. */
@media (max-width: 900px) {
  small {
    font-size: max(0.78rem, 12px) !important;
  }
  .kpi-note a,
  .kpi-card a,
  .footer-links a,
  .footer-group a,
  p a,
  li a,
  td a {
    display: inline-block;
    padding: 8px 2px;
    margin: -8px -2px;
    min-height: 40px;
  }
  .kpi-note a,
  .kpi-card a,
  p a,
  li a,
  td a {
    padding-top: 2px;
    padding-bottom: 2px;
    min-height: 0;
  }
}
`;
    fs.writeFileSync(P, css, "utf8");
    console.log("ok  styles.css: the 12px floor and the inline-link hit area");
  } else console.log("ok  styles.css: already there");
}
