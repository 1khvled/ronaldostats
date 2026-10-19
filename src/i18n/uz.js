// UZ dictionary — RonaldoStats
// Extracted verbatim from the original inline dictionaries by
// scripts/refactor-i18n.mjs. Structure is identical across all 9 languages.

export const HOME = {
    locale: "uz-UZ",
    shirt10: "10-raqamli futbolka",
    head: (t, p, d) => `Barselona, PSJ, Inter Mayami va Argentina terma jamoasi safida <b>${n(t.apps)} ta rasmiy o'yinda</b> <b>${n(t.goals)} ta gol</b> (${esc(d.lastUpdated)} holatiga). Jahon chempioni va 8 karra “Oltin to'p” sohibi.`,
    meta: (p, dob) => `${esc(p.name)}, ${dob} da ${esc(p.birthplace)} shahrida tug'ilgan. Yoshi ${p.age} da, hujumchi, ayni paytda ${esc(p.current.join(" va "))} sharafini himoya qilmoqda.`,
    roleLabel: "Amplua",
    teamsLabel: "Jamoalar",
    nowLabel: "Hozirda",
    kpiCareer: "Karyeradagi gollar",
    kpiCareerNote: (gpg, seasons) => `${seasons} klub mavsumida har o'yinda ${gpg} tadan gol.`,
    kpiApps: "Rasmiy o'yinlar",
    kpiAppsNote: (clubs, country) => `${clubs} ta klub, ${country} ta Argentina.`,
    kpiArg: "Argentina safida gollar",
    kpiArgNote: (gpg, caps) => `${caps} ta o'yinda har o'yinga ${gpg} ta gol.`,
    kpiTrophies: "Jamoaviy sovrinlar",
    kpiTrophiesNote: (lang) => `Rekord darajadagi ${LIVE.trophies} ta titul va 8 ta “Oltin to'p”. <a href="/${lang}/achievements">To'liq ro'yxat</a>.`,
    kpiRoad: "1 000 ta gol sari",
    kpiRoadNote: (togo, projYear, pace) => `Yana ${togo} ta gol qoldi. Hozirgi sur'atda (~yiliga ${pace.toFixed(0)} ta gol), 1 000-golga ${projYear}-yil atrofida erishiladi.`,
    copyStatsBtn: "Statistikani nusxalash",
    copyText: (goals, apps, clubGoals, argGoals, updated) => `Messi: ${apps} ta rasmiy o'yinda ${goals} ta gol (${clubGoals} klub, ${argGoals} Argentina), ${LIVE.trophies} ta sovrin, 8 ta “Oltin to'p” — ${updated} holatiga.`,
    copyMsg: "Buferga nusxalandi!",
    clubCaption: (updated, lang) => `Lionel Messining barcha jamoalardagi o'yin va gollari (${updated} holatiga). <a href="/${lang}/goalsbyseason">Mavsumlar bo'yicha</a> to'liq taqsimot.`,
    thTeam: "Jamoa va yillar",
    thApps: "O'yinlar",
    thGoals: "Gollar",
    thGpg: "Gol / O'yin",
    thTotal: "Karyera jami",
    yearSub: "Istalgan yilni tanlang va 2004-yildagi debyutidan to bugungacha bo'lgan gollar o'sishini kuzating.",
    yearTitle: "Messining taqvim yillari bo'yicha statistikasi",
    yearLabel: "Yil",
    yearFigcap: (start, cur, prov, lang) => `${start}-yildan ${cur}-yilgacha bo'lgan gollar — 2012-yilda rekord 91 ta gol. <a href="/${lang}/goalsbyyear">To'liq jadvalni ochish</a>.`,
    tileGoals: (year, prov) => `${year}-yildagi gollar`,
    tileTotal: (year) => `${year}-yildan keyingi umumiy gollar`,
    tileAge: (year) => `${year}-yildagi yoshi`,
    records: (best, post30, pct) => [
      [`91`, `<b>2012-yilda 91 ta gol</b>, futbol tarixida bir taqvim yilida urilgan gollar bo'yicha mutlaq jahon rekordi.`],
      [`8`, `<b>“Oltin to'p”</b> (2009–12, 2015, 2019, 2021, 2023) — futbol tarixidagi mutlaq rekord.`],
      [`474`, `<b>La Ligada 474 ta gol</b>, Ispaniya chempionati va Yevropaning top-ligalari tarixidagi rekord.`],
      [`129`, `<b>Chempionlar Ligasida 129 ta gol</b> — 120 ta Barselona va 9 ta PSJ safida, tarixdagi 2-natija.`],
      [post30, `<b>30 yoshdan keyin urilgan gollar</b> — butun faoliyatidagi gollarning taxminan ${pct}% qismi.`],
      [`57`, `<b>Het-trik yoki undan ko'p</b> klub va terma jamoa safidagi o'yinlarda.`],
      [`46`, `<b>Jamoaviy sovrinlar</b> — futbol tarixidagi eng ko'p sovrin yutgan futbolchi, 2022-yilgi Jahon kubogi bilan bezatilgan.`]
    ],
    silverCaption: () => `Messining barcha ${LIVE.trophies} ta rasmiy jamoaviy titullari va eng yuksak shaxsiy sovrinlari.`,
    silverThTrophy: "Sovrin",
    silverThTimes: "Soni",
    silverThNote: "Tafsilotlar",
    silverRows: [
      ["Barselona bilan sovrinlar", "35", "2005 - 2021, shu jumladan 4 ta ECHL va 10 ta La Liga"],
      ["Argentina bilan sovrinlar", "5", "Jahon chempionati 2022, Amerika kubogi 2021 va 2024, Finalissima 2022, Olimpiada oltini 2008"],
      ["PSJ bilan sovrinlar", "3", "Liga 1 2022 va 2023, Fransiya Superkubogi 2022"],
      ["Inter Mayami bilan sovrinlar", "4", "Leagues Cup 2023, Supporters' Shield 2024, MLS kubogi 2025, Campeones kubogi 2026"],
      ["“Oltin to'p”", "8", "Mutlaq jahon rekordi — 2009–12, 2015, 2019, 2021, 2023"]
    ],
    splitFk: "Jarima to'pidan gollar",
    splitFkNote: "Klub va terma jamoa safida jarimadan kiritilgan ajoyib gollar.",
    splitPen: "Penaltidan gollar",
    splitPenNote: "Karyerasidagi taxminan har sakkizta goldan bittasi.",
    splitHt: "Het-trik yoki undan ko'p",
    splitHtNote: "Bitta o'yinda 3 ta yoki undan ko'p gol urilgan bahslar.",
    splitCaveat: (tot) => `Jarima va penaltilar bo'yicha ma'lumotlar rasmiy protokollar asosida jamlangan. Jami ${tot} ta gol soni to'liq tasdiqlangan.`,
    faq: (t, agg, m, d, lang) => [
      ["Lionel Messi jami nechta gol urgan?", `<b>${n(t.goals)} ta rasmiy gol</b> ${n(t.apps)} ta o'yinda (${esc(d.lastUpdated)} holatiga), har o'yinga o'rtacha ${t.goalsPerGame} ta gol. <a href="/${lang}/goalsbyyear">Yillar bo'yicha gollar</a>.`],
      ["Messi Barselona safida nechta gol urgan?", `<b>${n(agg.barcelona.goals)} ta gol</b> ${n(agg.barcelona.apps)} ta o'yinda (2004-2021) — La Ligada rekord 474 ta gol bilan.`],
      ["PSJ va Inter Mayamida nechta gol urdi?", `<b>PSJ uchun ${agg.psg.goals} ta</b> va <b>Inter Mayami uchun ${n(agg.miami.goals)} ta gol</b>.`],
      ["Messi Argentina terma jamoasida nechta gol urgan?", `<b>${n(t.country.goals)} ta gol</b> ${n(t.country.apps)} ta o'yinda (2005-yildan buyon).`],
      ["Messining eng sermahsul yili qaysi bo'lgan?", `<b>2012-yil, 91 ta gol</b> — jahon futboli tarixidagi mutlaq rekord. <a href="/${lang}/goalsbyyear">Barcha yillar</a>.`],
      ["Messi faoliyatida nechta sovrin yutgan?", `<b>47 ta jamoaviy titul</b> (35 ta Barselona, 3 ta PSJ, 4 ta Mayami, 5 ta Argentina). <a href="/${lang}/achievements">Barcha sovrinlar</a>.`]
    ]
  };

