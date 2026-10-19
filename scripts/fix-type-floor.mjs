import fs from "node:fs";
const CSS = "D:/Projects/ronaldo-stats/src/styles.css";
let css = fs.readFileSync(CSS, "utf8");

// The typography mandate: nothing below 12px (0.75rem). Reading paragraphs
// 15-16px, body/rows/data 14px, metadata floor 12px, chips/buttons 13px.
const FLOOR_REM = 0.75;
const seen = new Map();
let changed = 0;
css = css.replace(/font-size:\s*([0-9]*\.?[0-9]+)rem\s*;/g, (m, num) => {
  const v = parseFloat(num);
  seen.set(num, (seen.get(num) || 0) + 1);
  if (v >= FLOOR_REM) return m;
  changed++;
  return "font-size: 0.75rem;";
});
// px sizes below 12
css = css.replace(/font-size:\s*([0-9]+)px\s*;/g, (m, num) => {
  const v = parseInt(num, 10);
  seen.set(num + "px", (seen.get(num + "px") || 0) + 1);
  if (v >= 12) return m;
  changed++;
  return "font-size: 12px;";
});
fs.writeFileSync(CSS, css, "utf8");
console.log("font-size values found:", [...seen.entries()].sort((a, b) => parseFloat(a[0]) - parseFloat(b[0])).map(([k, v]) => `${k}×${v}`).join(" "));
console.log("raised to the 12px floor:", changed);
