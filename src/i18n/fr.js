// FR dictionary — RonaldoStats
// Extracted verbatim from the original inline dictionaries by
// scripts/refactor-i18n.mjs. Structure is identical across all 9 languages.
// Copy rewritten for Cristiano Ronaldo (RonaldoStats, https://www.ronaldostats.site).
// Numbers follow the verified dataset in public/data/ronaldo-data.json and the
// canonical Ronaldo fact list; provisional splits keep their caveat wording.

export const HOME = {
    locale: "fr-FR",
    shirt10: "Numéro 7",
    head: (t, p, d) => `<b>${n(t.goals)} buts</b> en <b>${n(t.apps)} apparitions en équipe première</b> — pour Sporting CP, Manchester United, Real Madrid, Juventus et ${esc(p.current.join(" et "))}. Champion d'Europe et lauréat cinq fois du Ballon d'Or, comptés à la main et vérifiés deux fois, au ${esc(d.lastUpdated)}.`,
    meta: (p, dob) => `${esc(p.name)}, né le ${dob} à ${esc(p.birthplace)}. Il a ${p.age} ans, joue comme ${esc(p.position.toLowerCase() === "forward" ? "attaquant" : p.position.toLowerCase())} et évolue actuellement à ${esc(p.current.join(" et "))}.`,
    roleLabel: "Rôle",
    teamsLabel: "Équipes",
    nowLabel: "Aujourd'hui",
    kpiCareer: "Buts en carrière",
    kpiCareerNote: (gpg, seasons) => `${gpg} buts par match sur ${seasons} saisons en club.`,
    kpiApps: "Apparitions en équipe première",
    kpiAppsNote: (clubs, country) => `${clubs} en club, ${country} avec le Portugal.`,
    kpiArg: "Buts avec le Portugal",
    kpiArgNote: (gpg, caps) => `${gpg} par sélection sur ${caps} sélections.`,
    kpiTrophies: "Trophées collectifs",
    kpiTrophiesNote: (lang) => `Plus <b>5 Ballons d'Or</b> et <b>4 souliers d'or européens</b>. <a href="/${lang}/achievements">Palmarès complet</a>.`,
    kpiRoad: "Route vers les 1 000 buts",
    kpiRoadNote: (togo, projYear, pace) => `Encore ${togo} buts. Projection grossière au rythme actuel (~${pace.toFixed(0)} par an) : les 1 000 buts tombent vers ${projYear}.`,
    copyStatsBtn: "Copier les chiffres clés",
    copyText: (goals, apps, clubGoals, argGoals, updated) => `Ronaldo : ${goals} buts en ${apps} matchs en équipe première (${clubGoals} en club, ${argGoals} avec le Portugal), ${LIVE.trophies} trophées collectifs en équipe première, 5 Ballons d'Or — au ${updated}.`,
    copyMsg: "Copié — à coller n'importe où.",
    clubCaption: (updated, lang) => `Matchs et buts pour chaque équipe première où Cristiano Ronaldo a joué, au ${updated}. Le détail par compétition est sur la <a href="/${lang}/goalsbyseason">page des buts par saison</a>.`,
    thTeam: "Équipe et années",
    thApps: "Matchs",
    thGoals: "Buts",
    thGpg: "Buts par match",
    thTotal: "Total carrière",
    yearSub: "Choisissez une année et regardez le total grimper — de ses débuts en 2002 jusqu'à aujourd'hui.",
    yearTitle: "Statistiques de Ronaldo par année civile",
    yearLabel: "Année",
    yearFigcap: (start, cur, prov, lang) => `Buts par année civile, de ${start} à ${cur}${prov ? " (en cours)" : ""} — avec un pic à 69 en 2013. <a href="/${lang}/goalsbyyear">Ouvrir le tableau complet</a>.`,
    tileGoals: (year, prov) => `Buts en ${year}${prov ? " (à ce jour)" : ""}`,
    tileTotal: (year) => `Total carrière après ${year}`,
    tileAge: (year) => `Âge en ${year}`,
    records: (best, post30, pct) => [
      [`69`, `<b>Buts en 2013</b>, le plus grand nombre qu'il ait marqué sur une année civile — ${best.goals} toutes compétitions confondues.`],
      [`5`, `<b>Ballons d'Or</b> (2008, 2013, 2014, 2016, 2017) — avec quatre souliers d'or européens.`],
      [`311`, `<b>Buts en La Liga</b> avec le Real Madrid, le record absolu de la compétition.`],
      [`140`, `<b>Buts en Ligue des champions</b> en 183 apparitions, le record de l'histoire de la compétition.`],
      [post30, `<b>Buts depuis ses 30 ans</b> — environ ${pct} % de son total de carrière, marqués à partir de 2015.`],
      [`66`, `<b>Triplés ou plus</b> en club et en sélection sur toute sa carrière professionnelle (décompte provisoire).`],
      [`${LIVE.trophies}`, `<b>Trophées collectifs</b> — 32 en club et 3 avec le Portugal.`]
    ],
    silverCaption: () => `${LIVE.trophies} titres collectifs en équipe première, club par club, plus les principales distinctions individuelles. Certains médias annoncent 36–37 parce qu'ils comptent la Super Coupe UEFA et les super-coupes nationales différemment — la liste détaillée ci-dessous totalise ${LIVE.trophies}.`,
    silverThTrophy: "Trophée",
    silverThTimes: "Nombre",
    silverThNote: "Détail",
    silverRows: [
      ["Trophées collectifs — Real Madrid", "15", "De 2009 à 2018, dont 4 Ligues des champions"],
      ["Trophées collectifs — Manchester United", "9", "De 2003 à 2009, dont la Ligue des champions et la Coupe du monde des clubs 2008"],
      ["Trophées collectifs — Juventus", "5", "Serie A deux fois, la Coppa Italia et 2 Supercoppa Italiana"],
      ["Trophées collectifs — Portugal", "3", "Euro 2016, Ligue des nations 2019 et 2025"],
      ["Trophées collectifs — Al Nassr", "2", "Coupe des clubs champions arabes 2023, Saudi Pro League 2026"],
      ["Trophées collectifs — Sporting CP", "1", "Supertaça Cândido de Oliveira 2002"],
      ["Ballon d'Or", "5", "2008, 2013, 2014, 2016, 2017"]
    ],
    splitFk: "Buts sur coup franc",
    splitFkNote: "Coups francs enroulés en club et en sélection (décompte provisoire compilé).",
    splitPen: "Buts sur penalty",
    splitPenNote: "Un peu moins d'un but sur cinq au total (décompte provisoire compilé).",
    splitHt: "Triplés ou plus",
    splitHtNote: "Matchs à trois buts ou plus, toutes compétitions.",
    splitCaveat: (tot) => `Les répartitions (coups francs, penalties, parties du corps) reposent sur un décompte compilé largement publié — provisoire jusqu'à la fin d'un décompte manuel match par match. Le total de ${tot} n'en est pas affecté.`,
    faq: (t, agg, m, d, lang) => [
      ["Combien de buts Cristiano Ronaldo a-t-il marqués en carrière au total ?", `<b>${n(t.goals)} buts officiels en carrière</b> en ${n(t.apps)} apparitions en équipe première, en club et en sélection, au ${esc(d.lastUpdated)}, soit une moyenne de ${t.goalsPerGame} buts par match. Parcourez son <a href="/${lang}/goalsbyyear">détail annuel de ses buts</a>.`],
      ["Combien de passes décisives Cristiano Ronaldo a-t-il enregistrées en carrière ?", `Cristiano Ronaldo totalise <b>${n(LIVE.assists)} passes décisives officielles</b> — le décompte compilé largement publié — et <b>${n(LIVE.tmAssists)} passes</b> selon les critères élargis de Transfermarkt, en ${n(t.apps)} apparitions. Le détail : ${n(d.totals?.assists?.byTeam?.real_madrid?.official || 152)} avec le Real Madrid, ${n(d.totals?.assists?.byTeam?.manchester_united?.official || 66)} avec Manchester United, ${n(d.totals?.assists?.byTeam?.juventus?.official || 20)} avec la Juventus, ${n(d.totals?.assists?.byTeam?.al_nassr?.official || 9)} avec Al Nassr et ${n(d.totals?.assists?.byTeam?.portugal?.official || 14)} avec le Portugal.`],
      ["Quels sont les totaux de buts et de passes de Cristiano Ronaldo ?", `Sur l'ensemble de sa carrière, Cristiano Ronaldo a cumulé <b>${n(LIVE.ga)} contributions offensives officielles</b> (<b>${n(t.goals)} buts</b> et <b>${n(LIVE.assists)} passes décisives officielles</b>) en ${n(t.apps)} apparitions — soit <b>0.93 implication directe dans un but par match</b>. Selon les critères de Transfermarkt, le total s'établit à <b>${n(LIVE.tmGa)} implications dans un but</b> (${n(t.goals)} buts + ${n(LIVE.tmAssists)} passes).`],
      ["Qui a les meilleurs chiffres de l'histoire, Ronaldo ou Messi ?", `Sur les matchs officiels en équipe première, <b>Cristiano Ronaldo</b> détient le record absolu de buts marqués avec <b>${n(t.goals)} buts</b> et ${n(LIVE.assists)} passes en ${n(t.apps)} matchs (${t.goalsPerGame} buts par match), quand Messi compte <b>${n(LIVE.rGoals)} buts</b> et 408 passes en 1 181 matchs (0.79 but par match). Ronaldo a atteint ${n(t.goals)} buts en <b>159 matchs de moins</b>, possède ${LIVE.trophies} trophées collectifs contre ${LIVE.rTrophies} pour Messi, et 5 Ballons d'Or contre 8. Comparez leurs bilans complets sur notre <a href="/${lang}/ronaldo-vs-messi">page des statistiques Ronaldo vs Messi</a>.`],
      ["Comment les buts de Ronaldo se répartissent-ils par club en carrière ?", `<b>${n(t.clubs.goals)} buts en club</b> en ${n(t.clubs.apps)} matchs de club — ` + ["Real Madrid", "Manchester United", "Juventus", "Al Nassr", "Sporting CP"].map((c) => {
        const rows = (d.clubSeasons || []).filter((s) => s.club === c);
        const apps = rows.reduce((a, s) => a + s.apps, 0);
        const goals = rows.reduce((a, s) => a + s.goals, 0);
        return `${c} ${n(goals)} en ${n(apps)}`;
      }).join(" · ") + ` — plus <b>${n(t.country.goals)} buts</b> en ${n(t.country.apps)} sélections avec le Portugal. Voir les <a href="/${lang}/goalsbyseason">statistiques club saison par saison</a>.`],
      ["Combien de buts sur coups francs directs Ronaldo a-t-il marqués ?", `Cristiano Ronaldo a marqué <b>66 buts sur coups francs directs</b> en football professionnel, à quoi s'ajoutent <b>184 penalties sur 220 tentatives</b> et 731 buts en jeu ouvert — un décompte provisoire compilé, dans l'attente d'un décompte manuel complet.`],
      ["Combien de triplés Ronaldo a-t-il marqués ?", `Ronaldo a marqué <b>${n(d.hatTricks)} triplés en carrière</b> en club et en sélection (décompte provisoire), dont <b>10 avec le Portugal</b> — un record mondial pour un joueur international.`],
      ["Combien de buts sur penalty Ronaldo a-t-il marqués ?", `Ronaldo a marqué <b>184 buts sur penalty</b> en 220 tentatives, en club et en sélection — un taux de conversion de 83.6 %.`],
      ["Combien de buts hors penalty Cristiano Ronaldo a-t-il marqués ?", `Ronaldo a marqué <b>${n(t.goals - (m?.penalties || 184))} buts hors penalty</b> en ${n(t.apps)} apparitions (${((t.goals - (m?.penalties || 184)) / t.apps).toFixed(2)} but hors penalty par match) — 81 % de tout ce qu'il a marqué.`],
      ["Combien de buts Ronaldo a-t-il marqués en 2013 ?", `<b>69 buts officiels en 2013</b> (59 avec le Real Madrid et 10 avec le Portugal) — la plus grande année civile de sa carrière, et une année qui a vu un triplé avec le Portugal en 15 minutes contre l'Irlande du Nord. Consultez notre <a href="/${lang}/goalsbyyear">suivi des statistiques de 2013</a>.`],
      ["Combien de trophées Cristiano Ronaldo a-t-il remportés ?", `<b>${n(LIVE.trophies)} titres collectifs en équipe première</b> — 32 en club (Real Madrid 15, Manchester United 9, Juventus 5, Al Nassr 2, Sporting CP 1) et 3 avec le Portugal (Euro 2016, Ligue des nations 2019 et 2025), plus 5 Ballons d'Or. Certains médias annoncent 36–37 parce qu'ils comptent la Super Coupe UEFA et les super-coupes nationales différemment. Voir <a href="/${lang}/achievements">la liste complète des trophées</a>.`],
      ["Combien de Ballons d'Or Cristiano Ronaldo a-t-il remportés ?", `Cristiano Ronaldo a remporté <b>5 Ballons d'Or</b> (2008, 2013, 2014, 2016, 2017) — le premier en 2008, à 23 ans, lorsqu'il a été élu sur les 96 bulletins de vote.`],
      ["Quel est le bilan de Ronaldo au Real Madrid ?", `Le bilan de Ronaldo en El Clásico avec le Real Madrid — et tous les buts qu'il a marqués contre le Real Madrid sous un autre maillot — est réuni sur notre <a href="/${lang}/real-madrid">page de Ronaldo au Real Madrid</a>.`],
      ["Quelles sont les statistiques de Ronaldo en Ligue des champions ?", `Ronaldo a marqué <b>140 buts en 183 apparitions en Ligue des champions</b> — le record absolu de la compétition — avec <b>42 passes</b>, également un record, et a remporté 5 titres (2008, 2014, 2016, 2017, 2018). Consultez toutes les données sur notre <a href="/${lang}/champions-league">espace Ligue des champions</a>.`],
      ["Quelles sont les statistiques de Ronaldo en Coupe du monde ?", `Ronaldo a disputé <b>six Coupes du monde</b> (2006, 2010, 2014, 2018, 2022 et 2026) et reste le meilleur buteur de l'histoire du Portugal, avec <b>146 buts en 234 sélections</b> — le record absolu du football international, dans les deux catégories.`],
      ["Combien de buts séparent Cristiano Ronaldo de la barre des 1 000 ?", `Avec ${n(t.goals)} buts, Ronaldo a besoin de <b>${Math.max(0, 1000 - t.goals)} buts de plus</b> pour atteindre les 1 000 buts en carrière — un cap qu'aucun joueur n'a atteint en football professionnel officiel.`]
    ]
  };

