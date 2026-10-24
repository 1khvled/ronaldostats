/**
 * Template-driven narrative copy for latest-goal.html (all 9 languages).
 *
 * Why this exists: the previous syncer only did one-hop literal string swaps
 * ("against San Diego FC" -> new opponent). Once a page mentioned a newer
 * opponent, every regex stopped matching and the page silently froze at an
 * old goal number. These templates are rebuilt from latest-goal.json on every
 * run instead, so the copy can never drift.
 *
 * Every string is filled from JSON facts only - never hardcode a number here.
 */

const EN_MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function ordinal(n, lang = "en") {
  if (lang === "bn") return `${bnDigits(n)}তম`;
  const v = Number(n);
  const rem100 = v % 100;
  if (rem100 >= 11 && rem100 <= 13) return `${v}th`;
  switch (v % 10) {
    case 1: return `${v}st`;
    case 2: return `${v}nd`;
    case 3: return `${v}rd`;
    default: return `${v}th`;
  }
}

/** Latin digits -> Bengali digits (bn pages render numerals in Bengali). */
export function bnDigits(s) {
  return String(s).replace(/[0-9]/g, (d) => "০১২৩৪৫৬৭৮৯"[Number(d)]);
}

/** "3-0" -> { a:3, b:0, word:"win"|"draw"|"loss", dash:"3–0" } */
export function scoreResult(score) {
  const m = String(score || "").match(/(\d+)\s*[-–:]\s*(\d+)/);
  if (!m) return { a: null, b: null, word: "match", dash: String(score || "") };
  const a = Number(m[1]);
  const b = Number(m[2]);
  const word = a > b ? "win" : a < b ? "loss" : "draw";
  return { a, b, word, dash: `${a}–${b}` };
}

/** Minute "71'" -> 71 */
export function minuteNum(minute) {
  const m = String(minute || "").match(/(\d+)/);
  return m ? Number(m[1]) : null;
}

function lowerFirst(s) {
  const str = String(s || "");
  return str ? str.charAt(0).toLowerCase() + str.slice(1) : str;
}

function fill(tpl, map) {
  return String(tpl).replace(/\{(\w+)\}/g, (whole, key) => (key in map && map[key] !== undefined && map[key] !== null ? String(map[key]) : whole));
}

/**
 * @returns per-language block strings, all derived from `g` + totals.
 */
