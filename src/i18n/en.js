// EN dictionary — RonaldoStats
// Extracted verbatim from the original inline dictionaries by
// scripts/refactor-i18n.mjs. Structure is identical across all 9 languages.
// Copy rewritten for Cristiano Ronaldo (RonaldoStats, https://www.ronaldostats.site).
// Numbers follow the verified dataset in public/data/ronaldo-data.json and the
// canonical Ronaldo fact list; provisional splits keep their caveat wording.

export const HOME = {
    locale: "en-GB",
    shirt10: "Shirt number 7",
    head: (t, p, d) => `<b>${n(t.goals)} goals</b> in <b>${n(t.apps)} senior appearances</b> — for Sporting CP, Manchester United, Real Madrid, Juventus and ${esc(p.current.join(" and "))}. A European champion and a five-time Ballon d'Or winner, counted by hand and checked twice, as of ${esc(d.lastUpdated)}.`,
    meta: (p, dob) => `${esc(p.name)}, born ${dob} in ${esc(p.birthplace)}. He is ${p.age}, plays as a ${esc(p.position.toLowerCase())} and is currently at ${esc(p.current.join(" and "))}.`,
    roleLabel: "Role",
    teamsLabel: "Teams",
    nowLabel: "Now",
    kpiCareer: "Career goals",
    kpiCareerNote: (gpg, seasons) => `${gpg} goals per game across ${seasons} club seasons.`,
    kpiApps: "Senior appearances",
    kpiAppsNote: (clubs, country) => `${clubs} club, ${country} Portugal.`,
    kpiArg: "Portugal goals",
    kpiArgNote: (gpg, caps) => `${gpg} per cap across ${caps} caps.`,
    kpiTrophies: "Team trophies",
    kpiTrophiesNote: (lang) => `Plus <b>5 Ballons d'Or</b> and <b>4 European Golden Shoes</b>. <a href="/${lang}/achievements">Full honours list</a>.`,
    kpiRoad: "Road to 1,000 goals",
    kpiRoadNote: (togo, projYear, pace) => `${togo} to go. Rough projection at current pace (~${pace.toFixed(0)} a year): 1,000 lands around ${projYear}.`,
    copyStatsBtn: "Copy headline stats",
    copyText: (goals, apps, clubGoals, argGoals, updated) => `Ronaldo: ${goals} goals in ${apps} senior apps (${clubGoals} club, ${argGoals} Portugal), ${LIVE.trophies} senior team trophies, 5 Ballons d'Or — as of ${updated}.`,
    copyMsg: "Copied — paste it anywhere.",
    clubCaption: (updated, lang) => `Appearances and goals for every senior team Cristiano Ronaldo has played for, as of ${updated}. Full competition splits are on the <a href="/${lang}/goalsbyseason">goals by season page</a>.`,
    thTeam: "Team and years",
    thApps: "Apps",
    thGoals: "Goals",
    thGpg: "Goals per game",
    thTotal: "Career total",
    yearSub: "Pick a year and watch the running total climb — all the way from his 2002 debut to today.",
    yearTitle: "Ronaldo stats by calendar year",
    yearLabel: "Year",
    yearFigcap: (start, cur, prov, lang) => `Calendar-year goals, ${start} to ${cur}${prov ? " (in progress)" : ""} — peaking at 69 in 2013. <a href="/${lang}/goalsbyyear">Open the full table</a>.`,
    tileGoals: (year, prov) => `Goals in ${year}${prov ? " (so far)" : ""}`,
    tileTotal: (year) => `Career total after ${year}`,
    tileAge: (year) => `Age during ${year}`,
    records: (best, post30, pct) => [
      [`69`, `<b>Goals in 2013</b>, the most he has scored in a single calendar year — ${best.goals} in all competitions.`],
      [`5`, `<b>Ballons d'Or</b> (2008, 2013, 2014, 2016, 2017) — with four European Golden Shoes.`],
      [`311`, `<b>La Liga goals</b> for Real Madrid, the competition's all-time record.`],
      [`140`, `<b>Champions League goals</b> in 183 appearances, the record in the competition's history.`],
      [post30, `<b>Goals since turning 30</b> — about ${pct}% of his entire career total, scored from 2015 onward.`],
      [`66`, `<b>Hat-tricks or more</b> for club and country across his senior career (provisional tally).`],
      [`${LIVE.trophies}`, `<b>Team trophies</b> — 32 with clubs and 3 with Portugal.`]
    ],
    silverCaption: () => `${LIVE.trophies} senior team titles, club by club, plus the headline individual honours. Some outlets quote 36–37 because they count the UEFA Super Cup and the domestic supercups differently — the itemised list here adds up to ${LIVE.trophies}.`,
    silverThTrophy: "Trophy",
    silverThTimes: "Times",
    silverThNote: "Note",
    silverRows: [
      ["Team trophies — Real Madrid", "15", "2009 to 2018, incl. 4 Champions Leagues"],
      ["Team trophies — Manchester United", "9", "2003 to 2009, incl. Champions League and Club World Cup 2008"],
      ["Team trophies — Juventus", "5", "Serie A twice, Coppa Italia and 2 Supercoppa Italiana"],
      ["Team trophies — Portugal", "3", "Euro 2016, Nations League 2019 & 2025"],
      ["Team trophies — Al Nassr", "2", "Arab Club Champions Cup 2023, Saudi Pro League 2026"],
      ["Team trophies — Sporting CP", "1", "Supertaça Cândido de Oliveira 2002"],
      ["Ballon d'Or", "5", "2008, 2013, 2014, 2016, 2017"]
    ],
    splitFk: "Free-kick goals",
    splitFkNote: "Curled in for club and country (provisional compiled tally).",
    splitPen: "Penalty goals",
    splitPenNote: "Just under one in five of all his goals (provisional compiled tally).",
    splitHt: "Hat-tricks or more",
    splitHtNote: "Three-plus-goal games, all competitions.",
    splitCaveat: (tot) => `Free-kick, penalty and body-part splits are a widely published compiled tally — provisional until a full match-by-match hand count is finished. The ${tot} total is unaffected.`,
    faq: (t, agg, m, d, lang) => [
      ["How many total career goals has Cristiano Ronaldo scored?", `<b>${n(t.goals)} official career goals</b> in ${n(t.apps)} senior appearances for club and country as of ${esc(d.lastUpdated)}, a rate of ${t.goalsPerGame} goals per game. Explore his full <a href="/${lang}/goalsbyyear">year-by-year scoring breakdown</a>.`],
      ["How many career assists does Cristiano Ronaldo have?", `Cristiano Ronaldo has recorded <b>${n(LIVE.assists)} official career assists</b> — the widely published compiled tally — and <b>${n(LIVE.tmAssists)} assists</b> under Transfermarkt's broader criteria, in ${n(t.apps)} appearances. His breakdown: ${n(d.totals?.assists?.byTeam?.real_madrid?.official || 152)} for Real Madrid, ${n(d.totals?.assists?.byTeam?.manchester_united?.official || 66)} for Manchester United, ${n(d.totals?.assists?.byTeam?.juventus?.official || 20)} for Juventus, ${n(d.totals?.assists?.byTeam?.al_nassr?.official || 9)} for Al Nassr and ${n(d.totals?.assists?.byTeam?.portugal?.official || 14)} for Portugal.`],
      ["What are Cristiano Ronaldo's total goals and assists?", `Across his senior career, Cristiano Ronaldo has accumulated <b>${n(LIVE.ga)} official goal contributions</b> (<b>${n(t.goals)} goals</b> and <b>${n(LIVE.assists)} official assists</b>) in ${n(t.apps)} appearances — a rate of <b>0.93 direct goal involvements per match</b>. Under Transfermarkt's criteria, the total stands at <b>${n(LIVE.tmGa)} goal involvements</b> (${n(t.goals)} goals + ${n(LIVE.tmAssists)} assists).`],
      ["Who has better all-time stats, Ronaldo or Messi?", `Across official senior matches, <b>Cristiano Ronaldo</b> holds the all-time goalscoring record with <b>${n(t.goals)} goals</b> and ${n(LIVE.assists)} assists in ${n(t.apps)} matches (${t.goalsPerGame} goals per game), while Messi has <b>${n(LIVE.rGoals)} goals</b> and 408 assists in 1,181 matches (0.79 goals per game). Ronaldo reached ${n(t.goals)} goals in <b>159 fewer matches</b>, holds ${LIVE.trophies} senior team trophies to Messi's ${LIVE.rTrophies}, and 5 Ballons d'Or to Messi's 8. Compare their complete head-to-head records on our <a href="/${lang}/ronaldo-vs-messi">Ronaldo vs Messi stats page</a>.`],
      ["What is Ronaldo's career goal breakdown by club?", `<b>${n(t.clubs.goals)} club goals</b> in ${n(t.clubs.apps)} club games — ` + ["Real Madrid", "Manchester United", "Juventus", "Al Nassr", "Sporting CP"].map((c) => {
        const rows = (d.clubSeasons || []).filter((s) => s.club === c);
        const apps = rows.reduce((a, s) => a + s.apps, 0);
        const goals = rows.reduce((a, s) => a + s.goals, 0);
        return `${c} ${n(goals)} in ${n(apps)}`;
      }).join(" · ") + ` — plus <b>${n(t.country.goals)} goals</b> in ${n(t.country.apps)} caps for Portugal. See <a href="/${lang}/goalsbyseason">season-by-season club stats</a>.`],
      ["How many direct free-kick goals has Ronaldo scored?", `Cristiano Ronaldo has scored <b>66 direct free-kick goals</b> in senior football, alongside <b>184 penalties from 220 attempts</b> and 731 goals from open play — a provisional compiled tally until a full hand count is finished.`],
      ["How many hat-tricks has Ronaldo scored?", `Ronaldo has scored <b>${n(d.hatTricks)} career hat-tricks</b> for club and country (provisional tally), including <b>10 for Portugal</b> — a world record for an international player.`],
      ["How many penalty goals has Ronaldo scored?", `Ronaldo has scored <b>184 penalty goals</b> from 220 attempts across club and country — an 83.6% conversion rate.`],
      ["How many non-penalty goals has Cristiano Ronaldo scored?", `Ronaldo has scored <b>${n(t.goals - (m?.penalties || 184))} non-penalty goals</b> in ${n(t.apps)} appearances (${((t.goals - (m?.penalties || 184)) / t.apps).toFixed(2)} non-penalty goals per game) — 81% of everything he has ever scored.`],
      ["How many goals did Ronaldo score in 2013?", `<b>69 official goals in 2013</b> (59 for Real Madrid and 10 for Portugal) — the biggest calendar year of his career, and a year that brought a hat-trick for Portugal inside 15 minutes against Northern Ireland. Check our <a href="/${lang}/goalsbyyear">2013 stats tracker</a>.`],
      ["How many trophies has Cristiano Ronaldo won?", `<b>${n(LIVE.trophies)} senior team titles</b> — 32 with clubs (Real Madrid 15, Manchester United 9, Juventus 5, Al Nassr 2, Sporting CP 1) and 3 with Portugal (Euro 2016, Nations League 2019 and 2025), plus 5 Ballons d'Or. Some outlets quote 36–37 because they count the UEFA Super Cup and the domestic supercups differently. See <a href="/${lang}/achievements">the full trophy list</a>.`],
      ["How many Ballons d'Or has Cristiano Ronaldo won?", `Cristiano Ronaldo has won <b>5 Ballons d'Or</b> (2008, 2013, 2014, 2016, 2017) — the first in 2008, at 23 years old, when he was named on 77 of 96 ballots.`],
      ["What is Ronaldo's record at Real Madrid?", `Ronaldo's El Clásico record for Real Madrid — and every goal he has scored against Real Madrid in a different shirt — is collected on our <a href="/${lang}/real-madrid">Ronaldo at Real Madrid page</a>.`],
      ["What are Ronaldo's UEFA Champions League statistics?", `Ronaldo has scored <b>140 goals in 183 Champions League appearances</b> — the all-time record in the competition — with <b>42 assists</b>, also the record, and won 5 titles (2008, 2014, 2016, 2017, 2018). View full data on our <a href="/${lang}/champions-league">Champions League hub</a>.`],
      ["What are Ronaldo's FIFA World Cup statistics?", `Ronaldo has played at <b>six FIFA World Cups</b> (2006, 2010, 2014, 2018, 2022 and 2026) and remains the record scorer for Portugal, with <b>146 goals in 234 caps</b> — the all-time international record for both.`],
      ["How far is Cristiano Ronaldo from 1,000 career goals?", `With ${n(t.goals)} goals, Ronaldo needs <b>${Math.max(0, 1000 - t.goals)} more goals</b> to reach 1,000 career goals — a mark no player has reached in official senior football.`]
    ]
  };