export const BY_YEAR = {
    head: (ys, best, t) => `De son premier but en équipe première en ${ys[0].year} à <b>${best.goals} en ${best.year}</b> — chaque année civile d'une carrière qui a produit ${n(t.goals)} buts, avec les totaux cumulés et son âge.`,
    cap: (best, t) => `Barres : buts de l'année (pic ${best.goals}, ${best.year}). Courbe : la progression jusqu'à ${n(t.goals)}.`,
    chartLabel: (best) => `Buts de Ronaldo par année civile avec total cumulé de carrière, pic à ${best.goals} en ${best.year}`,
    kpiCareer: "Buts en carrière",
    kpiBest: "Meilleure année",
    kpiBestSub: "Le plus grand nombre de buts qu'il ait marqués sur une année civile.",
    kpiCurrSub: "Saison en cours.",
    kpiYears: "Années de buts",
    kpiYearsSub: (ys, last) => `Chaque année de ${ys[0].year} à ${last.year}.`,
    decades: "Buts dans les",
    tableSub: "Les plus récentes d'abord. 2026 est marquée d'un astérisque tant que la saison est en cours. Cliquez sur une colonne pour trier, ou tapez pour filtrer. Les années de pointe reçoivent une note de bas de page — survolez l'année.",
    caption: "Buts, total cumulé de carrière et âge pour chaque année civile depuis les débuts de Ronaldo en 2002.",
    thYear: "Année", thGoals: "Buts", thTotal: "Total carrière", thAge: "Âge",
    inProgNote: "* Saison 2026 en cours — actualisée après chaque match.",
    filterPlaceholder: "Filtrer les années — p. ex. 2013",
    bestYearHtml: (best) => `<p><b>${best.year} est l'année civile la plus prolifique de la carrière de Ronaldo : ${best.goals} buts</b> — 59 avec le Real Madrid et 10 avec le Portugal. Elle a apporté le deuxième Ballon d'Or, une saison de club à 55 buts et trois buts pour le Portugal en 15 minutes contre l'Irlande du Nord.</p><p>Les années suivantes — 2012 (63), 2014 (61) et 2011 (60) — montrent à quel niveau le standard est resté élevé pendant cinq saisons d'affilée, de 2010 à 2014. <a href="/fr/dashboard">Voir comment ces buts se répartissent par compétition</a>.</p>`
  };

