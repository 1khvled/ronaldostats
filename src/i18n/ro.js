// RO dictionary — RonaldoStats
// Traducere românească a dicționarului EN (src/i18n/en.js).
// Structura este identică cu cea a sursei: aceleași 12 exporturi, în aceeași
// ordine, cu aceleași chei și aceleași semnături de funcții. Doar valorile
// text au fost traduse.
// Numerele rămân în cifre Western și cu același separator zecimal ca sursa;
// împărțirile provizorii păstrează avertismentul de metodă.

export const HOME = {
    locale: "ro-RO",
    shirt10: "Numărul 7 de pe tricou",
    head: (t, p, d) => `<b>${n(t.goals)} goluri</b> în <b>${n(t.apps)} meciuri de seniori</b> — pentru Sporting CP, Manchester United, Real Madrid, Juventus și ${esc(p.current.join(" și "))}. Campion al Ligii Campionilor și câștigător de cinci ori al trofeului Ballon d'Or, numărate cu mâna și verificate de două ori, la ${esc(d.lastUpdated)}.`,
    meta: (p, dob) => `${esc(p.name)}, născut la ${dob} în ${esc(p.birthplace)}. Are ${p.age} ani, joacă pe post de ${esc(p.position.toLowerCase())} și se află în prezent la ${esc(p.current.join(" și "))}.`,
    roleLabel: "Rol",
    teamsLabel: "Echipe",
    nowLabel: "Acum",
    kpiCareer: "Goluri în carieră",
    kpiCareerNote: (gpg, seasons) => `${gpg} goluri pe meci în ${seasons} sezoane de club.`,
    kpiApps: "Meciuri de seniori",
    kpiAppsNote: (clubs, country) => `${clubs} la cluburi, ${country} cu Portugalia.`,
    kpiArg: "Goluri cu Portugalia",
    kpiArgNote: (gpg, caps) => `${gpg} pe meci în ${caps} selecții.`,
    kpiTrophies: "Trofee de echipă",
    kpiTrophiesNote: (lang) => `Plus <b>5 trofee Ballon d'Or</b> și <b>4 Gantele de Aur europene</b>. <a href="/${lang}/achievements">Lista completă a palmaresului</a>.`,
    kpiRoad: "Drumul spre 1.000 de goluri",
    kpiRoadNote: (togo, projYear, pace) => `Mai sunt ${togo} de goluri. Estimare la ritmul actual (~${pace.toFixed(0)} pe an): pragul de 1.000 se atinge în jurul anului ${projYear}.`,
    copyStatsBtn: "Copiază cifrele principale",
    copyText: (goals, apps, clubGoals, argGoals, updated) => `Ronaldo: ${goals} goluri în ${apps} meciuri de seniori (${clubGoals} la cluburi, ${argGoals} cu Portugalia), ${LIVE.trophies} trofee de echipă la seniori, 5 trofee Ballon d'Or — la ${updated}.`,
    copyMsg: "Copiat — îl poți lipi oriunde.",
    clubCaption: (updated, lang) => `Apariții și goluri pentru fiecare echipă de seniori în care a jucat Cristiano Ronaldo, la ${updated}. Împărțirea pe competiții se găsește pe <a href="/${lang}/goalsbyseason">pagina golurilor pe sezon</a>.`,
    thTeam: "Echipă și ani",
    thApps: "Apariții",
    thGoals: "Goluri",
    thGpg: "Goluri pe meci",
    thTotal: "Total în carieră",
    yearSub: "Alege un an și urmărește cum crește totalul — de la debutul din 2002 până azi.",
    yearTitle: "Statisticile lui Ronaldo pe an calendaristic",
    yearLabel: "An",
    yearFigcap: (start, cur, prov, lang) => `Goluri pe an calendaristic, de ${start} la ${cur}${prov ? " (în curs)" : ""} — maximul de 69 în 2013. <a href="/${lang}/goalsbyyear">Deschide tabelul complet</a>.`,
    tileGoals: (year, prov) => `Goluri în ${year}${prov ? " (până acum)" : ""}`,
    tileTotal: (year) => `Total în carieră după ${year}`,
    tileAge: (year) => `Vârsta în ${year}`,
    records: (best, post30, pct) => [
      [`69`, `<b>Goluri în 2013</b>, cele mai multe marcate într-un singur an calendaristic — ${best.goals} în toate competițiile.`],
      [`5`, `<b>Trofee Ballon d'Or</b> (2008, 2013, 2014, 2016, 2017) — plus patru Gantele de Aur europene.`],
      [`311`, `<b>Goluri în La Liga</b> pentru Real Madrid, recordul absolut al competiției.`],
      [`140`, `<b>Goluri în Liga Campionilor</b> în 183 de apariții, recordul din istoria competiției.`],
      [post30, `<b>Goluri după împlinirea vârstei de 30 de ani</b> — aproximativ ${pct}% din totalul întregii cariere, marcate din 2015 încolo.`],
      [`66`, `<b>Triplete sau mai multe</b> pentru club și țară pe parcursul carierei de seniori (cifră provizorie).`],
      [`${LIVE.trophies}`, `<b>Trofee de echipă</b> — 32 cu cluburile și 3 cu Portugalia.`]
    ],
    silverCaption: () => `${LIVE.trophies} trofee de echipă la seniori, pe rând, plus principalele distincții individuale. Unele publicații menționează 36–37 pentru că numără diferit Supercupa UEFA și supercupele naționale — lista detaliată de aici însumează ${LIVE.trophies}.`,
    silverThTrophy: "Trofeu",
    silverThTimes: "Număr de ori",
    silverThNote: "Notă",
    silverRows: [
      ["Trofee de echipă — Real Madrid", "15", "2009–2018, inclusiv 4 titluri de Ligă a Campionilor"],
      ["Trofee de echipă — Manchester United", "9", "2003–2009, inclusiv Liga Campionilor și Campionatul Lumii al Fotbalului FIFA din 2008"],
      ["Trofee de echipă — Juventus", "5", "Serie A de două ori, Coppa Italia și 2 Supercoppa Italiana"],
      ["Trofee de echipă — Portugalia", "3", "Euro 2016, Liga Națiunilor 2019 și 2025"],
      ["Trofee de echipă — Al Nassr", "2", "Campionatul Cluburilor Arabe 2023, Saudi Pro League 2026"],
      ["Trofee de echipă — Sporting CP", "1", "Supertaça Cândido de Oliveira 2002"],
      ["Ballon d'Or", "5", "2008, 2013, 2014, 2016, 2017"]
    ],
    splitFk: "Goluri din lovituri libere",
    splitFkNote: "Marcate pentru club și pentru țară (cifră compusă, provizorie).",
    splitPen: "Goluri din penalty-uri",
    splitPenNote: "Puțin sub unul din cinci dintre toate golurile sale (cifră compusă, provizorie).",
    splitHt: "Triplete sau mai multe",
    splitHtNote: "Meciuri cu trei goluri sau mai mult, în toate competițiile.",
    splitCaveat: (tot) => `Împărțirea pe tipul finalizării — lovituri libere, penalty-uri — și pe partea corpului este o cifră compusă, răspândită în presa de specialitate, provizorie până la terminarea numărării manuale, meci cu meci. Totalul de ${tot} nu este afectat.`,
    faq: (t, agg, m, d, lang) => [
      ["Câte goluri a marcat Cristiano Ronaldo în total, în carieră?", `<b>${n(t.goals)} goluri oficiale în carieră</b> în ${n(t.apps)} meciuri de seniori pentru club și țară, la ${esc(d.lastUpdated)}, adică ${t.goalsPerGame} goluri pe meci. Vezi descompunerea completă pe <a href="/${lang}/goalsbyyear">ani, cu toate golurile</a>.`],
      ["Câte assisturi are Cristiano Ronaldo în carieră?", `Cristiano Ronaldo are <b>${n(LIVE.assists)} assisturi oficiale în carieră</b> — cifra compusă, publicată pe scară largă — și <b>${n(LIVE.tmAssists)} assisturi</b> după criteriile mai generoase ale Transfermarkt, în ${n(t.apps)} meciuri. Detalierea: ${n(d.totals?.assists?.byTeam?.real_madrid?.official || 152)} pentru Real Madrid, ${n(d.totals?.assists?.byTeam?.manchester_united?.official || 66)} pentru Manchester United, ${n(d.totals?.assists?.byTeam?.juventus?.official || 20)} pentru Juventus, ${n(d.totals?.assists?.byTeam?.al_nassr?.official || 9)} pentru Al Nassr și ${n(d.totals?.assists?.byTeam?.portugal?.official || 14)} pentru Portugalia.`],
      ["Care sunt totalurile de goluri și assisturi ale lui Cristiano Ronaldo?", `Pe parcursul carierei de seniori, Cristiano Ronaldo a adunat <b>${n(LIVE.ga)} contribuții directe la gol</b> (<b>${n(t.goals)} goluri</b> și <b>${n(LIVE.assists)} assisturi oficiale</b>) în ${n(t.apps)} meciuri — o medie de <b>0.93 contribuții directe la gol pe meci</b>. După criteriile Transfermarkt, totalul ajunge la <b>${n(LIVE.tmGa)} contribuții la gol</b> (${n(t.goals)} goluri + ${n(LIVE.tmAssists)} assisturi).`],
      ["Cine are statistici mai bune în toate timpurile, Ronaldo sau Messi?", `În meciurile oficiale de seniori, <b>Cristiano Ronaldo</b> deține recordul absolut de goluri cu <b>${n(t.goals)} goluri</b> și ${n(LIVE.assists)} assisturi în ${n(t.apps)} meciuri (${t.goalsPerGame} goluri pe meci), în timp ce Messi are <b>${n(LIVE.rGoals)} goluri</b> și 408 assisturi în 1,181 meciuri (0.79 goluri pe meci). Ronaldo a ajuns la ${n(t.goals)} goluri în <b>159 de meciuri mai puțin</b>, are ${LIVE.trophies} trofee de echipă la seniori față de cele ${LIVE.rTrophies} ale lui Messi și 5 trofee Ballon d'Or față de 8. Compară istoricul complet față în față pe <a href="/${lang}/ronaldo-vs-messi">pagina de statistici Ronaldo vs Messi</a>.`],
      ["Cum se împart golurile lui Ronaldo în carieră pe cluburi?", `<b>${n(t.clubs.goals)} goluri la cluburi</b> în ${n(t.clubs.apps)} meciuri de club — ` + ["Real Madrid", "Manchester United", "Juventus", "Al Nassr", "Sporting CP"].map((c) => {
        const rows = (d.clubSeasons || []).filter((s) => s.club === c);
        const apps = rows.reduce((a, s) => a + s.apps, 0);
        const goals = rows.reduce((a, s) => a + s.goals, 0);
        return `${c} ${n(goals)} în ${n(apps)}`;
      }).join(" · ") + ` — plus <b>${n(t.country.goals)} goluri</b> în ${n(t.country.apps)} selecții pentru Portugalia. Vezi <a href="/${lang}/goalsbyseason">statisticile pe club și sezon</a>.`],
      ["Câte goluri directe din lovituri libere a marcat Ronaldo?", `Cristiano Ronaldo a marcat <b>66 goluri directe din lovituri libere</b> în fotbalul de seniori, alături de <b>184 penalty-uri din 220 de încercări</b> și 731 goluri din acțiune — o cifră compusă, provizorie, până la terminarea numărării manuale complete.`],
      ["Câte triplete a marcat Ronaldo?", `Ronaldo a marcat <b>${n(d.hatTricks)} triplete în carieră</b> pentru club și țară (cifră provizorie), inclusiv <b>10 pentru Portugalia</b> — un record mondial pentru un jucător de reprezentativă.`],
      ["Câte goluri din penalty a marcat Ronaldo?", `Ronaldo a marcat <b>184 goluri din penalty</b> din 220 de încercări la club și pentru țară — o rată de conversie de 83.6%.`],
      ["Câte goluri fără penalty a marcat Cristiano Ronaldo?", `Ronaldo a marcat <b>${n(t.goals - (m?.penalties || 184))} goluri fără penalty</b> în ${n(t.apps)} meciuri (${((t.goals - (m?.penalties || 184)) / t.apps).toFixed(2)} goluri fără penalty pe meci) — 81% din tot ce a marcat vreodată.`],
      ["Câte goluri a marcat Ronaldo în 2013?", `<b>69 de goluri oficiale în 2013</b> (59 pentru Real Madrid și 10 pentru Portugalia) — cel mai mare an calendaristic al carierei sale și un an care a adus un triplet pentru Portugalia în 15 minute, împotriva Irlandei de Nord. Consultă <a href="/${lang}/goalsbyyear">statisticile pentru 2013</a>.`],
      ["Câte trofee a câștigat Cristiano Ronaldo?", `<b>${n(LIVE.trophies)} trofee de echipă la seniori</b> — 32 cu cluburile (Real Madrid 15, Manchester United 9, Juventus 5, Al Nassr 2, Sporting CP 1) și 3 cu Portugalia (Euro 2016, Liga Națiunilor 2019 și 2025), plus 5 trofee Ballon d'Or. Unele publicații menționează 36–37 pentru că numără diferit Supercupa UEFA și supercupele naționale. Vezi <a href="/${lang}/achievements">lista completă a trofeelor</a>.`],
      ["Câte trofee Ballon d'Or a câștigat Cristiano Ronaldo?", `Cristiano Ronaldo a câștigat <b>5 trofee Ballon d'Or</b> (2008, 2013, 2014, 2016, 2017) — prima în 2008, la 23 de ani, când a fost numit pe toate cele 96 de buletine de vot.`],
      ["Care este bilanțul lui Ronaldo împotriva lui Real Madrid?", `Bilanțul lui Ronaldo în El Clásico pentru Real Madrid este strâns împreună cu fiecare gol marcat împotriva lui Real Madrid în altă echipă pe <a href="/${lang}/vs-real-madrid">pagina Ronaldo vs Real Madrid</a>.`],
      ["Care sunt statisticile lui Ronaldo în UEFA Champions League?", `Ronaldo a marcat <b>140 de goluri în 183 de apariții în Liga Campionilor UEFA</b> — recordul absolut al competiției — cu <b>42 de assisturi</b>, și el record, și a câștigat 5 trofee (2008, 2014, 2016, 2017, 2018). Vezi toate datele pe <a href="/${lang}/champions-league">pagina Ligii Campionilor</a>.`],
      ["Care sunt statisticile lui Ronaldo la Campionatul Mondial FIFA?", `Ronaldo a jucat la <b>șase Campionate Mondiale FIFA</b> (2006, 2010, 2014, 2018, 2022 și 2026) și rămâne recordmanul de goluri al Portugaliei, cu <b>146 de goluri în 234 de selecții</b> — recordul absolut la nivel internațional.`],
      ["Cât de departe este Cristiano Ronaldo de 1.000 de goluri în carieră?", `Cu ${n(t.goals)} goluri, Ronaldo mai are nevoie de <b>${Math.max(0, 1000 - t.goals)} goluri</b> pentru a ajunge la 1.000 de goluri în carieră — un prag la care niciun jucător nu a ajuns în fotbalul oficial de seniori.`]
    ]
  };

