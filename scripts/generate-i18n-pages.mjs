// Generate the eight localized page shells from the English ones.
//
//   node scripts/generate-i18n-pages.mjs            -> every language
//   node scripts/generate-i18n-pages.mjs es pt      -> only those
//
// For each language it
//   1. swaps every translatable string using src/i18n/shell/<lang>.json,
//   2. rewrites <html lang> / dir, the canonical, the 26-alternate hreflang
//      block, og:url, og:locale and the internal links,
//   3. writes <lang>/<slug>.html.
//
// It never touches the English shells and never edits a data file.
import fs from "node:fs";
import path from "node:path";
import { substitute } from "./lib/html-tokenizer.mjs";

const ROOT = path.resolve("D:/Projects/ronaldo-stats");
const SHELL_DIR = path.join(ROOT, "src", "i18n", "shell");
const ORIGIN = "https://www.ronaldostats.site";

const PAGES = {
  index: "index",
  dashboard: "dashboard",
  goalsbyyear: "goalsbyyear",
  goalsbyseason: "goalsbyseason",
  timeline: "timeline",
  achievements: "achievements",
  birthday: "birthday",
  "latest-goal": "latest-goal",
  "champions-league": "champions-league",
  gear: "gear",
  "vs-real-madrid": "vs-real-madrid",
  "ronaldo-vs-messi": "ronaldo-vs-messi",
};

const LANGS = {
  es: { dir: "ltr", locale: "es_ES", alts: ["es_AR", "es_ES"] },
  pt: { dir: "ltr", locale: "pt_BR", alts: ["pt_BR", "pt_PT"] },
  fr: { dir: "ltr", locale: "fr_FR", alts: ["fr_FR", "fr_CA"] },
  ar: { dir: "rtl", locale: "ar_EG", alts: ["ar_EG"] },
  bn: { dir: "ltr", locale: "bn_BD", alts: ["bn_BD", "bn_IN"] },
  hi: { dir: "ltr", locale: "hi_IN", alts: ["hi_IN"] },
  ro: { dir: "ltr", locale: "ro_RO", alts: ["ro_RO"] },
  uz: { dir: "ltr", locale: "uz_UZ", alts: ["uz_UZ"] },
};

const wanted = process.argv.slice(2).filter((a) => LANGS[a]);
const langs = wanted.length ? wanted : Object.keys(LANGS);

// The home page lives at /<lang>; every other page at /<lang>/<slug>.
const pagePath = (slug) => (slug === "index" ? "" : "/" + slug);

const only = process.argv.slice(2).filter((a) => !LANGS[a] && a !== "--verbose");

// The hreflang set every page carries (base language + regional variants).
const HREFLANGS = [
  ["en", "en-US", "en-NG", "en-IN", "en-PH"],
  ["es", "es-AR", "es-ES"],
  ["pt", "pt-BR", "pt-PT"],
  ["fr", "fr-FR", "fr-CA"],
  ["ar", "ar-EG"],
  ["bn", "bn-BD", "bn-IN"],
  ["hi", "hi-IN"],
  ["ro", "ro-RO"],
  ["uz", "uz-UZ"],
];

const TRANSLATABLE_ATTRS = ["title", "alt", "placeholder", "aria-label", "label", "value", "aria-description", "data-label"];

function localeBase(code) {
  return code.split("-")[0];
}

function localizeHtml(html, lang, slug, dict) {
  const path = pagePath(slug);
  // 1. copy substitution
  const map = {};
  for (const [src, dst] of Object.entries(dict || {})) map[src] = dst;
  let out = substitute(html, map, { text: true, attrs: TRANSLATABLE_ATTRS }).html;

  // 2. <html lang> / dir
  out = out.replace(/<html\b([^>]*)>/i, (m, attrs) => {
    let a = attrs.replace(/\slang="[^"]*"/i, "").replace(/\sdir="[^"]*"/i, "");
    return `<html lang="${lang}" dir="${LANGS[lang].dir}"${a}>`;
  });

  // 3. canonical
  out = out.replace(/<link\b[^>]*rel="canonical"[^>]*>/i, `<link rel="canonical" href="${ORIGIN}/${lang}${path}"/>`);

  // 4. hreflang block — rebuild it wholesale so it is identical everywhere
  const altLinks = [];
  for (const [base, ...variants] of HREFLANGS) {
    for (const code of [base, ...variants]) {
      const target = code === base ? base : code;
      altLinks.push(`<link hreflang="${code}" rel="alternate" href="${ORIGIN}/${target}${pagePath(slug)}"/>`);
    }
  }
  altLinks.push(`<link hreflang="x-default" rel="alternate" href="${ORIGIN}/en${path}"/>`);
  const altBlock = altLinks.join("\n");
  out = out.replace(/<link\b[^>]*rel="alternate"[^>]*>(\s*<link\b[^>]*rel="alternate"[^>]*>)*/i, altBlock);

  // 5. og:url / twitter:url / og:locale
  out = out.replace(/<meta\b[^>]*property="og:url"[^>]*content="[^"]*"[^>]*>/i, `<meta property="og:url" content="${ORIGIN}/${lang}${path}"/>`);
  out = out.replace(/<meta\b[^>]*name="twitter:url"[^>]*content="[^"]*"[^>]*>/i, `<meta name="twitter:url" content="${ORIGIN}/${lang}${path}"/>`);
  out = out.replace(/<meta\b[^>]*property="og:locale"[^>]*content="[^"]*"[^>]*>/i, `<meta property="og:locale" content="${LANGS[lang].locale}"/>`);
  out = out.replace(/<meta\b[^>]*property="og:locale:alternate"[^>]*content="[^"]*"[^>]*>/i, "");

  // 6. schema.org url inside the JSON-LD blocks
  out = out.replace(/"url"\s*:\s*"https:\/\/www\.ronaldostats\.site\/[^"]*"/g, `"url": "${ORIGIN}/${lang}${path}"`);
  out = out.replace(/"contentUrl"\s*:\s*"https:\/\/www\.ronaldostats\.site\/[^"]*"/g, `"contentUrl": "${ORIGIN}/${lang}${path}"`);

  // 7. internal links
  out = out.replace(/href="\/(?:en|es|pt|fr|ar|bn|hi|ro|uz)(\/[^"]*)?"/g, (m, rest) => `href="/${lang}${rest || ""}"`);
  out = out.replace(/\/en\/([a-z0-9-]+)\.html/g, `/${lang}/$1.html`);

  // 8. the renderer is served from the site root, so the localized pages
  //    must reference it absolutely
  out = out.replace(/src="(src\/[a-z0-9.-]+\.js)"/g, 'src="/$1"');

  return out;
}

let totalMissing = 0;
for (const lang of langs) {
  const dictFile = path.join(SHELL_DIR, lang + ".json");
  if (!fs.existsSync(dictFile)) {
    console.error(`missing dictionary: src/i18n/shell/${lang}.json — run scripts/extract-shell-strings.mjs then translate it`);
    process.exitCode = 1;
    continue;
  }
  const dict = JSON.parse(fs.readFileSync(dictFile, "utf8"));
  const outDir = path.join(ROOT, lang);
  fs.mkdirSync(outDir, { recursive: true });
  for (const [slug, file] of Object.entries(PAGES)) {
    const src = path.join(ROOT, file + ".html");
    const html = fs.readFileSync(src, "utf8");
    const localized = localizeHtml(html, lang, slug, dict);
    fs.writeFileSync(path.join(outDir, slug + ".html"), localized, "utf8");
  }
  console.log(`${lang}: ${Object.keys(PAGES).length} pages written (${Object.keys(dict).length} strings)`);
}
