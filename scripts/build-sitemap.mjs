import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const publicSitemap = path.join(rootDir, "public", "sitemap.xml");
const distSitemap = path.join(rootDir, "dist", "sitemap.xml");

const LANGS = ["en","es","pt","fr"];

const todayIso = new Date().toISOString().split("T")[0];

// Single source of truth — the central stat registry (scripts/stats.mjs),
// so the sitemap's career totals and "last goal" meta can never drift behind
// a new goal (previously hardcoded at #932 / 1,178).
import { S } from "./stats.mjs";

const CAREER_GOALS = S.goals;
const CAREER_APPS = S.apps;
const CAREER_TROPHIES = S.trophies;
const BALLONS_DOR = 8;
const LG = S.latestGoal;
const LG_NUM = LG?.goalNumber ?? CAREER_GOALS;
const LG_OPP = (LG?.opponent || "").trim();
const LG_TEAM = (LG?.team || "Al Nassr").replace(/\s+CF$/, "").trim();
const LG_MIN = (LG?.minute || "").replace(/'/g, "").trim();
const LG_FINISH = (LG?.finish || "left-foot").trim();
const LG_COMP = (LG?.competition || "Major League Soccer").trim();
const LG_DATE = (LG?.formattedDate || todayIso).trim();
const LG_VIDEO = LG?.videoUrl || `https://cr7allgoals.com/goal/${LG_NUM}/`;
// URL-safe slug fragments for title/tags
const LG_OPP_TAG = (LG_OPP || "Opponent").replace(/[^A-Za-z0-9]+/g, " ").trim();

// 934 → "934th" / "934e" / "934e" style helpers are avoided; templates
// interpolate the raw number and let the locale wording carry the grammar.

const SUBPAGES = [
  { slug: "dashboard", changefreq: "daily", priority: "0.9", lastmod: todayIso },
  { slug: "goalsbyseason", changefreq: "weekly", priority: "0.9", lastmod: todayIso },
  { slug: "goalsbyyear", changefreq: "weekly", priority: "0.9", lastmod: todayIso },
  { slug: "ronaldo-vs-messi", changefreq: "weekly", priority: "0.95", lastmod: todayIso },
  { slug: "real-madrid", changefreq: "weekly", priority: "0.9", lastmod: todayIso },
  { slug: "champions-league", changefreq: "monthly", priority: "0.9", lastmod: todayIso },
  { slug: "timeline", changefreq: "weekly", priority: "0.9", lastmod: todayIso },
  { slug: "trophies", changefreq: "monthly", priority: "0.85", lastmod: todayIso },
  { slug: "gear", changefreq: "weekly", priority: "0.85", lastmod: todayIso }
];

function getHreflangsXml(slugPath) {
  return [
    `    <xhtml:link rel="alternate" hreflang="en" href="https://www.ronaldostats.site/en${slugPath}" />`,
    `    <xhtml:link rel="alternate" hreflang="en-US" href="https://www.ronaldostats.site/en${slugPath}" />`,
    `    <xhtml:link rel="alternate" hreflang="en-NG" href="https://www.ronaldostats.site/en${slugPath}" />`,
    `    <xhtml:link rel="alternate" hreflang="en-IN" href="https://www.ronaldostats.site/en${slugPath}" />`,
    `    <xhtml:link rel="alternate" hreflang="en-PH" href="https://www.ronaldostats.site/en${slugPath}" />`,
    `    <xhtml:link rel="alternate" hreflang="es" href="https://www.ronaldostats.site/es${slugPath}" />`,
    `    <xhtml:link rel="alternate" hreflang="es-AR" href="https://www.ronaldostats.site/es${slugPath}" />`,
    `    <xhtml:link rel="alternate" hreflang="es-ES" href="https://www.ronaldostats.site/es${slugPath}" />`,
    `    <xhtml:link rel="alternate" hreflang="pt" href="https://www.ronaldostats.site/pt${slugPath}" />`,
    `    <xhtml:link rel="alternate" hreflang="pt-BR" href="https://www.ronaldostats.site/pt${slugPath}" />`,
    `    <xhtml:link rel="alternate" hreflang="pt-PT" href="https://www.ronaldostats.site/pt${slugPath}" />`,
    `    <xhtml:link rel="alternate" hreflang="fr" href="https://www.ronaldostats.site/fr${slugPath}" />`,
    `    <xhtml:link rel="alternate" hreflang="fr-FR" href="https://www.ronaldostats.site/fr${slugPath}" />`,
    `    <xhtml:link rel="alternate" hreflang="fr-NE" href="https://www.ronaldostats.site/fr${slugPath}" />`,
    `    <xhtml:link rel="alternate" hreflang="x-default" href="https://www.ronaldostats.site/en${slugPath}" />`
  ].join("\n");
}

const urlBlocks = [];

// 1. English Homepage
urlBlocks.push(`  <url>
    <loc>https://www.ronaldostats.site/en</loc>
    <lastmod>${todayIso}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
${getHreflangsXml("")}
    <image:image>
      <image:loc>https://www.ronaldostats.site/img/logo.png</image:loc>
      <image:title>RonaldoStats Official Logo</image:title>
      <image:caption>RonaldoStats - Cristiano Ronaldo Career Statistics and Analytics</image:caption>
    </image:image>
    <image:image>
      <image:loc>https://www.ronaldostats.site/img/ronaldo.jpg</image:loc>
      <image:title>Cristiano Ronaldo, RonaldoStats</image:title>
      <image:caption>Cristiano Ronaldo, the captain of Portugal, in the RonaldoStats career archive.</image:caption>
    </image:image>
    <image:image>
      <image:loc>https://www.ronaldostats.site/img/og-ronaldo.jpg</image:loc>
      <image:title>Cristiano Ronaldo ${CAREER_GOALS} Career Goals Official Stats</image:title>
      <image:caption>Cristiano Ronaldo career overview: ${CAREER_GOALS} goals in ${CAREER_APPS.toLocaleString("en-US")} senior appearances, ${CAREER_TROPHIES} trophies, ${BALLONS_DOR} Ballons d'Or.</image:caption>
    </image:image>
  </url>`);

// 2. English Subpages
const enImages = {
  timeline: `    <image:image>
      <image:loc>https://www.ronaldostats.site/img/era/era-2002-sporting.webp</image:loc>
      <image:title>Cristiano Ronaldo at the Sporting CP Museum (2002)</image:title>
      <image:caption>The Sporting CP museum in Lisbon, with the number 28 shirt from Ronaldo's debut season.</image:caption>
      <image:geo_location>Lisbon, Portugal</image:geo_location>
    </image:image>
    <image:image>
      <image:loc>https://www.ronaldostats.site/img/era/era-2004-manutd.webp</image:loc>
      <image:title>Cristiano Ronaldo in the Manchester United number 7 shirt (2004)</image:title>
      <image:caption>Ronaldo in the Manchester United number 7 shirt against Chelsea.</image:caption>
      <image:geo_location>Manchester, England</image:geo_location>
    </image:image>
    <image:image>
      <image:loc>https://www.ronaldostats.site/img/era/era-2009-real.webp</image:loc>
      <image:title>Cristiano Ronaldo at Real Madrid (2009)</image:title>
      <image:caption>Kaka and Ronaldo celebrating together for Real Madrid.</image:caption>
      <image:geo_location>Madrid, Spain</image:geo_location>
    </image:image>
    <image:image>
      <image:loc>https://www.ronaldostats.site/img/era/era-2017-ucl.webp</image:loc>
      <image:title>Cristiano Ronaldo and the UEFA Champions League (2017)</image:title>
      <image:caption>Ronaldo with the Champions League trophy in Madrid.</image:caption>
      <image:geo_location>Madrid, Spain</image:geo_location>
    </image:image>
    <image:image>
      <image:loc>https://www.ronaldostats.site/img/era/era-2018-juve.webp</image:loc>
      <image:title>Cristiano Ronaldo in the Juventus shirt (2018)</image:title>
      <image:caption>Ronaldo in the Juventus shirt during his Serie A title season.</image:caption>
      <image:geo_location>Turin, Italy</image:geo_location>
    </image:image>
    <image:image>
      <image:loc>https://www.ronaldostats.site/img/era/era-2023-alnassr.webp</image:loc>
      <image:title>Cristiano Ronaldo in the Al Nassr number 7 shirt (2023)</image:title>
      <image:caption>Ronaldo in the Al Nassr number 7 shirt.</image:caption>
      <image:geo_location>Riyadh, Saudi Arabia</image:geo_location>
    </image:image>
    <image:image>
      <image:loc>https://www.ronaldostats.site/img/era/era-2026-record.webp</image:loc>
      <image:title>Cristiano Ronaldo in the Portugal number 7 shirt (2026)</image:title>
      <image:caption>Ronaldo in the Portugal number 7 shirt at the 2026 World Cup.</image:caption>
      <image:geo_location>United States</image:geo_location>
    </image:image>`,
  trophies: `    <image:image>
      <image:loc>https://www.ronaldostats.site/img/cab-ballon-2026.webp</image:loc>
      <image:title>Cristiano Ronaldo and his 5 Ballons d'Or</image:title>
      <image:caption>Ronaldo holding the Ballon d'Or, an award he has won a record five times.</image:caption>
      <image:geo_location>Paris, France</image:geo_location>
    </image:image>
    <image:image>
      <image:loc>https://www.ronaldostats.site/img/cab-ucl-2026.webp</image:loc>
      <image:title>Cristiano Ronaldo and the UEFA Champions League</image:title>
      <image:caption>Ronaldo holding the Champions League trophy, which he won five times.</image:caption>
      <image:geo_location>Madrid, Spain</image:geo_location>
    </image:image>
    <image:image>
      <image:loc>https://www.ronaldostats.site/img/cab-liga.webp</image:loc>
      <image:title>Cristiano Ronaldo in the Real Madrid number 7 shirt</image:title>
      <image:caption>Ronaldo in the Real Madrid number 7 shirt, the club where he won two La Liga titles.</image:caption>
      <image:geo_location>Madrid, Spain</image:geo_location>
    </image:image>
    <image:image>
      <image:loc>https://www.ronaldostats.site/img/cab-wc.webp</image:loc>
      <image:title>Cristiano Ronaldo in the Portugal shirt at the 2018 World Cup</image:title>
      <image:caption>Ronaldo in the Portugal shirt at the 2018 World Cup, where he scored four goals.</image:caption>
      <image:geo_location>Russia</image:geo_location>
    </image:image>
    <image:image>
      <image:loc>https://www.ronaldostats.site/img/cab-cwc-2026.webp</image:loc>
      <image:title>Cristiano Ronaldo and Real Madrid celebrate the FIFA Club World Cup</image:title>
      <image:caption>Ronaldo and his Real Madrid team-mates celebrate the 2016 FIFA Club World Cup in Yokohama.</image:caption>
      <image:geo_location>Yokohama, Japan</image:geo_location>
    </image:image>`,
  "real-madrid": `    <image:image>
      <image:loc>https://www.ronaldostats.site/img/og-ronaldo.jpg</image:loc>
      <image:title>Ronaldo at Real Madrid: 450 goals in 438 appearances</image:title>
      <image:caption>Ronaldo's nine years at Real Madrid: 450 goals, 311 in La Liga, five European crowns and 18 goals in El Clasico.</image:caption>
    </image:image>`,
  "ronaldo-vs-messi": `    <image:image>
      <image:loc>https://www.ronaldostats.site/img/ronaldo-vs-messi.webp</image:loc>
      <image:title>Cristiano Ronaldo vs Lionel Messi: the career comparison</image:title>
      <image:caption>Goals, assists, trophies, hat-tricks and Ballons d'Or: the verified career comparison of Cristiano Ronaldo and Lionel Messi.</image:caption>
    </image:image>`,
  "champions-league": `    <image:image>
      <image:loc>https://www.ronaldostats.site/img/era/era-2017-ucl.webp</image:loc>
      <image:title>Cristiano Ronaldo and the UEFA Champions League</image:title>
      <image:caption>Ronaldo's Champions League record: 140 goals in 173 appearances and five European crowns.</image:caption>
    </image:image>`,
};

const videoMeta = {
  en: {
    title: `Cristiano Ronaldo Last Goal Video: Goal #${LG_NUM} vs ${LG_OPP}`,
    desc: `Watch Cristiano Ronaldo's Goal #${LG_NUM}: a ${LG_FINISH.toLowerCase()} goal for ${LG_TEAM} vs ${LG_OPP} in ${LG_COMP} on ${LG_DATE}.`,
    tags: ["Cristiano Ronaldo", `Goal ${LG_NUM}`, LG_OPP_TAG, LG_COMP, "Ronaldo Last Goal"]
  },
  es: {
    title: `Último Gol de Cristiano Ronaldo: Gol #${LG_NUM} contra ${LG_OPP}`,
    desc: `Mira el gol #${LG_NUM} de Cristiano Ronaldo: gol de ${LG_FINISH.toLowerCase()} para ${LG_TEAM} contra ${LG_OPP} en ${LG_COMP} el ${LG_DATE}.`,
    tags: ["Cristiano Ronaldo", `Gol ${LG_NUM}`, LG_OPP_TAG, LG_COMP, "Último gol de Ronaldo"]
  },
  pt: {
    title: `Último Gol de Cristiano Ronaldo: Gol #${LG_NUM} contra ${LG_OPP}`,
    desc: `Veja o gol #${LG_NUM} de Cristiano Ronaldo: gol de ${LG_FINISH.toLowerCase()} pelo ${LG_TEAM} contra ${LG_OPP} na ${LG_COMP} em ${LG_DATE}.`,
    tags: ["Cristiano Ronaldo", `Gol ${LG_NUM}`, LG_OPP_TAG, LG_COMP, "Último gol do Ronaldo"]
  },
  fr: {
    title: `Dernier But de Cristiano Ronaldo : But #${LG_NUM} contre ${LG_OPP}`,
    desc: `Regardez le but #${LG_NUM} de Cristiano Ronaldo : une frappe ${LG_FINISH.toLowerCase()} pour ${LG_TEAM} contre ${LG_OPP} en ${LG_COMP} le ${LG_DATE}.`,
    tags: ["Cristiano Ronaldo", `But ${LG_NUM}`, LG_OPP_TAG, LG_COMP, "Dernier but de Ronaldo"]
  },
};

function getVideoXml(lang) {
  const v = videoMeta[lang];
  if (!v) return "";
  const tagLines = v.tags.map(t => `      <video:tag>${t}</video:tag>`).join("\n");
  return `    <video:video>
      <video:thumbnail_loc>https://www.ronaldostats.site/img/og-ronaldo.jpg</video:thumbnail_loc>
      <video:title>${v.title}</video:title>
      <video:description>${v.desc}</video:description>
      <video:content_loc>${LG_VIDEO}</video:content_loc>
      <video:duration>35</video:duration>
      <video:publication_date>${LG?.date || todayIso}T22:00:00Z</video:publication_date>
      <video:family_friendly>yes</video:family_friendly>
${tagLines}
      <video:category>Sports</video:category>
      <video:uploader info="https://www.ronaldostats.site">RonaldoStats Official</video:uploader>
    </video:video>`;
}

for (const sub of SUBPAGES) {
  const imgXml = enImages[sub.slug] ? `\n${enImages[sub.slug]}` : "";
  const vidXml = sub.slug === "latest-goal" ? `\n${getVideoXml("en")}` : "";
  urlBlocks.push(`  <url>
    <loc>https://www.ronaldostats.site/en/${sub.slug}</loc>
    <lastmod>${sub.lastmod || "2026-09-18"}</lastmod>
    <changefreq>${sub.changefreq}</changefreq>
    <priority>${sub.priority}</priority>
${getHreflangsXml("/" + sub.slug)}${imgXml}${vidXml}
  </url>`);
}


// 3. Other languages: Homepage + Subpages
// Number rendering per locale (group separator).
const groupNum = (n, sep) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, sep);
const APPS_SEP = { en: ",", es: ".", pt: ".", fr: " " };
const num = (l, n) => String(n);
const appsNum = (l) => groupNum(CAREER_APPS, APPS_SEP[l] || ",");
const trophyNum = (l) => num(l, CAREER_TROPHIES);
const ballonNum = (l) => num(l, BALLONS_DOR);

