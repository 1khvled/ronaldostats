// FR dictionary — RonaldoStats
// Extracted verbatim from the original inline dictionaries by
// scripts/refactor-i18n.mjs. Structure is identical across all 9 languages.

export const HOME = {
    locale: "fr-FR",
    shirt10: "Numéro 10",
    head: (t, p, d) => `<b>${n(t.goals)} buts officiels</b> en <b>${n(t.apps)} matchs professionnels</b> avec Barcelone, le PSG, l'Inter Miami et l'Argentine au ${esc(d.lastUpdated)}. Champion du monde et 8 Ballons d'Or.`,
    meta: (p, dob) => `${esc(p.name)}, né le ${dob} à ${esc(p.birthplace)}. Âgé de ${p.age} ans, attaquant à ${esc(p.current.join(" et "))}.`,
    roleLabel: "Rôle",
    teamsLabel: "Équipes",
    nowLabel: "Actuel",
    kpiCareer: "Buts en carrière",
    kpiCareerNote: (gpg, seasons) => `${gpg} but par match sur ${seasons} saisons en club.`,
    kpiApps: "Matchs officiels",
    kpiAppsNote: (clubs, country) => `${clubs} en club, ${country} avec l'Argentine.`,
    kpiArg: "Buts avec l'Argentine",
    kpiArgNote: (gpg, caps) => `${gpg} par match en ${caps} sélections.`,
    kpiTrophies: "Trophées collectifs",
    kpiTrophiesNote: (lang) => `Record historique de ${LIVE.trophies} titres et 8 Ballons d'Or. <a href="/${lang}/achievements">Palmarès complet</a>.`,
    kpiRoad: "Route vers les 1 000 buts",
    kpiRoadNote: (togo, projYear, pace) => `Plus que ${togo} buts. Au rythme actuel (~${pace.toFixed(0)} par an), cap des 1 000 vers ${projYear}.`,
    copyStatsBtn: "Copier les stats clés",
    copyText: (goals, apps, clubGoals, argGoals, updated) => `Messi : ${goals} buts en ${apps} matchs officiels (${clubGoals} en club, ${argGoals} avec l'Argentine), ${LIVE.trophies} trophées, 8 Ballons d'Or — au ${updated}.`,
    copyMsg: "Copié dans le presse-papiers !",
    clubCaption: (updated, lang) => `Matchs et buts pour chaque équipe senior de Lionel Messi au ${updated}. Détail complet sur la <a href="/${lang}/goalsbyseason">page des saisons</a>.`,
    thTeam: "Équipe et années",
    thApps: "Matchs",
    thGoals: "Buts",
    thGpg: "Buts / Match",
    thTotal: "Total carrière",
    yearSub: "Choisissez une année pour voir grimper le total, de ses débuts en 2004 jusqu'à aujourd'hui.",
    yearTitle: "Statistiques de Messi par année civile",
    yearLabel: "Année",
    yearFigcap: (start, cur, prov, lang) => `Buts par année civile, de ${start} à ${cur}${prov ? " (en cours)" : ""} — pic à 91 buts en 2012. <a href="/${lang}/goalsbyyear">Tableau complet</a>.`,
    tileGoals: (year, prov) => `Buts en ${year}${prov ? " (en cours)" : ""}`,
    tileTotal: (year) => `Total après ${year}`,
    tileAge: (year) => `Âge en ${year}`,
    records: (best, post30, pct) => [
      [`91`, `<b>Buts en 2012</b>, record absolu dans l'histoire du football mondial sur une année civile — ${best.goals} toutes compétitions confondues.`],
      [`8`, `<b>Ballons d'Or</b> (2009–12, 2015, 2019, 2021, 2023) — record mondial inégalé.`],
      [`474`, `<b>Buts en Liga</b>, record absolu de l'histoire du championnat espagnol.`],
      [`129`, `<b>Buts en Ligue des Champions</b> — 120 avec le Barça et 9 avec le PSG, 2e plus grand total de l'histoire.`],
      [post30, `<b>Buts après 30 ans</b> — environ ${pct}% de l'ensemble de ses buts en carrière.`],
      [`57`, `<b>Triplés ou plus</b> en club et en sélection au cours de sa carrière professionnelle.`],
      [`46`, `<b>Trophées collectifs</b> — le joueur le plus titré de l'histoire du football, couronné par le Mondial 2022.`]
    ],
    silverCaption: () => `${LIVE.trophies} titres collectifs officiels, club par club, ainsi que les plus grandes distinctions individuelles.`,
    silverThTrophy: "Trophée",
    silverThTimes: "Fois",
    silverThNote: "Détails",
    silverRows: [
      ["Titres avec le FC Barcelone", "35", "2005 à 2021, dont 4 Ligues des Champions et 10 Ligas"],
      ["Titres avec l'Argentine", "5", "Coupe du Monde 2022, Copas América 2021 et 2024, Finalissima 2022, Or Olympique 2008"],
      ["Titres avec le PSG", "3", "Ligue 1 2022 et 2023, Trophée des Champions 2022"],
      ["Titres avec l'Inter Miami", "4", "Leagues Cup 2023, Supporters' Shield 2024, MLS Cup 2025, Campeones Cup 2026"],
      ["Ballon d'Or", "8", "Record mondial — 2009–12, 2015, 2019, 2021, 2023"]
    ],
    splitFk: "Coups francs directs",
    splitFkNote: "Coups francs enroulés en club et sélection.",
    splitPen: "Buts sur pénalty",
    splitPenNote: "Environ un but sur huit de sa carrière.",
    splitHt: "Triplés ou plus",
    splitHtNote: "Matchs avec 3 buts ou plus marqués.",
    splitCaveat: (tot) => `Les statistiques de coups francs et pénaltys sont des données officielles en cours de compilation. Le total officiel de ${tot} buts reste certifié.`,
    faq: (t, agg, m, d, lang) => [
      ["Combien de buts Lionel Messi a-t-il marqués en tout ?", `<b>${n(t.goals)} buts officiels</b> en ${n(t.apps)} matchs professionnels au ${esc(d.lastUpdated)}, soit une moyenne de ${t.goalsPerGame} buts par match. Voir les <a href="/${lang}/goalsbyyear">buts par année</a>.`],
      ["Combien de buts Messi a-t-il marqués pour Barcelone ?", `<b>${n(agg.barcelona.goals)} buts</b> en ${n(agg.barcelona.apps)} matchs de 2004 à 2021, avec un record de 474 en Liga.`],
      ["Combien de buts pour le PSG et l'Inter Miami ?", `<b>${agg.psg.goals} pour le Paris Saint-Germain</b> et <b>${n(agg.miami.goals)} pour l'Inter Miami</b>.`],
      ["Combien de buts avec l'Argentine ?", `<b>${n(t.country.goals)} buts</b> en ${n(t.country.apps)} sélections depuis 2005.`],
      ["Quelle est la meilleure année de Messi en buts ?", `<b>2012, avec 91 buts</b> — record mondial dans l'histoire du football. Voir <a href="/${lang}/goalsbyyear">toutes les années</a>.`],
      ["Combien de trophées Messi a-t-il remportés ?", `<b>47 titres collectifs</b> (35 avec Barcelone, 3 avec le PSG, 4 avec l'Inter Miami et 5 avec l'Argentine). Voir le <a href="/${lang}/achievements">palmarès</a>.`]
    ]
  };

