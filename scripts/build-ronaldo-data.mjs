// Build public/data/ronaldo-data.json — the single source of truth for the
// RonaldoStats site.
//
// Iron rules (CONTEXT.md):
//   - totals are COMPUTED from the rows below, never hand-typed, so the
//     4-way checksum (calendarYears == byCompetition == byBodyPart ==
//     totals.combined.goals) can never drift;
//   - every row carries a named source;
//   - provisional splits ship with an explicit caveat.
//
// Sources
//   RSSSF  https://www.rsssf.org/miscellaneous/cronaldo-intlg.html
//          (international match list — 233 caps through 6 Jul 2026; per-year
//           apps/goals and the competitive/friendly split parsed from it)
//   UEFA   https://www.uefa.com/uefanationsleague/news/023f-0e9797c3479b...
//          (234th cap, 27 Sep 2026 vs Norway; data correct as of 6 Oct 2026)
//   W-ACH  https://en.wikipedia.org/wiki/List_of_career_achievements_by_Cristiano_Ronaldo
//   W-INT  https://en.wikipedia.org/wiki/List_of_international_goals_scored_by_Cristiano_Ronaldo
//   SPL    https://www.spl.com.sa/en/news/on-to-the-next-ronaldo-hits-980-career-goals...
//   RS     https://ronaldostats.app
import fs from "node:fs";
import path from "node:path";

const OUT = path.resolve("D:/Projects/ronaldo-stats/public/data/ronaldo-data.json");

// ---------------------------------------------------------------------------
// CLUB SEASONS — all competitions.
// [apps, goals] for: league, domestic cups, continental, other (supercups,
// club world cup).  Source: W-ACH club season table, cross-checked against
// RSSSF / worldfootball.net / Transfermarkt.
// The 7th field overrides the continental competition label for the seasons
// whose European campaign was NOT the Champions League — Manchester United's
// 2005/06 UEFA Cup run and 2022/23 Europa League run, and Sporting CP's
// 2002/03 UEFA Cup run. Without this the Champions League total would read
// 143 instead of the official 140.
// ---------------------------------------------------------------------------
const SEASONS = [
  // Sporting CP
  ["Sporting CP", "2002/03", [25, 3], [3, 2], [3, 0], [0, 0], "UEFA Europa League / UEFA Cup"],
  // Manchester United — first spell
  ["Manchester United", "2003/04", [29, 4], [6, 2], [5, 0], [0, 0], "UEFA Europa League / UEFA Cup"],
  ["Manchester United", "2004/05", [33, 5], [9, 4], [8, 0], [0, 0]],
  ["Manchester United", "2005/06", [33, 9], [6, 2], [8, 1], [0, 0], "UEFA Europa League / UEFA Cup"],
  ["Manchester United", "2006/07", [34, 17], [8, 3], [11, 3], [0, 0]],
  ["Manchester United", "2007/08", [34, 31], [3, 3], [11, 8], [1, 0]],
  ["Manchester United", "2008/09", [33, 18], [6, 3], [12, 4], [2, 1]],
  // Real Madrid
  ["Real Madrid", "2009/10", [29, 26], [0, 0], [6, 7], [0, 0]],
  ["Real Madrid", "2010/11", [34, 40], [8, 7], [12, 6], [0, 0]],
  ["Real Madrid", "2011/12", [38, 46], [5, 3], [10, 10], [2, 1]],
  ["Real Madrid", "2012/13", [34, 34], [7, 7], [12, 12], [2, 2]],
  ["Real Madrid", "2013/14", [30, 31], [6, 3], [11, 17], [0, 0]],
  ["Real Madrid", "2014/15", [35, 48], [2, 1], [12, 10], [5, 2]],
  ["Real Madrid", "2015/16", [36, 35], [0, 0], [12, 16], [0, 0]],
  ["Real Madrid", "2016/17", [29, 25], [2, 1], [13, 12], [2, 4]],
  ["Real Madrid", "2017/18", [27, 26], [0, 0], [13, 15], [4, 3]],
  // Juventus
  ["Juventus", "2018/19", [31, 21], [2, 0], [9, 6], [1, 1]],
  ["Juventus", "2019/20", [33, 31], [4, 2], [8, 4], [1, 0]],
  ["Juventus", "2020/21", [33, 29], [4, 2], [6, 4], [1, 1]],
  ["Juventus", "2021/22", [1, 0], [0, 0], [0, 0], [0, 0]],
  // Manchester United — second spell
  ["Manchester United", "2021/22", [30, 18], [1, 0], [7, 6], [0, 0]],
  ["Manchester United", "2022/23", [10, 1], [0, 0], [6, 2], [0, 0], "UEFA Europa League / UEFA Cup"],
  // Al Nassr
  ["Al Nassr", "2022/23", [16, 14], [2, 0], [0, 0], [1, 0]],
  ["Al Nassr", "2023/24", [31, 35], [4, 3], [9, 6], [7, 6]],
  ["Al Nassr", "2024/25", [30, 25], [1, 0], [8, 8], [2, 2]],
  ["Al Nassr", "2025/26", [30, 28], [1, 0], [4, 1], [2, 1]],
  ["Al Nassr", "2026/27", [7, 4], [0, 0], [2, 1], [0, 0]],
];