const langHomeMeta = {
  es: {
    priority: "1.0",
    title: `Goles de Ronaldo: ${num("es", CAREER_GOALS)} Goles Oficiales en Vivo`,
    caption: `Estadísticas completas de la carrera de Cristiano Ronaldo: ${num("es", CAREER_GOALS)} goles en ${appsNum("es")} partidos oficiales, ${trophyNum("es")} títulos colectivos y ${ballonNum("es")} Balones de Oro.`
  },
  pt: {
    priority: "0.95",
    title: `Gols de Ronaldo: ${num("pt", CAREER_GOALS)} Gols Oficiais ao Vivo`,
    caption: `Estatísticas completas da carreira de Cristiano Ronaldo: ${num("pt", CAREER_GOALS)} gols em ${appsNum("pt")} jogos oficiais, ${trophyNum("pt")} títulos coletivos e ${ballonNum("pt")} Bolas de Ouro.`
  },
  fr: {
    priority: "0.95",
    title: `Buts de Ronaldo : ${num("fr", CAREER_GOALS)} Buts Officiels en Direct`,
    caption: `Statistiques complètes de la carrière de Cristiano Ronaldo : ${num("fr", CAREER_GOALS)} buts en ${appsNum("fr")} matchs officiels, ${trophyNum("fr")} trophées collectifs et ${ballonNum("fr")} Ballons d'Or.`
  },
};

