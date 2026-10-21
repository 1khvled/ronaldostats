// UZ dictionary — RonaldoStats
// Extracted verbatim from the original inline dictionaries by
// scripts/refactor-i18n.mjs. Structure is identical across all 9 languages.
// Copy rewritten for Cristiano Ronaldo (RonaldoStats, https://www.ronaldostats.site).
// Numbers follow the verified dataset in public/data/ronaldo-data.json and the
// canonical Ronaldo fact list; provisional splits keep their caveat wording.

export const HOME = {
    locale: "uz-UZ",
    shirt10: "7-raqamli futbolka",
    head: (t, p, d) => `<b>${n(t.goals)} ta gol</b> <b>${n(t.apps)} ta rasmiy oʻyinda</b> — Sporting CP, Manchester United, Real Madrid, Juventus va ${esc(p.current.join(" va "))} safida. Yevropa championi va 5 karra Ballon d'Or sohibi — qoʻlda sanalgan va ikki marta tekshirilgan — ${esc(d.lastUpdated)} holatiga.`,
    meta: (p, dob) => `${esc(p.name)}, ${dob} da ${esc(p.birthplace)} shahrida tugʻilgan. Yoshi ${p.age}, ${esc(p.position.toLowerCase())} pozitsiyasida oʻynaydi va hozirda ${esc(p.current.join(" va "))} jamoasida.`,
    roleLabel: "Rol",
    teamsLabel: "Jamoalar",
    nowLabel: "Hozirda",
    kpiCareer: "Kariera gollari",
    kpiCareerNote: (gpg, seasons) => `Har oʻyinda ${gpg} ta gol — ${seasons} klub mavsumida.`,
    kpiApps: "Rasmiy oʻyinlar",
    kpiAppsNote: (clubs, country) => `${clubs} ta klub, Portugaliya safida ${country} ta.`,
    kpiArg: "Portugaliya safidagi gollar",
    kpiArgNote: (gpg, caps) => `Har oʻyinga ${gpg} ta gol — ${caps} ta milliy oʻyinda.`,
    kpiTrophies: "Jamoaviy sovrinlar",
    kpiTrophiesNote: (lang) => `Yana <b>5 ta Ballon d'Or</b> va <b>4 ta Yevropa Oltin choyoni</b>. <a href="/${lang}/achievements">Toʻliq faxr roʻyxati</a>.`,
    kpiRoad: "1,000 ta gol sari",
    kpiRoadNote: (togo, projYear, pace) => `Yana ${togo} ta gol kerak. Hozirgi surʻatda (yiliga ~${pace.toFixed(0)} ta) taxminiy hisob: 1,000-gol ${projYear}-yilga toʻgʻri keladi.`,
    copyStatsBtn: "Asosiy statistikani nusxalash",
    copyText: (goals, apps, clubGoals, argGoals, updated) => `Ronaldo: ${goals} ta gol — ${apps} ta rasmiy oʻyinda (${clubGoals} klub, ${argGoals} Portugaliya), ${LIVE.trophies} ta jamoaviy sovrin, 5 ta Ballon d'Or — ${updated} holatiga.`,
    copyMsg: "Nusxalandi — hohlagan joyga qoʻying.",
    clubCaption: (updated, lang) => `Kristiano Ronaldo oʻynagan har bir rasmiy jamoadagi oʻyinlar va gollar, ${updated} holatiga. Toʻliq musobaqa taqsimoti esa <a href="/${lang}/goalsbyseason">mavsumlar boʻyicha gollar sahifasida</a>.`,
    thTeam: "Jamoa va yillar",
    thApps: "Oʻyinlar",
    thGoals: "Gollar",
    thGpg: "Oʻyinga toʻgʻri gol",
    thTotal: "Kariera jami",
    yearSub: "Yilni tanlang va jami koʻrsatkichning koʻtarilishini kuzating — 2002-yildagi debyutidan bugungi kungacha.",
    yearTitle: "Ronaldo statistikasi taqvim yillari boʻyicha",
    yearLabel: "Yil",
    yearFigcap: (start, cur, prov, lang) => `Taqvim yillari boʻyicha gollar, ${start}-yildan ${cur}-yilgacha${prov ? " (davom etmoqda)" : ""} — 69 ta gol bilan choʻqqiga chiqqan, 2013-yilda. <a href="/${lang}/goalsbyyear">Toʻliq jadvalni ochish</a>.`,
    tileGoals: (year, prov) => `${year}-yildagi gollar${prov ? " (shu vaqtgacha)" : ""}`,
    tileTotal: (year) => `${year}-yildan keyingi kariera jami`,
    tileAge: (year) => `${year}-yildagi yoshi`,
    records: (best, post30, pct) => [
      [`69`, `<b>2013-yildagi gollar</b> — bir taqvim yilida urgan eng koʻp goli — barcha musobaqalarda ${best.goals} ta.`],
      [`5`, `<b>Ballon d'Or</b> (2008, 2013, 2014, 2016, 2017) — hamda toʻrtta Yevropa Oltin choyoni.`],
      [`311`, `Real Madrid uchun <b>La Liga gollari</b> — musobaqaning barcha davrlardagi rekordi.`],
      [`140`, `183 ta oʻyinda <b>Chempionlar Ligasi gollari</b> — musobaqa tarixidagi rekord.`],
      [post30, `<b>30 yoshdan keyingi gollar</b> — butun kariera jami hajmining taxminan ${pct}%i, 2015-yildan boshlab.`],
      [`66`, `Karierasida klub va terma jamoa safida <b>het-trik va undan koʻp</b> (vaqtinchalik hisob).`],
      [`${LIVE.trophies}`, `<b>Jamoaviy sovrinlar</b> — klublarda 32 ta va Portugaliya safida 3 ta.`]
    ],
    silverCaption: () => `${LIVE.trophies} ta rasmiy jamoaviy titul — klubma-klub, hamda asosiy shaxsiy faxrlar. Baʻzi nashrlar 36–37 raqamini keltiradi, chunki UEFA Super Cup va mahalliy superkuboklarni boshqacha hisoblaydi — bu yerda keltirilgan tufrokli roʻyxat ${LIVE.trophies} ga teng.`,
    silverThTrophy: "Sovrin",
    silverThTimes: "Soni",
    silverThNote: "Eslatma",
    silverRows: [
      ["Jamoaviy sovrinlar — Real Madrid", "15", "2009-yildan 2018-yilgacha, jumladan 4 ta Chempionlar Ligasi"],
      ["Jamoaviy sovrinlar — Manchester United", "9", "2003-yildan 2009-yilgacha, jumladan Chempionlar Ligasi va 2008-yilgi Club World Cup"],
      ["Jamoaviy sovrinlar — Juventus", "5", "Serie A ikki marta, Coppa Italia va 2 ta Supercoppa Italiana"],
      ["Jamoaviy sovrinlar — Portugaliya", "3", "Euro 2016, Nations Liga 2019 va 2025"],
      ["Jamoaviy sovrinlar — Al Nassr", "2", "Arab Club Champions Cup 2023, Saudi Pro Liga 2026"],
      ["Jamoaviy sovrinlar — Sporting CP", "1", "Supertaça Cândido de Oliveira 2002"],
      ["Ballon d'Or", "5", "2008, 2013, 2014, 2016, 2017"]
    ],
    splitFk: "Jarima toʻpidan gollar",
    splitFkNote: "Klub va terma jamoa safida chulgʻab kiritilgan (vaqtinchalik yigʻilgan hisob).",
    splitPen: "Penalti gollar",
    splitPenNote: "Uning barcha gollarining beshdan biriga yaqin (vaqtinchalik yigʻilgan hisob).",
    splitHt: "Het-trik va undan koʻp",
    splitHtNote: "Uch va undan koʻp gol urilgan oʻyinlar, barcha musobaqalar.",
    splitCaveat: (tot) => `Jarima toʻpi, penalti va tanaga qarab taqsimotlar — keng tarqalgan yigʻilgan hisob, toʻliq oʻyinma-oʻyin qoʻlda hisob yakunlanguncha vaqtinchadir. Jami ${tot} bundan oʻzgarmaydi.`,
    faq: (t, agg, m, d, lang) => [
      ["Kristiano Ronaldo jami qancha kariera goli urgan?", `<b>${n(t.goals)} ta rasmiy kariera goli</b> — ${n(t.apps)} ta rasmiy oʻyinda (${esc(d.lastUpdated)} holatiga) — oʻyinga ${t.goalsPerGame} ta gol. Uning yilma-yil gol statistikasini <a href="/${lang}/goalsbyyear">toʻliq ochib koʻring</a>.`],
      ["Kristiano Ronaldo karyerasida qancha assist qoʻshgan?", `Kristiano Ronaldo <b>${n(LIVE.assists)} ta rasmiy kariera assisti</b> qayd etgan — keng tarqalgan yigʻilgan hisob — va Transfermarktning kengroq mezonlari boʻyicha <b>${n(LIVE.tmAssists)} ta assist</b>, ${n(t.apps)} ta oʻyinda. Taqsimoti: Real Madrid uchun ${n(d.totals?.assists?.byTeam?.real_madrid?.official || 152)}, Manchester United uchun ${n(d.totals?.assists?.byTeam?.manchester_united?.official || 66)}, Juventus uchun ${n(d.totals?.assists?.byTeam?.juventus?.official || 20)}, Al Nassr uchun ${n(d.totals?.assists?.byTeam?.al_nassr?.official || 9)} va Portugaliya uchun ${n(d.totals?.assists?.byTeam?.portugal?.official || 14)}.`],
      ["Kristiano Ronaldo ning jami gollari va assistlari qancha?", `Rasmiy karierasida Kristiano Ronaldo <b>${n(LIVE.ga)} ta rasmiy gol ishtiroki</b> jamlagan (<b>${n(t.goals)} ta gol</b> va <b>${n(LIVE.assists)} ta rasmiy assist</b>) ${n(t.apps)} ta oʻyinda — oʻyinga <b>0.93 ta bevosita gol ishtiroki</b>. Transfermarkt mezonlari boʻyicha jami <b>${n(LIVE.tmGa)} ta gol ishtiroki</b> ga teng (${n(t.goals)} ta gol + ${n(LIVE.tmAssists)} ta assist).`],
      ["Barcha davrlar boʻyicha kimning statistikasi yaxshiroq — Ronaldo yoki Messi?", `Rasmiy oʻyinlar boʻyicha <b>Cristiano Ronaldo</b> barcha davrlardagi gol rekordiga ega: <b>${n(t.goals)} ta gol</b> va ${n(LIVE.assists)} ta assist ${n(t.apps)} ta oʻyinda (oʻyinga ${t.goalsPerGame} ta gol), Messi esa <b>${n(LIVE.rGoals)} ta gol</b> va 408 ta assist 1,181 ta oʻyinda (oʻyinga 0.79 ta gol). Ronaldo ${n(t.goals)} ta golga <b>159 ta oʻyin kam</b> yetib bordi, Messiga nisbatan ${LIVE.trophies} ta jamoaviy sovringa (Messi: ${LIVE.rTrophies}) va 5 ta Ballon d'Or sohibi (Messi: 8). Ularning toʻliq yuzma-yuz rekordini <a href="/${lang}/ronaldo-vs-messi">Ronaldo va Messi statistikasi sahifasida</a> taqqoslang.`],
      ["Ronaldo ning kariera gollari klub boʻyicha qanday taqsimlanadi?", `<b>${n(t.clubs.goals)} ta klub goli</b> ${n(t.clubs.apps)} ta klub oʻyinda — ` + ["Real Madrid", "Manchester United", "Juventus", "Al Nassr", "Sporting CP"].map((c) => {
        const rows = (d.clubSeasons || []).filter((s) => s.club === c);
        const apps = rows.reduce((a, s) => a + s.apps, 0);
        const goals = rows.reduce((a, s) => a + s.goals, 0);
        return `${c} ${n(goals)} gol / ${n(apps)} oʻyin`;
      }).join(" · ") + ` — hamda Portugaliya safida <b>${n(t.country.goals)} ta gol</b> — ${n(t.country.apps)} ta oʻyinda. <a href="/${lang}/goalsbyseason">Mavsumma-mavsum klub statistikasini</a> koʻrib chiqing.`],
      ["Ronaldo qancha bevosita jarima toʻpidan gol urgan?", `Kristiano Ronaldo rasmiy futbolda <b>66 ta bevosita jarima toʻpidan gol</b> urgan, shu bilan birga <b>184 ta penalti (220 urinishdan)</b> va oʻyin holatidan 731 ta gol — toʻliq qoʻlda hisob yakunlanguncha vaqtinchalik yigʻilgan hisob.`],
      ["Ronaldo qancha het-trik qilgan?", `Ronaldo klub va terma jamoa safida <b>${n(d.hatTricks)} ta kariera het-triki</b> qilgan (vaqtinchalik hisob), jumladan <b>Portugaliya uchun 10 tasi</b> — terma jamoa futbolchisi uchun jahon rekordi.`],
      ["Ronaldo qancha penalti gol urgan?", `Ronaldo klub va terma jamoa safida <b>184 ta penalti gol</b> — 220 urinishdan — urgan, 83.6% konvertatsiya darajasi bilan.`],
      ["Kristiano Ronaldo qancha penaltisiz gol urgan?", `Ronaldo <b>${n(t.goals - (m?.penalties || 184))} ta penaltisiz gol</b> — ${n(t.apps)} ta oʻyinda (${((t.goals - (m?.penalties || 184)) / t.apps).toFixed(2)} ta penaltisiz gol oʻyinga) — umrida urgan barcha gollarining 81%.`],
      ["Ronaldo 2013-yilda qancha gol urgan?", `<b>69 ta rasmiy gol 2013-yilda</b> (59 tasi Real Madrid, 10 tasi Portugaliya uchun) — uning karierasidagi eng yirik taqvim yili, hamda Shimoliy Irlandiyaga qarshi 15 daqiqa ichida Portugaliya uchun het-trik keltirgan yil. <a href="/${lang}/goalsbyyear">2013-yil statistikasi kuzatuvchisi</a>ni koʻrib chiqing.`],
      ["Kristiano Ronaldo qancha sovrin yutgan?", `<b>${n(LIVE.trophies)} ta rasmiy jamoaviy titul</b> — klublarda 32 ta (Real Madrid 15, Manchester United 9, Juventus 5, Al Nassr 2, Sporting CP 1) va Portugaliya safida 3 ta (Euro 2016, Nations Liga 2019 va 2025), yana 5 ta Ballon d'Or. Baʻzi nashrlar 36–37 raqamini keltiradi, chunki UEFA Super Cup va mahalliy superkuboklarni boshqacha hisoblaydi. <a href="/${lang}/achievements">Toʻliq sovrin roʻyxatini</a> koʻring.`],
      ["Kristiano Ronaldo qancha Ballon d'Or yutgan?", `Kristiano Ronaldo <b>5 ta Ballon d'Or</b> yutgan (2008, 2013, 2014, 2016, 2017) — birinchisi 2008-yilda, 23 yoshida kelgan, uni 96 ta rayonlikdan hammasi nomlagan edi.`],
      ["Real Madridda Ronaldo natijasi qanday?", `Real Madrid safidagi Ronaldo ning El Clásico rekordi — va boshqa futbolkda Real Madrid ga urgan barcha gollari — <a href="/${lang}/real-madrid">Real Madridda Ronaldo sahifasi</a> jamlangan.`],
      ["Ronaldo ning UEFA Champions League statistikasi qanday?", `Ronaldo <b>140 ta golni 183 ta Chempionlar Ligasi oʻyinida</b> urgan — musobaqaning barcha davrlardagi rekordi — hamda <b>42 ta assist</b> qoʻshgan, bu ham rekord, va 5 ta titul yutgan (2008, 2014, 2016, 2017, 2018). Toʻliq maʻlumotni <a href="/${lang}/champions-league">Chempionlar Ligasi markazida</a> koʻring.`],
      ["Ronaldo ning FIFA Jahon Kubogi statistikasi qanday?", `Ronaldo <b>olti FIFA Jahon Kubogida</b> (2006, 2010, 2014, 2018, 2022 va 2026) ishlagan va Portugaliya uchun eng koʻp gol urgan futbolchi boʻlib qolgan: <b>146 ta gol</b> — 234 ta milliy oʻyinda — ikkalasi uchun ham barcha davrlardagi terma jamoa rekordi.`],
      ["Kristiano Ronaldo 1,000 ta kariera golidan qancha uzoqda?", `${n(t.goals)} ta gol bilan Ronaldo <b>${Math.max(0, 1000 - t.goals)} ta gol</b> kerak — 1,000 ta kariera golga yetish uchun — rasmiy futbolda bu natijaga hech kim yetib kelmagan.`]
    ]
  };

