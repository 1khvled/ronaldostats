import fs from "node:fs";
const P = "D:/Projects/ronaldo-stats/scripts/build-sitemap.mjs";
let t = fs.readFileSync(P, "utf8").replace(/\r\n/g, "\n");
const before = t;

// ---------------------------------------------------------------------------
// The sitemap still described the Messi project: it named photographs that do
// not exist (era-2011-wembley.webp, era-2021-psg-signing.webp and six more),
// and it put Messi's copy in the titles and captions that search engines read.
// Every image below is a photograph of Ronaldo that the site actually ships.
// ---------------------------------------------------------------------------

// 1. the home page
t = t.replace(
  /    <image:image>\n      <image:loc>https:\/\/www\.ronaldostats\.site\/img\/ronaldo\.jpg<\/image:loc>\n      <image:title>[\s\S]*?<\/image:image>/,
  `    <image:image>
      <image:loc>https://www.ronaldostats.site/img/ronaldo.jpg</image:loc>
      <image:title>Cristiano Ronaldo, RonaldoStats</image:title>
      <image:caption>Cristiano Ronaldo, the captain of Portugal, in the RonaldoStats career archive.</image:caption>
    </image:image>`
);

// 2. the timeline
t = t.replace(/  timeline: `    <image:image>[\s\S]*?<\/image:image>`,\n  achievements:/,
  `  timeline: \`    <image:image>
      <image:loc>https://www.ronaldostats.site/img/era/era-2002-sporting.webp</image:loc>
      <image:title>Cristiano Ronaldo at the Sporting CP Museum (2002)</image:title>
      <image:caption>The Sporting CP museum in Lisbon, with the number 28 shirt from Ronaldo's debut season.</image:caption>
      <image:geo_location>Lisbon, Portugal</image:geo_location>
    </image:image>
    <image:image>
      <image:loc>https://www.ronaldostats.site/img/era/era-2004-manutd.webp</image:loc>
      <image:title>Cristiano Ronaldo in the Manchester United number 7 shirt (2004)</image:title>
      <image:caption>Ronaldo in the Manchester United number 7 shirt against Chelsea.</image:caption>
      <image:geo_location>Manchester, England</image:geo_location>
    </image:image>
    <image:image>
      <image:loc>https://www.ronaldostats.site/img/era/era-2009-real.webp</image:loc>
      <image:title>Cristiano Ronaldo at Real Madrid (2009)</image:title>
      <image:caption>Kaka and Ronaldo celebrating together for Real Madrid.</image:caption>
      <image:geo_location>Madrid, Spain</image:geo_location>
    </image:image>
    <image:image>
      <image:loc>https://www.ronaldostats.site/img/era/era-2017-ucl.webp</image:loc>
      <image:title>Cristiano Ronaldo and the UEFA Champions League (2017)</image:title>
      <image:caption>Ronaldo with the Champions League trophy in Madrid.</image:caption>
      <image:geo_location>Madrid, Spain</image:geo_location>
    </image:image>
    <image:image>
      <image:loc>https://www.ronaldostats.site/img/era/era-2018-juve.webp</image:loc>
      <image:title>Cristiano Ronaldo in the Juventus shirt (2018)</image:title>
      <image:caption>Ronaldo in the Juventus shirt during his Serie A title season.</image:caption>
      <image:geo_location>Turin, Italy</image:geo_location>
    </image:image>
    <image:image>
      <image:loc>https://www.ronaldostats.site/img/era/era-2023-alnassr.webp</image:loc>
      <image:title>Cristiano Ronaldo in the Al Nassr number 7 shirt (2023)</image:title>
      <image:caption>Ronaldo in the Al Nassr number 7 shirt.</image:caption>
      <image:geo_location>Riyadh, Saudi Arabia</image:geo_location>
    </image:image>
    <image:image>
      <image:loc>https://www.ronaldostats.site/img/era/era-2026-record.webp</image:loc>
      <image:title>Cristiano Ronaldo in the Portugal number 7 shirt (2026)</image:title>
      <image:caption>Ronaldo in the Portugal number 7 shirt at the 2026 World Cup.</image:caption>
      <image:geo_location>United States</image:geo_location>
    </image:image>\`,
  achievements:`);

