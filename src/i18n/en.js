// EN dictionary — RonaldoStats
// Extracted verbatim from the original inline dictionaries by
// scripts/refactor-i18n.mjs. Structure is identical across all 9 languages.

export const HOME = {
    locale: "en-GB",
    shirt10: "Shirt number 10",
    head: (t, p, d) => `<b>${n(t.goals)} goals</b> in <b>${n(t.apps)} senior appearances</b> — for Barcelona, PSG, ${esc(p.current.join(" and "))}. A World Cup winner and record eight-time Ballon d'Or holder, counted by hand and checked twice, as of ${esc(d.lastUpdated)}.`,
    meta: (p, dob) => `${esc(p.name)}, born ${dob} in ${esc(p.birthplace)}. He is ${p.age}, plays as a ${esc(p.position.toLowerCase())} and is currently at ${esc(p.current.join(" and "))}.`,
    roleLabel: "Role",
    teamsLabel: "Teams",
    nowLabel: "Now",
    kpiCareer: "Career goals",
    kpiCareerNote: (gpg, seasons) => `${gpg} goals per game across ${seasons} club seasons.`,
    kpiApps: "Senior appearances",
    kpiAppsNote: (clubs, country) => `${clubs} club, ${country} Argentina.`,
    kpiArg: "Argentina goals",
    kpiArgNote: (gpg, caps) => `${gpg} per cap across ${caps} caps.`,
    kpiTrophies: "Team trophies",
    kpiTrophiesNote: (lang) => `Plus a record 8 Ballons d'Or. <a href="/${lang}/achievements">Full honours list</a>.`,
    kpiRoad: "Road to 1,000 goals",
    kpiRoadNote: (togo, projYear, pace) => `${togo} to go. Rough projection at current pace (~${pace.toFixed(0)} a year): 1,000 lands around ${projYear}.`,
    copyStatsBtn: "Copy headline stats",
    copyText: (goals, apps, clubGoals, argGoals, updated) => `Messi: ${goals} goals in ${apps} senior apps (${clubGoals} club, ${argGoals} Argentina), ${LIVE.trophies} trophies, 8 Ballons d'Or — as of ${updated}.`,
    copyMsg: "Copied — paste it anywhere.",
    clubCaption: (updated, lang) => `Appearances and goals for every senior team Lionel Messi has played for, as of ${updated}. Full competition splits are on the <a href="/${lang}/goalsbyseason">goals by season page</a>.`,
    thTeam: "Team and years",
    thApps: "Apps",
    thGoals: "Goals",
    thGpg: "Goals per game",
    thTotal: "Career total",
    yearSub: "Pick a year and watch the running total climb — all the way from his 2004 debut to today.",
    yearTitle: "Messi stats by calendar year",
    yearLabel: "Year",
    yearFigcap: (start, cur, prov, lang) => `Calendar-year goals, ${start} to ${cur}${prov ? " (in progress)" : ""} — peaking at 91 in 2012. <a href="/${lang}/goalsbyyear">Open the full table</a>.`,
    tileGoals: (year, prov) => `Goals in ${year}${prov ? " (so far)" : ""}`,
    tileTotal: (year) => `Career total after ${year}`,
    tileAge: (year) => `Age during ${year}`,
    records: (best, post30, pct) => [
      [`91`, `<b>Goals in 2012</b>, the most any footballer has scored in a single calendar year — ${best.goals} in all competitions.`],
      [`8`, `<b>Ballons d'Or</b> (2009–12, 2015, 2019, 2021, 2023) — more than any other player in history.`],
      [`474`, `<b>La Liga goals</b>, the all-time record for the competition and for any single European top flight.`],
      [`129`, `<b>Champions League goals</b> — 120 for Barcelona and 9 for PSG, the second-most in the competition's history.`],
      [post30, `<b>Goals since turning 30</b> — about ${pct}% of his entire career total, scored from 2017 onward.`],
      [`57`, `<b>Hat-tricks or more</b> for club and country across his senior career (provisional tally).`],
      [`46`, `<b>Team trophies</b> — the most decorated career in football history, crowned by the 2022 World Cup.`]
    ],
    silverCaption: () => `${LIVE.trophies} senior team titles, club by club, plus the headline individual honours.`,
    silverThTrophy: "Trophy",
    silverThTimes: "Times",
    silverThNote: "Note",
    silverRows: [
      ["Team trophies — Barcelona", "35", "2005 to 2021, incl. 4 Champions Leagues"],
      ["Team trophies — Argentina", "5", "World Cup 2022, Copas América 2021 & 2024, Finalissima 2022, Olympic gold 2008"],
      ["Team trophies — PSG", "3", "Ligue 1 2022 & 2023, Trophée des Champions 2022"],
      ["Team trophies — Inter Miami", "4", "Leagues Cup 2023, Supporters' Shield 2024, MLS Cup 2025, Campeones Cup 2026"],
      ["Ballon d'Or", "8", "Record — 2009–12, 2015, 2019, 2021, 2023"]
    ],
    splitFk: "Free-kick goals",
    splitFkNote: "Curled in for club and country (provisional tally).",
    splitPen: "Penalty goals",
    splitPenNote: "Around one in eight of all his goals (provisional tally).",
    splitHt: "Hat-tricks or more",
    splitHtNote: "Three-plus-goal games, all competitions.",
    splitCaveat: (tot) => `Free-kick and penalty splits are a widely published compiled tally — provisional until a full match-by-match hand count is finished. The ${tot} total is unaffected.`,
    faq: (t, agg, m, d, lang) => [
      ["How many total career goals has Lionel Messi scored?", `<b>${n(t.goals)} official career goals</b> in ${n(t.apps)} senior appearances for club and country as of ${esc(d.lastUpdated)}, a rate of ${t.goalsPerGame} goals per game. Explore his full <a href="/${lang}/goalsbyyear">year-by-year scoring breakdown</a>.`],
      ["How many career assists does Lionel Messi have?", `Lionel Messi has recorded <b>407 official career assists</b> under Opta/FIFA standards (and <b>449 assists</b> under Transfermarkt's broader criteria) in ${n(t.apps)} appearances, making him the all-time assist leader in modern football history. His official breakdown includes ${LIVE.abtBarca} assists for FC Barcelona, ${LIVE.abtArg} for Argentina, ${LIVE.abtMiami} for Inter Miami CF, and ${LIVE.abtPsg} for Paris Saint-Germain.`],
      ["What are Lionel Messi's total goals and assists?", `Across his senior career, Lionel Messi has accumulated <b>${n(LIVE.ga)} official goal contributions</b> (<b>${n(t.goals)} goals</b> and <b>${n(LIVE.assists)} official assists</b>) in ${n(t.apps)} appearances — an extraordinary rate of <b>1.14 direct goal involvements per match</b>. Under Transfermarkt's criteria, his total stands at <b>${n(LIVE.tmGa)} goal involvements</b> (${n(t.goals)} goals + ${n(LIVE.tmAssists)} assists).`],
      ["Who has better all-time stats, Messi or Ronaldo?", `Across official senior matches, Cristiano Ronaldo holds the all-time goalscoring record with 980 goals and 261 assists in 1,339 matches (0.73 goals/game), while Messi has <b>${n(t.goals)} goals and 407 official assists in ${n(t.apps)} matches</b> (0.79 goals/game, 1.14 G+A/game). Messi reached ${n(t.goals)} goals in ${n(LIVE.fewer)} fewer matches, holds ${LIVE.trophies} team trophies to ${LIVE.rTrophies}, and 8 Ballons d'Or to 5. Compare their complete head-to-head records on our <a href="/${lang}/messi-vs-ronaldo">Messi vs Messi stats page</a>.`],
      ["What is Messi's career goal breakdown by team?", `<b>${n(agg.barcelona.goals)} goals</b> in ${n(agg.barcelona.apps)} games for FC Barcelona, <b>${agg.psg.goals} goals</b> in ${n(agg.psg?.apps || 75)} games for PSG, <b>${n(agg.miami.goals)} goals</b> in ${n(agg.miami?.apps || 118)} games for Inter Miami, and <b>${n(t.country.goals)} goals</b> in ${n(t.country.apps)} caps for Argentina. See <a href="/${lang}/goalsbyseason">season-by-season club stats</a>.`],
      ["How many direct free kick goals has Messi scored?", `Lionel Messi has scored <b>${m?.freeKicks || 76} direct free-kick goals</b> in senior football (50 for Barcelona, 12 for Argentina, 12 for Inter Miami, and 2 for PSG), ranking 2nd all-time behind Marcelinho Carioca's record of 78.`],
      ["How many hat-tricks has Lionel Messi scored?", `Messi has scored <b>${d.hatTricks || 62} career hat-tricks</b> (48 for Barcelona, 11 for Argentina, 3 for Inter Miami). 42 came in league and Champions League play, including 6 matches where he scored 4 or 5 goals.`],
      ["How many penalty goals has Messi scored?", `Messi has scored <b>${m?.penalties || 110} penalty goals</b> from 141 attempts across club and country (a 78% conversion rate).`],
      ["How many non-penalty goals has Lionel Messi scored?", `Messi has scored <b>${n(t.goals - (m?.penalties || 111))} non-penalty goals</b> in ${n(t.apps)} appearances (${((t.goals - (m?.penalties || 111)) / t.apps).toFixed(2)} non-penalty goals per game) — the highest ratio in modern football history.`],
      ["How many goals did Messi score in 2012?", `<b>91 official goals in 2012</b> (79 for Barcelona, 12 for Argentina in 69 games) — certified by Guinness World Records as the all-time world record for most goals in a calendar year. Check our <a href="/${lang}/goalsbyyear">2012 stats tracker</a>.`],
      ["How many trophies has Lionel Messi won?", `<b>47 senior team titles</b> — the most decorated player in football history: 35 with Barcelona, 5 with Argentina (2022 World Cup, 2 Copas América, Finalissima, Olympics), 3 with PSG, and 4 with Inter Miami, plus 8 Ballons d'Or. See <a href="/${lang}/achievements">the full trophy list</a>.`],
      ["How many Ballons d'Or has Lionel Messi won?", `Lionel Messi has won <b>8 Ballons d'Or</b> (2009, 2010, 2011, 2012, 2015, 2019, 2021, 2023) — an all-time record in football history.`],
      ["What is Messi's record in El Clásico vs Real Madrid?", `Messi is the all-time top scorer in El Clásico history with <b>26 goals and 14 assists</b> in 45 matches against Real Madrid (19 wins, 11 draws, 15 losses). Explore the complete match log on our <a href="/${lang}/vs-real-madrid">Messi vs Real Madrid page</a>.`],
      ["What are Messi's UEFA Champions League statistics?", `Messi has scored <b>129 goals</b> in 163 Champions League games (120 for Barcelona, 9 for PSG) and won 4 UCL titles (2006, 2009, 2011, 2015). View full data on our <a href="/${lang}/champions-league">Champions League hub</a>.`],
      ["What are Messi's FIFA World Cup statistics?", `Messi has scored <b>21 goals and 12 assists</b> in 34 World Cup matches across 6 tournaments, winning the 2022 FIFA World Cup in Qatar and becoming the only player to win two FIFA World Cup Golden Balls (2014, 2022).`],
      ["How far is Lionel Messi from 1,000 career goals?", `With ${n(t.goals)} goals, Messi needs <b>${Math.max(0, 1000 - t.goals)} more goals</b> to reach 1,000 career goals. At his scoring pace (${t.goalsPerGame} goals/game), he is projected to reach the milestone around 2027–2028.`]
    ]
  };