export const BY_YEAR = {
    head: (ys, best, t) => `Birinchi rasmiy golidan ${ys[0].year}-yilda <b>${best.goals} ta gol — ${best.year}-yilda</b> gacha — ${n(t.goals)} ta gol bergan kariyeraning har bir taqvim yili, jamlanuvchi jami va uning yoshi bilan.`,
    cap: (best, t) => `Ustunlar: shu yildagi gollar (choʻqisi ${best.goals}, ${best.year}). Chiziq: ${n(t.goals)} gollik koʻtarilish.`,
    chartLabel: (best) => `Taqvim yillari boʻyicha Ronaldo gollari va jamlanuvchi kariera jami, ${best.goals} ta gol bilan choʻqqiga chiqqan — ${best.year}-yilda`,
    kpiCareer: "Kariera gollari",
    kpiBest: "Eng yaxshi yil",
    kpiBestSub: "Taqvim yilida urgan eng koʻp goli.",
    kpiCurrSub: "Mavsum davom etmoqda.",
    kpiYears: "Gol urgan yillari",
    kpiYearsSub: (ys, last) => `${ys[0].year}-yildan ${last.year}-yilgacha boʻlgan har bir yil.`,
    decades: "Gollar:",
    tableSub: "Avval yangilari. Mavsum hali oʻynab borilayotgan paytda 2026 yulduzcha bilan belgilangan. Tartibga solish uchun ustunni bosing yoki filtrlash uchun yozing. Choʻqqi yillar izoh bilan belgilanadi — yil ustiga buring.",
    caption: "Ronaldo ning 2002-yildagi debyutidan beri har bir taqvim yili uchun gollar, jamlanuvchi kariera jami va yosh.",
    thYear: "Yil", thGoals: "Gollar", thTotal: "Kariera jami", thAge: "Yosh",
    inProgNote: "* 2026-yil mavsumi davom etmoqda — har oʻyindan keyin yangilanadi.",
    filterPlaceholder: "Yillarni filtrlash — masalan, 2013",
    bestYearHtml: (best) => `<p><b>${best.year} — Ronaldo ning eng koʻp goli urgan taqvim yili: ${best.goals} ta gol</b> — Real Madrid uchun 59 ta va Portugaliya uchun 10 ta gol. Bu yil ikkinchi Ballon d'Or, 55 gollik klub mavsumi va Shimoliy Irlandiyaga qarshi 15 daqiqa ichida Portugaliya uchun uchta gol keltirgan.</p><p>Keyingi eng yaxshi yillar — 2012 (63), 2014 (61) va 2011 (60) — 2010-yildan 2014-yilgacha ketma-ket besh mavsum davomida standart qanchalik yuqori boʻlganini koʻrsatadi. <a href="/en/dashboard">Ushbu gollar musobaqa boʻyicha qanday taqsimlanishini</a> koʻring.</p>`
  };