export function buildNarrative({ g, seniorGoals, apps, miamiGoals, intlGoals, goalsNeeded, lang, compLoc, techLowerLoc, bdayLabel }) {
  const R = scoreResult(g.score);
  const minN = minuteNum(g.minute);
  const minOrd = minN ? ordinal(minN) : g.minute;
  const teamIsMiami = /Inter Miami/i.test(g.team || "");
  const opp = g.opponent;
  const dateEn = g.formattedDate;
  const venue = g.venue;
  const title = g.title;

  // Localized strings handed in by the syncer (it already owns TECH_WORDS etc.)
  const comp = compLoc || g.competition;
  const techLower = techLowerLoc || lowerFirst(g.finish || "");

  // "his 102nd goal for Inter Miami" / "his 126th goal for Argentina"
  const clubName = teamIsMiami ? "Inter Miami" : "Argentina";
  const clubGoalsN = teamIsMiami ? miamiGoals : intlGoals;

  const MONTHS = MONTH[lang] || EN_MONTHS;
  const dateLoc = lang === "en" ? dateEn : String(dateEn).replace(/([A-Za-zÀ-ÿ\u0600-\u06FF\u0980-\u09FF\u0900-\u097F]+)/g, (w) => {
    const i = EN_MONTHS.indexOf(w);
    return i >= 0 ? MONTHS[i] : w;
  });

  const RW = {
    win: { en: "win", es: "victoria", pt: "vitória", fr: "victoire", },
    draw: { en: "draw", es: "empate", pt: "empate", fr: "match nul", },
    loss: { en: "defeat", es: "derrota", pt: "derrota", fr: "défaite", },
  };
  const rw = (RW[R.word] && RW[R.word][lang]) || RW[R.word].en;

  const teamClauseFn = teamClause[lang] || teamClause.en;
  // Only English takes a Latin ordinal suffix; bn has its own, everything
  // else uses the bare number (es/pt/fr/hi/ar/ro/uz supply their own suffix).
  const ordN = (n) => (lang === "en" || lang === "bn" ? ordinal(n, lang) : String(n));
  const res = {
    N: seniorGoals,
    apps: apps.toLocaleString("en-US"),
    appsLoc: fmtApps(apps, lang),
    date: dateLoc,
    dateEn,
    opp,
    comp,
    min: g.minute,
    minOrd: minN ? ordinal(minN, lang) : g.minute,
    tech: g.finish || "",
    techLower,
    score: R.dash,
    venue,
    team: g.team,
    rw,
    needed: goalsNeeded,
    club: clubLoc(lang, clubName),
    matchTitle: String(title).replace(/-/g, "\u2013"),
    clubN: clubGoalsN,
    bdayLabel,
    teamClause: teamClauseFn({ n: clubGoalsN, ord: ordN(clubGoalsN), club: clubLoc(lang, clubName) }),
  };

  const T = COPY[lang] || COPY.en;
  // Latin ordinal suffixes (71st) only read correctly in English; every other
  // language takes the bare number. bn renders its own ordinal (৭১তম).
  const minOrdOut = lang === "en" ? ordinal(minN, lang) : lang === "bn" ? bnDigits(`${minN}তম`) : String(minN);
  // bn pages render numerals in Bengali; convert only the filled prose,
  // never the localized month names (they are already Bengali text).
  const localizeNum = (s) => (lang === "bn" ? bnDigits(s) : s);
  const pick = (k) => localizeNum(fill(T[k], { ...res, minOrd: minOrdOut }));
  return {
    desc: pick("desc"),
    videoName: pick("videoName"),
    videoDesc: pick("videoDesc"),
    todayDesc: pick("todayDesc"),
    faqScoredToday: pick("faqScoredToday"),
    faqWhenScored: pick("faqWhenScored"),
    faqGoalNumber: pick("faqGoalNumber"),
    faq1000: pick("faq1000"),
    analysis: pick("analysis"),
    recentLine: pick("recentLine"),
    bdayLink: pick("bdayLink"),
    milestoneH2: pick("milestoneH2"),
    seasonBadge: comp,
  };
}

function locLangKey(lang) { return lang; }