export const BY_YEAR = {
    head: (ys, best, t) => `De son premier but officiel en ${ys[0].year} à ses <b>${best.goals} buts en ${best.year}</b> — chaque année civile d'une carrière de ${n(t.goals)} buts.`,
    cap: (best, t) => `Barres : buts cette année-là (pic de ${best.goals} en ${best.year}). Ligne : cumul jusqu'à ${n(t.goals)}.`,
    chartLabel: (best) => `Buts de Messi par année avec total cumulé`,
    kpiCareer: "Buts en carrière",
    kpiBest: "Meilleure année",
    kpiBestSub: "Record mondial sur une année civile.",
    kpiCurrSub: "Saison en cours.",
    kpiYears: "Années avec but",
    kpiYearsSub: (ys, last) => `Chaque année de ${ys[0].year} à ${last.year}.`,
    decades: "Buts dans les années",
    tableSub: "Plus récents d'abord. 2026 est en cours. Cliquez sur une colonne pour trier ou tapez pour filtrer.",
    caption: "Buts, cumul en carrière et âge par année civile depuis 2004.",
    thYear: "Année", thGoals: "Buts", thTotal: "Total carrière", thAge: "Âge",
    inProgNote: "* Saison 2026 en cours — mise à jour après chaque match.",
    filterPlaceholder: "Filtrer les années — ex. 2012",
    bestYearHtml: (best) => `<p><b>${best.year} est la plus grande année de l'histoire du football : ${best.goals} buts</b> — 79 pour Barcelone et 12 pour l'Argentine — brisant le record de Gerd Müller (85). <a href="/fr/dashboard">Voir la répartition par compétition</a>.</p>`
  };