export const BY_SEASON = {
    head: (best) => `2002/03-dan 2026/27-gacha boʻlgan har bir klub mavsumi — <b>eng yaxshisi: ${best.goals} ta gol — ${best.season} mavsumida</b> — liga, kubok va qitʻa musobaqalari taqsimoti hamda Portugaliya boʻyicha yilma-yil koʻrsatkichlar bilan.`,
    clubSub: "Har bir formatdagi oʻyinlar / gollar. 2026/27 — davom etayotgan mavsum. Tartibga solish uchun ustunni bosing yoki filtrlash uchun yozing.",
    caption: (len) => `Barcha ${len} klub mavsumlari: Sporting CP 2002/03, Manchester United 2003/04–2008/09 va 2021/22–2022/23, Real Madrid 2009/10–2017/18, Juventus 2018/19–2021/22, Al Nassr 2022/23–2026/27.`,
    thSeason: "Mavsum", thClub: "Klub", thApps: "Oʻyinlar", thGoals: "Gollar", thLeague: "Liga", thCup: "Kubok", thCont: "Qitʻa", thOther: "Boshqa",
    totalLabel: "Klub jami", bestBadge: "Eng yaxshi klub mavsumi",
    filterClubPlaceholder: "Mavsumlarni filtrlash — masalan, Real Madrid, 2012",
    countrySub: "Saralash bosqichlari va turnirlar, shuningdek doʻstlik oʻyinlari — avval yangilari.",
    countryCaption: "Portugaliya gollari taqvim yillari boʻyicha, 2003-yildan 2026-yilgacha.",
    thYear: "Yil", thNote: "Izoh", totalArgLabel: "Portugaliya jami",
    filterCountryPlaceholder: "Portugaliya yillarini filtrlash — masalan, 2016",
    bestSeasonHtml: (best) => `<p><b>${best.season} — ${best.goals} ta gol, ${best.apps} ta oʻyinda, ${best.club} safida</b> — uning eng mazmavli klub mavsumi: ligasida ${best.league.goals} ta, Chempionlar Ligasiida ${best.continental.goals} ta, kubokda ${best.cup.goals} ta va superkuboklarda ${best.other.goals} ta gol. U qatnashgan har bir musobaqada gol urgan.</p><p>Bu haqiqatan ham afsonaviy 2011/12 mavsumidan — jami 60 ta gol, La Ligada 46 tasi bilan — oz-marta oʻzib ketadi: Madridning oltita mavsumi davomida u hech qachon 51 ta klub golidan kamini urmagan. <a href="/en/goalsbyyear">Xuddi shu gollar taqvim yillari boʻyicha</a>.</p>`
  };

