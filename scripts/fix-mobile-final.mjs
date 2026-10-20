import fs from "node:fs";
import path from "node:path";
const ROOT = "D:/Projects/ronaldo-stats/";

// 1. the gear store: the badges and the category labels were 11.2-11.5px
{
  const P = path.join(ROOT, "src", "gear.css");
  let css = fs.readFileSync(P, "utf8");
  const before = css;
  css = css.replace(/(\.gear-badge \{[^}]*?font-size: )0\.7rem;/, "$10.78rem;");
  css = css.replace(/(\.gear-category \{[^}]*?font-size: )0\.72rem;/, "$10.78rem;");
  css = css.replace(/(\.gear-card-title \{[^}]*?font-size: )0\.74rem;/, "$10.78rem;");
  fs.writeFileSync(P, css, "utf8");
  console.log("ok  gear.css: the badge and category labels are at least 12px (" + (before === css ? "no change" : "updated") + ")");
}

// 2. the dashboard's body-part captions
{
  const P = path.join(ROOT, "src", "styles.css");
  let css = fs.readFileSync(P, "utf8");
  const before = css;
  css = css.replace(/(\.dash-bar-meta \{[^}]*?font-size: )0\.73rem;/, "$10.8rem;");
  css = css.replace(/(\.dash-bar-meta span \{[^}]*?font-size: )0\.73rem;/, "$10.8rem;");
  // a section heading's link is a tap target on a phone
  css += `
/* ---------- mobile: the link beside a section heading is a real button ---------- */
@media (max-width: 900px) {
  .section-head a,
  .shead a {
    display: inline-flex;
    align-items: center;
    min-height: 40px;
    padding: 0 2px;
  }
  .dash-bar-meta,
  .dash-bar-meta span {
    font-size: max(0.8rem, 12px);
  }
}
`;
  fs.writeFileSync(P, css, "utf8");
  console.log("ok  styles.css: the dashboard captions and the section-heading links are fixed (" + (before === css ? "only the new block" : "updated") + ")");
}
