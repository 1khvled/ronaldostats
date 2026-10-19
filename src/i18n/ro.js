// RO dictionary — RonaldoStats
// Extracted verbatim from the original inline dictionaries by
// scripts/refactor-i18n.mjs. Structure is identical across all 9 languages.

export const HOME = {
    locale: "ro-RO",
    shirt10: "Numărul 10",
    head: (t, p, d) => `<b>${n(t.goals)} goluri oficiale</b> în <b>${n(t.apps)} meciuri de seniori</b> pentru Barcelona, PSG, Inter Miami și Argentina la ${esc(d.lastUpdated)}. Campion mondial și record de 8 Baloane de Aur.`,
    meta: (p, dob) => `${esc(p.name)}, născut la ${dob} în ${esc(p.birthplace)}. Are ${p.age} ani, atacant la ${esc(p.current.join(" și "))}.`,
    roleLabel: "Rol",
    teamsLabel: "Echipe",
    nowLabel: "În prezent",
    kpiCareer: "Goluri în carieră",
    kpiCareerNote: (gpg, seasons) => `${gpg} goluri pe meci în ${seasons} sezoane la club.`,
    kpiApps: "Meciuri oficiale",
    kpiAppsNote: (clubs, country) => `${clubs} la cluburi, ${country} cu Argentina.`,
    kpiArg: "Goluri pentru Argentina",
    kpiArgNote: (gpg, caps) => `${gpg} pe meci în ${caps} selecții.`,
    kpiTrophies: "Trofee de echipă",
    kpiTrophiesNote: (lang) => `Record absolut de ${LIVE.trophies} de trofee și 8 Baloane de Aur. <a href="/${lang}/achievements">Palmares complet</a>.`,
    kpiRoad: "Drumul spre 1.000 de goluri",
    kpiRoadNote: (togo, projYear, pace) => `Mai are nevoie de ${togo} goluri. În ritmul actual (~${pace.toFixed(0)} pe an), borna 1.000 va fi atinsă spre ${projYear}.`,
    copyStatsBtn: "Copiază statisticile",
    copyText: (goals, apps, clubGoals, argGoals, updated) => `Messi: ${goals} goluri în ${apps} meciuri oficiale (${clubGoals} la cluburi, ${argGoals} cu Argentina), ${LIVE.trophies} de trofee, 8 Baloane de Aur — la ${updated}.`,
    copyMsg: "Copiat în clipboard!",
    clubCaption: (updated, lang) => `Meciuri și goluri pentru fiecare echipă a lui Lionel Messi la ${updated}. Detalii complete pe <a href="/${lang}/goalsbyseason">pagina sezoanelor</a>.`,
    thTeam: "Echipă și ani",
    thApps: "Meciuri",
    thGoals: "Goluri",
    thGpg: "Goluri / Meci",
    thTotal: "Total carieră",
    yearSub: "Alege un an și urmărește ascensiunea totalului de goluri — de la debutul din 2004 până azi.",
    yearTitle: "Statisticile lui Messi pe ani calendaristici",
    yearLabel: "An",
    yearFigcap: (start, cur, prov, lang) => `Goluri pe an calendaristic, ${start} - ${cur}${prov ? " (în desfășurare)" : ""} — vârf de 91 în 2012. <a href="/${lang}/goalsbyyear">Tabel complet</a>.`,
    tileGoals: (year, prov) => `Goluri în ${year}${prov ? " (până acum)" : ""}`,
    tileTotal: (year) => `Total carieră după ${year}`,
    tileAge: (year) => `Vârsta în ${year}`,
    records: (best, post30, pct) => [
      [`91`, `<b>Goluri în 2012</b>, cel mai prolific an calendaristic din istoria fotbalului mondial — ${best.goals} goluri în total.`],
      [`8`, `<b>Baloane de Aur</b> (2009–12, 2015, 2019, 2021, 2023) — record mondial absolut.`],
      [`474`, `<b>Goluri în La Liga</b>, golgheterul all-time al campionatului spaniol.`],
      [`129`, `<b>Goluri în Champions League</b> — 120 pentru Barcelona și 9 pentru PSG, al doilea din istorie.`],
      [post30, `<b>Goluri după 30 de ani</b> — aproximativ ${pct}% din totalul golurilor sale din carieră.`],
      [`57`, `<b>Hat-trick-uri sau mai mult</b> la club și națională în cariera profesionistă.`],
      [`46`, `<b>Trofee colective</b> — cel mai titrat fotbalist din istorie, încununat de Cupa Mondială 2022.`]
    ],
    silverCaption: () => `${LIVE.trophies} de titluri oficiale de seniori, club cu club, plus distincțiile individuale supreme.`,
    silverThTrophy: "Trofeu",
    silverThTimes: "Nr.",
    silverThNote: "Detalii",
    silverRows: [
      ["Titluri cu Barcelona", "35", "2005 - 2021, inclusiv 4 Ligi ale Campionilor și 10 titluri La Liga"],
      ["Titluri cu Argentina", "5", "Cupa Mondială 2022, Copas América 2021 și 2024, Finalissima 2022, Aur Olimpic 2008"],
      ["Titluri cu PSG", "3", "Ligue 1 2022 și 2023, Supercupa Franței 2022"],
      ["Titluri cu Inter Miami", "4", "Leagues Cup 2023, Supporters' Shield 2024, MLS Cup 2025, Campeones Cup 2026"],
      ["Balonul de Aur", "8", "Record mondial — 2009–12, 2015, 2019, 2021, 2023"]
    ],
    splitFk: "Goluri din lovituri libere",
    splitFkNote: "Lovituri libere directe spectaculoase.",
    splitPen: "Goluri din penalty",
    splitPenNote: "Aproximativ un gol din opt din carieră.",
    splitHt: "Hat-trick-uri sau mai mult",
    splitHtNote: "Meciuri cu 3 sau mai multe goluri înscrise.",
    splitCaveat: (tot) => `Desfășurătorul pentru lovituri libere și penalty-uri este compilat oficial. Totalul de ${tot} goluri este 100% verificat.`,
    faq: (t, agg, m, d, lang) => [
      ["Câte goluri a marcat Lionel Messi în total?", `<b>${n(t.goals)} goluri oficiale</b> în ${n(t.apps)} meciuri la ${esc(d.lastUpdated)}, medie de ${t.goalsPerGame} goluri/meci. Vezi <a href="/${lang}/goalsbyyear">goluri pe ani</a>.`],
      ["Câte goluri a marcat Messi pentru Barcelona?", `<b>${n(agg.barcelona.goals)} goluri</b> în ${n(agg.barcelona.apps)} meciuri (2004-2021) — inclusiv recordul de 474 în La Liga.`],
      ["Câte goluri are pentru PSG și Inter Miami?", `<b>${agg.psg.goals} pentru Paris Saint-Germain</b> și <b>${n(agg.miami.goals)} pentru Inter Miami</b>.`],
      ["Câte goluri are Messi pentru Argentina?", `<b>${n(t.country.goals)} goluri</b> în ${n(t.country.apps)} meciuri internaționale din 2005.`],
      ["Care a fost cel mai bun an al lui Messi?", `<b>2012, cu 91 de goluri</b> — record mondial absolut. Vezi <a href="/${lang}/goalsbyyear">toți anii</a>.`],
      ["Câte trofee a câștigat Messi?", `<b>47 de titluri de echipă</b> (35 cu Barcelona, 3 cu PSG, 4 cu Inter Miami, 5 cu Argentina). Vezi <a href="/${lang}/achievements">palmaresul</a>.`]
    ]
  };