export const DASH = {
  teamNames: { all: "barcha jamoalar", real_madrid: "Real Madrid", manchester_united: "Manchester United", juventus: "Juventus", al_nassr: "Al Nassr", sporting_cp: "Sporting CP", portugal: "Portugaliya" },
  pills: [["all", "Barcha jamoalar"], ["real_madrid", "Real Madrid"], ["manchester_united", "Manchester United"], ["juventus", "Juventus"], ["al_nassr", "Al Nassr"], ["sporting_cp", "Sporting CP"], ["portugal", "Portugaliya"]],
  head: (name) => `Ronaldo ning har bir goli toʻrt yoʻnalish boʻyicha kesilgan — musobaqa, mavsum, gol urish usuli va tana qismi boʻyicha — <b>${esc(name)}</b> boʻyicha filtrlangan. Har bir grafikni qayta kesish uchun jamoani tanlang.`,
  filterNote: (name, goals, apps, T) => `${name} koʻrsatilmoqda: ${n(goals)} ta gol, ${n(apps)} ta oʻyinda` + (T === "real_madrid" ? " (Chempionlar Ligasi: 140 ta gol, 183 ta oʻyinda va 42 ta assist — uchalasi ham musobaqa rekordi)." : "."),
  kpis: { goals: "Gollar", apps: "Oʻyinlar", gpg: "Oʻyinga toʻgʻri gol", forTeam: (name) => `${name} uchun.` },
  chartEmpty: "Bu jamoa filtri uchun qatorlar yoʻq.",
  figCap: (T, name) => T === "all" ? "Taqvim yillari, 2002-yildan 2026-yilgacha." : ["portugal", "portugal_nt", "country"].includes(T) ? "Portugaliya taqvim yillari." : esc(name) + " uchun klub mavsumlari.",
  finishParts: { "Open play": "Oʻyin holatidan", "Penalties": "Penalti", "Free kicks": "Jarima toʻpi" },
  finishCenter: "kariera gollari",
  finishCaveat: "Barcha jamoalar birlashtirilgan kariera jami — jamoalar boʻyicha taqsimot mavjud emas. Vaqtinchalik yigʻilgan hisob.",
  finishCaveatFiltered: (d) => `Jamoalar boʻyicha gol urish usuli taqsimoti mavjud emas, shuning uchun bu grafik faqat barcha jamoalar birgaligini qamrab oladi — kariera jami quyida keltirilgan. Ronaldo ning ${n(d.totals.goals)} ta goli shunday taqsimlanadi: ${d.byFinish.openPlay} ta oʻyin holatidan, ${d.byFinish.penalties} ta penalti va ${d.byFinish.freeKicks} ta jarima toʻpidan (vaqtinchalik yigʻilgan hisob).`,
  bodyParts: { "Left foot": "Chap oyoq", "Right foot": "Oʻng oyoq", "Head": "Bosh", "Other": "Boshqa" },
  bodyCenter: "oʻng oyoqdan urilgan gollar",
  bodyCaveat: "Barcha jamoalar birlashtirilgan kariera jami — toʻliq qoʻlda hisob yakunlanguncha vaqtinchalik yigʻilgan hisob.",
  ageName: (r) => `${r.age} yosh · ${r.year}`,
  ageCaveat: (apeak) => `Har bir rasmiy gol uni urgan yoshiga koʻra — klub va terma jamoa birgaligida. Choʻqisi: ${apeak.goals} ta gol — ${apeak.age} yoshda (${apeak.year}).`,
  ageFilterNote: "Yoshlar klub va terma jamoa gollarini aralashtiradi, shuning uchun bu grafik faqat butun karyerani qamrab oladi — uni koʻrish uchun jamoa filtrini tozalang.",
  compCaption: (name) => `Musobaqa boʻyicha gollar — ${esc(name)}.`,
  thComp: "Musobaqa", thGoals: "Gollar", thShare: "Ulushi",
  recAllTime: "Musobaqa boʻyicha barcha davrlar rekordi",
  finishCaption: "Gollar qanday va nima bilan urilgan — barcha jamoalar boʻyicha kariera jami.",
  thFinish: "Gol urish usuli",
  finishCaveatTable: "Gol urish usuli va tana qismi taqsimotlari — vaqtinchalik yigʻilgan hisob.",
  finishRows: (d) => [
    ["Oʻyin holatidan", d.byFinish.openPlay],
    ["Penalti", d.byFinish.penalties],
    ["Jarima toʻpi", d.byFinish.freeKicks],
    ["Chap oyoq", d.byBodyPart.left],
    ["Oʻng oyoq", d.byBodyPart.right],
    ["Bosh", d.byBodyPart.head],
    ["Boshqa (koʻkrak va h.k.)", d.byBodyPart.other]
  ],
  teamCardSub: { goals: "gol", apps: "oʻyin", gpg: "oʻyinga", of: "— jami" },
  records: (comp, d) => [
    ["69", `<b>2013-yildagi gollar</b> — taqvim yilida urgan eng koʻp goli.`],
    [n(comp("La Liga")), `<b>La Liga gollari</b>, musobaqaning barcha davrlardagi rekordi, barchasi Real Madrid uchun.`],
    ["140", `<b>Chempionlar Ligasi gollari</b> — musobaqa tarixidagi rekord.`],
    ["5", `<b>Ballon d'Or</b> (2008, 2013, 2014, 2016, 2017).`],
    [n(d.hatTricks), `Karierasida klub va terma jamoa safida <b>het-trik va undan koʻp</b> (vaqtinchalik hisob).`],
    [`${LIVE.trophies}`, `<b>Jamoaviy sovrinlar</b> — klublarda 32 ta, Portugaliya safida 3 ta.`]
  ],
  method: "Chempionlar Ligasi koʻrsatkichlari (140 ta gol, 183 ta oʻyinda, 42 ta assist) klublar va UEFA rekord kitoblaridan olingan musobaqa rekordlari; jamoa filtri boʻyicha boshqa musobaqa taqsimotlari esa klub mavsumlari musobaqa xaritasiga muvofiq tuzilgan hamda maʻlumotlar faylida izohlangan."
};

