import fs from "node:fs";
import path from "node:path";
const ROOT = "D:/Projects/ronaldo-stats/";
const LANGS = ["es","pt","fr"];

const Q = {
  en: ["What is Ronaldo's record at Real Madrid?", "Ronaldo at Real Madrid page"],
  es: ["¿Cuál es el récord de Ronaldo en el Real Madrid?", "página de Ronaldo en el Real Madrid"],
  pt: ["Qual é o retrospecto de Ronaldo no Real Madrid?", "página de Ronaldo no Real Madrid"],
  fr: ["Quel est le bilan de Ronaldo au Real Madrid ?", "page Ronaldo au Real Madrid"],
};

for (const lang of ["en", ...LANGS]) {
  const P = path.join(ROOT, "src/i18n", lang + ".js");
  let t = fs.readFileSync(P, "utf8");
  const marker = "/${lang}/real-madrid\">";
  const i = t.indexOf(marker);
  if (i < 0) { console.log("  " + lang + ": the FAQ link was not found"); continue; }
  // the link text sits right after the marker
  const after = t.slice(i, i + 200);
  const linkMatch = after.match(/^([^<>]{3,80})<\/a>/);
  if (!linkMatch) { console.log("  " + lang + ": the link text was not found -> " + after.slice(0, 60)); continue; }
  const oldLink = linkMatch[1];
  const newLink = Q[lang][1];

  // the question is the first quoted string of the same array entry
  const entryStart = t.lastIndexOf('["', i);
  const qMatch = t.slice(entryStart, entryStart + 220).match(/^\["([^"]+)"/);
  if (!qMatch) { console.log("  " + lang + ": the question was not found"); continue; }
  const oldQ = qMatch[1];
  const newQ = Q[lang][0];

  t = t.replace('["' + oldQ + '"', '["' + newQ + '"');
  t = t.replace(">" + oldLink + "</a>", ">" + newLink + "</a>");
  fs.writeFileSync(P, t, "utf8");
  console.log("ok  " + lang + ": the FAQ question and its link now say \"at Real Madrid\"");
}