export const BY_YEAR = {
    head: (ys, best, t) => `De la primul său gol oficial în ${ys[0].year} până la <b>${best.goals} goluri în ${best.year}</b> — fiecare an dintr-o carieră de ${n(t.goals)} goluri.`,
    cap: (best, t) => `Bare: goluri în acel an (maxim ${best.goals} în ${best.year}). Linie: urcare până la ${n(t.goals)}.`,
    chartLabel: (best) => `Goluri pe an calendaristic`,
    kpiCareer: "Goluri în carieră",
    kpiBest: "Cel mai bun an",
    kpiBestSub: "Record mondial într-un an calendaristic.",
    kpiCurrSub: "Sezon în desfășurare.",
    kpiYears: "Ani cu gol",
    kpiYearsSub: (ys, last) => `Fiecare an de la ${ys[0].year} până la ${last.year}.`,
    decades: "Goluri în anii",
    tableSub: "Cele mai recente primele. 2026 este în desfășurare. Clic pe o coloană pentru sortare.",
    caption: "Goluri, total în carieră și vârstă pentru fiecare an din 2004 încoace.",
    thYear: "An", thGoals: "Goluri", thTotal: "Total carieră", thAge: "Vârstă",
    inProgNote: "* Sezonul 2026 în curs — se actualizează după fiecare meci.",
    filterPlaceholder: "Filtrează ani — ex. 2012",
    bestYearHtml: (best) => `<p><b>${best.year} este cel mai prolific an din istoria fotbalului: ${best.goals} goluri</b> — 79 pentru Barcelona și 12 pentru Argentina. <a href="/ro/dashboard">Vezi repartizarea în panou</a>.</p>`
  };