export const TIMELINE = {
  head: (t) => `Sporting CP dagi 2002-yilgi debyutidan <b>${n(t.goals)} ta kariera goli</b> va davomi etayotgan sanogʻigacha — oʻziga xos kechalari, rekordlar va sovrinlar, sana va tartib bilan.`,
  keydates: (t, lastUpdated) => [
    ["14 Aug 2002", "<b>Sporting CP</b> uchun rasmiy debyut — Chempionlar Ligasi uchinchi saralash bosqichida Inter ga qarshi, 17 yoshda."],
    ["20 Aug 2003", "<b>Portugaliya</b> jamoasiga debyut — Qozogʻistonga qarshi, Manchester United da mashhur 7-raqamli futbolkani olgan haftalardan keyin."],
    ["2008", "<b>Ballon d'Or</b> — 23 yoshida, 96 ta rayonlikdan hammasi nomlagan holda, Chempionlar Ligasi va FIFA Club World Cup bilan."],
    ["2013", "Taqvim yilida <b>69 ta gol</b> — uning eng yaxshi yili, jumladan 15 daqiqa ichida Portugaliya uchun het-trik."],
    ["2016", "Portugaliya jamoasining kapotani sifatida <b>Yevropa Championshipasi</b>ni koʻtarib oladi — uchta gol va kumush choyon bilan."],
    [esc(lastUpdated), `Klub va terma jamoa safida <b>${n(t.goals)} ta kariera goli</b> — oxirgi tekshiruv shu sanaga qilingan.`]
  ],
  inProg: "davom etmoqda",
  goals: "gol",
  goalsInEra: (goals, share, total) => `<b>${n(goals)} ta gol</b> · ${share}% (${n(total)} dan)`,
  peakYear: (pk, tr) => `<p class="ch-callout">Choʻqqi yil <b>${pk.year} · ${pk.goals} ta gol</b>` + (tr ? ` · bu davrda yutilgan <b>${tr}</b> ta jamoaviy ${tr === 1 ? "sovrin" : "sovrinlar"}` : "") + `</p>`,
  empty: (val, total) => `“${val}” ga hech narsa mos kelmadi — barcha ${total} ta bosqichni koʻrish uchun qidiruvni tozalang.`,
  tagRecord: "Rekord", tagWc: "Jahon kubogi", tagFirst: "Birinchi",
  faq: [
    ["Ronaldo rasmiy debyutini qachon qildi?", "<b>Sporting CP</b> uchun <b>14 August 2002</b>da, Chempionlar Ligasi uchinchi saralash bosqichida Inter ga qarshi, 17 yoshda; birinchi rasmiy gollaridan yetti hafta keyin Moreirense ga qarshi keldi."],
    ["Ronaldo birinchi golini qachon urgan?", "Portugaliya uchun birinchi goli — <b>Euro 2004 da Gretsiyaga</b> qarshi boshdan urgan gol boʻldi; oʻsha yili Manchester United uchun birinchi goli esa Portsmouthga qarshi jarima toʻpidan boʻldi."],
    ["Ronaldo Chempionlar Ligasi qachon yutgan?", "Birinchi marta <b>2008</b>da Manchester United bilan, keyin Real Madrid bilan ketma-ket toʻrt marta — <b>2014, 2016, 2017 va 2018</b>-yillarda."],
    ["Ronaldo Real Madrid ga qachon oʻtdi?", "<b>June 2009</b>da — oʻsha vaqtning jahon rekori boʻlgan haq uchun — taqdimotda Bernabéu stadioni da 80,000 kishi tomoshabin qilgan."],
    ["Ronaldo Al Nassr ga qachon qoʻshildi?", "<b>January 2023</b>da — Al-Ettifaq ga qarshi kapeton sifatida debyut qilib, 2–2 liqotonda ikki marta gol urgan."]
  ],
  method: "Timeline yozuvlari yil va sana darajasidagi bosqichlardir; davr gollari ustunlari taqvim yillarini bir-birining ustiga tushmaydigan oraliqlarga boʻlib, shu sabab ular kariera jamiga toʻliq qoʻshiladi."
};