export const BY_YEAR = {
    head: (ys, best, t) => `From his first senior goal in ${ys[0].year} to <b>${best.goals} in ${best.year}</b> — every calendar year of a career that produced ${n(t.goals)} goals, with running totals and his age.`,
    cap: (best, t) => `Bars: goals that year (peak ${best.goals}, ${best.year}). Line: climb to ${n(t.goals)}.`,
    chartLabel: (best) => `Ronaldo goals per calendar year with cumulative career total, peaking at ${best.goals} in ${best.year}`,
    kpiCareer: "Career goals",
    kpiBest: "Best year",
    kpiBestSub: "The most he has scored in a calendar year.",
    kpiCurrSub: "Season in progress.",
    kpiYears: "Scoring years",
    kpiYearsSub: (ys, last) => `Every year from ${ys[0].year} to ${last.year}.`,
    decades: "Goals in the",
    tableSub: "Newest first. 2026 is starred while the season is still being played. Click a column to sort, or type to filter. Peak years get a footnote — hover the year.",
    caption: "Goals, running career total and age for every calendar year since Ronaldo's 2002 debut.",
    thYear: "Year", thGoals: "Goals", thTotal: "Career total", thAge: "Age",
    inProgNote: "* 2026 season in progress — refreshes after each appearance.",
    filterPlaceholder: "Filter years — e.g. 2013",
    bestYearHtml: (best) => `<p><b>${best.year} is the most prolific calendar year of Ronaldo's career: ${best.goals} goals</b> — 59 for Real Madrid and 10 for Portugal. It brought the second Ballon d'Or, a 55-goal club season, and three goals for Portugal inside 15 minutes against Northern Ireland.</p><p>The next-best years — 2012 (63), 2014 (61) and 2011 (60) — show how high the standard stayed across five straight seasons from 2010 to 2014. <a href="/en/dashboard">See how those goals break down by competition</a>.</p>`
  };

