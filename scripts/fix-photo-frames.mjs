import fs from "node:fs";
const P = "D:/Projects/ronaldo-stats/src/styles.css";
let css = fs.readFileSync(P, "utf8");
const before = css;

// 1. the chapter photos: the photographs are 16:9, so the frame is 16:9 too
//    and nothing is cropped off the top of the player's head
css = css.replace(
  /(body\[data-page="timeline"\] \.ch-photo img \{[^}]*?height:\s*)230px([^}]*?object-position:\s*)50% 18%/,
  "$1auto; aspect-ratio: 16 / 9;$250% 30%"
);

// 2. the milestone cards: the same photographs, and the frame was a thin
//    strip that cut the head off
css = css.replace(/(body\[data-page="timeline"\] \.ch-photo img \{[^}]*?)(height: 230px)/, "$1height: auto; aspect-ratio: 16 / 9;");
css = css.replace(/(\.tl-card-media \{[^}]*?)\s*max-height: 240px;/, "$1;");
css = css.replace(/(\.tl-card-media img \{[^}]*?)height: 220px;/, "$1height: auto;\n  aspect-ratio: 16 / 9;");
css = css.replace(/(\.tl-card-media img \{[^}]*?)object-position: 50% 20%;/, "$1object-position: 50% 30%;");

fs.writeFileSync(P, css, "utf8");
console.log(before === css ? "  (nothing changed)" : "ok  the photographs are now shown whole, 16:9, with no crop");

for (const sel of ['body[data-page="timeline"] .ch-photo img {', ".tl-card-media img {", ".tl-card-media {"]) {
  const i = css.indexOf(sel);
  console.log("\n--- " + sel + " ---");
  console.log(css.slice(i, i + 320).split("}")[0] + "}");
}