export const BY_YEAR = {
    head: (ys, best, t) => `De la primul gol la seniori din ${ys[0].year} până la <b>${best.goals} în ${best.year}</b> — fiecare an calendaristic al unei cariere care a produs ${n(t.goals)} goluri, cu totaluri cumulate și vârstă.`,
    cap: (best, t) => `Bare: golurile acelui an (vârf ${best.goals}, în ${best.year}). Linie: drumul până la ${n(t.goals)}.`,
    chartLabel: (best) => `Golurile lui Ronaldo pe an calendaristic și totalul cumulat al carierei, cu un vârf de ${best.goals} în ${best.year}`,
    kpiCareer: "Goluri în carieră",
    kpiBest: "Cel mai bun an",
    kpiBestSub: "Cele mai multe goluri marcate într-un an calendaristic.",
    kpiCurrSub: "Sezon în curs.",
    kpiYears: "Ani cu goluri",
    kpiYearsSub: (ys, last) => `Fiecare an de la ${ys[0].year} la ${last.year}.`,
    decades: "Goluri în anii",
    tableSub: "Cele mai noi la început. 2026 este marcat cu o stea cât timp sezonul se desfășoară. Apasă pe o coloană pentru a sorta sau scrie pentru a filtra. Anii de vârf primesc o notă de subsol — trece cu mouse-ul peste an.",
    caption: "Goluri, total cumulat al carierei și vârstă pentru fiecare an calendaristic de la debutul lui Ronaldo din 2002.",
    thYear: "An", thGoals: "Goluri", thTotal: "Total în carieră", thAge: "Vârstă",
    inProgNote: "* Sezonul 2026 este în curs — se actualizează după fiecare meci.",
    filterPlaceholder: "Filtrează anii — de exemplu 2013",
    bestYearHtml: (best) => `<p><b>${best.year} este anul calendaristic cel mai productiv al carierei lui Ronaldo: ${best.goals} goluri</b> — 59 pentru Real Madrid și 10 pentru Portugalia. A adus al doilea Ballon d'Or, un sezon de club cu 55 de goluri și trei goluri pentru Portugalia în 15 minute, împotriva Irlandei de Nord.</p><p>Anii următori cei mai buni — 2012 (63), 2014 (61) și 2011 (60) — arată cât de ridicat a rămas standardul pe parcursul a cinci sezoane consecutive, între 2010 și 2014. <a href="/ro/dashboard">Vezi cum se împart aceste goluri pe competiții</a>.</p>`
  };