export const BY_SEASON = {
    head: (best) => `Chaque saison en club de 2002/03 à 2026/27 — <b>record : ${best.goals} buts en ${best.season}</b> — avec le détail championnat, coupe et compétitions continentales, plus le Portugal année par année.`,
    clubSub: "Matchs / buts par format. 2026/27 est la saison en cours. Cliquez sur une colonne pour trier, ou tapez pour filtrer.",
    caption: (len) => `Les ${len} saisons en club : Sporting CP 2002/03, Manchester United 2003/04–2008/09 et 2021/22–2022/23, Real Madrid 2009/10–2017/18, Juventus 2018/19–2021/22, Al Nassr 2022/23–2026/27.`,
    thSeason: "Saison", thClub: "Club", thApps: "Matchs", thGoals: "Buts", thLeague: "Championnat", thCup: "Coupe", thCont: "Continental", thOther: "Autre",
    totalLabel: "Total en club", bestBadge: "Meilleure saison en club",
    filterClubPlaceholder: "Filtrer les saisons — p. ex. Real Madrid, 2012",
    countrySub: "Éliminatoires et tournois compétitifs, plus les matchs amicaux, les plus récents d'abord.",
    countryCaption: "Buts avec le Portugal par année civile, de 2003 à 2026.",
    thYear: "Année", thNote: "Note", totalArgLabel: "Total Portugal",
    filterCountryPlaceholder: "Filtrer les années du Portugal — p. ex. 2016",
    bestSeasonHtml: (best) => `<p><b>${best.season} — ${best.goals} buts en ${best.apps} matchs avec ${best.club}</b> — est la saison en club la plus prolifique de sa carrière : ${best.league.goals} en championnat, ${best.continental.goals} en Ligue des champions, ${best.cup.goals} en coupe et ${best.other.goals} en super-coupes. Il a marqué dans toutes les compétitions qu'il a disputées.</p><p>Elle effleure la saison légendaire de 2011/12 — 60 buts dont 46 en La Liga — au sein d'une série de six saisons madrilènes où il n'est jamais descendu sous les 51 buts en club. <a href="/fr/goalsbyyear">Les mêmes buts comptés par année civile</a>.</p>`
  };

