import fs from "node:fs";
const P = "D:/Projects/ronaldo-stats/src/app.js";
let t = fs.readFileSync(P, "utf8");
const EOL = t.includes("\r\n") ? "\r\n" : "\n";

const find = `function updateRailEdges() {
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
}`.split("\n").join(EOL);

const replace = `function updateRailEdges() {
  const rail = document.querySelector(".rail");
  const nav = rail && rail.querySelector("nav");
  if (!rail || !nav) return;
  // First keep the current page's link in view, then work out which edge
  // still has content behind it — the fades must describe the state the
  // visitor is actually looking at.
  const active = nav.querySelector("a.on");
  if (active) {
    const navRect = nav.getBoundingClientRect();
    const r = active.getBoundingClientRect();
    if (r.top < navRect.top || r.bottom > navRect.bottom) {
      nav.scrollTop += r.top - navRect.top - navRect.height / 2 + r.height / 2;
    }
  }
  const canScroll = nav.scrollHeight > nav.clientHeight + 2;
  const atTop = nav.scrollTop <= 2;
  const atBottom = nav.scrollTop + nav.clientHeight >= nav.scrollHeight - 2;
  rail.classList.toggle("rail-more-top", canScroll && !atTop);
  rail.classList.toggle("rail-more-bottom", canScroll && !atBottom);
}`.split("\n").join(EOL);

if (!t.includes(find)) { console.error("updateRailEdges not found"); process.exit(1); }
t = t.replace(find, replace);
fs.writeFileSync(P, t, "utf8");
console.log("ok  app.js: the fades now describe the real scroll state");
