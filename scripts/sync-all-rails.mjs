import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

const NAV_LABELS = {
  en: {
    badgeAria: "RonaldoStats home",
    langName: "English",
    langTag: "EN",
    langSelectAria: "Select Language (English)",
    langSelectTitle: "Select Language",
    home: "Home",
    latestGoal: "Latest Goal",
    bday: "Birthday Goals",
    ronaldo: "vs Messi",
    madrid: "vs Real Madrid",
    ucl: "UCL Hub",
    byyear: "Goals by Year",
    byseason: "Goals by Season",
    dashboard: "Dashboard",
    timeline: "Through the Years",
    achievements: "Trophies",
    gear: "Ronaldo Gear",
    themeToggle: "Toggle dark mode",
    darkMode: "Dark mode"
  },
  es: {
    badgeAria: "Inicio RonaldoStats",
    langName: "Español",
    langTag: "ES",
    langSelectAria: "Seleccionar idioma (Español)",
    langSelectTitle: "Seleccionar idioma",
    home: "Inicio",
    latestGoal: "Último Gol",
    bday: "Cumpleaños",
    ronaldo: "vs Messi",
    madrid: "vs Real Madrid",
    ucl: "Champions League",
    byyear: "Goles por Año",
    byseason: "Temporadas",
    dashboard: "Panel",
    timeline: "Historia",
    achievements: "Trofeos",
    gear: "Tienda Ronaldo",
    themeToggle: "Cambiar tema",
    darkMode: "Modo oscuro"
  },
  pt: {
    badgeAria: "RonaldoStats",
    langName: "Português",
    langTag: "PT",
    langSelectAria: "Selecionar idioma (Português)",
    langSelectTitle: "Selecionar idioma",
    home: "Início",
    latestGoal: "Último Gol",
    bday: "Aniversário",
    ronaldo: "vs Messi",
    madrid: "vs Real Madrid",
    ucl: "Champions League",
    byyear: "Gols por Ano",
    byseason: "Temporadas",
    dashboard: "Painel",
    timeline: "História",
    achievements: "Troféus",
    gear: "Loja Ronaldo",
    themeToggle: "Alternar tema",
    darkMode: "Modo escuro"
  },
  fr: {
    badgeAria: "Accueil RonaldoStats",
    langName: "Français",
    langTag: "FR",
    langSelectAria: "Changer de langue (Français)",
    langSelectTitle: "Changer de langue",
    home: "Accueil",
    latestGoal: "Dernier But",
    bday: "Anniversaire",
    ronaldo: "vs Messi",
    madrid: "vs Real Madrid",
    ucl: "Ligue des Champions",
    byyear: "Buts par Année",
    byseason: "Saisons",
    dashboard: "Tableau de bord",
    timeline: "Histoire",
    achievements: "Trophées",
    gear: "Boutique Ronaldo",
    themeToggle: "Basculer le thème",
    darkMode: "Mode sombre"
  },
};