export const ACH = {
  head: (teamTotal) => `<b>${teamTotal} ta jamoaviy sovrin</b> — klublarda 32 ta va Portugaliya safida 3 ta — yana <b>5 ta Ballon d'Or</b>. Har bir titul, klubma-klub, yutgan yillari bilan.`,
  kpis: (per) => [
    ["Jamoaviy sovrinlar", 35, `Real Madrid ${per["Real Madrid"] || 0} · Manchester United ${per["Manchester United"] || 0} · Juventus ${per["Juventus"] || 0} · Portugaliya ${per["Portugal"] || 0}.`],
    ["Ballon d'Or", "5", "2008, 2013, 2014, 2016, 2017."],
    ["Yevropa Oltin choyonlari", "4", "2008, 2011, 2014, 2015."],
    ["Chempionlar Ligasi eng koʻp gol uruvchisi mavsumlari", "7", "2008-yilda Chempionlar Ligasi eng koʻp gol uruvchisi, keyin 2013-yildan 2018-yilgacha har bir mavsumda."]
  ],
  qa: (teamTotal, per) => [
    ["Ronaldo qancha sovrin yutgan?", `<b>${teamTotal} ta rasmiy jamoaviy titul</b>: Real Madrid ${per["Real Madrid"] || 0}, Manchester United ${per["Manchester United"] || 0}, Juventus ${per["Juventus"] || 0}, Al Nassr ${per["Al Nassr"] || 0}, Sporting CP ${per["Sporting CP"] || 0} va Portugaliya ${per["Portugal"] || 0}.`],
    ["Ronaldo qancha Ballon d'Or yutgan?", "<b>Besh</b> — 2008, 2013, 2014, 2016 va 2017, birinchisi 23 yoshida."],
    ["Ronaldo yirik xalqaro titul yutganmi?", "<b>Ha</b> — kapeton sifatida UEFA Euro 2016 va UEFA Nations Liga 2019 hamda 2025-yillarda."],
    ["Ronaldo qancha Chempionlar Ligasi yutgan?", "<b>Besh</b>: 2008-yilda Manchester United bilan, keyin 2014, 2016, 2017 va 2018-yillarda Real Madrid bilan."]
  ],
  teamHeader: (team, sub) => `${esc(team)} — ${sub} ta sovrin`,
  indHeader: (indTotal) => `Shaxsiy faxrlar — ${indTotal} ta mukofot`,
  faq: [
    ["Ronaldo ning eng muhim sovrigi qaysi?", "<b>2016-yilgi Yevropa Championshipasi</b> — u Portugaliyani Parijda kapeton sifatida olib borgan titul, turnirning ikkinchi yirik golchisi sifatida."],
    ["Ronaldo qancha liga tituli yutgan?", "<b>Sekiz</b> — 3 ta Premier Liga, 2 ta La Liga, 2 ta Serie A va 1 ta Saudi Pro Liga, ushbu arxivning faxr roʻyxatida batafsil keltirilgan."],
    ["Ronaldo qancha shaxsiy mukofot yutgan?", "Besh ta Ballon d'Or, toʻrtta Yevropa Oltin choyoni, uchta UEFA Yillik Futbolchi mukofoti, 2008-yildagi FIFA Yilning Futbolchisi, 2009-yildagi FIFA Puskás mukofoti, Euro 2020 Oltin choyoni hamda 2016 va 2017-yillarda The Best FIFA Men's Player."],
    ["Ronaldo tarixdagi eng koʻp shuhratga ega futbolchimi?", "Faqat jamoaviy titullar boʻyicha Messi 46 ta bilan Ronaldo ning 35 tasidan oldinda. Ronaldo esa gol rekordlarida oldinda — 981 ta gol, ulardan 140 tasi Chempionlar Ligasiida, va Portugaliya safida 146 ta gol — 234 ta milliy oʻyinda."]
  ]
};

