import fs from "node:fs";
const ROOT = "D:/Projects/ronaldo-stats/";

// --- 1. the keyword lists: the meta tag carries content before name ---------
{
  const P = ROOT + "/scripts/apply-seo-parity.mjs";
  let t = fs.readFileSync(P, "utf8");
  const before = t;
  t = t.replace(
    '  // 1. the keywords\n  html = html.replace(/(<meta[^>]*name="keywords"[^>]*content=")[^"]*(")/, "$1" + KEYWORDS[page] + "$2");',
    '  // 1. the keywords (the meta tag carries content before name, or the other way round)\n  html = html.replace(/(<meta[^>]*name="keywords"[^>]*content=")[^"]*(")/, "$1" + KEYWORDS[page] + "$2");\n  html = html.replace(/(<meta[^>]*content=")[^"]*("[^>]*name="keywords")/, "$1" + KEYWORDS[page] + "$2");'
  );
  // the third product is the Portugal national team shirt, not a 2006-07 shirt
  t = t.replace('ronaldo retro jersey, ronaldo football boots', 'ronaldo portugal national team shirt, ronaldo football boots');
  fs.writeFileSync(P, t, "utf8");
  console.log(before === t ? "  (the keyword rule was already right)" : "ok  apply-seo-parity.mjs: the keyword list is written in either attribute order");
}

// --- 2. the gear copy that still names a shirt that is not sold -------------
{
  const P = ROOT + "/src/i18n/shell";
  const LANGS = ["es", "pt", "fr", "ar", "bn", "hi", "ro", "uz"];
  // the phrase that named the 2006-07 shirt, in each language
  const PHRASE = {
    es: ["la camiseta local de 2006-07", "la camiseta de la selección portuguesa"],
    pt: ["a camisa de 2006-07", "a camisa da seleção portuguesa"],
    fr: ["maillot 2006-07", "maillot de la sélection portugaise"],
    ar: ["وقميص 2006-07", "وقميص منتخب البرتغال"],
    bn: ["২০০৬-০৭ জার্সি", "পর্তুগাল জাতীয় দলের জার্সি"],
    hi: ["2006-07 जर्सी", "पुर्तगाल राष्ट्रीय टीम की जर्सी"],
    ro: ["tricoul din 2006-07", "tricoul selecției portugheze"],
    uz: ["2006-07 futbolkasi", "Portugaliya milliy jamoasi futbolkasi"],
  };
  const en = JSON.parse(fs.readFileSync(P + "/en.json", "utf8"));
  for (const lang of LANGS) {
    const file = P + "/" + lang + ".json";
    const dict = JSON.parse(fs.readFileSync(file, "utf8"));
    const [from, to] = PHRASE[lang];
    let n = 0;
    for (const [k, v] of Object.entries(dict)) {
      if (typeof v !== "string" || !v.includes(from)) continue;
      dict[k] = v.split(from).join(to);
      n++;
    }
    const sorted = {};
    for (const k of Object.keys(dict).sort()) sorted[k] = dict[k];
    fs.writeFileSync(file, JSON.stringify(sorted, null, 1), "utf8");
    console.log("  " + lang + ": " + n + " strings");
  }
}