export const BY_YEAR = {
    head: (ys, best, t) => `${ys[0].year} yildagi birinchi rasmiy goldan to <b>${best.year} yildagi ${best.goals} ta golgacha</b> — ${n(t.goals)} ta gollik faoliyat.`,
    cap: (best, t) => `Ustunlar: o'sha yildagi gollar (cho'qqi ${best.year} yilda ${best.goals}). Chiziq: ${n(t.goals)} tagacha o'sish.`,
    chartLabel: (best) => `Messining yillik gollari`,
    kpiCareer: "Faoliyatdagi gollar",
    kpiBest: "Eng yaxshi yil",
    kpiBestSub: "Bir kalendar yilidagi jahon rekordi.",
    kpiCurrSub: "Mavsum davom etmoqda.",
    kpiYears: "Gol urilgan yillar",
    kpiYearsSub: (ys, last) => `${ys[0].year} yildan ${last.year} yilgacha har bir yil.`,
    decades: "O'n yillikdagi gollar",
    tableSub: "Eng so'nggilari oldinda. 2026 yil davom etmoqda. Saralash uchun ustunga bosing.",
    caption: "2004 yildagi debyutidan buyon har bir yildagi gollar va yosh.",
    thYear: "Yil", thGoals: "Gollar", thTotal: "Jami", thAge: "Yosh",
    inProgNote: "* 2026 yilgi mavsum davom etmoqda — har bir o'yindan so'ng yangilanadi.",
    filterPlaceholder: "Yillarni saralash — masalan: 2012",
    bestYearHtml: (best) => `<p><b>${best.year} futbol tarixidagi eng ajoyib yil bo'lgan: ${best.goals} ta gol</b> — Barselona uchun 79 ta va Argentina uchun 12 ta gol. <a href="/uz/dashboard">Paneldan to'liq ko'ring</a>.</p>`
  };