export const BY_SEASON = {
    head: (best) => `Every club season from 2002/03 to 2026/27 — <b>best: ${best.goals} goals in ${best.season}</b> — with league, cup and continental splits, plus Portugal year by year.`,
    clubSub: "Apps / goals in each format. 2026/27 is the season in progress. Click a column to sort, or type to filter.",
    caption: (len) => `All ${len} club seasons: Sporting CP 2002/03, Manchester United 2003/04–2008/09 and 2021/22–2022/23, Real Madrid 2009/10–2017/18, Juventus 2018/19–2021/22, Al Nassr 2022/23–2026/27.`,
    thSeason: "Season", thClub: "Club", thApps: "Apps", thGoals: "Goals", thLeague: "League", thCup: "Cup", thCont: "Continental", thOther: "Other",
    totalLabel: "Club total", bestBadge: "Best club season",
    filterClubPlaceholder: "Filter seasons — e.g. Real Madrid, 2012",
    countrySub: "Competitive qualifiers and tournaments plus friendlies, newest first.",
    countryCaption: "Portugal goals by calendar year, 2003 to 2026.",
    thYear: "Year", thNote: "Note", totalArgLabel: "Portugal total",
    filterCountryPlaceholder: "Filter Portugal years — e.g. 2016",
    bestSeasonHtml: (best) => `<p><b>${best.season} — ${best.goals} goals in ${best.apps} games for ${best.club}</b> — is the most prolific club season of his career: ${best.league.goals} in the league, ${best.continental.goals} in the Champions League, ${best.cup.goals} in the cup and ${best.other.goals} in the super cups. He scored in every competition he entered.</p><p>It edges out the legendary 2011/12 — 60 goals including 46 in La Liga — inside a run of six Madrid seasons in which he never dropped below 51 club goals. <a href="/en/goalsbyyear">The same goals counted by calendar year</a>.</p>`
  };

