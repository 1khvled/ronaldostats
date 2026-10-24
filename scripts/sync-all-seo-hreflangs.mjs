import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

const LANGS = ["en", "es", "pt", "fr"];

const PAGES = [
  "index",
  "dashboard",
  "goalsbyseason",
  "goalsbyyear",
  "timeline",
  "trophies",
  "champions-league",
  "gear",
  "real-madrid",
  "ronaldo-vs-messi"
];

const HREFLANGS = [
  ["en", "en-US", "en-NG", "en-IN", "en-PH"],
  ["es", "es-AR", "es-ES"],
  ["pt", "pt-BR", "pt-PT"],
  ["fr", "fr-FR", "fr-CA"]
];

function getHreflangTags(pageSlug) {
  const slugPath = pageSlug === "index" || !pageSlug ? "" : `/${pageSlug}`;
  const tags = [];
  for (const [base, ...variants] of HREFLANGS) {
    for (const code of [base, ...variants]) {
      tags.push(`<link rel="alternate" hreflang="${code}" href="https://www.ronaldostats.site/${base}${slugPath}"/>`);
    }
  }
  tags.push(`<link rel="alternate" hreflang="x-default" href="https://www.ronaldostats.site/en${slugPath}"/>`);
  return tags.join("\n");
}

function updateFileHreflangs(filePath, lang, slug) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, "utf8");

  const slugPath = slug === "index" || !slug ? "" : `/${slug}`;
  const canonicalUrl = `https://www.ronaldostats.site/${lang}${slugPath}`;
  const canonicalTag = `<link rel="canonical" href="${canonicalUrl}"/>`;
  const hreflangs = getHreflangTags(slug);

  content = content.replace(/<link[^>]+rel=["']canonical["'][^>]*>\s*/gi, "");
  content = content.replace(/<link[^>]+href=["'][^"']+["'][^>]+rel=["']canonical["'][^>]*>\s*/gi, "");
  content = content.replace(/<link[^>]+hreflang=["'][^"']+["'][^>]*>\s*/gi, "");
  content = content.replace(/<link[^>]+rel=["']alternate["'][^>]+hreflang=["'][^"']+["'][^>]*>\s*/gi, "");

  const block = `\n${canonicalTag}\n${hreflangs}\n`;

  if (/<meta[^>]+name=["']description["'][^>]*>/i.test(content)) {
    content = content.replace(/(<meta[^>]+name=["']description["'][^>]*>)/i, `$1${block}`);
  } else if (/<head[^>]*>/i.test(content)) {
    content = content.replace(/(<head[^>]*>)/i, `$1${block}`);
  }

  fs.writeFileSync(filePath, content, "utf8");
}

for (const lang of LANGS) {
  for (const page of PAGES) {
    const file = page === "index"
      ? path.join(rootDir, lang === "en" ? "index.html" : `${lang}/index.html`)
      : path.join(rootDir, lang === "en" ? `${page}.html` : `${lang}/${page}.html`);
    updateFileHreflangs(file, lang, page);
  }
}

console.log("Synchronized canonicals and hreflang tags across 4 languages.");
