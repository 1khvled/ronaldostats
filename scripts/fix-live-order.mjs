import fs from "node:fs";
const P = "D:/Projects/ronaldo-stats/src/app.js";
let t = fs.readFileSync(P, "utf8");
const EOL = t.includes("\r\n") ? "\r\n" : "\n";

const block = `// The nine dictionary modules are separate files, so the helpers
// they call have to be reachable from their scope. Publishing them on the
// global object keeps the dictionaries self-contained: they format numbers
// with n(), escape with esc() and read the live registry with LIVE.
globalThis.n = n;
globalThis.esc = esc;
globalThis.bn = bn;
globalThis.LIVE = LIVE;`;

const find = block.split("\n").join(EOL);
if (!t.includes(find)) { console.error("block not found"); process.exit(1); }
// remove it from before the declaration
t = t.replace(find + EOL, "");
// and put it after the LIVE object
const anchor = `};${EOL}${EOL}/* Click a column header to sort.`;
if (!t.includes(anchor)) { console.error("anchor not found"); process.exit(1); }
t = t.replace(anchor, `};${EOL}${EOL}${block}${EOL}${EOL}/* Click a column header to sort.`);
fs.writeFileSync(P, t, "utf8");
console.log("ok  the helper publication now runs after the LIVE declaration");