export const DASH = {
  teamNames: { all: "all teams", real_madrid: "Real Madrid", manchester_united: "Manchester United", juventus: "Juventus", al_nassr: "Al Nassr", sporting_cp: "Sporting CP", portugal: "Portugal" },
  pills: [["all", "All teams"], ["real_madrid", "Real Madrid"], ["manchester_united", "Manchester United"], ["juventus", "Juventus"], ["al_nassr", "Al Nassr"], ["sporting_cp", "Sporting CP"], ["portugal", "Portugal"]],
  head: (name) => `Every Ronaldo goal sliced four ways — by competition, by season, by finish and by body part — filtered to <b>${esc(name)}</b>. Tap a team to re-cut every chart.`,
  filterNote: (name, goals, apps, T) => `Showing ${name}: ${n(goals)} goals in ${n(apps)} apps` + (T === "real_madrid" ? " (Champions League: 140 goals in 183 appearances with 42 assists — all three are competition records)." : "."),
  kpis: { goals: "Goals", apps: "Appearances", gpg: "Goals per game", forTeam: (name) => `For ${name}.` },
  chartEmpty: "No rows for this team filter.",
  figCap: (T, name) => T === "all" ? "Calendar years, 2002 to 2026." : ["portugal", "portugal_nt", "country"].includes(T) ? "Portugal calendar years." : "Club seasons for " + esc(name) + ".",
  finishParts: { "Open play": "Open play", "Penalties": "Penalties", "Free kicks": "Free kicks" },
  finishCenter: "career goals",
  finishCaveat: "Career totals for all teams combined — no per-team split exists. Provisional compiled tally.",
  finishCaveatFiltered: (d) => `No per-team finish split exists, so this chart only covers all teams combined — see the career totals below. Ronaldo's ${n(d.totals.goals)} goals break down as ${d.byFinish.openPlay} open play, ${d.byFinish.penalties} penalties and ${d.byFinish.freeKicks} free kicks (provisional compiled tally).`,
  bodyParts: { "Left foot": "Left foot", "Right foot": "Right foot", "Head": "Head", "Other": "Other" },
  bodyCenter: "right-foot goals",
  bodyCaveat: "Career totals for all teams combined — a provisional compiled tally, until a full hand count finishes.",
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
    ["69", `<b>Goals in 2013</b> — the most he has scored in a calendar year.`],
    [n(comp("La Liga")), `<b>La Liga goals</b>, the competition's all-time record, all for Real Madrid.`],
    ["140", `<b>Champions League goals</b> — the record in the competition's history.`],
    ["5", `<b>Ballons d'Or</b> (2008, 2013, 2014, 2016, 2017).`],
    [n(d.hatTricks), `<b>Hat-tricks or more</b> for club and country (provisional tally).`],
    [`${LIVE.trophies}`, `<b>Team trophies</b> — 32 with clubs, 3 with Portugal.`]
  ],
  method: "Champions League figures (140 goals in 183 appearances, 42 assists) are competition records taken from the club and UEFA record books; other team-filtered competition splits follow the club-season competition mapping and are documented in the data file."
};