function fmtApps(apps, lang) {
  const s = String(apps);
  if (lang === "fr") return s.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function clubLoc(lang, club) {
  const map = {
    en: { "Inter Miami": "Inter Miami", Argentina: "Argentina" },
    es: { "Inter Miami": "el Inter Miami", Argentina: "Argentina" },
    pt: { "Inter Miami": "o Inter Miami", Argentina: "a Argentina" },
    fr: { "Inter Miami": "l'Inter Miami", Argentina: "l'Argentine" },
  };
  return (map[lang] && map[lang][club]) || club;
}

const teamClause = {
  en: ({ n, club }) => `his ${ordinal(n)} goal for ${club}`,
  es: ({ n, ord, club }) => `su gol número ${ord} con ${club}`,
  pt: ({ n, ord, club }) => `seu gol número ${ord} com ${club}`,
  fr: ({ n, ord, club }) => `son but n°${ord} avec ${club}`,
};

const MONTH = {
  en: EN_MONTHS,
  es: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
  pt: ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"],
  fr: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
};

const COPY = {
  en: {
    desc: "Did Ronaldo score today? Check Cristiano Ronaldo's goal today status, match result, and HD video replay of Goal #{N} vs {opp}. Live 2026 match tracker & recent goal stats.",
    videoName: "Cristiano Ronaldo Last Goal: Goal #{N} vs {opp} ({date})",
    videoDesc: "Watch Cristiano Ronaldo score Goal #{N} of his career ({teamClause}) against {opp} in {comp} on {date}.",
    todayDesc: "Did Cristiano Ronaldo score a goal today? Ronaldo's most recent official fixture took place on <b>{date}</b> in {comp}, where he scored <b>Goal #{N}</b> of his career ({teamClause}) in the {minOrd} minute with a {techLower} in a {score} {rw} vs {opp}. Stream the official goal video directly below or follow live updates whenever Inter Miami or Argentina kicks off.",
    faqScoredToday: "Cristiano Ronaldo's most recent official match was on {date} in {comp}, where he scored Goal #{N} ({teamClause}) with a {minOrd}-minute {techLower} in a {score} {rw} vs {opp}. If Inter Miami or Argentina plays today, our live tracker updates in real time.",
    faqWhenScored: "Cristiano Ronaldo scored his last goal on {date} at {venue} against {opp} ({score}) in {comp}.",
    faqGoalNumber: "Ronaldo's last official goal was Goal #{N} of his senior career ({teamClause}), bringing his verified all-time tally to {N} senior goals in {apps} appearances.",
    faq1000: "Cristiano Ronaldo currently has {N} official senior career goals, meaning he needs exactly {needed} more goals to reach the historic 1,000-goal milestone.",
    analysis: "Cristiano Ronaldo continues to set world football benchmarks in 2026. His latest strike against {opp} in {comp} at {venue} brought his career tally to an astonishing <b>{N} senior goals</b> ({teamClause}) across {apps} appearances for Barcelona, PSG, Inter Miami and Argentina.",
    recentLine: "<b>#{N}:</b> {date} — {matchTitle} ({min}, {techLower})",
    milestoneH2: "Milestones Unlocked by Goal #{N}",
    bdayLink: "View {bdayLabel} Goals &rarr;",
  },
  es: {
    desc: "¿Ronaldo marcó hoy? Consulta el último gol de Cristiano Ronaldo, el resultado del partido y el vídeo en HD del Gol #{N} vs {opp}.",
    videoName: "Último gol de Cristiano Ronaldo: Gol #{N} vs {opp} ({date})",
    videoDesc: "Mira a Cristiano Ronaldo marcar el Gol #{N} de su carrera ({teamClause}) ante {opp} en {comp} el {date}.",
    todayDesc: "<b>¿Ha marcado Cristiano Ronaldo hoy?</b> El último partido oficial de Cristiano Ronaldo se jugó el <b>{date}</b> en {comp}, donde marcó el <b>Gol #{N}</b> de su carrera ({teamClause}) en el minuto {minOrd} con un/a {techLower} en una {rw} {score} vs {opp}.",
    faqScoredToday: "El último partido oficial de Cristiano Ronaldo fue el {date} en {comp}, donde marcó el Gol #{N} ({teamClause}) con un/a {techLower} en el minuto {minOrd} en una {rw} {score} vs {opp}.",
    faqWhenScored: "Cristiano Ronaldo marcó su último gol el {date} en {venue} contra {opp} ({score}) en {comp}.",
    faqGoalNumber: "El último gol oficial de Ronaldo fue el Gol #{N} de su carrera profesional ({teamClause}), elevando su total verificado a {N} goles en {apps} partidos.",
    faq1000: "Cristiano Ronaldo tiene actualmente {N} goles oficiales en su carrera, por lo que necesita exactamente {needed} goles más para alcanzar la histórica cifra de 1.000.",
    analysis: "Cristiano Ronaldo sigue marcando hitos del fútbol mundial en 2026. Su último tanto ante {opp} en {comp}, en {venue}, elevó su cuenta a unos asombrosos <b>{N} goles</b> ({teamClause}) en {apps} partidos con Barcelona, PSG, Inter Miami y Argentina.",
    recentLine: "<b>#{N}:</b> {date} — {matchTitle} ({min}, {techLower})",
    milestoneH2: "Hitos desbloqueados con el Gol #{N}",
    bdayLink: "Ver goles del {bdayLabel} &rarr;",
  },
  pt: {
    desc: "O Ronaldo marcou hoje? Confira o último gol do Cristiano Ronaldo, o resultado e o vídeo em HD do Gol #{N} vs {opp}.",
    videoName: "Último gol do Cristiano Ronaldo: Gol #{N} vs {opp} ({date})",
    videoDesc: "Veja o Cristiano Ronaldo marcar o Gol #{N} da carreira ({teamClause}) contra o {opp} em {comp} no dia {date}.",
    todayDesc: "<b>O Cristiano Ronaldo marcou hoje?</b> O último jogo oficial do Cristiano Ronaldo foi em <b>{date}</b>, em {comp}, quando marcou o <b>Gol #{N}</b> da carreira ({teamClause}) no minuto {minOrd}, de {techLower}, em uma {rw} de {score} contra o {opp}.",
    faqScoredToday: "O último jogo oficial do Cristiano Ronaldo foi em {date}, em {comp}, onde marcou o Gol #{N} ({teamClause}) de {techLower} no minuto {minOrd}, em uma {rw} de {score} contra o {opp}.",
    faqWhenScored: "O Cristiano Ronaldo marcou seu último gol em {date}, no {venue}, contra o {opp} ({score}), em {comp}.",
    faqGoalNumber: "O último gol oficial do Ronaldo foi o Gol #{N} de sua carreira ({teamClause}), levando seu total verificado a {N} gols em {apps} jogos.",
    faq1000: "O Cristiano Ronaldo tem atualmente {N} gols oficiais na carreira, ou seja, precisa exatamente de mais {needed} gols para alcançar a histórica marca de 1.000.",
    analysis: "O Cristiano Ronaldo continua marcando marcos do futebol mundial em 2026. Sua última golada contra o {opp} em {comp}, no {venue}, levou sua conta a um surpreendente <b>{N} gols</b> ({teamClause}) em {apps} jogos por Barcelona, PSG, Inter Miami e Argentina.",
    recentLine: "<b>#{N}:</b> {date} — {matchTitle} ({min}, {techLower})",
    milestoneH2: "Marcos históricos do Gol #{N}",
    bdayLink: "Ver gols de {bdayLabel} &rarr;",
  },
  fr: {
    desc: "Regardez la vidéo du dernier but de Cristiano Ronaldo et vérifiez s'il a marqué aujourd'hui. Résumé du match, statistiques et vidéo du But n°{N} face à {opp}.",
    videoName: "Dernier but de Cristiano Ronaldo : But n°{N} face à {opp} ({date})",
    videoDesc: "Regardez Cristiano Ronaldo marquer le But n°{N} de sa carrière ({teamClause}) face à {opp} en {comp} le {date}.",
    todayDesc: "<b>Ronaldo a-t-il marqué aujourd'hui ?</b> Le match officiel le plus récent de Cristiano Ronaldo s'est déroulé le <b>{date}</b> en {comp}, où il a inscrit le <b>But n°{N}</b> de sa carrière ({teamClause}) à la {minOrd} minute, d'un {techLower}, dans une {rw} {score} contre {opp}.",
    faqScoredToday: "Le match officiel le plus récent de Cristiano Ronaldo a eu lieu le {date} en {comp}, où il a inscrit le But n°{N} ({teamClause}) d'un {techLower} à la {minOrd} minute, dans une {rw} {score} contre {opp}.",
    faqWhenScored: "Cristiano Ronaldo a marqué son dernier but le {date} au {venue} contre {opp} ({score}) en {comp}.",
    faqGoalNumber: "Le dernier but officiel de Ronaldo était le But n°{N} de sa carrière chez les professionnels ({teamClause}), portant son total à {N} buts en {appsLoc} matchs.",
    faq1000: "Cristiano Ronaldo compte actuellement {N} buts officiels chez les seniors, il ne lui manque donc que {needed} buts pour franchir la barre mythique des 1 000 buts.",
    analysis: "Cristiano Ronaldo continue de fixer les standards du football mondial en 2026. Son dernier but contre {opp} en {comp}, au {venue}, porte son total à un bluffant <b>{N} buts</b> ({teamClause}) en {appsLoc} matchs avec Barcelone, le PSG, Miami et l'Argentine.",
    recentLine: "<b>#{N}:</b> {date} — {matchTitle} ({min}, {techLower})",
    milestoneH2: "Records débloqués par le But #{N}",
    bdayLink: "Voir les buts du {bdayLabel} &rarr;",
  },
};


/** Competition label per language; falls back to the raw JSON value. */
const COMP_LABELS = {
  en: {},
  es: { "International Friendly": "Amistoso Internacional" },
  pt: { "International Friendly": "Amistoso Internacional" },
  fr: { "International Friendly": "Match amical international" },
};

export function compLabel(comp, lang) {
  return (COMP_LABELS[lang] && COMP_LABELS[lang][comp]) || comp;
}