export const BY_SEASON = {
    head: (best) => `Toate sezoanele de club din 2004/05 până în 2026 — <b>record: ${best.goals} goluri în ${best.season}</b> — campionat, cupă și meciuri europene.`,
    clubSub: "Meciuri / goluri în fiecare format. 2026 este în desfășurare. Clic pe o coloană pentru sortare.",
    caption: (len) => `Toate cele ${len} sezoane de club: Barcelona, PSG și Inter Miami.`,
    thSeason: "Sezon", thClub: "Club", thApps: "Meciuri", thGoals: "Goluri", thLeague: "Campionat", thCup: "Cupă", thCont: "Europe", thOther: "Altele",
    totalLabel: "Total cluburi", bestBadge: "Cel mai bun sezon de club",
    filterClubPlaceholder: "Filtrează sezoane — ex. PSG, 2012",
    countrySub: "Meciuri oficiale și amicale, cele mai recente primele.",
    countryCaption: "Goluri pentru naționala Argentinei pe ani calendaristici, 2005–2026.",
    thYear: "An", thNote: "Detalii", totalArgLabel: "Total Argentina",
    filterCountryPlaceholder: "Filtrează anii Argentinei — ex. 2022",
    bestSeasonHtml: (best) => `<p><b>${best.season} — ${best.goals} goluri în ${best.apps} meciuri pentru Barcelona</b> — este cel mai prolific sezon de club din istorie: 50 în La Liga, 14 în Champions League. <a href="/ro/goalsbyyear">Vezi aceleași goluri pe ani</a>.</p>`
  };