export const BY_SEASON = {
    head: (best) => `2004/05 yildan 2026 yilgacha bo'lgan barcha klub mavsumlari — <b>rekord: ${best.season} mavsumda ${best.goals} ta gol</b>.`,
    clubSub: "Har bir formatdagi o'yinlar / gollar. 2026 yil davom etmoqda.",
    caption: (len) => `Barcha ${len} ta klub mavsumi: Barselona, PSJ va Inter Mayami.`,
    thSeason: "Mavsum", thClub: "Klub", thApps: "O'yinlar", thGoals: "Gollar", thLeague: "Liga", thCup: "Kubok", thCont: "Xalqaro", thOther: "Boshqa",
    totalLabel: "Klublar jami", bestBadge: "Klubdagi eng yaxshi mavsum",
    filterClubPlaceholder: "Mavsumlarni saralash — masalan: PSJ, 2012",
    countrySub: "Rasmiy va o'rtoqlik uchrashuvlari, eng so'nggilari oldinda.",
    countryCaption: "Argentina terma jamoasida kalendar yillari bo'yicha gollar (2005–2026).",
    thYear: "Yil", thNote: "Tafsilotlar", totalArgLabel: "Argentina jami",
    filterCountryPlaceholder: "Argentina yillarini saralash — masalan: 2022",
    bestSeasonHtml: (best) => `<p><b>${best.season} — Barselona safida ${best.apps} ta o'yinda ${best.goals} ta gol</b> — futbol tarixidagi eng sermahsul mavsum: La Ligada 50 ta (rekord), Chempionlar Ligasida 14 ta gol. <a href="/uz/goalsbyyear">Yillar bo'yicha gollarni ko'ring</a>.</p>`
  };