export const BY_SEASON = {
    head: (best) => `Toutes les saisons en club de 2004/05 à 2026 — <b>record : ${best.goals} buts en ${best.season}</b> — avec championnat, coupes et Ligue des Champions.`,
    clubSub: "Matchs / buts par format. 2026 est la saison en cours. Cliquez sur une colonne pour trier ou tapez pour filtrer.",
    caption: (len) => `Les ${len} saisons en club : Barcelone 2004/05–2020/21, PSG 2021/22–2022/23, Inter Miami 2023–2026.`,
    thSeason: "Saison", thClub: "Club", thApps: "Matchs", thGoals: "Buts", thLeague: "Ligue", thCup: "Coupe", thCont: "Europe", thOther: "Autres",
    totalLabel: "Total clubs", bestBadge: "Meilleure saison en club",
    filterClubPlaceholder: "Filtrer les saisons — ex. PSG, 2012",
    countrySub: "Matchs officiels et amicaux, les plus récents en premier.",
    countryCaption: "Buts avec l'Équipe d'Argentine par année civile, 2005 à 2026.",
    thYear: "Année", thNote: "Détails", totalArgLabel: "Total Argentine",
    filterCountryPlaceholder: "Filtrer l'Argentine — ex. 2022",
    bestSeasonHtml: (best) => `<p><b>${best.season} — ${best.goals} buts en ${best.apps} matchs pour Barcelone</b> — est la saison en club la plus prolifique de l'histoire du football : 50 en Liga (record), 14 en Ligue des Champions, 3 en Coupe du Roi et 6 en supercoupes. <a href="/fr/goalsbyyear">Voir les mêmes buts par année</a>.</p>`
  };