// 3. the achievements cabinet
t = t.replace(/  achievements: `    <image:image>[\s\S]*?<\/image:image>`,\n  birthday:/,
  `  achievements: \`    <image:image>
      <image:loc>https://www.ronaldostats.site/img/cab-ballon-2026.webp</image:loc>
      <image:title>Cristiano Ronaldo and his 5 Ballons d'Or</image:title>
      <image:caption>Ronaldo holding his Ballon d'Or, the first Portuguese player to win the award.</image:caption>
      <image:geo_location>Paris, France</image:geo_location>
    </image:image>
    <image:image>
      <image:loc>https://www.ronaldostats.site/img/cab-ucl-2026.webp</image:loc>
      <image:title>Cristiano Ronaldo and the UEFA Champions League</image:title>
      <image:caption>The European Cup and the Champions League trophies Ronaldo won.</image:caption>
      <image:geo_location>Madrid, Spain</image:geo_location>
    </image:image>
    <image:image>
      <image:loc>https://www.ronaldostats.site/img/cab-liga.webp</image:loc>
      <image:title>Cristiano Ronaldo in the Real Madrid number 7 shirt</image:title>
      <image:caption>Ronaldo in the Real Madrid number 7 shirt, the club where he won two La Liga titles.</image:caption>
      <image:geo_location>Madrid, Spain</image:geo_location>
    </image:image>
    <image:image>
      <image:loc>https://www.ronaldostats.site/img/cab-wc.webp</image:loc>
      <image:title>Cristiano Ronaldo in the Portugal shirt at the 2018 World Cup</image:title>
      <image:caption>Ronaldo in the Portugal shirt at the 2018 World Cup, where he scored four goals.</image:caption>
      <image:geo_location>Russia</image:geo_location>
    </image:image>
    <image:image>
      <image:loc>https://www.ronaldostats.site/img/cab-cwc-2026.webp</image:loc>
      <image:title>The FIFA Club World Cup trophies in the CR7 Museum</image:title>
      <image:caption>The Club World Cup Silver and Golden Ball trophies in Ronaldo's own museum in Madeira.</image:caption>
      <image:geo_location>Funchal, Madeira, Portugal</image:geo_location>
    </image:image>\`,
  birthday:`);

// 4. the birthday explorer
t = t.replace(/<image:geo_location>Miami, Florida, United States \/ Barcelona, Spain \/ Buenos Aires, Argentina<\/image:geo_location>/,
  "<image:geo_location>Lisbon, Portugal / Madrid, Spain / Riyadh, Saudi Arabia</image:geo_location>");

// 5. the Real Madrid page
t = t.replace(
  /  "real-madrid": `    <image:image>\n      <image:loc>https:\/\/www\.ronaldostats\.site\/img\/og-ronaldo\.jpg<\/image:loc>\n      <image:title>[\s\S]*?<\/image:image>`,\n  "ronaldo-vs-messi":/,
  `  "real-madrid": \`    <image:image>
      <image:loc>https://www.ronaldostats.site/img/og-ronaldo.jpg</image:loc>
      <image:title>Ronaldo at Real Madrid: 450 goals in 438 appearances</image:title>
      <image:caption>Ronaldo's nine years at Real Madrid: 450 goals, 311 in La Liga, five European crowns and 18 goals in El Clasico.</image:caption>
    </image:image>\`,
  "ronaldo-vs-messi":`
);

// 6. the head-to-head page
t = t.replace(
  /  "ronaldo-vs-messi": `    <image:image>\n      <image:loc>https:\/\/www\.ronaldostats\.site\/img\/og-ronaldo\.jpg<\/image:loc>\n      <image:title>[\s\S]*?<\/image:image>`,\n  "champions-league":/,
  `  "ronaldo-vs-messi": \`    <image:image>
      <image:loc>https://www.ronaldostats.site/img/ronaldo-vs-messi.webp</image:loc>
      <image:title>Cristiano Ronaldo vs Lionel Messi: the career comparison</image:title>
      <image:caption>Goals, assists, trophies, hat-tricks and Ballons d'Or: the verified career comparison of Cristiano Ronaldo and Lionel Messi.</image:caption>
    </image:image>\`,
  "champions-league":`
);

// 7. the Champions League page
t = t.replace(
  /  "champions-league": `    <image:image>\n      <image:loc>https:\/\/www\.ronaldostats\.site\/img\/era-2011-wembley\.webp<\/image:loc>\n      <image:title>[\s\S]*?<\/image:image>`,\n  "latest-goal":/,
  `  "champions-league": \`    <image:image>
      <image:loc>https://www.ronaldostats.site/img/era/era-2017-ucl.webp</image:loc>
      <image:title>Cristiano Ronaldo and the UEFA Champions League</image:title>
      <image:caption>Ronaldo's Champions League record: 140 goals in 173 appearances and five European crowns.</image:caption>
    </image:image>\`,
  "latest-goal":`
);

// 8. the latest goal: the venue is the one the match was played in
t = t.replace(/<image:geo_location>Miami, Florida, United States<\/image:geo_location>/,
  "<image:geo_location>${(LG?.venue || \"Riyadh, Saudi Arabia\").replace(/&/g, \"&amp;\")}</image:geo_location>");

// 10. the fallback team
t = t.replace(/const LG_TEAM = \(LG\?\.team \|\| "Inter Miami CF"\)/, 'const LG_TEAM = (LG?.team || "Al Nassr")');

fs.writeFileSync(P, t.replace(/\n/g, "\r\n"), "utf8");
console.log(before === t ? "  (nothing changed)" : "ok  build-sitemap.mjs now describes Ronaldo and only the photographs the site ships");
const left = [...t.matchAll(/image:loc>https:\/\/www\.ronaldostats\.site\/img\/([^<]+)</g)].map((m) => m[1]);
console.log("   the images it names: " + left.join(", "));