export const DASH = {
    teamNames: { all: "barcha jamoalar", barcelona: "Barselona", psg: "PSJ", miami: "Inter Mayami", argentina: "Argentina" },
    pills: [["all", "Barcha jamoalar"], ["barcelona", "Barselona"], ["psg", "PSJ"], ["miami", "Inter Mayami"], ["argentina", "Argentina"]],
    head: (name) => `Lionel Messining barcha 930 goli 4 usulda tahlil qilingan — musobaqa, mavsum, yakunlash usuli va tana a'zosi bo'yicha — <b>${esc(name)}</b> uchun filtrlangan. Diagrammalarni yangilash uchun jamoani bosing.`,
    filterNote: (name, goals, apps, T) => `${name} ko'rsatilmoqda: ${n(apps)} o'yinda ${n(goals)} gol` + (T === "barcelona" || T === "psg" ? " (Chempionlar Ligasidagi taqsimot: Barselona 120, PSJ 9 — rasmiy klub manbalari asosida)." : "."),
    kpis: { goals: "Gollar", apps: "O'yinlar", gpg: "O'yin boshiga gol", forTeam: (name) => `${name} safida.` },
    chartEmpty: "Ushbu jamoa filtri uchun qatorlar mavjud emas.",
    figCap: (T, name) => T === "all" ? "Kalendar yillari, 2004 yildan 2026 yilgacha." : T === "argentina" ? "Argentina safidagi kalendar yillari." : esc(name) + " safidagi klub mavsumlari.",
    finishParts: { "Open play": "O'yin ichidagi to'plar", "Penalties": "Penaltilar", "Free kicks": "Jarima to'plari" },
    finishCenter: "faoliyat gollari",
    finishCaveat: "Barcha jamoalar bo'yicha umumiy faoliyat ko'rsatkichlari. Tasdiqlangan rasmiy hisob.",
    finishCaveatFiltered: (d) => `Alohida jamoalar bo'yicha yakunlash ko'rsatkichlari mavjud emas — umumiy faoliyat natijalarini ko'ring. Uning ${n(d.totals.goals)} ta rasmiy golidan: ${d.byFinish.openPlay} tasi o'yindan, ${d.byFinish.penalties} tasi penaltidan va ${d.byFinish.freeKicks} tasi jarimadan.`,
    bodyParts: { "Left foot": "Chap oyoq", "Right foot": "O'ng oyoq", "Head": "Bosh", "Other": "Boshqa (ko'krak va hk.)" },
    bodyCenter: "chap oyoqda",
    bodyCaveat: "Barcha jamoalar bo'yicha umumiy faoliyat ko'rsatkichlari (tasdiqlangan rasmiy hisob).",
    ageName: (r) => `${r.age} yosh · ${r.year}`,
    ageCaveat: (apeak) => `Uning yoshi bo'yicha urilgan har bir professional gol — klub va terma jamoa birgalikda. Eng yuqori cho'qqi: ${apeak.age} yoshida ${apeak.goals} ta gol (${apeak.year}).`,
    ageFilterNote: "Yoshlar klub va terma jamoani birlashtiradi, shuning uchun bu grafik faqat butun faoliyatni qamrab oladi — ko'rish uchun filtrni bekor qiling.",
    compCaption: (name) => `Musobaqalar bo'yicha gollar — ${esc(name)}.`,
    thComp: "Musobaqa", thGoals: "Gollar", thShare: "Ulush",
    recAllTime: "Musobaqaning mutlaq rekordi",
    finishCaption: "Gollar qanday urilgan va qaysi tana a'zosi bilan — butun faoliyat, barcha jamoalar.",
    thFinish: "Yakunlash / Tana a'zosi",
    finishCaveatTable: "Yakunlash va tana a'zosi bo'yicha taqsimot rasmiy tasdiqlangan hisobdir.",
    finishRows: (d) => [
      ["O'yin ichidagi to'plar", d.byFinish.openPlay],
      ["Penaltilar", d.byFinish.penalties],
      ["To'g'ridan-to'g'ri jarima to'plari", d.byFinish.freeKicks],
      ["Chap oyoq", d.byBodyPart.left],
      ["O'ng oyoq", d.byBodyPart.right],
      ["Bosh bilan", d.byBodyPart.head],
      ["Boshqa (ko'krak va hk.)", d.byBodyPart.other]
    ],
    teamCardSub: { goals: "gollar", apps: "o'yinlar", gpg: "har o'yinda", of: "jami" },
    records: (comp, d) => [
      ["91", `<b>2012 yildagi gollar</b> — bir kalendar yilidagi jahon rekordi.`],
      [n(comp("La Liga")), `<b>La Ligadagi gollar</b> — musobaqaning mutlaq rekordi, barchasi Barselona safida.`],
      [n(comp("UEFA Champions League")), `<b>Chempionlar Ligasidagi gollar</b> — Barselona uchun 120, PSJ uchun 9.`],
      ["8", `<b>Oltin to'p</b> — futbol tarixidagi rekord (2009–12, 2015, 2019, 2021, 2023).`],
      [n(d.hatTricks), `<b>Xet-trik yoki undan ko'p</b> klub va terma jamoada.`],
      [`${LIVE.trophies}`, `<b>Rasmiy sovrinlar</b> — futbol tarixidagi eng ko'p unvonga ega o'yinchi.`]
    ],
    method: "Chempionlar Ligasidagi gollar rasmiy manbalar asosida Barselona 120 va PSJ 9 ga bo'lingan."
  };

