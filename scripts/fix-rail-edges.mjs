import fs from "node:fs";
import path from "node:path";
const ROOT = "D:/Projects/ronaldo-stats/";

// ---------------------------------------------------------------------------
// 1. CSS: the rail shows a hairline fade on whichever edge has more content,
//    so a link below the fold is never silently missing.
// ---------------------------------------------------------------------------
{
  const P = path.join(ROOT, "src", "styles.css");
  let css = fs.readFileSync(P, "utf8");
  if (css.includes("rail-more-bottom")) {
    console.log("ok  styles.css: the rail edge fades are already there");
  } else {
    css = css.replace(/\s*$/, "") + `

/* ================= rail: edge fades when there is more to scroll ============= */
@media (min-width: 901px) {
  .rail::before,
  .rail::after {
    content: "";
    position: absolute;
    left: 2px;
    right: 2px;
    height: 22px;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.16s ease;
    z-index: 4;
  }
  /* the top fade */
  .rail::before {
    top: 2px;
    background: linear-gradient(to bottom, var(--surface), transparent);
    border-radius: 22px 22px 0 0;
  }
  /* the bottom fade */
  .rail::after {
    bottom: 2px;
    background: linear-gradient(to top, var(--surface), transparent);
    border-radius: 0 0 22px 22px;
  }
  .rail.rail-more-top::before,
  .rail.rail-more-bottom::after { opacity: 1; }
}
`;
    fs.writeFileSync(P, css, "utf8");
    console.log("ok  styles.css: the rail edge fades");
  }
}

// ---------------------------------------------------------------------------
// 2. JS: toggle those classes from the nav's real scroll state
// ---------------------------------------------------------------------------
{
  const P = path.join(ROOT, "src", "app.js");
  let t = fs.readFileSync(P, "utf8");
  const EOL = t.includes("\r\n") ? "\r\n" : "\n";
  if (t.includes("function updateRailEdges()")) {
    console.log("ok  app.js: the rail edge logic is already there");
  } else {
    const find = `function centerActiveNav() {`.split("\n").join(EOL);
    const replace = `// The rail's own scroll position decides whether a fade is shown on
// the top or the bottom edge, so a link below the fold is never silently
// missing. The stylesheet promised this affordance but never implemented it.
function updateRailEdges() {
  const rail = document.querySelector(".rail");
  const nav = rail && rail.querySelector("nav");
  if (!rail || !nav) return;
  const canScroll = nav.scrollHeight > nav.clientHeight + 2;
  const atTop = nav.scrollTop <= 2;
  const atBottom = nav.scrollTop + nav.clientHeight >= nav.scrollHeight - 2;
  rail.classList.toggle("rail-more-top", canScroll && !atTop);
  rail.classList.toggle("rail-more-bottom", canScroll && !atBottom);
  if (canScroll && !atTop) {
    const navRect = nav.getBoundingClientRect();
    const active = nav.querySelector("a.on");
    if (active) {
      const r = active.getBoundingClientRect();
      if (r.top < navRect.top || r.bottom > navRect.bottom) {
        nav.scrollTop += r.top - navRect.top - navRect.height / 2 + r.height / 2;
      }
    }
  }
}

function centerActiveNav() {`.split("\n").join(EOL);
    if (!t.includes(find)) { console.error("centerActiveNav not found"); process.exit(1); }
    t = t.replace(find, replace);

    // call it on load, on resize and whenever the rail scrolls
    const hook = `  fixLocaleLinks();
  reveal();`.split("\n").join(EOL);
    const hookReplace = `  fixLocaleLinks();
  updateRailEdges();
  reveal();`.split("\n").join(EOL);
    if (!t.includes(hook)) { console.error("the boot hook not found"); process.exit(1); }
    t = t.replace(hook, hookReplace);

    const scrollHook = `  if (videoClose) videoClose.onclick = closeGoalVideo;`.split("\n").join(EOL);
    const scrollReplace = `  try {
    const railNav = document.querySelector(".rail nav");
    if (railNav) {
      railNav.addEventListener("scroll", updateRailEdges, { passive: true });
      window.addEventListener("resize", updateRailEdges, { passive: true });
      setTimeout(updateRailEdges, 60);
    }
  } catch (_) {}

  if (videoClose) videoClose.onclick = closeGoalVideo;`.split("\n").join(EOL);
    if (t.includes(scrollHook)) t = t.replace(scrollHook, scrollReplace);

    fs.writeFileSync(P, t, "utf8");
    console.log("ok  app.js: the rail edges are tracked");
  }
}
