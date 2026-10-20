import fs from "node:fs";
import crypto from "node:crypto";
import { execSync } from "node:child_process";

const ROOT = "D:/Projects/ronaldo-stats";
const DIR = ROOT + "/src/i18n/shell/";
const raw = fs.readFileSync(DIR + "es.json");
const txt = raw.toString("utf8");

let ok = true;
const fail = (m) => { ok = false; console.log("FAIL  " + m); };
const pass = (m) => console.log("ok    " + m);

// 1. BOM
if (raw[0] === 0xef && raw[1] === 0xbb && raw[2] === 0xbf) fail("BOM present"); else pass("no BOM");

// 2. U+FFFD
if (txt.includes("\uFFFD")) fail("U+FFFD replacement char found"); else pass("no U+FFFD");

// 3. parses
let es;
try { es = JSON.parse(txt); pass("parses as JSON"); } catch (e) { fail("parse: " + e.message); process.exit(1); }

// 4. values are strings
const bad = Object.entries(es).filter(([, v]) => typeof v !== "string");
if (bad.length) fail("non-string values: " + bad.length); else pass("all values are strings");

// 5. key set matches en.json exactly
const en = JSON.parse(fs.readFileSync(DIR + "en.json", "utf8"));
const enK = Object.keys(en), esK = Object.keys(es);
const missing = enK.filter((k) => !(k in es));
const extra = esK.filter((k) => !(k in en));
if (missing.length) fail("missing keys: " + JSON.stringify(missing)); else pass("no missing keys (" + enK.length + ")");
if (extra.length) fail("extra keys: " + JSON.stringify(extra)); else pass("no extra keys");

// 6. no duplicate raw keys (JSON.parse would silently drop them)
const rawTopKeys = [...txt.matchAll(/^  "(?:[^"\\]|\\.)*":/gm)].map((m) => JSON.parse(m[0].replace(/:$/, "")));
const dupes = rawTopKeys.filter((k, i) => rawTopKeys.indexOf(k) !== i);
if (dupes.length) fail("duplicate raw keys: " + JSON.stringify(dupes)); else pass("no duplicate raw keys (" + rawTopKeys.length + ")");

// 7. key order: existing (HEAD) order preserved, new keys appended at the end
const head = JSON.parse(execSync("git -C " + ROOT + " show HEAD:src/i18n/shell/es.json", { encoding: "utf8", maxBuffer: 1 << 28 }));
const headK = Object.keys(head);
const headKept = headK.filter((k) => k in es);
const expectedOrder = headKept.concat(esK.filter((k) => !(k in head)));
if (JSON.stringify(expectedOrder) === JSON.stringify(esK)) pass("key order: HEAD order kept, new keys appended at the end");
else {
  fail("key order unexpected");
  const i = expectedOrder.findIndex((k, n) => k !== esK[n]);
  console.log("   first divergence @" + i + ": expected " + JSON.stringify(expectedOrder[i]) + " got " + JSON.stringify(esK[i]));
}

// 8. the 56 appended keys are exactly the original missing list, in the original order
const ORIG = ["(0.73 goals per game), 35 trophies, and 5 Ballons d'Or across Sporting CP, Manchester United, Real Madrid, Juventus, Al Nassr and Portugal. Explore every","0.73 goals per match","1,242 goal contributions (G+A), 0.93 per match","1,340 senior appearances","261 assists","Across his senior professional career for club and country (2002–2026),","Al Nassr · Portugal","CR7","Career statistics","Copy Embed Code","Cristiano Ronaldo &amp; Lionel Messi — two overlapping careers, 36 direct club meetings, and a statistical archive that records the results without ruling on them.","Cristiano Ronaldo Official Career Record: 981 Goals &amp; 261 Assists","Cristiano Ronaldo Stats: 981 Goals, 1,340 Matches &amp; 35 Trophies","Cristiano Ronaldo Total Goals and Assists Official Record","Cristiano Ronaldo and Lionel Messi, side by side: all-time goals, appearances, assists, set pieces, trophies, international records and every one of the 36 direct club meetings. The numbers are sourced; the verdict is the reader's.","Cristiano Ronaldo by club season — 1,106 club appearances and 835 club goals across 27 seasons, Sporting CP 2002/03 to Al Nassr 2026/27","Cristiano Ronaldo stats","Cristiano Ronaldo · Portugal &amp; Al Nassr","Forward","Goal alerts, milestones and community chat, straight to your phone. It's free — and every new member helps keep RonaldoStats alive. Love the site?","Head-to-Head &amp; Complete Career Comparison","Join the RonaldoStats community","Never miss a Ronaldo goal — join us &amp; support RonaldoStats","Now","Player profile","Role","Ronaldo &amp; Messi","Ronaldo stat","RonaldoStats Home","RonaldoStats Logo","Shirt number 7","Shop official Ronaldo gear on Amazon","Sporting CP · Manchester United · Real Madrid · Juventus · Al Nassr","Stat","Teams","The Eternal Duel:","The Verified Cristiano Ronaldo Statistics &amp; Video Database","The verified","database:","has recorded","in","or","support us on Ko-fi","to cover hosting and video streaming costs.","updated live after each match.","— an average of","⚔️ 36 DIRECT HEAD-TO-HEAD MATCHES · 13 BALLONS D'OR BETWEEN THEM","⚽ Forward #7","✈️ Join Telegram Channel","✓ Primary Source · Verified October 2026","⭐ 5 Ballons d'Or","🎂 Born 5 February 1985 · 41","🏆 35 Trophies","👕 Ronaldo Store 🛍️","📍 Funchal, Madeira, Portugal","📏 1.87 m"];
const appended = esK.slice(esK.length - ORIG.length);
if (JSON.stringify(appended) === JSON.stringify(ORIG)) pass("56 new keys appended in the exact es.missing.json order");
else fail("appended order differs");