export const BY_YEAR = {
    head: (ys, best, t) => `From his first senior goal in ${ys[0].year} to <b>${best.goals} in ${best.year}</b> — every calendar year of a ${n(t.goals)}-goal career, with running totals and his age.`,
    cap: (best, t) => `Bars: goals that year (peak ${best.goals}, ${best.year}). Line: climb to ${n(t.goals)}.`,
    chartLabel: (best) => `Messi goals per calendar year with cumulative career total, peaking at ${best.goals} in ${best.year}`,
    kpiCareer: "Career goals",
    kpiBest: "Best year",
    kpiBestSub: "A world record for a calendar year.",
    kpiCurrSub: "Season in progress.",
    kpiYears: "Scoring years",
    kpiYearsSub: (ys, last) => `Every year from ${ys[0].year} to ${last.year}.`,
    decades: "Goals in the",
    tableSub: "Newest first. 2026 is starred while the season is still being played. Click a column to sort, or type to filter. Famous seasons get a footnote — hover the year.",
    caption: "Goals, running career total and age for every calendar year since Messi's 2004 debut.",
    thYear: "Year", thGoals: "Goals", thTotal: "Career total", thAge: "Age",
    inProgNote: `* ${last.year} season in progress — refreshes after each appearance.`,
    filterPlaceholder: "Filter years — e.g. 2012",
    bestYearHtml: (best) => `<p><b>${best.year} is the greatest goalscoring year football has seen: ${best.goals} goals</b> — 79 for Barcelona and 12 for Argentina — breaking Gerd Müller's 40-year-old record of 85. It included a run of 33 league games scored in consecutively and a five-goal Champions League night against Bayer Leverkusen.</p><p>The next-best years, 2011 (60) and 2010 (60), show how far ahead of normal — even his own normal — that season was. <a href="/en/dashboard">See how those goals break down by competition</a>.</p>`
  };

