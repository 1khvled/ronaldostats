import fs from "node:fs";
const APP = "D:/Projects/ronaldo-stats/src/app.js";
let t = fs.readFileSync(APP, "utf8");

const NOTES = {
  es: `<p class="caveat">Los penaltis (184), los tiros libres (66), los hat-tricks (66) y las asistencias (261) son cifras recopiladas provisionales hasta completar el conteo manual partido a partido.</p>`,
  pt: `<p class="caveat">Os pênaltis (184), os tiros livres (66), os hat-tricks (66) e as assistências (261) são números provisórios até a conclusão da contagem manual jogo a jogo.</p>`,
  fr: `<p class="caveat">Les penaltys (184), les coups francs (66), les triplés (66) et les passes décisives (261) sont des totaux provisoires en attente de vérification match par match.</p>`,
  ar: `<p class="caveat">ركلات الجزاء (184) وركلات حرة مباشرة (66) والثلاثيات (66) والصناعة الحاسمة (261) أرقام مجمّعة منشورة على نطاق واسع، وتُعرض كمؤقتة حتى تكتمل المراجعة اليدوية مباراة بمباراة.</p>`,
  bn: `<p class="caveat">পেনাল্টি (184), সরাসরি ফ্রি-কিক (66), হ্যাট-ট্রিক (66) এবং অ্যাসিস্ট (261) হলো প্রচলিতভাবে প্রকাশিত সংক্ষিপ্ত হিসাব, যা প্রতিটি ম্যাচ আলাদা করে হাতে গণনা সম্পন্ন না হওয়া পর্যন্ত প্রাক্ষণিক হিসেবে দেখানো হয়।</p>`,
  hi: `<p class="caveat">पेनाल्टी (184), सीधे फ्री-किक (66), हैट-ट्रिक (66) और सहायता (261) व्यापक रूप से प्रकाशित संकलित आँकड़े हैं, जिन्हें प्रत्येक मैच का हाथ से गिनती पूरी होने तक अस्थायी माना जाता है।</p>`,
  ro: `<p class="caveat">Penalty-urile (184), loviturile libere (66), hat-trick-urile (66) și pasele decisive (261) sunt cifre compilate publicate pe scară largă, afișate ca provizorii până la finalizarea numărării manuale meci cu meci.</p>`,
  uz: `<p class="caveat">Penalty (184), to'g'ridan-to'g'ri erkin zarbalar (66), het-triklar (66) va assistlar (261) — bular keng tarqalgan yig'ilma hisoblar bo'lib, har bir o'yin bo'yicha qo'lda hisoblash tugagunga qadar vaqtinchalik deb ko'rsatiladi.</p>`,
};
const EN = `<p class="caveat">Penalties (184), direct free kicks (66), hat-tricks (66) and assists (261) are widely published compiled tallies, shown as provisional until a true match-by-match hand count is finished.</p>`;

const body = Object.entries(NOTES)
  .map(([k, v]) => `    ${k}: \`${v}\`,`)
  .join("\n");
const replacement = `function provisionalNote() {
  const lang = getLang();
  const notes = {
${body}
  };
  return notes[lang] || \`${EN}\`;
}`;

const start = t.indexOf("function provisionalNote() {");
if (start < 0) { console.error("provisionalNote not found"); process.exit(1); }
const open = t.indexOf("{", start);
let depth = 0, i = open;
for (; i < t.length; i++) {
  if (t[i] === "{") depth++;
  else if (t[i] === "}") { depth--; if (depth === 0) break; }
}
t = t.slice(0, start) + replacement + t.slice(i + 1);
fs.writeFileSync(APP, t, "utf8");
console.log("provisionalNote rewritten with Ronaldo's figures");
