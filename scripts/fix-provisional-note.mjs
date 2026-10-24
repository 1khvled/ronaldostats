import fs from "node:fs";
const APP = "D:/Projects/ronaldo-stats/src/app.js";
let t = fs.readFileSync(APP, "utf8");

const NOTES = {
  es: `<p class="caveat">Los penaltis (184), los tiros libres (66), los hat-tricks (66) y las asistencias (261) son cifras recopiladas provisionales hasta completar el conteo manual partido a partido.</p>`,
  pt: `<p class="caveat">Os pênaltis (184), os tiros livres (66), os hat-tricks (66) e as assistências (261) são números provisórios até a conclusão da contagem manual jogo a jogo.</p>`,
  fr: `<p class="caveat">Les penaltys (184), les coups francs (66), les triplés (66) et les passes décisives (261) sont des totaux provisoires en attente de vérification match par match.</p>`,
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