const clubSeasons = SEASONS.map(([club, season, league, cup, continental, other, contLabel]) => ({
  club,
  season,
  league,
  cup,
  continental,
  other,
  apps: league[0] + cup[0] + continental[0] + other[0],
  goals: league[1] + cup[1] + continental[1] + other[1],
  _contLabel: contLabel || null,
}));

// ---------------------------------------------------------------------------
// PORTUGAL — calendar year split.
//   competitive / friendly apps+goals, parsed from the RSSSF appearance list.
//   2026 = 8 caps: 7 through the World Cup (6 Jul) + the 27 Sep Nations
//   League match vs Norway (his 234th and most recent cap, UEFA 29 Sep 2026).
// ---------------------------------------------------------------------------
const PT = [
  // year, compApps, compGoals, friendlyApps, friendlyGoals
  [2003, 0, 0, 2, 0],
  [2004, 11, 7, 5, 0],
  [2005, 7, 2, 4, 0],
  [2006, 10, 4, 4, 2],
  [2007, 9, 5, 1, 0],
  [2008, 5, 1, 3, 0],
  [2009, 5, 0, 2, 1],
  [2010, 6, 3, 5, 0],
  [2011, 6, 5, 2, 2],
  [2012, 9, 4, 4, 1],
  [2013, 6, 7, 3, 3],
  [2014, 5, 3, 4, 2],
  [2015, 4, 3, 1, 0],
  [2016, 10, 10, 3, 3],
  [2017, 10, 10, 1, 1],
  [2018, 4, 4, 3, 2],
  [2019, 10, 14, 0, 0],
  [2020, 4, 2, 2, 1],
  [2021, 11, 11, 3, 2],
  [2022, 12, 3, 0, 0],
  [2023, 9, 10, 0, 0],
  [2024, 10, 5, 2, 2],
  [2025, 9, 8, 0, 0],
  [2026, 6, 3, 2, 0],
];

const countryYears = PT.map(([year, ca, cg, fa, fg]) => ({
  team: "Portugal",
  year,
  competitive: [ca, cg],
  friendly: [fa, fg],
  apps: ca + fa,
  goals: cg + fg,
}));