export const BY_SEASON = {
    head: (best) => `Every club season from 2004/05 to 2026 — <b>best: ${best.goals} goals in ${best.season}</b> — with league, cup and continental splits, plus Argentina year by year.`,
    clubSub: "Apps / goals in each format. 2026 is the season in progress. Click a column to sort, or type to filter.",
    caption: (len) => `All ${len} club seasons: Barcelona 2004/05–2020/21, PSG 2021/22–2022/23, Inter Miami 2023–2026.`,
    thSeason: "Season", thClub: "Club", thApps: "Apps", thGoals: "Goals", thLeague: "League", thCup: "Cup", thCont: "Continental", thOther: "Other",
    totalLabel: "Club total", bestBadge: "Best club season",
    filterClubPlaceholder: "Filter seasons — e.g. PSG, 2012",
    countrySub: "Competitive qualifiers and tournaments plus friendlies, newest first.",
    countryCaption: "Argentina goals by calendar year, 2005 to 2026.",
    thYear: "Year", thNote: "Note", totalArgLabel: "Argentina total",
    filterCountryPlaceholder: "Filter Argentina years — e.g. 2022",
    bestSeasonHtml: (best) => `<p><b>${best.season} — ${best.goals} goals in ${best.apps} games for Barcelona</b> — is the most prolific club season ever played: 50 in La Liga (a record), 14 in the Champions League, 3 in the Copa del Rey and 6 in the super cups. He scored in every competition he entered.</p><p>It sits at the heart of a four-season stretch (2009/10–2012/13) in which he never dropped below 53 club goals. <a href="/en/goalsbyyear">The same goals counted by calendar year</a>.</p>`
  };