export const TIMELINE = {
  head: (t) => `From his Sporting CP debut in 2002 to <b>${n(t.goals)} career goals</b> and counting — the defining nights, records and trophies, dated and in order.`,
  keydates: (t, lastUpdated) => [
    ["14 Aug 2002", "Senior debut for <b>Sporting CP</b> against Inter in the Champions League third qualifying round, aged 17."],
    ["20 Aug 2003", "<b>Portugal</b> debut against Kazakhstan, weeks after taking the legendary No. 7 shirt at Manchester United."],
    ["2008", "<b>Ballon d'Or</b> at 23, named on 77 of 96 ballots, with the Champions League and the FIFA Club World Cup."],
    ["2013", "<b>69 goals</b> in the calendar year — his best, including a hat-trick for Portugal inside 15 minutes."],
    ["2016", "Lifts the <b>European Championship</b> as Portugal's captain, with three goals and the Silver Boot."],
    [esc(lastUpdated), `<b>${n(t.goals)} career goals</b> for club and country — last checked this date.`]
  ],
  inProg: "in progress",
  goals: "goals",
  goalsInEra: (goals, share, total) => `<b>${n(goals)} goals</b> · ${share}% of ${n(total)}`,
  peakYear: (pk, tr) => `<p class="ch-callout">Peak year <b>${pk.year} · ${pk.goals} goals</b>` + (tr ? ` · <b>${tr}</b> team ${tr === 1 ? "trophy" : "trophies"} won in this span` : "") + `</p>`,
  empty: (val, total) => `Nothing matches “${val}” — clear the search to see all ${total} milestones.`,
  tagRecord: "Record", tagWc: "World Cup", tagFirst: "First",
  faq: [
    ["When did Ronaldo make his senior debut?", "For <b>Sporting CP</b> on <b>14 August 2002</b> against Inter in the Champions League third qualifying round, aged 17; his first senior goals came seven weeks later against Moreirense."],
    ["When did Ronaldo score his first goal?", "His first Portugal goal was a header against <b>Greece at Euro 2004</b>; his first Manchester United goal that same year was a free kick against Portsmouth."],
    ["When did Ronaldo win the Champions League?", "First in <b>2008</b> with Manchester United, then four times in a row with Real Madrid in <b>2014, 2016, 2017 and 2018</b>."],
    ["When did Ronaldo move to Real Madrid?", "In <b>June 2009</b>, for a then world-record fee — with 80,000 in the Bernabéu for the presentation."],
    ["When did Ronaldo join Al Nassr?", "In <b>January 2023</b>, making his debut as captain against Al-Ettifaq and scoring twice in a 2–2 draw."]
  ],
  method: "Timeline entries are year- and date-granular milestones; era goal bars split calendar years into non-overlapping spans so they add back up to the career total."
};