export const BY_SEASON = {
    head: (best) => `Fiecare sezon de club de la 2002/03 la 2026/27 — <b>cel mai bun: ${best.goals} goluri în ${best.season}</b> — cu împărțirea pe ligă, cupă și competiții continentale, plus Portugalia an cu an.`,
    clubSub: "Meciuri / goluri în fiecare format. 2026/27 este sezonul în curs. Apasă pe o coloană pentru a sorta sau scrie pentru a filtra.",
    caption: (len) => `Toate cele ${len} sezoane de club: Sporting CP 2002/03, Manchester United 2003/04–2008/09 și 2021/22–2022/23, Real Madrid 2009/10–2017/18, Juventus 2018/19–2021/22, Al Nassr 2022/23–2026/27.`,
    thSeason: "Sezon", thClub: "Club", thApps: "Meciuri", thGoals: "Goluri", thLeague: "Ligă", thCup: "Cupă", thCont: "Continental", thOther: "Altele",
    totalLabel: "Total la club", bestBadge: "Cel mai bun sezon de club",
    filterClubPlaceholder: "Filtrează sezoanele — de exemplu Real Madrid, 2012",
    countrySub: "Preliminare și turnee de calificare, plus meciurile amicale, cele mai noi la început.",
    countryCaption: "Golurile Portugaliei pe an calendaristic, 2003–2026.",
    thYear: "An", thNote: "Notă", totalArgLabel: "Total Portugalia",
    filterCountryPlaceholder: "Filtrează anii Portugaliei — de exemplu 2016",
    bestSeasonHtml: (best) => `<p><b>${best.season} — ${best.goals} goluri în ${best.apps} meciuri pentru ${best.club}</b> — este sezonul de club cel mai productiv al carierei sale: ${best.league.goals} în ligă, ${best.continental.goals} în Liga Campionilor, ${best.cup.goals} în cupă și ${best.other.goals} în supercupele de campioane. A marcat în fiecare competiție în care a intrat.</p><p>Îl depășește cu puțin pe legendarul 2011/12 — 60 de goluri, dintre care 46 în La Liga — într-o serie de șase sezoane la Madrid în care nu a coborât niciodată sub 51 de goluri la club. <a href="/ro/goalsbyyear">Aceleași goluri numărate pe an calendaristic</a>.</p>`
  };

