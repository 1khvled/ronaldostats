/**
 * The milestone copy — the 18 nights that define the career.
 *
 * ONE source of truth: this file. It writes the copy into the English shell
 * (timeline.html), which is the i18n source, and app.js reads the copy back
 * out of the shell at runtime. The shell's copy is translated at build time
 * into all nine languages, so the milestone stream is localised everywhere and
 * the dates cannot drift apart any more.
 *
 *   node scripts/sync-timeline-milestones.mjs
 *
 * The facts are the verified ones: the debut on 14 August 2002 against Inter
 * at 17 years and 190 days, the move to Manchester United completed on
 * 12 August 2003, the Ballon d'Or on 2 December 2008 on 77 of 96 ballots,
 * La Décima 4-1 after extra time on 24 May 2014, the 500th goal against
 * Malmo on 30 September 2015 (taking the Champions League scoring record from
 * Messi), the 100th Champions League goal against Bayern on 18 April 2017,
 * the 1,000th senior appearance against SPAL on 22 February 2020, and goal
 * #981 against Neftchi Fergana in the AFC Champions League Elite on
 * 12 October 2026.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SHELL = path.join(ROOT, "timeline.html");

export const MILESTONES = [
  {
    key: "debut", era: "rosario", date: "14 Aug 2002", iso: "2002-08-14", year: 2002,
    cat: "debut", team: "sporting",
    title: "Senior debut for Sporting CP",
    desc: "— aged 17 years and 190 days, Ronaldo comes on against Inter in the UEFA Champions League third qualifying round at the Estádio José Alvalade, the start of the most decorated career in modern football.",
    stat: "Age 17y 190d", badge: "Official Debut", emoji: "",
    img: "/img/era/era-2002-sporting.webp",
    alt: "The Sporting CP museum in Lisbon, with Ronaldo's number 28 shirt from his debut season",
  },
  {
    key: "first-goal", era: "rosario", date: "7 Oct 2002", iso: "2002-10-07", year: 2002,
    cat: "goal", team: "sporting",
    title: "First senior career goal vs Moreirense",
    desc: "— seven weeks after his debut, Ronaldo opens his senior account with two goals against Moreirense in the Primeira Liga: the first of 981.",
    stat: "Goal #1", badge: "First Senior Goal", emoji: "⚽",
    img: "/img/era/era-2002-sporting.webp",
    alt: "The Sporting CP museum in Lisbon, with Ronaldo's number 28 shirt from his debut season",
  },
  {
    key: "manutd", era: "peak", date: "12 Aug 2003", iso: "2003-08-12", year: 2003,
    cat: "transfer", team: "manutd",
    title: "Signs for Manchester United and takes the No. 7 shirt",
    desc: "— Ronaldo signs for £12.24m and inherits the legendary United number 7, the shirt he has worn for the rest of his career.",
    stat: "£12.24m", badge: "Manchester United", emoji: "🔴",
    img: "/img/era/era-2004-manutd.webp",
    alt: "Ronaldo in the Manchester United number 7 shirt against Chelsea",
  },
  {
    key: "portugal-goal", era: "peak", date: "12 Jun 2004", iso: "2004-06-12", year: 2004,
    cat: "goal", team: "portugal",
    title: "First Portugal goal — header against Greece",
    desc: "— a stoppage-time header against Greece in the Euro 2004 group stage opens his international account, a record he extends to 146 goals in 234 caps.",
    stat: "First Portugal goal", badge: "International Goal", emoji: "⚽",
    img: "/img/era/era-2004-manutd.webp",
    alt: "Ronaldo in the Manchester United number 7 shirt against Chelsea",
  },
  {
    key: "ballon-1", era: "peak", date: "2 Dec 2008", iso: "2008-12-02", year: 2008,
    cat: "award", team: "manutd",
    title: "Ballon d'Or at 23, named on 77 of 96 ballots",
    desc: "— the first Ballon d'Or ever won by a Portuguese player, in a season that also delivered the Champions League, the FIFA Club World Cup and eight goals in Euro 2008 qualifying.",
    stat: "Ballon d'Or #1", badge: "1st Ballon d'Or", emoji: "🌟",
    img: "/img/era/era-2008-ballon1.webp",
    alt: "Ronaldo in the Manchester United number 7 shirt in 2008, the year of his first Ballon d'Or",
  },
  {
    key: "real-madrid", era: "msn", date: "10 Jun 2009", iso: "2009-06-10", year: 2009,
    cat: "transfer", team: "realmadrid",
    title: "Signs for Real Madrid for a world-record fee",
    desc: "— Ronaldo joins for a then record €94m, and 80,000 fans pack the Bernabéu for the presentation. He stays on the Spanish stage until 2018.",
    stat: "€94m", badge: "Real Madrid", emoji: "⚪",
    img: "/img/era/era-2009-real.webp",
    alt: "Kaka and Ronaldo celebrating together for Real Madrid",
  },
  {
    key: "ni-hattrick", era: "carry", date: "6 Sep 2013", iso: "2013-09-06", year: 2013,
    cat: "record", team: "portugal",
    title: "Three goals in 15 minutes for Portugal",
    desc: "— against Northern Ireland in a World Cup 2014 qualifier, Ronaldo scores three times inside 15 minutes, the fastest international hat-trick of his career, in the season he sets his 69-goal calendar-year record.",
    stat: "Hat-trick in 15 minutes", badge: "Record Hat-trick", emoji: "⚡",
    img: "/img/era/era-2008-ballon1.webp",
    alt: "Ronaldo in the Manchester United number 7 shirt in 2008, the year of his first Ballon d'Or",
  },
  {
    key: "decima", era: "msn", date: "24 May 2014", iso: "2014-05-24", year: 2014,
    cat: "trophy", team: "realmadrid",
    title: "La Décima — the last-gasp penalty in Lisbon",
    desc: "— Ronaldo converts the extra-time penalty at the Estádio da Luz to win a 4–1 Champions League final after extra time, giving Real Madrid a tenth European Cup and a personal 17-goal Champions League season.",
    stat: "La Décima", badge: "10th European Cup", emoji: "🏆",
    img: "/img/era/era-2009-real.webp",
    alt: "Kaka and Ronaldo celebrating together for Real Madrid",
  },
  {
    key: "goal-500", era: "msn", date: "30 Sep 2015", iso: "2015-09-30", year: 2015,
    cat: "record", team: "realmadrid",
    title: "500th career goal and Champions League top scorer",
    desc: "— his 500th goal arrives against Malmö in the season he passes Messi to become the all-time Champions League top scorer, a record he still holds.",
    stat: "Goal #500", badge: "500 Goals", emoji: "⚡",
    img: "/img/era/era-2013-ballon3.webp",
    alt: "Cristiano Ronaldo in the Portugal number 7 shirt, in the year of his third Ballon d'Or",
  },
  {
    key: "euro-2016", era: "carry", date: "10 Jul 2016", iso: "2016-07-10", year: 2016,
    cat: "trophy", team: "portugal",
    title: "EURO 2016 champion as Portugal's captain",
    desc: "— Ronaldo lifts the European Championship in Paris, finishing as the tournament's second-highest scorer with three goals and taking the Silver Boot.",
    stat: "Euro 2016", badge: "European Champion", emoji: "🏆",
    img: "/img/cab-copa.webp",
    alt: "Cristiano Ronaldo in the Portugal number 7 shirt, captaining his country",
  },
  {
    key: "ballon-5", era: "msn", date: "18 Apr 2017", iso: "2017-04-18", year: 2017,
    cat: "award", team: "realmadrid",
    title: "Fifth Ballon d'Or and a 100th Champions League goal",
    desc: "— a hat-trick against Bayern Munich takes him past 100 Champions League goals; in December he collects his fifth Ballon d'Or in Paris.",
    stat: "Ballon d'Or #5", badge: "5th Ballon d'Or", emoji: "🌟",
    img: "/img/era/era-2016-ballon5.webp",
    alt: "Cristiano Ronaldo in the Portugal number 7 shirt, celebrating",
  },
  {
    key: "juventus", era: "farewell", date: "10 Jul 2018", iso: "2018-07-10", year: 2018,
    cat: "transfer", team: "juventus",
    title: "Signs for Juventus at 33",
    desc: "— Ronaldo joins for €100m and wins two Serie A titles in three seasons, becoming the first player to win the top-scorer award in three different leagues.",
    stat: "€100m", badge: "Juventus", emoji: "🐂",
    img: "/img/era/era-2018-juve.webp",
    alt: "Ronaldo in the Juventus shirt during his Serie A title season",
  },
  {
    key: "goal-700", era: "farewell", date: "14 Oct 2019", iso: "2019-10-14", year: 2019,
    cat: "goal", team: "portugal",
    title: "The 700th goal of his career",
    desc: "— Ronaldo reaches 700 senior goals against Ukraine, having already topped the Nations League scoring charts at the Finals.",
    stat: "Goal #700", badge: "700 Goals", emoji: "⚽",
    img: "/img/era/era-2018-juve.webp",
    alt: "Ronaldo in the Juventus shirt during his Serie A title season",
  },
  {
    key: "apps-1000", era: "farewell", date: "22 Feb 2020", iso: "2020-02-22", year: 2020,
    cat: "record", team: "juventus",
    title: "1,000th senior appearance",
    desc: "— Ronaldo plays his 1,000th senior match for Juventus against SPAL, and later in the year scores his 100th and 101st goals for Portugal in a single match against Sweden.",
    stat: "1,000th senior appearance", badge: "1,000th Appearance", emoji: "📜",
    img: "/img/era/era-2018-juve.webp",
    alt: "Ronaldo in the Juventus shirt during his Serie A title season",
  },
  {
    key: "manutd-return", era: "paris", date: "11 Sep 2021", iso: "2021-09-11", year: 2021,
    cat: "transfer", team: "manutd",
    title: "The return to Manchester United",
    desc: "— Ronaldo returns to Old Trafford on a two-year deal, scoring twice on his debut against Newcastle and adding 24 goals in all competitions that season.",
    stat: "2nd spell", badge: "Man United Return", emoji: "🔴",
    img: "/img/era/era-2021-manutd.webp",
    alt: "Ronaldo in the Manchester United shirt during his second spell",
  },
  {
    key: "goal-900", era: "miami", date: "5 Sep 2024", iso: "2024-09-05", year: 2024,
    cat: "goal", team: "portugal",
    title: "The 900th goal of his career",
    desc: "— a close-range finish against Croatia in the UEFA Nations League takes Ronaldo past 900 senior goals, the first player to score 40 or more goals in 14 different calendar years.",
    stat: "Goal #900", badge: "900 Goals", emoji: "⚽",
    img: "/img/era/era-2023-alnassr.webp",
    alt: "Ronaldo in the Al Nassr number 7 shirt",
  },
  {
    key: "goal-800", era: "miami", date: "26 May 2025", iso: "2025-05-26", year: 2025,
    cat: "record", team: "alnassr",
    title: "800th club goal for Al Nassr",
    desc: "— Ronaldo scores his 800th goal for a club against Al Fateh; two months later he becomes the first player to reach 100 goals for four different clubs, aged 40.",
    stat: "800th club goal", badge: "800 Club Goals", emoji: "⚡",
    img: "/img/era/era-2023-alnassr.webp",
    alt: "Ronaldo in the Al Nassr number 7 shirt",
  },
  {
    key: "goal-983", era: "miami", date: "23 Oct 2026", iso: "2026-10-23", year: 2026,
    cat: "goal", team: "alnassr",
    title: "Goal #983 — the record extends",
    desc: "— Ronaldo scores twice for Al Nassr against Al Faysaly in the Saudi Pro League, reaching 983 career goals in 1,342 appearances.",
    stat: "Goal #983", badge: "983 Career Goals", emoji: "⚽",
    img: "/img/era/era-2026-record.webp",
    alt: "Ronaldo in the Al Nassr shirt celebrating goal 983",
  },
];

// --- the markup one milestone carries in the shell ------------------------
const item = (m) =>
  `<li class="tl-milestone" data-key="${m.key}" data-cat="${m.cat}" data-team="${m.team}" data-year="${m.year}" data-date="${m.iso}" data-img="${m.img}" data-label="${m.alt}">` +
  `<span class="tl-date">${m.date}</span> <b>${m.title}</b> ${m.desc}` +
  `<span class="tl-stat">${m.stat}</span>` +
  `<span class="tl-badge">${m.emoji ? `<span class="tl-emoji">${m.emoji}</span>` : ""}${m.badge}</span>` +
  `</li>`;

// --- write the shell ------------------------------------------------------
let shell = fs.readFileSync(SHELL, "utf8");
const eras = ["rosario", "peak", "msn", "carry", "farewell", "paris", "miami"];
for (const era of eras) {
  const re = new RegExp(`(<article class="chapter" data-era="${era}">[\\s\\S]*?<ul>)([\\s\\S]*?)(</ul>)`);
  const m = shell.match(re);
  if (!m) throw new Error("the chapter " + era + " is missing from the shell");
  const list = MILESTONES.filter((x) => x.era === era).map(item).join("\n");
  shell = shell.replace(re, (_, a, b, c) => a + "\n" + list + "\n" + c);
}
fs.writeFileSync(SHELL, shell, "utf8");
console.log("the shell carries " + MILESTONES.length + " milestones:");
for (const m of MILESTONES) console.log("   " + m.date + "  " + m.title);