export const DASH = {
  teamNames: { all: "all teams", barcelona: "Barcelona", psg: "PSG", miami: "Inter Miami", argentina: "Argentina" },
  pills: [["all", "All teams"], ["barcelona", "Barcelona"], ["psg", "PSG"], ["miami", "Inter Miami"], ["argentina", "Argentina"]],
  head: (name) => `Every Messi goal sliced four ways — by competition, by season, by finish and by body part — filtered to <b>${esc(name)}</b>. Tap a team to re-cut every chart.`,
  filterNote: (name, goals, apps, T) => `Showing ${name}: ${n(goals)} goals in ${n(apps)} apps` + (T === "barcelona" || T === "psg" ? " (Champions League split: Barcelona 120, PSG 9 — derived from club sources)." : "."),
  kpis: { goals: "Goals", apps: "Appearances", gpg: "Goals per game", forTeam: (name) => `For ${name}.` },
  chartEmpty: "No rows for this team filter.",
  figCap: (T, name) => T === "all" ? "Calendar years, 2004 to 2026." : T === "argentina" ? "Argentina calendar years." : "Club seasons for " + esc(name) + ".",
  finishParts: { "Open play": "Open play", "Penalties": "Penalties", "Free kicks": "Free kicks" },
  finishCenter: "career goals",
  finishCaveat: "Career totals for all teams combined — no per-team split exists. Verified count.",
  finishCaveatFiltered: (d) => `No per-team finish split exists, so this chart only covers all teams combined — see the career totals below. Messi's ${n(d.totals.goals)} goals break down as ${d.byFinish.openPlay} open play, ${d.byFinish.penalties} penalties and ${d.byFinish.freeKicks} free kicks.`,
  bodyParts: { "Left foot": "Left foot", "Right foot": "Right foot", "Head": "Head", "Other": "Other" },
  bodyCenter: "left-foot goals",
  bodyCaveat: "Career totals for all teams combined (provisional until a full hand count finishes).",
  ageName: (r) => `Age ${r.age} · ${r.year}`,
  ageCaveat: (apeak) => `Every senior goal by the age he scored it — club and country combined. Peak: ${apeak.goals} at age ${apeak.age} (${apeak.year}).`,
  ageFilterNote: "Ages mix club and country goals, so this chart covers the full career only — clear the team filter to see it.",
  compCaption: (name) => `Goals by competition — ${esc(name)}.`,
  thComp: "Competition", thGoals: "Goals", thShare: "Share",
  recAllTime: "All-time competition record",
  finishCaption: "How the goals were scored and with what — career totals, all teams.",
  thFinish: "Finish",
  finishCaveatTable: "Finish and body-part splits are a provisional compiled tally.",
  finishRows: (d) => [
    ["Open play", d.byFinish.openPlay],
    ["Penalties", d.byFinish.penalties],
    ["Free kicks", d.byFinish.freeKicks],
    ["Left foot", d.byBodyPart.left],
    ["Right foot", d.byBodyPart.right],
    ["Head", d.byBodyPart.head],
    ["Other (chest etc.)", d.byBodyPart.other]
  ],
  teamCardSub: { goals: "goals", apps: "apps", gpg: "per game", of: "of" },
  records: (comp, d) => [
    ["91", `<b>Goals in 2012</b> — the most any footballer has scored in a calendar year.`],
    [n(comp("La Liga")), `<b>La Liga goals</b>, the competition's all-time record, all for Barcelona.`],
    [n(comp("UEFA Champions League")), `<b>Champions League goals</b> — 120 for Barcelona, 9 for PSG.`],
    ["8", `<b>Ballons d'Or</b>, more than any player in history (2009–12, 2015, 2019, 2021, 2023).`],
    [n(d.hatTricks), `<b>Hat-tricks or more</b> for club and country (provisional tally).`],
    [`${LIVE.trophies}`, `<b>Team trophies</b> — the most decorated career football has seen.`]
  ],
  method: "Champions League goals split Barcelona 120 / PSG 9 from club sources; other team-filtered competition splits follow the club-season competition mapping and are documented in the data file."
};