export const DASH = {
  teamNames: { all: "toate echipele", real_madrid: "Real Madrid", manchester_united: "Manchester United", juventus: "Juventus", al_nassr: "Al Nassr", sporting_cp: "Sporting CP", portugal: "Portugalia" },
  pills: [["all", "Toate echipele"], ["real_madrid", "Real Madrid"], ["manchester_united", "Manchester United"], ["juventus", "Juventus"], ["al_nassr", "Al Nassr"], ["sporting_cp", "Sporting CP"], ["portugal", "Portugalia"]],
  head: (name) => `Fiecare gol al lui Ronaldo, tăiat în patru — pe competiție, sezon, tip de finalizare și parte a corpului — filtrat după <b>${esc(name)}</b>. Alege o echipă pentru a reface toate graficele.`,
  filterNote: (name, goals, apps, T) => `Afișăm ${name}: ${n(goals)} goluri în ${n(apps)} meciuri` + (T === "real_madrid" ? " (Liga Campionilor: 140 de goluri în 183 de apariții și 42 de assisturi — toate trei sunt recorduri ale competiției)." : "."),
  kpis: { goals: "Goluri", apps: "Apariții", gpg: "Goluri pe meci", forTeam: (name) => `Pentru ${name}.` },
  chartEmpty: "Nicio linie pentru acest filtru de echipă.",
  figCap: (T, name) => T === "all" ? "Ani calendaristici, 2002–2026." : ["portugal", "portugal_nt", "country"].includes(T) ? "Ani calendaristici ai Portugaliei." : "Sezoane de club pentru " + esc(name) + ".",
  finishParts: { "Open play": "Din acțiune", "Penalties": "Penalty-uri", "Free kicks": "Lovituri libere" },
  finishCenter: "goluri în carieră",
  finishCaveat: "Totaluri de carieră pentru toate echipele la un loc — nu există o împărțire pe echipe. Cifră compusă, provizorie.",
  finishCaveatFiltered: (d) => `Nu există o împărțire pe echipe pentru tipul finalizării, așa că acest grafic acoperă doar totalul tuturor echipelor — vezi totalurile de carieră de mai jos. Cei ${n(d.totals.goals)} goluri ai lui Ronaldo se împart în ${d.byFinish.openPlay} din acțiune, ${d.byFinish.penalties} penalty-uri și ${d.byFinish.freeKicks} lovituri libere (cifră compusă, provizorie).`,
  bodyParts: { "Left foot": "Picior stâng", "Right foot": "Picior drept", "Head": "Cap", "Other": "Altele" },
  bodyCenter: "goluri cu piciorul drept",
  bodyCaveat: "Totaluri de carieră pentru toate echipele la un loc — cifră compusă, provizorie, până la terminarea numărării manuale complete.",
  ageName: (r) => `Vârsta ${r.age} · ${r.year}`,
  ageCaveat: (apeak) => `Fiecare gol de seniori, după vârsta la care a fost marcat — club și țară la un loc. Vârf: ${apeak.goals} la vârsta de ${apeak.age} (${apeak.year}).`,
  ageFilterNote: "Vârstele amestecă golurile de club și cele pentru țară, așa că acest grafic acoperă întreaga carieră — golește filtrul de echipă pentru a-l vedea.",
  compCaption: (name) => `Goluri pe competiție — ${esc(name)}.`,
  thComp: "Competiție", thGoals: "Goluri", thShare: "Procent",
  recAllTime: "Record absolut al competiției",
  finishCaption: "Cum au fost marcate golurile și cu ce — totaluri de carieră, toate echipele.",
  thFinish: "Finalizare",
  finishCaveatTable: "Împărțirea pe finalizare și pe partea corpului este o cifră compusă, provizorie.",
  finishRows: (d) => [
    ["Din acțiune", d.byFinish.openPlay],
    ["Penalty-uri", d.byFinish.penalties],
    ["Lovituri libere", d.byFinish.freeKicks],
    ["Picior stâng", d.byBodyPart.left],
    ["Picior drept", d.byBodyPart.right],
    ["Cap", d.byBodyPart.head],
    ["Altele (piept etc.)", d.byBodyPart.other]
  ],
  teamCardSub: { goals: "goluri", apps: "meciuri", gpg: "pe meci", of: "din" },
  records: (comp, d) => [
    ["69", `<b>Goluri în 2013</b> — cele mai multe marcate într-un an calendaristic.`],
    [n(comp("La Liga")), `<b>Goluri în La Liga</b>, recordul absolut al competiției, toate pentru Real Madrid.`],
    ["140", `<b>Goluri în Liga Campionilor</b> — recordul din istoria competiției.`],
    ["5", `<b>Trofee Ballon d'Or</b> (2008, 2013, 2014, 2016, 2017).`],
    [n(d.hatTricks), `<b>Triplete sau mai multe</b> pentru club și țară (cifră provizorie).`],
    [`${LIVE.trophies}`, `<b>Trofee de echipă</b> — 32 cu cluburile, 3 cu Portugalia.`]
  ],
  method: "Cifrele pentru Liga Campionilor (140 de goluri în 183 de apariții, 42 de assisturi) sunt recorduri ale competiției, preluate din registrele clubului și ale UEFA; celelalte împărțiri pe competiții, filtrate după echipă, urmează maparea competițiilor pe sezoane de club și sunt documentate în fișierul de date."
};