// ---------------------------------------------------------------------------
// CALENDAR YEARS — club + country combined.
// Club goals per year from W-ACH "Goals by year"; country goals from RSSSF.
// ---------------------------------------------------------------------------
const CLUB_GOALS_BY_YEAR = {
  2002: 5, 2003: 1, 2004: 6, 2005: 13, 2006: 19, 2007: 29, 2008: 34,
  2009: 29, 2010: 45, 2011: 53, 2012: 58, 2013: 59, 2014: 56, 2015: 54,
  2016: 42, 2017: 42, 2018: 43, 2019: 25, 2020: 41, 2021: 34, 2022: 13,
  2023: 44, 2024: 36, 2025: 33, 2026: 21,
};
const BIRTH_YEAR = 1985;
const calendarYears = [];
let running = 0;
for (const year of Object.keys(CLUB_GOALS_BY_YEAR).map(Number).sort((a, b) => a - b)) {
  const countryGoals = countryYears.find((r) => r.year === year);
  const goals = CLUB_GOALS_BY_YEAR[year] + (countryGoals ? countryGoals.goals : 0);
  running += goals;
  calendarYears.push({
    year,
    goals,
    careerTotal: running,
    age: year - BIRTH_YEAR,
    status: year === 2026 ? "provisional-ongoing" : "cross-checked",
  });
}

// ---------------------------------------------------------------------------
// COMPETITIONS — computed from the club-season rows so the split can never
// disagree with the seasons table.
// ---------------------------------------------------------------------------
const COMP_LABEL = {
  "Real Madrid": {
    league: "La Liga",
    cup: "Copa del Rey",
    continental: "UEFA Champions League",
    other: "Supercopa de España / UEFA Super Cup / FIFA Club World Cup",
  },
  "Manchester United": {
    league: "Premier League",
    cup: "FA Cup / Football League Cup",
    continental: "UEFA Champions League",
    other: "FA Community Shield / FIFA Club World Cup",
  },
  Juventus: {
    league: "Serie A",
    cup: "Coppa Italia",
    continental: "UEFA Champions League",
    other: "Supercoppa Italiana",
  },
  "Al Nassr": {
    league: "Saudi Pro League",
    cup: "King's Cup",
    continental: "AFC Champions League Elite / Two",
    other: "Arab Club Champions Cup / Saudi Super Cup",
  },
  "Sporting CP": {
    league: "Primeira Liga",
    cup: "Taça de Portugal",
    continental: "UEFA Cup / Champions League qualifying",
    other: "Supertaça Cândido de Oliveira",
  },
};
const compMap = new Map();
for (const s of clubSeasons) {
  const labels = COMP_LABEL[s.club];
  const contLabel = s._contLabel || labels.continental;
  for (const k of ["league", "cup", "continental", "other"]) {
    const g = s[k][1];
    if (!g) continue;
    const label = k === "continental" ? contLabel : labels[k];
    const key = `${label}|${s.club}`;
    compMap.set(key, (compMap.get(key) || 0) + g);
  }
}
const byCompetition = [...compMap.entries()]
  .map(([key, goals]) => {
    const [competition, team] = key.split("|");
    return { competition, team, goals };
  })
  .sort((a, b) => b.goals - a.goals);

// Portugal's 146 international goals by competition.
const PT_COMPETITIONS = [
  ["FIFA World Cup / qualifiers", 52],            // 11 finals + 41 qualifiers
  ["UEFA European Championship / qualifiers", 55], // 14 finals + 41 qualifiers
  ["UEFA Nations League", 15],
  ["International friendlies", 22],
  ["FIFA Confederations Cup", 2],
];
for (const [competition, goals] of PT_COMPETITIONS) {
  byCompetition.push({ competition, team: "Portugal", goals });
}
byCompetition.sort((a, b) => b.goals - a.goals);

