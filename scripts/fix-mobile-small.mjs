import fs from "node:fs";
import path from "node:path";
const P = path.join(ROOT_SAFE(), "src", "styles.css");
function ROOT_SAFE() { return "D:/Projects/ronaldo-stats/"; }
let css = fs.readFileSync(P, "utf8");
if (!css.includes(".kpi small, .kpi-card small")) {
  css += `
/* ---------- mobile: nothing smaller than 12px, ever ---------- */
@media (max-width: 900px) {
  .kpi small,
  .kpi-card small,
  .qa small,
  .qa-grid small,
  .legend small,
  .table-card small,
  .card small {
    font-size: max(0.78rem, 12px);
  }
}
`;
  fs.writeFileSync(P, css, "utf8");
  console.log("ok  styles.css: the small captions are floored at 12px on mobile");
} else console.log("ok  styles.css: already floored");