export const ACH = {
  head: (teamTotal) => `<b>${teamTotal} team trophies</b> — 32 with clubs and 3 with Portugal — plus <b>5 Ballons d'Or</b>. Every title, club by club, with the years won.`,
  kpis: (per) => [
    ["Team trophies", 35, `Real Madrid ${per["Real Madrid"] || 0} · Manchester United ${per["Manchester United"] || 0} · Juventus ${per["Juventus"] || 0} · Portugal ${per["Portugal"] || 0}.`],
    ["Ballons d'Or", "5", "2008, 2013, 2014, 2016, 2017."],
    ["European Golden Shoes", "4", "2008, 2011, 2014, 2015."],
    ["UCL top-scorer seasons", "7", "Champions League top scorer in 2008, then every season from 2013 to 2018."]
  ],
  qa: (teamTotal, per) => [
    ["How many trophies has Ronaldo won?", `<b>${teamTotal} senior team titles</b>: ${per["Real Madrid"] || 0} Real Madrid, ${per["Manchester United"] || 0} Manchester United, ${per["Juventus"] || 0} Juventus, ${per["Al Nassr"] || 0} Al Nassr, ${per["Sporting CP"] || 0} Sporting CP and ${per["Portugal"] || 0} Portugal.`],
    ["How many Ballons d'Or has Ronaldo won?", "<b>Five</b> — 2008, 2013, 2014, 2016 and 2017, the first at 23 years old."],
    ["Has Ronaldo won a major international title?", "<b>Yes</b> — UEFA Euro 2016 as captain, and the UEFA Nations League in 2019 and 2025."],
    ["How many Champions Leagues has Ronaldo won?", "<b>Five</b>: 2008 with Manchester United, then 2014, 2016, 2017 and 2018 with Real Madrid."]
  ],
  teamHeader: (team, sub) => `${esc(team)} — ${sub} trophies`,
  indHeader: (indTotal) => `Individual honours — ${indTotal} awards`,
  faq: [
    ["What is Ronaldo's most important trophy?", "The <b>2016 European Championship</b> — the title he captained Portugal to in Paris, as the tournament's second-highest scorer."],
    ["How many league titles has Ronaldo won?", "<b>Eight</b> — 3 Premier League, 2 La Liga, 2 Serie A and 1 Saudi Pro League, as itemised in this archive's honours list."],
    ["How many individual awards has Ronaldo won?", "Five Ballons d'Or, four European Golden Shoes, three UEFA Men's Player of the Year awards, the FIFA World Player of the Year in 2008, the FIFA Puskás Award in 2009, the Euro 2020 Golden Boot and The Best FIFA Men's Player in 2016 and 2017."],
    ["Is Ronaldo the most decorated player ever?", "On team titles alone Messi leads with 46 to Ronaldo's 35. Ronaldo leads the scoring records — 983 goals, 140 of them in the Champions League, and 146 goals in 234 caps for Portugal."]
  ]
};