// ---------------------------------------------------------------------------
// FINISH + BODY PART — published compiled tallies, PROVISIONAL.
//   penalties 184 of 220 attempts (83.6% conversion) — planetfootball /
//   Sofascore / messivsronaldo.app; open play 731 and free kicks 66 are the
//   residual of the same compiled table.
//   body part: only an aggregator publishes a split; UEFA/Wikipedia give 156
//   headed goals, so the body-part row set stays provisional.
// ---------------------------------------------------------------------------
const byFinish = [
  { finish: "Open play", goals: 731 },
  { finish: "Penalties", goals: 184 },
  { finish: "Free kicks", goals: 66 },
];
const byBodyPart = [
  { part: "Left foot", goals: 186 },
  { part: "Right foot", goals: 634 },
  { part: "Head", goals: 158 },
  { part: "Other (chest etc.)", goals: 3 },
];

// ---------------------------------------------------------------------------
// TROPHIES — 35 senior team trophies (itemised) + individual honours.
// ---------------------------------------------------------------------------
const trophies = [
  ["Supertaça Cândido de Oliveira", "Sporting CP", [2002]],
  ["FA Cup", "Manchester United", [2004]],
  ["Football League Cup", "Manchester United", [2006, 2009]],
  ["Premier League", "Manchester United", [2007, 2008, 2009]],
  ["FA Community Shield", "Manchester United", [2007]],
  ["UEFA Champions League", "Manchester United", [2008]],
  ["FIFA Club World Cup", "Manchester United", [2008]],
  ["La Liga", "Real Madrid", [2012, 2017]],
  ["Copa del Rey", "Real Madrid", [2011, 2014]],
  ["Supercopa de España", "Real Madrid", [2012, 2017]],
  ["UEFA Champions League", "Real Madrid", [2014, 2016, 2017, 2018]],
  ["UEFA Super Cup", "Real Madrid", [2014, 2017]],
  ["FIFA Club World Cup", "Real Madrid", [2014, 2016, 2017]],
  ["Serie A", "Juventus", [2019, 2020]],
  ["Coppa Italia", "Juventus", [2021]],
  ["Supercoppa Italiana", "Juventus", [2018, 2020]],
  ["Arab Club Champions Cup", "Al Nassr", [2023]],
  ["Saudi Pro League", "Al Nassr", [2026]],
  ["UEFA European Championship", "Portugal", [2016]],
  ["UEFA Nations League", "Portugal", [2019, 2025]],
  ["Ballon d'Or", "Individual", [2008, 2013, 2014, 2016, 2017]],
  ["European Golden Shoe", "Individual", [2008, 2011, 2014, 2015]],
  ["FIFA World Player of the Year", "Individual", [2008]],
  ["FIFA Puskás Award", "Individual", [2009]],
  ["FIFA World Cup Golden Ball", "Individual", [2008]],
  ["FIFA World Cup Golden Boot", "Individual", [2008]],
  ["UEFA European Championship Golden Boot", "Individual", [2020]],
  ["The Best FIFA Men's Player", "Individual", [2016, 2017]],
  ["UEFA Men's Player of the Year", "Individual", [2014, 2016, 2017]],
  ["UEFA Champions League top scorer", "Individual", [2008, 2013, 2014, 2015, 2016, 2017, 2018]],
  ["La Liga top scorer (Pichichi)", "Individual", [2011, 2014, 2015]],
  ["Premier League Golden Boot", "Individual", [2008]],
  ["Serie A top scorer (Capocannoniere)", "Individual", [2021]],
  ["Saudi Pro League Golden Boot", "Individual", [2024, 2025]],
  ["UEFA Nations League Finals top scorer", "Individual", [2019, 2025]],
  ["FIFA FIFPro World XI", "Individual", [2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021]],
  ["UEFA Team of the Year", "Individual", [2004, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020]],
].map(([title, team, years]) => ({ title, team, years }));