export const DASH = {
    teamNames: { all: "toate echipele", barcelona: "Barcelona", psg: "PSG", miami: "Inter Miami", argentina: "Argentina" },
    pills: [["all", "Toate echipele"], ["barcelona", "Barcelona"], ["psg", "PSG"], ["miami", "Inter Miami"], ["argentina", "Argentina"]],
    head: (name) => `Toate cele 930 de goluri ale lui Lionel Messi analizate în 4 moduri — după competiție, sezon, tip de finalizare și parte a corpului — filtrate pentru <b>${esc(name)}</b>. Atinge o echipă pentru a actualiza graficele.`,
    filterNote: (name, goals, apps, T) => `Se afișează ${name}: ${n(goals)} goluri în ${n(apps)} meciuri` + (T === "barcelona" || T === "psg" ? " (Defalcare Champions League: Barcelona 120, PSG 9 — din surse oficiale ale cluburilor)." : "."),
    kpis: { goals: "Goluri", apps: "Meciuri", gpg: "Goluri pe meci", forTeam: (name) => `Pentru ${name}.` },
    chartEmpty: "Niciun rând pentru acest filtru de echipă.",
    figCap: (T, name) => T === "all" ? "Ani calendaristici, 2004 până în 2026." : T === "argentina" ? "Ani calendaristici cu Argentina." : "Sezoane de club pentru " + esc(name) + ".",
    finishParts: { "Open play": "Acțiune deschisă", "Penalties": "Penalty-uri", "Free kicks": "Lovituri libere" },
    finishCenter: "goluri carieră",
    finishCaveat: "Totaluri de carieră combinate pentru toate echipele. Numărătoare oficială verificată.",
    finishCaveatFiltered: (d) => `Nu există o defalcare pe echipe — vezi totalurile de carieră de mai jos. Din cele ${n(d.totals.goals)} goluri oficiale: ${d.byFinish.openPlay} din acțiune, ${d.byFinish.penalties} penalty-uri și ${d.byFinish.freeKicks} lovituri libere.`,
    bodyParts: { "Left foot": "Piciorul stâng", "Right foot": "Piciorul drept", "Head": "Cap", "Other": "Altele (piept, etc.)" },
    bodyCenter: "cu piciorul stâng",
    bodyCaveat: "Totaluri de carieră combinate pentru toate echipele (numărătoare oficială verificată).",
    ageName: (r) => `Vârsta ${r.age} · ${r.year}`,
    ageCaveat: (apeak) => `Fiecare gol oficial în funcție de vârsta la care l-a marcat — cluburi și națională combinate. Vârf: ${apeak.goals} la vârsta de ${apeak.age} ani (${apeak.year}).`,
    ageFilterNote: "Vârstele combină golurile de club și națională, așa că acest grafic acoperă doar întreaga carieră — ștergeți filtrul pentru a-l vedea.",
    compCaption: (name) => `Goluri după competiție — ${esc(name)}.`,
    thComp: "Competiție", thGoals: "Goluri", thShare: "Procent",
    recAllTime: "Recordul all-time al competiției",
    finishCaption: "Cum au fost marcate golurile și cu ce parte a corpului — totaluri din carieră, toate echipele.",
    thFinish: "Finalizare / Partea corpului",
    finishCaveatTable: "Defalcarea pe tip de finalizare și parte a corpului este o numărătoare oficială verificată.",
    finishRows: (d) => [
      ["Acțiune deschisă", d.byFinish.openPlay],
      ["Penalty-uri", d.byFinish.penalties],
      ["Lovituri libere directe", d.byFinish.freeKicks],
      ["Piciorul stâng", d.byBodyPart.left],
      ["Piciorul drept", d.byBodyPart.right],
      ["Cap", d.byBodyPart.head],
      ["Altele (piept etc.)", d.byBodyPart.other]
    ],
    teamCardSub: { goals: "goluri", apps: "meciuri", gpg: "pe meci", of: "din" },
    records: (comp, d) => [
      ["91", `<b>Goluri în 2012</b> — recordul mondial oficial într-un an calendaristic.`],
      [n(comp("La Liga")), `<b>Goluri în La Liga</b> — recordul all-time al competiției, toate pentru Barcelona.`],
      [n(comp("UEFA Champions League")), `<b>Goluri în Champions League</b> — 120 pentru Barcelona, 9 pentru PSG.`],
      ["8", `<b>Baloane de Aur</b> — recordul all-time în fotbal (2009–12, 2015, 2019, 2021, 2023).`],
      [n(d.hatTricks), `<b>Hat-trick-uri sau mai mult</b> pentru club și națională.`],
      [`${LIVE.trophies}`, `<b>Trofee oficiale</b> — cel mai titrat fotbalist din istoria fotbalului.`]
    ],
    method: "Golurile din Champions League sunt împărțite în Barcelona 120 și PSG 9 conform documentelor oficiale ale cluburilor."
  };