export const TIMELINE = {
  head: (t) => `From his Barcelona debut in 2004 to <b>${n(t.goals)} career goals</b> and counting — the defining nights, records and trophies, dated and in order.`,
  keydates: (t, lastUpdated) => [
    ["16 Oct 2004", "Senior debut for <b>Barcelona</b> against Espanyol, aged 17."],
    ["1 May 2005", "First senior goal, against Albacete — Barcelona's youngest scorer at the time."],
    ["17 Aug 2005", "<b>Argentina</b> debut against Hungary."],
    ["2012", "<b>91 goals</b> in the calendar year — football's all-time record."],
    ["18 Dec 2022", "Wins the <b>World Cup</b> with Argentina in Qatar, scoring twice in the final."],
    [esc(lastUpdated), `<b>${n(t.goals)} career goals</b> for club and country — last checked this date.`]
  ],
  inProg: "in progress",
  goals: "goals",
  goalsInEra: (goals, share, total) => `<b>${n(goals)} goals</b> · ${share}% of ${n(total)}`,
  peakYear: (pk, tr) => `<p class="ch-callout">Peak year <b>${pk.year} · ${pk.goals} goals</b>` + (tr ? ` · <b>${tr}</b> team ${tr === 1 ? "trophy" : "trophies"} won in this span` : "") + `</p>`,
  empty: (val, total) => `Nothing matches “${val}” — clear the search to see all ${total} milestones.`,
  tagRecord: "Record", tagWc: "World Cup", tagFirst: "First",
  faq: [
    ["When did Messi make his debut?", "For Barcelona on <b>16 October 2004</b> against Espanyol, aged 17 years and 114 days; for Argentina on 17 August 2005."],
    ["When did Messi score his first goal?", "On <b>1 May 2005</b> against Albacete — then the youngest scorer in Barcelona's history."],
    ["When did Messi win the World Cup?", "On <b>18 December 2022</b>, beating France on penalties in the Lusail final after a 3–3 draw."],
    ["When did Messi leave Barcelona?", "In <b>August 2021</b>, joining Paris Saint-Germain after 21 years at the club."],
    ["When did Messi join Inter Miami?", "In <b>July 2023</b>, winning the Leagues Cup within weeks of arriving."]
  ],
  method: "Timeline entries are year- and date-granular milestones; era goal bars split calendar years into non-overlapping spans so they add back up to the career total."
};