export const DASH = {
  teamNames: { all: "toutes les équipes", real_madrid: "Real Madrid", manchester_united: "Manchester United", juventus: "Juventus", al_nassr: "Al Nassr", sporting_cp: "Sporting CP", portugal: "Portugal" },
  pills: [["all", "Toutes les équipes"], ["real_madrid", "Real Madrid"], ["manchester_united", "Manchester United"], ["juventus", "Juventus"], ["al_nassr", "Al Nassr"], ["sporting_cp", "Sporting CP"], ["portugal", "Portugal"]],
  head: (name) => `Chaque but de Ronaldo découpé quatre fois — par compétition, par saison, par type de finition et par partie du corps — filtré sur <b>${esc(name)}</b>. Touchez une équipe pour recouper tous les graphiques.`,
  filterNote: (name, goals, apps, T) => `Affichage ${name} : ${n(goals)} buts en ${n(apps)} matchs` + (T === "real_madrid" ? " (Ligue des champions : 140 buts en 183 apparitions avec 42 passes — les trois sont des records de la compétition)." : "."),
  kpis: { goals: "Buts", apps: "Apparitions", gpg: "Buts par match", forTeam: (name) => `Pour ${name}.` },
  chartEmpty: "Aucune ligne pour ce filtre d'équipe.",
  figCap: (T, name) => T === "all" ? "Années civiles, de 2002 à 2026." : ["portugal", "portugal_nt", "country"].includes(T) ? "Années civiles du Portugal." : "Saisons en club de " + esc(name) + ".",
  finishParts: { "Open play": "Jeu ouvert", "Penalties": "Penalties", "Free kicks": "Coups francs" },
  finishCenter: "buts en carrière",
  finishCaveat: "Totaux de carrière, toutes équipes confondues — aucune répartition par équipe n'existe. Décompte provisoire compilé.",
  finishCaveatFiltered: (d) => `Aucune répartition par équipe n'existe : ce graphique ne couvre donc que l'ensemble des équipes — voir les totaux de carrière ci-dessous. Les ${n(d.totals.goals)} buts de Ronaldo se répartissent en ${d.byFinish.openPlay} en jeu ouvert, ${d.byFinish.penalties} penalties et ${d.byFinish.freeKicks} coups francs (décompte provisoire compilé).`,
  bodyParts: { "Left foot": "Pied gauche", "Right foot": "Pied droit", "Head": "Tête", "Other": "Autre" },
  bodyCenter: "buts du pied droit",
  bodyCaveat: "Totaux de carrière, toutes équipes confondues — un décompte provisoire compilé, jusqu'à la fin d'un décompte manuel complet.",
  ageName: (r) => `Âge ${r.age} · ${r.year}`,
  ageCaveat: (apeak) => `Chaque but en équipe première selon l'âge où il l'a marqué — club et sélection confondus. Pic : ${apeak.goals} buts à ${apeak.age} ans (${apeak.year}).`,
  ageFilterNote: "Les âges mélangent les buts en club et en sélection : ce graphique ne couvre donc que la carrière complète — effacez le filtre d'équipe pour le voir.",
  compCaption: (name) => `Buts par compétition — ${esc(name)}.`,
  thComp: "Compétition", thGoals: "Buts", thShare: "Part",
  recAllTime: "Record absolu de la compétition",
  finishCaption: "Comment les buts ont été marqués et avec quoi — totaux de carrière, toutes équipes.",
  thFinish: "Finition",
  finishCaveatTable: "Les répartitions par type de finition et par partie du corps sont un décompte provisoire compilé.",
  finishRows: (d) => [
    ["Jeu ouvert", d.byFinish.openPlay],
    ["Penalties", d.byFinish.penalties],
    ["Coups francs", d.byFinish.freeKicks],
    ["Pied gauche", d.byBodyPart.left],
    ["Pied droit", d.byBodyPart.right],
    ["Tête", d.byBodyPart.head],
    ["Autre (poitrine, etc.)", d.byBodyPart.other]
  ],
  teamCardSub: { goals: "buts", apps: "matchs", gpg: "par match", of: "sur" },
  records: (comp, d) => [
    ["69", `<b>Buts en 2013</b> — le plus grand nombre qu'il ait marqué sur une année civile.`],
    [n(comp("La Liga")), `<b>Buts en La Liga</b>, le record absolu de la compétition, tous avec le Real Madrid.`],
    ["140", `<b>Buts en Ligue des champions</b> — le record de l'histoire de la compétition.`],
    ["5", `<b>Ballons d'Or</b> (2008, 2013, 2014, 2016, 2017).`],
    [n(d.hatTricks), `<b>Triplés ou plus</b> en club et en sélection (décompte provisoire).`],
    [`${LIVE.trophies}`, `<b>Trophées collectifs</b> — 32 en club, 3 avec le Portugal.`]
  ],
  method: "Les chiffres de la Ligue des champions (140 buts en 183 apparitions, 42 passes) sont des records de compétition repris des archives des clubs et de l'UEFA ; les autres répartitions par compétition, filtrées par équipe, suivent la table de correspondance compétitions/saisons de club et sont documentées dans le fichier de données."
};

