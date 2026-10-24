# RonaldoStats — content & technical spec for the page shells

Every page shell (`*.html` in the repo root) must be rewritten from the Messi
copy to Ronaldo copy. This document is the single source of truth for the
facts, the brand, the routes and the technical contract. Follow it exactly.

## 1. Brand

| Item | Value |
|---|---|
| Brand wordmark | `RonaldoStats` (markup `Ronaldo<span>Stats</span>`) |
| Domain | `https://www.ronaldostats.site` (canonical origin) |
| Site title suffix | `| RonaldoStats` |
| Description suffix | `The Verified Cristiano Ronaldo Statistics & Video Database` |
| X / Twitter handle | `@ronaldostat1` (placeholder — operator may change) |
| Telegram | `@ronaldostatdotcom` (placeholder) |
| Google tag | `G-FERBLJWWWZ` (keep as-is) |
| AdSense | `ca-pub-8397501846754760` (keep as-is) |

Language codes: `en es pt fr`. All four are LTR (`dir="ltr"`).

## 2. Routes

| Page slug | File | `data-page` | Notes |
|---|---|---|---|
| home | `index.html` | `home` | |
| dashboard | `dashboard.html` | `dashboard` | |
| goals by year | `goalsbyyear.html` | `byyear` | |
| goals by season | `goalsbyseason.html` | `byseason` | |
| timeline | `timeline.html` | `timeline` | |
| achievements | `achievements.html` | `achievements` | |
| birthday | `birthday.html` | `birthday` | Ronaldo's birthday is **5 February** |
| latest goal | `latest-goal.html` | `latest-goal` | |
| champions league | `champions-league.html` | `champions-league` | |
| gear | `gear.html` | `gear` | |
| Real Madrid years | `real-madrid.html` | `real-madrid` | |
| Ronaldo vs Messi | `ronaldo-vs-messi.html` | `vs-ronaldo` | the rivalry page. The slug is `ronaldo-vs-messi`, **never** `messi-vs-ronaldo` |

English URLs are `/<slug>`; localized are `/<lang>/<slug>`. The English pages
are also served at `/en/<slug>`.

## 3. Canonical Ronaldo facts — use these, never invent numbers

- Cristiano Ronaldo dos Santos Aveiro. CR7. Shirt number **7**. Born **5 February 1985** (age 41). Born Funchal, Madeira, Portugal. 1.87 m. Forward. Currently **Al Nassr** (Saudi Pro League).
- **981 goals in 1,340 senior appearances** (0.73 per game).
- Club: **835 goals in 1,106 appearances**. Portugal: **146 goals in 234 caps** (both all-time international records).
- Assists **261** (Transfermarkt criteria: 291). Goal contributions 1,242.
- **184 penalties** from 220 attempts (83.6% conversion). Non-penalty goals **797**.
- **66** direct free-kick goals. **66** hat-tricks.
- **35 senior team trophies** (32 club + 3 Portugal). Popular outlets say 36–37 because some over-count the UEFA Super Cup and domestic supercups — publish 35 and footnote it.
- **5 Ballons d'Or** (2008, 2013, 2014, 2016, 2017).
- Champions League: **140 goals** (all-time record), 183 appearances, **42 assists** (all-time record).
- League goals: La Liga **311**, Premier League **103**, Saudi Pro League **106**, Serie A **81**, Primeira Liga **3**.
- Clubs and spells: Sporting CP 2002–2003 (31 apps/5 goals) · Manchester United 2003–2009 and 2021–2022 (346/145) · Real Madrid 2009–2018 (438/450) · Juventus 2018–2022 (134/101) · Al Nassr 2023–present (157/134).
- Best calendar year **2013 = 69 goals** (59 club + 10 Portugal). Other peaks: 2012 = 63, 2014 = 61, 2011 = 60, 2015 = 57, 2016 = 55.
- Best club season by total goals: **2014/15 = 61 goals** for Real Madrid (48 in La Liga, 10 in the Champions League). **2011/12 = 60** (46 in La Liga) is the second — the season that broke the single-season record at the time and is still his La Liga benchmark. Other peaks: 55 (2012/13), 51 (2013/14), 50 (2023/24 with Al Nassr — a record 35 in one Saudi league season).
- Milestones: senior debut 14 Aug 2002 (Sporting CP) · 100th United goal 2008 · first Ballon d'Or 2008 · joins Real Madrid 2009 for €94m · La Décima 2014 · all-time Champions League top scorer 2015 · 500th career goal 30 Sep 2015 · 700th career goal 14 Oct 2019 · 1,000th senior appearance 22 Feb 2020 · passes Ali Daei 1 Sep 2021 · 900th career goal 5 Sep 2024 (first player to 900) · 800th club goal 26 May 2025 · 100th Al Nassr goal 23 Aug 2025 (first to 100 goals for four clubs) · 500th goal after turning 30 on 21 Feb 2026 · first man to score at six World Cups 23 Jun 2026 · 234th Portugal cap 27 Sep 2026 · last senior goal #981 on 12 Oct 2026.
- Portugal: debut 20 Aug 2003, first goal 12 Jun 2004 vs Greece, captain from 2007, **10 international hat-tricks** (world record), 6 World Cups (2006/2010/2014/2018/2022/2026), EURO 2016 winner, Nations League 2019 + 2025 winner.
- Individual honours: European Golden Shoe ×4 (2008, 2011, 2014, 2015) · FIFA World Player of the Year 2008 · FIFA Puskás Award 2009 · World Cup Golden Ball + Golden Boot 2008 · Euro Golden Boot 2020 · The Best FIFA Men's Player 2016, 2017 · UEFA Men's Player of the Year ×3 · UCL top scorer in 7 seasons · Pichichi (La Liga top scorer) ×3 · Premier League Golden Boot 2008 · Serie A capocannoniere 2021 · Saudi Pro League Golden Boot 2024, 2025 · FIFA FIFPro World XI 15 consecutive years (2007–2021) · UEFA Team of the Year 15 times.
- Head-to-head club meetings: **36** (Messi 16 wins, Ronaldo 11).