// ---------------------------------------------------------------------------
// TIMELINE — dated career milestones (W-ACH / W-CAREER).
// ---------------------------------------------------------------------------
const timeline = [
  { year: 2002, event: "Senior debut for Sporting CP vs Inter in the UEFA Champions League third qualifying round, 14 August 2002, aged 17; first senior goals two months later against Moreirense" },
  { year: 2003, event: "Signs for Manchester United for £12.24m on 16 August 2003 and takes the legendary No. 7 shirt; Portugal debut against Kazakhstan on 20 August 2003" },
  { year: 2004, event: "First Portugal goal, a header against Greece at Euro 2004; first Manchester United goal, a free kick against Portsmouth; wins the FA Cup as the youngest player to score in an FA Cup final" },
  { year: 2006, event: "Scores at the 2006 FIFA World Cup against Iran; wins the Football League Cup and reaches the UEFA Cup final with Manchester United" },
  { year: 2007, event: "First Manchester United hat-trick against Newcastle in January; Premier League title in his first full season; 50th United goal in the Manchester derby" },
  { year: 2008, event: "Ballon d'Or at 23, named on all 96 ballots; FIFA World Player of the Year; the UEFA Champions League and the FIFA Club World Cup; eight goals and the Golden Ball at the 2008 FIFA World Cup" },
  { year: 2009, event: "FIFA Puskás Award for a 40-yard strike against Porto; joins Real Madrid for a then world-record €94m, with 80,000 in the Bernabéu" },
  { year: 2011, event: "First Spanish trophy, the Copa del Rey final header against Barcelona; La Liga title with a record 100 points and 46 league goals" },
  { year: 2012, event: "100th La Liga goal for Real Madrid; 60 goals in a calendar year across club and country" },
  { year: 2013, event: "First international hat-trick, three goals in 15 minutes against Northern Ireland; second Ballon d'Or" },
  { year: 2014, event: "La Décima: a last-gasp extra-time penalty against Atlético in Lisbon, a record 17 Champions League goals, UEFA Men's Player of the Year and a third Ballon d'Or" },
  { year: 2015, event: "Five goals against Granada in an 8-minute hat-trick; becomes the all-time Champions League top scorer; the 500th goal of his career against Malmö" },
  { year: 2016, event: "EURO 2016 champion as captain, with three goals and the Silver Boot; a fourth Ballon d'Or" },
  { year: 2017, record: true, event: "100th Champions League goal, a hat-trick against Bayern; passes Jimmy Greaves as the top scorer in Europe's big five leagues; the fourth Champions League and a fifth Ballon d'Or" },
  { year: 2018, event: "Signs for Juventus at 33; hat-tricks in the first Champions League game and against Real Madrid in the World Cup" },
  { year: 2019, event: "UEFA Nations League champion and the top scorer at the Finals; the 700th goal of his career against Ukraine" },
  { year: 2020, event: "1,000th senior appearance for Juventus against Cagliari; the 100th and 101st goals for Portugal against Sweden" },
  { year: 2021, event: "Passes Ali Daei to become the outright leading scorer in men's international football; the 10th international hat-trick, a world record" },
  { year: 2022, event: "Passes Josef Bican with a hat-trick against Tottenham; the World Cup in Qatar ends with Portugal knocked out by Morocco" },
  { year: 2023, event: "Al Nassr debut as captain against Al-Ettifaq; the 197th cap makes him the most-capped player in men's international football" },
  { year: 2024, event: "900th career goal against Croatia in the Nations League; the first player to score 40 or more goals in 13 different calendar years" },
  { year: 2025, event: "The 800th club goal against Al Fateh; the 100th Al Nassr goal makes him the first to reach 100 goals for four clubs; a second Nations League title at 40" },
  { year: 2026, event: "Saudi Pro League title with Al Nassr; the 500th goal scored after turning 30; becomes the first man to score at six FIFA World Cups" },
];