export const DASH = {
    teamNames: { all: "toutes les équipes", barcelona: "FC Barcelone", psg: "PSG", miami: "Inter Miami", argentina: "Argentine" },
    pills: [["all", "Toutes les équipes"], ["barcelona", "FC Barcelone"], ["psg", "PSG"], ["miami", "Inter Miami"], ["argentina", "Argentine"]],
    head: (name) => `Tous les 930 buts de Lionel Messi analysés de 4 manières — par compétition, par saison, par finition et par partie du corps — filtrés pour <b>${esc(name)}</b>. Touchez une équipe pour actualiser.`,
    filterNote: (name, goals, apps, T) => `Affichage pour ${name} : ${n(goals)} buts en ${n(apps)} matchs` + (T === "barcelona" || T === "psg" ? " (Répartition Ligue des Champions : Barcelone 120, PSG 9 — sources officielles des clubs)." : "."),
    kpis: { goals: "Buts", apps: "Matchs", gpg: "Buts par match", forTeam: (name) => `Pour ${name}.` },
    chartEmpty: "Aucune ligne pour ce filtre d'équipe.",
    figCap: (T, name) => T === "all" ? "Années civiles, de 2004 à 2026." : T === "argentina" ? "Années civiles avec l'Argentine." : "Saisons en club pour " + esc(name) + ".",
    finishParts: { "Open play": "Jeu ouvert", "Penalties": "Penaltys", "Free kicks": "Coups francs" },
    finishCenter: "buts en carrière",
    finishCaveat: "Totaux de carrière combinés pour toutes les équipes. Décompte officiel vérifié.",
    finishCaveatFiltered: (d) => `Aucune répartition par équipe n'existe — voir totaux ci-dessous. Sur ses ${n(d.totals.goals)} buts officiels : ${d.byFinish.openPlay} dans le jeu, ${d.byFinish.penalties} penaltys et ${d.byFinish.freeKicks} coups francs.`,
    bodyParts: { "Left foot": "Pied gauche", "Right foot": "Pied droit", "Head": "Tête", "Other": "Autre (poitrine, etc.)" },
    bodyCenter: "du pied gauche",
    bodyCaveat: "Totaux de carrière combinés pour toutes les équipes (décompte officiel vérifié).",
    ageName: (r) => `Âge ${r.age} · ${r.year}`,
    ageCaveat: (apeak) => `Chaque but professionnel selon l'âge auquel il a été marqué — clubs et sélection combinés. Pic : ${apeak.goals} buts à l'âge de ${apeak.age} ans (${apeak.year}).`,
    ageFilterNote: "Les âges combinent club et sélection, ce graphique couvre donc la carrière complète — effacez le filtre pour le voir.",
    compCaption: (name) => `Buts par compétition — ${esc(name)}.`,
    thComp: "Compétition", thGoals: "Buts", thShare: "Part",
    recAllTime: "Record historique de la compétition",
    finishCaption: "Comment les buts ont été marqués et avec quelle partie du corps — totaux de carrière.",
    thFinish: "Finition / Partie du corps",
    finishCaveatTable: "La répartition par finition et partie du corps est un décompte officiel vérifié.",
    finishRows: (d) => [
      ["Dans le jeu", d.byFinish.openPlay],
      ["Penaltys", d.byFinish.penalties],
      ["Coups francs directs", d.byFinish.freeKicks],
      ["Pied gauche", d.byBodyPart.left],
      ["Pied droit", d.byBodyPart.right],
      ["Tête", d.byBodyPart.head],
      ["Autre (poitrine, etc.)", d.byBodyPart.other]
    ],
    teamCardSub: { goals: "buts", apps: "matchs", gpg: "par match", of: "sur" },
    records: (comp, d) => [
      ["91", `<b>Buts en 2012</b> — le record mondial officiel sur une année civile.`],
      [n(comp("La Liga")), `<b>Buts en La Liga</b> — record absolu de l'histoire, tous avec Barcelone.`],
      [n(comp("UEFA Champions League")), `<b>Buts en Ligue des Champions</b> — 120 pour Barcelone, 9 pour le PSG.`],
      ["8", `<b>Ballons d'Or</b> — record absolu du football (2009–12, 2015, 2019, 2021, 2023).`],
      [n(d.hatTricks), `<b>Coups du chapeau ou plus</b> en club et en sélection.`],
      [`${LIVE.trophies}`, `<b>Titres collectifs officiels</b> — le joueur le plus titré de l'histoire.`]
    ],
    method: "Les buts en Ligue des Champions sont répartis à 120 pour Barcelone et 9 pour le PSG d'après les archives officielles."
  };