## 4. Rival comparison — Messi (from `public/data/messi.json`)

936 goals · 1,181 appearances · 408 assists · 109 penalties (149 attempts) ·
67 direct free kicks · 62 hat-tricks · 129 Champions League goals ·
40 Champions League assists · 125 international goals in 207 caps ·
21 World Cup goals · 46 senior team trophies · 8 Ballons d'Or ·
0.79 goals per game.

Who leads: Ronaldo total goals (+45), penalties (+75), hat-tricks (+4),
Champions League goals (+11), appearances (+159). Messi assists (+147),
trophies (+11), Ballons d'Or (+3), goals per game (+0.06), World Cup goals
(+10), non-penalty goals (+26 vs Ronaldo's 797), free kicks (+1).

## 5. Data source

`public/data/ronaldo-data.json` is the only source of truth. Read it before
writing any figure. It contains `profile`, `totals`, `clubSeasons` (27 rows),
`countryYears` (24 rows, team `Portugal`), `byCompetition`, `byFinish`,
`byBodyPart`, `trophies` (35 team + 17 individual rows), `timeline`,
`calendarYears` (25 rows, 2002–2026), `hatTricks`, `splits`.

Provisional splits — open play 731 / penalties 184 / free kicks 66, and the
body-part split (right foot 634 / left foot 186 / head 158 / other 3) — must
always carry a caveat in the visible copy ("provisional until a hand count").

## 6. Technical contract — do not break these

1. **Keep every mount point id exactly as it is** (`#lede`, `#kpis`, `#profile`,
   `#faq`, `#explore`, `#method`, `#foot-date`, …). The renderer in
   `src/app.js` writes into them by id. Renaming one silently blanks a section.
2. **Keep every CSS class name** the same. `src/styles.css` is unchanged.
3. **Keep the `<script>` tags**, including `src/app.js` with `type="module"`.
4. **Keep exactly one `<h1>` per page** and a sane heading hierarchy
   (H1 → H2 → H3). No level skips.
5. **Keep the `<html lang>` and `dir`** attributes (`dir="ltr"` for every supported language).
6. Canonical + hreflang: one canonical for the page, plus the full hreflang
   set (`en`, `en-US`, `en-NG`, `en-IN`, `en-PH`, `es`, `es-AR`, `es-ES`, `pt`,
   `pt-BR`, `pt-PT`, `fr`, `fr-FR`, `fr-CA`, `x-default`) pointing at
   `https://www.ronaldostats.site/<lang>/<slug>`.
7. **Write UTF-8 without BOM.** Use Node `fs.writeFileSync(path, text, "utf8")`.
   NEVER use PowerShell `Set-Content` (it writes a BOM and mangles em dashes
   into mojibake).
8. Keep the file's existing line-ending style.
9. Every image must have an `alt` attribute, and `width`/`height` on the
   `<img>` to prevent layout shift.
10. JSON-LD blocks must stay valid JSON. Use `SportsPerson` for Ronaldo
    (`@id` `https://www.ronaldostats.site/#ronaldo`, `name` "Cristiano
    Ronaldo", `alternateName` "CR7", `birthDate` "1985-02-05",
    `birthPlace` "Funchal, Madeira, Portugal", `height` "1.87 m",
    `position` "Forward", `nationality` "Portugal"), `Dataset` for the
    statistics, `WebPage`/`BreadcrumbList`, `FAQPage` where there is a FAQ,
    `VideoObject` on the goal pages.
11. Keep the Meta tag `meta name='impact-site-verification'` and the Google
    site-verification meta tags that are already in the head.
12. Do not add third-party scripts beyond the two that already exist (the
    Google tag and AdSense). No fonts from a CDN — the site self-hosts
    `/fonts/dm-sans-latin.woff2` and `/fonts/plus-jakarta-sans-latin.woff2`.

## 7. Editorial rules

- British English. Numbers formatted with thousands separators (`1,340`).
- Tone: an editorial statistical archive — confident, factual, dry. Never
  breathless. No emoji in the head, titles or JSON-LD.
- Every number in the copy must come from §3/§4 or the JSON. If a figure is
  not available, cut the sentence rather than inventing it.
- Do not call Ronaldo "the greatest of all time" as a flat claim; where the
  comparison with Messi appears, state both numbers and let the reader judge.
- The word "Ronaldo" is the subject throughout; "Messi" appears only in the
  rivalry context (`/ronaldo-vs-messi`) and in the head-to-head comparison
  rows on the home page.
