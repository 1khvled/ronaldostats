import fs from "node:fs";
import path from "node:path";
const ROOT = "D:/Projects/ronaldo-stats/";
const P = path.join(ROOT, "src", "styles.css");
let css = fs.readFileSync(P, "utf8");
const before = css;
let n = 0;
const sub = (find, repl, label) => {
  if (!css.includes(find)) { console.log("  (not found) " + label); return; }
  css = css.split(find).join(repl);
  n++;
  console.log("  ok  " + label);
};

// 1. the mobile bottom-rail labels were 9.9px — below the 12px floor
sub(`  .rail nav a span {
    display: block !important;
    font-size: 0.62rem !important;`,
`  .rail nav a span {
    display: block !important;
    font-size: 0.75rem !important;`, "the bottom-rail labels are 12px");

// 2. the other sizes that sat under the floor
css = css.split("font-size: 0.72rem !important;").join("font-size: 0.75rem !important;");
css = css.split("font-size: 9px !important;").join("font-size: 12px !important;");

// 3. touch targets: nothing tappable should be shorter than 40px
css += `

/* ================= mobile: touch targets =================
   Every control a finger has to hit is at least 40px tall. The footer
   links and the small chips were 18-22px, which is a miss on a phone. */
@media (max-width: 900px) {
  .footer-links a,
  .footer-group a {
    display: inline-flex;
    align-items: center;
    min-height: 40px;
    padding: 2px 2px;
  }
  .mobile-topbar-brand {
    min-height: 44px;
  }
  .mobile-lang-btn {
    min-height: 40px;
    padding: 8px 14px;
  }
  .btn-copy-crypto {
    min-height: 40px;
    padding: 8px 14px;
  }
  .bday-explore-actions .btn-primary,
  .bday-explore-actions .btn-secondary {
    min-height: 44px;
  }
  .rail nav a span {
    max-width: 78px;
    line-height: 1.2;
  }
  .bday-goal-watch,
  .bday-watch-video-btn,
  .bday-yt-search-btn {
    min-height: 40px;
  }
}
`;

fs.writeFileSync(P, css, "utf8");
console.log("\n" + (before === css ? "nothing changed" : n + " rules updated") + "; the stylesheet is " + css.length + " bytes");