export const TIMELINE = {
    head: (t) => `De la debutul la Barcelona în 2004 până la <b>${n(t.goals)} goluri în carieră</b> — nopțile istorice, recordurile și trofeele în ordine.`,
    keydates: (t, lastUpdated) => [
      ["16 Oct 2004", "Debutul oficial pentru <b>Barcelona</b> împotriva lui Espanyol, la 17 ani."],
      ["1 Mai 2005", "Primul gol oficial, împotriva lui Albacete — cel mai tânăr marcator al Barcelonei la acea dată."],
      ["17 Aug 2005", "Debutul pentru naționala <b>Argentinei</b> împotriva Ungariei."],
      ["2012", "<b>91 de goluri</b> într-un an calendaristic — recordul mondial all-time al fotbalului."],
      ["18 Dec 2022", "Câștigă <b>Cupa Mondială</b> cu Argentina în Qatar, marcând de două ori în finală."],
      [esc(lastUpdated), `<b>${n(t.goals)} goluri oficiale</b> pentru club și națională — ultima verificare.`]
    ],
    inProg: "în desfășurare",
    goals: "goluri",
    goalsInEra: (goals, share, total) => `<b>${n(goals)} goluri</b> · ${share}% din ${n(total)}`,
    peakYear: (pk, tr) => `<p class="ch-callout">An de vârf <b>${pk.year} · ${pk.goals} goluri</b>` + (tr ? ` · <b>${tr}</b> ${tr === 1 ? "trofeu colectiv" : "trofee colective"} câștigate în această perioadă` : "") + `</p>`,
    empty: (val, total) => `Niciun rezultat pentru “${val}” — ștergeți căutarea pentru toate cele ${total} repere.`,
    tagRecord: "Record", tagWc: "Mondial", tagFirst: "Primul",
    faq: [
      ["Când a debutat Messi?", "Pentru Barcelona pe <b>16 octombrie 2004</b> contra lui Espanyol la 17 ani; pentru Argentina pe 17 august 2005."],
      ["Când a marcat Messi primul său gol?", "Pe <b>1 mai 2005</b> împotriva lui Albacete — cel mai tânăr marcator din istoria clubului la acea vreme."],
      ["Când a câștigat Messi Cupa Mondială?", "Pe <b>18 decembrie 2022</b>, învingând Franța la loviturile de departajare după o remiză 3–3 la Lusail."],
      ["Când a plecat Messi de la Barcelona?", "În <b>august 2021</b>, semnând cu Paris Saint-Germain după 21 de ani la club."],
      ["Când a ajuns Messi la Inter Miami?", "În <b>iulie 2023</b>, câștigând Leagues Cup la câteva săptămâni de la sosire."]
    ],
    method: "Cronologia conține repere la nivel de zi și an; barele de goluri însumează exact totalul carierei."
  };