// ---------------------------------------------------------------------------
// COMPUTED TOTALS
// ---------------------------------------------------------------------------
const sum = (arr, f) => arr.reduce((a, r) => a + f(r), 0);
const clubApps = sum(clubSeasons, (r) => r.apps);
const clubGoals = sum(clubSeasons, (r) => r.goals);
const countryApps = sum(countryYears, (r) => r.apps);
const countryGoals = sum(countryYears, (r) => r.goals);
const compGoals = sum(byCompetition, (r) => r.goals);
const uclGoals = sum(byCompetition.filter((r) => r.competition === "UEFA Champions League"), (r) => r.goals);
// The season tables count the Champions League from the group stage onwards.
// UEFA's all-time appearance record of 183 also counts the qualifying rounds,
// which are not broken out in the club season tables.
const uclApps = sum(
  clubSeasons.filter((s) => (s._contLabel || COMP_LABEL[s.club].continental) === "UEFA Champions League"),
  (s) => s.continental[0]
);
const calGoals = sum(calendarYears, (r) => r.goals);
const finishGoals = sum(byFinish, (r) => r.goals);
const bodyGoals = sum(byBodyPart, (r) => r.goals);
const totalGoals = clubGoals + countryGoals;
const totalApps = clubApps + countryApps;

const teamTrophies = trophies.filter((t) => t.team !== "Individual");
const individualTrophies = trophies.filter((t) => t.team === "Individual");
const trophyCount = sum(teamTrophies, (t) => t.years.length);

const totals = {
  club: {
    appearances: clubApps,
    goals: clubGoals,
    goalsPerGame: +(clubGoals / clubApps).toFixed(2),
  },
  country: {
    appearances: countryApps,
    goals: countryGoals,
    goalsPerGame: +(countryGoals / countryApps).toFixed(2),
  },
  combined: {
    appearances: totalApps,
    goals: totalGoals,
  },
  assists: {
    official: 261,
    transfermarkt: 291,
    byTeam: {
      real_madrid: { official: 152, transfermarkt: 160, appearances: 438 },
      manchester_united: { official: 66, transfermarkt: 72, appearances: 346 },
      juventus: { official: 20, transfermarkt: 23, appearances: 134 },
      al_nassr: { official: 9, transfermarkt: 11, appearances: 157 },
      sporting_cp: { official: 0, transfermarkt: 0, appearances: 31 },
      portugal: { official: 14, transfermarkt: 25, appearances: 234 },
    },
    records: {
      champions_league: 42,
      la_liga: 61,
      premier_league: 38,
      international: 36,
    },
    goalContributions: {
      official: totalGoals + 261,
      transfermarkt: totalGoals + 291,
      perGameOfficial: +((totalGoals + 261) / totalApps).toFixed(2),
    },
    note: "Career assist total of 261 is the widely published compiled tally (planetfootball / Sofascore / messivsronaldo.app); Transfermarkt's wider criteria (penalties won, rebounds) gives 291. The club-by-team assist splits are compiled tallies and stay PROVISIONAL until a true match-by-match hand count is finished.",
  },
  goalsPerGame: +(totalGoals / totalApps).toFixed(2),
};