export const TIMELINE = {
    head: (t) => `De ses débuts à Barcelone en 2004 à <b>${n(t.goals)} buts en carrière</b> — les moments clés, records et trophées par ordre chronologique.`,
    keydates: (t, lastUpdated) => [
      ["16 Oct 2004", "Débuts professionnels avec le <b>FC Barcelone</b> contre l'Espanyol, à 17 ans."],
      ["1 Mai 2005", "Premier but officiel face à Albacete — plus jeune buteur du Barça à l'époque."],
      ["17 Août 2005", "Débuts avec l'équipe nationale d'<b>Argentine</b> contre la Hongrie."],
      ["2012", "<b>91 buts</b> sur une année civile — le record mondial absolu du football."],
      ["18 Déc 2022", "Remporte la <b>Coupe du Monde</b> au Qatar avec l'Argentine en inscrivant un doublé en finale."],
      [esc(lastUpdated), `<b>${n(t.goals)} buts en carrière</b> en club et sélection — dernière mise à jour.`]
    ],
    inProg: "en cours",
    goals: "buts",
    goalsInEra: (goals, share, total) => `<b>${n(goals)} buts</b> · ${share}% sur ${n(total)}`,
    peakYear: (pk, tr) => `<p class="ch-callout">Année record <b>${pk.year} · ${pk.goals} buts</b>` + (tr ? ` · <b>${tr}</b> ${tr === 1 ? "trophée collectif" : "trophées collectifs"} sur cette période` : "") + `</p>`,
    empty: (val, total) => `Aucun résultat pour “${val}” — effacez pour voir les ${total} étapes.`,
    tagRecord: "Record", tagWc: "Mondial", tagFirst: "Premier",
    faq: [
      ["Quand Messi a-t-il fait ses débuts ?", "Avec Barcelone le <b>16 octobre 2004</b> face à l'Espanyol à 17 ans et 114 jours ; avec l'Argentine le 17 août 2005."],
      ["Quand Messi a-t-il marqué son premier but ?", "Le <b>1er mai 2005</b> contre Albacete — alors le plus jeune buteur de l'histoire du Barça."],
      ["Quand Messi a-t-il gagné la Coupe du Monde ?", "Le <b>18 décembre 2022</b>, aux tirs au but face à la France après un match nul 3–3 à Lusail."],
      ["Quand Messi a-t-il quitté Barcelone ?", "En <b>août 2021</b>, rejoignant le Paris Saint-Germain après 21 années au Barça."],
      ["Quand Messi a-t-il rejoint l'Inter Miami ?", "En <b>juillet 2023</b>, remportant la Leagues Cup quelques semaines seulement après son arrivée."]
    ],
    method: "Les entrées de la frise chronologique sont des jalons précis ; les barres de buts divisent les années civiles sans chevauchement pour reconstituer le total de carrière."
  };