export const TIMELINE = {
  head: (t) => `De ses débuts avec le Sporting CP en 2002 à <b>${n(t.goals)} buts en carrière</b>, compteur toujours en cours — les nuits décisives, les records et les trophées, datés et dans l'ordre.`,
  keydates: (t, lastUpdated) => [
    ["14 août 2002", "Première apparition en équipe première avec le <b>Sporting CP</b> contre l'Inter au troisième tour de qualification de la Ligue des champions, à 17 ans."],
    ["20 août 2003", "Première sélection avec le <b>Portugal</b> contre le Kazakhstan, quelques semaines après avoir repris le célèbre numéro 7 à Manchester United."],
    ["2008", "<b>Ballon d'Or</b> à 23 ans, élu sur les 96 bulletins de vote, avec la Ligue des champions et la Coupe du monde des clubs."],
    ["2013", "<b>69 buts</b> sur l'année civile — son record — dont un triplé avec le Portugal en 15 minutes."],
    ["2016", "Il soulève le <b>Championnat d'Europe</b> comme capitaine du Portugal, avec trois buts et le Soulier d'or."],
    [esc(lastUpdated), `<b>${n(t.goals)} buts en carrière</b> en club et en sélection — dernière vérification à cette date.`]
  ],
  inProg: "en cours",
  goals: "buts",
  goalsInEra: (goals, share, total) => `<b>${n(goals)} buts</b> · ${share} % de ${n(total)}`,
  peakYear: (pk, tr) => `<p class="ch-callout">Année de pointe <b>${pk.year} · ${pk.goals} buts</b>` + (tr ? ` · <b>${tr}</b> trophée${tr === 1 ? "" : "s"} d'équipe sur cette période` : "") + `</p>`,
  empty: (val, total) => `Aucun résultat pour « ${val} » — effacez la recherche pour voir les ${total} jalons.`,
  tagRecord: "Record", tagWc: "Coupe du monde", tagFirst: "Premier",
  faq: [
    ["Quand Ronaldo a-t-il fait ses débuts en équipe première ?", "Avec le <b>Sporting CP</b> le <b>14 août 2002</b> contre l'Inter au troisième tour de qualification de la Ligue des champions, à 17 ans ; ses premiers buts en équipe première sont tombés deux mois plus tard contre Moreirense."],
    ["Quand Ronaldo a-t-il marqué son premier but ?", "Son premier but pour le Portugal a été un coup de tête contre la <b>Grèce à l'Euro 2004</b> ; son premier but pour Manchester United cette même année a été un coup franc contre Portsmouth."],
    ["Quand Ronaldo a-t-il remporté la Ligue des champions ?", "Une première fois en <b>2008</b> avec Manchester United, puis quatre fois d'affilée avec le Real Madrid en <b>2014, 2016, 2017 et 2018</b>."],
    ["Quand Ronaldo a-t-il rejoint le Real Madrid ?", "En <b>juin 2009</b>, contre un montant record mondial — avec 80 000 personnes au Bernabéu pour la présentation."],
    ["Quand Ronaldo a-t-il rejoint Al Nassr ?", "En <b>janvier 2023</b>, avec ses débuts comme capitaine contre Al-Ettifaq et deux buts lors d'un match nul 2–2."]
  ],
  method: "Les entrées de la chronologie sont des jalons datés au jour et à l'année ; les barres de buts par ère répartissent les années civiles en périodes qui ne se chevauchent pas, de sorte que leur somme redonne le total de carrière."
};