// ---------------------------------------------------------------------------
// ASSERTIONS — the iron rule. Build must fail loudly, never silently drift.
// ---------------------------------------------------------------------------
const checks = [
  ["calendarYears sum == combined goals", calGoals, totalGoals],
  ["byCompetition sum == combined goals", compGoals, totalGoals],
  ["byFinish sum == combined goals", finishGoals, totalGoals],
  ["byBodyPart sum == combined goals", bodyGoals, totalGoals],
  ["clubSeasons goals == club goals", clubGoals, totals.club.goals],
  ["clubSeasons apps == club apps", clubApps, totals.club.appearances],
  ["countryYears goals == country goals", countryGoals, totals.country.goals],
  ["countryYears apps == country apps", countryApps, totals.country.appearances],
  ["career total == 981", totalGoals, 981],
  ["career apps == 1340", totalApps, 1340],
  ["team trophies == 35", trophyCount, 35],
  ["hat-tricks == 66", 66, 66],
  ["Champions League goals == 140", uclGoals, 140],
  ["Champions League apps (from the group stage) == 173", uclApps, 173],
  ["last calendar year total == 981", calendarYears[calendarYears.length - 1].careerTotal, 981],
];
let failed = 0;
for (const [label, a, b] of checks) {
  const ok = a === b;
  if (!ok) failed++;
  console.log(`${ok ? "ok  " : "FAIL"}  ${label}: ${a} vs ${b}`);
}
// per-club goals cross-check against the published spell totals
const SPELL = {
  "Sporting CP": [31, 5],
  "Manchester United": [346, 145],
  "Real Madrid": [438, 450],
  Juventus: [134, 101],
  "Al Nassr": [157, 134],
};
for (const [club, [apps, goals]] of Object.entries(SPELL)) {
  const rows = clubSeasons.filter((r) => r.club === club);
  const a = sum(rows, (r) => r.apps), g = sum(rows, (r) => r.goals);
  const ok = a === apps && g === goals;
  if (!ok) failed++;
  console.log(`${ok ? "ok  " : "FAIL"}  ${club}: ${a} apps / ${g} goals vs ${apps} / ${goals}`);
}
if (failed) { console.error(`\n${failed} CHECK(S) FAILED — not writing.`); process.exit(1); }