export const TIMELINE = {
    head: (t) => `2004 yildagi Barselonadagi debyutidan buyon <b>${n(t.goals)} faoliyat goli</b>gacha — tarixiy lahzalar, rekordlar va sovrinlar xronologik tartibda.`,
    keydates: (t, lastUpdated) => [
      ["16 Okt 2004", "17 yoshida Espanyolga qarshi <b>Barselona</b> safida professional debyut."],
      ["1 May 2005", "Albacete darvozasiga birinchi gol — o'sha paytda Barselona tarixidagi eng yosh to'purar."],
      ["17 Avg 2005", "Vengriyaga qarshi <b>Argentina</b> terma jamoasi safida debyut."],
      ["2012", "Bir kalendar yilida <b>91 ta gol</b> — futbol tarixidagi mutlaq jahon rekordi."],
      ["18 Dek 2022", "Qatarda Argentina bilan <b>Jahon chempioni</b> bo'ldi, finalda dubl qayd etdi."],
      [esc(lastUpdated), `Klub va terma jamoada <b>${n(t.goals)} faoliyat goli</b> — so'nggi yangilanish.`]
    ],
    inProg: "davom etmoqda",
    goals: "gollar",
    goalsInEra: (goals, share, total) => `<b>${n(goals)} gollar</b> · ${n(total)} ning ${share}% i`,
    peakYear: (pk, tr) => `<p class="ch-callout">Eng yuqori yil <b>${pk.year} · ${pk.goals} gollar</b>` + (tr ? ` · bu davrda <b>${tr}</b> ta jamoaviy sovrin qo'lga kiritilgan` : "") + `</p>`,
    empty: (val, total) => `“${val}” bo'yicha hech narsa topilmadi — barcha ${total} ta muhim voqeani ko'rish uchun qidiruvni tozalang.`,
    tagRecord: "Rekord", tagWc: "JCh", tagFirst: "Birinchi",
    faq: [
      ["Messi qachon debyut qilgan?", "Barselona uchun <b>2004 yil 16 oktyabrda</b> Espanyolga qarshi 17 yoshida; Argentina uchun 2005 yil 17 avgustda."],
      ["Messi birinchi golini qachon urgan?", "<b>2005 yil 1 mayda</b> Albacetega qarshi — o'sha paytda Barselona tarixidagi eng yosh to'purar."],
      ["Messi Jahon chempionatini qachon yutgan?", "<b>2022 yil 18 dekabrda</b>, Lusaildagi dramatik 3–3 dan so'ng penaltilar seriyasida Fransiyani mag'lub etib."],
      ["Messi Barselonani qachon tark etdi?", "<b>2021 yil avgustda</b>, klubda 21 yil o'tkazgach, Parij Sen-Jermenga o'tdi."],
      ["Messi Inter Mayamiga qachon qo'shildi?", "<b>2023 yil iyulda</b>, kelganidan bir necha hafta o'tib Ligalar Kubogini qo'lga kiritdi."]
    ],
    method: "Xronologik qaydlar aniq sanalar bilan kiritilgan; gollar butun faoliyat ko'rsatkichiga to'liq mos keladi."
  };