export const ACH = {
    head: (teamTotal) => `<b>${teamTotal} trofee colective</b> — cea mai decorată carieră din istoria fotbalului — plus un record de <b>8 Baloane de Aur</b>.`,
    kpis: (per) => [
      ["Trofee colective", 46, `Barcelona ${per["Barcelona"] || 0} · Argentina ${per["Argentina"] || 0} · PSG ${per["Paris Saint-Germain"] || 0} · Miami ${per["Inter Miami"] || 0}.`],
      ["Baloane de Aur", "8", "Record — 2009–12, 2015, 2019, 2021, 2023."],
      ["Ligi ale Campionilor", "4", "2006, 2009, 2011, 2015 — toate cu Barcelona."],
      ["Turnee internaționale majore", "3", "Cupa Mondială 2022, Copas América 2021 & 2024."]
    ],
    qa: (teamTotal, per) => [
      ["Câte trofee a câștigat Messi?", `<b>${teamTotal} titluri oficiale la seniori</b>: ${per["Barcelona"] || 0} la Barcelona, ${per["Paris Saint-Germain"] || 0} la PSG, ${per["Inter Miami"] || 0} la Inter Miami și ${per["Argentina"] || 0} la națională.`],
      ["Câte Baloane de Aur are Messi?", "<b>Opt</b> — mai mult decât orice alt jucător din istorie (2009–12, 2015, 2019, 2021, 2023)."],
      ["A câștigat Messi Cupa Mondială?", "<b>Da — 2022</b>, marcând de două ori în finala împotriva Franței, plus Copas América în 2021 și 2024."],
      ["Câte Ligi ale Campionilor are Messi?", "<b>Patru</b>, toate cu Barcelona: 2006, 2009, 2011 și 2015."]
    ],
    teamHeader: (team, sub) => `${esc(team)} — ${sub} trofee`,
    indHeader: (indTotal) => `Distincții individuale — ${indTotal} premii`,
    faq: [
      ["Care este cel mai important trofeu al lui Messi?", "<b>Cupa Mondială 2022</b> — cel mai râvnit titlu al carierei sale, cucerit fiind desemnat cel mai bun jucător al turneului."],
      ["Câte titluri de campion are Messi?", "<b>12 titluri de ligă</b> — 10 La Liga, 2 Ligue 1 — plus Supporters' Shield cu Miami."],
      ["Câte premii individuale a câștigat Messi?", "8 Baloane de Aur, 6 Ghete de Aur și două Baloane de Aur la Cupa Mondială — fiecare fiind un record."],
      ["Este Messi cel mai titrat jucător din toate timpurile?", "Prin cumulul titlurilor de echipă și recordurilor individuale — <b>da, fără îndoială</b>."]
    ]
  };

