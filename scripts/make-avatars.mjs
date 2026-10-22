// Original monogram avatars for the head-to-head poll. The project hosts no
// photographs of the two players, so the poll uses geometric monograms in
// each player's colours.
import fs from "node:fs";
import path from "node:path";
const IMG = "D:/Projects/ronaldo-stats/public/img";

const avatar = (letter, bg, fg, ring) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" width="96" height="96" role="img" aria-label="${letter}">
  <circle cx="48" cy="48" r="46" fill="${bg}"/>
  <circle cx="48" cy="48" r="43" fill="none" stroke="${ring}" stroke-width="2"/>
  <text x="48" y="48" text-anchor="middle" dominant-baseline="central" font-family="Plus Jakarta Sans, DM Sans, system-ui, sans-serif" font-size="44" font-weight="800" fill="${fg}">${letter}</text>
</svg>
`;

fs.writeFileSync(path.join(IMG, "avatar-ronaldo.svg"), avatar("CR7", "#b31217", "#ffffff", "#f2ce6b"), "utf8");
fs.writeFileSync(path.join(IMG, "avatar-messi.svg"), avatar("LM", "#122a5e", "#ffffff", "#f2ce6b"), "utf8");
console.log("wrote avatar-ronaldo.svg and avatar-messi.svg");

// point the poll at them
const P = "D:/Projects/ronaldo-stats/ronaldo-vs-messi.html";
let t = fs.readFileSync(P, "utf8");
const before = t;
t = t.replace(/src="\/img\/messi\.webp" alt="Lionel Messi"/g, 'src="/img/avatar-messi.svg" alt="Lionel Messi"');
t = t.replace(/src="\/img\/ronaldo\.webp" alt="Cristiano Ronaldo"/g, 'src="/img/logo-cr7.webp" alt="Cristiano Ronaldo"');
if (t !== before) { fs.writeFileSync(P, t, "utf8"); console.log("ronaldo-vs-messi.html avatars repointed"); }
else console.log("no avatar reference changed");