export const ACH = {
  head: (teamTotal) => `<b>${teamTotal} team trophies</b> — the most decorated career football has seen — plus a record <b>8 Ballons d'Or</b>. Every title, club by club, with the years won.`,
  kpis: (per) => [
    ["Team trophies", 46, `Barcelona ${per["Barcelona"] || 0} · Argentina ${per["Argentina"] || 0} · PSG ${per["Paris Saint-Germain"] || 0} · Miami ${per["Inter Miami"] || 0}.`],
    ["Ballons d'Or", "8", "Record — 2009–12, 2015, 2019, 2021, 2023."],
    ["Champions Leagues", "4", "2006, 2009, 2011, 2015 — all with Barcelona."],
    ["Major internationals", "3", "World Cup 2022, Copas América 2021 & 2024."]
  ],
  qa: (teamTotal, per) => [
    ["How many trophies has Messi won?", `<b>${teamTotal} senior team titles</b>: ${per["Barcelona"] || 0} Barcelona, ${per["Paris Saint-Germain"] || 0} PSG, ${per["Inter Miami"] || 0} Inter Miami and ${per["Argentina"] || 0} Argentina.`],
    ["How many Ballons d'Or has Messi won?", "<b>Eight</b> — more than any player ever (2009–12, 2015, 2019, 2021, 2023)."],
    ["Has Messi won the World Cup?", "<b>Yes — 2022</b>, scoring twice in the final against France, plus Copas América 2021 and 2024."],
    ["How many Champions Leagues has Messi won?", "<b>Four</b>, all with Barcelona: 2006, 2009, 2011 and 2015."]
  ],
  teamHeader: (team, sub) => `${esc(team)} — ${sub} trophies`,
  indHeader: (indTotal) => `Individual honours — ${indTotal} awards`,
  faq: [
    ["What is Messi's most important trophy?", "The <b>2022 World Cup</b> — the title his whole career had pointed at, won as player of the tournament."],
    ["How many league titles has Messi won?", "<b>Twelve</b> — 10 La Ligas, 2 Ligue 1s — plus an MLS Cup (2025) and a Leagues Cup (2023) with Miami."],
    ["How many individual awards has Messi won?", "Eight Ballons d'Or, six European Golden Shoes and two World Cup Golden Balls — each a record."],
    ["Is Messi the most decorated player ever?", "By team titles plus individual records combined — <b>yes, by any reasonable count</b>."]
  ]
};