export const ACH = {
    head: (teamTotal) => `<b>${teamTotal} trophées collectifs</b> — la carrière la plus titrée de l'histoire du football — plus un record de <b>8 Ballons d'Or</b>. Tous les titres par club.`,
    kpis: (per) => [
      ["Trophées collectifs", 46, `Barcelone ${per["Barcelona"] || 0} · Argentine ${per["Argentina"] || 0} · PSG ${per["Paris Saint-Germain"] || 0} · Miami ${per["Inter Miami"] || 0}.`],
      ["Ballons d'Or", "8", "Record — 2009–12, 2015, 2019, 2021, 2023."],
      ["Ligues des Champions", "4", "2006, 2009, 2011, 2015 — toutes avec le Barça."],
      ["Titres internationaux majeurs", "3", "Coupe du Monde 2022, Copas América 2021 & 2024."]
    ],
    qa: (teamTotal, per) => [
      ["Combien de trophées Messi a-t-il remportés ?", `<b>${teamTotal} titres collectifs majeurs</b> : ${per["Barcelona"] || 0} avec Barcelone, ${per["Paris Saint-Germain"] || 0} avec le PSG, ${per["Inter Miami"] || 0} avec l'Inter Miami et ${per["Argentina"] || 0} avec l'Argentine.`],
      ["Combien de Ballons d'Or Messi a-t-il remportés ?", "<b>Huit</b> — plus que tout autre joueur dans l'histoire (2009–12, 2015, 2019, 2021, 2023)."],
      ["Messi a-t-il gagné la Coupe du Monde ?", "<b>Oui — en 2022</b>, en inscrivant un doublé en finale contre la France, en plus des Copas América 2021 et 2024."],
      ["Combien de Ligues des Champions Messi a-t-il gagnées ?", "<b>Quatre</b>, toutes avec Barcelone : 2006, 2009, 2011 et 2015."]
    ],
    teamHeader: (team, sub) => `${esc(team)} — ${sub} trophées`,
    indHeader: (indTotal) => `Distinctions individuelles — ${indTotal} récompenses`,
    faq: [
      ["Quel est le trophée le plus important de Messi ?", "La <b>Coupe du Monde 2022</b> — le graal suprême de toute sa carrière, remporté en tant que meilleur joueur du tournoi."],
      ["Combien de championnats nationaux Messi a-t-il remportés ?", "<b>Douze championnats</b> — 10 La Liga, 2 Ligue 1 — plus la Supporters' Shield et la Leagues Cup avec Miami."],
      ["Combien de récompenses individuelles Messi a-t-il gagnées ?", "Huit Ballons d'Or, six Souliers d'Or européens et deux Ballons d'Or de la Coupe du Monde — chacun étant un record."],
      ["Messi est-il le joueur le plus titré de tous les temps ?", "En combinant trophées collectifs et distinctions individuelles — <b>oui, absolument</b>."]
    ]
  };

