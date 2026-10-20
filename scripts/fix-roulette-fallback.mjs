import fs from "node:fs";
import path from "node:path";
const P = path.join("D:/Projects/ronaldo-stats/", "src", "app.js");
let t = fs.readFileSync(P, "utf8");
const BT = String.fromCharCode(96);
const EOL = t.includes("\r\n") ? "\r\n" : "\n";

const find = [
  "    if (video && g.videoUrl) {",
  "      video.src = g.videoUrl;",
  "      video.load();",
  "      video.play().catch(() => {});",
  '      video.scrollIntoView({ behavior: "smooth", block: "center" });',
  "    }",
].join(EOL);

const repl = [
  "    if (video && g.videoUrl) {",
  "      video.src = g.videoUrl;",
  "      video.load();",
  "      video.play().catch(() => {});",
  '      video.scrollIntoView({ behavior: "smooth", block: "center" });',
  "    } else if (g.date) {",
  "      // the archive carries no clip of this goal: open its date in the",
  "      // Birthday Explorer, where that date's video plays",
  "      window.location.href = " + BT + "/${getCurrentLangCode()}/birthday/${g.date.slice(5)}" + BT + ";",
  "      return;",
  "    }",
].join(EOL);

if (t.includes(find)) {
  t = t.split(find).join(repl);
  fs.writeFileSync(P, t, "utf8");
  console.log("ok  app.js: the dedicated roulette falls back to the goal's date");
} else {
  console.log("  (the block was not found)");
  const i = t.indexOf("if (video && g.videoUrl)");
  console.log("  context: " + JSON.stringify(t.slice(i - 20, i + 220)));
}