export const BDAY = {
    months: ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    badgeSuccess: "🎉 Yes! Messi Scored On Your Birthday!",
    badgeMessi: "🎂 Leo Messi's Own Birthday!",
    badgeEmpty: "No Goals on this Date",
    headlineSuccess: (g, m, d) => `Lionel Messi scored <b>${g} ${g === 1 ? "goal" : "goals"}</b> in <b>${m} ${m === 1 ? "match" : "matches"}</b> on ${d} throughout his senior career!`,
    headlineMessi: `You share a birthday with <b>Lionel Andrés Messi</b> (born 24 June 1987 in Rosario)!`,
    headlineEmpty: (d) => `Lionel Messi has not scored on <b>${d}</b> during his senior career.`,
    whyZeroTitle: "Why 0 goals?",
    whyZeroMessi: "Lionel Messi has never played a competitive senior match on 24 June because late June falls during the European club summer off-season or scheduled rest intervals between international tournament rounds.",
    whyZeroMessiSub: "You share your special day with the greatest footballer in history!",
    emptyExpl: "Messi did not have a match scheduled or did not score on this specific calendar day — but he has scored on <b>292 of 366 days (79.8%)</b> of the year!",
    closestDay: (d, g) => `The closest calendar day Messi scored on is <b>${d}</b> (${g} career goals).`,
    closestBtn: (d, g) => `Check ${d} (${g} goals) &rarr;`,
    watchClip: (cnt) => `Watch ${cnt > 1 ? cnt + " Goal Clips" : "Goal Clip"}`,
    searchYt: "🔍 Search Highlights",
    playInline: "📺 Play Inline",
    closeInline: "✕ Close Video",
    ytHighlights: "YouTube Highlights",
    goalSummary: (g) => `${g} ${g === 1 ? "goal" : "goals"} scored:`,
    goalTab: (idx, min) => `Goal ${idx}${min ? ` (${min}')` : ""}`,
    shareSuccess: (d, g, m) => `Lionel Messi scored ${g} goals in ${m} matches on my birthday (${d})! Check your date:`,
    shareEmpty: (d) => `Did Lionel Messi score on your birthday? He scored on 292 of 366 days of the year! Check yours:`,
  };

export const LATEST_GOAL = {
    goalPrefix: "Goal #",
    scoreline: "Score",
    didScoreTodayYes: "YES! Lionel Messi scored today: Goal #{goalNum} in the {minute} against {opp} ({score})!",
    didScoreTodayNo: "Did Messi score today? Lionel Messi's most recent official fixture took place on {date} in {comp}, where he scored Goal #{goalNum} of his career in the {minute} to seal a {score} victory. Stream the official goal video directly below.",
    matchResult: "Latest Match Result: {title}",
    goalBadge: "Goal #{goalNum} Scored ({minute})",
    playHighlight: "Select any of Lionel Messi's latest goals below to instantly load and watch the video highlight in the player above:",
    viewDateGoals: "View {formattedDate} Goals →",
    tagHeader: "Header 🔥",
    tagFreekick: "Direct Free Kick 🔥",
    tagPenalty: "Penalty",
    tagLeftFoot: "Left Foot Strike",
    tagRightFoot: "Right Foot",
    tagOpenPlay: "Open play",
    assist: "Assist"
  };

export const ARG_STREAM = {
    badge: "🇦🇷 FINAL ARGENTINA MATCH",
    title: "Lionel Messi's Farewell Match",
    text: "Lionel Messi's farewell game on 6 October 2026! Watch the LIVE stream free with NO ADS.",
    highlight: "Free live stream • No ads",
    cta: "Watch Free Stream ▶",
    closeAria: "Close notification",
    matchCardTitle: "Historic Farewell Match • 6 Oct 2026",
    matchCardDesc: "Watch Lionel Messi's final international match with Argentina live on Koora Live with zero ads."
  };

export const EXPLORE_LANGS = [
  { href: "/en/birthday", page: "birthday", t: "🎂 Did Messi score on your birthday?", d: (d) => `Search all 366 calendar days with video clips across Messi's ${n(d.totals.goals)} senior career goals.` },
  { href: "/en/messi-vs-ronaldo", page: "messi-vs-ronaldo", t: "🐐 Messi vs Messi All-Time", d: () => `Head-to-head career stats: ${n(LIVE.goals)} vs ${n(LIVE.rGoals)} goals, ${LIVE.trophies} vs ${LIVE.rTrophies} trophies, 8 vs 5 Ballons d'Or.` },
  { href: "/en/vs-real-madrid", page: "vs-real-madrid", t: "⚔️ Messi vs Real Madrid", d: () => "All 26 El Clásico goals, 45 matches, 14 assists, hat-tricks, and video clips." },
  { href: "/en/champions-league", page: "champions-league", t: "⭐ Champions League Record", d: () => "129 UEFA Champions League goals, 8 hat-tricks, and 4 European titles." },
  { href: "/en/latest-goal", page: "latest-goal", t: "⚽ Latest Messi Goal Video", d: () => "Watch Messi's latest goal video, see if he scored today, and view recent goal clips." },
  { href: "/en", page: "home", t: "Messi career stats", d: (d) => `The headline numbers: ${n(d.totals.goals)} goals in ${n(d.totals.apps)} senior games.` },
  { href: "/en/dashboard", page: "dashboard", t: "Messi stats dashboard", d: () => "Filter every chart by Barcelona, PSG, Inter Miami or Argentina." },
  { href: "/en/timeline", page: "timeline", t: "Messi through the years", d: () => "Every career milestone, dated and in order, from 2004 to today." },
];

export const ERA_INTROS = {
  "The boy from Rosario":
    `A 17-year-old from Rosario walks on against Espanyol in October 2004, all knees and elbows, and within months the Camp Nou is chanting a name it can barely pronounce yet. The first goal comes against Albacete the following May — a clipped little finish over the keeper from a Ronaldinho lob — and suddenly Barcelona's youngest scorer belongs in the first team. By 2008 there is an Olympic gold around his neck and nobody left arguing.`,
  "The greatest peak football has seen":
    `Six trophies in 2009. Four Ballons d'Or in a row. Then 2012: 91 goals in a single calendar year, a number so absurd it broke a record that had stood for forty years — including five in one Champions League night against Leverkusen. Nobody before or since has played football at this level; the only debate left is which month of it was the best.`,
  "MSN and the second treble":
    `Messi, Suárez, Neymar — three forwards who should never have fit together, scoring for fun and sweeping a second treble in 2015, sealed in Berlin. His Copa del Rey final goal that spring, slaloming past half of Athletic Bilbao, might be the greatest he ever scored. Pick your own; there are a dozen candidates.`,
  "Carrying Barcelona":
    `Xavi gone, Iniesta fading, the squad thinning every summer — and one man dragging the whole club forward anyway. The Remontada against PSG in 2017, the iconic shirt celebration at the Bernabéu, another league-and-cup double in 2018: these were his teams in a way the great sides before them never quite were. Watch the photo above — by now every defender in Spain knows exactly what is coming, and none of them can stop it.`,
  "Farewell to Barcelona":
    `The burofax summer of 2020, a sixth Ballon d'Or, one last Copa del Rey lifted in 2021 — and then, that August, a tearful press conference and a free transfer nobody believed possible. He left as the club's everything: its record scorer, its record appearance-maker, and the reason a generation of kids supports Barcelona at all.`,
  "Paris and the World Cup":
    `Two strange, brilliant years in Paris — a seventh Ballon d'Or, two league titles — but everything was building toward one winter in Qatar. Seven goals, a Golden Ball, and on 18 December 2022, two goals in the final and the trophy lift at Lusail that ended every argument. The career was complete; everything after is a bonus.`,
  "Miami and the road to 1,000":
    `Nobody expected the pink shirt. Then came a trophy in his first month, an eighth Ballon d'Or, another Copa América with Argentina, and a club transformed around him. Now every goal bends the arc toward 1,000 — a number no one has ever reached in official senior football. Stick around; you are watching the last chapter live.`,
};

export const CABINET = [
    { title: "FIFA World Cup — 2022", sub: "The ultimate crowning glory, Lusail 18 Dec 2022.", src: "/img/cab-wc.webp", w: 800, h: 600, pos: "50% 30%", alt: "Messi lifted on Agüero's shoulders celebrating the 2022 World Cup win at Lusail", cap: "World Cup champions, Lusail 2022" },
    { title: "Ballon d'Or — 8", sub: "The record eight: 2009–12, 2015, 2019, 2021, 2023.", src: "/img/cab-ballon.webp", w: 800, h: 600, pos: "50% 30%", alt: "Messi holding his record eighth Ballon d'Or trophy aloft", cap: "Record eighth Ballon d'Or award" },
    { title: "Champions League — 4", sub: "2006, 2009, 2011, 2015 — all with Barcelona.", src: "/img/cab-ucl.webp", w: 800, h: 600, pos: "50% 25%", alt: "Messi celebrating with the Champions League trophy holding four fingers up", cap: "Four-time European champion with Barcelona" },
    { title: "Copa América — 2", sub: "Back-to-back continental champion, 2021 & 2024.", src: "/img/cab-copa.webp", w: 800, h: 600, pos: "50% 25%", alt: "Messi kissing the Copa América trophy after winning at the Maracanã", cap: "Copa América champions, Maracanã 2021" },
    { title: "La Liga Titles — 10", sub: "Domestic dominance with FC Barcelona 2004–2019.", src: "/img/cab-liga.webp", w: 800, h: 600, pos: "50% 25%", alt: "Messi with the La Liga championship trophy", cap: "10-time Spanish champion with Barcelona" }
  ];