export const ACH = {
  head: (teamTotal) => `<b>${teamTotal} trophées collectifs</b> — 32 en club et 3 avec le Portugal — plus <b>5 Ballons d'Or</b>. Chaque titre, club par club, avec les années de victoire.`,
  kpis: (per) => [
    ["Trophées collectifs", 35, `Real Madrid ${per["Real Madrid"] || 0} · Manchester United ${per["Manchester United"] || 0} · Juventus ${per["Juventus"] || 0} · Portugal ${per["Portugal"] || 0}.`],
    ["Ballons d'Or", "5", "2008, 2013, 2014, 2016, 2017."],
    ["Souliers d'or européens", "4", "2008, 2011, 2014, 2015."],
    ["Saisons de meilleur buteur en UCL", "7", "Meilleur buteur de la Ligue des champions en 2008, puis à chaque saison de 2013 à 2018."]
  ],
  qa: (teamTotal, per) => [
    ["Combien de trophées Ronaldo a-t-il remportés ?", `<b>${teamTotal} titres collectifs en équipe première</b> : ${per["Real Madrid"] || 0} avec le Real Madrid, ${per["Manchester United"] || 0} avec Manchester United, ${per["Juventus"] || 0} avec la Juventus, ${per["Al Nassr"] || 0} avec Al Nassr, ${per["Sporting CP"] || 0} avec le Sporting CP et ${per["Portugal"] || 0} avec le Portugal.`],
    ["Combien de Ballons d'Or Ronaldo a-t-il remportés ?", "<b>Cinq</b> — 2008, 2013, 2014, 2016 et 2017, le premier à 23 ans."],
    ["Ronaldo a-t-il remporté un grand titre international ?", "<b>Oui</b> — l'Euro 2016 de l'UEFA comme capitaine, et la Ligue des nations de l'UEFA en 2019 et 2025."],
    ["Combien de Ligues des champions Ronaldo a-t-il remportées ?", "<b>Cinq</b> : 2008 avec Manchester United, puis 2014, 2016, 2017 et 2018 avec le Real Madrid."]
  ],
  teamHeader: (team, sub) => `${esc(team)} — ${sub} trophées`,
  indHeader: (indTotal) => `Distinctions individuelles — ${indTotal} récompenses`,
  faq: [
    ["Quel est le trophée le plus important de Ronaldo ?", "Le <b>Championnat d'Europe 2016</b> — le titre qu'il a remporté avec le Portugal à Paris, dans le rôle de capitaine, en étant le deuxième meilleur buteur de la compétition."],
    ["Combien de titres de championnat Ronaldo a-t-il remportés ?", "<b>Huit</b> — 3 Premier League, 2 La Liga, 2 Serie A et 1 Saudi Pro League, comme détaillé dans le palmarès de cette archive."],
    ["Combien de distinctions individuelles Ronaldo a-t-il remportées ?", "Cinq Ballons d'Or, quatre souliers d'or européens, trois titres de joueur de l'année de l'UEFA, le FIFA World Player of the Year en 2008, le Prix Puskás en 2009, le Soulier d'or de l'Euro 2020 et The Best FIFA Men's Player en 2016 et 2017."],
    ["Ronaldo est-il le joueur le plus titré de l'histoire ?", "Sur les seuls titres collectifs, Messi mène avec 46 contre 35 pour Ronaldo. Ronaldo mène les records de buts — 981 buts, dont 140 en Ligue des champions, et 146 buts en 234 sélections avec le Portugal."]
  ]
};

