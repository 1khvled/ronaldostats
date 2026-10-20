import fs from "node:fs";
import path from "node:path";
const ROOT = "D:/Projects/ronaldo-stats/";
const LANGS = ["es", "pt", "fr", "ar", "bn", "hi", "ro", "uz"];

const Q = {
  en: ["What is Ronaldo's record at Real Madrid?", "Ronaldo at Real Madrid page"],
  es: ["¿Cuál es el récord de Ronaldo en el Real Madrid?", "página de Ronaldo en el Real Madrid"],
  pt: ["Qual é o retrospecto de Ronaldo no Real Madrid?", "página de Ronaldo no Real Madrid"],
  fr: ["Quel est le bilan de Ronaldo au Real Madrid ?", "page de Ronaldo au Real Madrid"],
  ar: ["ما هو سجل رونالدو في ريال مدريد؟", "صفحة رونالدو في ريال مدريد"],
  bn: ["রিয়াল মাদ্রিদে রোনালদোর রেকর্ড কী?", "রিয়াল মাদ্রিদে রোনালদোর পাতা"],
  hi: ["रियल मैड्रिड में रोनाल्डो का रिकॉर्ड क्या है?", "रियल मैड्रिड में रोनाल्डो वाला पेज"],
  ro: ["Care este bilanul lui Ronaldo la Real Madrid?", "pagina lui Ronaldo la Real Madrid"],
  uz: ["Real Madridda Ronaldo natijasi qanday?", "Real Madridda Ronaldo sahifasi"],
};

for (const lang of ["en", ...LANGS]) {
  const P = path.join(ROOT, "src/i18n", lang + ".js");
  let t = fs.readFileSync(P, "utf8");
  const marker = "/${lang}/real-madrid\">";
  const i = t.indexOf(marker);
  if (i < 0) { console.log("  " + lang + ": the FAQ link was not found"); continue; }

  // the link text sits right after the marker
  const after = t.slice(i + marker.length, i + marker.length + 220);
  const linkMatch = after.match(/^([^<>]{2,90}?)<\/a>/);
  if (!linkMatch) { console.log("  " + lang + ": the link text was not found -> " + JSON.stringify(after.slice(0, 50))); continue; }
  const oldLink = linkMatch[1];

  // the question is the first quoted string of the same array entry
  const entryStart = t.lastIndexOf('["', i);
  const qMatch = t.slice(entryStart, entryStart + 260).match(/^\["([^"]+)"/);
  if (!qMatch) { console.log("  " + lang + ": the question was not found"); continue; }
  const oldQ = qMatch[1];

  t = t.replace('["' + oldQ + '"', '["' + Q[lang][0] + '"');
  t = t.replace(">" + oldLink + "</a>", ">" + Q[lang][1] + "</a>");
  fs.writeFileSync(P, t, "utf8");
  console.log("ok  " + lang + ": \"" + oldQ.slice(0, 34) + "\" -> \"" + Q[lang][0].slice(0, 34) + "\"");
}