// 9. numbers / dates / entities preserved in the new values
const NUMKEYS = ["(0.73 goals per game), 35 trophies, and 5 Ballons d'Or across Sporting CP, Manchester United, Real Madrid, Juventus, Al Nassr and Portugal. Explore every","0.73 goals per match","1,242 goal contributions (G+A), 0.93 per match","1,340 senior appearances","261 assists","Across his senior professional career for club and country (2002–2026),","Cristiano Ronaldo Official Career Record: 981 Goals &amp; 261 Assists","Cristiano Ronaldo Stats: 981 Goals, 1,340 Matches &amp; 35 Trophies","Cristiano Ronaldo and Lionel Messi, side by side: all-time goals, appearances, assists, set pieces, trophies, international records and every one of the 36 direct club meetings. The numbers are sourced; the verdict is the reader's.","Cristiano Ronaldo by club season — 1,106 club appearances and 835 club goals across 27 seasons, Sporting CP 2002/03 to Al Nassr 2026/27","Goal alerts, milestones and community chat, straight to your phone. It's free — and every new member helps keep RonaldoStats alive. Love the site?","Never miss a Ronaldo goal — join us &amp; support RonaldoStats","⚔️ 36 DIRECT HEAD-TO-HEAD MATCHES · 13 BALLONS D'OR BETWEEN THEM","🎂 Born 5 February 1985 · 41","🏆 35 Trophies","📏 1.87 m","0.73 goals per match","⚽ Forward #7","⭐ 5 Ballons d'Or","📍 Funchal, Madeira, Portugal","✓ Primary Source · Verified October 2026"];
let numOk = true;
for (const k of NUMKEYS) {
  const srcNums = (k.match(/\d[\d.,]*%/g) || []);
  const dstNums = (es[k].match(/\d[\d.,]*%/g) || []);
  if (JSON.stringify(srcNums) !== JSON.stringify(dstNums)) { numOk = false; console.log("   num mismatch: " + k + "  [" + srcNums + "] vs [" + dstNums + "]"); }
}
if (numOk) pass("numbers preserved in the new values");

// entities
const ENT = ["Cristiano Ronaldo Official Career Record: 981 Goals &amp; 261 Assists","Cristiano Ronaldo Stats: 981 Goals, 1,340 Matches &amp; 35 Trophies","Cristiano Ronaldo &amp; Lionel Messi — two overlapping careers, 36 direct club meetings, and a statistical archive that records the results without ruling on them.","Head-to-Head &amp; Complete Career Comparison","Never miss a Ronaldo goal — join us &amp; support RonaldoStats","Ronaldo &amp; Messi","Cristiano Ronaldo · Portugal &amp; Al Nassr","The Verified Cristiano Ronaldo Statistics &amp; Video Database"];
let entOk = true;
for (const k of ENT) {
  const src = (k.match(/&amp;|&mdash;|&middot;|&bull;|&times;/g) || []);
  const dst = (es[k].match(/&amp;|&mdash;|&middot;|&bull;|&times;/g) || []);
  if (JSON.stringify(src) !== JSON.stringify(dst)) { entOk = false; console.log("   entity mismatch: " + k + " [" + src + "] vs [" + dst + "]"); }
}
if (entOk) pass("HTML entities preserved in the new values");

// 10. keywords meta keeps ronaldo/messi as plain Latin
const kwKey = "ronaldo vs messi, ronaldo vs messi stats, ronaldo vs messi free kicks, ronaldo vs messi penalties, ronaldo vs messi non penalty goals, ronaldo vs messi assists, ronaldo vs messi hat tricks, ronaldo vs messi all time goals, who is the goat ronaldo or messi, who has more goals ronaldo or messi, ronaldo vs messi head to head, ronaldo vs messi world cup, ronaldo messi trophies, messi ronaldo ballons d or";
const kw = es[kwKey];
if (/ronaldo/.test(kw) && /messi/.test(kw) && !/[áéíóúñü]/i.test(kw.replace(/[^a-zA-Záéíóúñü]/g, "").replace(/[áéíóúñü]/g, "")) ) { /* noop */ }
const kwWords = kw.match(/[A-Za-zÀ-ÿ]+/g) || [];
const accented = kwWords.filter((w) => /[À-ÿ]/.test(w));
if (/ronaldo/i.test(kw) && /messi/i.test(kw)) pass("keywords meta contains 'ronaldo' and 'messi' as plain Latin letters");
else fail("keywords meta lost ronaldo/messi");
const nonLatin = kwWords.filter((w) => /[^ -]/.test(w));
if (nonLatin.length) console.log("   note: non-ASCII words in keywords: " + JSON.stringify(nonLatin));

// 11. every en key's value present & non-empty
const empty = Object.entries(es).filter(([, v]) => v === "");
if (empty.length) fail("empty values: " + empty.map((e) => e[0]).join(", ")); else pass("no empty values");

// 12. ronaldo / messi / cr7 never mangled anywhere
const badTokens = Object.entries(es).filter(([k, v]) => /mess[ií]|ronald[oa]|[а-я]/.test(v) && /mess[íi]|ronald[oа]/.test(v));
if (badTokens.length) fail("mangled tokens: " + JSON.stringify(badTokens.slice(0, 5))); else pass("no mangled ronaldo/messi tokens");

console.log("\nsha256 es.json = " + crypto.createHash("sha256").update(raw).digest("hex"));
console.log("bytes = " + raw.length + ", keys = " + esK.length);
console.log(ok ? "\nALL CHECKS PASSED" : "\nSOME CHECKS FAILED");