export const TIMELINE = {
  head: (t) => `De la debutul cu Sporting CP în 2002 până la <b>${n(t.goals)} goluri în carieră</b> și tot mai departe — nopțile decisive, recordurile și trofeele, datate și în ordine.`,
  keydates: (t, lastUpdated) => [
    ["14 aug. 2002", "Debut la seniori pentru <b>Sporting CP</b> împotriva celor de la Inter, în turul trei de preliminar al Ligii Campionilor, la 17 ani."],
    ["20 aug. 2003", "Debut pentru <b>Portugalia</b> împotriva Kazahstanului, la câteva săptămâni după ce a preluat la Manchester United legenda numărului 7."],
    ["2008", "<b>Ballon d'Or</b> la 23 de ani, numit pe toate cele 96 de buletine de vot, cu Liga Campionilor și Campionatul Lumii al Fotbalului FIFA."],
    ["2013", "<b>69 de goluri</b> în anul calendaristic — recordul său personal, inclusiv un triplet pentru Portugalia în 15 minute."],
    ["2016", "Ridică <b>Campionatul European</b> ca căpitan al Portugaliei, cu trei goluri și Gantă de argint."],
    [esc(lastUpdated), `<b>${n(t.goals)} goluri în carieră</b> pentru club și țară — ultima verificare la această dată.`]
  ],
  inProg: "în curs",
  goals: "goluri",
  goalsInEra: (goals, share, total) => `<b>${n(goals)} goluri</b> · ${share}% din ${n(total)}`,
  peakYear: (pk, tr) => `<p class="ch-callout">An de vârf <b>${pk.year} · ${pk.goals} goluri</b>` + (tr ? ` · <b>${tr}</b> trofee de echipă câștigate în această perioadă` : "") + `</p>`,
  empty: (val, total) => `Nimic nu corespunde „${val}” — golește căutarea pentru a vedea toate cele ${total} repere.`,
  tagRecord: "Record", tagWc: "Campionat Mondial", tagFirst: "Primul",
  faq: [
    ["Când a debutat Ronaldo la seniori?", "Pentru <b>Sporting CP</b>, la <b>14 august 2002</b>, împotriva celor de la Inter, în turul trei de preliminar al Ligii Campionilor, la 17 ani; primele sale goluri la seniori au venit două luni mai târziu, împotriva celor de la Moreirense."],
    ["Când a marcat Ronaldo primul gol?", "Primul gol pentru Portugalia a fost un cap de gol împotriva <b>Greciei, la Euro 2004</b>; primul gol la Manchester United, în același an, a fost o lovitură liberă împotriva celor de la Portsmouth."],
    ["Când a câștigat Ronaldo prima Ligă a Campionilor?", "Prima oară în <b>2008</b>, cu Manchester United, apoi de patru ori la rând cu Real Madrid, în <b>2014, 2016, 2017 și 2018</b>."],
    ["Când a semnat Ronaldo pentru Real Madrid?", "În <b>iunie 2009</b>, pentru o sumă care era atunci record mondial — cu 80.000 de spectatori la Bernabéu la prezentare."],
    ["Când a ajuns Ronaldo la Al Nassr?", "În <b>ianuarie 2023</b>, debutând ca căpitan împotriva lui Al-Ettifaq și marcând de două ori într-un egal de 2–2."]
  ],
  method: "Intrările cronologiei sunt repere la nivel de an și de dată; barele de goluri pe etape împart anii calendaristici în intervale care nu se suprapun, astfel încât suma lor să redea totalul carierei."
};