export const BDAY = {
    months: ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    badgeSuccess: "🎉 Yes! Ronaldo Scored On Your Birthday!",
    badgeMessi: "🎂 CR7's Own Birthday!",
    badgeEmpty: "No Goals on this Date",
    headlineSuccess: (g, m, d) => `Cristiano Ronaldo scored <b>${g} ${g === 1 ? "goal" : "goals"}</b> in <b>${m} ${m === 1 ? "match" : "matches"}</b> on ${d} throughout his senior career!`,
    headlineMessi: `You share a birthday with <b>Cristiano Ronaldo</b> (born 5 February 1985 in Funchal, Madeira)!`,
    headlineEmpty: (d) => `Cristiano Ronaldo has not scored on <b>${d}</b> during his senior career.`,
    whyZeroTitle: "Why 0 goals?",
    whyZeroMessi: "5 February falls in the middle of the European club season, so it is usually an ordinary match day for Ronaldo: the fixture list and the minutes he plays decide whether a goal goes in on the date he was born.",
    whyZeroMessiSub: "You share your special day with Cristiano Ronaldo — CR7, born 5 February 1985.",
    emptyExpl: "Ronaldo did not have a match scheduled, or did not score, on this specific calendar day — but he has scored on most days of the year across club and country.",
    closestDay: (d, g) => `The closest calendar day Ronaldo scored on is <b>${d}</b> (${g} career goals).`,
    closestBtn: (d, g) => `Check ${d} (${g} goals) &rarr;`,
    watchClip: (cnt) => `Watch ${cnt > 1 ? cnt + " Goal Clips" : "Goal Clip"}`,
    searchYt: "🔍 Search Highlights",
    playInline: "📺 Play Inline",
    closeInline: "✕ Close Video",
    ytHighlights: "YouTube Highlights",
    goalSummary: (g) => `${g} ${g === 1 ? "goal" : "goals"} scored:`,
    goalTab: (idx, min) => `Goal ${idx}${min ? ` (${min}')` : ""}`,
    shareSuccess: (d, g, m) => `Cristiano Ronaldo scored ${g} goals in ${m} matches on my birthday (${d})! Check your date:`,
    shareEmpty: (d) => `Did Cristiano Ronaldo score on your birthday? He has scored on most days of the year across club and country. Check yours:`,
  };

export const LATEST_GOAL = {
    goalPrefix: "Goal #",
    scoreline: "Score",
    didScoreTodayYes: "YES! Cristiano Ronaldo scored today: Goal #{goalNum} in the {minute} against {opp} ({score})!",
    didScoreTodayNo: "Did Ronaldo score today? Cristiano Ronaldo's most recent official fixture took place on {date} in {comp}, where he scored Goal #{goalNum} of his career in the {minute} to seal a {score} victory. Stream the official goal video directly below.",
    matchResult: "Latest Match Result: {title}",
    goalBadge: "Goal #{goalNum} Scored ({minute})",
    playHighlight: "Select any of Cristiano Ronaldo's latest goals below to instantly load and watch the video highlight in the player above:",
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
    badge: "🇵🇹 PORTUGAL MATCH NIGHT",
    title: "Cristiano Ronaldo's Portugal",
    text: "Portugal match night — watch the LIVE stream free with NO ADS.",
    highlight: "Free live stream • No ads",
    cta: "Watch Free Stream ▶",
    closeAria: "Close notification",
    matchCardTitle: "Portugal International • Live Match Night",
    matchCardDesc: "Watch Cristiano Ronaldo and Portugal live on Koora Live — free stream, zero ads."
  };

export const EXPLORE_LANGS = [
  { href: "/en/ronaldo-vs-messi", page: "ronaldo-vs-messi", t: "🐐 Ronaldo vs Messi All-Time", d: () => `Head-to-head career stats: ${n(LIVE.goals)} vs ${n(LIVE.rGoals)} goals, ${LIVE.trophies} vs ${LIVE.rTrophies} trophies, 5 vs 8 Ballons d'Or.` },
  { href: "/en/real-madrid", page: "real-madrid", t: "🏟️ Ronaldo at Real Madrid", d: () => "His nine years at Real Madrid: 450 goals, 311 in La Liga, four Champions League titles and 18 in the Clásico." },
  { href: "/en/champions-league", page: "champions-league", t: "⭐ Champions League Record", d: () => "140 UEFA Champions League goals, 42 assists, and 5 European titles." },
  { href: "/en", page: "home", t: "Ronaldo career stats", d: (d) => `The headline numbers: ${n(d.totals.goals)} goals in ${n(d.totals.apps)} senior games.` },
  { href: "/en/dashboard", page: "dashboard", t: "Ronaldo stats dashboard", d: () => "Filter every chart by Real Madrid, Manchester United, Juventus, Al Nassr, Sporting CP or Portugal." },
  { href: "/en/timeline", page: "timeline", t: "Ronaldo through the years", d: () => "Every career milestone, dated and in order, from 2002 to today." },
];

/* Era chapter openers. The renderer looks an intro up by era slug first
   (rosario, peak, msn, carry, farewell, paris, miami) and falls back to the
   era name, so both keys are mapped here to the same Ronaldo copy — no
   change to app.js is needed. */
export const ERA_INTROS = {
  "The boy from Rosario":
    `Cristiano Ronaldo arrived in Lisbon from Funchal on Madeira as a teenager with a reputation for speed and a habit of demanding the ball. His first senior season at Sporting CP produced five goals in 31 appearances, and within twelve months he had been handed Manchester United's legendary No. 7 shirt for £12.24m. He scored in the FA Cup final at 19, won three Premier League titles, the Champions League and the FIFA Club World Cup, and in 2008 was named the world's best player at 23 — on 77 of 96 ballots.`,
  "The greatest peak football has seen":
    `Real Madrid paid a world-record fee in 2009 and were handed the most expensive attacking talent in the history of the sport. He answered with a Copa del Rey final header against Barcelona in his first season, then a La Liga title won with a record 100 points and 46 league goals. By the end of 2012 he had reached 60 goals in a calendar year and 100 goals in La Liga for the club, and Madrid's attacking identity was being rebuilt around him.`,
  "MSN and the second treble":
    `Three seasons in Madrid carried Ronaldo past almost every landmark in the book. He scored 69 goals in 2013, the best calendar year of his career, including three for Portugal inside fifteen minutes against Northern Ireland — one of ten international hat-tricks, a world record. La Décima arrived in 2014, and by the end of 2015 the 500th goal of his career had taken him past every Champions League scorer in history.`,
  "Carrying Barcelona":
    `After the 2016 European Championship won in France, Ronaldo added the Champions League in 2017 — including a hat-trick against Bayern Munich that carried him to 100 goals in the competition — and a fifth Ballon d'Or in the same season. He passed Jimmy Greaves as the leading scorer in Europe's big five leagues, then moved to Juventus at 33 and scored a hat-trick in his first Champions League game there.`,
  "Farewell to Barcelona":
    `The Nations League title and a place in the record books came in 2019, when the 700th goal of his career arrived against Ukraine in October. His 1,000th senior appearance followed against SPAL in February 2020, and in 2021 he passed Ali Daei to become the outright leading scorer in men's international football, with a tenth international hat-trick — a world record.`,
  "Paris and the World Cup":
    `A return to Manchester United in 2021 brought the No. 7 shirt and a new stage for the oldest man in the room, and in 2022 he passed Josef Bican with a hat-trick against Tottenham. The move to Saudi Arabia in January 2023 made him Al Nassr's captain and, with his 197th cap, the most-capped player in men's international football.`,
  "Miami and the road to 1,000":
    `Al Nassr gave him a fresh start and a Saudi Pro League title, but the records kept coming: the 900th career goal in the Nations League in 2024, the 800th club goal and the 100th for Al Nassr in 2025 — making him the first player to score 100 goals for four clubs — and, in 2026, the 500th goal scored after turning 30 and a sixth FIFA World Cup. Every goal now bends the arc toward 1,000.`
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
    { title: "Portugal & the FIFA World Cup", sub: "Six World Cups (2006–2026) and 146 goals in 234 caps for Portugal.", src: "/img/cab-wc.webp", w: 800, h: 600, pos: "50% 30%", alt: "Cristiano Ronaldo in the Portugal number 7 shirt at the 2018 FIFA World Cup", cap: "Portugal's record goalscorer, at six World Cups" },
    { title: "Ballon d'Or — 5", sub: "2008, 2013, 2014, 2016, 2017 — the first at 23 years old.", src: "/img/cab-ballon-2026.webp", w: 800, h: 600, pos: "50% 30%", alt: "Cristiano Ronaldo holding the Ballon d'Or he has won a record five times", cap: "Five Ballons d'Or" },
    { title: "Champions League — 5", sub: "140 goals, the competition record, in 183 appearances.", src: "/img/cab-ucl-2026.webp", w: 800, h: 600, pos: "50% 25%", alt: "The European Cup and UEFA Champions League trophies, won five times by Cristiano Ronaldo", cap: "Five European titles and 140 Champions League goals" },
    { title: "FIFA Club World Cup — 4", sub: "2008, 2014, 2016 and 2017 with Manchester United and Real Madrid.", src: "/img/cab-cwc-2026.webp", w: 800, h: 600, pos: "50% 25%", alt: "The FIFA Club World Cup Golden Ball trophies in the CR7 Museum in Madeira", cap: "Four FIFA Club World Cups" },
    { title: "La Liga — 311 goals", sub: "The competition's all-time record, all of them for Real Madrid.", src: "/img/cab-liga.webp", w: 800, h: 600, pos: "50% 25%", alt: "Cristiano Ronaldo in the Real Madrid number 7 shirt, in a La Liga he won twice", cap: "311 La Liga goals for Real Madrid" }
  ];

export const BDAY_MEDIA = {
    "searchHighlights": "🔍 Search Highlights",
    "openArchive": "Open in the CR7 goal archive",
    "noClip": "No published clip for this goal.",
    "noClipBody": "The match record below comes from the primary match sheets. The links open the goal's page in the archive and a search for the footage.",
    "clipLabel": "Published clip",
    "seasonNote": "Every goal Ronaldo scored in the {season} season.",
    "compilationNote": "This goal appears in an all-goals compilation. Use the archive link to find its exact position.",
    "compilationLabel": "All-goals compilation",
    "publisher": "Published by",
    "assist": "Assist: {name}",
    "finish": "Finish: {type}",
    "goalNumber": "Goal #{n}",
    "watchOn": "Watch on {publisher}",
    "sourceLine": "Goal record: {source} — the archive sources its list from Wikipedia's List of senior career goals by Cristiano Ronaldo (CC BY-SA 4.0, built on FBref's goal log) and StatsBomb open data. Clips are published by their rights holders.",
    "sourceNote": "The dates, competitions, scorelines, minutes, finishes and assists on this page come from cr7allgoals.com, whose per-goal list is Wikipedia's List of senior career goals by Cristiano Ronaldo (CC BY-SA 4.0, built on FBref's goal log), with StatsBomb open data for the reviewed event details. The international list is RSSSF's appearance record — 146 goals in 234 caps for Portugal. Where a minute was never published it is left empty rather than invented."
  };
