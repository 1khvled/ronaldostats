/**
 * Bring the RonaldoStats search structure in line with the MessiStat one.
 *
 *   node scripts/apply-seo-parity.mjs
 *
 * The two sites share one structure, and this keeps the Ronaldo one in step:
 *
 *   1. the keyword list of every page — the MessiStat coverage, written for
 *      Ronaldo, plus the brand terms and the sister site;
 *   2. the X and Telegram accounts the site points at (the ones that are
 *      actually live: @messistat1 and @messistatdotcom);
 *   3. a link to the sister site, MessiStat, in the footer of every page;
 *   4. the three videos on the Real Madrid page, which pointed at a CDN that
 *      does not exist, now point at the real clips and season videos.
 *
 * It is idempotent: running it twice changes nothing the second time.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, "$1"), "..");
const PAGES = ["index", "dashboard", "goalsbyyear", "goalsbyseason", "timeline", "achievements", "birthday", "latest-goal", "champions-league", "gear", "real-madrid", "ronaldo-vs-messi"];

// --- 1. the keyword list of every page -------------------------------------
const KEYWORDS = {
  index: "ronaldo stats, cristiano ronaldo stats, ronaldo career stats, ronaldo all time stats, ronaldo total goals, ronaldo assists, ronaldo stats 2026, ronaldo vs messi stats, ronaldo career goals, how many goals has ronaldo scored, ronaldo all time goals, ronaldo free kicks, ronaldo free kick goals, ronaldo direct free kick goal, how many free kicks ronaldo has, ronaldo hat tricks, ronaldo penalties, ronaldo trophies, ronaldo ballons d or, ronaldo champions league stats, ronaldo world cup stats, ronaldo el clasico stats, ronaldo real madrid stats, ronaldo manchester united stats, ronaldo portugal stats, ronaldo non penalty goals, ronaldo goals today, ronaldo stats hub, ronaldostat, ronaldostats, messistat, messistats, ronaldo goal tracker, ronaldo total career goals, ronaldo assists all time, ronaldo vs messi all time goals, who has more goals ronaldo or messi, ronaldo 69 goals in 2013, ronaldo minutes per goal, ronaldo goals per game ratio, ronaldo golden boot, ronaldo trophies list, ronaldo international goals, ronaldo 1000 goals tracker, ronaldo scoring record, cr7 stats, ronaldo records all time, ronaldo stats database",
  dashboard: "ronaldo stats, ronaldo interactive stats, ronaldo goals chart, ronaldo stats breakdown, ronaldo shot map, ronaldo career data visualization, ronaldo statistical tracker, ronaldo live stats, ronaldo dashboard, ronaldo goal explorer, ronaldostat",
  goalsbyyear: "ronaldo goals by year, ronaldo yearly goals, ronaldo goals per year, ronaldo 2013 stats, ronaldo 69 goals in 2013, ronaldo scoring record 2013, ronaldo calendar year record, ronaldo career goals by year, ronaldo annual totals, ronaldo goals per season comparison, ronaldo year by year log, ronaldostat, ronaldo goals by year 2002 2026",
  goalsbyseason: "ronaldo goals by season, ronaldo season by season goals, ronaldo real madrid seasons, ronaldo manchester united seasons, ronaldo 2014-15 season 61 goals, ronaldo career season stats, ronaldo season breakdown, ronaldo club goals by season, ronaldo portugal goals by season, ronaldo season stats, ronaldostat",
  timeline: "ronaldo timeline, ronaldo career timeline, ronaldo career stages, ronaldo youth to senior career, ronaldo story, ronaldo through the years, ronaldo career milestones, ronaldo career history, ronaldostat",
  achievements: "ronaldo trophies, ronaldo honours, ronaldo titles, ronaldo ballons d or, ronaldo 35 trophies, ronaldo champions league titles, ronaldo la liga titles, ronaldo world cup trophy, most decorated football player in history, ronaldo honours list, ronaldo awards and records, ronaldo trophy cabinet, ronaldostat",
  birthday: "did ronaldo score on your birthday, ronaldo birthday goals, ronaldo 365 days goals, ronaldo goals by birthday, ronaldo birthday goal video, ronaldo goal clips, watch ronaldo goals, ronaldo birthday match video, ronaldo birthday goal calendar, ronaldo goals every day of the year, ronaldostat",
  "latest-goal": "ronaldo goal today, watch ronaldo last goal, ronaldo last goal, ronaldo last goal video, did ronaldo score last night, ronaldo goal highlights, ronaldo goal 981, ronaldo latest goal video, ronaldo goal video player, ronaldo free kick today, ronaldo next match, ronaldo goals this week, ronaldo recent goals, ronaldostat",
  "champions-league": "ronaldo champions league, ronaldo ucl stats, ronaldo champions league goals, ronaldo champions league hat tricks, ronaldo champions league knockout goals, ronaldo ucl titles, ronaldo champions league appearances, ronaldo 140 champions league goals, ronaldo top scorer ucl, ronaldo champions league season by season, ronaldostat",
  gear: "ronaldo gear, ronaldo jerseys, ronaldo home jersey 7, ronaldo away jersey, ronaldo portugal national team shirt, ronaldo football boots, ronaldo match ball size 5, ronaldo hoodie, ronaldo cap, ronaldo framed print, ronaldo amazon store, buy ronaldo shirt, authentic ronaldo merchandise",
  "real-madrid": "ronaldo real madrid, ronaldo at real madrid, ronaldo real madrid goals, ronaldo real madrid stats, ronaldo all time el clasico top scorer, ronaldo vs real madrid, ronaldo clasico goals, ronaldo madrid years, ronaldo 450 goals real madrid, ronaldo real madrid trophy count, ronaldostat",
  "ronaldo-vs-messi": "ronaldo vs messi, ronaldo vs messi stats, ronaldo vs messi all time goals, ronaldo vs messi free kicks, ronaldo vs messi penalties, ronaldo vs messi non penalty goals, ronaldo vs messi assists, ronaldo vs messi hat tricks, ronaldo vs messi head to head, ronaldo vs messi world cup, ronaldo vs messi trophies, ronaldo vs messi ballons d or, who is the goat ronaldo or messi, who has more goals ronaldo or messi, messistat",
};

// --- 2. the accounts the site points at -------------------------------------
const X_HANDLE = "messistat1";
const X_URL = "https://x.com/" + X_HANDLE;
const TG_HANDLE = "messistatdotcom";
const TG_URL = "https://t.me/" + TG_HANDLE;

// --- 3. the sister site in the footer ---------------------------------------
const SISTER_HREF = "https://www.messistat.com";

// --- 4. the Real Madrid videos ----------------------------------------------
const RM_VIDEOS = [
  // the 2011 Copa del Rey header: the 2010-11 season video is the closest clip
  { from: "https://cdn.ronaldoallgoals.com/Goal200.mp4", to: "https://www.youtube.com/watch?v=wgWHTr-U5EY", label: "Watch the 2010-11 Goals ⚽" },
  // the 2014 final penalty: the goal's own clip
  { from: "https://cdn.ronaldoallgoals.com/Goal400.mp4", to: "https://www.dailymotion.com/video/x24jfj3", label: "Watch the Penalty ⚽" },
  // the 2018 final brace: the 2017-18 season video
  { from: "https://cdn.ronaldoallgoals.com/Goal640.mp4", to: "https://www.youtube.com/watch?v=Nz7njqljGxA", label: "Watch the 2017-18 Goals ⚽" },
];

let changed = 0;
for (const page of PAGES) {
  const file = path.join(ROOT, page + ".html");
  if (!fs.existsSync(file)) { console.log("  (no " + page + ".html)"); continue; }
  const before = fs.readFileSync(file, "utf8");
  let html = before;

  // 1. the keywords (the meta tag carries content before name, or the other way round)
  html = html.replace(/(<meta[^>]*name="keywords"[^>]*content=")[^"]*(")/, "$1" + KEYWORDS[page] + "$2");
  html = html.replace(/(<meta[^>]*content=")[^"]*("[^>]*name="keywords")/, "$1" + KEYWORDS[page] + "$2");

  // 2. the X and Telegram accounts
  html = html.replace(/(<meta[^>]*name="twitter:site"[^>]*content=")@[^"]*(")/, "$1@" + X_HANDLE + "$2");
  html = html.replace(/(<meta[^>]*content=")@[^"]*("[^>]*name="twitter:site")/, "$1@" + X_HANDLE + "$2");
  html = html.replace(/(<meta[^>]*name="twitter:creator"[^>]*content=")@[^"]*(")/, "$1@" + X_HANDLE + "$2");
  html = html.replace(/(<meta[^>]*content=")@[^"]*("[^>]*name="twitter:creator")/, "$1@" + X_HANDLE + "$2");
  html = html.replace(/https:\/\/x\.com\/ronaldostat1/g, X_URL);
  html = html.replace(/https:\/\/x\.com\/ronaldostats1/g, X_URL);
  html = html.replace(/https:\/\/twitter\.com\/ronaldostat1/g, "https://twitter.com/" + X_HANDLE);
  html = html.replace(/https:\/\/t\.me\/ronaldostatdotcom/g, TG_URL);
  html = html.replace(/https:\/\/t\.me\/ronaldostatsdotcom/g, TG_URL);
  html = html.replace(/Follow @ronaldostat1 on X/g, "Follow @" + X_HANDLE + " on X");
  html = html.replace(/Follow @ronaldostats1 on X/g, "Follow @" + X_HANDLE + " on X");
  html = html.replace(/Telegram @ronaldostatdotcom/g, "Telegram @" + TG_HANDLE);
  html = html.replace(/Telegram @ronaldostatsdotcom/g, "Telegram @" + TG_HANDLE);
  html = html.replace(/on X \(\@ronaldostat1\)/g, "on X (@" + X_HANDLE + ")");
  html = html.replace(/on X \(\@ronaldostats1\)/g, "on X (@" + X_HANDLE + ")");
  // the sameAs list: the accounts the site really has, once each
  html = html.replace(/"sameAs":\s*\[[^\]]*\]/g, (m) => {
    const indent = (m.match(/\n(\s*)"/) || [, "        "])[1];
    return '"sameAs": [\n' + indent + '"https://x.com/' + X_HANDLE + '",\n' + indent + '"https://twitter.com/' + X_HANDLE + '",\n' + indent + '"https://t.me/' + TG_HANDLE + '"\n' + indent.slice(0, -2) + "]";
  });

  // 3. the sister site in the footer
  if (!html.includes(SISTER_HREF)) {
    const anchor = '<a href="/en/achievements">';
    const i = html.indexOf(anchor);
    if (i > 0) {
      const lineEnd = html.indexOf("\n", i);
      const sister = '          <a href="' + SISTER_HREF + '" target="_blank" rel="noopener noreferrer">🐐 MessiStat — Lionel Messi Stats</a>\n';
      html = html.slice(0, lineEnd + 1) + sister + html.slice(lineEnd + 1);
    }
  }

  // 4. the Real Madrid videos
  for (const v of RM_VIDEOS) {
    if (html.includes(v.from)) html = html.split(v.from).join(v.to);
    if (!html.includes(v.to)) continue;
    const re = new RegExp('(<a href="' + v.to.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + '"[^>]*>)([^<]*)<');
    html = html.replace(re, "$1" + v.label + "<");
  }
  // the CDN that does not exist: the site loads its clips from YouTube and
  // Dailymotion, so the preconnect points at the archive it links to
  html = html.replace(/<link rel="preconnect" href="https:\/\/cdn\.ronaldoallgoals\.com" crossorigin\/>/g, '<link rel="preconnect" href="https://www.youtube-nocookie.com" crossorigin/>');
  html = html.replace(/<link rel="dns-prefetch" href="https:\/\/cdn\.ronaldoallgoals\.com"\/>/g, '<link rel="dns-prefetch" href="https://www.dailymotion.com"/>');

  if (html !== before) {
    fs.writeFileSync(file, html, "utf8");
    changed++;
    console.log("  " + page + ".html updated");
  }
}
console.log("\n" + changed + " page(s) updated");