export const ACH = {
  head: (teamTotal) => `<b>${teamTotal} trofee de echipă</b> — 32 cu cluburile și 3 cu Portugalia — plus <b>5 trofee Ballon d'Or</b>. Fiecare trofeu, pe rând, cu anii în care a fost câștigat.`,
  kpis: (per) => [
    ["Trofee de echipă", 35, `Real Madrid ${per["Real Madrid"] || 0} · Manchester United ${per["Manchester United"] || 0} · Juventus ${per["Juventus"] || 0} · Portugalia ${per["Portugal"] || 0}.`],
    ["Trofee Ballon d'Or", "5", "2008, 2013, 2014, 2016, 2017."],
    ["Gantele de Aur europene", "4", "2008, 2011, 2014, 2015."],
    ["Sezoane ca golgeter în Liga Campionilor", "7", "Golgeter în Liga Campionilor în 2008, apoi în fiecare sezon de la 2013 la 2018."]
  ],
  qa: (teamTotal, per) => [
    ["Câte trofee a câștigat Ronaldo?", `<b>${teamTotal} trofee de echipă la seniori</b>: ${per["Real Madrid"] || 0} Real Madrid, ${per["Manchester United"] || 0} Manchester United, ${per["Juventus"] || 0} Juventus, ${per["Al Nassr"] || 0} Al Nassr, ${per["Sporting CP"] || 0} Sporting CP și ${per["Portugal"] || 0} Portugalia.`],
    ["Câte trofee Ballon d'Or a câștigat Ronaldo?", "<b>Cinci</b> — 2008, 2013, 2014, 2016 și 2017, prima la 23 de ani."],
    ["A câștigat Ronaldo un trofeu internațional major?", "<b>Da</b> — Euro 2016 la UEFA, în calitate de căpitan, și Liga Națiunilor UEFA în 2019 și 2025."],
    ["De câte ori a câștigat Ronaldo Liga Campionilor?", "<b>Cinci</b>: 2008 cu Manchester United, apoi 2014, 2016, 2017 și 2018 cu Real Madrid."]
  ],
  teamHeader: (team, sub) => `${esc(team)} — ${sub} trofee`,
  indHeader: (indTotal) => `Distincții individuale — ${indTotal} premii`,
  faq: [
    ["Care este cel mai important trofeu al lui Ronaldo?", "<b>Campionatul European din 2016</b> — trofeul pe care l-a câștigat cu Portugalia la Paris, în calitate de căpitan, fiind al doilea cel mai bun marcator al turneului."],
    ["Câte titluri de ligă a câștigat Ronaldo?", "<b>Opt</b> — 3 Premier League, 2 La Liga, 2 Serie A și 1 Saudi Pro League, după cum sunt enumerate în lista de palmares din această arhivă."],
    ["Câte distincții individuale a câștigat Ronaldo?", "Cinci trofee Ballon d'Or, patru Gantele de Aur europene, trei premii UEFA de Jucătorul Anului, FIFA World Player of the Year în 2008, Premiul FIFA Puskás în 2009, Gantă de Aur la Euro 2020 și The Best FIFA Men's Player în 2016 și 2017."],
    ["Este Ronaldo cel mai decorat jucător din toate timpurile?", "După trofeele de echipă, Messi conduce cu 46, față de 35 ale lui Ronaldo. Ronaldo conduce în ceea ce privește recordurile de goluri — 981 de goluri, dintre care 140 în Liga Campionilor, și 146 de goluri în 234 de selecții pentru Portugalia."]
  ]
};

