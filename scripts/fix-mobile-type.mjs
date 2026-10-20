import fs from "node:fs";
import path from "node:path";
const ROOT = "D:/Projects/ronaldo-stats/";

// the last type sizes that sat under the 12px floor
{
  const P = path.join(ROOT, "src", "gear.css");
  let css = fs.readFileSync(P, "utf8");
  const before = css;
  css = css.replace(/\.tier-desc \{\s*font-size: 0\.72rem;/, ".tier-desc {\n  font-size: 0.78rem;");
  css = css.replace(/\.tier-cta \{\s*font-size: 0\.74rem;/, ".tier-cta {\n  font-size: 0.78rem;");
  css = css.replace(/font-size: 0\.75rem;/g, "font-size: 0.78rem;");
  fs.writeFileSync(P, css, "utf8");
  console.log("ok  gear.css: the donation-tier text is at least 12px (" + (before === css ? "no change" : "updated") + ")");
}
{
  const P = path.join(ROOT, "src", "styles.css");
  let css = fs.readFileSync(P, "utf8");
  const before = css;
  css = css.replace(/(\.club-name small \{\s*font-size: )0\.78rem;/g, "$10.8rem;");
  css = css.replace(/(\.legend \.lg-val small \{[^}]*?font-size: )0\.78rem;/g, "$10.8rem;");
  fs.writeFileSync(P, css, "utf8");
  console.log("ok  styles.css: the club-name and legend captions are at least 12px (" + (before === css ? "no change" : "updated") + ")");
}