// Uzbek nouns do not inflect for number after numerals ("1 ta gol", "2 ta gol"),
// so the source's singular/plural branches carry the same word.
export const BDAY = {
    months: ["", "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"],
    badgeSuccess: "🎉 Ha! Ronaldo sizning tugʻilgan kuningizda gol urgan!",
    badgeMessi: "🎂 CR7 ning oʻz tugʻilgan kuni!",
    badgeEmpty: "Bu sanada gol yoʻq",
    headlineSuccess: (g, m, d) => `Kristiano Ronaldo rasmiy karyerasida <b>${g} ta ${g === 1 ? "gol" : "gol"}</b> <b>${m} ta ${m === 1 ? "oʻyin" : "oʻyin"}</b> oʻtkazgan, ${d} kuni gol urgan!`,
    headlineMessi: `Siz <b>Cristiano Ronaldo</b> bilan bir tugʻilgan kunga egasiz (5 February 1985 da Funchal, Madeira shahrida tugʻilgan)!`,
    headlineEmpty: (d) => `Kristiano Ronaldo rasmiy karyerasida <b>${d}</b> da gol urmagan.`,
    whyZeroTitle: "Nega 0 ta gol?",
    whyZeroMessi: "5 February Yevropa klub mavsumining oʻrtasiga toʻgʻri keladi, shuning uchun u Ronaldo uchun odatiy oʻyin kuni boʻladi: oʻyinlar taqvimi va u oʻynagan daqiqalar uni tugʻilgan sanasiga gol tushishi belgilaydi.",
    whyZeroMessiSub: "Maxsus kuningizni Kristiano Ronaldo bilan boʻlishib — CR7, 5 February 1985 da tugʻilgan.",
    emptyExpl: "Ronaldo shu aniq taqvim kuni uchun oʻyin rejalashtirilmagan yoki oʻyinda gol urmagan — biroq u klub va terma jamoa boʻylab yilning koʻp kunlarida gol urgan.",
    closestDay: (d, g) => `Ronaldo gol urgan eng yaqin taqvim kuni — <b>${d}</b> (${g} ta kariera goli).`,
    closestBtn: (d, g) => `Tekshirish ${d} (${g} ta gol) &rarr;`,
    watchClip: (cnt) => `Koʻrish ${cnt > 1 ? cnt + " ta gol videosi" : "gol videosi"}`,
    searchYt: "🔍 Videolarni qidirish",
    playInline: "📺 Shu yerda ijro etish",
    closeInline: "✕ Videoni yopish",
    ytHighlights: "YouTube’dagi muhim momentlar",
    goalSummary: (g) => `${g} ta ${g === 1 ? "gol" : "gol"} urildi:`,
    goalTab: (idx, min) => `Gol ${idx}${min ? ` (${min}')` : ""}`,
    shareSuccess: (d, g, m) => `Kristiano Ronaldo mening tugʻilgan kunda ${g} ta golni ${m} ta oʻyinda urgan (${d})! Sanani tekshiring:`,
    shareEmpty: (d) => `Kristiano Ronaldo sizning tugʻilgan kuningizda gol urganmi? U klub va terma jamoa boʻylab yilning koʻp kunlarida gol urgan. Sanangizni tekshiring:`,
  };

export const LATEST_GOAL = {
    goalPrefix: "Gol #",
    scoreline: "Hisob",
    didScoreTodayYes: "HA! Cristiano Ronaldo bugun gol urgan: {opp} ga qarshi {minute}-da {goalNum}-gol ({score})!",
    didScoreTodayNo: "Ronaldo bugun gol urganmi? Cristiano Ronaldo ning soʻnggi rasmiy oʻyini {date} da {comp} turnirida boʻlib oʻtgan, u yerda {minute}-da kariyerasidagi {goalNum}-golni urib {score} gʻalabini taʻminlagan. Rasmiy gol videosini toʻgʻridan-toʻgʻri quyida tomoshabin qiling.",
    matchResult: "Soʻnggi oʻyin natijasi: {title}",
    goalBadge: "{goalNum}-gol urildi ({minute})",
    playHighlight: "Kristiano Ronaldo ning soʻnggi gollaridan birini tanlang — yuqoridagi pleyerda video bir zumda yuklanadi va koʻriladi:",
    viewDateGoals: "{formattedDate} gollarini koʻrish →",
    tagHeader: "Boshdan 🔥",
    tagFreekick: "Bevosita jarima toʻpi 🔥",
    tagPenalty: "Penalti",
    tagLeftFoot: "Chap oyoqdan urish",
    tagRightFoot: "Oʻng oyoq",
    tagOpenPlay: "Oʻyin holatidan",
    assist: "Assist"
  };

export const ARG_STREAM = {
    badge: "🇵🇹 PORTUGALIYA OʻYIN KUNI",
    title: "Kristiano Ronaldo ning Portugaliyasi",
    text: "Portugaliya oʻyin kechasi — jonli efirni reklama siz bepul kuzating.",
    highlight: "Bepul jonli efir • Reklama yoʻq",
    cta: "Bepul efirni koʻrish ▶",
    closeAria: "Bildirishnomani yopish",
    matchCardTitle: "Portugaliya milliy jamoasi • Jonli oʻyin kechasi",
    matchCardDesc: "Kristiano Ronaldo va Portugaliyani Koora Live da jonli kuzating — bepul efir, nol reklama."
  };

export const EXPLORE_LANGS = [
  { href: "/en/birthday", page: "birthday", t: "🎂 Ronaldo sizning tugʻilgan kuningizda gol urganmi?", d: (d) => `366 ta taqvim kunining barchasini — Ronaldo ning ${n(d.totals.goals)} ta rasmiy kariera goli boʻylab — video materiallar bilan qidiring.` },
  { href: "/en/ronaldo-vs-messi", page: "ronaldo-vs-messi", t: "🐐 Ronaldo va Messi — barcha davrlar", d: () => `Yuzma-yuz kariera statistikasi: ${n(LIVE.goals)} va ${n(LIVE.rGoals)} gol, ${LIVE.trophies} va ${LIVE.rTrophies} sovrin, 5 va 8 ta Ballon d'Or.` },
  { href: "/en/real-madrid", page: "real-madrid", t: "🏟️ Real Madridda Ronaldo", d: () => "Real Madridda to'qqiz yil: 450 gol, La Ligada 311, to'rtta Chempionlar Ligasi va Klassikoda 18." },
  { href: "/en/champions-league", page: "champions-league", t: "⭐ Chempionlar Ligasi rekordi", d: () => "UEFA Chempionlar Ligasiida 140 ta gol, 42 ta assist va 5 ta yevropa tituli." },
  { href: "/en/latest-goal", page: "latest-goal", t: "⚽ Ronaldo ning soʻnggi goli videosi", d: () => "Ronaldo ning soʻnggi gol videosini koʻring, u bugun gol urganini aniqlang va yaqin gol videolarini koʻrib chiqing." },
  { href: "/en", page: "home", t: "Ronaldo kariera statistikasi", d: (d) => `Asosiy koʻrsatkichlar: ${n(d.totals.goals)} ta gol — ${n(d.totals.apps)} ta rasmiy oʻyinda.` },
  { href: "/en/dashboard", page: "dashboard", t: "Ronaldo statistikasi boshqaruv paneli", d: () => "Har bir grafigi Real Madrid, Manchester United, Juventus, Al Nassr, Sporting CP yoki Portugaliya boʻyicha filtrlang." },
  { href: "/en/timeline", page: "timeline", t: "Ronaldo yillar davomida", d: () => "Karyeraning har bir bosqichi, sana va tartib bilan, 2002-yildan bugungi kungacha." },
];

/* Era chapter openers. The renderer looks an intro up by era slug first
   (rosario, peak, msn, carry, farewell, paris, miami) and falls back to the
   era name, so both keys are mapped here to the same Ronaldo copy — no
   change to app.js is needed. */
export const ERA_INTROS = {
  "The boy from Rosario":
    `Kristiano Ronaldo oʻspirinlik yoshida — tezlik shuhhati va toʻpni talab qilish odati bilan — Madeiraning Funchal shahridan Lisbonga keldi. Sporting CP dagi birinchi rasmiy mavsumida 31 ta oʻyinda besh ta gol urdi va oʻn ikki oy ichida Manchester United ning afsonaviy 7-raqamli futbolkasi 12.24 mln £ ga berildi. 19 yoshida FA Cup finalida gol urdi, uchta Premier Liga, Chempionlar Ligasi va FIFA Club World Cupni qozondi, 2008-yilda esa 23 yoshida dunyoning eng yaxshi futbolchisi deb topildi — 96 ta rayonlikdan hammasi nomlagan holda.`,
  "The greatest peak football has seen":
    `Real Madrid 2009-yilda jahon rekori boʻlgan haq toʻlab, futbol tarixidagi eng qimmat hujumchi yetishkazib oldi. U birinchi mavsumida Barcelona ga qarshi Copa del Rey finalida boshdan urgan gol bilan javob berdi, keyin esa rekord 100 ball va 46 ta liga goli bilan yutilgan La Liga titulini qoʻlga kiritdi. 2012-yil oxiriga borib u bir taqvim yilida 60 ta golga va klub uchun La Ligada 100 ta golga yetdi, Madridning hujumchiy obrazi esa uning atrofida qayta qurila boshladi.`,
  "MSN and the second treble":
    `Madridagi uchta mavsum Ronaldo amaldagi deyarli barcha choʻgallardan oʻtdi. U 2013-yilda 69 ta gol urdi — uning eng yaxshi taqvim yili — jumladan Shimoliy Irlandiyaga qarshi 15 daqiqa ichida Portugaliya uchun uchta gol, yaʻni oʻnta terma jamoa het-triki — jahon rekordi. 2014-yilda La Décima keldi, 2015-yil oxiriga borib esa kariyeradagi 500-gol uni tarixdagi barcha Chempionlar Ligasi golchilaridan oldinga oʻtkazdi.`,
  "Carrying Barcelona":
    `Fransiyada yutilgan 2016-yilgi Yevropa Championshipasidan keyin Ronaldo 2017-yilda yana Chempionlar Ligasini qoʻshdi — jumladan Bayern Munichga qarshi urgan het-trik, uni musobaqada 100 ta golga yetkazgan — va oʻsha mavsumda beshinchi Ballon d'Orni oldi. U Yevropaning yirik besh ligasi boʻyicha eng koʻp gol uruvchisi boʻlish uchun Jimmie Greavesdan oʻtdi, soʻng 33 yoshida Juventusga koʻchdi va u yerda oʻzining birinchi Chempionlar Ligasi oʻyinida het-trik urdi.`,
  "Farewell to Barcelona":
    `Nations Liga tituli va rekord kitobidagi oʻrin 2019-yilda keldi, oʻsha yilning oktyabrida Ukraina ga qarshi uning karyeradagi 700-goli urildi. 1,000-marta rasmiy oʻyini 2020-yil fevralida Kalyari ga qarshi keldi, 2021-yilda esa oʻnta terma jamoa het-triki bilan — jahon rekordi — Ali Daeini oʻtib, erkaklar terma jamoa futbolida eng koʻp gol uruvchiga aylandi.`,
  "Paris and the World Cup":
    `2021-yilda Manchester United ga qaytish 7-raqamli futbolkani va xonalarning eng keksa futbolchisi uchun yangi sahifani olib keldi, 2022-yilda esa Tottenhamga qarshi het-trik bilan Josef Bicanidan oʻtdi. January 2023 da Saudiya Arabistoniga koʻchish uni Al Nassrning kapotani qildi va 197-marta milliyni oʻtin bosgan holda erkaklar terma jamoa futbolida eng koʻp oʻyinlagan futbolchiga aylantirdi.`,
  "Miami and the road to 1,000":
    `Al Nassr unga yangi boshlangʻich va Saudi Pro Liga titulini berdi, biroq rekordlar davom etdi: Nations Liga musobaqasida 900-kariya kariera goli — 2024-yilda; 800-kariya klub goli va Al Nassr uchun 100-gol — 2025-yilda — uni toʻrtta klubda 100 ta gol urgan birinchi futbolchiga aylantirgan — va 2026-yilda urilgan 500-gol — 30 yoshdan keyin — hamda oʻrinchi FIFA Jahon kubogi. Endi har bir gol 1,000 ga qarab egilgan yoyni yanada yaqinlashtiradi.`
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
    { title: "Portugaliya va FIFA Jahon Kubogi", sub: "Oltita Jahon kubogi (2006–2026) va Portugaliya uchun 146 ta gol — 234 ta milliy oʻyinda.", src: "/img/cab-wc.webp", w: 800, h: 600, pos: "50% 30%", alt: "2018 FIFA Jahon Kupida Portugaliyaning 7-raqamli futbolkasida Kristiano Ronaldo", cap: "Portugaliyaning eng koʻp gol uruvchisi, oltita Jahon kubogida" },
    { title: "Ballon d'Or — 5", sub: "2008, 2013, 2014, 2016, 2017 — birinchisi 23 yoshida.", src: "/img/cab-ballon.webp", w: 800, h: 600, pos: "50% 30%", alt: "Kristiano Ronaldo rekord daraja bes marta qozgani Balon d'orni ushlab turibdi", cap: "Besh ta Ballon d'Or" },
    { title: "Chempionlar Ligasi — 5", sub: "140 ta gol — musobaqa rekordi — 183 ta oʻyinda.", src: "/img/cab-ucl.webp", w: 800, h: 600, pos: "50% 25%", alt: "Kristiano Ronaldo bes marta yutgan Yevropa kubogi va UEFA Champions League kuboklari", cap: "Besh ta yevropa tituli va 140 ta Chempionlar Ligasi goli" },
    { title: "FIFA Club World Cup — 4", sub: "2008, 2014, 2016 va 2017-yillarda Manchester United va Real Madrid bilan.", src: "/img/cab-cwc.webp", w: 800, h: 600, pos: "50% 25%", alt: "Maderadagi CR7 muzeyida FIFA Klub Jahon Kubogi Golden Ball kuboklari", cap: "Toʻrtta FIFA Club World Cup" },
    { title: "La Liga — 311 ta gol", sub: "Musobaqaning barcha davrlardagi rekordi — barchasi Real Madrid uchun.", src: "/img/cab-liga.webp", w: 800, h: 600, pos: "50% 25%", alt: "Real Madridning 7-raqamli futbolkasida Kristiano Ronaldo, ikki marta yutgan La Liga'da", cap: "Real Madrid uchun 311 ta La Liga goli" }
  ];

export const BDAY_MEDIA = {
    "searchHighlights": "🔍 Harakatlarni qidiring",
    "openArchive": "CR7 gol arxivida ochish",
    "noClip": "Bu gol uchun nashr qilingan klip yo'q.",
    "noClipBody": "Pastdagi match yozuvi rasmiy match varaqalaridan olingan. Havolalar arxivdagi gol sahifasini va videoni qidirishni ochadi.",
    "clipLabel": "Nashr qilingan klip",
    "seasonNote": "{season} mavsumida Ronaldoning barcha golari.",
    "compilationNote": "Bu gol barchi gollar kompilyatsiyasida mavjud. Uni aniq joyini topish uchun arxiv havolasidan foydalaning.",
    "compilationLabel": "Barcha gollar kompilyatsiyasi",
    "publisher": "Nashr qilgan",
    "assist": "Yordam: {name}",
    "finish": "Yakunlash: {type}",
    "goalNumber": "{n}-gol",
    "watchOn": "{publisher} da ko'ring",
    "sourceLine": "Gol yozuvi: {source} — arxiv o'z ro'yxatini Vikipediyaning 'List of senior career goals by Cristiano Ronaldo' (CC BY-SA 4.0, FBref gol jurnaliga asoslangan) va StatsBomb ochiq ma'lumotlaridan oladi. Kliplar huquq egalari tomonidan nashr qilinadi.",
    "sourceNote": "Ushbu sahifadagi sanalar, musobaqalar, hisoblar, daqiqalar, yakunlash turlari va yordamlar cr7allgoals.com dan olinadi, uning har bir gol ro'yxati Vikipediyaning 'List of senior career goals by Cristiano Ronaldo' (CC BY-SA 4.0, FBref gol jurnaliga asoslangan) bo'lib, ko'rib chiqilgan match tafsilotlari uchun StatsBomb ochiq ma'lumotlari ishlatiladi. Xalqaro ro'yxat RSSSFning chiqishlar yozuvi — Portugaliya uchun 234 ta o'yinda 146 ta gol. Daqiqa hech qachon nashr qilinmagan joylarda uni o'ylab topish o'rniga bo'sh qoldiriladi."
  };