export const ACH = {
    head: (teamTotal) => `<b>${teamTotal} ta jamoaviy sovrin</b> — futbol tarixidagi eng ko'p unvonga ega faoliyat — hamda rekord <b>8 ta Oltin to'p</b>.`,
    kpis: (per) => [
      ["Jamoaviy sovrinlar", 46, `Barselona ${per["Barcelona"] || 0} · Argentina ${per["Argentina"] || 0} · PSJ ${per["Paris Saint-Germain"] || 0} · Mayami ${per["Inter Miami"] || 0}.`],
      ["Oltin to'p", "8", "Rekord — 2009–12, 2015, 2019, 2021, 2023."],
      ["Chempionlar Ligasi", "4", "2006, 2009, 2011, 2015 — barchasi Barselona safida."],
      ["Katta xalqaro sovrinlar", "3", "Jahon chempionati 2022, Amerika Kubogi 2021 va 2024."]
    ],
    qa: (teamTotal, per) => [
      ["Messi nechta sovrin yutgan?", `<b>${teamTotal} ta rasmiy jamoaviy sovrin</b>: ${per["Barcelona"] || 0} Barselonada, ${per["Paris Saint-Germain"] || 0} PSJda, ${per["Inter Miami"] || 0} Inter Mayamida va ${per["Argentina"] || 0} Argentinada.`],
      ["Messida nechta Oltin to'p bor?", "<b>Sakkizta</b> — futbol tarixidagi boshqa har qanday futbolchidan ko'p (2009–12, 2015, 2019, 2021, 2023)."],
      ["Messi Jahon chempionatini yutganmi?", "<b>Ha — 2022 yilda</b>, Fransiyaga qarshi finalda 2 ta gol urib, shuningdek 2021 va 2024 yillarda Amerika Kubogini yutgan."],
      ["Messida nechta Chempionlar Ligasi sovrini bor?", "<b>To'rtta</b>, barchasi Barselona bilan: 2006, 2009, 2011 va 2015."]
    ],
    teamHeader: (team, sub) => `${esc(team)} — ${sub} ta sovrin`,
    indHeader: (indTotal) => `Shaxsiy unvonlar — ${indTotal} ta mukofot`,
    faq: [
      ["Messining eng muhim sovrini qaysi?", "<b>2022 yilgi Jahon chempionati</b> — uning butun faoliyatidagi eng oliy cho'qqi, turnirning eng yaxshi o'yinchisi sifatida qo'lga kiritilgan."],
      ["Messi nechta liga chempionligini yutgan?", "<b>12 ta liga chempionligi</b> — 10 ta La Liga, 2 ta Liga 1 — hamda Mayami bilan Supporters' Shield."],
      ["Messida nechta shaxsiy mukofot bor?", "8 ta Oltin to'p, 6 ta Yevropa Oltin butsasi va 2 ta Jahon chempionati Oltin to'pi — har biri mutlaq rekord."],
      ["Messi tarixdagi eng ko'p unvonga ega futbolchimi?", "Jamoaviy sovrinlar va shaxsiy rekordlar yig'indisi bo'yicha — <b>ha, shubhasiz</b>."]
    ]
  };

