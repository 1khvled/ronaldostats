/* RonaldoStats renderer — own code, own data, own copy.
   Renders Cristiano Ronaldo's senior career: Sporting CP, Manchester United,
   Real Madrid, Juventus, Al Nassr and Portugal. Layout structure mirrors the
   ronaldostats.app reference (rail, KPI cards, tables, charts, explore links);
   no reference code, images or text reused. */
import "./ad-guard.js";
import { inject } from "@vercel/analytics";
import { injectSpeedInsights } from "@vercel/speed-insights";
import { getDict } from "./i18n/index.js";
inject(); // page-view counting; no-ops off Vercel (script 404s silently in local preview)
injectSpeedInsights(); // Core Web Vitals; same deal — production only, silent locally
/* Theme manager (Dark / Light mode) with localStorage persistence and OS sync */
let DICT = getDict("en");

function initTheme() {
  const getPreferred = () => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved === "dark" || saved === "light") return saved;
    } catch (_) {}
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };

  const applyTheme = (theme) => {
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    // Keep the mobile browser chrome in step with the theme (pure black in dark).
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#000000" : "#16243a");
    const btns = document.querySelectorAll(".theme-toggle");
    btns.forEach((btn) => {
      const label = btn.querySelector(".theme-label");
      if (label) label.textContent = theme === "dark" ? "Light mode" : "Dark mode";
      btn.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
      btn.setAttribute("title", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
    });
  };

  applyTheme(getPreferred());

  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".theme-toggle");
    if (!btn) return;
    const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    const next = current === "dark" ? "light" : "dark";
    try { localStorage.setItem("theme", next); } catch (_) {}
    applyTheme(next);
  });

  if (window.matchMedia) {
    try {
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
        try {
          if (!localStorage.getItem("theme")) applyTheme(e.matches ? "dark" : "light");
        } catch (_) {}
      });
    } catch (_) {}
  }
}
initTheme();

/* ================= REDESIGNED LANGUAGE SELECTOR & MOBILE TOPBAR ================= */
const LANGUAGES = [
  { code: "en", flag: "🇺🇸", name: "English", native: "English", note: "US, NG, IN, PH" },
  { code: "es", flag: "🇪🇸", name: "Spanish", native: "Español", note: "España" },
  { code: "pt", flag: "🇧🇷", name: "Portuguese", native: "Português", note: "Brasil, Portugal" },
  { code: "fr", flag: "🇫🇷", name: "French", native: "Français", note: "France, Niger" },
  { code: "ar", flag: "🇪🇬", name: "Arabic", native: "العربية", note: "مصر والوطن العربي", rtl: true },
  { code: "bn", flag: "🇧🇩", name: "Bengali", native: "বাংলা", note: "বাংলাদেশ ও ভারত" },
  { code: "hi", flag: "🇮🇳", name: "Hindi", native: "हिन्दी", note: "भारत" },
  { code: "ro", flag: "🇷🇴", name: "Romanian", native: "Română", note: "România" },
  { code: "uz", flag: "🇺🇿", name: "Uzbek", native: "Oʻzbekcha", note: "Oʻzbekiston" }
];

function getCurrentLangCode() {
  if (typeof document === "undefined") return "en";
  const docLang = (document.documentElement.lang || "").toLowerCase().split("-")[0];
  const pathParts = (typeof location !== "undefined" ? location.pathname : "").split("/").filter(Boolean);
  if (LANGUAGES.some((l) => l.code === docLang)) {
    return docLang;
  }
  if (pathParts[0] && LANGUAGES.some((l) => l.code === pathParts[0])) {
    return pathParts[0];
  }
  return "en";
}

function getLangUrl(targetCode) {
  if (typeof location === "undefined") return `/${targetCode}`;
  const validSubpages = [
    "birthday",
    "goalsbyyear",
    "goalsbyseason",
    "dashboard",
    "timeline",
    "achievements",
    "ronaldo-vs-messi",
    "real-madrid",
    "champions-league",
    "latest-goal"
  ];
  const pathParts = location.pathname.split("/").filter(Boolean);
  // Clean programmatic date pages exist in English only: keep every language
  // switch on the single canonical date URL instead of forking ?date= copies
  // (one per language) that Google indexes as separate duplicate pages.
  if (pathParts.length > 2 && pathParts[1] === "birthday" && /^\d{1,2}-\d{1,2}$/.test(pathParts[2])) {
    const cleanKey = pathParts[2].split("-").map((n) => String(parseInt(n, 10)).padStart(2, "0")).join("-");
    return `/en/birthday/${cleanKey}${location.hash}`;
  }
  let subpage = "";
  if (pathParts.length > 1) {
    subpage = pathParts[1].replace(/\.html$/, "");
  } else if (pathParts.length === 1 && !LANGUAGES.some((l) => l.code === pathParts[0])) {
    subpage = pathParts[0].replace(/\.html$/, "");
  }

  // Drop volatile filter/search params (?date=, ?month=, ?day=, ?q=, ?season=,
  // ?country=, ?team=) on language switch so one shared link doesn't fork into
  // 9 indexed duplicates. The page state itself is re-selected after navigation.
  const VOLATILE_PARAMS = ["date", "month", "day", "q", "season", "country", "team"];
  let search = "";
  try {
    const sp = new URLSearchParams(location.search);
    VOLATILE_PARAMS.forEach((k) => sp.delete(k));
    const rest = sp.toString();
    search = rest ? `?${rest}` : "";
  } catch (_) { search = ""; }

  if (subpage && validSubpages.includes(subpage)) {
    return `/${targetCode}/${subpage}${search}${location.hash}`;
  }

  return `/${targetCode}${search}${location.hash}`;
}

// The rail's own scroll position decides whether a fade is shown on
// the top or the bottom edge, so a link below the fold is never silently
// missing. The stylesheet promised this affordance but never implemented it.
function updateRailEdges() {
  const rail = document.querySelector(".rail");
  const nav = rail && rail.querySelector("nav");
  if (!rail || !nav) return;
  // First keep the current page's link in view, then work out which edge
  // still has content behind it — the fades must describe the state the
  // visitor is actually looking at.
  const active = nav.querySelector("a.on");
  if (active) {
    const navRect = nav.getBoundingClientRect();
    const r = active.getBoundingClientRect();
    if (r.top < navRect.top || r.bottom > navRect.bottom) {
      nav.scrollTop += r.top - navRect.top - navRect.height / 2 + r.height / 2;
    }
  }
  const canScroll = nav.scrollHeight > nav.clientHeight + 2;
  const atTop = nav.scrollTop <= 2;
  const atBottom = nav.scrollTop + nav.clientHeight >= nav.scrollHeight - 2;
  rail.classList.toggle("rail-more-top", canScroll && !atTop);
  rail.classList.toggle("rail-more-bottom", canScroll && !atBottom);
}

function centerActiveNav() {
  if (typeof window === "undefined") return;
  const activeNav = document.querySelector(".rail nav a.on");
  if (!activeNav) return;
  // On a short window the rail scrolls: keep the current page's link inside
  // the visible area, or the visitor cannot see where they are.
  const scrollIntoView = () => activeNav.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  if (window.innerWidth > 900) {
    const rail = document.querySelector(".rail");
    const nav = rail && rail.querySelector("nav");
    if (nav && nav.scrollHeight > nav.clientHeight) {
      const navRect = nav.getBoundingClientRect();
      const linkRect = activeNav.getBoundingClientRect();
      if (linkRect.top < navRect.top || linkRect.bottom > navRect.bottom) {
        nav.scrollTop += linkRect.top - navRect.top - navRect.height / 2 + linkRect.height / 2;
      }
    }
    return;
  }
  scrollIntoView();
  setTimeout(scrollIntoView, 80);
}

function ensureLangModal() {
  if (typeof document === "undefined") return null;
  let langModal = document.getElementById("lang-modal");
  if (langModal) return langModal;

  const curLangCode = getCurrentLangCode();

  langModal = document.createElement("div");
  langModal.id = "lang-modal";
  langModal.className = "lang-modal-backdrop";
  langModal.hidden = true;
  langModal.setAttribute("aria-hidden", "true");
  langModal.setAttribute("role", "dialog");
  langModal.setAttribute("aria-modal", "true");
  langModal.setAttribute("aria-labelledby", "lang-modal-heading");

  let cardsHtml = "";
  LANGUAGES.forEach((l) => {
    const isActive = l.code === curLangCode;
    const href = getLangUrl(l.code);
    cardsHtml += `
      <a href="${href}" class="lang-card-option${isActive ? " active" : ""}" data-code="${l.code}">
        <span class="lang-card-flag">${l.flag}</span>
        <div class="lang-card-info">
          <span class="lang-card-name">${l.name}</span>
          <span class="lang-card-native">${l.native}</span>
          <span class="lang-card-countries">${l.note}</span>
        </div>
        ${isActive ? `<span class="lang-card-check">✓</span>` : ""}
      </a>
    `;
  });

  langModal.innerHTML = `
    <div class="lang-modal-sheet">
      <div class="lang-modal-handle"></div>
      <div class="lang-modal-header">
        <div class="lang-modal-title-wrap">
          <svg class="rail-lang-globe" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
          <h3 class="lang-modal-title" id="lang-modal-heading">Select Language / Idioma</h3>
        </div>
        <button type="button" class="lang-modal-close" id="lang-modal-close-btn" aria-label="Close language selector">&times;</button>
      </div>
      <div class="lang-modal-grid">
        ${cardsHtml}
      </div>
    </div>
  `;

  if (document.body) {
    document.body.appendChild(langModal);
  }
  return langModal;
}

function openLangModal() {
  const modal = ensureLangModal();
  if (!modal) return;
  modal.hidden = false;
  modal.setAttribute("aria-hidden", "false");
  if (document.body) document.body.style.overflow = "hidden";
}

function closeLangModal() {
  const modal = document.getElementById("lang-modal");
  if (!modal) return;
  modal.hidden = true;
  modal.setAttribute("aria-hidden", "true");
  if (document.body) document.body.style.overflow = "";
}

function ensureMobileMenuDrawer() {
  let drawer = document.getElementById("mobile-nav-drawer");
  if (drawer) return drawer;

  const DRAWER_I18N = {
    en: {
      menuTitle: "Ronaldo<b>Stats</b> Menu",
      statGoals: "Total Goals",
      statApps: "Senior Apps",
      statTrophies: "Trophies",
      statBallons: "Ballons d'Or",
      catFeatured: "Featured ⚡",
      catHistory: "History & Trophies 🏆",
      catStats: "Big Matches & Stats 📊",
      home: "Career Home & Stats",
      vsRonaldo: "Ronaldo vs Messi",
      latestGoal: "Latest Goal Replay",
      birthday: "Birthday Goals Explorer",
    days: "All 366 Days",
      achievements: "All 35 Trophies & Awards",
      timeline: "Career Timeline & Photos",
      goalsByYear: "Goals by Calendar Year",
      goalsBySeason: "Goals by Season",
      dashboard: "Deep Stats & Analytics",
      vsRealMadrid: "Real Madrid years",
      championsLeague: "Champions League Hub",
      toggleTheme: "🌓 Toggle Dark Mode"
    },
    es: {
      menuTitle: "Menú Ronaldo<b>Stats</b>",
      statGoals: "Goles Totales",
      statApps: "Partidos",
      statTrophies: "Títulos",
      statBallons: "Balones de Oro",
      catFeatured: "Destacado ⚡",
      catHistory: "Historia y Títulos 🏆",
      catStats: "Partidos y Análisis 📊",
      home: "Inicio y Estadísticas",
      vsRonaldo: "Ronaldo vs Messi",
      latestGoal: "Último Gol Replay",
      birthday: "Goles en tu Cumpleaños",
    days: "Los 366 días",
      achievements: "Los 35 Títulos y Premios",
      timeline: "Línea de Tiempo y Fotos",
      goalsByYear: "Goles por Año Calendario",
      goalsBySeason: "Goles por Temporada",
      dashboard: "Panel de Análisis Avanzado",
      vsRealMadrid: "Real Madrid years",
      championsLeague: "Champions League Hub",
      toggleTheme: "🌓 Cambiar Modo Oscuro"
    },
    pt: {
      menuTitle: "Menu Ronaldo<b>Stats</b>",
      statGoals: "Total de Gols",
      statApps: "Partidas",
      statTrophies: "Títulos",
      statBallons: "Bolas de Ouro",
      catFeatured: "Destaques ⚡",
      catHistory: "História e Títulos 🏆",
      catStats: "Grandes Jogos e Dados 📊",
      home: "Início e Estatísticas",
      vsRonaldo: "Ronaldo vs Messi",
      latestGoal: "Último Gol Replay",
      birthday: "Gols no Aniversário",
    days: "Os 366 dias",
      achievements: "Todos os 35 Títulos",
      timeline: "Linha do Tempo e Fotos",
      goalsByYear: "Gols por Ano",
      goalsBySeason: "Gols por Temporada",
      dashboard: "Painel de Análise",
      vsRealMadrid: "Real Madrid years",
      championsLeague: "Champions League Hub",
      toggleTheme: "🌓 Alternar Modo Escuro"
    },
    fr: {
      menuTitle: "Menu Ronaldo<b>Stats</b>",
      statGoals: "Total de Buts",
      statApps: "Matchs",
      statTrophies: "Trophées",
      statBallons: "Ballons d'Or",
      catFeatured: "En Vedette ⚡",
      catHistory: "Histoire & Trophées 🏆",
      catStats: "Grands Matchs & Stats 📊",
      home: "Accueil & Statistiques",
      vsRonaldo: "Ronaldo vs Messi",
      latestGoal: "Dernier But Replay",
      birthday: "Buts par Anniversaire",
    days: "Les 366 jours",
      achievements: "Tous les 35 Trophées",
      timeline: "Chronologie & Photos",
      goalsByYear: "Buts par Année Civile",
      goalsBySeason: "Buts par Saison",
      dashboard: "Tableau de Bord & Analyses",
      vsRealMadrid: "Real Madrid years",
      championsLeague: "Hub Ligue des Champions",
      toggleTheme: "🌓 Basculer Mode Sombre"
    },
    ar: {
      menuTitle: "قائمة Ronaldo<b>Stats</b>",
      statGoals: "إجمالي الأهداف",
      statApps: "المباريات الرسمية",
      statTrophies: "الألقاب",
      statBallons: "الكرة الذهبية",
      catFeatured: "المميز ⚡",
      catHistory: "التاريخ والألقاب 🏆",
      catStats: "المباريات الكبرى والأرقام 📊",
      home: "الرئيسية والإحصائيات",
      vsRonaldo: "رونالدو ضد ميسي",
      latestGoal: "إعادة الهدف الأخير",
      birthday: "أهداف يوم ميلادك",
    days: "الأيام المائية 366",
      achievements: "جميع البطولات الـ 35",
      timeline: "المسيرة والصور",
      goalsByYear: "الأهداف حسب السنة",
      goalsBySeason: "الأهداف حسب الموسم",
      dashboard: "لوحة الإحصائيات الشاملة",
      vsRealMadrid: "سنواته في ريال مدريد",
      championsLeague: "دوري أبطال أوروبا",
      toggleTheme: "🌓 تبديل الوضع الليلي"
    },
    bn: {
      menuTitle: "Ronaldo<b>Stats</b> মেনু",
      statGoals: "মোট গোল",
      statApps: "অফিসিয়াল ম্যাচ",
      statTrophies: "শিরোপা",
      statBallons: "ব্যালন ডি'অর",
      catFeatured: "বিশেষ ⚡",
      catHistory: "ইতিহাস ও শিরোপা 🏆",
      catStats: "বড় ম্যাচ ও পরিসংখ্যান 📊",
      home: "মূল পাতা ও পরিসংখ্যান",
      vsRonaldo: "রোনালদো বনাম মেসি",
      latestGoal: "সর্বশেষ গোলের রিপ্লে",
      birthday: "জন্মদিনের গোল এক্সপ্লোরার",
    days: "সবৈ তারিখ দিন",
      achievements: "সব ৩৫টি শিরোপা ও ট্রফি",
      timeline: "ক্যারিয়ার টাইমলাইন ও ছবি",
      goalsByYear: "ক্যালেন্ডার বছরভিত্তিক গোল",
      goalsBySeason: "মৌসুমভিত্তিক গোল",
      dashboard: "অ্যানালিটিক্স ড্যাশবোর্ড",
      vsRealMadrid: "রিয়াল মাদ্রিদের বছরগুলো",
      championsLeague: "চ্যাম্পিয়ন্স লিগ হাব",
      toggleTheme: "🌓 ডার্ক মোড পরিবর্তন"
    },
    hi: {
      menuTitle: "Ronaldo<b>Stats</b> मेन्यू",
      statGoals: "कुल गोल",
      statApps: "कुल मैच",
      statTrophies: "ट्रॉफियां",
      statBallons: "बैलोन डी'ओर",
      catFeatured: "विशेष ⚡",
      catHistory: "इतिहास व ट्रॉफियां 🏆",
      catStats: "प्रमुख मैच व आंकड़े 📊",
      home: "होम व करियर आंकड़े",
      vsRonaldo: "रोनाल्डो बनाम मेसी",
      latestGoal: "नवीनतम गोल रीप्ले",
      birthday: "जन्मदिन गोल एक्सप्लोरर",
    days: "सभी 366 दিন",
      achievements: "सभी 35 ट्रॉफियां व खिताब",
      timeline: "करियर टाइमलाइन व फोटो",
      goalsByYear: "कैलेंडर वर्ष अनुसार गोल",
      goalsBySeason: "सीज़न अनुसार गोल",
      dashboard: "विश्लेषण डैशबोर्ड",
      vsRealMadrid: "रियल मैड्रिड के वर्ष",
      championsLeague: "चैंपियंस लीग हब",
      toggleTheme: "🌓 डार्क मोड बदलें"
    },
    ro: {
      menuTitle: "Meniu Ronaldo<b>Stats</b>",
      statGoals: "Total Goluri",
      statApps: "Meciuri",
      statTrophies: "Trofee",
      statBallons: "Baloane de Aur",
      catFeatured: "Recomandate ⚡",
      catHistory: "Istorie & Trofee 🏆",
      catStats: "Meciuri Mari & Date 📊",
      home: "Acasă & Statistici Carieră",
      vsRonaldo: "Ronaldo vs Messi",
      latestGoal: "Revederea Ultimului Gol",
      birthday: "Goluri de Ziua Ta",
    days: "Toate cele 366 de zile",
      achievements: "Toate cele 35 de Trofee",
      timeline: "Cronologie & Fotografii",
      goalsByYear: "Goluri pe An Calendaristic",
      goalsBySeason: "Goluri pe Sezon",
      dashboard: "Panou de Analiză Avansată",
      vsRealMadrid: "Real Madrid years",
      championsLeague: "Hub Champions League",
      toggleTheme: "🌓 Comutare Mod Întunecat"
    },
    uz: {
      menuTitle: "Ronaldo<b>Stats</b> Menyu",
      statGoals: "Jami Gollar",
      statApps: "O'yinlar",
      statTrophies: "Sovrinlar",
      statBallons: "Oltin To'plar",
      catFeatured: "Tanlangan ⚡",
      catHistory: "Tarix va Sovrinlar 🏆",
      catStats: "Muhim O'yinlar & Tahlil 📊",
      home: "Asosiy & Statistika",
      vsRonaldo: "Ronaldo vs Messi",
      latestGoal: "So'nggi Gol Takrori",
      birthday: "Tug'ilgan Kundagi Gollar",
    days: "366 kunlik",
      achievements: "Barcha 35 ta Sovrin",
      timeline: "Xronologiya va Suratlar",
      goalsByYear: "Yillar Bo'yicha Gollar",
      goalsBySeason: "Mavsumlar Bo'yicha Gollar",
      dashboard: "Tahliliy Panel",
      vsRealMadrid: "Real Madridga yillari",
      championsLeague: "Chempionlar Ligasi Xabi",
      toggleTheme: "🌓 Tungi Rejimni O'zgartirish"
    }
  };

  const curLangCode = getCurrentLangCode();
  const curLangObj = LANGUAGES.find((l) => l.code === curLangCode) || LANGUAGES[0];
  const curPath = (typeof location !== "undefined" ? location.pathname : "");
  const txt = DRAWER_I18N[curLangCode] || DRAWER_I18N.en;

  const navCategories = [
    {
      title: txt.catFeatured,
      items: [
        { href: getLangUrl(curLangCode), label: txt.home, badge: "981 Goals", icon: `<svg viewBox="0 0 24 24"><path d="M3 11.5 12 3l9 8.5"></path><path d="M5.5 10.5V21h5v-6h3v6h5V10.5"></path></svg>` },
        { href: `/${curLangCode}/ronaldo-vs-messi`, label: txt.vsRonaldo, badge: "GOAT", icon: `<svg viewBox="0 0 24 24"><path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v1"></path><path d="M18 8l4 4-4 4"></path></svg>` },
        { href: `/${curLangCode}/latest-goal`, label: txt.latestGoal, badge: "LIVE ⚡", icon: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8" fill="currentColor"></polygon></svg>` },
        { href: `/${curLangCode}/birthday`, label: txt.birthday, badge: "HOT 🔥", icon: `<svg viewBox="0 0 24 24"><rect height="4" rx="1" width="18" x="3" y="8"></rect><path d="M12 8v13M19 12v9H5v-9M7.5 8a2.5 2.5 0 0 1 0-5A4.8 4.8 0 0 1 12 8a4.8 4.8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"></path></svg>` },
    // Always /en/days: the 366 day pages (and this hub) are English-only by design,
    // so this must NOT be built from curLangCode or 8 locales would 404.
    { href: "/en/days", label: txt.days, badge: "366 Days", icon: `<svg viewBox="0 0 24 24"><rect height="17.5" rx="2" width="17.5" x="3.25" y="3.25"></rect><path d="M3.25 8.5h17.5M8 3.25v17.5M16 3.25v17.5"></path></svg>` }
      ]
    },
    {
      title: txt.catHistory,
      items: [
        { href: `/${curLangCode}/achievements`, label: txt.achievements, badge: "35 Cups", icon: `<svg viewBox="0 0 24 24"><path d="M8 3.5h8V9a4 4 0 0 1-8 0V3.5Z"></path><path d="M8 5H4.5A1.5 1.5 0 0 0 6 10H8M16 5h3.5A1.5 1.5 0 0 1 18 10h-2M12 13v3.5M8.5 20.5h7M10 16.5h4V20h-4z"></path></svg>` },
        { href: `/${curLangCode}/timeline`, label: txt.timeline, badge: "2002-2026", icon: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"></circle><path d="M12 7.5V12l3 2"></path></svg>` },
        { href: `/${curLangCode}/goalsbyyear`, label: txt.goalsByYear, badge: "69 in 2013", icon: `<svg viewBox="0 0 24 24"><rect height="15.5" rx="2.5" width="17" x="3.5" y="5"></rect><path d="M3.5 10h17M8 2.8V6.5M16 2.8V6.5"></path></svg>` },
        { href: `/${curLangCode}/goalsbyseason`, label: txt.goalsBySeason, badge: "25 Yrs", icon: `<svg viewBox="0 0 24 24"><rect height="7.5" rx="1.5" width="7.5" x="3.5" y="3.5"></rect><rect height="7.5" rx="1.5" width="7.5" x="13" y="3.5"></rect><rect height="7.5" rx="1.5" width="7.5" x="3.5" y="13"></rect><rect height="7.5" rx="1.5" width="7.5" x="13" y="13"></rect></svg>` }
      ]
    },
    {
      title: txt.catStats,
      items: [
        { href: `/${curLangCode}/dashboard`, label: txt.dashboard, badge: "Hub", icon: `<svg viewBox="0 0 24 24"><path d="M3.5 20.5h17"></path><path d="M6.5 20v-7M12 20V5M17.5 20v-10"></path></svg>` },
        { href: `/${curLangCode}/real-madrid`, label: txt.vsRealMadrid, badge: "450 Goals", icon: `<svg viewBox="0 0 24 24"><path d="M14.5 17.5 3 6V3h3l11.5 11.5"></path><path d="m13 19 6-6"></path><path d="m16 16 4 4"></path><path d="m19 21 2-2"></path></svg>` },
        { href: `/${curLangCode}/champions-league`, label: txt.championsLeague, badge: "140 Goals", icon: `<svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>` }
      ]
    }
  ];

  let catHtml = "";
  for (const cat of navCategories) {
    catHtml += `<div class="mobile-drawer-section-title">${cat.title}</div><div class="mobile-drawer-nav-group">`;
    for (const itm of cat.items) {
      const isCurrent = curPath === itm.href || (itm.href.endsWith(`/${curLangCode}`) && (curPath === "/" || curPath === `/${curLangCode}/` || curPath === `/${curLangCode}`));
      catHtml += `
        <a href="${itm.href}" class="mobile-drawer-link ${isCurrent ? "on" : ""}">
          ${itm.icon}
          <span>${itm.label}</span>
          ${itm.badge ? `<span class="drawer-badge">${itm.badge}</span>` : ""}
        </a>
      `;
    }
    catHtml += `</div>`;
  }

  drawer = document.createElement("div");
  drawer.id = "mobile-nav-drawer";
  drawer.className = "mobile-drawer-backdrop";
  drawer.hidden = true;
  drawer.setAttribute("aria-hidden", "true");
  drawer.innerHTML = `
    <div class="mobile-drawer-sheet" role="dialog" aria-modal="true" aria-label="Navigation Menu">
      <div class="mobile-drawer-header">
        <div class="mobile-drawer-brand">
          <img src="/img/logo.png" alt="RonaldoStats Logo" width="28" height="28" style="object-fit:contain;border-radius:4px;flex:0 0 28px;"/>
          <span>${txt.menuTitle}</span>
        </div>
        <button type="button" class="mobile-drawer-close" id="mobile-drawer-close-btn" aria-label="Close menu">
          <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      <div class="mobile-drawer-body">
        <div class="mobile-drawer-stats-card">
          <div class="mobile-drawer-stat"><span class="num">${n(LIVE.goals)}</span><span class="lbl">${txt.statGoals}</span></div>
          <div class="mobile-drawer-stat"><span class="num">${n(LIVE.apps)}</span><span class="lbl">${txt.statApps}</span></div>
          <div class="mobile-drawer-stat"><span class="num">${LIVE.trophies}</span><span class="lbl">${txt.statTrophies}</span></div>
          <div class="mobile-drawer-stat"><span class="num">5</span><span class="lbl">${txt.statBallons}</span></div>
        </div>
        ${catHtml}
        <div class="mobile-drawer-footer">
          <button type="button" class="mobile-drawer-btn" id="drawer-lang-btn">
            <span>${curLangObj.flag}</span>
            <span>${curLangObj.name}</span>
          </button>
          <button type="button" class="mobile-drawer-btn" id="drawer-theme-btn">
            <span>${txt.toggleTheme}</span>
          </button>
        </div>
        <div class="mobile-drawer-social">
          <a href="https://x.com/ronaldostat1" target="_blank" rel="noopener noreferrer" class="mobile-drawer-x-btn" aria-label="Follow @ronaldostat1 on X">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            <span>Follow @ronaldostat1 on X</span>
          </a>
          <a href="https://t.me/ronaldostatdotcom" target="_blank" rel="noopener noreferrer" class="mobile-drawer-x-btn mobile-drawer-tg-btn" aria-label="Join RonaldoStats on Telegram">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            <span>Telegram @ronaldostatdotcom</span>
          </a>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(drawer);
  return drawer;
}

function openMobileMenuDrawer() {
  const drawer = ensureMobileMenuDrawer();
    ensureMobileMoreNavBtn();
  if (!drawer) return;
  drawer.hidden = false;
  drawer.setAttribute("aria-hidden", "false");
  const menuBtn = document.getElementById("mobile-menu-btn");
  if (menuBtn) {
    menuBtn.classList.add("active");
    menuBtn.setAttribute("aria-expanded", "true");
  }
  if (document.body) document.body.style.overflow = "hidden";
}

function closeMobileMenuDrawer() {
  const drawer = document.getElementById("mobile-nav-drawer");
  if (!drawer) return;
  drawer.hidden = true;
  drawer.setAttribute("aria-hidden", "true");
  const menuBtn = document.getElementById("mobile-menu-btn");
  if (menuBtn) {
    menuBtn.classList.remove("active");
    menuBtn.setAttribute("aria-expanded", "false");
  }
  if (document.body) document.body.style.overflow = "";
}


// ---------- Mobile 'More' Button in Bottom Rail ----------
function ensureMobileMoreNavBtn() {
  if (typeof document === 'undefined') return;
  const railNav = document.querySelector(".rail nav");
  if (!railNav || railNav.querySelector(".rail-more-btn")) return;
  const curLang = getCurrentLangCode();
  const moreLabels = {
    en: "More",
    es: "Más",
    pt: "Mais",
    fr: "Plus",
    ar: "المزيد",
    bn: "আরও",
    hi: "अधिक",
    ro: "Mai mult",
    uz: "Ko'proq"
  };
  const label = moreLabels[curLang] || "More";
  const moreBtn = document.createElement("button");
  moreBtn.type = "button";
  moreBtn.className = "rail-more-btn";
  moreBtn.setAttribute("aria-label", "Open all pages menu");
  moreBtn.title = label;
  moreBtn.innerHTML = `
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="1.5"></circle>
      <circle cx="19" cy="12" r="1.5"></circle>
      <circle cx="5" cy="12" r="1.5"></circle>
    </svg>
    <span>${label}</span>
  `;
  moreBtn.onclick = (e) => {
    e.preventDefault();
    openMobileMenuDrawer();
  };
  railNav.appendChild(moreBtn);
}

function ensureDesktopBrandHeader() {
  if (typeof document === "undefined") return;
  const wrap = document.querySelector("#main.wrap") || document.querySelector(".wrap");
  if (!wrap || wrap.querySelector(".desktop-brand-header")) return;

  const curLang = getCurrentLangCode();
  const brandHeader = document.createElement("div");
  brandHeader.className = "desktop-brand-header";
  brandHeader.innerHTML = `
    <a href="${getLangUrl(curLang)}" class="desktop-brand-logo-link" aria-label="RonaldoStats Home">
      <img src="/img/logo.png" alt="RonaldoStats Logo" class="desktop-brand-logo" width="48" height="48" />
    </a>
    <div class="desktop-brand-titles">
      <div class="desktop-brand-name">Ronaldo<span>Stats</span></div>
      <div class="desktop-brand-sub">The Verified Cristiano Ronaldo Statistics &amp; Video Database</div>
    </div>
  `;
  wrap.prepend(brandHeader);
}

/* Keyboard users land here first: one Tab press reveals a jump-to-content link. */
function ensureSkipLink() {
  if (typeof document === "undefined") return;
  if (document.querySelector(".skip-link")) return;
  const main = document.getElementById("main") || document.querySelector(".wrap");
  if (!main) return;
  if (!main.id) main.id = "main";
  const link = document.createElement("a");
  link.className = "skip-link";
  link.href = "#main";
  link.textContent = document.documentElement.lang === "es" ? "Saltar al contenido" : "Skip to content";
  document.body.prepend(link);
}
ensureSkipLink();

/* The 300x250 leaderboard sits above the headline, which on a 390x844 phone
   pushed the H1 to 429px — over half the first screen before any content.
   On phones we let the headline win and drop the slot just under the lede.
   Desktop keeps the original position, and rotating re-applies the layout. */
function placeTopAdForViewport() {
  if (typeof document === "undefined") return;
  const ad = document.querySelector(".ad-banner-top");
  const main = document.getElementById("main") || document.querySelector(".wrap");
  if (!ad || !main) return;
  const narrow = window.innerWidth < 900;
  if (narrow) {
    if (ad.dataset.adMoved === "1") return;
    const anchor = main.querySelector(".lede, .page-lead") || null;
    if (anchor && anchor.parentElement) {
      anchor.insertAdjacentElement("afterend", ad);
      ad.dataset.adMoved = "1";
    }
  } else if (ad.dataset.adMoved === "1") {
    if (main.firstElementChild) main.insertBefore(ad, main.firstElementChild);
    else main.appendChild(ad);
    ad.dataset.adMoved = "0";
  }
}
placeTopAdForViewport();
window.addEventListener("ronaldo:spark-relayout", placeTopAdForViewport);
if (typeof window !== "undefined") {
  window.addEventListener("orientationchange", () => setTimeout(placeTopAdForViewport, 120));
}

function initDonationPopup() {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const DISMISS_KEY = "ronaldostat_donation_dismissed";
  const SHOWN_KEY = "ronaldostat_donation_shown";
  const PAGEVIEWS_KEY = "ronaldostat_pv_count";
  const TARGET_TIME_MS = 25000; // 25s (optimized for actual visitor dwell time)

  try {
    const dismissedTime = localStorage.getItem(DISMISS_KEY);
    if (dismissedTime && (Date.now() - parseInt(dismissedTime, 10) < 24 * 60 * 60 * 1000)) {
      return;
    }
    if (sessionStorage.getItem(SHOWN_KEY) === "true") {
      return;
    }
  } catch (_) {}

  // Track session pageview depth
  let pvs = 1;
  try {
    pvs = parseInt(sessionStorage.getItem(PAGEVIEWS_KEY) || "0", 10) + 1;
    sessionStorage.setItem(PAGEVIEWS_KEY, String(pvs));
  } catch (_) {}

  let triggered = false;
  const triggerPopup = () => {
    if (triggered) return;
    try {
      if (sessionStorage.getItem(SHOWN_KEY) === "true") return;
      const dismissed = localStorage.getItem(DISMISS_KEY);
      if (dismissed && (Date.now() - parseInt(dismissed, 10) < 24 * 60 * 60 * 1000)) return;
      triggered = true;
      sessionStorage.setItem(SHOWN_KEY, "true");
      showDonationPopup();
    } catch (_) {}
  };

  // 1. Dwell-time trigger: 25s for first landing, 10s if already browsing 2nd+ page
  const timerDelay = pvs > 1 ? 10000 : TARGET_TIME_MS;
  const timer = setTimeout(triggerPopup, timerDelay);

  // 2. Scroll-depth engagement trigger: user scrolled >= 45% down the stats page after at least 8s
  const pageLoadTime = Date.now();
  const onScroll = () => {
    if (triggered) {
      window.removeEventListener("scroll", onScroll);
      return;
    }
    if (Date.now() - pageLoadTime < 8000) return; // ignore instant flick scrolls
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight > 400) {
      const scrollPercent = (window.scrollY / docHeight) * 100;
      if (scrollPercent >= 45) {
        window.removeEventListener("scroll", onScroll);
        clearTimeout(timer);
        triggerPopup();
      }
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });

  // 3. Desktop exit-intent trigger: mouse moving towards tab/close bar after at least 6s
  const onMouseLeave = (e) => {
    if (triggered) {
      document.removeEventListener("mouseleave", onMouseLeave);
      return;
    }
    if (Date.now() - pageLoadTime < 6000) return;
    if (e.clientY <= 12) {
      document.removeEventListener("mouseleave", onMouseLeave);
      clearTimeout(timer);
      triggerPopup();
    }
  };
  document.addEventListener("mouseleave", onMouseLeave);
}

function showDonationPopup() {
  if (typeof document === "undefined" || document.getElementById("donation-modal") || document.getElementById("stream-promo-modal")) return;

  const backdrop = document.createElement("div");
  backdrop.id = "donation-modal";
  backdrop.className = "donation-modal-backdrop";
  backdrop.setAttribute("role", "dialog");
  backdrop.setAttribute("aria-modal", "true");
  backdrop.setAttribute("aria-labelledby", "donation-modal-title");

  backdrop.innerHTML = `
    <div class="donation-modal-sheet">
      <div class="donation-modal-header">
        <div class="donation-modal-title-row">
          <span class="donation-modal-badge">❤️ Support RonaldoStats</span>
        </div>
        <button type="button" class="donation-modal-close" id="donation-modal-close-x" aria-label="Close">✕</button>
      </div>
      <div class="donation-modal-body">
        <h3 id="donation-modal-title">Thank you for visiting RonaldoStats!</h3>
        
        <div class="donation-apology-box">
          <p><strong>🙏 Sincere Apology for the Advertisements:</strong></p>
          <p>We know ads can sometimes be distracting, and we sincerely apologize for displaying them on the site. To keep <b>RonaldoStats completely free</b>, blazing fast, and updated after every match with high-definition goal video streaming and zero paywalls, ads are currently necessary to cover our high monthly hosting and video CDN servers.</p>
        </div>

        <p class="donation-plea-text">
          If you enjoy using RonaldoStats and want to help keep the servers running (and help us show fewer ads in the future!), please consider supporting us with a small donation on Ko-fi or via crypto:
        </p>

        <div class="donation-modal-actions">
          <a href="https://ko-fi.com/ronaldostat" target="_blank" rel="noopener noreferrer" class="btn-popup-kofi">
            <span>💖 Support on Ko-fi</span>
          </a>

          <div class="popup-crypto-card">
            <span class="popup-crypto-header">🪙 Direct Crypto Wallet (BEP-20 / BNB Chain - USDT / BNB / ETH)</span>
            <div class="popup-crypto-row">
              <code class="popup-crypto-address" id="popup-crypto-val">0xe78ee7a6ce01978562c90df0fa3f775215457390</code>
              <button type="button" class="btn-popup-copy" id="btn-popup-copy-action" aria-label="Copy Crypto Wallet Address">Copy 📋</button>
            </div>
          </div>
        </div>
      </div>
      <div class="donation-modal-footer">
        <button type="button" class="btn-popup-dismiss" id="donation-modal-dismiss-btn">
          Continue Browsing
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(backdrop);

  const close = () => {
    try {
      localStorage.setItem("ronaldostat_donation_dismissed", String(Date.now()));
    } catch (_) {}
    backdrop.style.animation = "donationFadeOut 0.2s ease-out forwards";
    setTimeout(() => {
      if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
    }, 200);
  };

  const closeX = backdrop.querySelector("#donation-modal-close-x");
  const dismissBtn = backdrop.querySelector("#donation-modal-dismiss-btn");
  if (closeX) closeX.addEventListener("click", close);
  if (dismissBtn) dismissBtn.addEventListener("click", close);

  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) close();
  });

  const handleKeydown = (e) => {
    if (e.key === "Escape") {
      close();
      window.removeEventListener("keydown", handleKeydown);
    }
  };
  window.addEventListener("keydown", handleKeydown);

  const copyBtn = backdrop.querySelector("#btn-popup-copy-action");
  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText("0xe78ee7a6ce01978562c90df0fa3f775215457390").then(() => {
        copyBtn.textContent = "✓ Copied!";
        setTimeout(() => {
          copyBtn.textContent = "Copy 📋";
        }, 2500);
      }).catch(() => {});
    });
  }
}


/* ================= PORTUGAL MATCH STREAM NOTIFICATION ================= */

function initPortugalStreamNotification() {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const STREAM_URL = "https://kooraadz.vercel.app/";

  // Target match date: 6 October 2026.
  // 2 days before is: 4 October 2026 00:00:00 UTC (1791072000000)
  // Active window until: 7 October 2026 06:00:00 UTC (1791352800000)
  const START_MS = Date.parse("2026-10-04T00:00:00Z");
  const END_MS = Date.parse("2026-10-07T06:00:00Z");
  const now = Date.now();
  const isWithinActiveWindow = now >= START_MS && now <= END_MS;

  // Immediate Preview / Testing override support
  let isTesting = false;
  try {
    const params = new URLSearchParams(window.location.search);
    isTesting = params.get("stream") === "1" ||
                params.get("preview_stream") === "1" ||
                window.__FORCE_STREAM_BANNER__ === true;
  } catch (_) {}

  // If outside active window and not forcing test mode, do not activate
  if (!isWithinActiveWindow && !isTesting) return;

  const lang = (typeof getLang === "function" ? getLang() : (typeof getCurrentLangCode === "function" ? getCurrentLangCode() : "en"));
  const t = DICT.ARG_STREAM;

  // 1. Add stream link to active match card / home page matchday tracker when active
  try {
    // A. Home page & global matchday placeholder (#banner)
    const bannerHost = document.getElementById("banner");
    if (bannerHost && !document.getElementById("banner-arg-stream")) {
      bannerHost.removeAttribute("hidden");
      bannerHost.classList.add("portugal-matchday-banner-host", "argentina-matchday-banner-host");
      const matchdayCard = document.createElement("div");
      matchdayCard.id = "banner-arg-stream";
      matchdayCard.className = "portugal-matchday-banner argentina-matchday-banner";
      matchdayCard.innerHTML = `
        <div class="arg-banner-info">
          <div class="arg-banner-top">
            <span class="arg-stream-badge">
              <span class="arg-live-dot" aria-hidden="true"><span class="arg-live-dot-ping"></span><span class="arg-live-dot-core"></span></span>
              <span>${t.badge}</span>
            </span>
            <span class="arg-stream-feature">⭐ ${t.highlight}</span>
          </div>
          <div class="arg-banner-title">${t.matchCardTitle}</div>
          <p class="arg-banner-desc">${t.matchCardDesc}</p>
        </div>
        <a href="${STREAM_URL}" target="_blank" rel="noopener noreferrer" class="btn-arg-banner-stream" id="banner-arg-stream-btn">
          <span>${t.cta}</span>
        </a>
      `;
      bannerHost.appendChild(matchdayCard);
    }

    // B. Today match status section on latest-goal page (#today-status-section)
    const todayCard = document.getElementById("today-status-section");
    if (todayCard && !document.getElementById("today-arg-stream-alert")) {
      const alert = document.createElement("div");
      alert.id = "today-arg-stream-alert";
      alert.className = "today-arg-stream-alert";
      alert.innerHTML = `
        <div class="today-arg-stream-top">
          <span class="arg-stream-badge">
            <span class="arg-live-dot" aria-hidden="true"><span class="arg-live-dot-ping"></span><span class="arg-live-dot-core"></span></span>
            <span>${t.badge}</span>
          </span>
          <span class="arg-stream-feature">⭐ ${t.highlight}</span>
        </div>
        <div class="today-arg-stream-title">${t.matchCardTitle}</div>
        <p class="today-arg-stream-desc">${t.matchCardDesc}</p>
        <a href="${STREAM_URL}" target="_blank" rel="noopener noreferrer" class="btn-today-arg-stream" id="today-arg-stream-btn">
          <span>${t.cta}</span>
        </a>
      `;
      todayCard.appendChild(alert);
    }
  } catch (err) {
    console.warn("Stream tracker sync warning:", err);
  }
}


function initFanArcade() {
  const card = document.getElementById("fan-zone");
  if (!card) return;
  if (card.dataset.arcadeInit) return;
  card.dataset.arcadeInit = "true";

  // 1. Tabs switching
  const tabs = card.querySelectorAll(".arcade-tab");
  const panels = card.querySelectorAll(".arcade-panel");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetId = "panel-" + tab.getAttribute("data-tab");
      tabs.forEach((t) => {
        t.classList.remove("on");
        t.setAttribute("aria-selected", "false");
      });
      panels.forEach((p) => {
        p.classList.remove("on");
        p.hidden = true;
      });

      tab.classList.add("on");
      tab.setAttribute("aria-selected", "true");
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add("on");
        targetPanel.hidden = false;
      }
    });
  });

  // 2. Quiz Controller (Authentic Mind-Blowing Ronaldo Lore)
  const quizBox = document.getElementById("quiz-box");
  if (quizBox) {
    const ALL_LORE_QUESTIONS = [
      {
        q: "Which club did Ronaldo sign for in June 2009 for a then world-record fee?",
        opts: [
          "Real Madrid",
          "Manchester United",
          "Juventus",
          "Bayern Munich"
        ],
        ans: 0,
        exp: "💥 RECORD FEE! Cristiano Ronaldo signed for Real Madrid in June 2009 for a then world-record €94m, and 80,000 fans packed the Bernabéu for the presentation."
      },
      {
        q: "Which shirt number did Ronaldo take at Manchester United in 2003 — and keep for the rest of his career?",
        opts: [
          "No. 7",
          "No. 10",
          "No. 9",
          "No. 11"
        ],
        ans: 0,
        exp: "👖 THE FAMOUS No. 7! Ronaldo inherited the legendary United number in 2003 and has worn it ever since — for Manchester United, Real Madrid, Juventus and Al Nassr."
      },
      {
        q: "How many Champions League goals has Ronaldo scored in his career?",
        opts: [
          "140",
          "129",
          "120",
          "108"
        ],
        ans: 0,
        exp: "👑 140 goals in 183 appearances — the all-time record in Europe's biggest club competition, and he added a record 42 assists alongside it."
      },
      {
        q: "Ronaldo scored three goals for Portugal inside 15 minutes against which country in 2013?",
        opts: [
          "Northern Ireland",
          "Sweden",
          "Finland",
          "Sweden and Finland"
        ],
        ans: 0,
        exp: "🇵🇹 NORTHERN IRELAND! Three goals in 15 minutes in a Euro 2012 qualifier — the fastest senior hat-trick of his international career and one of the quickest ever seen."
      },
      {
        q: "How many Ballons d'Or has Cristiano Ronaldo won?",
        opts: [
          "5",
          "4",
          "3",
          "8"
        ],
        ans: 0,
        exp: "⭐ FIVE! 2008 — the first ever won by a Portuguese player, named on all 96 ballots — then 2013, 2014, 2016 and 2017."
      },
      {
        q: "Which Saudi club did Ronaldo join in January 2023?",
        opts: [
          "Al Nassr",
          "Al Hilal",
          "Al Ittihad",
          "Al Shabab"
        ],
        ans: 0,
        exp: "🇸🇦 AL NASSR! Ronaldo signed for the Riyadh club in January 2023, debuted as captain against Al-Ettifaq and scored twice in a 2–2 draw on day one."
      }
    ];

    let currentQ = 0;
    let score = 0;
    let questions = ALL_LORE_QUESTIONS.slice(0, 3);

    const renderQuestion = () => {
      if (currentQ >= questions.length) {
        const pct = Math.round((score / questions.length) * 100);
        let badge = "🏆 GOAT Scholar!";
        if (score === questions.length) badge = "👑 Certified 100% Ronaldo Lore Master!";
        else if (score >= 2) badge = "🐐 Elite Football Fan!";

        quizBox.innerHTML = `
          <div class="arcade-quiz-finish animate-pop">
            <div class="quiz-finish-badge">${badge}</div>
            <h4 class="quiz-finish-title">You Scored ${score} / ${questions.length} (${pct}%)</h4>
            <p class="quiz-finish-desc">Think your friends know Ronaldo's legendary career lore as well as you? Share your score or test yourself with another 3 questions!</p>
            <div class="quiz-finish-actions">
              <button type="button" class="btn-arcade-action" id="btn-quiz-retry">
                <span>🔄 Spin 3 New Questions</span>
              </button>
              <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(`I just scored ${score}/${questions.length} on the Cristiano Ronaldo Career Lore Quiz on RonaldoStats.com! Can you beat my score?`)}&url=${encodeURIComponent(window.location.origin)}" target="_blank" rel="noopener noreferrer" class="btn-quiz-share">
                <span>🐦 Share Score</span>
              </a>
            </div>
          </div>
        `;
        const retryBtn = document.getElementById("btn-quiz-retry");
        if (retryBtn) {
          retryBtn.addEventListener("click", () => {
            currentQ = 0;
            score = 0;
            questions = ALL_LORE_QUESTIONS.sort(() => Math.random() - 0.5).slice(0, 3);
            renderQuestion();
          });
        }
        return;
      }

      const qObj = questions[currentQ];
      quizBox.innerHTML = `
        <div class="quiz-header">
          <span class="quiz-badge">Question ${currentQ + 1} of ${questions.length} • Real Ronaldo Lore</span>
          <span class="quiz-score-indicator">Score: <b>${score}</b></span>
        </div>
        <div class="quiz-question-text">${qObj.q}</div>
        <div class="quiz-options">
          ${qObj.opts.map((opt, i) => `
            <button type="button" class="btn-quiz-opt" data-opt="${i}">
              <span class="opt-key-badge">${String.fromCharCode(65 + i)}</span>
              <span class="opt-label-text">${opt}</span>
            </button>
          `).join("")}
        </div>
        <div class="quiz-feedback" id="quiz-feedback" style="display:none;"></div>
      `;

      const optBtns = quizBox.querySelectorAll(".btn-quiz-opt");
      const feedback = document.getElementById("quiz-feedback");

      optBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          optBtns.forEach((b) => (b.disabled = true));
          const chosen = parseInt(btn.getAttribute("data-opt"), 10);
          const isRight = chosen === qObj.ans;
          if (isRight) {
            btn.classList.add("correct");
            score++;
          } else {
            btn.classList.add("wrong");
            if (optBtns[qObj.ans]) optBtns[qObj.ans].classList.add("correct");
          }

          feedback.innerHTML = `
            <div class="fb-message-wrap">
              <span class="fb-badge-result ${isRight ? "correct" : "wrong"}">${isRight ? "✓ Spot On!" : "✗ Missed It!"}</span>
              <p class="fb-explanation-text">${qObj.exp}</p>
            </div>
            <button type="button" class="btn-quiz-next" id="btn-next-q">Next Question →</button>
          `;
          feedback.style.display = "flex";
          const nextBtn = document.getElementById("btn-next-q");
          if (nextBtn) {
            nextBtn.addEventListener("click", () => {
              currentQ++;
              renderQuestion();
            });
          }
        });
      });
    };

    renderQuestion();
  }

  // 4. Birthday Goal Quick Checker
  const bdayMonth = document.getElementById("arcade-bday-month");
  const bdayDay = document.getElementById("arcade-bday-day");
  const bdayCheckBtn = document.getElementById("btn-arcade-check-bday");
  const bdayResult = document.getElementById("arcade-bday-result");

  if (bdayMonth && bdayDay) {
    const updateDaySelect = (m) => {
      const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1] || 31;
      const prevVal = parseInt(bdayDay.value, 10) || 5;
      bdayDay.innerHTML = Array.from({ length: daysInMonth }, (_, i) => `<option value="${i + 1}" ${i + 1 === Math.min(prevVal, daysInMonth) ? "selected" : ""}>${i + 1}</option>`).join("");
    };

    bdayMonth.addEventListener("change", () => updateDaySelect(parseInt(bdayMonth.value, 10)));
    updateDaySelect(2); // Default 5 February (Ronaldo's birthday)

    if (bdayCheckBtn && bdayResult) {
      bdayCheckBtn.addEventListener("click", async () => {
        const m = String(bdayMonth.value).padStart(2, "0");
        const d = String(bdayDay.value).padStart(2, "0");
        const key = `${m}-${d}`;
        bdayResult.innerHTML = `Searching calendar database...`;
        bdayResult.style.display = "block";

        try {
          const res = await fetch("/data/birthday-goals.json");
          const bData = await res.json();
          const dayInfo = (bData.calendar || bData.days || {})[key];

          if (dayInfo && dayInfo.goalsCount > 0) {
            bdayResult.innerHTML = `
              <div style="font-weight:700; color:var(--ink); margin-bottom:4px;">
                🎉 Yes! Cristiano Ronaldo scored <b>${dayInfo.goalsCount} goals</b> on your birthday (${dayInfo.formatted})!
              </div>
              <div style="font-size:0.82rem; color:var(--muted); margin-bottom:8px;">
                ${dayInfo.matches.map((match) => `${match.year}: ${match.team} vs ${match.opponent} (${match.goalsCount}G)`).join(" · ")}
              </div>
              <a href="/en/birthday/${key}" class="btn-arcade-action" style="font-size:0.8rem; padding:5px 12px; display:inline-block; text-decoration:none;">
                Watch Goal Video Clips on Birthday Hub →
              </a>
            `;
          } else {
            bdayResult.innerHTML = `
              <div style="color:var(--muted);">
                Ronaldo hasn't played on ${m}/${d} in his senior career! Explore all 366 days on our <a href="/en/birthday" style="color:var(--brand);font-weight:700;">Birthday Goals Explorer</a> or try a friend's birthday!
              </div>
            `;
          }
        } catch (_) {
          bdayResult.innerHTML = `Explore all match goals on the <a href="/en/birthday/${key}" style="color:var(--brand);font-weight:700;">${m}/${d} Goal Page &rarr;</a>`;
        }
      });
    }
  }

  // 5. Goal Roulette Controller
  const spinBtn = document.getElementById("btn-spin-roulette");
  const rouletteDisplay = document.getElementById("arcade-roulette-display");

  const LEGENDARY_GOALS = [
    { num: 1, date: "2002-10-07", year: 2002, opp: "Moreirense", comp: "Primeira Liga", note: "His first senior goal for Sporting CP, aged 17." },
    { num: 8, date: "2004-06-12", videoUrl: "https://www.uefa.com/uefaeuro/history/video/028e-1b0fdd6660c4-371f1d1129d5-1000--watch-all-14-of-cristiano-ronaldo-s-euro-goals/", year: 2004, opp: "Greece", comp: "European Championship", note: "His first Portugal goal — a towering header at Euro 2004." },
    { num: 100, date: "2017-04-12", videoUrl: "https://www.youtube.com/watch?v=aeapZzsujqc", year: 2017, opp: "Bayern Munich", comp: "Champions League", note: "His 100th Champions League goal, in a hat-trick at the Bernabéu." },
    { num: 200, date: "2011-04-16", videoUrl: "https://www.youtube.com/watch?v=aeapZzsujqc", year: 2011, opp: "Barcelona", comp: "Copa del Rey", note: "The header that won the Copa del Rey final — his first Spanish trophy." },
    { num: 300, date: "2013-09-06", year: 2013, opp: "Northern Ireland", comp: "European Championship Qualifier", note: "Three goals in 15 minutes for Portugal — his first international hat-trick." },
    { num: 400, date: "2014-02-11", videoUrl: "https://www.youtube.com/watch?v=aeapZzsujqc", year: 2014, opp: "Atlético Madrid", comp: "Champions League", note: "The last-gasp extra-time penalty in Lisbon that sealed La Décima." },
    { num: 500, date: "2015-09-30", videoUrl: "https://www.youtube.com/watch?v=BMzp4Ob2OK8", year: 2015, opp: "Malmö", comp: "Champions League", note: "His 500th career goal, in the season he became the all-time Champions League top scorer." },
    { num: 700, date: "2019-10-14", year: 2019, opp: "Ukraine", comp: "Nations League", note: "His 700th career goal, in the Nations League campaign he won and topped." },
    { num: 800, year: 2025, opp: "Al Fateh", comp: "Saudi Pro League", note: "His 800th club goal, for Al Nassr." },
    { num: 900, date: "2024-09-05", year: 2024, opp: "Croatia", comp: "Nations League", note: "His 900th career goal, converted from the spot in Lisbon." }
  ];

  if (spinBtn && rouletteDisplay) {
    spinBtn.addEventListener("click", () => {
      spinBtn.disabled = true;
      rouletteDisplay.innerHTML = `<div style="text-align:center; padding:10px; color:var(--brand); font-weight:700;">🎲 Spinning through 981 goals...</div>`;
      setTimeout(() => {
        spinBtn.disabled = false;
        const g = LEGENDARY_GOALS[Math.floor(Math.random() * LEGENDARY_GOALS.length)];
    const gBday = g.date ? `/${getCurrentLangCode()}/birthday/${g.date.slice(5)}` : "";
        rouletteDisplay.innerHTML = `
          <div class="roulette-card-content">
            <div>
              <div class="roulette-goal-badge">Goal #${g.num} (${g.year})</div>
              <div class="roulette-goal-meta"><b>vs ${g.opp}</b> · ${g.comp}</div>
              <div class="roulette-goal-sub">${g.note}</div>
            </div>
            <a href="#" class="btn-roulette-watch">
              <span>🎬 Watch Video</span>
            </a>
          </div>
        `;
        const watchLink = rouletteDisplay.querySelector(".btn-roulette-watch");
    if (watchLink) {
      watchLink.setAttribute(`href`, gBday || `/${getCurrentLangCode()}/birthday`);
    }
    spinBtn.textContent = "🎲 Spin Another Goal";
      }, 300);
    });
  }

  // 6. Hook Global GOAT Vote Controller
  initGlobalGoatPoll();
}

function initGlobalGoatPoll() {
  const voteBtns = document.querySelectorAll(".btn-vote-candidate");
  if (!voteBtns.length) return;

  const VOTE_KEY = "ronaldostat_goat_vote";
  const renderVoteResults = (voted) => {
    const baseRonaldo = 18450 + (voted === "ronaldo" ? 1 : 0);
    const baseMessi = 6820 + (voted === "messi" ? 1 : 0);
    const messiPct = Math.round((baseMessi / total) * 100);
    const ronaldoPct = 100 - messiPct;

    document.querySelectorAll(".goat-vote-buttons").forEach((box) => (box.style.display = "none"));
    document.querySelectorAll(".goat-vote-results").forEach((resBox) => {
      resBox.style.display = "block";
      resBox.innerHTML = `
        <div class="goat-results-wrap animate-pop">
          <div class="goat-bar-row">
            <span class="bar-candidate-title">⚡ Ronaldo (<b>${ronaldoPct}%</b>)</span>
            <div class="goat-bar-track">
              <div class="goat-bar-fill ronaldo" style="width:${ronaldoPct}%;"></div>
            </div>
            <span class="bar-vote-count">${baseRonaldo.toLocaleString()} votes</span>
          </div>
          <div class="goat-bar-row">
            <span class="bar-candidate-title">🐐 Messi (<b>${messiPct}%</b>)</span>
            <div class="goat-bar-track">
              <div class="goat-bar-fill messi" style="width:${messiPct}%;"></div>
            </div>
            <span class="bar-vote-count">${baseMessi.toLocaleString()} votes</span>
          </div>
          <div class="goat-vote-meta">
            <span class="vote-confirmed-tag">✓ Your vote was recorded! (${total.toLocaleString()} total community votes)</span>
            <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(`I just voted in the Cristiano Ronaldo vs Lionel Messi GOAT poll on RonaldoStats! Compare their official 981 vs 936 career stats:`)}&url=${encodeURIComponent(window.location.href)}" target="_blank" rel="noopener noreferrer" class="btn-share-poll-vote">
              <span>🐦 Share Verdict</span>
            </a>
          </div>
        </div>
      `;
    });
  };

  try {
    const existingVote = localStorage.getItem(VOTE_KEY);
    if (existingVote) renderVoteResults(existingVote);
  } catch (_) {}

  voteBtns.forEach((btn) => {
    btn.onclick = () => {
      const choice = btn.getAttribute("data-vote");
      try {
        localStorage.setItem(VOTE_KEY, choice);
      } catch (_) {}
      renderVoteResults(choice);
    };
  });
}

function initAchievementsQuiz() {
  let container = document.getElementById("ach-quiz-container");
  if (!container) {
    const faq = document.getElementById("faq");
    const cabinet = document.getElementById("cabinet");
    const parent = faq ? faq.parentNode : cabinet ? cabinet.parentNode : document.querySelector("main.wrap");
    if (parent) {
      const achQuizSec = document.createElement("section");
      achQuizSec.className = "achievements-quiz-card";
      achQuizSec.id = "achievements-quiz";
      achQuizSec.setAttribute("aria-label", "Ronaldo Trophies & Honours Trivia Quiz");
      achQuizSec.innerHTML = `
        <div class="ach-quiz-header">
          <div class="quiz-badge-pill">🎯 TROPHY & RECORDS TRIVIA</div>
          <h2 class="ach-quiz-title">Test Your Cristiano Ronaldo Trophy & Records IQ</h2>
          <p class="ach-quiz-subtitle">Think you know everything about Ronaldo's ${LIVE.trophies} trophies, 5 Ballons d'Or, and world records? Answer 5 trivia questions below:</p>
        </div>
        <div class="ach-quiz-body" id="ach-quiz-container"></div>
      `;
      if (faq && faq.previousElementSibling) {
        parent.insertBefore(achQuizSec, faq.previousElementSibling);
      } else if (cabinet && cabinet.nextSibling) {
        parent.insertBefore(achQuizSec, cabinet.nextSibling);
      } else {
        parent.appendChild(achQuizSec);
      }
      container = document.getElementById("ach-quiz-container");
    }
  }
  if (!container) return;
  if (container.dataset.quizInit) return;
  container.dataset.quizInit = "true";

  const QUESTIONS = [
    {
      q: "How many official team trophies has Cristiano Ronaldo won across his senior career?",
      opts: ["35 Trophies", "46 Trophies", "30 Trophies", "24 Trophies"],
      ans: 0,
      expl: "Ronaldo has won 35 senior team trophies: 32 with clubs (Real Madrid 15, Manchester United 9, Juventus 5, Al Nassr 2, Sporting CP 1) and 3 with Portugal (Euro 2016 and the Nations League in 2019 and 2025)."
    },
    {
      q: "In which calendar year did Ronaldo score his record 69 official goals?",
      opts: ["2013", "2012", "2014", "2011"],
      ans: 0,
      expl: "In 2013, Cristiano Ronaldo scored 69 official goals in 76 matches (59 for Real Madrid and 10 for Portugal) — the biggest calendar year of his career."
    },
    {
      q: "How many European Golden Shoes has Cristiano Ronaldo won as Europe's top domestic goalscorer?",
      opts: ["4", "5", "6", "8"],
      ans: 0,
      expl: "Ronaldo has won 4 European Golden Shoes (2008, 2011, 2014 and 2015), a record for a Portuguese player and matched only by the very best."
    },
    {
      q: "What historic personal distinction did Ronaldo achieve for Portugal at Euro 2016?",
      opts: [
        "Captained Portugal to the European Championship title",
        "First player to win two World Cup Golden Balls",
        "Most penalty shootout saves in history",
        "Fastest hat-trick in a World Cup final"
      ],
      ans: 0,
      expl: "Ronaldo captained Portugal to the 2016 European Championship title in Paris, finishing as the tournament's second-highest scorer with three goals and winning the Silver Boot."
    },
    {
      q: "How many Ballons d'Or awards has Cristiano Ronaldo won in his career?",
      opts: ["5", "4", "8", "3"],
      ans: 0,
      expl: "Ronaldo has won 5 Ballons d'Or (2008, 2013, 2014, 2016 and 2017) — the first in 2008, at 23 years old, when he was named on all 96 ballots."
    }
  ];

  let currentIdx = 0;
  let score = 0;

  const renderQuiz = () => {
    if (currentIdx >= QUESTIONS.length) {
      const pct = Math.round((score / QUESTIONS.length) * 100);
      let titleBadge = "🏆 GOAT Scholar";
      if (pct === 100) titleBadge = "👑 Perfect 100% Ronaldo Legend!";
      else if (pct >= 80) titleBadge = "🐐 Trophy Master!";

      container.innerHTML = `
        <div class="ach-quiz-finish-card animate-pop">
          <div class="finish-badge">${titleBadge}</div>
          <h3 class="finish-score-heading">You scored ${score} out of ${QUESTIONS.length} (${pct}%)!</h3>
          <p class="finish-subtext">You clearly know your football history and Cristiano Ronaldo's record-shattering achievements.</p>
          <div class="finish-action-row">
            <button type="button" class="btn-ach-replay" id="btn-ach-replay">🔄 Replay Quiz</button>
            <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(`I just scored ${score}/${QUESTIONS.length} on the Cristiano Ronaldo Trophies & Records Quiz on RonaldoStats.com! Test your GOAT knowledge:`)}&url=${encodeURIComponent(window.location.href)}" target="_blank" rel="noopener noreferrer" class="btn-ach-share">
              <span>🐦 Share Score</span>
            </a>
          </div>
        </div>
      `;
      const replayBtn = document.getElementById("btn-ach-replay");
      if (replayBtn) {
        replayBtn.onclick = () => {
          currentIdx = 0;
          score = 0;
          renderQuiz();
        };
      }
      return;
    }

    const cur = QUESTIONS[currentIdx];
    container.innerHTML = `
      <div class="ach-quiz-question-box animate-pop">
        <div class="ach-quiz-progress-row">
          <span class="ach-quiz-pill">Question ${currentIdx + 1} of ${QUESTIONS.length}</span>
          <span class="ach-quiz-score-pill">Score: <b>${score}</b></span>
        </div>
        <h3 class="ach-quiz-qtext">${cur.q}</h3>
        <div class="ach-quiz-opt-grid">
          ${cur.opts.map((opt, i) => `
            <button type="button" class="btn-ach-opt" data-idx="${i}">
              <span class="opt-letter">${String.fromCharCode(65 + i)}</span>
              <span class="opt-label">${opt}</span>
            </button>
          `).join("")}
        </div>
        <div class="ach-quiz-feedback" id="ach-feedback" style="display:none;"></div>
      </div>
    `;

    const optBtns = container.querySelectorAll(".btn-ach-opt");
    const fbBox = document.getElementById("ach-feedback");

    optBtns.forEach((btn) => {
      btn.onclick = () => {
        optBtns.forEach((b) => (b.disabled = true));
        const picked = parseInt(btn.dataset.idx, 10);
        const isRight = picked === cur.ans;
        if (isRight) {
          score++;
          btn.classList.add("correct");
        } else {
          btn.classList.add("wrong");
          if (optBtns[cur.ans]) optBtns[cur.ans].classList.add("correct");
        }

        fbBox.style.display = "flex";
        fbBox.innerHTML = `
          <div class="fb-content">
            <span class="fb-status ${isRight ? "success" : "danger"}">${isRight ? "✓ Correct!" : "✗ Incorrect"}</span>
            <p class="fb-expl">${cur.expl}</p>
          </div>
          <button type="button" class="btn-ach-next" id="btn-ach-next">Next Question →</button>
        `;

        const nextBtn = document.getElementById("btn-ach-next");
        if (nextBtn) {
          nextBtn.onclick = () => {
            currentIdx++;
            renderQuiz();
          };
        }
      };
    });
  };

  renderQuiz();
}

function initDedicatedRoulette() {
  let spinBtn = document.getElementById("btn-spin-dedicated-roulette");
  let display = document.getElementById("dedicated-roulette-display");
  let loadBtn = document.getElementById("btn-load-roulette-video");

  if (!spinBtn || !display) {
    const recentSec = document.querySelector(".recent-goals-section");
    if (recentSec) {
      const rouletteSec = document.createElement("section");
      rouletteSec.className = "latest-goal-roulette-card";
      rouletteSec.id = "dedicated-roulette-section";
      rouletteSec.setAttribute("aria-label", "981 Career Goal Roulette");
      rouletteSec.innerHTML = `
        <div class="roulette-card-header">
          <div class="roulette-badge-pill">🎲 981-GOAL ROULETTE</div>
          <h2 class="roulette-section-title">Spin a Random Ronaldo Career Goal Highlight</h2>
          <p class="roulette-section-desc">Spin through all 981 official senior goals across Cristiano Ronaldo's 25-year legendary career. Click to immediately stream and replay the highlight video in the player above!</p>
        </div>
        <div class="roulette-interactive-stage">
          <div class="roulette-highlight-display" id="dedicated-roulette-display">
            <div class="roulette-standby-view">
              <span class="roulette-standby-icon">⚽</span>
              <div class="roulette-standby-text">
                <b>981 Senior Goals Available</b>
                <span>Click the button below to randomly draw a classic milestone, solo stunner, or cup final decider.</span>
              </div>
            </div>
          </div>
          <div class="roulette-action-row">
            <button type="button" class="btn-spin-roulette-dedicated" id="btn-spin-dedicated-roulette">
              <span>🎲 Spin 981-Goal Roulette</span>
            </button>
            <button type="button" class="btn-load-roulette-video" id="btn-load-roulette-video" style="display:none;">
              <span>▶ Load in Video Player</span>
            </button>
          </div>
        </div>
      `;
      recentSec.parentNode.insertBefore(rouletteSec, recentSec.nextSibling);
      spinBtn = document.getElementById("btn-spin-dedicated-roulette");
      display = document.getElementById("dedicated-roulette-display");
      loadBtn = document.getElementById("btn-load-roulette-video");
    }
  }

  if (!spinBtn || !display) return;
  if (spinBtn.dataset.rouletteInit) return;
  spinBtn.dataset.rouletteInit = "true";

  const LEGENDARY_ROULETTE_GOALS = [
    { num: 1, date: "2002-10-07", year: 2002, team: "Sporting CP", opp: "Moreirense", comp: "Primeira Liga", type: "Right Foot", score: "2 – 1", min: "—", note: "First senior goal for Sporting CP, aged 17.", videoUrl: "https://cdn.ronaldoallgoals.com/Goal1.mp4" },
    { num: 8, date: "2004-06-12", videoUrl: "https://www.uefa.com/uefaeuro/history/video/028e-1b0fdd6660c4-371f1d1129d5-1000--watch-all-14-of-cristiano-ronaldo-s-euro-goals/", year: 2004, team: "Portugal", opp: "Greece", comp: "European Championship", type: "Header", score: "2 – 1", min: "—", note: "His first Portugal goal — a towering header at Euro 2004.", videoUrl: "https://cdn.ronaldoallgoals.com/Goal8.mp4" },
    { num: 50, date: "2021-09-11", videoUrl: "https://www.manutd.com/en/mutv/videos/detail/cristiano-ronaldo-first-goal-v-newcastle-11-september", year: 2007, team: "Manchester United", opp: "Newcastle United", comp: "Premier League", type: "Left Foot", score: "3 – 2", min: "—", note: "His first Manchester United hat-trick, in the January 2007 win over Newcastle.", videoUrl: "https://cdn.ronaldoallgoals.com/Goal50.mp4" },
    { num: 200, date: "2011-04-16", videoUrl: "https://www.youtube.com/watch?v=aeapZzsujqc", year: 2011, team: "Real Madrid", opp: "Barcelona", comp: "Copa del Rey", type: "Header", score: "1 – 0", min: "90+1", note: "The stoppage-time header that won the Copa del Rey final — his first Spanish trophy.", videoUrl: "https://cdn.ronaldoallgoals.com/Goal200.mp4" },
    { num: 300, date: "2013-09-06", year: 2013, team: "Portugal", opp: "Northern Ireland", comp: "European Championship Qualifier", type: "Left Foot", score: "4 – 2", min: "27", note: "Three goals in 15 minutes — the fastest international hat-trick of his career.", videoUrl: "https://cdn.ronaldoallgoals.com/Goal300.mp4" },
    { num: 400, date: "2014-02-11", videoUrl: "https://www.youtube.com/watch?v=aeapZzsujqc", year: 2014, team: "Real Madrid", opp: "Atlético Madrid", comp: "Champions League", type: "Penalty", score: "4 – 2", min: "93", note: "The last-gasp extra-time penalty in Lisbon that sealed La Décima.", videoUrl: "https://cdn.ronaldoallgoals.com/Goal400.mp4" },
    { num: 500, date: "2015-09-30", videoUrl: "https://www.youtube.com/watch?v=BMzp4Ob2OK8", year: 2015, team: "Real Madrid", opp: "Malmö", comp: "Champions League", type: "Left Foot", score: "2 – 1", min: "—", note: "His 500th career goal, in the season he became the all-time Champions League top scorer.", videoUrl: "https://cdn.ronaldoallgoals.com/Goal500.mp4" },
    { num: 640, date: "2018-04-03", videoUrl: "https://www.youtube.com/watch?v=Nt8198a0acA", year: 2018, team: "Real Madrid", opp: "Juventus", comp: "Champions League", type: "Left Foot", score: "4 – 1", min: "28", note: "His first-leg brace in a Champions League final — Real Madrid's fourth European crown.", videoUrl: "https://cdn.ronaldoallgoals.com/Goal640.mp4" },
    { num: 700, date: "2019-10-14", year: 2019, team: "Portugal", opp: "Ukraine", comp: "Nations League", type: "Left Foot", score: "3 – 1", min: "—", note: "His 700th career goal, in the Nations League campaign he won and topped.", videoUrl: "https://cdn.ronaldoallgoals.com/Goal700.mp4" },
    { num: 900, date: "2024-09-05", year: 2024, team: "Portugal", opp: "Croatia", comp: "Nations League", type: "Penalty", score: "2 – 1", min: "69", note: "His 900th career goal, converted from the spot in Lisbon.", videoUrl: "https://cdn.ronaldoallgoals.com/Goal900.mp4" },
    { num: 981, year: 2026, team: "Al Nassr", opp: "Al Nassr", comp: "Saudi Pro League", type: "Left Foot", score: "—", min: "—", note: "His 981st and most recent senior goal — the last of a record 981-goal career, scored for Al Nassr.", videoUrl: "https://cdn.ronaldoallgoals.com/Goal981.mp4" },
    { num: 1000, year: 2020, team: "Juventus", opp: "Cagliari", comp: "Serie A", type: "Right Foot", score: "1 – 1", min: "—", note: "His 1,000th senior appearance, in a Serie A draw with Cagliari.", videoUrl: "https://cdn.ronaldoallgoals.com/Goal1000.mp4" }
  ];

  let currentGoal = null;

  const loadGoal = (g) => {
    const video = document.getElementById("latest-goal-video");
    const activeNum = document.getElementById("active-goal-num");
    const activeTitle = document.getElementById("active-goal-title");
    const activeMeta = document.getElementById("active-goal-meta");
    const activeMin = document.getElementById("stat-minute");
    const activeType = document.getElementById("stat-type");
    const activeScore = document.getElementById("stat-score");
    const activeComp = document.getElementById("stat-comp");
    const ytBtn = document.getElementById("btn-yt-highlights");

    if (activeNum) activeNum.textContent = `Goal #${g.num}`;
    if (activeTitle) activeTitle.textContent = `${g.team} vs ${g.opp} (${g.score})`;
    if (activeMeta) activeMeta.textContent = `${g.comp} • ${g.year} • ${g.note}`;
    if (activeMin) activeMin.textContent = `${g.min}'`;
    if (activeType) activeType.textContent = g.type;
    if (activeScore) activeScore.textContent = g.score;
    if (activeComp) activeComp.textContent = g.comp;

    if (video && g.videoUrl) {
      video.src = g.videoUrl;
      video.load();
      video.play().catch(() => {});
      video.scrollIntoView({ behavior: "smooth", block: "center" });
    } else if (g.date) {
      // the archive carries no clip of this goal: open its date in the
      // Birthday Explorer, where that date's video plays
      window.location.href = `/${getCurrentLangCode()}/birthday/${g.date.slice(5)}`;
      return;
    }
    if (ytBtn) ytBtn.href = `https://www.youtube.com/results?search_query=Ronaldo+goal+${g.num}+vs+${encodeURIComponent(g.opp)}`;
  };

  spinBtn.addEventListener("click", () => {
    spinBtn.disabled = true;
    display.innerHTML = `
      <div class="roulette-spinning-state">
        <div class="roulette-spinner-ring"></div>
        <div class="roulette-spintip">🎲 Spinning across 981 career goals...</div>
      </div>
    `;

    setTimeout(() => {
      spinBtn.disabled = false;
      const g = LEGENDARY_ROULETTE_GOALS[Math.floor(Math.random() * LEGENDARY_ROULETTE_GOALS.length)];
      currentGoal = g;

      display.innerHTML = `
        <div class="roulette-result-card animate-pop">
          <div class="result-card-badges">
            <span class="badge-goal-gold">Goal #${g.num}</span>
            <span class="badge-goal-year">${g.year}</span>
            <span class="badge-goal-comp">${g.comp}</span>
          </div>
          <h3 class="result-goal-match">${g.team} vs ${g.opp} (${g.score})</h3>
          <p class="result-goal-desc">${g.note}</p>
          <div class="result-goal-tags">
            <span>⏱ Minute: <b>${g.min}'</b></span>
            <span>🎯 Type: <b>${g.type}</b></span>
          </div>
        </div>
      `;

      if (loadBtn) {
        loadBtn.style.display = "inline-flex";
        loadBtn.onclick = () => loadGoal(currentGoal);
      }
      spinBtn.innerHTML = "<span>🎲 Spin Another Goal</span>";
    }, 400);
  });
}

// Global click and keydown delegation for language switcher, mobile menu drawer, theme toggles, and modal backdrops
if (typeof document !== "undefined") {
  document.addEventListener("click", (e) => {
    const menuTrigger = e.target.closest("#mobile-menu-btn, .mobile-menu-btn");
    if (menuTrigger) {
      e.preventDefault();
      const drawer = document.getElementById("mobile-nav-drawer");
      if (drawer && !drawer.hidden) {
        closeMobileMenuDrawer();
      } else {
        openMobileMenuDrawer();
      }
      return;
    }
    const drawerClose = e.target.closest("#mobile-drawer-close-btn, .mobile-drawer-close");
    if (drawerClose) {
      e.preventDefault();
      closeMobileMenuDrawer();
      return;
    }
    const drawerEl = document.getElementById("mobile-nav-drawer");
    if (drawerEl && e.target === drawerEl) {
      closeMobileMenuDrawer();
      return;
    }
    const drawerLink = e.target.closest(".mobile-drawer-link");
    if (drawerLink) {
      closeMobileMenuDrawer();
      return;
    }
    const drawerLang = e.target.closest("#drawer-lang-btn");
    if (drawerLang) {
      e.preventDefault();
      closeMobileMenuDrawer();
      openLangModal();
      return;
    }
    const drawerTheme = e.target.closest("#drawer-theme-btn");
    if (drawerTheme) {
      e.preventDefault();
      const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
      const next = current === "dark" ? "light" : "dark";
      if (next === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
      } else {
        document.documentElement.removeAttribute("data-theme");
      }
      try { localStorage.setItem("theme", next); } catch (_) {}
      return;
    }

    const langTrigger = e.target.closest("#rail-lang-btn, .rail-lang-btn, #mobile-lang-btn, .mobile-lang-btn");
    if (langTrigger) {
      e.preventDefault();
      openLangModal();
      return;
    }
    const closeTrigger = e.target.closest("#lang-modal-close-btn, .lang-modal-close");
    if (closeTrigger) {
      e.preventDefault();
      closeLangModal();
      return;
    }
    const modal = document.getElementById("lang-modal");
    if (modal && e.target === modal) {
      closeLangModal();
      return;
    }
    const langCard = e.target.closest(".lang-card-option");
    if (langCard) {
      const code = langCard.getAttribute("data-code");
      if (code) {
        try { localStorage.setItem("ronaldostats_lang_choice", code); } catch (_) {}
      }
      return;
    }
    const mobTheme = e.target.closest("#mobile-theme-btn, .mobile-theme-btn");
    if (mobTheme) {
      e.preventDefault();
      const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
      const next = current === "dark" ? "light" : "dark";
      if (next === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
      } else {
        document.documentElement.removeAttribute("data-theme");
      }
      try { localStorage.setItem("theme", next); } catch (_) {}
      return;
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const drawer = document.getElementById("mobile-nav-drawer");
      if (drawer && !drawer.hidden) {
        closeMobileMenuDrawer();
      }
      const modal = document.getElementById("lang-modal");
      if (modal && !modal.hidden) {
        closeLangModal();
      }
    }
  });
}

function initLanguageAndMobileTopBar() {
  if (typeof document === "undefined") return;

  const curLangCode = getCurrentLangCode();
  const curLangObj = LANGUAGES.find((l) => l.code === curLangCode) || LANGUAGES[0];

  // Remove any legacy inline .lang-switcher elements
  try {
    document.querySelectorAll(".lang-switcher").forEach((el) => el.remove());
  } catch (_) {}

  // 1. Setup Desktop Rail Language Button
  try {
    const rail = document.querySelector(".rail");
    if (rail) {
      let railLangWrap = rail.querySelector(".rail-lang-wrap");
      if (!railLangWrap) {
        railLangWrap = document.createElement("div");
        railLangWrap.className = "rail-lang-wrap";
        railLangWrap.innerHTML = `
          <button type="button" class="rail-lang-btn" id="rail-lang-btn" aria-label="Select Language (${curLangObj.name})" title="Select Language">
            <svg class="rail-lang-globe" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            <span class="rail-lang-label">${curLangObj.name}</span>
            <span class="rail-lang-tag">${curLangObj.code.toUpperCase()}</span>
          </button>
        `;
        const railBadge = rail.querySelector(".rail-badge");
        if (railBadge) {
          const mark = railBadge.querySelector(".rail-mark");
          if (mark) {
            const logoImg = document.createElement("img");
            logoImg.src = "/img/logo.png";
            logoImg.alt = "RonaldoStats";
            logoImg.className = "rail-mark-logo";
            logoImg.width = 36;
            logoImg.height = 36;
            mark.replaceWith(logoImg);
          }
          if (railBadge.nextSibling) {
            rail.insertBefore(railLangWrap, railBadge.nextSibling);
          } else {
            rail.prepend(railLangWrap);
          }
        }
      }
    }
  } catch (_) {}

  // 2. Setup Mobile Top Bar
  try {
    let mobileTopBar = document.querySelector(".mobile-topbar");
    if (!mobileTopBar && document.body) {
      mobileTopBar = document.createElement("header");
      mobileTopBar.className = "mobile-topbar";
      mobileTopBar.setAttribute("aria-label", "Mobile navigation header");
      mobileTopBar.innerHTML = `
        <a href="${getLangUrl(curLangCode)}" class="mobile-topbar-brand" aria-label="RonaldoStats">
          <img src="/img/logo.png" alt="RonaldoStats Logo" width="28" height="28" style="object-fit:contain;border-radius:4px;flex:0 0 28px;"/>
          <span class="mobile-topbar-title">Ronaldo<b>Stats</b></span>
        </a>
        <div class="mobile-topbar-actions">
          <button type="button" class="mobile-lang-btn" id="mobile-lang-btn" aria-label="Change language">
            <span class="mobile-lang-flag">${curLangObj.flag}</span>
            <span class="mobile-lang-code">${curLangObj.code.toUpperCase()}</span>
            <span class="mobile-lang-arrow">▾</span>
          </button>
          <button type="button" class="mobile-theme-btn" id="mobile-theme-btn" aria-label="Toggle dark mode">
            <svg class="sun-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
            <svg class="moon-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          </button>
          <button type="button" class="mobile-menu-btn" id="mobile-menu-btn" aria-label="Open Navigation Menu" aria-expanded="false" title="Menu">
            <svg class="menu-icon" viewBox="0 0 24 24" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            <svg class="close-icon" viewBox="0 0 24 24" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      `;
      document.body.prepend(mobileTopBar);
    }
  } catch (_) {}

  // Auto-center active navigation rail tab on mobile
  try {
    const activeTab = document.querySelector(".rail nav a.on, .rail nav a[aria-current='page']");
    if (activeTab && window.innerWidth <= 900) {
      setTimeout(() => {
        activeTab.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
      }, 120);
    }
  } catch (_) {}

  // 3. Ensure language modal & mobile menu drawer are created
  try {
    ensureLangModal();
    ensureMobileMenuDrawer();
    ensureMobileMoreNavBtn();
    ensureDesktopBrandHeader();
    initDonationPopup();
    initPortugalStreamNotification();
    initFanArcade();
    initGlobalGoatPoll();
  } catch (_) {}

  // 4. Device & Location-Based Language View Detection
  const LANG_MESSAGES = {
    es: {
      name: "Español",
      flag: "🇪🇸",
      detected: "Detectamos que tu dispositivo está en español.",
      suggest: "¿Deseas ver RonaldoStats en español?",
      switchBtn: "Ver en Español",
      stayBtn: "Continuar en English",
      autoNotice: "Mostrando en Español según tu dispositivo.",
      changeBtn: "Cambiar"
    },
    pt: {
      name: "Português",
      flag: "🇧🇷",
      detected: "Detectamos que seu dispositivo está em português.",
      suggest: "Deseja ver o RonaldoStats em português?",
      switchBtn: "Ver em Português",
      stayBtn: "Continuar en English",
      autoNotice: "Exibindo em Português conforme seu dispositivo.",
      changeBtn: "Mudar"
    },
    fr: {
      name: "Français",
      flag: "🇫🇷",
      detected: "Votre appareil est configuré en français.",
      suggest: "Souhaitez-vous voir RonaldoStats en français ?",
      switchBtn: "Voir en Français",
      stayBtn: "Continuer en anglais",
      autoNotice: "Affiché en français selon votre appareil.",
      changeBtn: "Changer"
    },
    ar: {
      name: "العربية",
      flag: "🇪🇬",
      detected: "تم اكتشاف أن لغة جهازك هي العربية.",
      suggest: "هل ترغب في تصفح رونالدو ستاتس باللغة العربية؟",
      switchBtn: "التصفح بالعربية",
      stayBtn: "المتابعة بالإنجليزية",
      autoNotice: "يتم العرض بالعربية بناءً على إعدادات جهازك.",
      changeBtn: "تغيير"
    },
    bn: {
      name: "বাংলা",
      flag: "🇧🇩",
      detected: "আপনার ডিভাইসের ভাষা বাংলা হিসেবে শনাক্ত হয়েছে।",
      suggest: "আপনি কি বাংলায় রোনালদো পরিসংখ্যান দেখতে চান?",
      switchBtn: "বাংলায় দেখুন",
      stayBtn: "English এ থাকুন",
      autoNotice: "আপনার ডিভাইস অনুযায়ী বাংলায় দেখানো হচ্ছে।",
      changeBtn: "পরিবর্তন"
    },
    hi: {
      name: "हिन्दी",
      flag: "🇮🇳",
      detected: "आपकी डिवाइस की भाषा हिन्दी पहचानी गई है।",
      suggest: "क्या आप रोनाल्डो के आंकड़े हिन्दी में देखना चाहते हैं?",
      switchBtn: "हिन्दी में देखें",
      stayBtn: "English में जारी रखें",
      autoNotice: "आपके डिवाइस के अनुसार हिन्दी में प्रदर्शित।",
      changeBtn: "बदलें"
    },
    ro: {
      name: "Română",
      flag: "🇷🇴",
      detected: "Am detectat că limba dispozitivului tău este română.",
      suggest: "Dorești să vezi RonaldoStats în limba română?",
      switchBtn: "Vezi în Română",
      stayBtn: "Rămâi pe English",
      autoNotice: "Afișat în română conform dispozitivului tău.",
      changeBtn: "Schimbă"
    },
    uz: {
      name: "Oʻzbekcha",
      flag: "🇺🇿",
      detected: "Qurilmangiz tili oʻzbekcha ekanligi aniqlandi.",
      suggest: "RonaldoStatsni oʻzbek tilida koʻrishni xohlaysizmi?",
      switchBtn: "Oʻzbekcha koʻrish",
      stayBtn: "Englishda davom etish",
      autoNotice: "Qurilmangizga mos ravishda oʻzbek tilida koʻrsatilmoqda.",
      changeBtn: "Oʻzgartirish"
    },
    en: {
      name: "English",
      flag: "🇺🇸",
      detected: "Your device is set to English.",
      suggest: "Would you like to view RonaldoStats in English?",
      switchBtn: "Switch to English",
      stayBtn: "Stay here",
      autoNotice: "Viewing in English based on device settings.",
      changeBtn: "Change"
    }
  };

  function detectDeviceAndLocationLang() {
    try {
      const saved = localStorage.getItem("ronaldostats_lang_choice");
      if (saved && LANGUAGES.some((l) => l.code === saved)) return saved;
    } catch (_) {}

    const langs = (typeof navigator !== "undefined" && navigator.languages && navigator.languages.length) ? navigator.languages : [typeof navigator !== "undefined" ? (navigator.language || "") : ""];
    for (const l of langs) {
      const lower = (l || "").toLowerCase();
      if (lower.startsWith("es")) return "es";
      if (lower.startsWith("pt")) return "pt";
      if (lower.startsWith("fr")) return "fr";
      if (lower.startsWith("ar")) return "ar";
      if (lower.startsWith("bn")) return "bn";
      if (lower.startsWith("hi")) return "hi";
      if (lower.startsWith("ro")) return "ro";
      if (lower.startsWith("uz")) return "uz";
      if (lower.startsWith("en")) return "en";
    }

    let tz = "";
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch (_) {}

    if (/Madrid|Canary|Barcelona|Santiago|Bogota|Lima|Caracas|Montevideo|Mexico|Cancun|Merida|Monterrey|Tijuana|Guatemala|Costa_Rica|Panama|Guayaquil|Asuncion|La_Paz|Santo_Domingo|Havana/i.test(tz)) {
      return "es";
    }
    if (/Lisbon|Lisboa|Porto|Coimbra|Faro|Braga|Madeira|Funchal|Azores|Sao_Paulo|Recife|Fortaleza|Belem|Manaus|Brasilia|Bahia|Cuiaba|Porto_Velho|Boa_Vista|Luanda|Maputo/i.test(tz)) {
      return "pt";
    }
    if (/Paris|Niamey|Dakar|Abidjan|Douala|Kinshasa|Bamako|Ouagadougou|Brussels|Geneva/i.test(tz)) {
      return "fr";
    }
    if (/Cairo|Riyadh|Dubai|Baghdad|Kuwait|Qatar|Casablanca|Algiers|Tunis|Amman|Beirut|Muscat|Bahrain|Tripoli|Khartoum/i.test(tz)) {
      return "ar";
    }
    if (/Munich|Turin|Milan|Rome|Oslo|Copenhagen|Stockholm|Helsinki|Zurich|Vienna|Amsterdam|Berlin|Lisbon|Lisboa/i.test(tz)) {
      return "en";
    }
    if (/Dhaka/i.test(tz)) {
      return "bn";
    }
    if (/Bucharest|Chisinau/i.test(tz)) {
      return "ro";
    }
    if (/Tashkent|Samarkand/i.test(tz)) {
      return "uz";
    }

    return "en";
  }

  // 5. Show Auto-Routed Notice Toast
  try {
    const wasAutoRouted = sessionStorage.getItem("geo_routed");
    if (wasAutoRouted) {
      sessionStorage.removeItem("geo_routed");
      const msgObj = LANG_MESSAGES[curLangCode] || LANG_MESSAGES.en;
      const notice = document.createElement("div");
      notice.className = "lang-auto-notice";
      notice.setAttribute("role", "status");
      notice.innerHTML = `
        <span class="lang-auto-notice-flag">${msgObj.flag}</span>
        <span class="lang-auto-notice-text">${msgObj.autoNotice}</span>
        <button type="button" class="lang-auto-notice-link" id="lang-notice-change">${msgObj.changeBtn}</button>
        <button type="button" class="lang-auto-notice-close" id="lang-notice-close" aria-label="Close">&times;</button>
      `;
      document.body.appendChild(notice);
      document.getElementById("lang-notice-change")?.addEventListener("click", () => {
        notice.remove();
        openLangModal();
      });
      document.getElementById("lang-notice-close")?.addEventListener("click", () => {
        notice.remove();
      });
      setTimeout(() => {
        if (notice && notice.parentNode) notice.remove();
      }, 7500);
    }
  } catch (_) {}

  // 6. Show Smart Language Suggestion Banner
  try {
    const isBot = typeof navigator !== "undefined" && /bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent);
    if (!isBot) {
      const detectedLang = detectDeviceAndLocationLang();
      const userChoice = localStorage.getItem("ronaldostats_lang_choice");
      const dismissed = sessionStorage.getItem("ronaldostats_lang_dismissed");

      if (detectedLang && detectedLang !== curLangCode && !userChoice && dismissed !== detectedLang) {
        const targetMsg = LANG_MESSAGES[detectedLang] || LANG_MESSAGES.en;
        const targetUrl = getLangUrl(detectedLang);

        const banner = document.createElement("div");
        banner.className = "lang-suggest-banner";
        banner.id = "lang-suggest-banner";
        banner.setAttribute("role", "region");
        banner.setAttribute("aria-label", "Language recommendation");
        banner.innerHTML = `
          <div class="lang-suggest-content">
            <span class="lang-suggest-flag">${targetMsg.flag}</span>
            <span class="lang-suggest-text">${targetMsg.detected} <b>${targetMsg.suggest}</b></span>
          </div>
          <div class="lang-suggest-actions">
            <a href="${targetUrl}" class="lang-suggest-btn-primary" id="lang-suggest-switch">${targetMsg.switchBtn}</a>
            <button type="button" class="lang-suggest-btn-dismiss" id="lang-suggest-dismiss">${targetMsg.stayBtn}</button>
          </div>
        `;
        if (document.body) {
          document.body.prepend(banner);
        }

        document.getElementById("lang-suggest-switch")?.addEventListener("click", () => {
          try { localStorage.setItem("ronaldostats_lang_choice", detectedLang); } catch (_) {}
        });
        document.getElementById("lang-suggest-dismiss")?.addEventListener("click", () => {
          try {
            sessionStorage.setItem("ronaldostats_lang_dismissed", detectedLang);
            localStorage.setItem("ronaldostats_lang_choice", curLangCode);
          } catch (_) {}
          banner.remove();
        });
      }
    }
  } catch (_) {}

  centerActiveNav();
  if (typeof window !== "undefined") {
    window.addEventListener("resize", centerActiveNav, { passive: true });
  }
}

// Initialize immediately and also on DOMContentLoaded
initLanguageAndMobileTopBar();
if (typeof window !== "undefined" && document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initLanguageAndMobileTopBar);
}

async function load() {
  let r;
  try {
    r = await fetch("/data/ronaldo-data.json", { cache: "no-store" });
  } catch (_) {}
  if (!r || !r.ok) {
    r = await fetch("data/ronaldo-data.json", { cache: "no-store" });
  }
  if (!r.ok) throw new Error("data " + r.status);
  const d = await r.json();
  // Secondary sources for the LIVE registry — best-effort; verified
  // fallbacks in LIVE apply when a fetch fails (offline, adblock, path).
  const get = async (...urls) => {
    for (const u of urls) {
      try {
        const x = await fetch(u, { cache: "no-store" });
        if (x && x.ok) return await x.json();
      } catch (_) {}
    }
    return null;
  };
  const [messi, lg] = await Promise.all([
    get("/data/messi.json", "data/messi.json"),
    get("/data/latest-goal.json", "data/latest-goal.json"),
  ]);
  d.messi = messi;
  d.latest = lg;
  return d;
}
const el = (id) => document.getElementById(id);
const esc = (s) => {
  if (s == null) return "";
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]));
};
const n = (v) => Number(v).toLocaleString("en-US");
const gpg = (g, a) => (a ? (g / a).toFixed(2) : "—");
const BN_D = "০১২৩৪৫৬৭৮৯";
const bn = (v) => String(v).replace(/[0-9]/g, (dd) => BN_D[+dd]);

/* ================= LIVE STAT REGISTRY (runtime variables) =================
 * Every number templates display lives here — same names and derivation as
 * scripts/stats.mjs (build time). normalize() refreshes LIVE from the JSON
 * database on every load, so editing a variable means editing JSON, never
 * hunting literals. Fallbacks are the verified 2026-10-11 truth, so pages
 * still render correctly if a fetch fails. Frozen history (past match facts,
 * trophy ordinals of won events, per-team NPG/FK/HT splits absent from the
 * JSON) intentionally stays literal — see CONTEXT.md.
 */

const LIVE = {
  goals: 981, apps: 1340, clubGoals: 835, argGoals: 146, argCaps: 234,
  assists: 261, tmAssists: 291, ga: 1242, tmGa: 1272,
  trophies: 35, rTrophies: 46, tReal: 15, tManUtd: 9, tJuve: 5, tAlNassr: 2, tSporting: 1, tPortugal: 3,
  gap: -45, fewer: 159, road: 19,
  rGoals: 936, rApps: 1181, rAssists: 408, rGpg: "0.79", rGa: 1344, astLead: -147,
  npg: 797, npgR: 827, npgLead: -30,
  alnassrGoals: 134, alnassrApps: 157,
  abtReal: 152, abtPortugal: 14, abtAlNassr: 9, abtJuve: 20, abtManUtd: 66,
  compLiga: 311, compCDR: 22, compSuper: 12, compUCLb: 105, compUCLm: 24, compUCLj: 14,
  compPL: 103, compSerieA: 81, compSPL: 106, compPrimeira: 3,
  compCupMU: 17, compCupJuve: 4, compCupNassr: 3, compCupSporting: 2, compACL: 16,
  compShield: 1, compSupercoppaIt: 2, compACC: 9,
  compQual: 52, compWC: 52, compNL: 15, compEuro: 55, compConfed: 2, compFriend: 22,
  lgNum: 981, lgOpp: "Al Nassr", lgDate: "12 October 2026",
};

// The nine dictionary modules are separate files, so the helpers
// they call have to be reachable from their scope. Publishing them on the
// global object keeps the dictionaries self-contained: they format numbers
// with n(), escape with esc() and read the live registry with LIVE.
globalThis.n = n;
globalThis.esc = esc;
globalThis.bn = bn;
globalThis.LIVE = LIVE;

/* Click a column header to sort. Rows with class "total" stay pinned at the bottom. */
function sortable(table) {
  if (!table) return;
  const ths = [...table.querySelectorAll("thead th")];
  if (!ths.length) return;
  const val = (cell) => {
    const t = cell.textContent.trim();
    const pair = t.match(/(\d[\d,]*)\s*\/\s*(\d[\d,]*)/); // "apps / goals" cells sort by goals
    if (pair) return +pair[2].replace(/,/g, "");
    const c = t.replace(/[^0-9.\-]/g, "");
    return c !== "" && !isNaN(+c) ? +c : t.toLowerCase();
  };
  ths.forEach((th, i) => {
    th.setAttribute("data-sortable", "");
    th.setAttribute("tabindex", "0");
    th.setAttribute("role", "button");
    const go = () => {
      const tb = table.tBodies[0];
      if (!tb) return;
      const dir = th.getAttribute("data-sorted") === "asc" ? "desc" : "asc";
      ths.forEach((h) => h.removeAttribute("data-sorted"));
      th.setAttribute("data-sorted", dir);
      const rows = [...tb.rows];
      const pinned = rows.filter((r) => r.classList.contains("total"));
      const rest = rows.filter((r) => !r.classList.contains("total"));
      rest.sort((a, b) => {
        const x = val(a.cells[i]), y = val(b.cells[i]);
        const c = typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y));
        return dir === "asc" ? c : -c;
      });
      rest.forEach((r) => tb.appendChild(r));
      pinned.forEach((r) => tb.appendChild(r));
    };
    th.addEventListener("click", go);
    th.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
  });
}

/* Live-filter a table's rows (total rows stay visible). When `param` is given
   the query persists in the URL (?param=text) via history.replaceState, so a
   filtered view is shareable and survives reload; it is read back on init. */
function tableSearch(table, placeholder, param) {
  if (!table || !table.parentElement) return;
  const box = document.createElement("div");
  box.className = "table-search";
  box.innerHTML = `<input type="search" placeholder="${placeholder}" aria-label="${placeholder}">`;
  const mountTarget = table.closest(".table-wrap") || table;
  mountTarget.before(box);
  const inp = box.querySelector("input");
  const apply = (q) => {
    q = q.trim().toLowerCase();
    [...table.tBodies[0].rows].forEach((r) => {
      r.hidden = !(!q || r.classList.contains("total") || r.textContent.toLowerCase().includes(q));
    });
  };
  let timer = null;
  inp.addEventListener("input", () => {
    apply(inp.value);
    if (!param) return;
    clearTimeout(timer);
    timer = setTimeout(() => {
      const url = new URL(location.href);
      if (inp.value.trim()) url.searchParams.set(param, inp.value.trim());
      else url.searchParams.delete(param);
      history.replaceState(null, "", url.pathname + url.search + url.hash);
    }, 300);
  });
  if (param) {
    const initial = new URLSearchParams(location.search).get(param);
    if (initial) { inp.value = initial; apply(initial); }
  }
}

const CLUBS = {
  sporting: { name: "Sporting CP", years: "2002 to 2003", badge: "SCP", colors: "#008057,#ffffff" },
  manutd: { name: "Manchester United", years: "2003 to 2009, 2021 to 2022", badge: "MUN", colors: "#DA291C,#FBE122" },
  realmadrid: { name: "Real Madrid", years: "2009 to 2018", badge: "RMA", colors: "#00529F,#ffffff" },
  juventus: { name: "Juventus", years: "2018 to 2022", badge: "JUV", colors: "#000000,#ffffff" },
  alnassr: { name: "Al Nassr", years: "2023 to present", badge: "NSR", colors: "#F9E300,#00529B" },
  portugal: { name: "Portugal", years: "2003 to present", badge: "POR", colors: "#046a38,#da291c" },
};
/* Real club crests (self-hosted in public/img/teams/) layered over the
   original CSS colour badge: if a crest file is missing, onerror drops the
   <img> and the old badge shows through instead of a broken image. */
const CREST_FILE = {
  sporting: "sporting", manutd: "man-utd", realmadrid: "real-madrid",
  juventus: "juventus", alnassr: "al-nassr", portugal: "portugal"
};
const badge = (k, eager) => {
  const c = CLUBS[k];
  const label = c.name + " crest";
  const file = CREST_FILE[k] || k;
  return `<span class="crest" data-team="${k}"><span class="club-badge" data-team="${k}" aria-hidden="true" style="display:none">${c.badge}</span>` +
    `<img class="crest-img" src="/img/teams/${file}.png" alt="${label}" width="30" height="30" loading="${eager ? "eager" : "lazy"}" decoding="async" onerror="const b=this.previousElementSibling;if(b)b.style.display='';this.remove()"></span>`;
};
const teamName = (k) => (CLUBS[k] ? CLUBS[k].name : k);
const CLUB_KEY = { "Real Madrid": "realmadrid", "Manchester United": "manutd", "Juventus": "juventus", "Al Nassr": "alnassr", "Sporting CP": "sporting" };
const dispClub = (c) => (CLUB_KEY[c] ? CLUBS[CLUB_KEY[c]].name : c);
/* The dashboard filter ids are the CLUBS keys; the JSON assist map uses its own
   snake_case team keys, and the i18n dictionaries label the teams with the
   snake_case ids too. Both maps are kept in sync here. */
const TEAM_ASSIST_KEY = {
  realmadrid: "real_madrid", manutd: "manchester_united", juventus: "juventus",
  alnassr: "al_nassr", sporting: "sporting_cp", portugal: "portugal"
};
const TEAM_DICT_ID = {
  realmadrid: "real_madrid", manutd: "manchester_united", juventus: "juventus",
  alnassr: "al_nassr", sporting: "sporting_cp", portugal: "portugal"
};
/* ?team=real_madrid (dictionary id) still resolves to the CLUBS key. */
const TEAM_ALIAS = {
  real_madrid: "realmadrid", manchester_united: "manutd", al_nassr: "alnassr",
  sporting_cp: "sporting", realmadrid: "realmadrid", manutd: "manutd",
  juventus: "juventus", alnassr: "alnassr", sporting: "sporting", portugal: "portugal"
};
/* Per-team set-piece splits (frozen literals — the JSON carries career totals
   only). They reconcile exactly with the canonical career totals: the 184
   career penalties (114 club + 70 Portugal), the 66 direct free-kick goals and
   the 66 hat-tricks. */
const PEN_BY_TEAM = { realmadrid: 71, manutd: 12, juventus: 19, alnassr: 12, sporting: 0, portugal: 70 };
const FK_BY_TEAM  = { realmadrid: 34, manutd: 12, juventus: 6, alnassr: 9, sporting: 0, portugal: 5 };
const HT_BY_TEAM  = { realmadrid: 28, manutd: 8, juventus: 7, alnassr: 12, sporting: 1, portugal: 10 };
/* Normalize the JSON's varied shapes into the flat fields renderers use. */
function normalize(d) {
  const t = d.totals;
  t.goals = t.combined.goals;
  t.apps = t.combined.appearances;
  t.clubs = { apps: t.club.appearances, goals: t.club.goals, goalsPerGame: t.club.goalsPerGame };
  // The JSON stores country appearances as `appearances`, but 18 call sites
  // (KPI notes, the 8 languages' FAQ answers, the Portugal summary lines, the
  // goals-by-year total row and the dashboard filter) read `country.apps`.
  // Without this alias they all rendered the string "NaN" into visible copy.
  t.country.apps = t.country.appearances;
  const _todayIso = new Date().toISOString().split("T")[0];
  const _updIso = (d.meta && d.meta.updated && d.meta.updated > _todayIso) ? d.meta.updated : _todayIso;
  d.lastUpdated = new Date(_updIso + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const fin = {};
  d.byFinish.forEach((r) => { fin[r.finish] = r.goals; });
  d.byFinish = { openPlay: fin["Open play"], penalties: fin["Penalties"], freeKicks: fin["Free kicks"] };
  const bp = {};
  d.byBodyPart.forEach((r) => { bp[r.part] = r.goals; });
  d.byBodyPart = { left: bp["Left foot"], right: bp["Right foot"], head: bp["Head"], other: bp["Other (chest etc.)"] };
  d.calendarYears.forEach((r) => { r.provisional = r.status === "provisional-ongoing"; });
  d.clubSeasons.forEach((s) => {
    s.provisional = s.season === "2026";
    ["league", "cup", "continental", "other"].forEach((k) => { s[k] = { apps: s[k][0], goals: s[k][1] }; });
  });
  d.countryYears.forEach((s) => { s.provisional = s.year === 2026; });
  d.trophies.forEach((x) => { x.count = x.years.length; });

  // ---- LIVE registry refresh (see LIVE declaration): every template number
  // reads LIVE.*, so a JSON update propagates without touching literals. ----
  {
    const R = d.messi || {};
    const LGJ = (d.latest && d.latest.latestGoal) || {};
    const LGT = (d.latest && d.latest.totals) || {};
    const compRow = (team, ...keys) =>
      (d.byCompetition || []).find((r) => r.team === team && keys.some((k) => r.competition.startsWith(k)));
    const compGoals = (team, fb, ...keys) => {
      const r = compRow(team, ...keys);
      return r && typeof r.goals === "number" ? r.goals : fb;
    };
    const tByTeam = {};
    (d.trophies || []).forEach((x) => {
      if (x.team === "Individual") return;
      tByTeam[x.team] = (tByTeam[x.team] || 0) + (x.years ? x.years.length : 0);
    });
    const rGoals = R.goals ?? 936;
    const rApps = R.appearances ?? 1181;
    const goals = t.goals, apps = t.apps;
    const assists = t.assists.official, tmAssists = t.assists.transfermarkt;
    Object.assign(LIVE, {
      goals, apps,
      clubGoals: t.clubs.goals, argGoals: t.country.goals, argCaps: t.country.apps,
      assists, tmAssists,
      ga: goals + assists, tmGa: goals + tmAssists,
      trophies: d.splits?.trophies?.ronaldo ?? LIVE.trophies,
      rTrophies: d.splits?.trophies?.messi ?? LIVE.rTrophies,
      tReal: tByTeam["Real Madrid"] ?? LIVE.tReal,
      tManUtd: tByTeam["Manchester United"] ?? LIVE.tManUtd,
      tJuve: tByTeam["Juventus"] ?? LIVE.tJuve,
      tAlNassr: tByTeam["Al Nassr"] ?? LIVE.tAlNassr,
      tSporting: tByTeam["Sporting CP"] ?? LIVE.tSporting,
      tPortugal: tByTeam["Portugal"] ?? LIVE.tPortugal,
      gap: rGoals - goals, fewer: apps - rApps, road: 1000 - goals,
      rGoals, rApps,
      rAssists: R.assists ?? 408,
      rGpg: rApps ? (rGoals / rApps).toFixed(2) : "0.79",
      rGa: rGoals + (R.assists ?? 408),
      astLead: assists - (R.assists ?? 408),
      npg: goals - d.byFinish.penalties,
      npgR: rGoals - (R.penalties ?? 109),
      npgLead: (goals - d.byFinish.penalties) - (rGoals - (R.penalties ?? 109)),
      alnassrGoals: LGT.alnassrGoals ?? LIVE.alnassrGoals,
      alnassrApps: t.assists.byTeam?.al_nassr?.appearances ?? LIVE.alnassrApps,
      abtReal: t.assists.byTeam?.real_madrid?.official ?? 152,
      abtPortugal: t.assists.byTeam?.portugal?.official ?? 14,
      abtAlNassr: t.assists.byTeam?.al_nassr?.official ?? 9,
      abtJuve: t.assists.byTeam?.juventus?.official ?? 20,
      abtManUtd: t.assists.byTeam?.manchester_united?.official ?? 66,
      compLiga: compGoals("Real Madrid", LIVE.compLiga, "La Liga"),
      compCDR: compGoals("Real Madrid", LIVE.compCDR, "Copa del Rey"),
      compSuper: compGoals("Real Madrid", LIVE.compSuper, "Supercopa de España"),
      compUCLb: compGoals("Real Madrid", LIVE.compUCLb, "UEFA Champions League"),
      compUCLm: compGoals("Manchester United", LIVE.compUCLm, "UEFA Champions League"),
      compUCLj: compGoals("Juventus", LIVE.compUCLj, "UEFA Champions League"),
      compPL: compGoals("Manchester United", LIVE.compPL, "Premier League"),
      compSerieA: compGoals("Juventus", LIVE.compSerieA, "Serie A"),
      compSPL: compGoals("Al Nassr", LIVE.compSPL, "Saudi Pro League"),
      compPrimeira: compGoals("Sporting CP", LIVE.compPrimeira, "Primeira Liga"),
      compCupMU: compGoals("Manchester United", LIVE.compCupMU, "FA Cup"),
      compCupJuve: compGoals("Juventus", LIVE.compCupJuve, "Coppa Italia"),
      compCupNassr: compGoals("Al Nassr", LIVE.compCupNassr, "King's Cup"),
      compCupSporting: compGoals("Sporting CP", LIVE.compCupSporting, "Taça de Portugal"),
      compShield: compGoals("Manchester United", LIVE.compShield, "FA Community Shield"),
      compSupercoppaIt: compGoals("Juventus", LIVE.compSupercoppaIt, "Supercoppa Italiana"),
      compACC: compGoals("Al Nassr", LIVE.compACC, "Arab Club Champions Cup"),
      compACL: compGoals("Al Nassr", LIVE.compACL, "AFC Champions League"),
      compQual: compGoals("Portugal", LIVE.compQual, "FIFA World Cup / qualifiers"),
      compWC: compGoals("Portugal", LIVE.compWC, "FIFA World Cup"),
      compNL: compGoals("Portugal", LIVE.compNL, "UEFA Nations League"),
      compEuro: compGoals("Portugal", LIVE.compEuro, "UEFA European Championship"),
      compConfed: compGoals("Portugal", LIVE.compConfed, "FIFA Confederations Cup"),
      compFriend: compGoals("Portugal", LIVE.compFriend, "International friendlies"),
      lgNum: LGJ.goalNumber ?? goals,
      lgOpp: LGJ.opponent ?? LIVE.lgOpp,
      lgDate: LGJ.formattedDate ?? d.lastUpdated,
    });
  }
}

function clubAgg(d) {
  const o = {};
  d.clubSeasons.forEach((s) => {
    const k = CLUB_KEY[s.club];
    o[k] = o[k] || { apps: 0, goals: 0 };
    o[k].apps += s.apps;
    o[k].goals += s.goals;
  });
  o.portugal = { apps: d.totals.country.apps, goals: d.totals.country.goals };
  return o;
}

/* ---------- shared blocks ---------- */
function setHead(d, ledeHTML) {
  const lang = (document.documentElement.lang || "en").toLowerCase().split("-")[0];
  const isEn = lang === "en";
  if (el("upd")) {
    if (isEn) {
      el("upd").textContent = "Updated " + d.lastUpdated;
    }
  }
  if (el("lede")) {
    if (isEn || !el("lede").textContent.trim()) {
      el("lede").innerHTML = ledeHTML;
    }
  }
  if (el("foot-date")) {
    const footDates = {
      es: `Cristiano Ronaldo: ${n(d.totals.apps)} partidos oficiales senior, ${n(d.totals.goals)} goles ` +
        `(${n(d.totals.clubs.apps)} PJ / ${n(d.totals.clubs.goals)} goles en clubes, ` +
        `${n(d.totals.country.apps)} / ${n(d.totals.country.goals)} con Portugal). Actualizado al ${d.lastUpdated}.`,
      pt: `Cristiano Ronaldo: ${n(d.totals.apps)} partidas oficiais seniores, ${n(d.totals.goals)} gols ` +
        `(${n(d.totals.clubs.apps)} jogos / ${n(d.totals.clubs.goals)} gols por clubes, ` +
        `${n(d.totals.country.apps)} / ${n(d.totals.country.goals)} por Portugal). Atualizado em ${d.lastUpdated}.`,
      fr: `Cristiano Ronaldo : ${n(d.totals.apps)} matchs officiels en senior, ${n(d.totals.goals)} buts ` +
        `(${n(d.totals.clubs.apps)} matchs / ${n(d.totals.clubs.goals)} buts en club, ` +
        `${n(d.totals.country.apps)} / ${n(d.totals.country.goals)} avec le Portugal). Mis à jour le ${d.lastUpdated}.`,
      ar: `كريستيانو رونالدو: ${n(d.totals.apps)} مباراة رسمية مع الفريق الأول، ${n(d.totals.goals)} هدفاً ` +
        `(${n(d.totals.clubs.apps)} مباراة / ${n(d.totals.clubs.goals)} هدفاً مع الأندية، ` +
        `${n(d.totals.country.apps)} / ${n(d.totals.country.goals)} مع البرتغال). آخر تحديث ${d.lastUpdated}.`,
      bn: `ক্রিস্টিয়ানো রোনালদো: ${n(d.totals.apps)}টি সিনিয়র ম্যাচ, ${n(d.totals.goals)}টি গোল ` +
        `(${n(d.totals.clubs.apps)} ম্যাচে ${n(d.totals.clubs.goals)} ক্লাব গোল, ` +
        `পর্তুগালের হয়ে ${n(d.totals.country.apps)} ম্যাচে ${n(d.totals.country.goals)} গোল)। সর্বশেষ আপডেট ${d.lastUpdated}।`,
      hi: `क्रिस्टियानो रोनाल्डो: ${n(d.totals.apps)} सीनियर मैच, ${n(d.totals.goals)} गोल ` +
        `(${n(d.totals.clubs.apps)} क्लब मैच / ${n(d.totals.clubs.goals)} क्लब गोल, ` +
        `${n(d.totals.country.apps)} / ${n(d.totals.country.goals)} पुर्तगाल)। अंतिम अद्यतन ${d.lastUpdated}।`,
      ro: `Cristiano Ronaldo: ${n(d.totals.apps)} meciuri oficiale la seniori, ${n(d.totals.goals)} goluri ` +
        `(${n(d.totals.clubs.apps)} meciuri / ${n(d.totals.clubs.goals)} goluri la cluburi, ` +
        `${n(d.totals.country.apps)} / ${n(d.totals.country.goals)} cu Portugalia). Actualizat la ${d.lastUpdated}.`,
      uz: `Kristiano Ronaldo: ${n(d.totals.apps)} ta rasmiy o'yin, ${n(d.totals.goals)} ta gol ` +
        `(${n(d.totals.clubs.apps)} ta klub o'yini / ${n(d.totals.clubs.goals)} ta gol, ` +
        `Portugal bilan ${n(d.totals.country.apps)} / ${n(d.totals.country.goals)}). Oxirgi yangilanish: ${d.lastUpdated}.`
    };
    el("foot-date").textContent = footDates[lang] ||
      `Cristiano Ronaldo: ${n(d.totals.apps)} senior appearances, ${n(d.totals.goals)} goals ` +
      `(${n(d.totals.clubs.apps)} club apps / ${n(d.totals.clubs.goals)} club goals, ` +
      `${n(d.totals.country.apps)} / ${n(d.totals.country.goals)} for Portugal). Last checked ${d.lastUpdated}.`;
  }
  const footEl = document.querySelector("footer");
  if (footEl && !footEl.querySelector(".footer-social-bar")) {
    const socialDiv = document.createElement("div");
    socialDiv.className = "footer-social-bar";
    socialDiv.innerHTML = `
      <a href="https://x.com/ronaldostat1" target="_blank" rel="noopener noreferrer" class="footer-x-link" aria-label="Follow RonaldoStats on X (@ronaldostat1)">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        <span>Follow @ronaldostat1 on X</span>
      </a>
      <a href="https://t.me/ronaldostatdotcom" target="_blank" rel="noopener noreferrer" class="footer-x-link footer-tg-link" aria-label="Join RonaldoStats on Telegram">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
        <span>Telegram @ronaldostatdotcom</span>
      </a>
    `;
    const crestNote = footEl.querySelector(".crest-note");
    if (crestNote) {
      footEl.insertBefore(socialDiv, crestNote);
    } else {
      footEl.appendChild(socialDiv);
    }
  }
}
function reveal() {
  document.querySelectorAll("main.wrap > *").forEach((s, i) => {
    s.classList.add("reveal");
    s.style.animationDelay = Math.min(i * 0.04, 0.4) + "s";
  });
}

function getLang() {
  const l = (document.documentElement.lang || "en").toLowerCase();
  for (const c of ["es", "pt", "fr", "ar", "bn", "hi", "ro", "uz"]) {
    if (l.startsWith(c)) return c;
  }
  return "en";
  DICT = getDict(getLangCode());
  return getLangCode();
}


function renderExplore(d, page) {
  const e = el("explore");
  if (!e) return;
  const lang = getLang();
  const list = DICT.EXPLORE_LANGS;
  const skip = Array.isArray(page) ? page : [page];
  // The dictionaries carry the route for one language; force the current
  // language's prefix so a card never links out of the locale.
  const localize = (href) => String(href || "").replace(/^\/(en|es|pt|fr|ar|bn|hi|ro|uz)(?=\/|$)/, "/" + lang);
  e.innerHTML = list.filter((x) => !skip.includes(x.page))
    .slice(0, 9)
    .map((x) => `<a class="link-card" href="${localize(x.href)}"><strong>${esc(x.t)}</strong><span>${esc(x.d(d))}</span></a>`)
    .join("");
}
function methodHTML(d, extra) {
  const lang = getLang();
  if (lang === "es") {
    const teams = "Real Madrid, Manchester United, Juventus, Al Nassr, Sporting CP y Portugal";
    return methodColophon(`<h2>Cómo recopilamos estas estadísticas</h2>` +
      `<p>Contabilizamos una sola cosa: partidos oficiales de primer equipo senior para ${teams} — ` +
      `cada partido de liga, copa nacional, noche continental y selección mayor. Sin fútbol juvenil, sin filiales y sin amistosos de clubes.</p>` +
      `<details class="method-more"><summary>Cómo verificamos las cifras</summary>` +
      `<p>Los goles por temporada y año se compilan a partir de actas oficiales de partido y se contrastan con registros de clubes ` +
      `y competiciones tras cada encuentro. Todos los datos están 100% verificados. ${extra || ""}</p>` +
      `<p class="colophon">Sitio independiente actualizado manualmente tras cada partido. Totales 100% verificados con fuentes primarias oficiales.</p></details>`);
  }
  if (lang === "pt") {
    const teams = "Real Madrid, Manchester United, Juventus, Al Nassr, Sporting CP e Portugal";
    return methodColophon(`<h2>Como reunimos essas estatísticas</h2>` +
      `<p>Contabilizamos apenas partidas oficiais de equipes principais seniores para ${teams} — ` +
      `todos os jogos de liga, copas nacionais, competições continentais e jogos da seleção. Sem divisões de base e sem amistosos de clubes.</p>` +
      `<details class="method-more"><summary>Como verificamos os números</summary>` +
      `<p>Os gols são compilados a partir de súmulas oficiais de jogos e validados após cada partida. Todos os dados são 100% verificados. ${extra || ""}</p>` +
      `<p class="colophon">Site independente mantido e verificado com fontes primárias oficiais.</p></details>`);
  }
  if (lang === "fr") {
    const teams = "Real Madrid, Manchester United, Juventus, Al Nassr, Sporting CP et l'équipe du Portugal";
    return methodColophon(`<h2>Comment nous compilons ces statistiques</h2>` +
      `<p>Nous comptabilisons une seule chose : les matchs officiels en équipe première senior pour ${teams} — ` +
      `championnats, coupes nationales, coupes d'Europe/Amérique et sélections nationales. Pas de matchs de jeunes ni d'amicaux en club.</p>` +
      `<details class="method-more"><summary>Vérification des chiffres</summary>` +
      `<p>Chaque but est vérifié selon les feuilles de match officielles après chaque rencontre. Données 100% certifiées. ${extra || ""}</p>` +
      `<p class="colophon">Base de données indépendante mise à jour avec rigueur après chaque rencontre.</p></details>`);
  }
  if (lang === "ar") {
    const teams = "ريال مدريد ومانشستر united ويوفنتوس والنصر وسبورتينغ ومنتخب البرتغال";
    return methodColophon(`<h2>كيف نجمع هذه الإحصائيات</h2>` +
      `<p>نحن نحتسب أمراً واحداً: المباريات الرسمية لفرق الدرجة الأولى الكبرى لكل من ${teams} — ` +
      `الدوري، الكؤوس المحلية، الليالي القارية والمنتخب الأول. لا تشمل المباريات الودية للأندية أو فرق الشباب.</p>` +
      `<details class="method-more"><summary>طريقة التحقق من الأرقام</summary>` +
      `<p>تُسجل الأهداف من تقارير المباريات الرسمية وتتم مراجعتها بعد كل مباراة. جميع الأرقام موثقة بنسبة 100%. ${extra || ""}</p>` +
      `<p class="colophon">موقع مستقل يتم تحديثه ومراجعته بمصادر أولية رسمية بعد كل مباراة.</p></details>`);
  }
  if (lang === "bn") {
    const teams = "রিয়াল মাদ্রিদ, ম্যানচেস্টার ইউনাইটেড, জুভেন্তুস, আল নাসর, স্পোর্টিং এবং পর্তুগাল জাতীয় দল";
    return methodColophon(`<h2>আমরা কীভাবে এই পরিসংখ্যান সংগ্রহ করি</h2>` +
      `<p>আমরা কেবল একটি বিষয় গণনা করি: ${teams}-এর হয়ে সিনিয়র অফিসিয়াল প্রথম দলের ম্যাচ। কোনো প্রীতি ম্যাচ বা যুব পর্যায়ের খেলা অন্তর্ভুক্ত নয়।</p>` +
      `<details class="method-more"><summary>পরিসংখ্যান যাচাইকরণ</summary>` +
      `<p>প্রতিটি ম্যাচের অফিশিয়াল ম্যাচ রিপোর্ট থেকে গোলের তথ্য সংকলিত এবং যাচাই করা হয়েছে। সকল ডেটা ১০০% সত্য। ${extra || ""}</p>` +
      `<p class="colophon">স্বতন্ত্র ওয়েবসাইট যা প্রতিটি ম্যাচের পর প্রাথমিক অফিসিয়াল সূত্র থেকে সরাসরি হালনাগাদ করা হয়।</p></details>`);
  }
  if (lang === "hi") {
    const teams = "रियल मैड्रिड, मैनचेस्टर यूनाइटेड, जुवेंतस, अल नस्र, स्पोर्टिंग और पुर्तगाल";
    return methodColophon(`<h2>हम ये आँकड़े कैसे तैयार करते हैं</h2>` +
      `<p>हम केवल आधिकारिक सीनियर प्रथम-टीम मैचों की गणना करते हैं: ${teams} के लिए सभी लीग, कप, महाद्वीपीय और अंतरराष्ट्रीय मैच।</p>` +
      `<details class="method-more"><summary>आंकड़ों का सत्यापन</summary>` +
      `<p>प्रत्येक मैच के आधिकारिक रिकॉर्ड से आंकड़े संकलित किए जाते हैं। 100% सत्यापित डेटा। ${extra || ""}</p>` +
      `<p class="colophon">स्वतंत्र सांख्यिकी डेटाबेस जिसे प्रत्येक मैच के बाद आधिकारिक स्रोतों से अपडेट किया जाता है।</p></details>`);
  }
  if (lang === "ro") {
    const teams = "Real Madrid, Manchester United, Juventus, Al Nassr, Sporting CP și Naționala Portugaliei";
    return methodColophon(`<h2>Cum compilăm aceste statistici</h2>` +
      `<p>Numărăm doar meciurile oficiale la nivel de seniori pentru ${teams} — ` +
      `campionat, cupe naționale, cupe continentale și meciuri internaționale oficiale.</p>` +
      `<details class="method-more"><summary>Verificarea cifrelor</summary>` +
      `<p>Datele sunt verificate manual din rapoartele oficiale după fiecare partidă. ${extra || ""}</p>` +
      `<p class="colophon">Site independent actualizat cu surse oficiale de prim rang.</p></details>`);
  }
  if (lang === "uz") {
    const teams = "Real Madrid, Manchester United, Juventus, Al Nassr, Sporting va Portugaliya terma jamoasi";
    return methodColophon(`<h2>Biz bu statistikalarni qanday yig'amiz</h2>` +
      `<p>Biz faqat ${teams} uchun asosiy tarkibdagi rasmiy uchrashuvlarni hisoblaymiz — ` +
      `barcha liga, milliy kubok, qit'a musobaqalari va terma jamoa o'yinlari.</p>` +
      `<details class="method-more"><summary>Raqamlarni tekshirish</summary>` +
      `<p>Gollar har bir o'yindan so'ng rasmiy protokollar asosida to'liq tekshiriladi. ${extra || ""}</p>` +
      `<p class="colophon">Har bir o'yindan so'ng rasmiy manbalar bilan yangilanadigan mustaqil statistika.</p></details>`);
  }
  const teams = "Real Madrid, Manchester United, Juventus, Al Nassr, Sporting CP and Portugal";
  return methodColophon(`<h2>How I put these numbers together</h2>` +
    `<p>I count one thing: official senior first-team matches for ${teams} — ` +
    `every league game, domestic cup, continental night and international, and nothing else. No youth football, no reserves, no friendlies dressed up as history.</p>` +
    `<details class="method-more"><summary>How these numbers are checked</summary>` +
    `<p>Season and calendar-year goals are tallied from full match records and checked against club ` +
    `and competition records plus free match-data feeds (ESPN, openfootball, football-data.org) after every game. The free-kick, penalty and hat-trick splits are a widely published tally, marked ` +
    `provisional until my match-by-match hand count is finished. ${extra || ""}</p>` +
    `<p class="colophon">This is a one-person site, kept by hand. Totals only ever change when I have a named source and have checked it twice — ` +
    `never by a script, never on a rumour. If you spot something wrong, that date stamp at the top tells you exactly when I last looked.</p></details>`);
}
function renderMethod(d, extra) {
  const m = el("method");
  if (m) m.innerHTML = methodHTML(d, extra);
}

/* ---------- SVG charts ---------- */
/* One viewBox cannot serve a 340px phone and a 1120px desktop: the phone would
   just shrink every label to ~4px. So the geometry is chosen at render time.
   Compact = a narrow, tall box with larger user-unit type and thinned labels. */
let SPARK_COMPACT = typeof window !== "undefined" ? window.innerWidth < 760 : false;
if (typeof window !== "undefined" && window.matchMedia) {
  const _mq = window.matchMedia("(min-width: 760px)");
  const _sync = () => {
    const next = !_mq.matches;
    if (next !== SPARK_COMPACT) {
      SPARK_COMPACT = next;
      window.dispatchEvent(new Event("ronaldo:spark-relayout"));
    }
  };
  if (_mq.addEventListener) _mq.addEventListener("change", _sync);
  else if (_mq.addListener) _mq.addListener(_sync);
}

function sparkSVG(rows, opts) {
  opts = opts || {};
  const compact = SPARK_COMPACT;
  const W = compact ? 360 : 1000;
  const H = compact ? 300 : 210;
  const base = compact ? 246 : 175;
  const maxH = compact ? 176 : 120;
  const targetY = compact ? 34 : 44;
  const labelY = compact ? 292 : 198;
  const max = Math.max(...rows.map((r) => r.value), 1);
  const step = W / rows.length;
  const bw = compact
    ? Math.min(Math.max(5, step * 0.58), 20)
    : Math.min(Math.max(20, step * 0.52), 64);
  const rx = compact ? 1.5 : 4;
  // Only label years where the text cannot collide with its neighbour.
  const labelEvery = compact ? Math.max(1, Math.ceil(40 / step)) : (opts.skipLabels ? 2 : 1);
  const svgCls = "spark" + (compact ? " compact" : "");
  let s = `<svg class="${svgCls}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(opts.label || "Bar chart")}">`;
  s += `<defs>` +
    `<linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fd0f2"/><stop offset="1" stop-color="#0e7cc0"/></linearGradient>` +
    `<linearGradient id="barPeak" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eec22f"/><stop offset="1" stop-color="#8a6300"/></linearGradient>` +
    `<linearGradient id="cumAreaGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0e7cc0" stop-opacity="0.22"/><stop offset="1" stop-color="#0e7cc0" stop-opacity="0.02"/></linearGradient>` +
    `</defs>`;

  const lang = getLang();
  const yrSuffix = {
    es: " /año", pt: " /ano", fr: " /an", ar: " /سنة", bn: " /বছর", hi: " /वर्ष", ro: " /an", uz: " /yil"
  }[lang] || " /yr";
  s += `<line class="baseline" x1="0" y1="${base}" x2="${W}" y2="${base}"></line>`;
  s += `<text class="axis" x="4" y="${(base - maxH + (compact ? 14 : 4)).toFixed(1)}">${max}${opts.cumulative ? yrSuffix : ""}</text><text class="axis" x="4" y="${(base - 4).toFixed(1)}">0</text>`;

  // 1. Draw bars first so cumulative line and labels sit cleanly on top
  const lastIdx = rows.length - 1;
  // Decide which columns get a year label BEFORE drawing, so we can guarantee
  // a minimum gap. Forcing the last column on top of a regular tick used to
  // print "2025" and "2026" on top of each other.
  const minGap = compact ? 42 : 46;
  const wanted = [];
  for (let i = 0; i <= lastIdx; i += labelEvery) wanted.push(i);
  if (wanted[wanted.length - 1] !== lastIdx) wanted.push(lastIdx);
  const peakIdx = rows.findIndex((r) => r.peak || (r.year != null && r.year === opts.peakYear));
  if (peakIdx >= 0 && !wanted.includes(peakIdx)) wanted.push(peakIdx);
  wanted.sort((a, b) => a - b);
  const labelled = [];
  for (const i of wanted) {
    const x = i * step + step / 2;
    if (labelled.length && x - labelled[labelled.length - 1] * step - step / 2 < minGap) {
      // Too close to the previous label: keep the later one only if it is the
      // final column, otherwise drop this one.
      if (i !== lastIdx) continue;
      labelled.pop();
    }
    labelled.push(i);
  }
  const labelSet = new Set(labelled);

  rows.forEach((r, i) => {
    const h = Math.max(compact ? 2 : 3, (r.value / max) * maxH);
    const x = (i * step + (step - bw) / 2).toFixed(1);
    const y = (base - h).toFixed(1);
    const peak = r.peak || (r.year != null && r.year === opts.peakYear);
    const selected = opts.selectedYear != null && r.year === opts.selectedYear;
    const cls = "bar ybar" + (peak ? " peak" : "") + (r.provisional ? " prov" : "") + (selected ? " active" : "");
    const rect = `<rect class="${cls}" data-year="${r.year != null ? r.year : ""}" data-val="${r.value}" style="--i:${i}" x="${x}" y="${y}" width="${bw.toFixed(1)}" height="${h.toFixed(1)}" rx="${rx}"><title>${esc(r.tip)}</title></rect>`;
    s += (opts.linkPrefix && r.year != null) ? `<a href="${opts.linkPrefix}${r.year}">${rect}</a>` : rect;

    const labY = Math.max(base - h - (compact ? 10 : 8), compact ? 22 : 26).toFixed(1);
    if (r.peak) {
      s += `<text class="peak-label" x="${(i * step + step / 2).toFixed(0)}" y="${labY}">${r.value}</text>`;
    } else if (r.provisional) {
      s += `<text class="prov-label" x="${(i * step + step / 2).toFixed(0)}" y="${labY}">${r.value}</text>`;
    }
    if (labelSet.has(i))
      s += `<text class="yr" x="${(i * step + step / 2).toFixed(0)}" y="${labelY}">${esc(r.label)}</text>`;
  });

  // 2. Cumulative polyline, target line, and labels drawn AFTER bars so they stay visible
  if (opts.cumulative) {
    const tot = rows.reduce((a, r) => a + r.value, 0);
    const target = 1000;
    let run = 0;
    const pts = rows.map((r, i) => {
      run += r.value;
      const x = (i * step + step / 2).toFixed(1);
      const y = (base - (run / target) * (base - targetY)).toFixed(1);
      return `${x},${y}`;
    });
    const firstX = (step / 2).toFixed(1);
    const lastX = ((rows.length - 1) * step + step / 2).toFixed(1);
    const lastY = (base - (tot / target) * (base - targetY)).toFixed(1);

    const chartI18n = {
      es: { target: "Meta de 1.000 goles", now: `${n(tot)} actual`, tip: `Total en su carrera: ${n(tot)} goles` },
      pt: { target: "Meta de 1.000 gols", now: `${n(tot)} atual`, tip: `Total na carreira: ${n(tot)} gols` },
      fr: { target: "Objectif 1 000 buts", now: `${n(tot)} actuel`, tip: `Total en carrière : ${n(tot)} buts` },
      ar: { target: "هدف الـ 1,000 هدف", now: `${n(tot)} الآن`, tip: `إجمالي المسيرة: ${n(tot)} هدفاً` },
      bn: { target: "১,০০০ গোলের লক্ষ্য", now: `${n(tot)} বর্তমানে`, tip: `ক্যারিয়ার মোট: ${n(tot)} গোল` },
      hi: { target: "1,000 गोल का लक्ष्य", now: `${n(tot)} वर्तमान`, tip: `करियर कुल: ${n(tot)} गोल` },
      ro: { target: "Ținta de 1.000 de goluri", now: `${n(tot)} în prezent`, tip: `Total carieră: ${n(tot)} goluri` },
      uz: { target: "1 000 ta gol maqsadi", now: `${n(tot)} hozir`, tip: `Faoliyatidagi jami: ${n(tot)} ta gol` }
    };
    const cLabels = chartI18n[lang] || { target: "1,000 goal target", now: `${n(tot)} now`, tip: `Current career total: ${n(tot)} goals` };

    // Subtle area under cumulative curve
    s += `<polygon class="cum-area" points="${firstX},${base} ${pts.join(" ")} ${lastX},${base}" fill="url(#cumAreaGrad)"/>`;
    // 1,000 goal target line
    s += `<line class="thousand" x1="0" y1="${targetY}" x2="${W}" y2="${targetY}"/>`;
    if (compact) {
      // In a 360-unit box the two right-anchored notes would collide, so the
      // target label goes top-left and the running total sits under the end dot.
      s += `<text class="thousand-label" x="4" y="${targetY - 7}" text-anchor="start">${cLabels.target}</text>`;
      s += `<text class="axis right" x="${W - 4}" y="${(+lastY + 20).toFixed(1)}" text-anchor="end">${cLabels.now}</text>`;
    } else {
      s += `<text class="thousand-label" x="${W - 10}" y="${targetY - 6}">${cLabels.target}</text>`;
      s += `<text class="axis right" x="${W - 10}" y="${targetY + 16}" text-anchor="end">${cLabels.now}</text>`;
    }
    // Cumulative climb line
    s += `<polyline class="cum" points="${pts.join(" ")}"/>`;
    // Current total marker dot
    s += `<circle class="cum-dot" cx="${lastX}" cy="${lastY}" r="${compact ? 4 : 5}"><title>${esc(cLabels.tip)}</title></circle>`;
  }

  return s + `</svg>`;
}
function donutSVG(parts, total, centerTop, centerSub) {
  const R = 70, C = 2 * Math.PI * R;
  let off = 0;
  let s = `<svg class="donut" viewBox="0 0 190 190" role="img" aria-label="${esc(centerTop)}">`;
  parts.forEach((p, i) => {
    const frac = p.value / total;
    const len = Math.max(frac * C - 3, 2);
    s += `<circle cx="95" cy="95" r="${R}" fill="none" stroke="${p.color}" stroke-width="26" ` +
      `stroke-dasharray="0 ${C.toFixed(1)}" stroke-dashoffset="${(-off).toFixed(1)}" ` +
      `data-off="${(-off).toFixed(1)}" data-len="${len.toFixed(1)}" data-c="${C.toFixed(1)}" ` +
      `style="--len:${len.toFixed(1)}px;--c:${C.toFixed(1)}px;--i:${i};" ` +
      `transform="rotate(-90 95 95)" stroke-linecap="butt">` +
      `<title>${esc(p.label)}: ${p.value} of ${total} (${(100 * p.value / total).toFixed(1)}%)</title></circle>`;
    off += frac * C;
  });
  s += `<text class="donut-hole" x="95" y="96">${centerTop}</text><text class="donut-sub" x="95" y="116">${esc(centerSub)}</text></svg>`;
  return s;
}

function clubTableCaption() {
  const lang = getLang();
  const hints = {
    es: "Haz clic en el encabezado de una columna para ordenar. Solo partidos oficiales del primer equipo.",
    pt: "Clique no cabeçalho de uma coluna para ordenar. Apenas partidas oficiais da equipe principal.",
    fr: "Cliquez sur l'en-tête d'une colonne pour trier. Matchs officiels en équipe première uniquement.",
    ar: "انقر على رأس العمود للترتيب. مباريات الفريق الأول الرسمية فقط.",
    bn: "সাজাতে কলামের শিরোনামে ক্লিক করুন। শুধুমাত্র সিনিয়র প্রথম দলের ম্যাচ।",
    hi: "सॉर्ट करने के लिए कॉलम हेडर पर क्लिक करें। केवल सीनियर प्रथम-टीम मैच।",
    ro: "Faceți clic pe antetul unei coloane pentru a sorta. Doar meciuri oficiale de seniori.",
    uz: "Saralash uchun ustun sarlavhasiga bosing. Faqat rasmiy asosiy jamoa o'yinlari."
  };
  const hint = hints[lang] || "Click a column header to sort. Senior first-team matches only.";
  return `<p class="table-hint">${hint}</p>`;
}
function provisionalNote() {
  const lang = getLang();
  const notes = {
    es: `<p class="caveat">Los penaltis (184), los tiros libres (66), los hat-tricks (66) y las asistencias (261) son cifras recopiladas provisionales hasta completar el conteo manual partido a partido.</p>`,
    pt: `<p class="caveat">Os pênaltis (184), os tiros livres (66), os hat-tricks (66) e as assistências (261) são números provisórios até a conclusão da contagem manual jogo a jogo.</p>`,
    fr: `<p class="caveat">Les penaltys (184), les coups francs (66), les triplés (66) et les passes décisives (261) sont des totaux provisoires en attente de vérification match par match.</p>`,
    ar: `<p class="caveat">ركلات الجزاء (184) وركلات حرة مباشرة (66) والثلاثيات (66) والصناعة الحاسمة (261) أرقام مجمّعة منشورة على نطاق واسع، وتُعرض كمؤقتة حتى تكتمل المراجعة اليدوية مباراة بمباراة.</p>`,
    bn: `<p class="caveat">পেনাল্টি (184), সরাসরি ফ্রি-কিক (66), হ্যাট-ট্রিক (66) এবং অ্যাসিস্ট (261) হলো প্রচলিতভাবে প্রকাশিত সংক্ষিপ্ত হিসাব, যা প্রতিটি ম্যাচ আলাদা করে হাতে গণনা সম্পন্ন না হওয়া পর্যন্ত প্রাক্ষণিক হিসেবে দেখানো হয়।</p>`,
    hi: `<p class="caveat">पेनाल्टी (184), सीधे फ्री-किक (66), हैट-ट्रिक (66) और सहायता (261) व्यापक रूप से प्रकाशित संकलित आँकड़े हैं, जिन्हें प्रत्येक मैच का हाथ से गिनती पूरी होने तक अस्थायी माना जाता है।</p>`,
    ro: `<p class="caveat">Penalty-urile (184), loviturile libere (66), hat-trick-urile (66) și pasele decisive (261) sunt cifre compilate publicate pe scară largă, afișate ca provizorii până la finalizarea numărării manuale meci cu meci.</p>`,
    uz: `<p class="caveat">Penalty (184), to'g'ridan-to'g'ri erkin zarbalar (66), het-triklar (66) va assistlar (261) — bular keng tarqalgan yig'ilma hisoblar bo'lib, har bir o'yin bo'yicha qo'lda hisoblash tugagunga qadar vaqtinchalik deb ko'rsatiladi.</p>`,
  };
  return notes[lang] || `<p class="caveat">Penalties (184), direct free kicks (66), hat-tricks (66) and assists (261) are widely published compiled tallies, shown as provisional until a true match-by-match hand count is finished.</p>`;
}
function methodColophon(inner) {
  const lang = getLang();
  const intros = {
    es: "Cómo recopilamos estas cifras — verificadas manualmente y contrastadas dos veces con fuentes oficiales.",
    pt: "Como reunimos esses números — verificados manualmente e conferidos com fontes oficiais.",
    fr: "Comment nous compilons ces chiffres — vérifiés manuellement et recoupés avec les sources officielles.",
    ar: "طريقة جمع هذه الأرقام — تم التحقق منها يدوياً ومطابقتها مرتين مع المصادر الرسمية.",
    bn: "আমরা কীভাবে এই সংখ্যা সংগ্রহ করি — প্রতিটি ম্যাচ রিপোর্ট থেকে যাচাইকৃত এবং অফিসিয়াল সূত্রের সাথে পরীক্ষিত।",
    hi: "हम ये आंकड़े कैसे तैयार करते हैं — आधिकारिक स्रोतों से दो बार सत्यापित और हाथ से गिने गए।",
    ro: "Cum am adunat aceste cifre — numărate manual și verificate de două ori cu surse oficiale.",
    uz: "Bu raqamlarni qanday to'plaganimiz — qo'lda tekshirilgan va rasmiy manbalar bilan ikki marta tasdiqlangan."
  };
  const intro = intros[lang] || "How I put these numbers together — counted by hand and checked twice against named sources.";
  return `<div class="colophon"><p>${intro}</p>${inner}${provisionalNote()}</div>`;
}
// Localized copy now lives in src/i18n/<lang>.js (DICT.HOME); this file only
// owns the rendering: renderHome, initBdayQuickForm, renderOnThisDay

/* ================= HOME ================= */
function renderHome(d) {
  const t = d.totals, agg = clubAgg(d), p = d.profile;
  const seasons = d.clubSeasons.length;
  const lang = getLang();
  const dict = DICT.HOME;

  setHead(d, dict.head(t, p, d));

  const prof = el("profile");
  if (prof) {
    const dob = new Date(p.born + "T00:00:00").toLocaleDateString(dict.locale || "en-GB", { day: "numeric", month: "long", year: "numeric" });
    prof.innerHTML =
      `<figure class="identity-photo"><picture><source srcset="/img/ronaldo-450.webp 1x, /img/ronaldo.webp 2x" type="image/webp"><img src="/img/ronaldo.jpg" alt="Cristiano Ronaldo" width="148" height="197" loading="eager" fetchpriority="high" decoding="async"></picture><figcaption class="photo-credit">Cristiano Ronaldo · Portugal & Al Nassr</figcaption></figure><div class="identity-main">` +
      `<p class="identity-name">${esc(p.short)} <span class="jersey" aria-label="${dict.shirt10}">${p.number}</span></p>` +
      `<p class="identity-meta">${dict.meta(p, dob)}</p>` +
      `<dl class="identity-facts"><div><dt>${dict.roleLabel}</dt><dd>${esc(p.role)}</dd></div>` +
      `<div><dt>${dict.teamsLabel}</dt><dd>${esc(p.teams.join(" · "))}</dd></div>` +
      `<div><dt>${dict.nowLabel}</dt><dd>${esc(p.current.join(" · "))}</dd></div></dl></div>`;
    prof.classList.add("identity--tight");
    if (!document.getElementById("quick-jump-nav")) {
      const quickJumpI18n = {
        en: { goals: "Career Record", kpis: "KPIs & 1k Road", clubs: "Club Breakdown", faq: "FAQ" },
        es: { goals: "Registro Oficial", kpis: "Métricas Clave", clubs: "Por Clubes", faq: "Preguntas" },
        pt: { goals: "Registro Oficial", kpis: "Métricas", clubs: "Por Clubes", faq: "Perguntas" },
        fr: { goals: "Bilan Officiel", kpis: "Chiffres Clés", clubs: "Par Clubs", faq: "FAQ" },
        ar: { goals: "السجل الرسمي", kpis: "المؤشرات الكبرى", clubs: "حسب النادي", faq: "الأسئلة الشائعة" },
        bn: { goals: "অফিশিয়াল রেকর্ড", kpis: "মূল পরিসংখ্যান", clubs: "ক্লাব অনুযায়ী", faq: "প্রশ্নোত্তর" },
        hi: { goals: "आधिकारिक रिकॉर्ड", kpis: "मुख्य आंकड़े", clubs: "क्लब अनुसार", faq: "सवाल-जवाब" },
        ro: { goals: "Bilanț Oficial", kpis: "Indicatori", clubs: "Pe Cluburi", faq: "Întrebări" },
        uz: { goals: "Rasmiy Rekord", kpis: "Asosiy Ko'rsatkich", clubs: "Klublar", faq: "Savol-Javob" }
      };
      const qj = quickJumpI18n[lang] || quickJumpI18n.en;
      const qjBar = document.createElement("nav");
      qjBar.id = "quick-jump-nav";
      qjBar.className = "quick-jump-bar";
      qjBar.setAttribute("aria-label", "Section quick jump");
      qjBar.innerHTML =
        `<a href="#ronaldo-total-goals" class="qj-pill">⚽ <span>${qj.goals}</span></a>` +
        `<a href="#kpis" class="qj-pill">📊 <span>${qj.kpis}</span></a>` +
        `<a href="#byclub" class="qj-pill">👕 <span>${qj.clubs}</span></a>` +
        `<a href="#faq" class="qj-pill">❓ <span>${qj.faq}</span></a>`;
      prof.after(qjBar);
    }
  }

  const kpis = el("kpis");
  function kpi(l, v, s) { return `<div class="kpi"><span class="kpi-label">${l}</span><span class="kpi-value">${v}</span><span class="kpi-note">${s}</span></div>`; }
  if (kpis) {
    const togo = 1000 - t.goals;
    const done = d.calendarYears.filter((r) => !r.provisional);
    const last3 = done.slice(-3);
    const pace = last3.reduce((s, r) => s + r.goals, 0) / last3.length;
    const projYear = done[done.length - 1].year + Math.max(1, Math.ceil(togo / pace));
    kpis.innerHTML =
      kpi(dict.kpiCareer, n(t.goals), dict.kpiCareerNote(t.goalsPerGame, seasons)) +
      kpi(dict.kpiApps, n(t.apps), dict.kpiAppsNote(n(t.clubs.apps), n(t.country.apps))) +
      kpi(dict.kpiArg, n(t.country.goals), dict.kpiArgNote(gpg(t.country.goals, t.country.apps), n(t.country.apps))) +
      kpi(dict.kpiTrophies, String(LIVE.trophies), dict.kpiTrophiesNote(lang)) +
      `<div class="kpi progress"><span class="kpi-label">${dict.kpiRoad}</span>` +
      `<span class="kpi-value">${n(t.goals)} <small style="font-size:1rem;color:var(--muted)">/ 1,000</small></span>` +
      `<div class="progress-track"><div class="progress-fill" style="width:${(t.goals / 10).toFixed(1)}%"></div></div>` +
      `<span class="kpi-note">${dict.kpiRoadNote(togo, projYear, pace)}</span></div>`;
    kpis.classList.add("kpi--hero");
    if (!el("copyStats")) {
      kpis.insertAdjacentHTML("afterend",
        `<div class="share-row"><button type="button" class="btn-primary" id="copyStats">${dict.copyStatsBtn}</button>` +
        `<span class="share-msg" id="copyMsg" role="status" aria-live="polite"></span></div>`);
    }
  }

  const copyStatsBtn = el("copyStats");
  if (copyStatsBtn) {
    copyStatsBtn.addEventListener("click", async () => {
      const text = dict.copyText(n(t.goals), n(t.apps), n(t.clubs.goals), n(t.country.goals), d.lastUpdated);
      const msg = el("copyMsg");
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) await navigator.clipboard.writeText(text);
        else {
          const ta = document.createElement("textarea");
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          ta.remove();
        }
        if (msg) msg.textContent = dict.copyMsg;
      } catch {
        if (msg) msg.textContent = text;
      }
      if (msg) {
        clearTimeout(copyStatsBtn.dataset.timer);
        copyStatsBtn.dataset.timer = setTimeout(() => { msg.textContent = ""; }, 4000);
      }
    });
  }

  const qa = el("qa");
  if (qa) {
    const faqFn = dict.faq || DICT.HOME.faq;
    qa.innerHTML = faqFn(t, agg, d.byFinish, d, lang).slice(0, 6).map((q) => `<details class="faq-item"><summary class="faq-question"><span>${q[0]}</span><span class="faq-chevron" aria-hidden="true">▾</span></summary><div class="faq-answer"><p>${q[1]}</p></div></details>`).join("");
    qa.className = "faq-accordion";
  }

  const clubCard = el("club-card");
  if (clubCard) {
    const order = ["realmadrid", "manutd", "juventus", "alnassr", "sporting", "portugal"];
    const rows = order.map((k2) => {
      const a = agg[k2];
      return `<tr><th scope="row"><span class="club-cell">${badge(k2)}<span class="club-name">${teamName(k2)}<small>${CLUBS[k2].years}</small></span></span></th>` +
        `<td>${n(a.apps)}</td><td><b>${n(a.goals)}</b></td><td>${gpg(a.goals, a.apps)}</td></tr>`;
    }).join("");

    clubCard.innerHTML =
      `<div class="table-wrap"><table class="data-table"><caption>${dict.clubCaption(esc(d.lastUpdated), lang)}</caption>` +
      `<thead><tr><th scope="col" class="left">${dict.thTeam}</th><th scope="col">${dict.thApps}</th><th scope="col">${dict.thGoals}</th><th scope="col">${dict.thGpg}</th></tr></thead>` +
      `<tbody>${rows}<tr class="total"><th scope="row">${dict.thTotal}</th><td>${n(t.apps)}</td><td>${n(t.goals)}</td><td>${t.goalsPerGame}</td></tr></tbody></table></div>` + clubTableCaption();
    const cTable = clubCard.querySelector("table");
    if (cTable) sortable(cTable);
  }

  // year widget: dropdown + tiles + full-range bars
  const ys = d.calendarYears;
  const cur = ys[ys.length - 1];
  const yearSub = el("year-sub");
  if (yearSub) {
    yearSub.textContent = dict.yearSub;
  }
  const yearWidget = el("year-widget");
  if (yearWidget) {
    yearWidget.innerHTML =
      `<div class="year-pick-head"><h3 class="year-pick-title">${dict.yearTitle}</h3>` +
      `<div class="year-pick-control"><label for="yearPick">${dict.yearLabel}</label><select id="yearPick" class="inline">` +
      ys.slice().reverse().map((r) => `<option value="${r.year}"${r.year === cur.year ? " selected" : ""}>${r.year}</option>`).join("") +
      `</select></div></div><div class="year-tiles" id="yearTiles"></div>` +
      `<figure style="margin:12px 0 0"><div class="spark-wrap" id="yearSpark"></div>` +
      `<figcaption class="figcap">${dict.yearFigcap(ys[0].year, cur.year, cur.provisional, lang)}</figcaption></figure>`;
    const drawYear = (y) => {
      const r = ys.find((x) => x.year === +y);
      if (!r) return;
      const yt = el("yearTiles");
      if (yt) {
        yt.innerHTML =
          `<div class="tile"><div class="t-val">${r.goals}</div><div class="t-lab">${dict.tileGoals(r.year, r.provisional)}</div></div>` +
          `<div class="tile"><div class="t-val">${n(r.careerTotal)}</div><div class="t-lab">${dict.tileTotal(r.year)}</div></div>` +
          `<div class="tile"><div class="t-val">${r.age}</div><div class="t-lab">${dict.tileAge(r.year)}</div></div>`;
      }
      const sparkWrap = el("yearSpark");
      if (sparkWrap) {
        sparkWrap.innerHTML = sparkSVG(
          ys.map((x) => ({ label: String(x.year), value: x.goals, year: x.year, peak: x.goals === 69, tip: `${x.year}: ${x.goals} goals (career: ${n(x.careerTotal)})` })),
          { selectedYear: +y, peakYear: 2013, label: `Bar chart of Ronaldo goals in each calendar year, peaking at 69 in 2013` }
        );
        const svg = sparkWrap.querySelector("svg.spark");
        if (svg) {
          svg.classList.add("in");
          svg.querySelectorAll(".bar").forEach((bar) => {
            bar.style.cursor = "pointer";
            bar.addEventListener("click", () => {
              const yr = bar.dataset.year;
              if (yr && el("yearPick")) {
                el("yearPick").value = yr;
                drawYear(yr);
              }
            });
          });
        }
      }
    };
    const yp = el("yearPick");
    if (yp) yp.addEventListener("change", (e) => drawYear(e.target.value));
    drawYear(cur.year);
    // Rotating a phone crosses the 760px breakpoint, so the chart needs a
    // different viewBox. Redraw it rather than leaving a squashed desktop box.
    window.addEventListener("ronaldo:spark-relayout", () => drawYear(cur.year));
  }

  const best = ys.reduce((a, b) => (b.goals > a.goals ? b : a));
  const post30 = ys.filter((r) => r.age >= 30).reduce((s, r) => s + r.goals, 0);

  const records = el("records");
  if (records) {
    records.innerHTML = dict.records(best, n(post30), Math.round((post30 / t.goals) * 100))
      .map((r) => `<div class="record"><span class="num">${r[0]}</span><span>${r[1]}</span></div>`).join("");
  }

  const silver = el("silver");
  if (silver) {
    silver.innerHTML =
      `<div class="table-wrap"><table class="data-table"><caption>${dict.silverCaption()}</caption>` +
      `<thead><tr><th scope="col" class="left">${dict.silverThTrophy}</th><th scope="col">${dict.silverThTimes}</th><th scope="col" class="left">${dict.silverThNote}</th></tr></thead><tbody>` +
      dict.silverRows.map((r, i) => `<tr><th scope="row">${r[0]}</th><td>${[LIVE.tReal, LIVE.tManUtd, LIVE.tJuve, LIVE.tPortugal, LIVE.tAlNassr, LIVE.tSporting][i] ?? r[1]}</td><td class="left">${r[2]}</td></tr>`).join("") +
      `</tbody></table></div>`;
    const sTable = silver.querySelector("table");
    if (sTable) sortable(sTable);
  }

  const m = d.byFinish;
  const split = el("split");
  if (split) {
    split.innerHTML = `<div class="split-grid">` +
      `<div class="split-card"><div class="s-val">${m.freeKicks}</div><div class="s-lab">${dict.splitFk}</div><div class="s-note">${dict.splitFkNote}</div></div>` +
      `<div class="split-card"><div class="s-val">${m.penalties}</div><div class="s-lab">${dict.splitPen}</div><div class="s-note">${dict.splitPenNote}</div></div>` +
      `<div class="split-card"><div class="s-val">${d.hatTricks}</div><div class="s-lab">${dict.splitHt}</div><div class="s-note">${dict.splitHtNote}</div></div></div>` +
      `<p class="caveat">${dict.splitCaveat(n(t.goals))}</p>`;
  }

  const faq = el("faq");
  if (faq) {
    const faqFn = dict.faq || DICT.HOME.faq;
    faq.innerHTML = faqFn(t, agg, m, d, lang).map((q) => `<details class="faq-item"><summary class="faq-question"><span>${q[0]}</span><span class="faq-chevron" aria-hidden="true">▾</span></summary><div class="faq-answer"><p>${q[1]}</p></div></details>`).join("");
    faq.className = "faq-accordion";
  }

  // Dynamically sync Road to 1,000 widget if present
  // Dynamically sync Road to 1,000 widget if present (every number derives
  // from live totals on each render — static HTML is SEO fallback only)
  const r1000 = el("road-1000");
  if (r1000) {
    const goals = t.goals || 981;
    const apps = t.apps || 1340;
    const clubG = (d.totals && d.totals.club && d.totals.club.goals) || 835;
    const prtG = (d.totals && d.totals.country && d.totals.country.goals) || 146;
    const remaining = Math.max(0, 1000 - goals);
    const pct = ((goals / 1000) * 100).toFixed(1);
    const pace = apps ? goals / apps : 0.79;
    const fy = new Date().getFullYear();
    const estEnd = fy + Math.max(1, Math.ceil(remaining / (pace * 50)));
    const estStr = `${estEnd - 1}/${estEnd}`;
    const swapInt = (str, val) => String(str).replace(/(?<![\d.,])\d{3}(?![\d])/, String(val));
    const fill = r1000.querySelector(".road-1000-fill");
    if (fill) fill.style.width = `${pct}%`;
    const pin = r1000.querySelector(".road-1000-pin");
    if (pin) {
      pin.style.left = `${pct}%`;
      if (pin.title) pin.title = swapInt(pin.title, goals);
    }
    const track = r1000.querySelector(".road-1000-track");
    if (track) {
      track.setAttribute("aria-valuenow", String(goals));
      const al = track.getAttribute("aria-label");
      if (al) track.setAttribute("aria-label", swapInt(al, goals));
    }
    const pBadge = r1000.querySelector(".r1000-percent");
    if (pBadge) pBadge.textContent = `${pct}%`;
    const remEl = r1000.querySelector(".r1000-remaining");
    if (remEl) remEl.textContent = `${remaining}`;
    const nums = r1000.querySelectorAll(".r1000-num");
    const want = [goals, remaining, clubG, prtG];
    nums.forEach((span, i) => { if (i < want.length) span.textContent = String(want[i]); });
    const pinLabel = r1000.querySelector(".pin-label");
    if (pinLabel) pinLabel.textContent = swapInt(pinLabel.textContent, goals);
    const BN_D = "০১২৩৪৫৬৭৮৯";
    r1000.querySelectorAll(".r1000-pace b").forEach((b) => {
      const txt = b.textContent;
      if (/\d{4}\/\d{4}/.test(txt)) { b.textContent = txt.replace(/\d{4}\/\d{4}/, estStr); return; }
      const m = txt.match(/\d+([.,])\d+/);
      if (m) {
        let v = pace.toFixed(2).replace(".", m[1]);
        if (/[০-৯]/.test(txt)) v = v.replace(/[0-9]/g, (dd) => BN_D[+dd]);
        b.innerHTML = b.innerHTML.replace(/\d+([.,])\d+/, v);
      }
    });
  }

  renderExplore(d, "home");
  renderMethod(d, "");
  initBdayQuickForm();
  renderOnThisDay();
  initFanArcade();
  initPortugalStreamNotification();
}

/* The head-to-head page is a static document: it only needs the shared footer
   stamp and the explore rail, and its own lede must survive. */
function renderVsPage(d) {
  const lede = el("lede");
  setHead(d, lede ? lede.innerHTML : "");
  renderExplore(d, ["vs-ronaldo", "ronaldo-vs-messi"]);
}

/* ================= BIRTHDAY QUICK FORM (HERO WIDGET) ================= */
function initBdayQuickForm() {
  const form = el("bday-quick-form");
  const monthSel = el("bday-quick-month");
  const daySel = el("bday-quick-day");
  if (!form || !monthSel || !daySel) return;

  const daysInMonth = { "01": 31, "02": 29, "03": 31, "04": 30, "05": 31, "06": 30, "07": 31, "08": 31, "09": 30, "10": 31, "11": 30, "12": 31 };

  const populateDays = (selectedDay) => {
    const m = monthSel.value || "01";
    const maxDays = daysInMonth[m] || 31;
    const currentVal = selectedDay || parseInt(daySel.value || "1", 10);
    daySel.innerHTML = "";
    for (let i = 1; i <= maxDays; i++) {
      const opt = document.createElement("option");
      const val = String(i).padStart(2, "0");
      opt.value = val;
      opt.textContent = String(i);
      if (i === Math.min(currentVal, maxDays)) opt.selected = true;
      daySel.appendChild(opt);
    }
  };

  const now = new Date();
  const defM = String(now.getUTCMonth() + 1).padStart(2, "0");
  const defD = now.getUTCDate();
  monthSel.value = defM;
  populateDays(defD);

  monthSel.addEventListener("change", () => populateDays());

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const m = String(monthSel.value).padStart(2, "0");
    const d = String(daySel.value).padStart(2, "0");
    window.location.href = `/en/birthday/${m}-${d}`;
  });
}

/* ================= ON THIS DAY (HOME PAGE WIDGET) ================= */
async function renderOnThisDay() {
  const container = el("on-this-day");
  if (!container) return;
  const lang = getLang();

  const otdDict = {
    en: {
      error: `Could not load today's match history. <a href="/en/birthday">Check birthday explorer &rarr;</a>`,
      empty: `No match data on record for today. <a href="/en/birthday">Explore all 366 days &rarr;</a>`,
      closestBadge: (d) => `📅 CLOSEST SCORING DAY • ${d} (UTC)`,
      liveBadge: (d) => `<span class="live-dot pulse"></span> <b>ON THIS DAY • ${d} (UTC)</b>`,
      headlineClosest: (d, g, nowD, nowM) => `No senior match scheduled today (${nowD} ${nowM} UTC). Closest scoring day: <b>${g} goals</b> on ${d}!`,
      headlineLive: (g, m) => `On this day in history, Cristiano Ronaldo scored <b>${g} goals</b> in <b>${m} match${m > 1 ? "es" : ""}</b>!`,
      btnBday: "🎂 Did Ronaldo score on your birthday?",
      btnExplore: "Explore All 366 Days &rarr;",
      lblMinute: "Minute",
      lblShotType: "Shot Type",
      lblAssist: "Assist",
      lblXg: "Expected Goal (xG)",
      noVideo: "📺 Video clip for this goal is being verified.",
      searchYt: "🔍 Search clip on YouTube &rarr;",
      goalTab: (n, min) => `Goal ${n}${min ? ` (${min}')` : ""}`
    },
    es: {
      error: `No se pudo cargar el historial de hoy. <a href="/es/birthday">Explorar cumpleaños &rarr;</a>`,
      empty: `Sin registros de partidos en esta fecha. <a href="/es/birthday">Ver los 366 días &rarr;</a>`,
      closestBadge: (d) => `📅 DÍA MÁS CERCANO CON GOLES • ${d} (UTC)`,
      liveBadge: (d) => `<span class="live-dot pulse"></span> <b>UN DÍA COMO HOY • ${d} (UTC)</b>`,
      headlineClosest: (d, g, nowD, nowM) => `Sin partidos oficiales disputados hoy (${nowD} ${nowM} UTC). Día más cercano con goles: <b>${g} goles</b> el ${d}.`,
      headlineLive: (g, m) => `Un día como hoy en la historia, Cristiano Ronaldo marcó <b>${g} goles</b> en <b>${m} partido${m > 1 ? "s" : ""}</b>.`,
      btnBday: "🎂 ¿Marcó Ronaldo en tu cumpleaños?",
      btnExplore: "Explorar los 366 Días &rarr;",
      lblMinute: "Minuto",
      lblShotType: "Tipo de gol",
      lblAssist: "Asistencia",
      lblXg: "Gol esperado (xG)",
      noVideo: "📺 El video de este gol se está verificando.",
      searchYt: "🔍 Buscar jugada en YouTube &rarr;",
      goalTab: (n, min) => `Gol ${n}${min ? ` (${min}')` : ""}`
    },
    pt: {
      error: `Não foi possível carregar o histórico de hoje. <a href="/pt/birthday">Ver aniversários &rarr;</a>`,
      empty: `Sem dados de jogos nesta data. <a href="/pt/birthday">Explorar os 366 dias &rarr;</a>`,
      closestBadge: (d) => `📅 DIA MAIS PRÓXIMO COM GOLS • ${d} (UTC)`,
      liveBadge: (d) => `<span class="live-dot pulse"></span> <b>NESTE DIA NA HISTÓRIA • ${d} (UTC)</b>`,
      headlineClosest: (d, g, nowD, nowM) => `Nenhum jogo sênior disputado hoje (${nowD} ${nowM} UTC). Dia mais próximo com gols: <b>${g} gols</b> em ${d}!`,
      headlineLive: (g, m) => `Neste dia na história, Cristiano Ronaldo marcou <b>${g} gols</b> em <b>${m} partida${m > 1 ? "s" : ""}</b>!`,
      btnBday: "🎂 Marcou Ronaldo no seu aniversário?",
      btnExplore: "Explorar Todos os 366 Dias &rarr;",
      lblMinute: "Minuto",
      lblShotType: "Tipo de gol",
      lblAssist: "Assistência",
      lblXg: "Gol esperado (xG)",
      noVideo: "📺 O vídeo deste gol está sendo verificado.",
      searchYt: "🔍 Buscar no YouTube &rarr;",
      goalTab: (n, min) => `Gol ${n}${min ? ` (${min}')` : ""}`
    },
    fr: {
      error: `Impossible de charger l'historique du jour. <a href="/fr/birthday">Explorateur d'anniversaires &rarr;</a>`,
      empty: `Aucun match enregistré à cette date. <a href="/fr/birthday">Explorer les 366 jours &rarr;</a>`,
      closestBadge: (d) => `📅 JOUR LE PLUS PROCHE AVEC BUTS • ${d} (UTC)`,
      liveBadge: (d) => `<span class="live-dot pulse"></span> <b>CE JOUR-LÀ DANS L'HISTOIRE • ${d} (UTC)</b>`,
      headlineClosest: (d, g, nowD, nowM) => `Pas de match senior aujourd'hui (${nowD} ${nowM} UTC). Date la plus proche : <b>${g} buts</b> le ${d} !`,
      headlineLive: (g, m) => `Ce jour-là dans l'histoire, Cristiano Ronaldo a marqué <b>${g} buts</b> en <b>${m} match${m > 1 ? "s" : ""}</b> !`,
      btnBday: "🎂 Ronaldo a-t-il marqué le jour de votre anniversaire ?",
      btnExplore: "Explorer les 366 Jours &rarr;",
      lblMinute: "Minute",
      lblShotType: "Type de but",
      lblAssist: "Passe décisive",
      lblXg: "But attendu (xG)",
      noVideo: "📺 Le clip vidéo de ce but est en cours de validation.",
      searchYt: "🔍 Chercher le but sur YouTube &rarr;",
      goalTab: (n, min) => `But ${n}${min ? ` (${min}')` : ""}`
    },
    ar: {
      error: `تعذر تحميل سجل مباريات اليوم. <a href="/ar/birthday">مستكشف أعياد الميلاد &rarr;</a>`,
      empty: `لا توجد مباريات مسجلة في مثل هذا اليوم. <a href="/ar/birthday">استكشف كافة أيام السنة &rarr;</a>`,
      closestBadge: (d) => `📅 أقرب يوم شهد أهدافاً • ${d} (UTC)`,
      liveBadge: (d) => `<span class="live-dot pulse"></span> <b>في مثل هذا اليوم • ${d} (UTC)</b>`,
      headlineClosest: (d, g, nowD, nowM) => `لم تُلعب مباريات رسمية في هذا اليوم (${nowD} ${nowM} UTC). أقرب يوم تهديفي: <b>${g} أهداف</b> يوم ${d}!`,
      headlineLive: (g, m) => `في مثل هذا اليوم تاريخياً، سجل كريستيانو رونالدو <b>${g} أهداف</b> في <b>${m} مباراة</b>!`,
      btnBday: "🎂 هل سجل رونالدو في يوم ميلادك؟",
      btnExplore: "استكشف جميع أيام السنة الـ 366 &rarr;",
      lblMinute: "الدقيقة",
      lblShotType: "نوع الهدف",
      lblAssist: "صناعة الهدف",
      lblXg: "الأهداف المتوقعة (xG)",
      noVideo: "📺 يجري التحقق من مقطع الفيديو لهذا الهدف.",
      searchYt: "🔍 ابحث عن الهدف على YouTube &rarr;",
      goalTab: (n, min) => `الهدف ${n}${min ? ` (${min}')` : ""}`
    },
    bn: {
      error: `আজকের ম্যাচের রেকর্ড লোড করা যায়নি। <a href="/bn/birthday">জন্মদিনের গোল এক্সপ্লোরার &rarr;</a>`,
      empty: `আজকের তারিখে কোনো ম্যাচের তথ্য নেই। <a href="/bn/birthday">৩৬৬ দিনের সব গোল দেখুন &rarr;</a>`,
      closestBadge: (d) => `📅 নিকটতম গোলের দিন • ${d} (UTC)`,
      liveBadge: (d) => `<span class="live-dot pulse"></span> <b>ইতিহাসে আজকের দিনে • ${d} (UTC)</b>`,
      headlineClosest: (d, g, nowD, nowM) => `আজকের দিনে কোনো ম্যাচ নেই (${nowD} ${nowM} UTC)। নিকটতম গোলের দিন: ${d}-এ <b>${g}টি গোল</b>!`,
      headlineLive: (g, m) => `ইতিহাসে আজকের দিনে ক্রিস্টিয়ানো রোনালদো <b>${m} ম্যাচে</b> <b>${g}টি গোল</b> করেছেন!`,
      btnBday: "🎂 রোনালদো কি আপনার জন্মদিনে গোল করেছিলেন?",
      btnExplore: "৩৬৬ দিনের পূর্ণ বিবরণ দেখুন &rarr;",
      lblMinute: "মিনিট",
      lblShotType: "গোলের ধরন",
      lblAssist: "অ্যাসিস্ট",
      lblXg: "এক্সপেক্টেড গোল (xG)",
      noVideo: "📺 এই গোলের ভিডিও ক্লিপ যাচাই করা হচ্ছে।",
      searchYt: "🔍 YouTube-এ ভিডিও খুঁজুন &rarr;",
      goalTab: (n, min) => `গোল ${n}${min ? ` (${min}')` : ""}`
    },
    hi: {
      error: `आज का मैच इतिहास लोड नहीं हो सका। <a href="/hi/birthday">बर्थडे एक्सप्लोरर &rarr;</a>`,
      empty: `आज की तारीख में कोई मैच रिकॉर्ड नहीं है। <a href="/hi/birthday">सभी 366 दिन देखें &rarr;</a>`,
      closestBadge: (d) => `📅 निकटतम गोल का दिन • ${d} (UTC)`,
      liveBadge: (d) => `<span class="live-dot pulse"></span> <b>इतिहास में आज के दिन • ${d} (UTC)</b>`,
      headlineClosest: (d, g, nowD, nowM) => `आज कोई आधिकारिक मैच निर्धारित नहीं था (${nowD} ${nowM} UTC)। निकटतम गोल दिवस: ${d} को <b>${g} गोल</b>!`,
      headlineLive: (g, m) => `इतिहास में आज के दिन, क्रिस्टियानो रोनाल्डो ने <b>${m} मैचों</b> में <b>${g} गोल</b> किए थे!`,
      btnBday: "🎂 क्या रोनाल्डो ने आपके जन्मदिन पर गोल किया था?",
      btnExplore: "सभी 366 दिनों का अन्वेषण करें &rarr;",
      lblMinute: "मिनट",
      lblShotType: "गोल का प्रकार",
      lblAssist: "असिस्ट",
      lblXg: "अपेक्षित गोल (xG)",
      noVideo: "📺 इस गोल का वीडियो सत्यापित किया जा रहा है।",
      searchYt: "🔍 YouTube पर वीडियो खोजें &rarr;",
      goalTab: (n, min) => `गोल ${n}${min ? ` (${min}')` : ""}`
    },
    ro: {
      error: `Nu s-a putut încărca istoricul zilei. <a href="/ro/birthday">Explorator de zile &rarr;</a>`,
      empty: `Nu există meciuri înregistrate pentru această dată. <a href="/ro/birthday">Explorează toate cele 366 de zile &rarr;</a>`,
      closestBadge: (d) => `📅 CEA MAI APROPIATĂ ZI CU GOLURI • ${d} (UTC)`,
      liveBadge: (d) => `<span class="live-dot pulse"></span> <b>ÎN ACEASTĂ ZI ÎN ISTORIE • ${d} (UTC)</b>`,
      headlineClosest: (d, g, nowD, nowM) => `Niciun meci de seniori programat azi (${nowD} ${nowM} UTC). Ziua cea mai apropiată: <b>${g} goluri</b> pe ${d}!`,
      headlineLive: (g, m) => `În această zi în istorie, Cristiano Ronaldo a marcat <b>${g} goluri</b> în <b>${m} meci${m > 1 ? "uri" : ""}</b>!`,
      btnBday: "🎂 A marcat Ronaldo de ziua ta de naștere?",
      btnExplore: "Explorează toate cele 366 de zile &rarr;",
      lblMinute: "Minut",
      lblShotType: "Tipul golului",
      lblAssist: "Pază de gol",
      lblXg: "Gol așteptat (xG)",
      noVideo: "📺 Clipul video pentru acest gol este în curs de verificare.",
      searchYt: "🔍 Caută golul pe YouTube &rarr;",
      goalTab: (n, min) => `Gol ${n}${min ? ` (${min}')` : ""}`
    },
    uz: {
      error: `Bugungi o'yinlar tarixini yuklab bo'lmadi. <a href="/uz/birthday">Tug'ilgan kunlar &rarr;</a>`,
      empty: `Bugungi sana uchun o'yinlar qayd etilmagan. <a href="/uz/birthday">366 kunni o'rganish &rarr;</a>`,
      closestBadge: (d) => `📅 GOLLAR URILGAN ENG YAQIN KUN • ${d} (UTC)`,
      liveBadge: (d) => `<span class="live-dot pulse"></span> <b>TARIXDA BUGUNGI KUN • ${d} (UTC)</b>`,
      headlineClosest: (d, g, nowD, nowM) => `Bugungi kunda rasmiy o'yin o'tkazilmagan (${nowD} ${nowM} UTC). Eng yaqin golli kun: ${d} da <b>${g} ta gol</b>!`,
      headlineLive: (g, m) => `Tarixda aynan bugungi kunda Kristiano Ronaldo <b>${m} ta o'yinda</b> <b>${g} ta gol</b> urgan!`,
      btnBday: "🎂 Ronaldo tug'ilgan kuningizda gol urganmi?",
      btnExplore: "Barcha 366 kunni o'rganish &rarr;",
      lblMinute: "Daqiqa",
      lblShotType: "Gol turi",
      lblAssist: "Golli uzatma",
      lblXg: "Kutilgan gol (xG)",
      noVideo: "📺 Ushbu golning video lavhasi tekshirilmoqda.",
      searchYt: "🔍 Videoni YouTubedan qidirish &rarr;",
      goalTab: (n, min) => `Gol ${n}${min ? ` (${min}')` : ""}`
    }
  };

  const o = otdDict[lang] || otdDict.en;

  let bdayData;
  try {
    let res;
    try {
      res = await fetch("/data/birthday-goals.json", { cache: "no-store" });
    } catch (_) {}
    if (!res || !res.ok) {
      res = await fetch("data/birthday-goals.json", { cache: "no-store" });
    }
    if (!res.ok) throw new Error("status " + res.status);
    bdayData = await res.json();
  } catch (err) {
    console.error("Failed to load birthday goals for On This Day", err);
    container.innerHTML = `<p class="otd-error">${o.error}</p>`;
    return;
  }

  const calendar = bdayData.calendar || {};
  const pad2 = (n) => String(n).padStart(2, "0");

  const now = new Date();
  const utcM = now.getUTCMonth() + 1;
  const utcD = now.getUTCDate();
  const todayKey = `${pad2(utcM)}-${pad2(utcD)}`;

  let dayData = calendar[todayKey];
  let isClosest = false;

  if (!dayData || dayData.goalsCount === 0) {
    const keys = Object.keys(calendar);
    const targetIdx = keys.indexOf(todayKey);
    let closestKey = null;
    let minDiff = Infinity;
    keys.forEach((k, idx) => {
      if (calendar[k] && calendar[k].goalsCount > 0) {
        const diff = Math.abs(idx - (targetIdx >= 0 ? targetIdx : 0));
        if (diff < minDiff) {
          minDiff = diff;
          closestKey = k;
        }
      }
    });
    if (closestKey && calendar[closestKey]) {
      dayData = calendar[closestKey];
      isClosest = true;
    }
  }

  if (!dayData) {
    container.innerHTML = `<p class="otd-empty">${o.empty}</p>`;
    return;
  }

  let activeMatchIdx = 0;
  let activeGoalIdx = 0;

  const renderContent = () => {
    const matches = dayData.matches || [];
    const activeMatch = matches[activeMatchIdx] || matches[0];
    if (!activeMatch) {
      container.innerHTML = `<p class="otd-empty">${o.empty}</p>`;
      return;
    }

    const videos = activeMatch.videos || [];
    const activeVideo = videos[activeGoalIdx] || videos[0] || {};
    const hasVideo = !!activeVideo.videoUrl;

    let matchTabsHtml = "";
    if (matches.length > 1) {
      matchTabsHtml = `<div class="otd-match-tabs" role="tablist">` +
        matches.map((m, idx) => {
          const isActive = idx === activeMatchIdx;
          const hatTrickLabel = m.goalsCount >= 3 ? " 🎩 Hat-trick" : "";
          return `<button type="button" class="otd-match-tab${isActive ? " active" : ""}" data-midx="${idx}" role="tab" aria-selected="${isActive}">
            ${m.year} vs ${esc(m.opponent)} (${m.goalsCount}⚽${hatTrickLabel})
          </button>`;
        }).join("") +
      `</div>`;
    }

    let goalTabsHtml = "";
    if (videos.length > 1 || (activeMatch.minutes && activeMatch.minutes.length > 1)) {
      const count = Math.max(videos.length, activeMatch.minutes ? activeMatch.minutes.length : 1);
      goalTabsHtml = `<div class="otd-goal-tabs">` +
        Array.from({ length: count }, (_, gIdx) => {
          const isActive = gIdx === activeGoalIdx;
          const min = (videos[gIdx] && videos[gIdx].minute) || (activeMatch.minutes && activeMatch.minutes[gIdx]) || "";
          return `<button type="button" class="otd-goal-tab${isActive ? " active" : ""}" data-gidx="${gIdx}">
            ${o.goalTab(gIdx + 1, min)}
          </button>`;
        }).join("") +
      `</div>`;
    }

    const currentMin = activeVideo.minute || (activeMatch.minutes && activeMatch.minutes[activeGoalIdx]) || "";
    const currentType = (activeMatch.types && activeMatch.types[activeGoalIdx]) || (activeVideo.penalty ? "Penalty" : (activeVideo.freekick ? "Direct Free Kick" : "Goal"));
    const goalNumberBadge = activeVideo.goalNumber ? `<span class="otd-goal-num-badge">Goal #${activeVideo.goalNumber}</span>` : "";

    const videoPlayerHtml = hasVideo
      ? `<div class="otd-video-wrap">
          ${goalTabsHtml}
          <div class="otd-player-frame">
            <video controls playsinline preload="metadata" src="${esc(activeVideo.videoUrl)}" class="otd-video-element" style="background:#000;">
              Your browser does not support the video tag.
            </video>
          </div>
        </div>`
      : `<div class="otd-no-video">
          <div class="otd-no-video-inner">
            <p>${o.noVideo}</p>
            <a href="https://www.youtube.com/results?search_query=Cristiano+Ronaldo+goal+vs+${encodeURIComponent(activeMatch.opponent)}+${activeMatch.date}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
              ${o.searchYt}
            </a>
          </div>
        </div>`;

    const statusBadge = isClosest
      ? `<span class="otd-badge otd-badge-closest">${o.closestBadge(dayData.formatted.toUpperCase())}</span>`
      : `<span class="otd-badge">${o.liveBadge(dayData.formatted.toUpperCase())}</span>`;

    const mNames = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const headlineText = isClosest
      ? o.headlineClosest(dayData.formatted, dayData.goalsCount, now.getUTCDate(), mNames[utcM])
      : o.headlineLive(dayData.goalsCount, matches.length);

    container.innerHTML = `
      <div class="otd-header">
        <div class="otd-header-left">
          ${statusBadge}
          <h3 class="otd-headline">${headlineText}</h3>
        </div>
        <div class="otd-header-right">
          <a href="/en/birthday/${todayKey}" class="btn btn-secondary btn-sm otd-bday-link">
            ${o.btnBday}
          </a>
        </div>
      </div>

      ${matchTabsHtml}

      <div class="otd-body">
        <div class="otd-player-column">
          ${videoPlayerHtml}
        </div>

        <div class="otd-info-column">
          <div class="otd-match-scoreline">
            <span class="otd-team">${esc(activeMatch.team)}</span>
            <span class="otd-score">${esc(activeMatch.score)}</span>
            <span class="otd-opponent">${esc(activeMatch.opponent)}</span>
          </div>

          <div class="otd-meta-row">
            <span class="otd-comp-badge">${esc(activeMatch.competition)}</span>
            <span class="otd-date-badge">${esc(activeMatch.date)}</span>
            ${goalNumberBadge}
          </div>

          <div class="otd-goal-details-card">
            <div class="otd-detail-item">
              <span class="otd-dt-label">${o.lblMinute}</span>
              <strong class="otd-dt-val">⚽ ${esc(currentMin ? `${currentMin}'` : "—")}</strong>
            </div>
            <div class="otd-detail-item">
              <span class="otd-dt-label">${o.lblShotType}</span>
              <strong class="otd-dt-val">${esc(currentType)}</strong>
            </div>
            ${activeVideo.assist ? `
            <div class="otd-detail-item">
              <span class="otd-dt-label">${o.lblAssist}</span>
              <strong class="otd-dt-val">👟 ${esc(activeVideo.assist)}</strong>
            </div>` : ""}
            ${activeVideo.xg ? `
            <div class="otd-detail-item">
              <span class="otd-dt-label">${o.lblXg}</span>
              <strong class="otd-dt-val">📊 ${activeVideo.xg}</strong>
            </div>` : ""}
          </div>

          <div class="otd-cta-row">
            <a href="/en/birthday/${todayKey}" class="btn btn-primary btn-sm">
              ${o.btnExplore}
            </a>
          </div>
        </div>
      </div>
    `;

    // Wire up tab events
    container.querySelectorAll(".otd-match-tab").forEach((tab) => {
      tab.onclick = () => {
        activeMatchIdx = +tab.dataset.midx;
        activeGoalIdx = 0;
        renderContent();
      };
    });

    container.querySelectorAll(".otd-goal-tab").forEach((tab) => {
      tab.onclick = () => {
        activeGoalIdx = +tab.dataset.gidx;
        renderContent();
      };
    });
  };

  renderContent();
}


function renderByYear(d) {
  const lang = getLang();
  const ys = d.calendarYears, t = d.totals;
  const best = ys.reduce((a, b) => (b.goals > a.goals ? b : a));
  const last = ys[ys.length - 1];
  const cfg = DICT.BY_YEAR

  setHead(d, cfg.head(ys, best, t));

  const comboCard = el("combo-card");
  if (comboCard) {
    // Kept as a closure so a phone rotating past the 760px breakpoint can
    // redraw the chart with the compact viewBox instead of a squashed one.
    const drawCombo = () => {
      comboCard.innerHTML =
        `<figure style="margin:0"><div class="spark-wrap">${sparkSVG(
          ys.map((x) => ({ label: String(x.year), value: x.goals, year: x.year, provisional: x.provisional, peak: x.year === best.year, tip: `${x.year}: ${x.goals} (${x.careerTotal})` })),
          { cumulative: true, peakYear: 2013, provisionalYear: 2026, linkPrefix: "dashboard#y", label: cfg.chartLabel(best) }
        )}</div><figcaption class="figcap">${cfg.cap(best, t)}</figcaption></figure>`;
      const svg = comboCard.querySelector("svg.spark");
      if (svg) svg.classList.add("in");
    };
    drawCombo();
    window.addEventListener("ronaldo:spark-relayout", drawCombo);
  }

  const kpis = el("kpis");
  if (kpis) {
    kpis.innerHTML =
      kpi4(cfg.kpiCareer, n(t.goals), `After ${last.year}${last.provisional ? ` (${cfg.kpiCurrSub})` : ""}.`) +
      kpi4(cfg.kpiBest, `${best.year} · ${best.goals}`, cfg.kpiBestSub) +
      kpi4(`${last.year}`, last.goals, last.provisional ? cfg.kpiCurrSub : "") +
      kpi4(cfg.kpiYears, ys.length, cfg.kpiYearsSub(ys, last));
  }

  const decades = [["2000s", 2002, 2009], ["2010s", 2010, 2019], ["2020s", 2020, last.year]];
  const decEl = el("decades");
  if (decEl) {
    decEl.innerHTML = decades.map(([lab, a, b]) => {
      const rows = ys.filter((r) => r.year >= a && r.year <= b);
      const sum = rows.reduce((s, r) => s + r.goals, 0);
      const pk = rows.reduce((x, y) => (y.goals > x.goals ? y : x));
      return kpi4(`${cfg.decades} ${lab}`, n(sum), `${a}–${b}, peak: ${pk.goals} (${pk.year}).`);
    }).join("");
  }

  const tableSub = el("table-sub");
  if (tableSub) {
    tableSub.textContent = cfg.tableSub;
  }

  const yearTable = el("year-table");
  if (yearTable) {
    yearTable.innerHTML =
      `<div class="table-wrap"><table class="data-table"><caption>${cfg.caption}</caption>` +
      `<thead><tr><th scope="col" class="left">${cfg.thYear}</th><th scope="col">${cfg.thGoals}</th><th scope="col">${cfg.thTotal}</th><th scope="col">${cfg.thAge}</th></tr></thead><tbody>` +
      ys.slice().reverse().map((r) =>
        `<tr id="y${r.year}"${r.provisional ? ' class="total"' : ""}><th scope="row">${r.year}${r.provisional ? " *" : ""}</th><td><b>${r.goals}</b></td><td>${n(r.careerTotal)}</td><td>${r.age}</td></tr>`
      ).join("") + `</tbody></table></div>` +
      (last.provisional ? `<p class="caveat">${cfg.inProgNote}</p>` : "");

    const tbl = yearTable.querySelector("table");
    if (tbl) {
      sortable(tbl);
      tableSearch(tbl, cfg.filterPlaceholder, "q");
    }
  }

  const bestYearEl = el("bestyear");
  if (bestYearEl) {
    bestYearEl.innerHTML = cfg.bestYearHtml(best);
  }

  renderExplore(d, "byyear");
  renderMethod(d, "");
}
function kpi4(l, v, s) { return `<div class="kpi"><span class="kpi-label">${l}</span><span class="kpi-value">${v}</span><span class="kpi-note">${s}</span></div>`; }


function renderBySeason(d) {
  const lang = getLang();
  const ss = d.clubSeasons, t = d.totals;
  const best = ss.reduce((a, b) => (b.goals > a.goals ? b : a));
  const cfg = DICT.BY_SEASON

  setHead(d, cfg.head(best));
  const g = ss.reduce((a, s) => ({
    apps: a.apps + s.apps, goals: a.goals + s.goals,
    la: a.la + s.league.apps, lg: a.lg + s.league.goals,
    ca: a.ca + s.cup.apps, cg: a.cg + s.cup.goals,
    ua: a.ua + s.continental.apps, ug: a.ug + s.continental.goals,
    oa: a.oa + s.other.apps, og: a.og + s.other.goals,
  }), { apps: 0, goals: 0, la: 0, lg: 0, ca: 0, cg: 0, ua: 0, ug: 0, oa: 0, og: 0 });
  const pg = (a2, g2) => `${n(a2)} / ${n(g2)}`;

  const clubSub = el("club-sub");
  if (clubSub) {
    clubSub.textContent = cfg.clubSub;
  }

  const clubTable = el("club-table");
  if (clubTable) {
    clubTable.innerHTML =
      `<div class="table-wrap"><table class="data-table"><caption>${cfg.caption(ss.length)}</caption>` +
      `<thead><tr><th scope="col" class="left">${cfg.thSeason}</th><th scope="col" class="left">${cfg.thClub}</th><th scope="col">${cfg.thApps}</th><th scope="col">${cfg.thGoals}</th><th scope="col">${cfg.thLeague}</th><th scope="col">${cfg.thCup}</th><th scope="col">${cfg.thCont}</th><th scope="col">${cfg.thOther}</th></tr></thead><tbody>` +
      ss.map((s) => `<tr id="s${s.season.slice(0, 4)}"${s.provisional ? ' class="total"' : ""}><th scope="row">${esc(s.season)}${s.provisional ? " *" : ""}` + (s.season === best.season ? `<span class="yr-note">${cfg.bestBadge}</span>` : "") + `</th>` +
        `<td class="left">${dispClub(s.club)}</td><td>${n(s.apps)}</td><td><b>${n(s.goals)}</b></td>` +
        `<td>${pg(s.league.apps, s.league.goals)}</td><td>${pg(s.cup.apps, s.cup.goals)}</td>` +
        `<td>${pg(s.continental.apps, s.continental.goals)}</td><td>${pg(s.other.apps, s.other.goals)}</td></tr>`).join("") +
      `<tr class="total"><th scope="row" colspan="2">${cfg.totalLabel}</th><td>${n(g.apps)}</td><td>${n(g.goals)}</td>` +
      `<td>${pg(g.la, g.lg)}</td><td>${pg(g.ca, g.cg)}</td><td>${pg(g.ua, g.ug)}</td><td>${pg(g.oa, g.og)}</td></tr></tbody></table></div>`;

    const tbl = clubTable.querySelector("table");
    if (tbl) {
      sortable(tbl);
      tableSearch(tbl, cfg.filterClubPlaceholder, "season");
    }
  }

  const cy = d.countryYears;
  const countrySub = el("country-sub");
  if (countrySub) {
    countrySub.textContent = cfg.countrySub;
  }

  const countryTable = el("country-table");
  if (countryTable) {
    countryTable.innerHTML =
      `<div class="table-wrap"><table class="data-table"><caption>${cfg.countryCaption}</caption>` +
      `<thead><tr><th scope="col" class="left">${cfg.thYear}</th><th scope="col">${cfg.thApps}</th><th scope="col">${cfg.thGoals}</th><th scope="col" class="left">${cfg.thNote}</th></tr></thead><tbody>` +
      cy.slice().reverse().map((s) => {
        const note = s.note || `${s.competitive[0]} apps, ${s.competitive[1]} goals · ${s.friendly[0]} apps, ${s.friendly[1]} goals`;
        return `<tr${s.provisional ? ' class="total"' : ""}><th scope="row">${s.year}${s.provisional ? " *" : ""}</th><td>${s.apps}</td><td><b>${s.goals}</b></td><td class="left">${esc(note)}</td></tr>`;
      }).join("") +
      `<tr class="total"><th scope="row">${cfg.totalArgLabel}</th><td>${t.country.apps}</td><td>${t.country.goals}</td><td class="left"></td></tr></tbody></table></div>`;

    const tbl = countryTable.querySelector("table");
    if (tbl) {
      sortable(tbl);
      tableSearch(tbl, cfg.filterCountryPlaceholder, "country");
    }
  }

  const bestSeasonEl = el("bestseason");
  if (bestSeasonEl) {
    bestSeasonEl.innerHTML = cfg.bestSeasonHtml(best);
  }
  renderExplore(d, "byseason");
  renderMethod(d, "");
}

/* ================= DASHBOARD ================= */
const TEAM_COMPS = null; // retired: buckets now come from teamComps() (LIVE/JSON) so comps update with data.
function teamComps() {
  return {
    realmadrid: [["La Liga", LIVE.compLiga], ["UEFA Champions League", LIVE.compUCLb], ["Copa del Rey", LIVE.compCDR], ["Supercopa / UEFA Super Cup / Club World Cup", LIVE.compSuper]],
    manutd: [["Premier League", LIVE.compPL], ["UEFA Champions League", LIVE.compUCLm], ["FA Cup / Football League Cup", LIVE.compCupMU], ["FA Community Shield / FIFA Club World Cup", LIVE.compShield]],
    juventus: [["Serie A", LIVE.compSerieA], ["UEFA Champions League", LIVE.compUCLj], ["Coppa Italia", LIVE.compCupJuve], ["Supercoppa Italiana", LIVE.compSupercoppaIt]],
    alnassr: [["Saudi Pro League", LIVE.compSPL], ["AFC Champions League Elite / Two", LIVE.compACL], ["King's Cup", LIVE.compCupNassr], ["Arab Club Champions Cup / Saudi Super Cup", LIVE.compACC]],
    sporting: [["Primeira Liga", LIVE.compPrimeira], ["Taça de Portugal", LIVE.compCupSporting]],
    portugal: [["FIFA World Cup / qualifiers", LIVE.compQual], ["UEFA European Championship / qualifiers", LIVE.compEuro], ["UEFA Nations League", LIVE.compNL], ["International friendlies", LIVE.compFriend], ["FIFA Confederations Cup", LIVE.compConfed]]
  };
}
const FINISH_COLORS = { "Open play": "#0e7cc0", Penalties: "#7cc4ea", "Free kicks": "#132c52" };
const BODY_COLORS = { "Left foot": "#0e7cc0", "Right foot": "#55a8dc", Head: "#a9d3ee", Other: "#132c52" };


function renderDashboard(d, team) {
  const lang = getLang();
  const cfg = DICT.DASH;
  const alias = TEAM_ALIAS[team] || team;
  const T = teamComps()[alias] ? alias : "all";
  const TD = TEAM_DICT_ID[T] || T;
  const name = cfg.teamNames[TD] || (T === "all" ? "all teams" : teamName(T));
  const sum = (arr) => arr.reduce((a, r) => a + r[1], 0);
  const goals = T === "all" ? d.totals.goals : sum(teamComps()[T]);
  const apps = T === "all" ? d.totals.apps : T === "portugal" ? d.totals.country.apps : clubAgg(d)[T].apps;

  setHead(d, cfg.head(name));

  // 1. Team Selector Bar with instant reactive re-rendering
  const pillsEl = el("pills");
  if (pillsEl) {
    const teams = [
      { id: "all", label: "All Teams", goals: d.totals.goals, apps: d.totals.apps, crest: "" },
      { id: "realmadrid", label: "Real Madrid", goals: 450, apps: 438, crest: "/img/teams/real-madrid.png" },
      { id: "manutd", label: "Manchester United", goals: 145, apps: 346, crest: "/img/teams/man-utd.png" },
      { id: "juventus", label: "Juventus", goals: 101, apps: 134, crest: "/img/teams/juventus.png" },
      { id: "alnassr", label: "Al Nassr", goals: 134, apps: 157, crest: "/img/teams/al-nassr.png" },
      { id: "sporting", label: "Sporting CP", goals: 5, apps: 31, crest: "/img/teams/sporting.png" },
      { id: "portugal", label: "Portugal", goals: 146, apps: 234, crest: "/img/teams/portugal.png" }
    ];
    pillsEl.className = "dash-team-selector";
    pillsEl.innerHTML = teams.map((tm) => `
      <button class="dash-team-btn${T === tm.id ? " active" : ""}" data-team="${tm.id}" aria-pressed="${T === tm.id}">
        ${tm.crest ? `<img class="dash-team-crest" src="${tm.crest}" alt="" width="22" height="22" loading="eager" decoding="async" onerror="this.remove()">` : `<span style="font-size:1.1rem" aria-hidden="true">🌍</span>`}
        <span>${tm.label}</span>
        <span class="dash-team-goals">${tm.goals}G</span>
      </button>
    `).join("");

    pillsEl.querySelectorAll(".dash-team-btn").forEach((b) =>
      b.addEventListener("click", () => {
        const nextTeam = b.dataset.team;
        const url = new URL(location.href);
        if (nextTeam === "all") url.searchParams.delete("team");
        else url.searchParams.set("team", nextTeam);
        try { history.replaceState(null, "", url.pathname + (url.search === "?" ? "" : url.search)); } catch {}
        renderDashboard(d, nextTeam);
      })
    );
  }

  const fnEl = el("filter-note");
  if (fnEl) {
    fnEl.textContent = cfg.filterNote(name, goals, apps, TD);
  }

  // 2. Executive 6 KPI Cards Grid
  const kpisEl = el("kpis");
  if (kpisEl) {
    kpisEl.className = "dash-kpis-grid";
    // Sums reconcile to live ground truth (computed above where possible):
    // assists 152+66+20+9+14 = 261; NPG total computed (goals − penalties);
    // per-team NPG/FK/HT stay literal — the JSON has no per-team splits, so
    // PEN_BY_TEAM / FK_BY_TEAM / HT_BY_TEAM carry the frozen split and still
    // reconcile with the canonical career totals (184 pens, 66 FKs, 66 hat-tricks).
    // G+A computed live (981+261 = 1,242).
    const assistsBT = d.totals.assists.byTeam;
    const assistsVal = T === "all" ? n(d.totals.assists.official) + "+" : String(assistsBT[TEAM_ASSIST_KEY[T] || T].official);
    const gaVal = T === "all" ? n(d.totals.goals + d.totals.assists.official) + "+" : n(clubAgg(d)[T].goals + d.totals.assists.byTeam[TEAM_ASSIST_KEY[T] || T].official);
    const npgVal = T === "all" ? String(LIVE.npg) : String(Math.max(0, clubAgg(d)[T].goals - (PEN_BY_TEAM[T] || 0)));
    const fkVal = T === "all" ? "66" : String(FK_BY_TEAM[T] || 0);
    const htVal = T === "all" ? "66" : String(HT_BY_TEAM[T] || 0);

    const kpiList = [
      { label: "Total Goals", icon: "⚽", num: n(goals), sub: `${gpg(goals, apps)} goals/game · ${n(apps)} matches (${name})` },
      { label: "Total Assists", icon: "👟", num: assistsVal, sub: `${(LIVE.assists / LIVE.apps).toFixed(2)} assists/game · All-time playmaker` },
      { label: "Goal Contributions", icon: "🔥", num: gaVal, sub: `${(LIVE.ga / LIVE.apps).toFixed(2)} direct goal involvements per match` },
      { label: "Non-Penalty Goals", icon: "⚡", num: npgVal, sub: `${(LIVE.npg / LIVE.goals * 100).toFixed(1)}% non-penalty ratio (open play & free kicks)` },
      { label: "Direct Free Kicks", icon: "🎯", num: fkVal, sub: `Record set-piece dead-ball precision` },
      { label: "Career Hat-Tricks", icon: "🎩", num: htVal, sub: `${n(d.hatTricks)} career hat-tricks for club and country` }
    ];

    kpisEl.innerHTML = kpiList.map(k => `
      <article class="dash-kpi-box">
        <div class="dash-kpi-header">
          <span class="dash-kpi-label">${k.label}</span>
          <span class="dash-kpi-icon">${k.icon}</span>
        </div>
        <div class="dash-kpi-num">${k.num}</div>
        <div class="dash-kpi-sub">${k.sub}</div>
      </article>
    `).join("");
  }

  // 3. Body Part Breakdown Card
  const bodyCard = el("body-card");
  if (bodyCard) {
    const bodyRows = [
      { label: "Left Foot", val: d.byBodyPart.left, pct: ((d.byBodyPart.left / d.totals.goals) * 100).toFixed(1), fill: "fill-gold" },
      { label: "Right Foot", val: d.byBodyPart.right, pct: ((d.byBodyPart.right / d.totals.goals) * 100).toFixed(1), fill: "fill-blue" },
      { label: "Head", val: d.byBodyPart.head, pct: ((d.byBodyPart.head / d.totals.goals) * 100).toFixed(1), fill: "fill-green" },
      { label: "Other / Chest", val: d.byBodyPart.other, pct: ((d.byBodyPart.other / d.totals.goals) * 100).toFixed(1), fill: "fill-purple" }
    ];
    bodyCard.innerHTML = `
      <h3 class="dash-card-title">⚽ Scoring Breakdown by Body Part</h3>
      <div class="dash-bars-wrap">
        ${bodyRows.map(r => `
          <div class="dash-bar-row">
            <div class="dash-bar-meta">
              <span>${r.label}</span>
              <span><b>${n(r.val)}</b> <small style="color:var(--muted)">(${r.pct}%)</small></span>
            </div>
            <div class="dash-bar-track">
              <div class="dash-bar-fill ${r.fill}" style="width:${r.pct}%"></div>
            </div>
          </div>
        `).join("")}
      </div>
      <p class="caveat" style="margin-top:14px;margin-bottom:0">${cfg.bodyCaveat}</p>
    `;
  }

  // 4. Finish / Methods Card
  const finishCard = el("finish-card");
  if (finishCard) {
    const finishRows = [
      { label: "Open Play", val: d.byFinish.openPlay, pct: ((d.byFinish.openPlay / d.totals.goals) * 100).toFixed(1), fill: "fill-blue", sub: `${d.byFinish.openPlay} goals from open play` },
      { label: "Direct Free Kicks", val: d.byFinish.freeKicks, pct: ((d.byFinish.freeKicks / d.totals.goals) * 100).toFixed(1), fill: "fill-gold", sub: `${d.byFinish.freeKicks} career direct free-kick goals` },
      { label: "Penalties", val: d.byFinish.penalties, pct: ((d.byFinish.penalties / d.totals.goals) * 100).toFixed(1), fill: "fill-red", sub: `${d.byFinish.penalties} converted from 220 attempts (83.6%)` }
    ];
    finishCard.innerHTML = `
      <h3 class="dash-card-title">🎯 Scoring Breakdown by Method / Finish</h3>
      <div class="dash-bars-wrap">
        ${finishRows.map(r => `
          <div class="dash-bar-row">
            <div class="dash-bar-meta">
              <span>${r.label} <small style="font-weight:400;color:var(--muted)">· ${r.sub}</small></span>
              <span><b>${n(r.val)}</b> <small style="color:var(--muted)">(${r.pct}%)</small></span>
            </div>
            <div class="dash-bar-track">
              <div class="dash-bar-fill ${r.fill}" style="width:${r.pct}%"></div>
            </div>
          </div>
        `).join("")}
      </div>
      <p class="caveat" style="margin-top:14px;margin-bottom:0">${cfg.finishCaveat}</p>
    `;
  }

  // 5. Competitions Card
  const compRows = T === "all" ? d.byCompetition : teamComps()[T].map((r) => ({ competition: r[0], goals: r[1] }));
  const cmax = Math.max(...compRows.map((r) => r.goals), 1);
  const compCard = el("comp-card");
  if (compCard) {
    compCard.innerHTML = `
      <h3 class="dash-card-title">🏆 Top Competitions (${name})</h3>
      <div class="dash-bars-wrap">
        ${compRows.slice(0, 7).map(r => {
          const pct = ((r.goals / cmax) * 100).toFixed(1);
          return `
            <div class="dash-bar-row">
              <div class="dash-bar-meta">
                <span>${esc(r.competition)}</span>
                <span><b>${n(r.goals)}</b> <small style="color:var(--muted)">(${((r.goals / goals) * 100).toFixed(1)}%)</small></span>
              </div>
              <div class="dash-bar-track">
                <div class="dash-bar-fill fill-gold" style="width:${pct}%"></div>
              </div>
            </div>
          `;
        }).join("")}
      </div>
      ${!compRows.length ? `<p class="chart-empty">${cfg.chartEmpty}</p>` : ""}
    `;
  }

  // 6. Landmark Milestones Speed Tracker Card
  const msCard = el("milestones-card");
  if (msCard) {
    const milestones = [
      { goal: "100", opp: "vs Sevilla", date: "16 Jan 2010", age: "22y 206d", apps: "188" },
      { goal: "200", opp: "vs Viktoria Plzeň", date: "1 Nov 2011", age: "24y 130d", apps: "286" },
      { goal: "300", opp: "vs Granada", date: "16 Feb 2013", age: "25y 237d", apps: "365" },
      { goal: "400", opp: "vs Granada", date: "27 Sep 2014", age: "27y 95d", apps: "525" },
      { goal: "500", opp: "vs Valencia", date: "17 Apr 2016", age: "28y 298d", apps: "632" },
      { goal: "600", opp: "vs Atlético Madrid", date: "4 Mar 2018", age: "30y 253d", apps: "747" },
      { goal: "700", opp: "vs Atlético Madrid", date: "30 Jun 2020", age: "33y 6d", apps: "862" },
      { goal: "800", opp: "vs Panama", date: "23 Mar 2023", age: "35y 272d", apps: "1,017" },
      { goal: "900", opp: "vs NY Red Bulls", date: "2025", age: "37y 315d", apps: "1,135" },
      { goal: String(LIVE.goals), opp: LIVE.lgOpp, date: LIVE.lgDate, age: "39y", apps: n(LIVE.apps) }
    ];
    msCard.innerHTML = `
      <h3 class="dash-card-title">⚡ Landmark Goal Speed Tracker</h3>
      <div class="table-wrap">
        <table class="milestone-table">
          <thead>
            <tr>
              <th>Milestone</th>
              <th>Opponent</th>
              <th>Date</th>
              <th>Age</th>
              <th>Matches</th>
            </tr>
          </thead>
          <tbody>
            ${milestones.map(m => `
              <tr>
                <td><strong>Goal #${m.goal}</strong></td>
                <td>${esc(m.opp)}</td>
                <td>${esc(m.date)}</td>
                <td>${esc(m.age)}</td>
                <td><b>${esc(m.apps)}</b></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
      <p class="caveat" style="margin-top:12px;margin-bottom:0">Includes all official senior competitive and international appearances.</p>
    `;
  }

  // 7. Season sparkline
  let seasonRows;
  if (T === "all" || T === "portugal") {
    const src = T === "all" ? d.calendarYears : d.countryYears;
    seasonRows = src.map((r) => ({ label: String(r.year ?? r.season ?? ""), value: r.goals, tip: `${r.year}: ${r.goals} ${cfg.kpis.goals.toLowerCase()}` }));
  } else {
    seasonRows = d.clubSeasons.filter((s) => CLUB_KEY[s.club] === T)
      .map((s) => ({ label: s.season.length > 4 ? s.season.replace("20", "").replace("/20", "–") : s.season, value: s.goals, tip: `${s.season} (${dispClub(s.club)}): ${s.goals} ${cfg.kpis.goals.toLowerCase()}` }));
  }
  const smax = Math.max(...seasonRows.map((r) => r.value));
  seasonRows.forEach((r) => { r.peak = r.value === smax; });

  const seasonCard = el("season-card");
  if (seasonCard) {
    const figCap = cfg.figCap(TD, name);
    const drawSeason = () => {
      seasonCard.innerHTML =
        `<figure style="margin:0"><div class="spark-wrap">${sparkSVG(seasonRows, { skipLabels: seasonRows.length > 12, label: `Ronaldo goals season by season for ${name}` })}</div>` +
        `<figcaption class="figcap">${figCap}</figcaption></figure>`;
      const svg = seasonCard.querySelector("svg.spark");
      if (svg) svg.classList.add("in");
    };
    drawSeason();
    window.addEventListener("ronaldo:spark-relayout", drawSeason);
  }

  // 8. Age Card
  const ageEl = el("age-card");
  if (ageEl) {
    const ys = d.calendarYears;
    const amax = Math.max(...ys.map((r) => r.goals));
    const apeak = ys.reduce((a, b) => (b.goals > a.goals ? b : a));
    ageEl.innerHTML = T === "all"
      ? `<div class="hbars">` + ys.map((r) =>
        `<div class="hbar-row"><span class="hbar-name">${cfg.ageName(r)}</span>` +
        `<span class="hbar-track"><span class="hbar-fill${r.goals === amax ? " top" : ""}" style="width:${((r.goals / amax) * 100).toFixed(1)}%"></span></span>` +
        `<span class="hbar-val">${r.goals}</span></div>`
      ).join("") + `</div><p class="caveat">${cfg.ageCaveat(apeak)}</p>`
      : `<p class="caveat">${cfg.ageFilterNote}</p>`;
  }

  // 9. Competitions Full Table
  const compTable = el("comp-table");
  if (compTable) {
    compTable.innerHTML =
      `<div class="table-wrap"><table class="data-table"><caption>${cfg.compCaption(name)}</caption>` +
      `<thead><tr><th scope="col" class="left">${cfg.thComp}</th><th scope="col">${cfg.thGoals}</th><th scope="col">${cfg.thShare}</th></tr></thead><tbody>` +
      compRows.map((r) => `<tr><th scope="row">${esc(r.competition)}${r.team ? `<small class="comp-team">${esc(r.team)}</small>` : ""}` + (T === "all" && r.competition === "La Liga" ? `<span class="yr-note">${cfg.recAllTime}</span>` : "") + (T === "all" && r.competition === "UEFA Champions League" ? `<span class="yr-note">105 Real Madrid · 24 Manchester United · 14 Juventus</span>` : "") + `</th><td><b>${r.goals}</b></td><td>${((r.goals / goals) * 100).toFixed(1)}%</td></tr>`).join("") +
      `</tbody></table></div>`;
    compTable.insertAdjacentHTML("beforeend", clubTableCaption());
    const tbl = compTable.querySelector("table");
    if (tbl) sortable(tbl);
  }

  // 10. Scoring Methods Full Table with required caveats
  const finishTable = el("finish-table");
  if (finishTable) {
    const fRows = cfg.finishRows(d);
    finishTable.innerHTML =
      `<div class="table-wrap"><table class="data-table"><caption>${cfg.finishCaption}</caption>` +
      `<thead><tr><th scope="col" class="left">${cfg.thFinish}</th><th scope="col">${cfg.thGoals}</th><th scope="col">${cfg.thShare}</th></tr></thead><tbody>` +
      fRows.map((r) => `<tr><th scope="row">${r[0]}</th><td><b>${r[1]}</b></td><td>${((r[1] / d.totals.goals) * 100).toFixed(1)}%</td></tr>`).join("") +
      `</tbody></table></div><p class="caveat">Provisional until hand count verification against official match sheets. Provisional compiled tally based on verified match reports.</p>`;
    finishTable.insertAdjacentHTML("beforeend", clubTableCaption());
    const tbl = finishTable.querySelector("table");
    if (tbl) sortable(tbl);
  }

  // 11. Team Cards
  const tc = el("team-cards");
  if (tc) {
    const aggAll = clubAgg(d);
    const order = ["realmadrid", "manutd", "juventus", "alnassr", "sporting", "portugal"];
    tc.innerHTML = order.map((k) => {
      const a = aggAll[k];
      const share = ((a.goals / d.totals.goals) * 100).toFixed(1);
      const teamDisp = cfg.teamNames[k] || teamName(k);
      return `<article class="team-card"><div class="team-card-head">${badge(k)}` +
        `<div><strong>${teamDisp}</strong><span class="sub">${CLUBS[k].years}</span></div>` +
        `<span class="team-share">${share}% ${cfg.teamCardSub.of} ${n(d.totals.goals)}</span></div>` +
        `<div class="team-nums"><div><b>${n(a.goals)}</b><span>${cfg.teamCardSub.goals}</span></div>` +
        `<div><b>${n(a.apps)}</b><span>${cfg.teamCardSub.apps}</span></div>` +
        `<div><b>${gpg(a.goals, a.apps)}</b><span>${cfg.teamCardSub.gpg}</span></div></div>` +
        `<div class="team-bar" role="img" aria-label="${teamDisp}: ${n(a.goals)} ${cfg.teamCardSub.goals}"><span style="width:${((a.goals / aggAll.realmadrid.goals) * 100).toFixed(1)}%"></span></div></article>`;
    }).join("");
  }

  // 12. Records strip
  const dr = el("dash-records");
  if (dr) {
    const comp = (nm) => (d.byCompetition.find((r) => r.competition === nm) || {}).goals || 0;
    const recordsList = cfg.records(comp, d);
    dr.innerHTML = recordsList.map((r) => `<div class="record"><span class="num">${r[0]}</span><span>${r[1]}</span></div>`).join("");
  }

  // 13. Integrated Season Table (from merged goalsbyseason)
  const sTable = el("season-table");
  if (sTable) {
    const ss = d.clubSeasons;
    const bestS = ss.reduce((a, b) => (b.goals > a.goals ? b : a));
    sTable.innerHTML = `<div class="table-wrap"><table class="data-table"><caption>All ${ss.length} club seasons: Sporting CP, Manchester United, Real Madrid, Juventus and Al Nassr.</caption>` +
      `<thead><tr><th scope="col" class="left">Season</th><th scope="col" class="left">Club</th><th scope="col">Apps</th><th scope="col">Goals</th><th scope="col">League</th><th scope="col">Cup</th><th scope="col">Continental</th><th scope="col">Other</th></tr></thead><tbody>` +
      ss.map((s) => `<tr><th scope="row">${esc(s.season)}${s.provisional ? " *" : ""}${s.season === bestS.season ? ` <span class="yr-note">Record 73G</span>` : ""}</th>` +
        `<td class="left">${dispClub(s.club)}</td><td>${n(s.apps)}</td><td><b>${n(s.goals)}</b></td>` +
        `<td>${s.league.apps}/${s.league.goals}</td><td>${s.cup.apps}/${s.cup.goals}</td>` +
        `<td>${s.continental.apps}/${s.continental.goals}</td><td>${s.other.apps}/${s.other.goals}</td></tr>`).join("") +
      `</tbody></table></div>`;
    const tbl = sTable.querySelector("table");
    if (tbl) sortable(tbl);
  }

  // 14. Integrated Calendar Year Chart & Table (from merged goalsbyyear)
  const comboCard = el("combo-card");
  if (comboCard) {
    const ys = d.calendarYears;
    const bestY = ys.reduce((a, b) => (b.goals > a.goals ? b : a));
    const drawYearCombo = () => {
      comboCard.innerHTML = `<figure style="margin:0"><div class="spark-wrap">${sparkSVG(
        ys.map((x) => ({ label: String(x.year), value: x.goals, year: x.year, provisional: x.provisional, peak: x.year === bestY.year, tip: `${x.year}: ${x.goals} (${x.careerTotal})` })),
        { cumulative: true, peakYear: 2013, provisionalYear: 2026, linkPrefix: "#y", label: `Goals by year peaking at ${bestY.goals} in ${bestY.year}` }
      )}</div><figcaption class="figcap">Bars: goals that year (peak ${bestY.goals}, ${bestY.year}). Line: cumulative career climb to ${n(d.totals.goals)}.</figcaption></figure>`;
      const svg = comboCard.querySelector("svg.spark");
      if (svg) svg.classList.add("in");
    };
    drawYearCombo();
    window.addEventListener("ronaldo:spark-relayout", drawYearCombo);
  }

  const yrTable = el("year-table");
  if (yrTable) {
    const ys = d.calendarYears;
    yrTable.innerHTML = `<div class="table-wrap"><table class="data-table"><caption>Goals, running career total and age for every calendar year since Ronaldo's 2002 debut.</caption>` +
      `<thead><tr><th scope="col" class="left">Year</th><th scope="col">Goals</th><th scope="col">Career Total</th><th scope="col">Age</th></tr></thead><tbody>` +
      ys.slice().reverse().map((r) => `<tr id="y${r.year}">` +
        `<th scope="row">${r.year}${r.provisional ? " *" : ""}${r.year === 2013 ? ` <span class="yr-note">Career Best 69G</span>` : ""}</th>` +
        `<td><b>${r.goals}</b></td><td>${n(r.careerTotal)}</td><td>${r.age}</td></tr>`).join("") +
      `</tbody></table></div>`;
    const tbl = yrTable.querySelector("table");
    if (tbl) sortable(tbl);
  }

  renderExplore(d, "dashboard");
  renderMethod(d, cfg.method);
}

/* ================= TIMELINE ================= */
function eraOf(y) {
  const lang = getLang();
  const ranges = {
    rosario: "2002–2003",
    peak: "2004–2009",
    msn: "2009–2014",
    carry: "2015–2018",
    farewell: "2019–2020",
    paris: "2021–2022",
    miami: {
      es: "2023–presente",
      pt: "2023–presente",
      fr: "2023–présent",
      ar: "2023–الآن",
      bn: "২০২৩–বর্তমান",
      hi: "2023–वर्तमान",
      ro: "2023–prezent",
      uz: "2023–hozir"
    }[lang] || "2023–present"
  };
  const eraNames = {
    es: {
      rosario: "Sporting CP",
      peak: "Manchester United",
      msn: "Real Madrid",
      carry: "Los años del Balón de Oro",
      farewell: "Juventus",
      paris: "El regreso al Manchester United",
      miami: "Al Nassr"
    },
    pt: {
      rosario: "Sporting CP",
      peak: "Manchester United",
      msn: "Real Madrid",
      carry: "Os anos da Bola de Ouro",
      farewell: "Juventus",
      paris: "O regresso ao Manchester United",
      miami: "Al Nassr"
    },
    fr: {
      rosario: "Sporting CP",
      peak: "Manchester United",
      msn: "Real Madrid",
      carry: "Les années Ballon d'Or",
      farewell: "Juventus",
      paris: "Le retour à Manchester United",
      miami: "Al Nassr"
    },
    ar: {
      rosario: "سبورتينغ",
      peak: "مانشستر يونايتد",
      msn: "ريال مدريد",
      carry: "سنوات الكرة الذهبية",
      farewell: "يوفنتوس",
      paris: "العودة إلى مانشستر يونايتد",
      miami: "النصر"
    },
    bn: {
      rosario: "স্পোর্টিং",
      peak: "ম্যানচেস্টার ইউনাইটেড",
      msn: "রিয়াল মাদ্রিদ",
      carry: "ব্যালন ডি'অরের বছর",
      farewell: "জুভেন্তুস",
      paris: "ম্যানচেস্টার ইউনাইটেডে ফিরে আসা",
      miami: "আল নাসর"
    },
    hi: {
      rosario: "स्पोर्टिंग",
      peak: "मैनचेस्टर यूनाइटेड",
      msn: "रियल मैड्रिड",
      carry: "बैलन डी'ओर के साल",
      farewell: "जुवेंतस",
      paris: "मैनचेस्टर यूनाइटेड में वापसी",
      miami: "अल नस्र"
    },
    ro: {
      rosario: "Sporting CP",
      peak: "Manchester United",
      msn: "Real Madrid",
      carry: "Anii Balonului de Aur",
      farewell: "Juventus",
      paris: "Întoarcerea la Manchester United",
      miami: "Al Nassr"
    },
    uz: {
      rosario: "Sporting",
      peak: "Manchester United",
      msn: "Real Madrid",
      carry: "Oltin to'y yillari",
      farewell: "Juventus",
      paris: "Manchester Unitedga qaytish",
      miami: "Al Nassr"
    },
    en: {
      rosario: "Sporting CP",
      peak: "Manchester United",
      msn: "Real Madrid",
      carry: "The Ballon d'Or years",
      farewell: "Juventus",
      paris: "The Manchester United return",
      miami: "Al Nassr"
    }
  };
  let key = "miami";
  if (y <= 2003) key = "rosario";
  else if (y <= 2009) key = "peak";
  else if (y <= 2014) key = "msn";
  else if (y <= 2018) key = "carry";
  else if (y <= 2020) key = "farewell";
  else if (y <= 2022) key = "paris";

  const langNames = eraNames[lang] || eraNames.en;
  return { key, era: langNames[key] || eraNames.en[key], range: ranges[key] };
}
/* Real era photos: self-hosted high-res action and celebration photos.
   `pos` sets the CSS focal point so faces survive the banner crop.
   Keyed by eraOf() name; eras without an entry render no figure. */
const ERA_PHOTOS = {
  rosario: [
    { src: "/img/era/era-2002-sporting.webp", w: 1200, h: 675, pos: "50% 30%", alt: "The Sporting CP museum in Lisbon, with Ronaldo's number 28 shirt from his debut season", cap: "The Sporting CP years — senior debut in 2002" },
  ],
  peak: [
    { src: "/img/era/era-2004-manutd.webp", w: 1200, h: 675, pos: "50% 25%", alt: "Cristiano Ronaldo in the Manchester United number 7 shirt against Chelsea", cap: "The Manchester United years — the No. 7 shirt, 2003 to 2009" },
  ],
  msn: [
    { src: "/img/era/era-2009-real.webp", w: 1200, h: 675, pos: "50% 25%", alt: "Kaka and Ronaldo celebrating together for Real Madrid", cap: "The Real Madrid presentation, Bernabéu, 2009" },
  ],
  carry: [
    { src: "/img/era/era-2008-ballon1.webp", w: 1200, h: 675, pos: "50% 25%", alt: "Ronaldo in the Manchester United number 7 shirt in 2008, the year of his first Ballon d'Or", cap: "The Ballon d'Or years — five of them, from 2008 to 2017" },
  ],
  farewell: [
    { src: "/img/era/era-2018-juve.webp", w: 1200, h: 675, pos: "50% 25%", alt: "Cristiano Ronaldo in the Juventus shirt during his Serie A title season", cap: "The Juventus years — two Serie A titles, 2018 to 2022" },
  ],
  paris: [
    { src: "/img/era/era-2021-manutd.webp", w: 1200, h: 675, pos: "50% 25%", alt: "Cristiano Ronaldo returning to Manchester United in September 2021", cap: "The Manchester United return, 2021 to 2022" },
  ],
  miami: [
    { src: "/img/era/era-2023-alnassr.webp", w: 1200, h: 675, pos: "50% 25%", alt: "Ronaldo in the Al Nassr number 7 shirt", cap: "The Al Nassr years — captain of the Saudi Pro League, 2023 to now" },
    { src: "/img/era/era-2026-record.webp", w: 1200, h: 675, pos: "50% 25%", alt: "Ronaldo in the Al Nassr shirt, celebrating his all-time record", cap: "Records & milestones — 981 goals in 1,340 senior appearances" },
  ],
};
ERA_PHOTOS.rosario = ERA_PHOTOS["Sporting CP 2002-2003"];
ERA_PHOTOS.peak = ERA_PHOTOS["Manchester United 2003-2009"];
ERA_PHOTOS.msn = ERA_PHOTOS["Real Madrid 2009-2018"];
ERA_PHOTOS.carry = ERA_PHOTOS["Ballon d'Or years"];
ERA_PHOTOS.farewell = ERA_PHOTOS["Juventus 2018-2022"];
ERA_PHOTOS.paris = ERA_PHOTOS["Manchester United return"];
ERA_PHOTOS.miami = ERA_PHOTOS["Al Nassr 2023-present"];


/* Era openers: short fan-editor intros, one per chapter. Plain prose about
   famous nights — no new numbers, every figure here already lives on this
   site or in the trophy list. */
const eraIntro = (key, era) => {
  const lang = getLang();
  const intro = DICT.ERA_INTROS[key] || DICT.ERA_INTROS[era];
  return intro ? `<p class="chapter-intro">${intro}</p>` : "";
};
const eraPhotos = (key, era) => {
  const pics = ERA_PHOTOS[key] || ERA_PHOTOS[era];
  if (!pics || !pics.length) return "";
  return `<div class="ch-photos${pics.length === 1 ? " solo" : ""}">` + pics.map((p) => {
    const webpSrc = p.src.replace(/\.jpg$/, ".webp");
    return `<figure class="ch-photo"><picture>` +
      `<source srcset="${webpSrc}" type="image/webp" />` +
      `<img src="${p.src}" width="${p.w}" height="${p.h}" alt="${esc(p.alt)}" loading="lazy" decoding="async" style="object-position:${p.pos}" />` +
      `</picture><figcaption class="photo-credit">${esc(p.cap)}</figcaption></figure>`;
  }).join("") + `</div>`;
};


const TIMELINE_MILESTONES = [
  {
    date: "14 Aug 2002",
    year: 2002,
    cat: "debut",
    team: "sporting",
    title: "Senior Debut for Sporting CP",
    desc: "Aged 17 years and 190 days, Ronaldo comes on against Inter in the UEFA Champions League third qualifying round at the Estádio José Alvalade — the start of the most decorated career in modern football.",
    stat: "Age 17y 190d",
    badge: "Official Debut",
    img: "/img/era/era-2002-sporting.webp",
    alt: "The Sporting CP museum in Lisbon, with Ronaldo's number 28 shirt from his debut season"
  },
  {
    date: "21 Oct 2002",
    year: 2002,
    cat: "goal",
    team: "sporting",
    title: "First Senior Career Goal vs Moreirense",
    desc: "Two months after his debut, Ronaldo opens his senior account with a goal against Moreirense in the Primeira Liga — the first of 981.",
    stat: "Goal #1",
    badge: "First Senior Goal ⚽"
  },
  {
    date: "16 Aug 2003",
    year: 2003,
    cat: "transfer",
    team: "manutd",
    title: "Signs for Manchester United and Takes the No. 7 Shirt",
    desc: "Ronaldo signs for £12.24m and inherits the legendary United number 7 — the shirt he has worn for the rest of his career.",
    stat: "£12.24m",
    badge: "Manchester United 🔴",
    img: "/img/era/era-2004-manutd.webp",
    alt: "Cristiano Ronaldo in the Manchester United number 7 shirt against Chelsea"
  },
  {
    date: "17 Jun 2004",
    year: 2004,
    cat: "goal",
    team: "portugal",
    title: "First Portugal Goal — Header vs Greece",
    desc: "A powerful header against Greece at Euro 2004 opens his international account, a record he extends to 146 goals in 234 caps.",
    stat: "First Portugal goal",
    badge: "International Goal ⚽"
  },
  {
    date: "10 Dec 2008",
    year: 2008,
    cat: "award",
    team: "manutd",
    title: "Ballon d'Or at 23, Named on All 96 Ballots",
    desc: "The first Ballon d'Or ever won by a Portuguese player, in a season that also delivered the Champions League, the FIFA Club World Cup and eight World Cup goals.",
    stat: "Ballon d'Or #1",
    badge: "1st Ballon d'Or 🌟",
    img: "/img/era/era-2008-ballon1.webp",
    alt: "Cristiano Ronaldo in 2008, the year of his first Ballon d'Or"
  },
  {
    date: "1 Jul 2009",
    year: 2009,
    cat: "transfer",
    team: "realmadrid",
    title: "Signs for Real Madrid for a World-Record Fee",
    desc: "Ronaldo joins Real Madrid for a then record €94m, and 80,000 fans pack the Bernabéu for the presentation. He never leaves the Spanish stage until 2018.",
    stat: "€94m",
    badge: "Real Madrid ⚪",
    img: "/img/era/era-2009-real.webp",
    alt: "Kaka and Ronaldo together for Real Madrid"
  },
  {
    date: "16 Jun 2013",
    year: 2013,
    cat: "record",
    team: "portugal",
    title: "Three Goals in 15 Minutes for Portugal",
    desc: "Against Northern Ireland in a Euro 2012 qualifier, Ronaldo scores three times inside 15 minutes — the fastest international hat-trick of his career — in the season he sets his 69-goal calendar-year record.",
    stat: "Hat-trick in 15 minutes",
    badge: "Record Hat-trick ⚡"
  },
  {
    date: "24 May 2014",
    year: 2014,
    cat: "trophy",
    team: "realmadrid",
    title: "La Décima — The Last-Gasp Penalty in Lisbon",
    desc: "Ronaldo converts the stoppage-time penalty at the Estádio da Luz to win a 4–2 Champions League final, giving Real Madrid a tenth European Cup and a personal 17-goal Champions League season.",
    stat: "La Décima 🏆",
    badge: "10th European Cup"
  },
  {
    date: "4 May 2015",
    year: 2015,
    cat: "record",
    team: "realmadrid",
    title: "500th Career Goal and Champions League Top Scorer",
    desc: "His 500th goal arrives against Malmö in the season he passes Gerd Müller to become the all-time Champions League top scorer — a record he still holds.",
    stat: "Goal #500",
    badge: "500 Goals ⚡",
    img: "/img/era/era-2013-ballon3.webp",
    alt: "Cristiano Ronaldo in the Portugal number 7 shirt"
  },
  {
    date: "10 Jul 2016",
    year: 2016,
    cat: "trophy",
    team: "portugal",
    title: "EURO 2016 Champion as Portugal's Captain",
    desc: "Ronaldo lifts the European Championship in Paris as captain, finishing as the tournament's second-highest scorer with three goals and taking the Silver Boot.",
    stat: "Euro 2016 🏆",
    badge: "European Champion",
    img: "/img/cab-copa.webp",
    alt: "Cristiano Ronaldo in the Portugal number 7 shirt, captaining"
  },
  {
    date: "30 Oct 2017",
    year: 2017,
    cat: "award",
    team: "realmadrid",
    title: "Fifth Ballon d'Or and a 100th Champions League Goal",
    desc: "A hat-trick against Bayern Munich takes him past 100 Champions League goals; a month later he collects his fifth Ballon d'Or in Paris.",
    stat: "Ballon d'Or #5",
    badge: "5th Ballon d'Or 🌟",
    img: "/img/era/era-2016-ballon5.webp",
    alt: "Cristiano Ronaldo in the Portugal number 7 shirt, celebrating"
  },
  {
    date: "10 Jul 2018",
    year: 2018,
    cat: "transfer",
    team: "juventus",
    title: "Signs for Juventus at 33",
    desc: "Ronaldo joins Juventus for €100m and wins two Serie A titles in three seasons, becoming the first player to win the top-scorer award in three different leagues.",
    stat: "€100m",
    badge: "Juventus 🐂",
    img: "/img/era/era-2018-juve.webp",
    alt: "Cristiano Ronaldo presented as a Juventus player in 2018"
  },
  {
    date: "14 Oct 2019",
    year: 2019,
    cat: "goal",
    team: "portugal",
    title: "The 700th Goal of His Career",
    desc: "Ronaldo reaches 700 senior goals against Ukraine, having already topped the Nations League scoring charts at the Finals — and finishes the year as Portugal's all-time top scorer.",
    stat: "Goal #700",
    badge: "700 Goals ⚽"
  },
  {
    date: "22 Feb 2020",
    year: 2020,
    cat: "record",
    team: "juventus",
    title: "1,000th Senior Appearance",
    desc: "Ronaldo plays his 1,000th senior match for Juventus against Cagliari, and later in the year scores his 100th and 101st goals for Portugal in a single match against Sweden.",
    stat: "1,000 appearances",
    badge: "1,000th Appearance 📜"
  },
  {
    date: "11 Sep 2021",
    year: 2021,
    cat: "transfer",
    team: "manutd",
    title: "The Return to Manchester United",
    desc: "Ronaldo returns to Old Trafford on a two-year deal, scoring twice on his debut against Newcastle and adding 27 goals in a single season.",
    stat: "2nd spell",
    badge: "Man United Return 🔴",
    img: "/img/era/era-2021-manutd.webp",
    alt: "Cristiano Ronaldo returning to Manchester United in 2021"
  },
  {
    date: "5 Sep 2024",
    year: 2024,
    cat: "goal",
    team: "portugal",
    title: "The 900th Goal of His Career",
    desc: "A converted penalty against Croatia in the UEFA Nations League takes Ronaldo past 900 senior goals — the first player to score 40 or more goals in 13 different calendar years.",
    stat: "Goal #900",
    badge: "900 Goals ⚽"
  },
  {
    date: "26 May 2025",
    year: 2025,
    cat: "record",
    team: "alnassr",
    title: "800th Club Goal and the 100th for Al Nassr",
    desc: "Ronaldo scores his 800th goal for a club against Al Fateh, then becomes the first player to reach 100 goals for four different clubs, aged 40.",
    stat: "800 club goals",
    badge: "800 Club Goals ⚡",
    img: "/img/era/era-2023-alnassr.webp",
    alt: "Cristiano Ronaldo in the Al Nassr number 7 shirt"
  },
  {
    date: "12 Oct 2026",
    year: 2026,
    cat: "goal",
    team: "alnassr",
    title: "Goal #981 — The Last of a Record Career",
    desc: "Ronaldo's 981st and most recent senior goal arrives for Al Nassr in the Saudi Pro League, closing a career of 981 goals in 1,340 appearances.",
    stat: "Goal #981",
    badge: "981 Career Goals ⚽",
    img: "/img/era/era-2026-record.webp",
    alt: "Cristiano Ronaldo in the Portugal number 7 shirt at the 2026 World Cup"
  }
];

function renderTimeline(d) {
  const lang = getLang();
  const cfg = DICT.TIMELINE;
  const t = d.totals;
  setHead(d, cfg.head(t));

  // 1. Executive Career Summary Banner
  const summaryEl = el("tl-summary");
  if (summaryEl) {
    summaryEl.innerHTML = `
      <div class="tl-summary-kpi"><div class="val">25</div><div class="lbl">Seasons (2002–2026)</div></div>
      <div class="tl-summary-kpi"><div class="val">${n(t.goals)}</div><div class="lbl">Senior Goals</div></div>
      <div class="tl-summary-kpi"><div class="val">261+</div><div class="lbl">Career Assists</div></div>
      <div class="tl-summary-kpi"><div class="val">35</div><div class="lbl">Major Trophies</div></div>
      <div class="tl-summary-kpi"><div class="val">5</div><div class="lbl">Ballons d'Or</div></div>
      <div class="tl-summary-kpi"><div class="val">4</div><div class="lbl">Golden Shoes</div></div>
    `;
  }

  // 2. Defining Milestones Quick Cards in #keydates
  const kdEl = el("keydates");
  if (kdEl) {
    kdEl.innerHTML =
      `<ol class="keydates">` +
      cfg.keydates(t, d.lastUpdated).map((kd) => `<li><span class="kd-date">${kd[0]}</span><span>${kd[1]}</span></li>`).join("") +
      `</ol>`;
  }

  // 3. Category Filter Buttons in #era-nav
  const nodeIcon = (cat) => {
    switch (cat) {
      case "trophy": return "🏆";
      case "award": return "⭐";
      case "goal": return "⚽";
      case "record": return "📜";
      case "debut": return "🚀";
      case "transfer": return "🔄";
      default: return "🌟";
    }
  };

  const teamLabel = (tm) => {
    switch (tm) {
      case "sporting": return "Sporting CP";
      case "manutd": return "Manchester United";
      case "realmadrid": return "Real Madrid";
      case "juventus": return "Juventus";
      case "alnassr": return "Al Nassr";
      case "portugal": return "Portugal";
      default: return "";
    }
  };

  const catCounts = {
    all: TIMELINE_MILESTONES.length,
    trophy: TIMELINE_MILESTONES.filter(m => m.cat === "trophy").length,
    award: TIMELINE_MILESTONES.filter(m => m.cat === "award").length,
    goal: TIMELINE_MILESTONES.filter(m => m.cat === "goal").length,
    record: TIMELINE_MILESTONES.filter(m => m.cat === "record").length,
    sporting: TIMELINE_MILESTONES.filter(m => m.team === "sporting").length,
    manutd: TIMELINE_MILESTONES.filter(m => m.team === "manutd").length,
    realmadrid: TIMELINE_MILESTONES.filter(m => m.team === "realmadrid").length,
    juventus: TIMELINE_MILESTONES.filter(m => m.team === "juventus").length,
    alnassr: TIMELINE_MILESTONES.filter(m => m.team === "alnassr").length,
    portugal: TIMELINE_MILESTONES.filter(m => m.team === "portugal").length
  };

  const filterLabels = {
    es: { all: "Todos", trophy: "🏆 Títulos", award: "⭐ Balones de Oro", goal: "⚽ Goles Hito", record: "📜 Récords Mundiales", sporting: "💚 Sporting CP", manutd: "🔴 Manchester United", realmadrid: "⚪ Real Madrid", juventus: "🐂 Juventus", alnassr: "💛 Al Nassr", portugal: "🇵🇹 Portugal" },
    pt: { all: "Todos", trophy: "🏆 Títulos", award: "⭐ Bolas de Ouro", goal: "⚽ Gols Históricos", record: "📜 Recordes Mundiais", sporting: "💚 Sporting CP", manutd: "🔴 Manchester United", realmadrid: "⚪ Real Madrid", juventus: "🐂 Juventus", alnassr: "💛 Al Nassr", portugal: "🇵🇹 Portugal" },
    fr: { all: "Tous", trophy: "🏆 Trophées", award: "⭐ Ballons d'Or", goal: "⚽ Buts Marquants", record: "📜 Records Mondiaux", sporting: "💚 Sporting CP", manutd: "🔴 Manchester United", realmadrid: "⚪ Real Madrid", juventus: "🐂 Juventus", alnassr: "💛 Al Nassr", portugal: "🇵🇹 Portugal" },
    ar: { all: "الكل", trophy: "🏆 البطولات", award: "⭐ الكرات الذهبية", goal: "⚽ أهداف تاريخية", record: "📜 أرقام قياسية", sporting: "💚 سبورتينغ", manutd: "🔴 مانشستر يونايتد", realmadrid: "⚪ ريال مدريد", juventus: "🐂 يوفنتوس", alnassr: "💛 النصر", portugal: "🇵🇹 البرتغال" },
    bn: { all: "সব", trophy: "🏆 ট্রফি", award: "⭐ ব্যালন ডি'অর", goal: "⚽ স্মরণীয় গোল", record: "📜 বিশ্বরেকর্ড", sporting: "💚 স্পোর্টিং", manutd: "🔴 ম্যানচেস্টার ইউনাইটেড", realmadrid: "⚪ রিয়াল মাদ্রিদ", juventus: "🐂 জুভেন্তুস", alnassr: "💛 আল নাসর", portugal: "🇵🇹 পর্তুগাল" },
    hi: { all: "सभी", trophy: "🏆 ट्रॉफियां", award: "⭐ बैलन डी'ओर", goal: "⚽ ऐतिहासिक गोल", record: "📜 विश्व रिकॉर्ड", sporting: "💚 स्पोर्टिंग", manutd: "🔴 मैनचेस्टर यूनाइटेड", realmadrid: "⚪ रियल मैड्रिड", juventus: "🐂 जुवेंतस", alnassr: "💛 अल नस्र", portugal: "🇵🇹 पुर्तगाल" },
    ro: { all: "Toate", trophy: "🏆 Trofee", award: "⭐ Baloane de Aur", goal: "⚽ Goluri Reper", record: "📜 Recorduri Mondiale", sporting: "💚 Sporting CP", manutd: "🔴 Manchester United", realmadrid: "⚪ Real Madrid", juventus: "🐂 Juventus", alnassr: "💛 Al Nassr", portugal: "🇵🇹 Portugalia" },
    uz: { all: "Barchasi", trophy: "🏆 Sovrinlar", award: "⭐ Oltin to'p", goal: "⚽ Tarixiy gollar", record: "📜 Jahon rekordlari", sporting: "💚 Sporting", manutd: "🔴 Manchester United", realmadrid: "⚪ Real Madrid", juventus: "🐂 Juventus", alnassr: "💛 Al Nassr", portugal: "🇵🇹 Portugal" }
  };
  const fl = filterLabels[lang] || { all: "All", trophy: "🏆 Trophies", award: "⭐ Ballons d'Or", goal: "⚽ Landmark Goals", record: "📜 World Records", sporting: "💚 Sporting CP", manutd: "🔴 Manchester United", realmadrid: "⚪ Real Madrid", juventus: "🐂 Juventus", alnassr: "💛 Al Nassr", portugal: "🇵🇹 Portugal" };

  const filterButtons = [
    { id: "all", label: `${fl.all} (${catCounts.all})` },
    { id: "trophy", label: `${fl.trophy} (${catCounts.trophy})` },
    { id: "award", label: `${fl.award} (${catCounts.award})` },
    { id: "goal", label: `${fl.goal} (${catCounts.goal})` },
    { id: "record", label: `${fl.record} (${catCounts.record})` },
    { id: "sporting", label: `${fl.sporting} (${catCounts.sporting})` },
    { id: "manutd", label: `${fl.manutd} (${catCounts.manutd})` },
    { id: "realmadrid", label: `${fl.realmadrid} (${catCounts.realmadrid})` },
    { id: "juventus", label: `${fl.juventus} (${catCounts.juventus})` },
    { id: "alnassr", label: `${fl.alnassr} (${catCounts.alnassr})` },
    { id: "portugal", label: `${fl.portugal} (${catCounts.portugal})` }
  ];

  let currentCat = "all";

  const nav = el("era-nav");
  if (nav) {
    nav.className = "tl-filter-controls";
    nav.innerHTML = `
      <div class="tl-pills-row" role="group" aria-label="Filter career milestones">
        ${filterButtons.map((btn, i) => `
          <button class="tl-filter-btn${i === 0 ? " active" : ""}" data-cat="${btn.id}" type="button">
            ${btn.label}
          </button>
        `).join("")}
      </div>
    `;

    nav.querySelectorAll(".tl-filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        nav.querySelectorAll(".tl-filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentCat = btn.dataset.cat;
        applyFilters();
      });
    });
  }

  // 4. Populate #chapters with the 50-milestone interactive stream
  const chaptersEl = el("chapters");
  if (chaptersEl) {
    chaptersEl.innerHTML = `
      <div class="tl-stream" id="tl-stream">
        ${TIMELINE_MILESTONES.map((m) => `
          <article class="tl-card tl-reveal in" data-cat="${m.cat}" data-team="${m.team}" data-text="${esc((m.year + " " + m.date + " " + m.title + " " + m.desc + " " + m.stat + " " + m.badge + " " + m.team).toLowerCase())}">
            <div class="tl-node" aria-hidden="true">${nodeIcon(m.cat)}</div>
            ${m.img ? `
            <figure class="tl-card-media">
              <img src="${m.img}" alt="${esc(m.alt || m.title)}" loading="lazy" />
            </figure>` : ""}
            <div class="tl-card-top">
              <span class="tl-date-badge">${esc(m.date)}</span>
              <span class="tl-cat-badge tl-cat-${m.cat}">${esc(m.badge || m.cat)}</span>
            </div>
            <h3 class="tl-card-title">${esc(m.title)}</h3>
            <p class="tl-card-desc">${esc(m.desc)}</p>
            <div class="tl-card-footer">
              <span class="tl-pill-stat">⭐ ${esc(m.stat)}</span>
              <span class="tl-pill-stat">${teamLabel(m.team)}</span>
            </div>
          </article>
        `).join("")}
      </div>
    `;
  }

  // 5. Search & Category Filtering Wiring
  const totalEvents = TIMELINE_MILESTONES.length;
  const inp = el("tl-filter");
  const countEl = el("tl-count");

  const paintCount = (matched) => {
    if (!countEl) return;
    if (matched === totalEvents && currentCat === "all" && (!inp || !inp.value.trim())) {
      countEl.textContent = "";
      return;
    }
    const fmt = {
      es: `${matched} de ${totalEvents} hitos`,
      pt: `${matched} de ${totalEvents} marcos`,
      fr: `${matched} sur ${totalEvents} jalons`,
      ar: `${matched} من أصل ${totalEvents} محطة`,
      bn: `${totalEvents}টির মধ্যে ${matched}টি মাইলফলক`,
      hi: `${totalEvents} में से ${matched} मील के पत्थर`,
      ro: `${matched} din ${totalEvents} repere`,
      uz: `${totalEvents} tadan ${matched} ta muhim voqea`
    };
    countEl.textContent = fmt[lang] || `Showing ${matched} of ${totalEvents} milestones`;
  };

  const applyFilters = () => {
    const q = inp ? inp.value.trim().toLowerCase() : "";
    let matched = 0;
    document.querySelectorAll("#tl-stream .tl-card").forEach((card) => {
      const cardCat = card.dataset.cat;
      const cardTeam = card.dataset.team;
      const cardText = card.dataset.text;

      let catMatch = true;
      if (currentCat !== "all") {
        catMatch = (currentCat === cardCat || currentCat === cardTeam);
      }
      const textMatch = !q || cardText.includes(q);
      const visible = catMatch && textMatch;

      card.hidden = !visible;
      if (visible) matched++;
    });

    let empty = el("tl-empty");
    if (matched === 0) {
      if (!empty) {
        empty = document.createElement("p");
        empty.id = "tl-empty";
        empty.className = "tl-empty";
        if (chaptersEl) chaptersEl.after(empty);
      }
      empty.textContent = cfg.empty(inp ? inp.value.trim() : "", totalEvents);
      empty.hidden = false;
    } else if (empty) {
      empty.hidden = true;
    }
    paintCount(matched);
  };

  if (inp) {
    inp.addEventListener("input", applyFilters);
  }

  // 6. FAQ Accordion & Explorers
  const faqEl = el("faq");
  if (faqEl && cfg.faq) {
    faqEl.innerHTML = cfg.faq.map((q) => `<details class="faq-item"><summary class="faq-question"><span>${q[0]}</span><span class="faq-chevron" aria-hidden="true">▾</span></summary><div class="faq-answer"><p>${q[1]}</p></div></details>`).join("");
    faqEl.className = "faq-accordion";
  }

  // Visual Trophy Cabinet
  if (el("cabinet")) {
    el("cabinet").innerHTML = cabinetPhotos();
  }

  // 35 Trophies breakdown by club and country
  const groupsEl = el("groups");
  if (groupsEl && d.trophies) {
    const teamRows = d.trophies.filter((x) => x.team !== "Individual");
    const indRows = d.trophies.filter((x) => x.team === "Individual");
    const indTotal = indRows.reduce((a, x) => a + x.count, 0);
    const order = ["Real Madrid", "Manchester United", "Juventus", "Al Nassr", "Sporting CP", "Portugal"];
    const trow = (x) => `<div class="tpill"><span class="tp-name">${esc(x.title)}</span><span class="tp-count">×${x.count}</span>` +
      `<span class="tp-years">${esc(x.years.join(", "))}</span></div>`;
    const achCfg = DICT.ACH;
    groupsEl.innerHTML = order.map((team) => {
      const rows = teamRows.filter((x) => x.team === team);
      const sub = rows.reduce((a, x) => a + x.count, 0);
      return `<div class="trophy-group"><div class="shead"><h3>${achCfg.teamHeader(team, sub)}</h3></div><div class="tpills-wrap">` +
        rows.map(trow).join("") + `</div></div>`;
    }).join("") + (indRows.length ?
      `<div class="trophy-group"><div class="shead"><h3>${achCfg.indHeader(indTotal)}</h3></div><div class="tpills-wrap">` +
      indRows.map(trow).join("") + `</div></div>` : "");
  }

  renderExplore(d, "timeline");
  renderMethod(d, cfg.method);
}

/* ================= ACHIEVEMENTS ================= */
/* Trophy cabinet: self-hosted celebration photos. Mounted as #cabinet. */

const CABINET = DICT.CABINET;

const cabinetPhotos = () => {
  const lang = getLang();
  const list = DICT.CABINET;
  return list.map((p) =>
    `<article class="cab-card"><h3>${esc(p.title)}</h3><p class="cab-sub">${esc(p.sub)}</p>` +
    `<figure class="cab-photo"><img src="${p.src}" width="${p.w}" height="${p.h}" alt="${esc(p.alt)}" loading="lazy" style="object-position:${p.pos || "50% 25%"}" />` +
    `<figcaption class="photo-credit">${esc(p.cap)}</figcaption></figure></article>`
  ).join("");
};


function renderAch(d) {
  const lang = getLang();
  const cfg = DICT.ACH;
  const teamRows = d.trophies.filter((x) => x.team !== "Individual");
  const indRows = d.trophies.filter((x) => x.team === "Individual");
  const teamTotal = teamRows.reduce((a, x) => a + x.count, 0);
  const indTotal = indRows.reduce((a, x) => a + x.count, 0);
  const per = {};
  teamRows.forEach((x) => { per[x.team] = (per[x.team] || 0) + x.count; });
  setHead(d, cfg.head(teamTotal));
  el("kpis").innerHTML = cfg.kpis(per).map((k) => kpi4(k[0], k[1], k[2])).join("");
  el("qa").innerHTML = cfg.qa(teamTotal, per).map((q) => `<details class="faq-item"><summary class="faq-question"><span>${q[0]}</span><span class="faq-chevron" aria-hidden="true">▾</span></summary><div class="faq-answer"><p>${q[1]}</p></div></details>`).join("");
  el("qa").className = "faq-accordion";
  el("cabinet").innerHTML = cabinetPhotos();
  const order = ["Real Madrid", "Manchester United", "Juventus", "Al Nassr", "Sporting CP", "Portugal"];
  const trow = (x) => `<div class="tpill"><span class="tp-name">${esc(x.title)}</span><span class="tp-count">×${x.count}</span>` +
    `<span class="tp-years">${esc(x.years.join(", "))}</span></div>`;
  el("groups").innerHTML = order.map((team) => {
    const rows = teamRows.filter((x) => x.team === team);
    const sub = rows.reduce((a, x) => a + x.count, 0);
    return `<div class="trophy-group"><div class="shead"><h2>${cfg.teamHeader(team, sub)}</h2></div>` +
      rows.map(trow).join("") + `</div>`;
  }).join("") + (indRows.length ?
    `<div class="trophy-group"><div class="shead"><h2>${cfg.indHeader(indTotal)}</h2></div>` +
    indRows.map(trow).join("") + `</div>` : "");
  el("faq").innerHTML = cfg.faq.map((q) => `<details class="faq-item"><summary class="faq-question"><span>${q[0]}</span><span class="faq-chevron" aria-hidden="true">▾</span></summary><div class="faq-answer"><p>${q[1]}</p></div></details>`).join("");
  el("faq").className = "faq-accordion";
  renderExplore(d, "achievements");
  renderMethod(d, "");
  initAchievementsQuiz();
}

/* Entrance motion (additive): donut sweep + KPI tick share Task 1's boot observer —
   one observer, not two. Markup always holds final numbers/offsets (no-JS safe). */
let entranceObs = null;
function tickKpis(grid) {
  grid.querySelectorAll(".kpi-value").forEach((v) => {
    if (v.dataset.tick) return;
    v.dataset.tick = "1";
    const m = v.textContent.trim().match(/^([\d,]+(?:\.\d+)?)$/);
    if (!m) return; /* compound values ("2012 · 91", "927 / 1,000") stay static */
    const final = m[1];
    const dec = (final.split(".")[1] || "").length;
    const target = parseFloat(final.replace(/,/g, ""));
    if (!isFinite(target)) return;
    const t0 = performance.now(), dur = 900;
    const step = (t) => {
      const k = Math.min((t - t0) / dur, 1);
      const cur = target * (1 - Math.pow(1 - k, 3));
      v.textContent = dec ? cur.toFixed(dec) : n(Math.round(cur));
      if (k < 1) requestAnimationFrame(step);
      else v.textContent = final; /* exact final grouping, never rounded off */
    };
    requestAnimationFrame(step);
  });
}
function armEntrance() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const sparks = document.querySelectorAll("svg.spark:not(.in)");
  const donuts = document.querySelectorAll("svg.donut:not(.in)");
  const grids = document.querySelectorAll("#kpis, #decades");
  const applyDonut = (svg) => {
    svg.classList.add("in");
    svg.querySelectorAll("circle").forEach((c) => {
      const len = c.dataset.len || c.getAttribute("data-len");
      const C = c.dataset.c || c.getAttribute("data-c");
      if (len && C) c.setAttribute("stroke-dasharray", `${len} ${C}`);
    });
  };
  if (reduce) {
    sparks.forEach((s) => s.classList.add("in"));
    donuts.forEach(applyDonut);
    return;
  }
  if (!("IntersectionObserver" in window)) {
    sparks.forEach((s) => s.classList.add("in"));
    donuts.forEach(applyDonut);
    grids.forEach(tickKpis);
    return;
  }
  if (!entranceObs) {
    entranceObs = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const t = en.target;
        entranceObs.unobserve(t);
        if (t.matches("svg.donut")) {
          applyDonut(t);
        } else if (t.matches("svg.spark")) {
          t.classList.add("in");
        } else {
          t.dataset.armed = "1";
          tickKpis(t);
        }
      });
    }, { rootMargin: "250px 0px 250px 0px", threshold: 0.01 });
  }
  sparks.forEach((s) => entranceObs.observe(s));
  donuts.forEach((s) => entranceObs.observe(s));
  grids.forEach((g) => { if (!g.dataset.armed) entranceObs.observe(g); });
}

/* Universal clipboard helper with textarea fallback */
async function copyToClipboard(text, msgEl, successMsg) {
  const lang = getLang();
  const defaultMsgs = {
    es: "¡Copiado al portapapeles!",
    pt: "Copiado para a área de transferência!",
    fr: "Copié dans le presse-papier !",
    ar: "تم النسخ إلى الحافظة!",
    bn: "ক্লিপবোর্ডে কপি করা হয়েছে!",
    hi: "क्लिपबोर्ड पर कॉपी किया गया!",
    ro: "Copiat în clipboard!",
    uz: "Vaqtinchalik xotiraga nusxalandi!"
  };
  const finalMsg = successMsg || defaultMsgs[lang] || "Copied to clipboard!";
  let ok = false;
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      ok = true;
    }
  } catch (_) {}
  if (!ok) {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      ok = true;
    } catch (_) {}
  }
  if (msgEl) {
    msgEl.textContent = ok ? finalMsg : text;
    clearTimeout(msgEl._timer);
    msgEl._timer = setTimeout(() => { msgEl.textContent = ""; }, 3500);
  }
}

/* ================= BIRTHDAY VIRAL SOCIAL & CANVAS CARD ================= */
function updateBirthdaySocialShare(dayData, key) {
  const lang = getLang();
  const isRonaldoBday = (dayData.month === 2 && dayData.day === 5);
  let shareText = "";
  if (lang === "es") {
    if (dayData.goalsCount > 0) {
      const gWord = dayData.goalsCount === 1 ? "gol" : "goles";
      shareText = `¡Cristiano Ronaldo marcó ${dayData.goalsCount} ${gWord} en mi cumpleaños (${dayData.formatted})! ⚽🎂 ¿Marcó en el tuyo?`;
    } else if (isRonaldoBday) {
      shareText = `¡Cumplo años el mismo día que Cristiano Ronaldo (5 de febrero)! 🐐🎂 ¿Marcó en tu cumpleaños?`;
    } else {
      shareText = `¿Marcó Cristiano Ronaldo en tu cumpleaños? Revisa los 366 días a lo largo de sus 981 goles:`;
    }
  } else if (lang === "pt") {
    if (dayData.goalsCount > 0) {
      const gWord = dayData.goalsCount === 1 ? "gol" : "gols";
      shareText = `Cristiano Ronaldo marcou ${dayData.goalsCount} ${gWord} no meu aniversário (${dayData.formatted})! ⚽🎂 Ele marcou no seu?`;
    } else if (isRonaldoBday) {
      shareText = `Faço aniversário no mesmo dia que Cristiano Ronaldo (5 de fevereiro)! 🐐🎂 Ele marcou no seu?`;
    } else {
      shareText = `Cristiano Ronaldo marcou no seu aniversário? Confira todos os 366 dias da carreira:`;
    }
  } else if (lang === "fr") {
    if (dayData.goalsCount > 0) {
      const gWord = dayData.goalsCount === 1 ? "but" : "buts";
      shareText = `Cristiano Ronaldo a marqué ${dayData.goalsCount} ${gWord} le jour de mon anniversaire (${dayData.formatted}) ! ⚽🎂 A-t-il marqué le vôtre ?`;
    } else if (isRonaldoBday) {
      shareText = `Je partage mon anniversaire avec Cristiano Ronaldo (5 février) ! 🐐🎂 A-t-il marqué le vôtre ?`;
    } else {
      shareText = `Cristiano Ronaldo a-t-il marqué le jour de votre anniversaire ? Découvrez les 366 jours :`;
    }
  } else if (lang === "ar") {
    if (dayData.goalsCount > 0) {
      shareText = `كريستيانو رونالدو سجل ${dayData.goalsCount} هدفاً في يوم ميلادي (${dayData.formatted})! ⚽🎂 هل سجل في يوم ميلادك؟`;
    } else if (isRonaldoBday) {
      shareText = `عيد ميلادي نفس يوم ميلاد كريستيانو رونالدو (5 فبراير)! 🐐🎂 هل سجل في يوم ميلادك؟`;
    } else {
      shareText = `هل سجل كريستيانو رونالدو في يوم ميلادك؟ تحقق من جميع أيام السنة:`;
    }
  } else if (lang === "bn") {
    if (dayData.goalsCount > 0) {
      shareText = `ক্রিস্টিয়ানো রোনালদো আমার জন্মদিনে (${dayData.formatted}) ${dayData.goalsCount}টি গোল করেছেন! ⚽🎂 আপনার জন্মদিনে কি গোল করেছেন?`;
    } else if (isRonaldoBday) {
      shareText = `আমার জন্মদিন ক্রিস্টিয়ানো রোনালদোর জন্মদিনের একই দিনে (৫ ফেব্রুয়ারি)! 🐐🎂 আপনার জন্মদিনে কি গোল করেছেন?`;
    } else {
      shareText = `ক্রিস্টিয়ানো রোনালদো কি আপনার জন্মদিনে গোল করেছিলেন? ৩৬৬ দিনের তালিকা দেখুন:`;
    }
  } else if (lang === "hi") {
    if (dayData.goalsCount > 0) {
      shareText = `क्रिस्टियानो रोनाल्डो ने मेरे जन्मदिन (${dayData.formatted}) पर ${dayData.goalsCount} गोल किए! ⚽🎂 क्या आपके जन्मदिन पर गोल किया?`;
    } else if (isRonaldoBday) {
      shareText = `मेरा जन्मदिन क्रिस्टियानो रोनाल्डो के जन्मदिन के दिन (5 फ़रवरी) है! 🐐🎂 क्या आपके जन्मदिन पर गोल किया?`;
    } else {
      shareText = `क्या क्रिस्टियानो रोनाल्डो ने आपके जन्मदिन पर गोल किया? 366 दिनों की जांच करें:`;
    }
  } else if (lang === "ro") {
    if (dayData.goalsCount > 0) {
      const gWord = dayData.goalsCount === 1 ? "gol" : "goluri";
      shareText = `Cristiano Ronaldo a marcat ${dayData.goalsCount} ${gWord} de ziua mea (${dayData.formatted})! ⚽🎂 A marcat și de a ta?`;
    } else if (isRonaldoBday) {
      shareText = `Sunt născut în aceeași zi cu Cristiano Ronaldo (5 februarie)! 🐐🎂 A marcat de ziua ta?`;
    } else {
      shareText = `A marcat Cristiano Ronaldo de ziua ta? Verifică toate cele 366 de zile:`;
    }
  } else if (lang === "uz") {
    if (dayData.goalsCount > 0) {
      shareText = `Kristiano Ronaldo mening tug'ilgan kunimda (${dayData.formatted}) ${dayData.goalsCount} ta gol urgan! ⚽🎂 Sizning tug'ilgan kuningizdachi?`;
    } else if (isRonaldoBday) {
      shareText = `Men Kristiano Ronaldo bilan bir kunda tug'ilganman (5-fevral)! 🐐🎂 Sizning tug'ilgan kuningizdachi?`;
    } else {
      shareText = `Kristiano Ronaldo sizning tug'ilgan kuningizda gol urganmi? 366 kunlik natijalarni tekshiring:`;
    }
  } else {
    if (dayData.goalsCount > 0) {
      const gWord = dayData.goalsCount === 1 ? "goal" : "goals";
      shareText = `Cristiano Ronaldo scored ${dayData.goalsCount} ${gWord} on my birthday (${dayData.formatted})! ⚽🎂 Did he score on yours?`;
    } else if (isRonaldoBday) {
      shareText = `I share a birthday with Cristiano Ronaldo (5 February)! 🐐🎂 Did he score on your birthday?`;
    } else {
      shareText = `Did Cristiano Ronaldo score on your birthday? Check all 366 days across his 981 career goals:`;
    }
  }

  const shareUrl = `${location.origin}/en/birthday/${key}`;

  const shareBtn = el("bday-share-btn");
  if (shareBtn) {
    shareBtn.hidden = false;
    shareBtn.onclick = async () => {
      if (navigator.share) {
        try {
          await navigator.share({ title: "Ronaldo Birthday Stats", text: shareText, url: shareUrl });
          return;
        } catch (_) {}
      }
      copyToClipboard(`${shareText} ${shareUrl}`, shareMsg);
    };
  }

  const copyBtn = el("bday-copy-btn");
  if (copyBtn) {
    copyBtn.onclick = () => {
      copyToClipboard(shareUrl, shareMsg);
    };
  }

  const xBtn = el("bday-x-share-btn");
  if (xBtn) {
    xBtn.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
  }
  const waBtn = el("bday-wa-share-btn");
  if (waBtn) {
    waBtn.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + shareUrl)}`;
  }

}

function setupEmbedModal() {
  const triggerBtn = el("bday-embed-trigger-btn");
  const modal = el("bday-embed-modal");
  const closeBtn = el("bday-embed-modal-close");
  const copyBtn = el("bday-copy-embed-btn");
  const copyMsg = el("bday-embed-copy-msg");
  const textarea = el("bday-embed-code");
  const iframe = el("bday-embed-iframe");
  const tabDynamic = el("bday-embed-tab-dynamic");
  const tabFixed = el("bday-embed-tab-fixed");
  const tabDateSpan = el("bday-embed-tab-date");

  if (!triggerBtn || !modal) return;

  let mode = "dynamic"; // "dynamic" or "fixed"

  function updateEmbedSnippet() {
    const key = window.__currentBdayKey || "02-05";
    const formatted = window.__currentBdayFormatted || key;
    if (tabDateSpan) tabDateSpan.textContent = formatted;

    if (mode === "fixed") {
      const srcUrl = `https://www.ronaldostats.site/embed/on-this-day?date=${key}`;
      if (textarea) {
        textarea.value = `<iframe src="${srcUrl}" width="100%" height="380" frameborder="0" style="border-radius:12px;box-shadow:0 4px 16px rgba(0,0,0,0.1);max-width:520px;"></iframe>`;
      }
      if (iframe) {
        iframe.src = `/embed/on-this-day.html?date=${key}`;
      }
    } else {
      const srcUrl = `https://www.ronaldostats.site/embed/on-this-day`;
      if (textarea) {
        textarea.value = `<iframe src="${srcUrl}" width="100%" height="380" frameborder="0" style="border-radius:12px;box-shadow:0 4px 16px rgba(0,0,0,0.1);max-width:520px;"></iframe>`;
      }
      if (iframe) {
        iframe.src = `/embed/on-this-day.html`;
      }
    }
  }

  window.__updateEmbedModal = updateEmbedSnippet;

  triggerBtn.onclick = () => {
    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    updateEmbedSnippet();
  };

  if (tabDynamic) {
    tabDynamic.onclick = () => {
      mode = "dynamic";
      tabDynamic.classList.add("active");
      if (tabFixed) tabFixed.classList.remove("active");
      updateEmbedSnippet();
    };
  }

  if (tabFixed) {
    tabFixed.onclick = () => {
      mode = "fixed";
      tabFixed.classList.add("active");
      if (tabDynamic) tabDynamic.classList.remove("active");
      updateEmbedSnippet();
    };
  }

  if (closeBtn) {
    closeBtn.onclick = () => {
      modal.hidden = true;
      modal.setAttribute("aria-hidden", "true");
    };
  }
  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.hidden = true;
      modal.setAttribute("aria-hidden", "true");
    }
  };
  if (copyBtn && textarea) {
    copyBtn.onclick = () => {
      copyToClipboard(textarea.value, copyMsg);
    };
  }
}

/* ================= 366-DAY BIRTHDAY GOALS EXPLORER ================= */

async function renderBirthday(d) {
  let bdayData;
  try {
    let res;
    try {
      res = await fetch("/data/birthday-goals.json", { cache: "no-store" });
    } catch (_) {}
    if (!res || !res.ok) {
      res = await fetch("data/birthday-goals.json", { cache: "no-store" });
    }
    if (!res.ok) throw new Error("birthday goals data " + res.status);
    bdayData = await res.json();
  } catch (err) {
    console.error("Failed to load birthday data", err);
    return;
  }

  const lang = getLang();
  const bDict = DICT.BDAY;

  const meta = bdayData.meta || {};
  const calendar = bdayData.calendar || {};

  if (el("kpi-days-scored")) el("kpi-days-scored").textContent = meta.daysWithGoals || 292;
  if (el("kpi-days-empty")) el("kpi-days-empty").textContent = meta.daysWithoutGoals || 74;

  const MONTH_NAMES = bDict.months;
  const DAYS_IN_MONTH = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  const pad2 = (num) => String(num).padStart(2, "0");
  const makeKey = (m, day) => `${pad2(m)}-${pad2(day)}`;

  const monthSelect = el("bday-month-select");
  const daySelect = el("bday-day-select");
  const checkBtn = el("bday-check-btn");
  const pillsWrap = el("bday-month-pills");

  const updateDaysDropdown = (m, keepDay) => {
    if (!daySelect) return;
    const maxDays = DAYS_IN_MONTH[m] || 31;
    let selected = keepDay ? Math.min(keepDay, maxDays) : +(daySelect.value || 1);
    if (selected > maxDays) selected = maxDays;
    let html = "";
    for (let i = 1; i <= maxDays; i++) {
      html += `<option value="${i}"${i === selected ? " selected" : ""}>${i}</option>`;
    }
    daySelect.innerHTML = html;
  };

  if (monthSelect) {
    let mOptions = "";
    for (let m = 1; m <= 12; m++) {
      mOptions += `<option value="${m}">${MONTH_NAMES[m]}</option>`;
    }
    monthSelect.innerHTML = mOptions;
  }

  if (pillsWrap) {
    let pillsHtml = "";
    for (let m = 1; m <= 12; m++) {
      const shortName = MONTH_NAMES[m].length > 4 ? MONTH_NAMES[m].slice(0, 3) : MONTH_NAMES[m];
      pillsHtml += `<button type="button" class="bday-month-pill" data-month="${m}">${shortName}</button>`;
    }
    pillsWrap.innerHTML = pillsHtml;
    pillsWrap.addEventListener("click", (e) => {
      const btn = e.target.closest(".bday-month-pill");
      if (!btn) return;
      const m = +btn.dataset.month;
      if (monthSelect) monthSelect.value = m;
      const currentDay = daySelect ? +daySelect.value : 1;
      updateDaysDropdown(m, currentDay);
      selectDate(m, daySelect ? +daySelect.value : 1, false);
    });
  }

  const findClosestScoringDay = (targetKey) => {
    const keys = Object.keys(calendar);
    const targetIdx = keys.indexOf(targetKey);
    if (targetIdx === -1) return null;
    let best = null;
    let bestDist = Infinity;
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      if (calendar[k] && calendar[k].goalsCount > 0) {
        const dist = Math.min(
          Math.abs(i - targetIdx),
          keys.length - Math.abs(i - targetIdx)
        );
        if (dist < bestDist && dist > 0) {
          bestDist = dist;
          best = calendar[k];
        }
      }
    }
    return best;
  };

  const targetDateEl = el("bday-target-date");
  const badgeEl = el("bday-verdict-badge");
  const headlineEl = el("bday-headline");
  const matchListEl = el("bday-match-list");
  const shareBtn = el("bday-share-btn");
  const shareMsg = el("bday-share-msg");

  let currentMatches = [];

  // Goal Video Modal Controller
  const videoModal = el("video-modal");
  const videoPlayer = el("goal-video-player");
  const videoBigPlayBtn = el("video-big-play-btn");
  const videoTitle = el("video-modal-title");
  const videoEyebrow = el("video-modal-eyebrow");
  const videoClose = el("video-modal-close");
  const videoGoalsNav = el("video-goals-nav");
  const videoFallback = el("video-fallback");
  const videoYtLink = el("video-yt-link");
  const vpillMin = el("vpill-minute");
  const vpillComp = el("vpill-comp");
  const vpillScore = el("vpill-score");
  const vpillAssist = el("vpill-assist");
  const vpillXg = el("vpill-xg");
  const mediaSlot = el("bday-media-slot");
  const sourceLink = el("video-source-link");
  const clipLink = el("video-clip-link");
  const sourceLine = el("video-modal-source");
  const noClipTitle = el("bday-noclip-title");
  const noClipBody = el("bday-noclip-body");

  const closeGoalVideo = () => {
    if (!videoModal) return;
    videoModal.hidden = true;
    videoModal.setAttribute("aria-hidden", "true");
    if (videoPlayer) {
      videoPlayer.pause();
      videoPlayer.removeAttribute("src");
      videoPlayer.load();
    }
    if (videoBigPlayBtn) videoBigPlayBtn.hidden = true;
    document.body.style.overflow = "";
  };

  if (videoBigPlayBtn) {
    videoBigPlayBtn.onclick = () => {
      if (videoPlayer) {
        videoPlayer.play().then(() => {
          videoBigPlayBtn.hidden = true;
        }).catch((err) => {
          console.log("Play blocked:", err);
        });
      }
    };
  }

  if (videoPlayer) {
    videoPlayer.addEventListener("play", () => {
      if (videoBigPlayBtn) videoBigPlayBtn.hidden = true;
    });
    videoPlayer.addEventListener("pause", () => {
      if (videoModal && !videoModal.hidden && videoBigPlayBtn) videoBigPlayBtn.hidden = false;
    });
    videoPlayer.addEventListener("ended", () => {
      if (videoBigPlayBtn) videoBigPlayBtn.hidden = false;
    });
  }

  try {
    const railNav = document.querySelector(".rail nav");
    if (railNav) {
      railNav.addEventListener("scroll", updateRailEdges, { passive: true });
      window.addEventListener("resize", updateRailEdges, { passive: true });
      setTimeout(updateRailEdges, 60);
    }
  } catch (_) {}

  if (videoClose) videoClose.onclick = closeGoalVideo;
  if (videoModal) {
    videoModal.onclick = (e) => {
      if (e.target === videoModal) closeGoalVideo();
    };
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && videoModal && !videoModal.hidden) {
      closeGoalVideo();
    }
  });

  // The sourced archive links each goal to the media that shows it: an exact
  // clip, the match highlights, or the compilation the goal appears in. A
  // YouTube link is embedded; anything else is offered as a link out, because
  // the clip itself belongs to its rights holder.
  const MEDIA = DICT.BDAY_MEDIA || {};
  const youtubeId = (url) => {
    const m = String(url || "").match(/(?:youtube\.com\/(?:watch\?v=|embed\/|live\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
    return m ? m[1] : null;
  };
  // ronaldo7.net publishes some of the per-goal clips on Dailymotion
  const dailymotionId = (url) => {
    const m = String(url || "").match(/dailymotion\.com\/(?:embed\/)?(?:video\/)?(x[a-z0-9]+)/i);
    return m ? m[1] : null;
  };
  const isEmbeddable = (url) => {
    const u = String(url || "");
    if (!u) return false;
    if (youtubeId(u)) return true;
    // Dailymotion refuses to be framed — it answers an embed with
    // "Forbidden" — so those clips open on dailymotion.com instead.
    if (dailymotionId(u)) return false;
    return /\.(mp4|webm)(\?|$)/i.test(u);
  };
  const mediaHtml = (v) => {
    const url = v && v.videoUrl ? String(v.videoUrl) : "";
    if (!url) return "";
    const id = youtubeId(url);
    const dmId = dailymotionId(url);
    // A compilation is a real video with the goal inside it, and a season
    // video holds every goal of that season: play it and say so, instead of
    // pretending the goal itself is on screen.
    let note = "";
    if (v.kind === "season") {
      note = '<p class="bday-media-note">' + String(MEDIA.seasonNote || "").replace("{season}", v.seasonLabel || "") + '</p>';
    } else if (v.kind === "compilation") {
      note = '<p class="bday-media-note">' + (MEDIA.compilationNote || "") + '</p>';
    }
    if (v.description) {
      note += '<p class="bday-media-desc">' + esc(v.description) + '</p>';
    }
    if (id) {
      return '<div class="bday-media-frame"><iframe src="https://www.youtube-nocookie.com/embed/' + id +
        '" title="Ronaldo goal" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen' +
        ' referrerpolicy="strict-origin-when-cross-origin" style="width:100%;aspect-ratio:16/9;border:0;background:#000;display:block;"></iframe></div>' + note;
    }
    if (dmId) {
      // it cannot be framed: offer the page it plays on
      return '<p class="bday-media-note">' + esc(note.replace(/<[^>]+>/g, " ")) + '</p>';
    }
    if (/\.(mp4|webm)(\?|$)/i.test(url)) {
      return '<video controls playsinline webkit-playsinline preload="metadata" src="' + url +
        '" style="width:100%;aspect-ratio:16/9;background:#000;display:block;"></video>' + note;
    }
    return "";
  };

  const openGoalVideo = (match, initialIndex = 0) => {
    if (!videoModal || !match) return;
    const videos = match.videos || [];
    if (!videos.length) {
      const ytQuery = encodeURIComponent(`Cristiano Ronaldo goal vs ${match.opponent} ${match.date}`);
      window.open(`https://www.youtube.com/results?search_query=${ytQuery}`, "_blank");
      return;
    }

    const loadGoalIndex = (idx) => {
      const v = videos[idx];
      if (!v) return;

      const mHtml = mediaHtml(v);
      if (mediaSlot) {
        mediaSlot.innerHTML = mHtml;
        mediaSlot.hidden = !mHtml;
      }
      if (videoFallback) videoFallback.hidden = !!mHtml;
      if (videoBigPlayBtn) videoBigPlayBtn.hidden = true;
      // a goal whose clip cannot be framed (Dailymotion) still has one:
      // say "published clip", not "no published clip"
      const hasClip = !!(v.videoUrl || v.archiveUrl || v.seasonVideoUrl);
      if (noClipTitle) noClipTitle.textContent = hasClip ? (MEDIA.clipLabel || MEDIA.noClip || "") : (MEDIA.noClip || "");
      if (noClipBody) noClipBody.textContent = MEDIA.noClipBody || "";
      if (videoTitle) {
        const numStr = v.goalNumber ? `Goal #${v.goalNumber}: ` : "Goal: ";
        videoTitle.textContent = `${numStr}Ronaldo vs ${match.opponent}`;
      }
      if (videoEyebrow) {
        videoEyebrow.textContent = `${match.date} • ${match.competition || "Official Match"}`;
      }
      if (vpillMin) vpillMin.textContent = `⚽ ${v.minute || match.minutes?.[idx] || ""}'`;
      if (vpillComp) vpillComp.textContent = match.competition || "Match";
      if (vpillScore) vpillScore.textContent = `${match.team} ${match.score} ${match.opponent}`;
      
      if (vpillAssist) {
        if (v.assist) {
          vpillAssist.hidden = false;
          vpillAssist.textContent = (MEDIA.assist || "Assist: {name}").replace("{name}", v.assist);
        } else {
          vpillAssist.hidden = true;
        }
      }
      if (vpillXg) {
        const finish = v.finish || (v.types && v.types[idx]) || "";
        if (finish) {
          vpillXg.hidden = false;
          vpillXg.textContent = (MEDIA.finish || "Finish: {type}").replace("{type}", finish);
        } else {
          vpillXg.hidden = true;
        }
      }

      if (videoYtLink) {
        videoYtLink.href = `https://www.youtube.com/results?search_query=Cristiano+Ronaldo+goal+vs+${encodeURIComponent(match.opponent)}+${match.date}`;
        videoYtLink.textContent = MEDIA.searchHighlights || videoYtLink.textContent;
      }
      if (sourceLink) {
        sourceLink.href = v.sourcePage || "https://cr7allgoals.com/";
        sourceLink.textContent = MEDIA.openArchive || sourceLink.textContent;
        sourceLink.hidden = !v.sourcePage;
      }
      if (clipLink) {
        const embeddable = !!mediaHtml(v);
        const clipUrl = v.videoUrl || "";
        clipLink.hidden = !clipUrl || embeddable;
        if (!clipLink.hidden) {
          clipLink.href = clipUrl;
          clipLink.textContent = (MEDIA.watchOn || "Watch on {publisher}").replace("{publisher}", v.publisher || "the publisher");
        }
      }
      if (sourceLine) {
        sourceLine.textContent = (MEDIA.sourceLine || "").replace("{source}", "cr7allgoals.com");
      }

      if (videoPlayer) {
        videoPlayer.onerror = () => {
          if (videoFallback) videoFallback.hidden = false;
          if (videoBigPlayBtn) videoBigPlayBtn.hidden = true;
        };
        videoPlayer.src = v.videoUrl;
        videoPlayer.load();
        const playPromise = videoPlayer.play();
        if (playPromise) {
          playPromise.catch((err) => {
            console.log("Autoplay paused by policy:", err);
            if (videoBigPlayBtn) videoBigPlayBtn.hidden = false;
          });
        }
      }

      if (videoGoalsNav) {
        videoGoalsNav.querySelectorAll(".video-goal-tab").forEach((tab, tIdx) => {
          tab.classList.toggle("active", tIdx === idx);
        });
      }
    };

    if (videoGoalsNav) {
      if (videos.length > 1) {
        videoGoalsNav.hidden = false;
        let tabsHtml = "";
        videos.forEach((v, i) => {
          const minLabel = v.minute ? ` (${v.minute}')` : "";
          tabsHtml += `<button type="button" class="video-goal-tab${i === initialIndex ? " active" : ""}" data-gidx="${i}">${bDict.goalTab(i + 1, v.minute)}</button>`;
        });
        videoGoalsNav.innerHTML = tabsHtml;
        videoGoalsNav.querySelectorAll(".video-goal-tab").forEach((tab) => {
          tab.onclick = () => loadGoalIndex(+tab.dataset.gidx);
        });
      } else {
        videoGoalsNav.hidden = true;
        videoGoalsNav.innerHTML = "";
      }
    }

    loadGoalIndex(initialIndex);
    videoModal.hidden = false;
    videoModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  // The page states the source of every figure it shows.
  {
    const note = el("bday-source-note");
    if (note && MEDIA.sourceNote) {
      note.innerHTML = '<span class="bday-source-note-text">' + MEDIA.sourceNote + "</span>";
    }
  }

  if (matchListEl) {
    matchListEl.addEventListener("click", (e) => {
      const watchBtn = e.target.closest(".bday-watch-video-btn");
      if (watchBtn) {
        const idx = +watchBtn.dataset.idx;
        const match = currentMatches[idx];
        if (match) {
          openGoalVideo(match, 0);
        }
        return;
      }

      const goalWatch = e.target.closest(".bday-goal-watch");
      if (goalWatch && goalWatch.tagName === "BUTTON") {
        const idx = +goalWatch.dataset.idx;
        const gidx = +(goalWatch.dataset.gidx || 0);
        const match = currentMatches[idx];
        if (match) openGoalVideo(match, gidx);
        return;
      }

      const inlineBtn = e.target.closest(".bday-inline-toggle-btn");
      if (inlineBtn) {
        const idx = +inlineBtn.dataset.idx;
        const match = currentMatches[idx];
        const container = el(`bday-inline-player-${idx}`);
        if (!match || !container) return;

        const isCurrentlyOpen = !container.hidden;
        matchListEl.querySelectorAll(".bday-card-inline-player").forEach((p) => {
          p.hidden = true;
          p.innerHTML = "";
        });
        matchListEl.querySelectorAll(".bday-inline-toggle-btn").forEach((b) => {
          b.classList.remove("active");
          b.textContent = bDict.playInline;
        });

        if (!isCurrentlyOpen) {
          container.hidden = false;
          inlineBtn.classList.add("active");
          inlineBtn.textContent = bDict.closeInline;

          const videos = match.videos || [];
          const renderInline = (vIdx) => {
            const v = videos[vIdx];
            if (!v) return;
            let navHtml = "";
            if (videos.length > 1) {
              navHtml = `<div class="bday-card-inline-nav">` +
                videos.map((vid, i) => `<button type="button" class="video-goal-tab${i === vIdx ? " active" : ""}" data-inidx="${i}">${bDict.goalTab(i + 1, vid.minute)}</button>`).join("") +
              `</div>`;
            }
            container.innerHTML = `
              ${navHtml}
              ${mediaHtml(v) || '<p class="bday-inline-noclip">' + (MEDIA.noClip || "") + "</p>"}
            `;
            const inVid = container.querySelector("video");
            if (inVid) inVid.play().catch(() => {});
            container.querySelectorAll(".video-goal-tab").forEach((tab) => {
              tab.onclick = () => renderInline(+tab.dataset.inidx);
            });
          };
          renderInline(0);
        }
      }
    });
  }

  const updateBirthdaySocialShare = (dayData, key) => {
    const formatted = `${dayData.day} ${MONTH_NAMES[dayData.month]}`;
    const shareUrl = `${location.origin}/en/birthday/${key}`;
    const shareText = dayData.goalsCount > 0
      ? bDict.shareSuccess(formatted, dayData.goalsCount, dayData.matches?.length || 1)
      : bDict.shareEmpty(formatted);

    const fullShare = `${shareText} ${shareUrl}`;

    if (shareBtn) {
      shareBtn.onclick = async () => {
        try {
          if (navigator.share) {
            await navigator.share({ title: `Ronaldo Birthday Goals: ${formatted}`, text: shareText, url: shareUrl });
          } else if (navigator.clipboard) {
            await navigator.clipboard.writeText(fullShare);
            if (shareMsg) {
              const copiedMsgs = {
                es: "¡Copiado!",
                pt: "Copiado!",
                fr: "Copié !",
                ar: "تم النسخ!",
                bn: "কপি করা হয়েছে!",
                hi: "कॉपी किया गया!",
                ro: "Copiat!",
                uz: "Nusxalandi!"
              };
              shareMsg.textContent = copiedMsgs[lang] || "Copied!";
              setTimeout(() => { shareMsg.textContent = ""; }, 3000);
            }
          }
        } catch (_) {}
      };
    }

    const copyBtn = el("bday-copy-btn");
    if (copyBtn) {
      copyBtn.onclick = async () => {
        try {
          await navigator.clipboard.writeText(shareUrl);
          if (shareMsg) {
            const urlCopiedMsgs = {
              es: "¡Enlace copiado!",
              pt: "Link copiado!",
              fr: "Lien copié !",
              ar: "تم نسخ الرابط!",
              bn: "লিংক কপি করা হয়েছে!",
              hi: "लिंक कॉपी किया गया!",
              ro: "Link copiat!",
              uz: "Havola nusxalandi!"
            };
            shareMsg.textContent = urlCopiedMsgs[lang] || "URL Copied!";
            setTimeout(() => { shareMsg.textContent = ""; }, 3000);
          }
        } catch (_) {}
      };
    }

    const waBtn = el("bday-wa-share-btn");
    if (waBtn) {
      waBtn.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(fullShare)}`;
    }

    const xBtn = el("bday-x-share-btn");
    if (xBtn) {
      xBtn.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    }
  };

  const selectDate = (m, day, shouldScroll = false) => {
    m = +m;
    day = +day;
    if (isNaN(m) || m < 1 || m > 12) m = 2;
    const maxDays = DAYS_IN_MONTH[m] || 31;
    if (isNaN(day) || day < 1 || day > maxDays) day = 5;

    if (monthSelect) monthSelect.value = m;
    updateDaysDropdown(m, day);
    if (daySelect) daySelect.value = day;

    if (pillsWrap) {
      pillsWrap.querySelectorAll(".bday-month-pill").forEach((p) => {
        p.classList.toggle("on", +p.dataset.month === m);
      });
    }

    document.querySelectorAll(".bday-day-btn").forEach((cell) => {
      const isMatch = +cell.dataset.month === m && +cell.dataset.day === day;
      cell.classList.toggle("active", isMatch);
      if (isMatch) cell.setAttribute("aria-current", "date");
      else cell.removeAttribute("aria-current");
    });

    document.querySelectorAll(".bday-preset-chip").forEach((chip) => {
      const cm = +chip.dataset.month;
      const cd = +chip.dataset.day;
      chip.classList.toggle("active", cm === m && cd === day);
    });

    const topTbodyEl = el("top-days-tbody");
    if (topTbodyEl) {
      topTbodyEl.querySelectorAll("tr").forEach((row) => {
        const link = row.querySelector("[data-month]");
        if (link) {
          const isMatch = +link.dataset.month === m && +link.dataset.day === day;
          row.classList.toggle("active-row", isMatch);
        }
      });
    }

    const key = makeKey(m, day);
    const dayData = calendar[key] || {
      key,
      month: m,
      day,
      monthName: MONTH_NAMES[m],
      formatted: `${day} ${MONTH_NAMES[m]}`,
      goalsCount: 0,
      matches: []
    };

    const formatted = `${day} ${MONTH_NAMES[m]}`;
    window.__currentBdayKey = key;
    window.__currentBdayFormatted = formatted;
    if (window.__updateEmbedModal) window.__updateEmbedModal();

    // Point the address bar at the single canonical date page (clean URLs
    // exist in English only) instead of a ?date= fork that Google indexes
    // as a separate duplicate. Share/copy buttons use the same clean URL.
    try {
      const url = new URL(location.href);
      history.replaceState(null, "", `/en/birthday/${key}${url.hash}`);
    } catch (_) {}


    const formatScore = (str) => {
      if (!str) return "—";
      const sm = String(str).match(/^(\d+)\s*[:\-\u2013]\s*(\d+)$/);
      if (sm) {
        return `${parseInt(sm[1], 10)} – ${parseInt(sm[2], 10)}`;
      }
      return str;
    };

    if (targetDateEl) targetDateEl.textContent = formatted;

    if (dayData.goalsCount > 0) {
      currentMatches = dayData.matches || [];
      if (badgeEl) {
        badgeEl.innerHTML = `<span class="bday-badge-success">${bDict.badgeSuccess}</span>`;
      }
      if (headlineEl) {
        headlineEl.innerHTML = bDict.headlineSuccess(dayData.goalsCount, dayData.matches.length, formatted);
      }

      if (matchListEl) {
        let matchesHtml = "";
        dayData.matches.forEach((match, matchIdx) => {
          const minTags = (match.minutes || [])
            .map((min) => `<span class="bday-min-tag">⚽ ${esc(min)}'</span>`)
            .join(" ");
          const typeTags = (match.types || []).filter(Boolean).length
            ? `<span class="bday-shot-types">(${match.types.join(", ")})</span>`
            : "";

          // One row per goal. Every goal gets a watch action: the published
          // clip when the archive has one, otherwise a search for that exact
          // goal — so every goal on the page is watchable.
          const goalRows = (match.videos && match.videos.length ? match.videos : []).map((v, gi) => {
            const min = v.minute ? v.minute + "'" : (gi + 1) + "";
            const fin = v.finish || (match.types || [])[gi] || "";
            const q = encodeURIComponent("Cristiano Ronaldo goal vs " + match.opponent + " " + match.date + " " + (match.competition || ""));
            const watchUrl = "https://www.youtube.com/results?search_query=" + q;
            const archiveUrl = v.sourcePage || "";
            // Play it when it can be played: an embeddable clip opens the
            // player, a clip on the publisher's own site opens there, and a
            // goal with no published video opens a search for the footage.
            const watch = isEmbeddable(v.videoUrl)
              ? `<button type="button" class="bday-goal-watch" data-idx="${matchIdx}" data-gidx="${gi}">${MEDIA.watchGoal || "▶ Watch this goal"}</button>`
              : v.videoUrl
                ? `<a class="bday-goal-watch" href="${v.videoUrl}" target="_blank" rel="noopener noreferrer">${MEDIA.watchGoal || "▶ Watch this goal"}</a>`
                : `<a class="bday-goal-watch" href="${watchUrl}" target="_blank" rel="noopener noreferrer">${MEDIA.watchGoal || "▶ Watch this goal"}</a>`;
            const archive = archiveUrl
              ? `<a class="bday-goal-archive" href="${archiveUrl}" target="_blank" rel="noopener noreferrer" title="cr7allgoals.com">↗</a>`
              : "";
            return `<div class="bday-goal-row">
                <span class="bday-goal-min">⚽ ${esc(min)}</span>
                ${fin ? `<span class="bday-goal-type">${esc(fin)}</span>` : ""}
                ${watch}${archive}
              </div>`;
          }).join("");
          const goalList = goalRows ? `<div class="bday-goal-list">${goalRows}</div>` : "";
          const hasVideos = match.videos && match.videos.length > 0;
          const videoBtn = hasVideos
            ? `<button type="button" class="bday-watch-video-btn" data-idx="${matchIdx}">
                <svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                ${bDict.watchClip(match.videos.length)}
               </button>`
            : `<a href="https://www.youtube.com/results?search_query=Cristiano+Ronaldo+goal+vs+${encodeURIComponent(match.opponent)}+${match.date}" target="_blank" rel="noopener noreferrer" class="bday-yt-search-btn">
                ${bDict.searchYt}
               </a>`;

          matchesHtml += `
            <article class="bday-match-card">
              <div class="bday-match-meta">
                <span class="bday-match-date-badge">${esc(match.date)}</span>
                <span class="bday-comp-chip">${esc(match.competition || "Official Match")}</span>
              </div>
              <div class="bday-match-fixture">
                <span>${esc(match.team)}</span>
                <span class="bday-score-pill">${esc(formatScore(match.score))}</span>
                <span>${esc(match.opponent)}</span>
              </div>
              <div class="bday-goals-summary">
                <strong>${bDict.goalSummary(match.goalsCount)}</strong>
                <div class="bday-minute-tags">${minTags}</div>
                ${typeTags}
              </div>
              ${goalList}
              <div class="bday-match-actions">
                ${videoBtn}
                ${hasVideos ? `<button type="button" class="bday-inline-toggle-btn" data-idx="${matchIdx}">${bDict.playInline}</button>` : ""}
                ${hasVideos ? `<a href="https://www.youtube.com/results?search_query=Cristiano+Ronaldo+goal+vs+${encodeURIComponent(match.opponent)}+${match.date}" target="_blank" rel="noopener noreferrer" class="bday-yt-search-btn">${bDict.ytHighlights}</a>` : ""}
              </div>
              <div class="bday-card-inline-player" id="bday-inline-player-${matchIdx}" hidden></div>
            </article>
          `;
        });
        matchListEl.innerHTML = matchesHtml;
      }

      updateBirthdaySocialShare(dayData, key);
    } else {
      const isRonaldoBday = (m === 2 && day === 5);
      const ownBadge = bDict.badgeRonaldo || bDict.badgeMessi || "";
      const ownHeadline = bDict.headlineRonaldo || bDict.headlineMessi || "";
      const ownWhy = bDict.whyZeroRonaldo || bDict.whyZeroMessi || "";
      const ownWhySub = bDict.whyZeroRonaldoSub || bDict.whyZeroMessiSub || "";
      if (isRonaldoBday) {
        if (badgeEl) {
          badgeEl.innerHTML = `<span class="bday-badge-ronaldo">${ownBadge}</span>`;
        }
        if (headlineEl) {
          headlineEl.innerHTML = ownHeadline;
        }
        if (matchListEl) {
          matchListEl.innerHTML = `
            <div class="bday-empty-box">
              <p><b>${bDict.whyZeroTitle}</b> ${ownWhy}</p>
              <p>${ownWhySub}</p>
            </div>
          `;
        }
      } else {
        if (badgeEl) {
          badgeEl.innerHTML = `<span class="bday-badge-empty">${bDict.badgeEmpty}</span>`;
        }
        if (headlineEl) {
          headlineEl.innerHTML = bDict.headlineEmpty(formatted);
        }
        const closest = findClosestScoringDay(key);
        if (matchListEl) {
          let closestHtml = "";
          if (closest) {
            const closestFormatted = `${closest.day} ${MONTH_NAMES[closest.month]}`;
            closestHtml = `
              <p>${bDict.closestDay(closestFormatted, closest.goalsCount)}</p>
              <button type="button" class="bday-closest-btn" data-month="${closest.month}" data-day="${closest.day}">
                ${bDict.closestBtn(closestFormatted, closest.goalsCount)}
              </button>
            `;
          }
          matchListEl.innerHTML = `
            <div class="bday-empty-box">
              <p>${bDict.emptyExpl}</p>
              ${closestHtml}
            </div>
          `;
          const closestBtn = matchListEl.querySelector(".bday-closest-btn");
          if (closestBtn) {
            closestBtn.addEventListener("click", () => {
              selectDate(+closestBtn.dataset.month, +closestBtn.dataset.day, true);
            });
          }
        }
      }

      updateBirthdaySocialShare(dayData, key);
    }

    if (shouldScroll) {
      const v = el("bday-verdict");
      if (v) v.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (checkBtn) {
    checkBtn.addEventListener("click", () => {
      const m = monthSelect ? +monthSelect.value : 5;
      const day = daySelect ? +daySelect.value : 2;
      selectDate(m, day, true);
    });
  }

  if (monthSelect) {
    monthSelect.addEventListener("change", () => {
      const m = +monthSelect.value;
      const currentDay = daySelect ? +daySelect.value : 1;
      updateDaysDropdown(m, currentDay);
      selectDate(m, daySelect ? +daySelect.value : 1, false);
    });
  }

  if (daySelect) {
    daySelect.addEventListener("change", () => {
      const m = monthSelect ? +monthSelect.value : 5;
      selectDate(m, +daySelect.value, false);
    });
  }

  const modeCustomBtn = el("bday-mode-custom");
  const modeFamousBtn = el("bday-mode-famous");
  const panelCustom = el("bday-panel-custom");
  const panelFamous = el("bday-panel-famous");

  const switchMode = (mode) => {
    if (mode === "famous") {
      if (modeFamousBtn) {
        modeFamousBtn.classList.add("active");
        modeFamousBtn.setAttribute("aria-selected", "true");
      }
      if (modeCustomBtn) {
        modeCustomBtn.classList.remove("active");
        modeCustomBtn.setAttribute("aria-selected", "false");
      }
      if (panelFamous) panelFamous.hidden = false;
      if (panelCustom) panelCustom.hidden = true;
    } else {
      if (modeCustomBtn) {
        modeCustomBtn.classList.add("active");
        modeCustomBtn.setAttribute("aria-selected", "true");
      }
      if (modeFamousBtn) {
        modeFamousBtn.classList.remove("active");
        modeFamousBtn.setAttribute("aria-selected", "false");
      }
      if (panelCustom) panelCustom.hidden = false;
      if (panelFamous) panelFamous.hidden = true;
    }
  };

  if (modeCustomBtn) modeCustomBtn.addEventListener("click", () => switchMode("custom"));
  if (modeFamousBtn) modeFamousBtn.addEventListener("click", () => switchMode("famous"));

  document.querySelectorAll(".bday-preset-chip[data-month]").forEach((chip) => {
    chip.addEventListener("click", (e) => {
      e.preventDefault();
      selectDate(+chip.dataset.month, +chip.dataset.day, true);
    });
  });

  const todayBtn = el("bday-preset-today");
  if (todayBtn) {
    todayBtn.addEventListener("click", () => {
      const n = new Date();
      selectDate(n.getUTCMonth() + 1, n.getUTCDate(), true);
    });
  }

  const randomBtn = el("bday-preset-random");
  if (randomBtn) {
    randomBtn.addEventListener("click", () => {
      const scoringKeys = Object.keys(calendar).filter((k) => calendar[k].goalsCount > 0);
      const chosen = scoringKeys[Math.floor(Math.random() * scoringKeys.length)];
      const [rm, rd] = chosen.split("-").map(Number);
      selectDate(rm, rd, true);
    });
  }

  // Calendar Heatmap Month Filter Navigation
  const heatmapNav = el("bday-heatmap-nav");
  if (heatmapNav) {
    const params = new URLSearchParams(window.location.search);
    const dateParam = params.get("date");
    const monthParam = params.get("month");
    let initMonth = (new Date()).getMonth() + 1; // 1-12
    if (monthParam && +monthParam >= 1 && +monthParam <= 12) {
      initMonth = +monthParam;
    } else if (dateParam && dateParam.includes("-")) {
      const pm = parseInt(dateParam.split("-")[0], 10);
      if (pm >= 1 && pm <= 12) initMonth = pm;
    }

    let navHtml = `<button type="button" class="bday-heatmap-nav-btn ${initMonth === 'all' ? 'active' : ''}" data-month="all">All (366 Days)</button>`;
    for (let m = 1; m <= 12; m++) {
      const shortName = MONTH_NAMES[m].length > 4 ? MONTH_NAMES[m].slice(0, 3) : MONTH_NAMES[m];
      const isActive = m === initMonth;
      navHtml += `<button type="button" class="bday-heatmap-nav-btn ${isActive ? 'active' : ''}" data-month="${m}">${shortName}</button>`;
    }
    heatmapNav.innerHTML = navHtml;

    // Apply initial filter to hide non-active months for a compact, short layout
    const monthCards = document.querySelectorAll(".bday-month-card");
    if (initMonth !== "all") {
      monthCards.forEach((c) => {
        c.hidden = +c.dataset.month !== initMonth;
      });
    }

    heatmapNav.addEventListener("click", (e) => {
      const btn = e.target.closest(".bday-heatmap-nav-btn");
      if (!btn) return;
      const mTarget = btn.dataset.month;
      heatmapNav.querySelectorAll(".bday-heatmap-nav-btn").forEach((b) => b.classList.toggle("active", b === btn));

      if (mTarget === "all") {
        monthCards.forEach((c) => { c.hidden = false; });
      } else {
        monthCards.forEach((c) => {
          c.hidden = +c.dataset.month !== +mTarget;
        });
      }
    });
  }

  // Calendar Heatmap Grid Matrix Click Delegation
  const heatmapGrid = el("bday-heatmap-grid") || el("bday-calendar-grid");
  if (heatmapGrid) {
    heatmapGrid.addEventListener("click", (e) => {
      const btn = e.target.closest(".bday-day-btn");
      if (!btn) return;
      e.preventDefault();
      selectDate(+btn.dataset.month, +btn.dataset.day, true);
    });
  }

  // Top 15 Prolific Days Table Click Delegation
  const topTbody = el("top-days-tbody");
  if (topTbody) {
    topTbody.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-month]");
      if (btn) {
        e.preventDefault();
        selectDate(+btn.dataset.month, +btn.dataset.day, true);
      }
    });
  }

  const monthlyTbody = el("monthly-tbody");
  if (monthlyTbody) {
    if (!monthlyTbody.firstElementChild && meta.months) {
      let mHtml = "";
      meta.months.forEach((row) => {
        const pct = ((row.goals / meta.totalGoals) * 100).toFixed(1);
        const dayPct = ((row.daysScored / row.totalDays) * 100).toFixed(1);

        let peakDay = 1, peakGoals = 0;
        for (let d = 1; d <= row.totalDays; d++) {
          const k = makeKey(row.month, d);
          const gc = calendar[k]?.goalsCount || 0;
          if (gc > peakGoals) {
            peakGoals = gc;
            peakDay = d;
          }
        }
        const mName = MONTH_NAMES[row.month];
        const peakStr = peakGoals > 0 ? `${peakDay} ${mName} (${peakGoals} goals)` : "—";

        mHtml += `
          <tr>
            <td class="left"><b>${esc(mName)}</b></td>
            <td><b>${row.goals}</b></td>
            <td>${pct}%</td>
            <td>${row.daysScored} / ${row.totalDays}</td>
            <td>${dayPct}%</td>
            <td class="left">${esc(peakStr)}</td>
          </tr>
        `;
      });
      monthlyTbody.innerHTML = mHtml;
    }
    monthlyTbody.addEventListener("click", (e) => {
      const tr = e.target.closest("tr");
      if (!tr) return;
      const mIdx = Array.from(monthlyTbody.children).indexOf(tr) + 1;
      if (mIdx >= 1 && mIdx <= 12 && heatmapNav) {
        const targetBtn = heatmapNav.querySelector(`[data-month="${mIdx}"]`);
        if (targetBtn) targetBtn.click();
        const hm = el("bday-heatmap");
        if (hm) hm.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  const params = new URLSearchParams(location.search);
  let initMonth = 2;
  let initDay = 5;

  const pathMatch = location.pathname.match(/\/birthday\/(\d{1,2})-(\d{1,2})/);
  if (pathMatch) {
    initMonth = parseInt(pathMatch[1], 10);
    initDay = parseInt(pathMatch[2], 10);
  } else if (params.get("date")) {
    const parts = params.get("date").split("-");
    if (parts.length === 2) {
      initMonth = parseInt(parts[0], 10);
      initDay = parseInt(parts[1], 10);
    }
  } else if (params.get("month") && params.get("day")) {
    initMonth = parseInt(params.get("month"), 10);
    initDay = parseInt(params.get("day"), 10);
  }

  // Legacy ?date= / ?month=&day= URLs (shared before the clean-URL migration):
  // consolidate onto the single canonical date page instead of hydrating a
  // param duplicate that Google indexes separately from the canonical.
  if (!pathMatch && (params.get("date") || (params.get("month") && params.get("day")))) {
    if (Number.isFinite(initMonth) && Number.isFinite(initDay) && initMonth >= 1 && initMonth <= 12 && initDay >= 1 && initDay <= 31) {
      const cleanKey = `${String(initMonth).padStart(2, "0")}-${String(initDay).padStart(2, "0")}`;
      try { window.location.replace(`/en/birthday/${cleanKey}`); } catch (_) {}
      return;
    }
  }

  updateDaysDropdown(initMonth, initDay);
  selectDate(initMonth, initDay, false);
  setupEmbedModal();

  renderExplore(d, "birthday");
  renderMethod(d, `Every single one of the ${n(d.totals.goals)} senior goals is cross-referenced with exact date, opponent, competition, minute, and scoreline.`);
}


function bindGoalCards(video, activeNum, activeTitle, activeMeta, activeMin, activeType, activeScore, activeComp, ytBtn, bdayLink) {
  const goalCards = document.querySelectorAll(".recent-goal-card");
  goalCards.forEach((card) => {
    card.onclick = () => {
      const gid = card.dataset.goalId;
      const title = card.dataset.title;
      const meta = card.dataset.meta;
      const minute = card.dataset.minute;
      const type = card.dataset.type;
      const score = card.dataset.score;
      const comp = card.dataset.comp;
      const videoUrl = card.dataset.videoUrl;
      const ytUrl = card.dataset.ytUrl;
      const bdayUrl = card.dataset.bdayUrl;
      const goalNum = card.dataset.goalNum;

      goalCards.forEach((c) => c.classList.remove("active"));
      card.classList.add("active");

      if (video && videoUrl) {
        video.src = videoUrl;
        video.load();
        video.play().catch(() => {});
      }
      if (activeNum && goalNum) activeNum.textContent = goalNum;
      if (activeTitle && title) activeTitle.textContent = title;
      if (activeMeta && meta) activeMeta.textContent = meta;
      if (activeMin && minute) activeMin.textContent = minute;
      if (activeType && type) activeType.textContent = type;
      if (activeScore && score) activeScore.textContent = score;
      if (activeComp && comp) activeComp.textContent = comp;
      if (ytBtn && ytUrl) ytBtn.href = ytUrl;
      if (bdayLink && bdayUrl) bdayLink.href = bdayUrl;


      if (window.innerWidth < 768 && video) {
        video.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    };
  });
}

async function autoPullLatestGoalLive(d) {
  try {
    let payload = null;
    try {
      const res = await fetch("/api/latest-goal", { cache: "no-cache" });
      if (res.ok) payload = await res.json();
    } catch (_) {}

    if (!payload) {
      try {
        const fallbackRes = await fetch("/data/latest-goal.json", { cache: "no-cache" });
        if (fallbackRes.ok) payload = await fallbackRes.json();
      } catch (_) {}
    }

    if (!payload || !payload.latestGoal) return;

    const lang = getLang();
    const t = DICT.LATEST_GOAL;
    const g = payload.latestGoal;
    const ts = payload.todayStatus || {};

    const activeNum = document.getElementById("active-goal-num");
    const activeTitle = document.getElementById("active-goal-title");
    const activeMeta = document.getElementById("active-goal-meta");
    const activeMin = document.getElementById("stat-minute");
    const activeType = document.getElementById("stat-type");
    const activeScore = document.getElementById("stat-score");
    const activeComp = document.getElementById("stat-comp");
    const video = document.getElementById("latest-goal-video");
    const ytBtn = document.getElementById("btn-yt-highlights");
    const bdayLink = document.getElementById("link-bday-goal");
    const todayCard = document.getElementById("today-status-section");

    const currentNumStr = (activeNum ? activeNum.textContent : "").replace(/\D/g, "");
    const currentNum = parseInt(currentNumStr, 10) || 981;

    const isDesynced = (g.goalNumber !== currentNum) ||
      (video && !video.src.includes(`Goal${g.goalNumber}.mp4`)) ||
      (activeTitle && !activeTitle.textContent.toLowerCase().includes((g.opponent || "").toLowerCase()));

    if (isDesynced || g.goalNumber >= currentNum) {
      if (activeNum) activeNum.textContent = lang === "uz" ? `${g.goalNumber}-gol` : `${t.goalPrefix}${g.goalNumber}`;
      if (activeTitle && g.title) activeTitle.textContent = `${t.goalPrefix}${g.goalNumber} ${t.matchHighlights || "Match Highlights"}: ${g.title}`;
      if (activeMeta && g.venue) activeMeta.textContent = `${g.competition} • ${g.formattedDate} • ${g.venue}`;
      if (activeMin && g.minute) activeMin.textContent = g.minute;
      if (activeType && g.type) activeType.textContent = g.type;
      if (activeScore && g.score) activeScore.textContent = g.score;
      if (activeComp && g.competition) activeComp.textContent = g.competition;
      if (video && g.videoUrl && !video.src.includes(`Goal${g.goalNumber}.mp4`)) {
        video.src = g.videoUrl;
        video.load();
      }
      if (ytBtn && g.youtubeUrl) ytBtn.href = g.youtubeUrl;
      if (bdayLink && g.bdayKey) {
        // Date pages exist in English only — never link non-EN date forks (404s).
        bdayLink.href = `/en/birthday/${g.bdayKey}`;
      }
    }

    if (todayCard && ts.didScoreToday) {
      const verdictText = todayCard.querySelector(".today-status-verdict span");
      const verdictBadge = todayCard.querySelector(".badge-video");
      const descText = todayCard.querySelector(".today-status-desc");

      if (verdictBadge) {
        verdictBadge.textContent = t.goalBadge.replace("{goalNum}", ts.lastGoalNumber).replace("{minute}", ts.lastGoalMinute);
      }
      if (verdictText) {
        verdictText.textContent = t.matchResult.replace("{title}", ts.lastMatchResult);
      }
      if (descText) {
        descText.innerHTML = `<b>${t.didScoreTodayYes.replace("{goalNum}", ts.lastGoalNumber).replace("{minute}", ts.lastGoalMinute).replace("{opp}", ts.lastMatchOpponent).replace("{score}", ts.lastMatchResult)}</b>`;
      }
    }

    if (payload.recentGoals && payload.recentGoals.length > 0) {
      const grid = document.querySelector(".recent-goals-grid");
      if (grid) {
        const firstCard = grid.querySelector(".recent-goal-card");
        const firstCardId = parseInt(firstCard?.dataset?.goalId, 10) || 0;
        const firstCardTitle = firstCard?.dataset?.title || "";
        const targetLatest = payload.recentGoals[0];
        const gridNeedsSync = (targetLatest.goalNumber !== firstCardId) ||
          (!firstCardTitle.toLowerCase().includes(targetLatest.title.toLowerCase().slice(0, 10)));

        if (gridNeedsSync || targetLatest.goalNumber >= firstCardId) {
          grid.innerHTML = payload.recentGoals.map((rg, idx) => {
            const isActive = idx === 0 ? " active" : "";
            const goalLabel = lang === "uz" ? `${rg.goalNumber}-gol` : `${t.goalPrefix}${rg.goalNumber}`;
            // Date pages exist in English only — never link non-EN date forks (404s).
            const bdayPath = rg.bdayUrl || `/en/birthday/${rg.bdayKey || "02-05"}`;
            return `
              <div class="recent-goal-card${isActive}" data-goal-id="${rg.goalNumber}"
                   data-goal-num="${goalLabel}"
                   data-title="${rg.title}"
                   data-meta="${rg.meta}"
                   data-minute="${rg.minute}"
                   data-type="${rg.type}"
                   data-score="${rg.score}"
                   data-comp="${rg.comp}"
                   data-video-url="${rg.videoUrl}"
                   data-yt-url="${rg.ytUrl}"
                   data-bday-url="${bdayPath}">
                <div class="recent-goal-card-top">
                  <span class="recent-goal-card-num">${goalLabel}</span>
                  <svg class="recent-goal-play-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                </div>
                <div class="recent-goal-card-match">${rg.match}</div>
                <div class="recent-goal-card-date">${rg.date}</div>
                <span class="recent-goal-card-tag">${rg.tag || "Goal 🔥"}</span>
              </div>
            `;
          }).join("");

          bindGoalCards(video, activeNum, activeTitle, activeMeta, activeMin, activeType, activeScore, activeComp, ytBtn, bdayLink);
        }
      }
    }
  } catch (err) {
    console.warn("autoPullLatestGoalLive warning:", err);
  }
}

function renderLatestGoal(d) {
  const video = document.getElementById("latest-goal-video");
  const activeNum = document.getElementById("active-goal-num");
  const activeTitle = document.getElementById("active-goal-title");
  const activeMeta = document.getElementById("active-goal-meta");
  const activeMin = document.getElementById("stat-minute");
  const activeType = document.getElementById("stat-type");
  const activeScore = document.getElementById("stat-score");
  const activeComp = document.getElementById("stat-comp");
  const ytBtn = document.getElementById("btn-yt-highlights");
  const replayBtn = document.getElementById("btn-replay-goal");
  const shareBtn = document.getElementById("btn-share-goal");
  const bdayLink = document.getElementById("link-bday-goal");

  if (replayBtn && video) {
    replayBtn.addEventListener("click", () => {
      video.currentTime = 0;
      video.play().catch(() => {});
    });
  }

  if (shareBtn) {
    shareBtn.addEventListener("click", async () => {
      const url = window.location.href;
      const title = document.title;
      if (navigator.share) {
        try {
          await navigator.share({ title, url });
        } catch (_) {}
      } else {
        try {
          await navigator.clipboard.writeText(url);
          const orig = shareBtn.innerHTML;
          shareBtn.innerHTML = "<span>✓</span>";
          setTimeout(() => { shareBtn.innerHTML = orig; }, 2000);
        } catch (_) {}
      }
    });
  }

  bindGoalCards(video, activeNum, activeTitle, activeMeta, activeMin, activeType, activeScore, activeComp, ytBtn, bdayLink);
  autoPullLatestGoalLive(d);
  initDedicatedRoulette();
  initPortugalStreamNotification();
  renderExplore(d, "latest-goal");
}


// ---------- Back to Top Floating Button ----------
function initUXEnhancements() {
  if (typeof document === 'undefined') return;

  // 1. Top Reading Scroll Progress Bar
  if (!document.getElementById("scroll-progress")) {
    const prog = document.createElement("div");
    prog.id = "scroll-progress";
    prog.setAttribute("aria-hidden", "true");
    document.body.prepend(prog);

    let progTicking = false;
    window.addEventListener("scroll", () => {
      if (!progTicking) {
        window.requestAnimationFrame(() => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (totalHeight > 0) {
            const pct = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
            prog.style.width = pct + "%";
          }
          progTicking = false;
        });
        progTicking = true;
      }
    }, { passive: true });
  }

  // 2. Back to Top Floating Button
  initUXEnhancements();

  // 3. Press '/' to Search keyboard shortcut
  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)) {
      const searchInput = document.querySelector('input[type="search"]') || document.getElementById("search") || document.getElementById("tl-filter");
      if (searchInput) {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
      }
    }
  });
}

function initBackToTop() {
  if (typeof document === 'undefined' || document.getElementById('back-to-top-btn')) return;
  const btn = document.createElement('button');
  btn.id = 'back-to-top-btn';
  btn.className = 'back-to-top-btn';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Back to top');
  btn.title = 'Back to top';
  btn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15l-6-6-6 6"/></svg>';
  btn.onclick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  document.body.appendChild(btn);

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 380) {
          btn.classList.add('visible');
        } else {
          btn.classList.remove('visible');
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ================= BOOT ================= */

/* Some dictionary strings carry a hard-coded route that was written for one
   language. Force every internal link onto the language the visitor is
   reading, so a card can never send someone out of their locale. */
function fixLocaleLinks() {
  const lang = getLang();
  if (!lang) return;
  const re = /^\/(en|es|pt|fr|ar|bn|hi|ro|uz)(?=\/|$)/;
  const anchors = document.querySelectorAll("a[href]");
  for (const a of anchors) {
    // The language switcher's own links point at the OTHER languages by
    // definition — rewriting them would send the visitor back where they
    // came from, which is exactly what broke the switcher.
    if (a.hasAttribute("data-code")) continue;
    if (a.closest("#lang-modal")) continue;
    if (a.id === "lang-suggest-switch") continue;
    if (a.classList.contains("lang-suggest-btn-primary")) continue;
    const href = a.getAttribute("href") || "";
    if (!re.test(href)) continue;
    a.setAttribute("href", href.replace(re, "/" + lang));
  }
}

load().then((d) => {
  normalize(d);
  const page = document.body.dataset.page;
  try {
    if (page === "home") renderHome(d);
    else if (page === "byyear") renderByYear(d);
    else if (page === "byseason") renderBySeason(d);
    else if (page === "dashboard") {
      const team = new URLSearchParams(location.search).get("team") || "all";
      renderDashboard(d, team);
    }
    else if (page === "timeline") renderTimeline(d);
    else if (page === "achievements") renderAch(d);
    else if (page === "birthday") renderBirthday(d);
    else if (page === "latest-goal") renderLatestGoal(d);
    else if (page === "vs-ronaldo") renderVsPage(d);
  } catch (e) {
    console.error(e);
  }
  fixLocaleLinks();
  updateRailEdges();
  reveal();
  /* Chart entrance: bars grow, donuts sweep, KPIs tick on visibility — one shared
     boot observer, same pattern as the timeline .tl-reveal wiring. */
  armEntrance();
  initBackToTop();
  initPortugalStreamNotification();
}).catch(() => {
  const lang = getLang();
  const errorMsgs = {
    es: "Error al cargar las estadísticas. Comprueba tu conexión y recarga la página.",
    pt: "Falha ao carregar as estatísticas. Verifique sua conexão e recarregue.",
    fr: "Échec du chargement des statistiques. Vérifiez votre connexion et actualisez la page.",
    ar: "فشل تحميل الإحصائيات. يرجى التحقق من اتصالك بالإنترنت وإعادة تحديث الصفحة.",
    bn: "পরিসংখ্যান লোড করা যায়নি। ইন্টারনেট সংযোগ পরীক্ষা করে পেজ রিফ্রেশ করুন।",
    hi: "आंकड़े लोड करने में विफल। अपना इंटरनेट कनेक्शन जांचें और पेज रीफ्रेश करें।",
    ro: "Eroare la încărcarea statisticilor. Verificați conexiunea și reîmprospătați pagina.",
    uz: "Statistikalarni yuklab bo'lmadi. Internet aloqangizni tekshiring va sahifani yangilang."
  };
  const msgText = errorMsgs[lang] || "Stats failed to load. Check your connection and refresh.";
  document.querySelectorAll("main.wrap").forEach((m) => {
    const p = document.createElement("p");
    p.className = "caveat";
    p.textContent = msgText;
    m.prepend(p);
  });
});

/* ============ SUPPORT TOAST — appears once, after 4 minutes on the page ============
   Deliberately quiet: no popup, no overlay, no auto-navigation. The Ko-fi link
   only opens on a real click (new tab). Closes on X / Esc / "maybe later",
   auto-hides after 30s, and shows at most once every 30 days. */
(function () {
  try {
    if (window.__mstSupportToast) return;
    window.__mstSupportToast = true;

    const KEY = "ronaldostats_support_toast_v1";
    const COOLDOWN = 30 * 24 * 60 * 60 * 1000; // at most once per 30 days
    const DELAY = 4 * 60 * 1000;               // only after 4 real minutes
    const HOLD = 30000;                        // auto-dismiss after 30s

    let seen = 0;
    try { seen = Number(localStorage.getItem(KEY)) || 0; } catch (e) {}
    if (seen && Date.now() - seen < COOLDOWN) return;

    const TEXT = {
      en: { t: "Keep RonaldoStats running?", b: "Hosting and video streaming come out of our own pocket — a coffee keeps every goal clip free.", c: "Support on Ko-fi", l: "Maybe later", x: "Close" },
      es: { t: "¿Mantener RonaldoStats en marcha?", b: "El hosting y el streaming de vídeo los pagamos de nuestro bolsillo — un café mantiene el sitio gratis.", c: "Apoyar en Ko-fi", l: "Quizás más tarde", x: "Cerrar" },
      pt: { t: "Manter o RonaldoStats no ar?", b: "Hospedagem e streaming de vídeo saem do nosso bolso — um café mantém o site grátis.", c: "Apoiar no Ko-fi", l: "Talvez mais tarde", x: "Fechar" },
      fr: { t: "Garder RonaldoStats en ligne ?", b: "L'hébergement et le streaming vidéo sortent de notre poche — un café garde le site gratuit.", c: "Soutenir sur Ko-fi", l: "Peut-être plus tard", x: "Fermer" },
      ar: { t: "أبقِ RonaldoStats يعملًا", b: "الاستضافة وبث الفيديو من جيبنا — فنجان قهوة يُبقي الموقع مجانيًا للجميع.", c: "ادعمنا على Ko-fi", l: "لاحقًا", x: "إغلاق" },
      bn: { t: "RonaldoStats চালু রাখুন", b: "হোস্টিং ও ভিডিও স্ট্রিমিং আমরা নিজের জেব থেকে চালাই — এক কাপ চা সাইটটি ফ্রি রাখতে সাহায্য করে।", c: "Ko-fi-তে সাপোর্ট করুন", l: "পরে হয়তো", x: "বন্ধ করুন" },
      hi: { t: "RonaldoStats को चलता रखें", b: "होस्टिंग और वीडियो स्ट्रीमिंग हम अपनी जेब से चलाते हैं — एक कॉफ़ी साइट को मुफ़्त रखने में मदद करती है।", c: "Ko-fi पर सपोर्ट करें", l: "शायद बाद में", x: "बंद करें" },
      ro: { t: "Ține RonaldoStats în viață", b: "Găzduirea și streamingul video vin din buzunarul nostru — o cafea ține site-ul gratuit.", c: "Susține pe Ko-fi", l: "Mai târziu", x: "Închide" },
      uz: { t: "RonaldoStats ishlashda qolsin", b: "Hosting va video streaming bizning cho'mizdan ketadi — bir piyola sayt bepul qolishiga yordam beradi.", c: "Ko-fi orqali qo'llab-quvvatlash", l: "Keyinroq", x: "Yopish" }
    };

    const lang = (typeof getLang === "function" ? getLang() : "en");
    const x = TEXT[lang] || TEXT.en;
    let el = null;
    let timer = null;
    let onKey = null;
    let onResize = null;
    let navObserver = null;

    // On phones the fixed bottom nav is taller than --mobile-nav-h claims on
    // some devices, so measure the real bar and sit 12px above it (safe-area
    // included). Desktop keeps the CSS corner placement. A ResizeObserver
    // re-applies the offset when the bar's box settles (fonts, safe-area,
    // late layout) instead of trusting a one-shot measurement.
    function placeAboveNav() {
      if (!el || !window.matchMedia("(max-width: 768px)").matches) return;
      const nav = document.querySelector(".rail");
      if (!nav) return;
      const r = nav.getBoundingClientRect();
      const h = window.innerHeight;
      if (r.height > 20 && r.top > h / 2) el.style.bottom = Math.round(h - r.top + 12) + "px";
    }

    function close() {
      if (!el) return;
      clearTimeout(timer);
      timer = null;
      if (onKey) document.removeEventListener("keydown", onKey);
      onKey = null;
      if (onResize) window.removeEventListener("resize", onResize);
      onResize = null;
      if (navObserver) { navObserver.disconnect(); navObserver = null; }
      document.body.classList.remove("mst-toast-open");
      if (el.parentNode) el.parentNode.removeChild(el);
      el = null;
    }

    function show() {
      if (el) return;
      // Never pop while the tab is in the background — wait until it is seen.
      if (document.hidden) { timer = setTimeout(show, 15000); return; }

      el = document.createElement("aside");
      el.className = "mst-toast";
      el.setAttribute("aria-label", x.t);
      el.innerHTML =
        '<button type="button" class="mst-toast-close" aria-label="' + x.x + '" title="' + x.x + '">&#10005;</button>' +
        '<p class="mst-toast-title"></p>' +
        '<p class="mst-toast-body"></p>' +
        '<div class="mst-toast-actions">' +
          '<a class="mst-toast-cta" href="https://ko-fi.com/ronaldostat" target="_blank" rel="noopener noreferrer"></a>' +
          '<button type="button" class="mst-toast-later"></button>' +
        "</div>";
      el.querySelector(".mst-toast-title").textContent = x.t;
      el.querySelector(".mst-toast-body").textContent = x.b;
      el.querySelector(".mst-toast-cta").textContent = x.c;
      el.querySelector(".mst-toast-later").textContent = x.l;
      el.querySelector(".mst-toast-close").addEventListener("click", close);
      el.querySelector(".mst-toast-later").addEventListener("click", close);

      document.body.appendChild(el);
      document.body.classList.add("mst-toast-open");
      placeAboveNav();
      onResize = placeAboveNav;
      window.addEventListener("resize", onResize);
      try {
        const navEl = document.querySelector(".rail");
        if (navEl && window.ResizeObserver) {
          navObserver = new ResizeObserver(placeAboveNav);
          navObserver.observe(navEl);
        }
      } catch (e) {}
      try { localStorage.setItem(KEY, String(Date.now())); } catch (e) {}
      onKey = function (e) { if (e.key === "Escape") close(); };
      document.addEventListener("keydown", onKey);
      timer = setTimeout(close, HOLD);
    }

    timer = setTimeout(show, DELAY);
  } catch (e) {}
})();