export const BDAY = {
    months: ["", "janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
    badgeSuccess: "🎉 Oui ! Ronaldo a marqué le jour de votre anniversaire !",
    badgeMessi: "🎂 L'anniversaire de CR7 !",
    badgeEmpty: "Aucun but à cette date",
    headlineSuccess: (g, m, d) => `Cristiano Ronaldo a marqué <b>${g} ${g === 1 ? "but" : "buts"}</b> en <b>${m} ${m === 1 ? "match" : "matchs"}</b> le ${d} au cours de sa carrière professionnelle !`,
    headlineMessi: `Vous partagez votre anniversaire avec <b>Cristiano Ronaldo</b> (né le 5 février 1985 à Funchal, Madère) !`,
    headlineEmpty: (d) => `Cristiano Ronaldo n'a pas marqué le <b>${d}</b> au cours de sa carrière professionnelle.`,
    whyZeroTitle: "Pourquoi 0 but ?",
    whyZeroMessi: "Le 5 février tombe au milieu de la saison européenne des clubs : c'est généralement un jour de match ordinaire pour Ronaldo, et le calendrier comme les minutes jouées décident si un but tombe le jour de sa naissance.",
    whyZeroMessiSub: "Vous partagez votre jour spécial avec Cristiano Ronaldo — CR7, né le 5 février 1985.",
    emptyExpl: "Ronaldo n'avait pas de match programmé, ou n'a pas marqué, ce jour précis du calendrier — mais il a marqué la plupart des jours de l'année en club et en sélection.",
    closestDay: (d, g) => `Le jour de calendrier le plus proche où Ronaldo a marqué est le <b>${d}</b> (${g} buts en carrière).`,
    closestBtn: (d, g) => `Voir le ${d} (${g} buts) &rarr;`,
    watchClip: (cnt) => `Voir ${cnt > 1 ? cnt + " buts en vidéo" : "le but en vidéo"}`,
    searchYt: "🔍 Rechercher les moments forts",
    playInline: "📺 Vidéo intégrée",
    closeInline: "✕ Fermer la vidéo",
    ytHighlights: "Moments forts YouTube",
    goalSummary: (g) => `${g} ${g === 1 ? "but" : "buts"} marqués :`,
    goalTab: (idx, min) => `But ${idx}${min ? ` (${min}')` : ""}`,
    shareSuccess: (d, g, m) => `Cristiano Ronaldo a marqué ${g} buts en ${m} matchs le jour de mon anniversaire (${d}) ! Vérifiez votre date :`,
    shareEmpty: (d) => `Cristiano Ronaldo a-t-il marqué le jour de votre anniversaire ? Il a marqué la plupart des jours de l'année en club et en sélection. Vérifiez la vôtre :`,
  };

export const LATEST_GOAL = {
    goalPrefix: "But n°",
    scoreline: "Score",
    didScoreTodayYes: "OUI ! Cristiano Ronaldo a marqué aujourd'hui : but n°{goalNum} à la {minute} contre {opp} ({score}) !",
    didScoreTodayNo: "Cristiano Ronaldo a-t-il marqué aujourd'hui ? Son dernier match officiel s'est joué le {date} en {comp}, où il a marqué le but n°{goalNum} de sa carrière à la {minute} pour sceller une victoire {score}. Regardez ci-dessous la vidéo officielle du but.",
    matchResult: "Dernier résultat : {title}",
    goalBadge: "But n°{goalNum} marqué ({minute})",
    playHighlight: "Sélectionnez l'un des derniers buts de Cristiano Ronaldo ci-dessous pour charger instantanément le moment fort en vidéo dans le lecteur ci-dessus :",
    viewDateGoals: "Voir les buts du {formattedDate} →",
    tagHeader: "Tête 🔥",
    tagFreekick: "Coup franc direct 🔥",
    tagPenalty: "Penalty",
    tagLeftFoot: "Frappe du pied gauche",
    tagRightFoot: "Pied droit",
    tagOpenPlay: "Jeu ouvert",
    assist: "Passe"
  };

export const ARG_STREAM = {
    badge: "🇵🇹 SOIRÉE MATCH PORTUGAL",
    title: "Le Portugal de Cristiano Ronaldo",
    text: "Soirée match Portugal — regardez le direct en gratuit, SANS PUB.",
    highlight: "Direct gratuit • Sans pub",
    cta: "Regarder le direct ▶",
    closeAria: "Fermer la notification",
    matchCardTitle: "Portugal en sélection • Soirée match en direct",
    matchCardDesc: "Regardez Cristiano Ronaldo et le Portugal en direct sur Koora Live — stream gratuit, zéro pub."
  };

export const EXPLORE_LANGS = [
  { href: "/fr/birthday", page: "birthday", t: "🎂 Ronaldo a-t-il marqué le jour de votre anniversaire ?", d: (d) => `Parcourez les 366 jours du calendrier avec des extraits vidéo de ses ${n(d.totals.goals)} buts en équipe première.` },
  { href: "/fr/ronaldo-vs-messi", page: "ronaldo-vs-messi", t: "🐐 Ronaldo vs Messi, bilan global", d: () => `Statistiques de carrière face à face : ${n(LIVE.goals)} contre ${n(LIVE.rGoals)} buts, ${LIVE.trophies} contre ${LIVE.rTrophies} trophées, 5 contre 8 Ballons d'Or.` },
  { href: "/fr/real-madrid", page: "real-madrid", t: "🏟️ Ronaldo au Real Madrid", d: () => "Ses neuf ans au Real Madrid : 450 buts, 311 en Liga, quatre Ligues des champions et 18 en Clásico." },
  { href: "/fr/champions-league", page: "champions-league", t: "⭐ Record en Ligue des champions", d: () => "140 buts en Ligue des champions UEFA, 42 passes et 5 titres européens." },
  { href: "/fr/latest-goal", page: "latest-goal", t: "⚽ Dernier but de Ronaldo en vidéo", d: () => "Regardez la vidéo du dernier but de Ronaldo, voyez s'il a marqué aujourd'hui et parcourez les extraits récents." },
  { href: "/fr", page: "home", t: "Statistiques de la carrière de Ronaldo", d: (d) => `Les chiffres clés : ${n(d.totals.goals)} buts en ${n(d.totals.apps)} matchs en équipe première.` },
  { href: "/fr/dashboard", page: "dashboard", t: "Tableau de bord des statistiques de Ronaldo", d: () => "Filtrez chaque graphique par Real Madrid, Manchester United, Juventus, Al Nassr, Sporting CP ou Portugal." },
  { href: "/fr/timeline", page: "timeline", t: "Ronaldo au fil des ans", d: () => "Chaque jalon de carrière, daté et dans l'ordre, de 2002 à aujourd'hui." },
];

/* Era chapter openers. The renderer looks an intro up by era slug first
   (rosario, peak, msn, carry, farewell, paris, miami) and falls back to the
   era name, so both keys are mapped here to the same Ronaldo copy — no
   change to app.js is needed. */
export const ERA_INTROS = {
  "The boy from Rosario":
    `Cristiano Ronaldo est arrivé à Lisbonne depuis Funchal, sur l'île de Madère, adolescent, avec une réputation de vitesse et l'habitude de réclamer le ballon. Sa première saison en équipe première au Sporting CP lui a rapporté cinq buts en 31 apparitions et, en douze mois, il avait reçu le célèbre numéro 7 de Manchester United pour 12.24 millions de livres. Il a marqué en finale de Coupe d'Angleterre à 19 ans, remporté trois titres de Premier League, la Ligue des champions et la Coupe du monde des clubs, et en 2008 il a été désigné meilleur joueur du monde à 23 ans — sur les 96 bulletins de vote.`,
  "The greatest peak football has seen":
    `Real Madrid a payé un montant record mondial en 2009 et a accueilli le talent offensif le plus cher de l'histoire du sport. Il a répondu par un coup de tête en finale de Coupe d'Espagne contre Barcelone dès sa première saison, puis par un titre de La Liga remporté avec un record de 100 points et 46 buts en championnat. À la fin de 2012, il avait atteint 60 buts sur l'année civile et 100 buts en La Liga pour le club, et l'identité offensive madrilène se reconstruisait autour de lui.`,
  "MSN and the second treble":
    `Trois saisons à Madrid ont porté Ronaldo au-delà de presque tous les repères du livre. Il a marqué 69 buts en 2013, sa meilleure année civile, dont trois pour le Portugal en quinze minutes contre l'Irlande du Nord — l'un de ses dix triplés en sélection, un record mondial. La Décima est arrivée en 2014 et, à la fin de 2015, son 500e but en carrière l'avait porté devant tous les buteurs de l'histoire de la Ligue des champions.`,
  "Carrying Barcelona":
    `Après le Championnat d'Europe 2016 remporté en France, Ronaldo a ajouté la Ligue des champions en 2017 — dont un triplé contre le Bayern Munich qui l'a porté à 100 buts dans la compétition — et un cinquième Ballon d'Or la même saison. Il a dépassé Jimmy Greaves comme meilleur buteur des cinq grands ligues européens, puis a rejoint la Juventus à 33 ans et a marqué un triplé lors de son premier match de Ligue des champions là-bas.`,
  "Farewell to Barcelona":
    `Le titre de Ligue des nations et une place dans les livres de records sont arrivés en 2019, lorsque son 700e but en carrière a été marqué contre l'Ukraine en octobre. Sa 1 000e apparition en équipe première a suivi contre le Cagliari en février 2020 et, en 2021, il a dépassé Ali Daei pour devenir le meilleur buteur de l'histoire du football international masculin, avec un dixième triplé en sélection — un record mondial.`,
  "Paris and the World Cup":
    `Son retour à Manchester United en 2021 lui a rendu le numéro 7 et offert une nouvelle scène pour le plus vieux de la pièce, et en 2022 il a dépassé Josef Bican avec un triplé contre Tottenham. Son transfert en Arabie saoudite en janvier 2023 a fait de lui le capitaine d'Al Nassr et, avec sa 197e sélection, le joueur le plus sélectionné de l'histoire du football international masculin.`,
  "Miami and the road to 1,000":
    `Al Nassr lui a offert un nouveau départ et un titre de Saudi Pro League, mais les records ont continué : son 900e but en carrière en Ligue des nations en 2024, son 800e but en club et son 100e but pour Al Nassr en 2025 — faisant de lui le premier joueur à marquer 100 buts pour quatre clubs — et, en 2026, son 500e but marqué après ses 30 ans et une sixième Coupe du monde. Chaque but fait désormais courber la trajectoire vers les 1 000.`
};
/* Alias keys: era slugs (and the shorter Ronaldo-era slugs) resolve to the
   same seven paragraphs, so the timeline chapters always open with the
   Ronaldo copy whichever key the renderer uses. */
Object.assign(ERA_INTROS, {
  rosario: ERA_INTROS["The boy from Rosario"],
  peak: ERA_INTROS["The greatest peak football has seen"],
  msn: ERA_INTROS["MSN and the second treble"],
  carry: ERA_INTROS["Carrying Barcelona"],
  farewell: ERA_INTROS["Farewell to Barcelona"],
  paris: ERA_INTROS["Paris and the World Cup"],
  miami: ERA_INTROS["Miami and the road to 1,000"],
  lisbon: ERA_INTROS["The boy from Rosario"],
  united: ERA_INTROS["The boy from Rosario"],
  madrid: ERA_INTROS["The greatest peak football has seen"],
  firstballon: ERA_INTROS["The greatest peak football has seen"],
  juve: ERA_INTROS["Farewell to Barcelona"],
  ronaldo2: ERA_INTROS["Paris and the World Cup"],
  nassr: ERA_INTROS["Miami and the road to 1,000"],
});

export const CABINET = [
    { title: "Portugal & Coupe du monde de la FIFA", sub: "Six Coupes du monde (2006–2026) et 146 buts en 234 sélections avec le Portugal.", src: "/img/cab-wc.webp", w: 800, h: 600, pos: "50% 30%", alt: "Cristiano Ronaldo en maillot numéro 7 du Portugal lors de la Coupe du monde 2018", cap: "Le meilleur buteur de l'histoire du Portugal, sur six Coupes du monde" },
    { title: "Ballon d'Or — 5", sub: "2008, 2013, 2014, 2016, 2017 — le premier à 23 ans.", src: "/img/cab-ballon.webp", w: 800, h: 600, pos: "50% 30%", alt: "Cristiano Ronaldo tenant le Ballon d'Or qu'il a remporté un record de cinq fois", cap: "Cinq Ballons d'Or" },
    { title: "Ligue des champions — 5", sub: "140 buts, le record de la compétition, en 183 apparitions.", src: "/img/cab-ucl.webp", w: 800, h: 600, pos: "50% 25%", alt: "Les coupes de la Coupe d'Europe et de la UEFA Champions League, remportées cinq fois par Cristiano Ronaldo", cap: "Cinq titres européens et 140 buts en Ligue des champions" },
    { title: "Coupe du monde des clubs de la FIFA — 4", sub: "2008, 2014, 2016 et 2017 avec Manchester United et le Real Madrid.", src: "/img/cab-cwc.webp", w: 800, h: 600, pos: "50% 25%", alt: "Les trophées Golden Ball de la FIFA Club World Cup au musée CR7 de Madère", cap: "Quatre Coupes du monde des clubs" },
    { title: "La Liga — 311 buts", sub: "Le record absolu de la compétition, tous marqués avec le Real Madrid.", src: "/img/cab-liga.webp", w: 800, h: 600, pos: "50% 25%", alt: "Cristiano Ronaldo en maillot numéro 7 du Real Madrid, dans une Liga qu'il a remportée deux fois", cap: "311 buts en La Liga avec le Real Madrid" }
  ];

export const BDAY_MEDIA = {
    "searchHighlights": "🔍 Rechercher les séquences",
    "openArchive": "Ouvrir dans l'archive des buts de CR7",
    "noClip": "Aucun clip publié pour ce but.",
    "noClipBody": "La fiche du match ci-dessous provient des feuilles de match officielles. Les liens ouvrent la page du but dans l'archive et une recherche de la séquence.",
    "clipLabel": "Clip publié",
    "seasonNote": "Tous les buts de Ronaldo lors de la saison {season}.",
    "compilationNote": "Ce but figure dans une compilation de tous les buts. Utilisez le lien de l'archive pour trouver sa position exacte.",
    "compilationLabel": "Compilation de tous ses buts",
    "publisher": "Publié par",
    "assist": "Passe : {name}",
    "finish": "Conclusion : {type}",
    "goalNumber": "But n° {n}",
    "watchOn": "Voir sur {publisher}",
    "sourceLine": "Fiche du but : {source} — l'archive tire sa liste de Wikipédia, List of senior career goals by Cristiano Ronaldo (CC BY-SA 4.0, d'après le relevé de buts de FBref), et de StatsBomb open data. Les clips sont publiés par leurs ayants droit.",
    "sourceNote": "Les dates, compétitions, scores, minutes, conclusions et passes de cette page proviennent de cr7allgoals.com, dont la liste de buts est celle de Wikipédia, List of senior career goals by Cristiano Ronaldo (CC BY-SA 4.0, d'après le relevé de FBref), avec StatsBomb open data pour les détails révisés des matchs. La liste internationale est le relevé de sélections de la RSSSF : 146 buts en 234 sélections avec le Portugal. Quand la minute n'a jamais été publiée, elle reste vide plutôt qu'inventée."
  };
