/**
 * The latest-goal auto-puller was still watching the Messi's teams.
 *
 *   node scripts/fix-latest-goal-sync.mjs
 *
 * It looked for Argentina and Inter Miami goals, took its player record from
 * Messi's ESPN id and wrote Messi's totals. For RonaldoStats it has to watch
 * Portugal and Al Nassr, read Ronaldo's own record and write the Ronaldo
 * totals. It also pointed at a video CDN that does not exist.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, "$1"), "..");

// --- the auto-puller --------------------------------------------------------
{
  const P = path.join(ROOT, "scripts", "auto-sync-latest-goal.mjs");
  let t = fs.readFileSync(P, "utf8");
  const before = t;

  // Ronaldo's own ESPN record (Al Nassr, id 22774), the Saudi Pro League
  // scoreboard and Portugal's internationals
  t = t.replace(
    'const ESPN_ATHLETE_OVERVIEW = "https://site.web.api.espn.com/apis/common/v3/sports/soccer/athletes/45843/overview";',
    'const ESPN_ATHLETE_OVERVIEW = "https://site.web.api.espn.com/apis/common/v3/sports/soccer/athletes/22774/overview";'
  );
  t = t.replace(
    'const ESPN_MLS_SCOREBOARD = "https://site.api.espn.com/apis/site/v2/sports/soccer/usa.1/scoreboard?dates=2026&limit=1000";',
    'const ESPN_SAUDI_SCOREBOARD = `https://site.api.espn.com/apis/site/v2/sports/soccer/ksa.1/scoreboard?dates=${new Date().getFullYear()}&limit=1000`;'
  );
  t = t.replace(/ESPN_MLS_SCOREBOARD/g, "ESPN_SAUDI_SCOREBOARD");

  // the national team is Portugal, not Argentina
  t = t.replace(/isArgentina/g, "isPortugal");
  t = t.replace(/\/argentina\/i/g, "/portugal/i");
  t = t.replace(/=== "ARG"/g, '=== "POR"');
  t = t.replace(/leagueName: "Major League Soccer"/g, 'leagueName: "Saudi Pro League"');
  t = t.replace(/leagueName \|\| "Major League Soccer"/g, 'leagueName || "Saudi Pro League"');

  // the club is Al Nassr, not Inter Miami
  t = t.replace(/isMiami/g, "isAlNassr");
  t = t.replace(/miamiComp/g, "nassrComp");
  t = t.replace(/\/miami\/i/g, "/nassr/i");
  t = t.replace(/Inter Miami CF/g, "Al Nassr");
  t = t.replace(/Inter Miami /g, "Al Nassr ");
  t = t.replace(/Argentina /g, "Portugal ");

  // the totals the file actually holds
  t = t.replace(
    `        latestData.totals.seniorGoals = newGoalNum;
        latestData.totals.appearances = (latestData.totals.appearances || 1178) + 1;
        if (!newlyFoundGoal.isPortugal) latestData.totals.miamiGoals = (latestData.totals.miamiGoals || 102) + matchGoals;
        latestData.totals.season2026Goals = (latestData.totals.season2026Goals || 26) + matchGoals;
        if (newlyFoundGoal.finish.includes("Free Kick")) {
          latestData.totals.freeKicks = (latestData.totals.freeKicks || 76) + 1;
        }`,
    `        latestData.totals.goals = newGoalNum;
        if (newlyFoundGoal.isPortugal) {
          latestData.totals.portugueseGoals = (latestData.totals.portugueseGoals || 146) + matchGoals;
        } else {
          latestData.totals.alnassrGoals = (latestData.totals.alnassrGoals || 134) + matchGoals;
          latestData.totals.alnassrApps = (latestData.totals.alnassrApps || 157) + 1;
        }
        latestData.totals.season2026Goals = (latestData.totals.season2026Goals || 24) + matchGoals;`
  );

  // the video: the archive's own page for the goal, not a CDN that is not there
  t = t.replace(
    "const videoUrl = `https://cdn.ronaldoallgoals.com/Goal${num}.mp4`;",
    "const videoUrl = `https://cr7allgoals.com/goal/${num}/`;"
  );

  fs.writeFileSync(P, t, "utf8");
  console.log(before === t ? "  (the auto-puller was already Ronaldo's)" : "ok  auto-sync-latest-goal.mjs now watches Portugal and Al Nassr");
}

// --- the runtime social links ------------------------------------------------
{
  const P = path.join(ROOT, "src", "app.js");
  let t = fs.readFileSync(P, "utf8");
  const before = t;
  t = t.replace(/https:\/\/x\.com\/ronaldostat1/g, "https://x.com/messistat1");
  t = t.replace(/https:\/\/x\.com\/ronaldostats1/g, "https://x.com/messistat1");
  t = t.replace(/https:\/\/t\.me\/ronaldostatdotcom/g, "https://t.me/messistatdotcom");
  t = t.replace(/https:\/\/t\.me\/ronaldostatsdotcom/g, "https://t.me/messistatdotcom");
  t = t.replace(/Follow @ronaldostat1 on X/g, "Follow @messistat1 on X");
  t = t.replace(/Follow @ronaldostats1 on X/g, "Follow @messistat1 on X");
  t = t.replace(/Telegram @ronaldostatdotcom/g, "Telegram @messistatdotcom");
  t = t.replace(/Telegram @ronaldostatsdotcom/g, "Telegram @messistatdotcom");
  t = t.replace(/\(\@ronaldostat1\)/g, "(@messistat1)");
  t = t.replace(/\(\@ronaldostats1\)/g, "(@messistat1)");
  fs.writeFileSync(P, t, "utf8");
  console.log(before === t ? "  (the runtime links were already the Messi's handles)" : "ok  app.js: the drawer and the runtime footer point at @messistat1");
}

// --- anything left? ----------------------------------------------------------
{
  const files = [];
  const walk = (d) => {
    for (const item of fs.readdirSync(d, { withFileTypes: true })) {
      if (["node_modules", "dist", ".git"].includes(item.name)) continue;
      const f = d + "/" + item.name;
      if (item.isDirectory()) walk(f);
      else if (/\.(html|mjs|js|json|txt|xml|webmanifest|yml)$/.test(item.name)) files.push(f);
    }
  };
  walk(ROOT);
  const bad = [];
  for (const f of files) {
    if (/\/(ar|bn|es|fr|hi|pt|ro|uz)\//.test(f)) continue; // the generated pages are rebuilt from the shells
    if (f.includes("apply-seo-parity") || f.includes("merge-social-i18n") || f.includes("fix-dead-hosts") || f.includes("fix-latest-goal-sync")) continue;
    const t = fs.readFileSync(f, "utf8");
    if (/ronaldostat1|ronaldostats1|ronaldostatdotcom|ronaldostatsdotcom|cdn\.ronaldoallgoals/.test(t)) bad.push(f.replace(ROOT + "/", ""));
  }
  console.log(bad.length ? "  ! still to fix: " + bad.join(", ") : "ok  no source file points at an old handle or the dead CDN");
}
