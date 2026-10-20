import fs from "node:fs";
const ROOT = "D:/Projects/ronaldo-stats/";
const F = ROOT + "birthday.html";
let t = fs.readFileSync(F, "utf8");
const EOL = t.includes("\r\n") ? "\r\n" : "\n";
function rep(find, replace) {
  const f = find.split("\n").join(EOL);
  const r = replace.split("\n").join(EOL);
  if (!t.includes(f)) { console.error("NOT FOUND: " + find.slice(0, 70)); return false; }
  t = t.replace(f, r);
  console.log("ok  " + find.trim().slice(0, 58));
  return true;
}

// 1. ids on the no-clip banner
rep(
  `      <div class="video-fallback-banner" id="video-fallback">
        <p><b>Match record, not a clip.</b></p>
        <p>Date, competition, opponent, scoreline, minutes and finish type, taken from primary match sheets.</p>
      </div>`,
  `      <div class="video-fallback-banner" id="video-fallback">
        <p><b id="bday-noclip-title">Match record, not a clip.</b></p>
        <p id="bday-noclip-body">Date, competition, opponent, scoreline, minutes and finish type, taken from primary match sheets.</p>
      </div>`);

// 2. the clip link
rep(
  `        <a class="btn btn-sm btn-primary" id="video-source-link" href="https://cr7allgoals.com/" target="_blank" rel="noopener noreferrer"></a>`,
  `        <a class="btn btn-sm" id="video-clip-link" href="https://cr7allgoals.com/" target="_blank" rel="noopener noreferrer" hidden></a>
        <a class="btn btn-sm btn-primary" id="video-source-link" href="https://cr7allgoals.com/" target="_blank" rel="noopener noreferrer"></a>`);

// 3. the page-level source note, right after the existing source paragraph
rep(
  `  <p>Every entry is a dated senior first-team match with an opponent, a competition and a scoreline. The international list follows RSSSF's appearance record (146 goals in 234 caps for Portugal); the club list is the open CR7-Goals-Project export, completed with the live goal tracker.</p>`,
  `  <p>Every entry is a dated senior first-team match with an opponent, a competition and a scoreline. The international list follows RSSSF's appearance record (146 goals in 234 caps for Portugal); the club list is the open CR7-Goals-Project export, completed with the live goal tracker.</p>
  <p id="bday-source-note" class="bday-source-note"></p>`);

fs.writeFileSync(F, t, "utf8");
console.log("birthday.html updated");