function generateRailHtml(lang, activeSlug) {
  const L = NAV_LABELS[lang] || NAV_LABELS.en;
  const isAct = (slug) => activeSlug === slug;
  const onAria = (slug) => isAct(slug) ? ' aria-current="page" class="on"' : '';

  const uclLink = lang === "en" ? "/en/champions-league" : `/${lang}/champions-league`;
  const uclItem = `\n<a${onAria("champions-league")} href="${uclLink}" aria-label="${L.ucl}"><svg aria-hidden="true" viewbox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg><span>${L.ucl}</span></a>`;

  const gearLink = lang === "en" ? "/en/gear" : `/${lang}/gear`;
  const gearItem = `\n<a${onAria("gear")} href="${gearLink}" aria-label="${L.gear}"><svg aria-hidden="true" viewbox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg><span>${L.gear} 🛍️</span></a>`;

  const adminLink = "";

  return `<aside aria-label="Navigation" class="rail">
<a aria-label="${L.badgeAria}" class="rail-badge" href="/${lang}"><img class="rail-mark" src="/img/logo-cr7.webp" alt="" width="36" height="36" /><img class="rail-banner" src="/img/banner-ronaldostats.webp" alt="" width="1200" height="400" /><span class="rail-word">Ronaldo<b>Stats</b></span></a>
<div class="rail-lang-wrap">
  <button type="button" class="rail-lang-btn" id="rail-lang-btn" aria-label="${L.langSelectAria}" title="${L.langSelectTitle}">
    <svg class="rail-lang-globe" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    </svg>
    <span class="rail-lang-label">${L.langName}</span>
    <span class="rail-lang-tag">${L.langTag}</span>
  </button>
</div>
<nav>
<a${onAria("home")} href="/${lang}" aria-label="${L.home}"><svg aria-hidden="true" viewbox="0 0 24 24"><path d="M3 11.5 12 3l9 8.5"></path><path d="M5.5 10.5V21h5v-6h3v6h5V10.5"></path></svg><span>${L.home}</span></a>
<a${onAria("ronaldo-vs-messi")} href="/${lang}/ronaldo-vs-messi" aria-label="${L.ronaldo}"><svg aria-hidden="true" viewbox="0 0 24 24"><path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v1"></path><path d="M18 8l4 4-4 4"></path></svg><span>${L.ronaldo}</span></a>
<a${onAria("real-madrid")} href="/${lang}/real-madrid" aria-label="${L.madrid}"><svg aria-hidden="true" viewbox="0 0 24 24"><path d="M14.5 17.5 3 6V3h3l11.5 11.5"></path><path d="m13 19 6-6"></path><path d="m16 16 4 4"></path><path d="m19 21 2-2"></path></svg><span>${L.madrid}</span></a>${uclItem}
<a${onAria("byyear")} href="/${lang}/goalsbyyear" aria-label="${L.byyear}"><svg aria-hidden="true" viewbox="0 0 24 24"><rect height="15.5" rx="2.5" width="17" x="3.5" y="5"></rect><path d="M3.5 10h17M8 2.8V6.5M16 2.8V6.5"></path></svg><span>${L.byyear}</span></a>
<a${onAria("byseason")} href="/${lang}/goalsbyseason" aria-label="${L.byseason}"><svg aria-hidden="true" viewbox="0 0 24 24"><rect height="7.5" rx="1.5" width="7.5" x="3.5" y="3.5"></rect><rect height="7.5" rx="1.5" width="7.5" x="13" y="3.5"></rect><rect height="7.5" rx="1.5" width="7.5" x="3.5" y="13"></rect><rect height="7.5" rx="1.5" width="7.5" x="13" y="13"></rect></svg><span>${L.byseason}</span></a>
<a${onAria("dashboard")} href="/${lang}/dashboard" aria-label="${L.dashboard}"><svg aria-hidden="true" viewbox="0 0 24 24"><path d="M3.5 20.5h17"></path><path d="M6.5 20v-7M12 20V5M17.5 20v-10"></path></svg><span>${L.dashboard}</span></a>
<a${onAria("timeline")} href="/${lang}/timeline" aria-label="${L.timeline}"><svg aria-hidden="true" viewbox="0 0 24 24"><circle cx="12" cy="12" r="8.5"></circle><path d="M12 7.5V12l3 2"></path></svg><span>${L.timeline}</span></a>
<a${onAria("achievements")} href="/${lang}/trophies" aria-label="${L.achievements}"><svg aria-hidden="true" viewbox="0 0 24 24"><path d="M8 3.5h8V9a4 4 0 0 1-8 0V3.5Z"></path><path d="M8 5H4.5A1.5 1.5 0 0 0 6 10H8M16 5h3.5A1.5 1.5 0 0 1 18 10h-2M12 13v3.5M8.5 20.5h7M10 16.5h4V20h-4z"></path></svg><span>${L.achievements}</span></a>${gearItem}
</nav>
<button aria-label="${L.themeToggle}" class="theme-toggle" id="theme-toggle" title="${L.themeToggle}" type="button">
<svg aria-hidden="true" class="sun-icon" viewbox="0 0 24 24"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path></svg>
<svg aria-hidden="true" class="moon-icon" viewbox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
<span class="theme-label">${L.darkMode}</span>
</button>
</aside>`;
}

function updateFileRail(filePath, lang, activeSlug) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, "utf8");

  const railRegex = /<aside[^>]*class=["'][^"']*rail[^"']*["'][^>]*>[\s\S]*?<\/aside>/i;
  if (!railRegex.test(content)) {
    console.warn(`No rail found in ${filePath}`);
    return;
  }

  const newRail = generateRailHtml(lang, activeSlug);
  content = content.replace(railRegex, newRail);

  fs.writeFileSync(filePath, content, "utf8");
}

const PAGES_MAP = {
  "index.html": "home",
  "latest-goal.html": "latest-goal",
  "birthday.html": "birthday",
  "ronaldo-vs-messi.html": "ronaldo-vs-messi",
  "real-madrid.html": "real-madrid",
  "champions-league.html": "champions-league",
  "goalsbyyear.html": "byyear",
  "goalsbyseason.html": "byseason",
  "dashboard.html": "dashboard",
  "timeline.html": "timeline",
  "trophies.html": "achievements",
  "gear.html": "gear",
  "admin.html": "admin"
};

// 1. Root English files
for (const [file, slug] of Object.entries(PAGES_MAP)) {
  updateFileRail(path.join(rootDir, file), "en", slug);
}

// 2. All 3 localized languages (es, pt, fr)
const ALL_LANGS = ["es","pt","fr"];
for (const lang of ALL_LANGS) {
  for (const [file, slug] of Object.entries(PAGES_MAP)) {
    if (file === "admin.html") continue;
    updateFileRail(path.join(rootDir, lang, file), lang, slug);
  }
}

console.log("Unified and updated rail navigation across ALL files and ALL languages!");