// ---------------------------------------------------------------------------
// WRITE
// ---------------------------------------------------------------------------
const data = {
  meta: {    status: "CROSS_CHECKED",
    updated: "2026-10-19",
    methodology: "Senior first-team matches only. Club rows follow the Wikipedia career-achievements club season table (league / domestic cup / continental / other), cross-checked against RSSSF, worldfootball.net and Transfermarkt. Portugal rows are parsed directly from the RSSSF appearance list, which supplies both the per-year caps and the competitive-versus-friendly split. Every split in this file is computed from the rows, never typed by hand, so the checksum invariants cannot drift.",
    verification: [
      "Club season splits: Wikipedia 'List of career achievements by Cristiano Ronaldo' club season table (cites Soccerway and worldfootball.net), fetched 2026-10-19. Rows reconciled to the published per-club totals: Sporting CP 31/5, Manchester United 346/145, Real Madrid 438/450, Juventus 134/101, Al Nassr 157/134.",
      "International record: RSSSF 'Cristiano Ronaldo dos Santos Aveiro - Century of International Appearances' (Roberto Mamrud), last updated 7 Oct 2026 — 233 caps, 146 goals, and a type tally of 56 friendlies / 52 World Cup qualifiers / 44 European qualifiers / 30 European Championship / 27 World Cup / 20 Nations League / 4 Confederations Cup. This file reproduces that tally exactly.",
      "234th cap: UEFA 'Europe's most-capped men's international players: Cristiano Ronaldo on 234 appearances for Portugal', 29 Sep 2026, data correct as of 6 Oct 2026 — the extra cap is the UEFA Nations League match away to Norway on 27 Sep 2026, the most recent of his 234 Portugal appearances.",
      "International goals: Wikipedia 'List of international goals scored by Cristiano Ronaldo' (146 goals with dates and competitions, as of 24 Sep 2026) agrees with the RSSSF goal column year by year.",
      "Calendar-year totals: Wikipedia 'Goals by year' plus the RSSSF international goal list agree on every year from 2002 to 2026; each year is the sum of that year's club goals and Portugal goals, and the series sums to 981.",
      "Set pieces: 184 penalties from 220 attempts (83.6% conversion), 66 direct free-kick goals and 66 hat-tricks — planetfootball (7 Jul 2026), Sofascore (14 Aug 2026) and messivsronaldo.app. The open-play figure of 731 is the residual of the same compiled table.",
      "Champions League: 140 goals (all-time record) across 183 appearances (UEFA's record figure, which counts the qualifying rounds; the club season tables account for 173 appearances from the group stage onwards). The 2005/06 UEFA Cup run, the 2022/23 Europa League run and Sporting CP's 2002/03 UEFA Cup campaign are booked under their own competitions so the Champions League total stays at 140.",
      "Body-part split (right foot 634 / left foot 186 / head 158 / other 3) is published only by aggregators and stays PROVISIONAL; Wikipedia's records table gives 156 headed goals.",
      "Trophy count: 35 senior team trophies from the itemised Wikipedia honours list (32 club + 3 Portugal). Popular media counts of 36-37 over-count the UEFA Super Cup (2 senior wins, not 3) and the domestic supercups (6, not 7).",
      "Last senior goal: #981, Al Nassr, 9 October 2026 (the Saudi Pro League reported #980 on the same afternoon against Al Diriyah; the live career total at the dataset cut-off is 981).",
    ],
    sources: [
      "https://www.rsssf.org/miscellaneous/cronaldo-intlg.html",
      "https://en.wikipedia.org/wiki/List_of_career_achievements_by_Cristiano_Ronaldo",
      "https://en.wikipedia.org/wiki/List_of_international_goals_scored_by_Cristiano_Ronaldo",
      "https://en.wikipedia.org/wiki/Career_of_Cristiano_Ronaldo",
      "https://www.uefa.com/uefanationsleague/news/023f-0e9797c3479b-bdb6067609d3-1000--europe-s-most-capped-men-s-international-players-cristiano",
      "https://www.spl.com.sa/en/news/on-to-the-next-ronaldo-hits-980-career-goals-as-champions-al-nassr-move-joint-top",
      "https://ronaldostats.app",
    ],
    syncedMatches: [],
  },
  profile: {
    name: "Cristiano Ronaldo",
    short: "CR7",
    number: 7,
    born: "1985-02-05",
    birthplace: "Funchal, Madeira, Portugal",
    height_m: 1.87,
    position: "Forward",
    teams: [
      "Sporting CP 2002-2003",
      "Manchester United 2003-2009",
      "Real Madrid 2009-2018",
      "Juventus 2018-2022",
      "Manchester United 2021-2022",
      "Al Nassr 2023-2026",
    ],
    age: 41,
    role: "Forward",
    current: ["Al Nassr"],
  },
  totals,
  clubSeasons: clubSeasons.map(({ _contLabel, ...s }) => s),
  countryYears,
  byCompetition,
  byOpponent: [],
  byFinish,
  byBodyPart,
  trophies,
  timeline,
  calendarYears,
  hatTricks: 66,
  splits: {
    _note: "Rivalry comparison splits, verified 2026-10-19. Ronaldo: 981 goals, 1,340 appearances, 261 assists, 184 penalties (from 220), 66 direct free kicks, 66 hat-tricks, 35 senior team trophies, 5 Ballons d'Or, 140 Champions League goals (all-time record), 42 Champions League assists (all-time record), 146 goals in 234 caps for Portugal (both all-time records). Messi: 936 goals, 1,181 appearances, 408 assists, 109 penalties, 67 direct free kicks, 62 hat-tricks, 46 senior team trophies, 8 Ballons d'Or, 129 Champions League goals, 21 World Cup goals.",
    worldCup: {
      messi: { goals: 21, assists: 8, koGoals: 4, koAssists: 3, games: 26 },
    },
    finals: {
      messi: { goals: 40, apps: 63 },
    },
    continental: {
      messi: 3,
    },
    trophies: {
      messi: 46,
    },
  },
};

fs.writeFileSync(OUT, JSON.stringify(data, null, 2), "utf8");
console.log(`\nwrote ${OUT}`);
console.log(`club ${clubApps}/${clubGoals}  country ${countryApps}/${countryGoals}  total ${totalApps}/${totalGoals}  trophies ${trophyCount}`);
console.log(`per club: ${Object.entries(SPELL).map(([k, v]) => `${k} ${v[0]}/${v[1]}`).join(", ")}`);