for (const lang of ["es","pt","fr"]) {
  const meta = langHomeMeta[lang];
  // Homepage
  urlBlocks.push(`  <url>
    <loc>https://www.ronaldostats.site/${lang}</loc>
    <lastmod>${todayIso}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${meta.priority}</priority>
${getHreflangsXml("")}
    <image:image>
      <image:loc>https://www.ronaldostats.site/img/logo.png</image:loc>
      <image:title>RonaldoStats Official Logo</image:title>
      <image:caption>RonaldoStats - Cristiano Ronaldo Career Statistics and Analytics</image:caption>
    </image:image>
    <image:image>
      <image:loc>https://www.ronaldostats.site/img/og-ronaldo.jpg</image:loc>
      <image:title>${meta.title}</image:title>
      <image:caption>${meta.caption}</image:caption>
    </image:image>
  </url>`);

  // 8 Subpages
  for (const sub of SUBPAGES) {
    const vidXml = sub.slug === "latest-goal" ? `\n${getVideoXml(lang)}` : "";
    urlBlocks.push(`  <url>
    <loc>https://www.ronaldostats.site/${lang}/${sub.slug}</loc>
    <lastmod>${sub.lastmod || todayIso}</lastmod>
    <changefreq>${sub.changefreq}</changefreq>
    <priority>${sub.priority}</priority>
${getHreflangsXml("/" + sub.slug)}${vidXml}
  </url>`);
  }
}

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urlBlocks.join("\n")}
</urlset>
`;

fs.writeFileSync(publicSitemap, sitemapXml, "utf8");
console.log(`Generated public/sitemap.xml with ${urlBlocks.length} URLs`);

if (fs.existsSync(distSitemap)) {
  fs.writeFileSync(distSitemap, sitemapXml, "utf8");
  console.log(`Updated dist/sitemap.xml with ${urlBlocks.length} URLs`);
}