export const BDAY = {
    months: ["", "ianuarie", "februarie", "martie", "aprilie", "mai", "iunie", "iulie", "august", "septembrie", "octombrie", "noiembrie", "decembrie"],
    badgeSuccess: "🎉 Da! Ronaldo a marcat de ziua ta!",
    badgeMessi: "🎂 Ziua de naștere a lui CR7!",
    badgeEmpty: "Niciun gol în această dată",
    headlineSuccess: (g, m, d) => `Cristiano Ronaldo a marcat <b>${g} ${g === 1 ? "gol" : "goluri"}</b> în <b>${m} ${m === 1 ? "meci" : "meciuri"}</b> pe ${d}, de-a lungul carierei sale de seniori!`,
    headlineMessi: `Ai aceeași zi de naștere ca <b>Cristiano Ronaldo</b> (născut pe 5 februarie 1985, în Funchal, Madeira)!`,
    headlineEmpty: (d) => `Cristiano Ronaldo nu a marcat pe <b>${d}</b> în cariera sa de seniori.`,
    whyZeroTitle: "De ce 0 goluri?",
    whyZeroMessi: "5 februarie cade la mijlocul sezonului european de club, așa că pentru Ronaldo este de obicei o zi obișnuită de meci: programul și minutele jocate de el decid dacă se marchează un gol în data în care s-a născut.",
    whyZeroMessiSub: "Împarțiți ziua specială cu Cristiano Ronaldo — CR7, născut pe 5 februarie 1985.",
    emptyExpl: "Ronaldo nu a avut meci programat sau nu a marcat în această zi calendaristică — dar a marcat în majoritatea zilelor anului, la club și pentru țară.",
    closestDay: (d, g) => `Ziua calendaristică cea mai apropiată în care Ronaldo a marcat este <b>${d}</b> (${g} goluri în carieră).`,
    closestBtn: (d, g) => `Verifică ${d} (${g} goluri) &rarr;`,
    watchClip: (cnt) => `Urmărește ${cnt > 1 ? cnt + " secvențe cu goluri" : "secvența cu golul"}`,
    searchYt: "🔍 Caută reprizele",
    playInline: "📺 Redă în pagină",
    closeInline: "✕ Închide videoclipul",
    ytHighlights: "Reprize YouTube",
    goalSummary: (g) => `${g} ${g === 1 ? "gol marcat" : "goluri marcate"}:`,
    goalTab: (idx, min) => `Golul ${idx}${min ? ` (${min}')` : ""}`,
    shareSuccess: (d, g, m) => `Cristiano Ronaldo a marcat ${g} goluri în ${m} meciuri în ziua mea de naștere (${d})! Verifică-ți data:`,
    shareEmpty: (d) => `A marcat Cristiano Ronaldo de ziua ta de naștere? A marcat în majoritatea zilelor anului, la club și pentru țară. Verifică-zi data:`,
  };

export const LATEST_GOAL = {
    goalPrefix: "Golul nr.",
    scoreline: "Rezultat",
    didScoreTodayYes: "DA! Cristiano Ronaldo a marcat azi: golul nr. {goalNum} în minutul {minute}, împotriva celor de la {opp} ({score})!",
    didScoreTodayNo: "A marcat Ronaldo azi? Ultimul meci oficial al lui Cristiano Ronaldo s-a disputat pe {date}, în {comp}, unde a marcat golul nr. {goalNum} din carieră în minutul {minute}, pentru a închide la {score}. Urmărește mai jos videoclipul oficial al golului.",
    matchResult: "Rezultatul ultimului meci: {title}",
    goalBadge: "Golul nr. {goalNum} marcat ({minute})",
    playHighlight: "Alege oricare dintre cele mai recente goluri ale lui Cristiano Ronaldo de mai jos pentru a încărca instantaneu videoclipul în playerul de deasupra:",
    viewDateGoals: "Vezi golurile din {formattedDate} →",
    tagHeader: "Cap de gol 🔥",
    tagFreekick: "Lovitură liberă directă 🔥",
    tagPenalty: "Penalty",
    tagLeftFoot: "Șut cu piciorul stâng",
    tagRightFoot: "Picior drept",
    tagOpenPlay: "Din acțiune",
    assist: "Assist"
  };

export const ARG_STREAM = {
    badge: "🇵🇹 SERA PORTUGALIEI",
    title: "Cristiano Ronaldo și Portugalia",
    text: "Sera Portugaliei — urmărește TRANSMISIUNEA LIVE gratuit, FĂRĂ RECLAME.",
    highlight: "Transmisiune live gratuită • Fără reclame",
    cta: "Urmărește gratuit ▶",
    closeAria: "Închide notificarea",
    matchCardTitle: "Naționala Portugaliei • Seara meciului, în direct",
    matchCardDesc: "Urmărește live pe Koora Live meciul lui Cristiano Ronaldo și al Portugaliei — transmisiune gratuită, zero reclame."
  };

export const EXPLORE_LANGS = [
  { href: "/ro/birthday", page: "birthday", t: "🎂 A marcat Ronaldo de ziua ta de naștere?", d: (d) => `Caută în toate cele 366 de zile calendaristice, cu secvențe video, din cei ${n(d.totals.goals)} de goluri ai carierei sale de seniori.` },
  { href: "/ro/ronaldo-vs-messi", page: "ronaldo-vs-messi", t: "🐐 Ronaldo vs Messi, în toate timpurile", d: () => `Statistici față în față: ${n(LIVE.goals)} vs ${n(LIVE.rGoals)} goluri, ${LIVE.trophies} vs ${LIVE.rTrophies} trofee, 5 vs 8 trofee Ballon d'Or.` },
  { href: "/ro/vs-real-madrid", page: "vs-real-madrid", t: "⚔️ Ronaldo vs Real Madrid", d: () => "Fiecare gol al lui Ronaldo în Clásico și fiecare gol marcat împotriva lui Real Madrid în altă echipă." },
  { href: "/ro/champions-league", page: "champions-league", t: "⭐ Recordul în Liga Campionilor", d: () => "140 de goluri în UEFA Champions League, 42 de assisturi și 5 trofee europene." },
  { href: "/ro/latest-goal", page: "latest-goal", t: "⚽ Cel mai recent gol al lui Ronaldo, în video", d: () => "Urmărește videoclipul ultimului gol al lui Ronaldo, vezi dacă a marcat azi și vezi secvențele recente." },
  { href: "/ro", page: "home", t: "Statisticile carierei lui Ronaldo", d: (d) => `Cifrele principale: ${n(d.totals.goals)} goluri în ${n(d.totals.apps)} meciuri de seniori.` },
  { href: "/ro/dashboard", page: "dashboard", t: "Panoul statisticilor lui Ronaldo", d: () => "Filtrează fiecare grafic după Real Madrid, Manchester United, Juventus, Al Nassr, Sporting CP sau Portugalia." },
  { href: "/ro/timeline", page: "timeline", t: "Ronaldo de-a lungul anilor", d: () => "Fiecare reper al carierei, datat și în ordine, de la 2002 până azi." },
];

/* Deschiderile capitolelor pe etape. Rendererul caută mai întâi textul după
   slug-ul etapei (rosario, peak, msn, carry, farewell, paris, miami) și cade
   înapoi pe numele etapei, așa că ambele chei sunt mapate aici la același
   text despre Ronaldo — nu trebuie modificat app.js. */
export const ERA_INTROS = {
  "The boy from Rosario":
    `Cristiano Ronaldo a ajuns la Lisabona din Funchal, în Madeira, ca adolescent, cu o reputație de viteză și obiceiul de a cere mingea. Primul său sezon la seniori la Sporting CP a produs cinci goluri în 31 de apariții, iar în douăsprezece luni i-a fost înmântrânat legenda numărul 7 de la Manchester United, pentru 12.24 milioane de lire. A marcat în finala Cupei Angliei la 19 ani, a câștigat trei titluri de Premier League, Liga Campionilor și Campionatul Lumii al Fotbalului FIFA, iar în 2008 a fost desemnat cel mai bun jucător al lumii la 23 de ani — pe toate cele 96 de buletine de vot.`,
  "The greatest peak football has seen":
    `Real Madrid a plătit o sumă-record în 2009 și a primit cel mai scump talent ofensiv din istoria sportului. A răspuns cu un cap de gol în finala Copei del Rey împotriva Barcelonei în primul său sezon, apoi cu un titlu de La Liga câștigat cu un record de 100 de puncte și 46 de goluri în ligă. Până la sfârșitul lui 2012 ajunsese la 60 de goluri într-un an calendaristic și la 100 de goluri în La Liga pentru club, iar identitatea ofensivă a Madridului se reconstruia în jurul lui.`,
  "MSN and the second treble":
    `Trei sezoane la Madrid l-au dus pe Ronaldo dincolo de aproape fiecare bornă din carte. A marcat 69 de goluri în 2013, cel mai bun an calendaristic al carierei, inclusiv trei pentru Portugalia în cincisprezece minute împotriva Irlandei de Nord — unul dintre cele zece triplete internaționale, un record mondial. La Décima a venit în 2014, iar până la sfârșitul lui 2015, golul cu numărul 500 din carieră l-a lăsat în urmă pe fiecare marcator din istoria Ligii Campionilor.`,
  "Carrying Barcelona":
    `După Campionatul European din 2016, câștigat în Franța, Ronaldo a adăugat Liga Campionilor în 2017 — inclusiv un triplet împotriva celor de la Bayern München, care l-a dus la 100 de goluri în competiție — și un al cincilea Ballon d'Or în același sezon. A depășit-o pe Jimmy Greaves ca principal marcator în cele cinci ligi mari ale Europei, apoi a transferat la Juventus la 33 de ani și a marcat un triplet în primul său meci din Liga Campionilor de acolo.`,
  "Farewell to Barcelona":
    `Titlul Ligii Națiunilor și un loc în cartea recordurilor au venit în 2019, când golul cu numărul 700 din carieră a fost marcat împotriva Ucrainei, în octombrie. A 1.000-a apariție la seniori a urmat împotriva celor de la Cagliari, în februarie 2020, iar în 2021 a depășit-o pe Ali Daei și a devenit principalul marcator absolut al fotbalului internațional masculin, cu un al zecelea triplet internațional — un record mondial.`,
  "Paris and the World Cup":
    `Revenirea la Manchester United în 2021 i-a adus numărul 7 și o nouă scenă pentru cel mai în vârstă din vestiar, iar în 2022 a depășit-o pe Josef Bican cu un triplet împotriva lui Tottenham. Transferul în Arabia Saudită în ianuarie 2023 l-a făcut căpitanul lui Al Nassr și, la al 197-lea meci al reprezentativei, jucătorul cu cele mai multe selecții din istoria fotbalului internațional masculin.`,
  "Miami and the road to 1,000":
    `Al Nassr i-a oferit un început nou și un titlu în Saudi Pro League, dar recordurile au continuat să vină: golul cu numărul 900 în carieră, în Liga Națiunilor, în 2024, golul cu numărul 800 la club și golul cu numărul 100 pentru Al Nassr în 2025 — făcându-l primul jucător care a marcat 100 de goluri pentru patru cluburi — și, în 2026, golul cu numărul 500 marcat după împlinirea vârstei de 30 de ani și a șasea participare la Campionatul Mondial FIFA. Fiecare gol întinde acum curba spre 1.000.`
};
/* Chei alias: slug-urile etapelor (și slug-urile mai scurte ale etapelor lui
   Ronaldo) duc la aceleași șapte paragrafe, astfel încât capitolele
   cronologiei să se deschidă întotdeauna cu textul despre Ronaldo. */
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
    { title: "Portugalia și Campionatul Mondial FIFA", sub: "Șase Campionate Mondiale (2006–2026) și 146 de goluri în 234 de selecții pentru Portugalia.", src: "/img/cab-wc.webp", w: 800, h: 600, pos: "50% 30%", alt: "Cristiano Ronaldo în tricoul cu numărul 7 al Portugaliei la Cupa Mondială FIFA din 2018", cap: "Recordmanul de goluri al Portugaliei, la șase Campionate Mondiale" },
    { title: "Ballon d'Or — 5", sub: "2008, 2013, 2014, 2016, 2017 — primul la 23 de ani.", src: "/img/cab-ballon.webp", w: 800, h: 600, pos: "50% 30%", alt: "Cristiano Ronaldo ținând Balonul de Aur câștigat de un record de cinci ori", cap: "Cinci trofee Ballon d'Or" },
    { title: "Liga Campionilor — 5", sub: "140 de goluri, recordul competiției, în 183 de apariții.", src: "/img/cab-ucl.webp", w: 800, h: 600, pos: "50% 25%", alt: "Cupele Cuppei Europei și UEFA Champions League, câștigate de cinci ori de Cristiano Ronaldo", cap: "Cinci trofee europene și 140 de goluri în Liga Campionilor" },
    { title: "Campionatul Lumii al Fotbalului FIFA — 4", sub: "2008, 2014, 2016 și 2017, cu Manchester United și Real Madrid.", src: "/img/cab-cwc.webp", w: 800, h: 600, pos: "50% 25%", alt: "Trofee Golden Ball ale FIFA Club World Cup din muzeul CR7 din Madeira", cap: "Patru Campionate ale Lumii al Fotbalului FIFA" },
    { title: "La Liga — 311 goluri", sub: "Recordul absolut al competiției, toate pentru Real Madrid.", src: "/img/cab-liga.webp", w: 800, h: 600, pos: "50% 25%", alt: "Cristiano Ronaldo în tricoul cu numărul 7 al Real Madrid, într-o La Liga câștigată de două ori", cap: "311 goluri în La Liga pentru Real Madrid" }
  ];