export const BDAY = {
    months: ["", "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
    badgeSuccess: "🎉 Oui ! Messi a marqué le jour de votre anniversaire !",
    badgeMessi: "🎂 L'anniversaire de Leo Messi lui-même !",
    badgeEmpty: "Aucun but à cette date",
    headlineSuccess: (g, m, d) => `Lionel Messi a marqué <b>${g} ${g === 1 ? "but" : "buts"}</b> en <b>${m} ${m === 1 ? "match" : "matchs"}</b> le ${d} au cours de sa carrière professionnelle !`,
    headlineMessi: `Vous partagez votre anniversaire avec <b>Lionel Andrés Messi</b> (né le 24 juin 1987 à Rosario) !`,
    headlineEmpty: (d) => `Lionel Messi n'a pas marqué le <b>${d}</b> au cours de sa carrière professionnelle.`,
    whyZeroTitle: "Pourquoi 0 but ?",
    whyZeroMessi: "Lionel Messi n'a jamais joué de match officiel un 24 juin car la fin juin correspond à la trêve estivale des clubs européens ou à des jours de repos lors des tournois internationaux.",
    whyZeroMessiSub: "Vous partagez votre jour spécial avec le plus grand joueur de l'histoire !",
    emptyExpl: "Messi n'avait pas de match ou n'a pas marqué ce jour précis — mais il a marqué lors de <b>292 des 366 jours (79,8%)</b> de l'année !",
    closestDay: (d, g) => `Le jour le plus proche où Messi a marqué est le <b>${d}</b> (${g} buts en carrière).`,
    closestBtn: (d, g) => `Voir le ${d} (${g} buts) &rarr;`,
    watchClip: (cnt) => `Voir ${cnt > 1 ? "les " + cnt + " buts" : "le but"}`,
    searchYt: "🔍 Chercher sur YouTube",
    playInline: "📺 Lecture intégrée",
    closeInline: "✕ Fermer la vidéo",
    ytHighlights: "Moments forts sur YouTube",
    goalSummary: (g) => `${g} ${g === 1 ? "but inscrit" : "buts inscrits"} :`,
    goalTab: (idx, min) => `But ${idx}${min ? ` (${min}')` : ""}`,
    shareSuccess: (d, g, m) => `Lionel Messi a marqué ${g} buts en ${m} matchs le jour de mon anniversaire (${d}) ! Vérifiez le vôtre :`,
    shareEmpty: (d) => `Messi a-t-il marqué le jour de votre anniversaire ? Il a marqué 292 des 366 jours de l'année ! Vérifiez le vôtre :`,
  };

export const LATEST_GOAL = {
    goalPrefix: "But n°",
    scoreline: "Score",
    didScoreTodayYes: "OUI ! Lionel Messi a marqué aujourd'hui : But n°{goalNum} à la {minute} contre {opp} ({score}) !",
    didScoreTodayNo: "Messi a-t-il marqué aujourd'hui ? Le match officiel le plus récent de Lionel Messi a eu lieu le {date} en {comp}, où il a inscrit le But n°{goalNum} de sa carrière à la {minute} pour sceller la victoire {score}. Visionnez le replay vidéo officiel ci-dessus.",
    matchResult: "Résultat du match le plus récent : {title}",
    goalBadge: "But n°{goalNum} inscrit ({minute})",
    playHighlight: "Sélectionnez l'un des buts récents de Lionel Messi ci-dessous pour lancer immédiatement la vidéo :",
    viewDateGoals: "Voir les buts du {formattedDate} →",
    tagHeader: "Tête 🔥",
    tagFreekick: "Coup franc direct 🔥",
    tagPenalty: "Penalty",
    tagLeftFoot: "Frappe du gauche",
    tagRightFoot: "Pied droit",
    tagOpenPlay: "Jeu ouvert",
    assist: "Passe décisive"
  };

export const ARG_STREAM = {
    badge: "🇦🇷 DERNIER MATCH AVEC L'ARGENTINE",
    title: "Match d'Adieu de Lionel Messi",
    text: "Le match d'adieu de Lionel Messi le 6 octobre 2026 ! Regardez le direct EN DIRECT gratuit et SANS PUB.",
    highlight: "Streaming gratuit en direct • Sans pub",
    cta: "Regarder le Direct ▶",
    closeAria: "Fermer la notification",
    matchCardTitle: "Match Historique d'Adieu • 6 Oct 2026",
    matchCardDesc: "Suivez le tout dernier match de Lionel Messi avec l'Argentine en direct sur Koora Live sans aucune publicité."
  };

export const EXPLORE_LANGS = [
    { href: "/fr/birthday", page: "birthday", t: "🎂 Messi a-t-il marqué le jour de votre anniversaire ?", d: (d) => `Recherchez parmi les 366 jours de l'année avec vidéos des ${n(d.totals.goals)} buts.` },
    { href: "/fr/messi-vs-ronaldo", page: "messi-vs-ronaldo", t: "🐐 Messi vs Messi Face-à-Face", d: () => `Statistiques historiques : ${n(LIVE.goals)} vs ${n(LIVE.rGoals)} buts, ${LIVE.trophies} vs ${LIVE.rTrophies} titres, 8 vs 5 Ballons d'Or.` },
    { href: "/fr/vs-real-madrid", page: "vs-real-madrid", t: "⚔️ Messi vs Real Madrid", d: () => "Tous les 26 buts dans le Clásico, 45 matchs, 14 passes décisives." },
    { href: "/fr/champions-league", page: "champions-league", t: "⭐ Bilan en Ligue des Champions", d: () => "129 buts en UEFA Champions League, 8 triplés et 4 titres européens." },
    { href: "/fr/latest-goal", page: "latest-goal", t: "⚽ Dernier but de Messi en vidéo", d: () => "Regardez la vidéo du dernier but de Messi, vérifiez s'il a marqué aujourd'hui et ses derniers buts." },
    { href: "/fr", page: "home", t: "Statistiques de Lionel Messi", d: (d) => `Les chiffres clés : ${n(d.totals.goals)} buts en ${n(d.totals.apps)} matchs officiels.` },
    { href: "/fr/dashboard", page: "dashboard", t: "Tableau de bord interactif", d: () => "Filtrez par Barcelone, PSG, Inter Miami ou Argentine." },
    { href: "/fr/timeline", page: "timeline", t: "Chronologie de sa carrière", d: () => "Chaque événement historique daté dans l'ordre chronologique." },
  ];

export const ERA_INTROS = {
    rosario: `Un jeune de 17 ans de Rosario entre en jeu contre l'Espanyol en octobre 2004, et en quelques mois le Camp Nou scande son nom. Son premier but arrive face à Albacete en mai d'un lob subtil sur une passe de Ronaldinho. En 2008, il décroche la médaille d'or olympique.`,
    peak: `Sextuplé historique en 2009. Quatre Ballons d'Or d'affilée. Puis 2012 : 91 buts sur une seule année civile, pulvérisant un record vieux de 40 ans — dont un quintuplé mémorable en Ligue des champions contre Leverkusen. Le plus grand sommet de l'histoire du jeu.`,
    msn: `Messi, Suárez et Neymar : le trio magique MSN terrasse l'Europe et signe un deuxième triplé historique en 2015 à Berlin. Une efficacité offensive inégalée.`,
    carry: `La légendaire remontada 6-1 contre le PSG en 2017, le maillot numéro 10 brandi au Santiago Bernabéu et un nouveau doublé Liga-Coupe en 2018, portant le club au sommet à chaque rencontre.`,
    farewell: `Un sixième Ballon d'Or, une ultime Coupe du Roi en 2021 et un adieu bouleversant au Camp Nou après 21 années légendaires au FC Barcelone.`,
    paris: `Deux titres de champion avec le PSG, un septième Ballon d'Or et la consécration suprême au Qatar le 18 décembre 2022 : champion du monde avec un doublé en finale. La carrière est complète.`,
    miami: `Trophée de Leagues Cup dès son premier mois, un huitième Ballon d'Or, une nouvelle Copa América et la marche vers les 1 000 buts en direct.`
  };

export const CABINET = [
    { title: "Coupe du Monde — 2022", sub: "Le couronnement suprême, Lusail 18 décembre 2022.", src: "/img/cab-wc.webp", w: 800, h: 600, pos: "50% 30%", alt: "Messi porté en triomphe lors de la victoire en Coupe du Monde 2022", cap: "Champions du Monde, Lusail 2022" },
    { title: "Ballon d'Or — 8", sub: "Le record absolu de huit : 2009–12, 2015, 2019, 2021, 2023.", src: "/img/cab-ballon.webp", w: 800, h: 600, pos: "50% 30%", alt: "Messi brandissant son huitième Ballon d'Or", cap: "Record de 8 Ballons d'Or" },
    { title: "Ligue des Champions — 4", sub: "2006, 2009, 2011, 2015 — toutes avec le Barça.", src: "/img/cab-ucl.webp", w: 800, h: 600, pos: "50% 25%", alt: "Messi célébrant la victoire en Ligue des Champions", cap: "Quadruple vainqueur de la C1 avec Barcelone" },
    { title: "Copa América — 2", sub: "Double champion continental consécutif, 2021 & 2024.", src: "/img/cab-copa.webp", w: 800, h: 600, pos: "50% 25%", alt: "Messi embrassant le trophée de la Copa América au Maracanã", cap: "Champions de la Copa América, Maracanã 2021" },
    { title: "Championnats d'Espagne — 10", sub: "Domination totale avec le FC Barcelone 2004–2019.", src: "/img/cab-liga.webp", w: 800, h: 600, pos: "50% 25%", alt: "Messi avec le trophée de La Liga", cap: "10 fois champion d'Espagne avec Barcelone" }
  ];