export const BDAY = {
    months: ["", "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"],
    badgeSuccess: "🎉 Ha! Messi tug'ilgan kuningizda gol urgan!",
    badgeMessi: "🎂 Leo Messining o'z tug'ilgan kuni!",
    badgeEmpty: "Ushbu sanada gol urilmagan",
    headlineSuccess: (g, m, d) => `Lionel Messi butun faoliyati davomida ${d} sanasida <b>${m} ta o'yinda</b> <b>${g} ta gol</b> urgan!`,
    headlineMessi: `Siz <b>Lionel Andres Messi</b> bilan bir kunda tug'ilgansiz (1987-yil 24-iyunda Rozarioda tug'ilgan)!`,
    headlineEmpty: (d) => `Lionel Messi o'z faoliyatida <b>${d}</b> sanasida gol urmagan.`,
    whyZeroTitle: "Nega 0 ta gol?",
    whyZeroMessi: "Lionel Messi 24-iyunda hech qachon rasmiy o'yinda maydonga tushmagan, chunki iyun oyining oxiri Yevropa klublarining yozgi tanaffusiga yoki xalqaro turnirlar bosqichlari orasidagi dam olish kunlariga to'g'ri keladi.",
    whyZeroMessiSub: "Siz o'z bayramingizni futbol tarixidagi eng buyuk o'yinchi bilan bir kunda nishonlaysiz!",
    emptyExpl: "Messi bu kunda o'yin o'tkazmagan yoki gol urmagan — lekin u yilning <b>366 kunidan 292 tasida (79,8%)</b> gol urgan!",
    closestDay: (d, g) => `Messining gol urgan eng yaqin taqvim kuni — <b>${d}</b> (karyerasida ${g} ta gol).`,
    closestBtn: (d, g) => `${d} (${g} gol) ni tekshirish &rarr;`,
    watchClip: (cnt) => `Videoni ko'rish (${cnt > 1 ? cnt + " ta gol" : "gol"})`,
    searchYt: "🔍 YouTubedan qidirish",
    playInline: "📺 Shu yerda ko'rish",
    closeInline: "✕ Videoni yopish",
    ytHighlights: "YouTubeda tomosha qilish",
    goalSummary: (g) => `${g} ta gol urilgan:`,
    goalTab: (idx, min) => `Gol ${idx}${min ? ` (${min}')` : ""}`,
    shareSuccess: (d, g, m) => `Lionel Messi mening tug'ilgan kunimda (${d}) ${m} ta o'yinda ${g} ta gol urgan! O'z sanangizni tekshiring:`,
    shareEmpty: (d) => `Messi sizning tug'ilgan kuningizda gol urganmi? U yilning 292 kunida gol urgan! Tekshiring:`,
  };

export const LATEST_GOAL = {
    goalPrefix: "-gol",
    scoreline: "Hisob",
    didScoreTodayYes: "HA! Lionel Messi bugun gol urdi: {opp}ga qarshi {minute}-daqiqada faoliyatidagi {goalNum}-golini kiritdi ({score})!",
    didScoreTodayNo: "Messi bugun gol urdimi? Lionel Messining eng soʻnggi rasmiy oʻyini {date} kuni {comp} doirasida boʻlib oʻtdi va u {minute}-daqiqada faoliyatidagi {goalNum}-golini urib jamoasining {score} hisobidagi gʻalabasini taʼminladi. Rasmiy gol videosini yuqorida tomosha qiling.",
    matchResult: "Eng soʻnggi oʻyin natijasi: {title}",
    goalBadge: "{goalNum}-gol urildi ({minute})",
    playHighlight: "Yuqoridagi pleyerda videoni tomosha qilish uchun Lionel Messining soʻnggi gollaridan birini tanlang:",
    viewDateGoals: "{formattedDate} gollarini koʻrish →",
    tagHeader: "Bosh bilan 🔥",
    tagFreekick: "Jarima zarbasi 🔥",
    tagPenalty: "Penalti",
    tagLeftFoot: "Chap oyoq zarbasi",
    tagRightFoot: "Oʻng oyoq",
    tagOpenPlay: "Ochiq oʻyin",
    assist: "Uzatma"
  };

export const ARG_STREAM = {
    badge: "🇦🇷 ARGENTINA BILAN SOʻNGGI OʻYIN",
    title: "Lionel Messining xayrlashuv uchrashuvi",
    text: "Lionel Messining 2026-yil 6-oktabrdagi xayrlashuv oʻyini! Jonli efirni REKLAMASIZ va mutlaqo bepul tomosha qiling.",
    highlight: "Bepul jonli efir • Reklamasiz",
    cta: "Bepul Efirni Koʻrish ▶",
    closeAria: "Bildirishnomani yopish",
    matchCardTitle: "Tarixiy Xayrlashuv Oʻyini • 6-oktabr 2026",
    matchCardDesc: "Lionel Messining Argentina terma jamoasidagi soʻnggi bahsini Koora Live orqali hech qanday reklamasiz bepul tomosha qiling."
  };

export const EXPLORE_LANGS = [
    { href: "/uz/birthday", page: "birthday", t: "🎂 Messi sizning tug'ilgan kuningizda gol urganmi?", d: (d) => `Yilning 366 kunidagi gollarni videolar bilan ko'ring (${n(d.totals.goals)} ta gol).` },
    { href: "/uz/messi-vs-ronaldo", page: "messi-vs-ronaldo", t: "🐐 Messi vs Ronaldu Tarixiy", d: () => `O'zaro solishtirma: ${n(LIVE.goals)} ga ${n(LIVE.rGoals)} ta gol, ${LIVE.trophies} ga ${LIVE.rTrophies} ta titul, 8 ta “Oltin to'p”.` },
    { href: "/uz/vs-real-madrid", page: "vs-real-madrid", t: "⚔️ Messi vs Real Madrid", d: () => "El-Klasikodagi 26 ta gol, 45 ta o'yin va 14 ta assist." },
    { href: "/uz/champions-league", page: "champions-league", t: "⭐ Chempionlar Ligasi rekordi", d: () => "UEFA Chempionlar Ligasida 129 ta gol, 8 ta het-trik va 4 ta Yevropa chempionligi." },
    { href: "/uz/latest-goal", page: "latest-goal", t: "⚽ Messining soʻnggi goli video", d: () => "Messining soʻnggi goli videosini tomosha qiling, bugun gol urdimi va soʻnggi gollari." },
    { href: "/uz", page: "home", t: "Lionel Messi statistikasi", d: (d) => `Asosiy raqamlar: ${n(d.totals.apps)} ta o'yinda ${n(d.totals.goals)} ta rasmiy gol.` },
    { href: "/uz/dashboard", page: "dashboard", t: "Interaktiv statistika paneli", d: () => "Barselona, PSJ, Inter Mayami yoki Argentina bo'yicha saralang." },
    { href: "/uz/timeline", page: "timeline", t: "Karyera xronologiyasi", d: () => "2004 yildan to hozirgi kungacha bo'lgan tarixiy sanalar." },
  ];

export const ERA_INTROS = {
    rosario: `2004 yil oktyabrida 17 yoshli bola Espanyolga qarshi maydonga tushadi. Keyingi yil may oyida Albacete darvozasiga Ronaldinyo pasidan so'ng ilk golini uradi va 2008 yilda Olimpiada oltin medalini qo'lga kiritadi.`,
    peak: `2009 yilda oltita sovrin. Ketma-ket to'rtta Oltin to'p. Va 2012 yil: bir yilda 91 ta gol bilan tarixiy jahon rekordi.`,
    msn: `Messi, Suares va Neymar — afsonaviy MSN triosi 2015 yilda Berlinda ikkinchi tarixiy treblni qo'lga kiritdi.`,
    carry: `2017 yilda PSJ ustidan 6-1 hisobidagi g'alaba, Bernabeuda 10-raqamli futbolkani ko'rsatib nishonlash va 2018 yilgi oltin dubl.`,
    farewell: `Oltinchi Oltin to'p, 2021 yilgi Ispaniya kubogi va 21 yillik afsonaviy davrdan so'ng Barselona bilan xayrlashuv.`,
    paris: `PSJ bilan ikkita liga chempionligi, ettinchi Oltin to'p va 2022 yil 18 dekabrda Qatarda Jahon chempionligi: finalda ikkita gol.`,
    miami: `Birinchi oydayoq Ligalar Kubogi, sakkizinchi Oltin to'p, Argentina bilan yana bir Amerika Kubogi va 1 000 ta rasmiy gol sari yurish.`
  };

export const CABINET = [
    { title: "Jahon chempionati — 2022", sub: "Futbol tarixidagi eng oliy cho'qqi, Lusail 18 dekabr 2022.", src: "/img/cab-wc.webp", w: 800, h: 600, pos: "50% 30%", alt: "Messi Lusailda 2022 yilgi Jahon chempionligini nishonlamoqda", cap: "Jahon chempionlari, Lusail 2022" },
    { title: "Oltin to'p — 8", sub: "Mutlaq rekord bo'lgan 8 ta: 2009–12, 2015, 2019, 2021, 2023.", src: "/img/cab-ballon.webp", w: 800, h: 600, pos: "50% 30%", alt: "Messi sakkizinchi Oltin to'pni ko'tarmoqda", cap: "Tarixiy rekord 8 ta Oltin to'p" },
    { title: "Chempionlar Ligasi — 4", sub: "2006, 2009, 2011, 2015 — barchasi Barselona bilan.", src: "/img/cab-ucl.webp", w: 800, h: 600, pos: "50% 25%", alt: "Messi Chempionlar Ligasi kubogi bilan", cap: "Barselona bilan 4 karra Yevropa chempioni" },
    { title: "Amerika Kubogi — 2", sub: "Ketma-ket ikki karra qit'a chempioni, 2021 va 2024.", src: "/img/cab-copa.webp", w: 800, h: 600, pos: "50% 25%", alt: "Messi Marakanada Amerika Kubogini o'pmoqda", cap: "Amerika Kubogi chempionlari, Marakana 2021" },
    { title: "La Liga chempionligi — 10", sub: "Barselona safidagi mutlaq yetakchilik 2004–2019.", src: "/img/cab-liga.webp", w: 800, h: 600, pos: "50% 25%", alt: "Messi La Liga kubogi bilan", cap: "Barselona bilan 10 karra Ispaniya chempioni" }
  ];