export const BDAY_MEDIA = {
    "searchHighlights": "🔍 Caută reprizele",
    "openArchive": "Deschide în arhiva golurilor CR7",
    "noClip": "Nu există un clip publicat pentru acest gol.",
    "noClipBody": "Fișa meciului de mai jos provine din foile oficiale de meci. Linkurile deschid pagina golului în arhivă și o căutare a secvenței.",
    "clipLabel": "Clip publicat",
    "compilationNote": "Acest gol apare într-o compilație cu toate golurile. Folosiți linkul arhivei pentru poziția exactă.",
    "compilationLabel": "Compilație cu toate golurile",
    "publisher": "Publicat de",
    "assist": "Pasă: {name}",
    "finish": "Finalizare: {type}",
    "goalNumber": "Golul nr. {n}",
    "watchOn": "Vizionează pe {publisher}",
    "sourceLine": "Fișa golului: {source} — arhiva își ia lista din Wikipedia, List of senior career goals by Cristiano Ronaldo (CC BY-SA 4.0, construită pe jurnalul de goluri al FBref), și din StatsBomb open data. Clipurile sunt publicate de deținătorii drepturilor.",
    "sourceNote": "Datele, competițiile, scorurile, minutele, finalizările și pasele de pe această pagină provin din cr7allgoals.com, a cărui listă de goluri este cea din Wikipedia, List of senior career goals by Cristiano Ronaldo (CC BY-SA 4.0, construită pe jurnalul FBref), cu StatsBomb open data pentru detaliile meciurilor revizuite. Lista internațională este jurnalul de selecții al RSSSF: 146 goluri în 234 de selecții cu Portugalia. Unde minutul nu a fost publicat niciodată, acolo rămâne gol, nu inventat."
  };