export const BDAY = {
    months: ["", "Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"],
    badgeSuccess: "🎉 Da! Messi a marcat de ziua ta de naștere!",
    badgeMessi: "🎂 Ziua de naștere a lui Leo Messi însuși!",
    badgeEmpty: "Niciun gol la această dată",
    headlineSuccess: (g, m, d) => `Lionel Messi a marcat <b>${g} ${g === 1 ? "gol" : "goluri"}</b> în <b>${m} ${m === 1 ? "meci" : "meciuri"}</b> pe ${d} de-a lungul carierei sale de senior!`,
    headlineMessi: `Îți împarți ziua de naștere cu <b>Lionel Andrés Messi</b> (născut pe 24 iunie 1987 la Rosario)!`,
    headlineEmpty: (d) => `Lionel Messi nu a marcat pe <b>${d}</b> în timpul carierei sale de senior.`,
    whyZeroTitle: "De ce 0 goluri?",
    whyZeroMessi: "Lionel Messi nu a disputat niciun meci oficial pe 24 iunie, deoarece sfârșitul lunii iunie coincide cu vacanța de vară a cluburilor europene sau cu zile de pauză între meciurile turneelor internaționale.",
    whyZeroMessiSub: "Îți împarți ziua specială cu cel mai mare fotbalist din istorie!",
    emptyExpl: "Messi nu a avut meci programat sau nu a marcat în această zi — dar a marcat în <b>292 din cele 366 de zile (79,8%)</b> ale anului!",
    closestDay: (d, g) => `Cea mai apropiată zi calendaristică în care Messi a marcat este <b>${d}</b> (${g} goluri în carieră).`,
    closestBtn: (d, g) => `Vezi ${d} (${g} goluri) &rarr;`,
    watchClip: (cnt) => `Vezi ${cnt > 1 ? cnt + " videoclipuri cu goluri" : "videoclipul golului"}`,
    searchYt: "🔍 Caută pe YouTube",
    playInline: "📺 Redă aici",
    closeInline: "✕ Închide videoclipul",
    ytHighlights: "Rezumat pe YouTube",
    goalSummary: (g) => `${g} ${g === 1 ? "gol marcat" : "goluri marcate"}:`,
    goalTab: (idx, min) => `Gol ${idx}${min ? ` (${min}')` : ""}`,
    shareSuccess: (d, g, m) => `Lionel Messi a marcat ${g} goluri în ${m} meciuri de ziua mea (${d})! Verifică data ta:`,
    shareEmpty: (d) => `A marcat Messi de ziua ta de naștere? A marcat în 292 din 366 de zile ale anului! Verifică:`,
  };

export const LATEST_GOAL = {
    goalPrefix: "Golul #",
    scoreline: "Scor",
    didScoreTodayYes: "DA! Lionel Messi a marcat astăzi: Golul #{goalNum} în minutul {minute} împotriva {opp} ({score})!",
    didScoreTodayNo: "A marcat Messi azi? Cel mai recent meci oficial al lui Lionel Messi a avut loc pe {date} în {comp}, unde a marcat Golul #{goalNum} al carierei în minutul {minute} pentru victoria cu {score}. Urmăriți reluarea video oficială mai sus.",
    matchResult: "Rezultatul celui mai recent meci: {title}",
    goalBadge: "Golul #{goalNum} marcat ({minute})",
    playHighlight: "Selectați oricare dintre golurile recente ale lui Lionel Messi de mai jos pentru a urmări clipul video în player:",
    viewDateGoals: "Vezi golurile din {formattedDate} →",
    tagHeader: "Lovitură de cap 🔥",
    tagFreekick: "Lovitură liberă directă 🔥",
    tagPenalty: "Penalty",
    tagLeftFoot: "Șut cu piciorul stâng",
    tagRightFoot: "Piciorul drept",
    tagOpenPlay: "Acțiune de joc",
    assist: "Pasă decisivă"
  };

export const ARG_STREAM = {
    badge: "🇦🇷 ULTIMUL MECI CU ARGENTINA",
    title: "Meciul de Adio al lui Lionel Messi",
    text: "Meciul de adio al lui Lionel Messi pe 6 octombrie 2026! Urmărește transmisiunea LIVE gratuit și FĂRĂ RECLAME.",
    highlight: "Transmisiune live gratuită • Fără reclame",
    cta: "Vezi Transmisiunea Gratuită ▶",
    closeAria: "Închide notificarea",
    matchCardTitle: "Meci Istoric de Adio • 6 Oct 2026",
    matchCardDesc: "Urmărește ultimul meci al lui Lionel Messi pentru Argentina în direct pe Koora Live, fără reclame."
  };

export const EXPLORE_LANGS = [
    { href: "/ro/birthday", page: "birthday", t: "🎂 A marcat Messi de ziua ta de naștere?", d: (d) => `Caută în toate cele 366 de zile din an cu cele ${n(d.totals.goals)} goluri ale lui Messi.` },
    { href: "/ro/messi-vs-ronaldo", page: "messi-vs-ronaldo", t: "🐐 Messi vs Messi All-Time", d: () => `Statistici cap la cap: ${n(LIVE.goals)} vs ${n(LIVE.rGoals)} goluri, ${LIVE.trophies} vs ${LIVE.rTrophies} trofee, 8 Baloane de Aur.` },
    { href: "/ro/vs-real-madrid", page: "vs-real-madrid", t: "⚔️ Messi vs Real Madrid", d: () => "Toate cele 26 de goluri din El Clásico, 45 de meciuri, 14 pase de gol." },
    { href: "/ro/champions-league", page: "champions-league", t: "⭐ Recordul în Champions League", d: () => "129 de goluri în UEFA Champions League, 8 hat-trick-uri și 4 trofee europene." },
    { href: "/ro/latest-goal", page: "latest-goal", t: "⚽ Ultimul gol al lui Messi video", d: () => "Urmărește videoclipul ultimului gol al lui Messi, vezi dacă a marcat azi și cele mai recente goluri." },
    { href: "/ro", page: "home", t: "Statisticile lui Lionel Messi", d: (d) => `Cifrele cheie: ${n(d.totals.goals)} goluri în ${n(d.totals.apps)} meciuri oficiale.` },
    { href: "/ro/dashboard", page: "dashboard", t: "Panoul interactiv de statistici", d: () => "Filtrează pe Barcelona, PSG, Inter Miami sau Argentina." },
    { href: "/ro/timeline", page: "timeline", t: "Cronologia carierei", d: () => "Fiecare moment istoric datat din 2004 până azi." },
  ];

export const ERA_INTROS = {
    rosario: `La doar 17 ani, tânărul din Rosario debutează contra lui Espanyol în octombrie 2004. Primul gol oficial vine în mai 2005 împotriva lui Albacete, dintr-o pasă a lui Ronaldinho, iar în 2008 cucerește aurul olimpic.`,
    peak: `Șase trofee în 2009. Patru Baloane de Aur consecutive. Apoi anul 2012: 91 de goluri într-un singur an calendaristic, doborând un record vechi de 40 de ani.`,
    msn: `Messi, Suárez și Neymar — tridentul legendar MSN cucerește a doua triplă istorică în 2015 la Berlin. O forță ofensivă de neoprit.`,
    carry: `Remontada istorică 6–1 cu PSG în 2017, celebrarea legendară cu tricoul ridicat pe Bernabéu și o nouă dublă titlu-cupă în 2018.`,
    farewell: `Al șaselea Balon de Aur, Cupa Regelui din 2021 și emoționanta despărțire de Camp Nou după 21 de ani legendari la Barcelona.`,
    paris: `Două titluri de campion la Paris, al șaptelea Balon de Aur și gloria supremă în Qatar pe 18 decembrie 2022: Cupa Mondială ridicată deasupra capului cu o dublă în finală.`,
    miami: `Câștigarea Leagues Cup chiar din prima lună, al optulea Balon de Aur, o nouă Copa América cu Argentina și marșul istoric spre 1.000 de goluri oficiale.`
  };

export const CABINET = [
    { title: "Cupa Mondială — 2022", sub: "Gloria supremă a fotbalului, Lusail 18 dec 2022.", src: "/img/cab-wc.webp", w: 800, h: 600, pos: "50% 30%", alt: "Messi purtat pe brațe sărbătorind Cupa Mondială 2022 la Lusail", cap: "Campioni mondiali, Lusail 2022" },
    { title: "Balonul de Aur — 8", sub: "Recordul de opt: 2009–12, 2015, 2019, 2021, 2023.", src: "/img/cab-ballon.webp", w: 800, h: 600, pos: "50% 30%", alt: "Messi ridicând al optulea Balon de Aur", cap: "Record istoric de 8 Baloane de Aur" },
    { title: "Liga Campionilor — 4", sub: "2006, 2009, 2011, 2015 — toate cu Barcelona.", src: "/img/cab-ucl.webp", w: 800, h: 600, pos: "50% 25%", alt: "Messi sărbătorind câștigarea Ligii Campionilor", cap: "De patru ori campion al Europei cu Barcelona" },
    { title: "Copa América — 2", sub: "Dublu campion continental consecutiv, 2021 și 2024.", src: "/img/cab-copa.webp", w: 800, h: 600, pos: "50% 25%", alt: "Messi sărutând trofeul Copa América pe Maracanã", cap: "Campioni Copa América, Maracanã 2021" },
    { title: "Titluri La Liga — 10", sub: "Dominație internă cu FC Barcelona 2004–2019.", src: "/img/cab-liga.webp", w: 800, h: 600, pos: "50% 25%", alt: "Messi cu trofeul La Liga", cap: "De 10 ori campion al Spaniei cu Barcelona" }
  ];
