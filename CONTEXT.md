# CONTEXT.md — ronaldo-stats (for AI agents)

> **MANDATORY — READ THIS FILE BEFORE ANY EDIT. UPDATE IT AFTER EVERY EDIT.**
> Last updated 2026-10-19 — RonaldoStats, the Cristiano Ronaldo career-statistics site.

## Agent Protocol — LAW

1. **Before ANY edit** (code, data, pages, deploy, worker, docs, config): read this file fully. Do not re-discover what is documented here.
2. **After EVERY modification you commit**: append to `## Timeline` below. **Never rewrite history — append only, strictly chronological, no gaps.**
   - Format: `YYYY-MM-DD — <your name/model> — <commit SHA> — what/why — files changed — verification (build / verify / audit / tests)`
3. **File edits**: use Node `fs.readFileSync`/`writeFileSync` with `"utf8"`. **NEVER** use PowerShell `Set-Content` (it writes a BOM and mangles UTF-8 em dashes into mojibake). Verify afterwards that `charCodeAt(0) !== 0xFEFF` and there are no U+FFFD characters.
4. **Build gate**: `npm run build` must pass. `npm run verify` / `npm run audit` / `npm run audit:i18n` when touching data, pages or i18n.
5. **Data gate**: `npm run build:data` runs 20 assertions over `public/data/ronaldo-data.json`. It must print `0 CHECK(S) FAILED`.

This file is the A-to-Z. If you skip updating it, you break the next agent.

## What this is

Static **Cristiano Ronaldo** career-statistics site, **https://www.ronaldostats.site**.
Twelve pages in nine languages (en, es, pt, fr, ar, bn, hi, ro, uz). One JSON source of truth, no backend, no API keys, no third-party requests by default (the exceptions are the operator-installed Google tag and AdSense).

Live: **981 goals / 1,340 senior appearances** (835 club + 146 for Portugal), 261 assists,
184 penalties, 66 direct free kicks, 66 hat-tricks, 35 senior team trophies, 5 Ballons d'Or,
140 Champions League goals and 42 Champions League assists (both all-time records).

## Stack & commands

- Vite 6 multi-page (`vite.config.js` — 12 English inputs + 8 locales × 12 pages).
- `npm run dev` (5173) · `npm run build` · `npm run preview` (4173).
- `npm run build:data` — rebuild + re-verify `public/data/ronaldo-data.json` and `public/data/latest-goal.json`.
- `npm run build:i18n` — re-extract the shell strings and regenerate the eight localized page sets.
- `npm run build:bday` — rebuild the dated goal calendar.
- `npm run audit` (`scripts/dist-audit.cjs`) · `npm run audit:i18n` (`scripts/verify-all-i18n.cjs`).
- `npm run verify` — reads free public scoreboards and writes `public/data/last-check.json`. It **never** changes a total.

## File map

| File | Role |
|---|---|
| `public/data/ronaldo-data.json` | **THE source of truth.** Everything renders from this. |
| `public/data/messi.json` | The rival's comparison figures (the other half of the head-to-head pages). |
| `public/data/birthday-goals.json` | Every dated Ronaldo goal — the calendar behind the birthday / "on this day" explorer. |
| `public/data/latest-goal.json` | The five most recent goals, derived from the calendar. |
| `src/app.js` | The only renderer. Branches on `body[data-page]`. Reads the dictionaries through `DICT`. |
| `src/i18n/<lang>.js` | Per-language runtime dictionaries (12 exports each: HOME, BY_YEAR, BY_SEASON, DASH, TIMELINE, ACH, BDAY, LATEST_GOAL, ARG_STREAM, EXPLORE_LANGS, ERA_INTROS, CABINET). |
| `src/i18n/shell/<lang>.json` | Per-language page-shell copy: a flat map of English source string → translation. |
| `src/styles.css` | The design system. Identity tokens at the top. |
| `*.html` | The twelve English page shells. The localized pages are **generated** from them. |
| `<lang>/*.html` | Generated. Never hand-edit — edit the English shell and re-run `npm run build:i18n`. |
| `scripts/build-ronaldo-data.mjs` | Builds the dataset and runs the 20 assertions. |
| `scripts/extract-goal-calendar.mjs` → `scripts/build-birthday-goals.mjs` | Builds the dated goal calendar. |
| `scripts/extract-shell-strings.mjs` → `scripts/generate-i18n-pages.mjs` | The i18n pipeline. |
| `scripts/verify-all-i18n.cjs` | Imports every dictionary and compares it structurally with the English one. |
| `docs/content-spec.md` | The page-content contract: brand, routes, every canonical figure, the technical rules. |
| `docs/design/ronaldo-identity.md` | The identity tokens and the asset inventory. |

## Data model (`ronaldo-data.json`)

- `meta` — status, methodology, a nine-entry verification trail, the source list.
- `profile` — CR7, No. 7, born 5 February 1985 in Funchal, Madeira, 1.87 m, forward, Al Nassr.
- `totals` — `club{835/1106}`, `country{146/234}`, `combined{981/1340}`, `assists{261 official, 291 Transfermarkt, byTeam, records}`, `goalsPerGame 0.73`.
- `clubSeasons[]` — 27 rows. Each carries `league`, `cup`, `continental`, `other` as `[apps, goals]` plus the row totals. **The continental bucket is labelled per row**: Manchester United 2003/04, 2005/06 and 2022/23, and Sporting CP 2002/03, were **not** Champions League campaigns (UEFA Cup / Europa League) and are booked separately, so the Champions League total is 140 and not 143.
- `countryYears[]` — 24 rows for Portugal, with `competitive` and `friendly` splits.
- `byCompetition[]` — computed from the season rows, never hand-typed.
- `byFinish[]` — open play 731 / penalties 184 / free kicks 66. **PROVISIONAL.**
- `byBodyPart[]` — right 634 / left 186 / head 158 / other 3. **PROVISIONAL.**
- `trophies[]` — 35 senior team trophies (32 club + 3 Portugal) and 17 individual honours.
- `timeline[]` — 23 dated milestones. `calendarYears[]` — 25 rows, 2002–2026.
- `hatTricks` — 66. `splits` — the Messi's comparison halves.

## Iron rules

1. **Totals are computed from the rows**, never typed by hand. The four-way checksum (calendarYears = byCompetition = byFinish = byBodyPart = `totals.combined.goals` = 981) is asserted at build time.
2. After a data edit: run `npm run build:data` and read the assertion output. It must not fail.
3. Provisional splits always ship with a visible caveat.
4. Zero third-party requests by default (the operator's Google tag and AdSense are the only exceptions).
5. Free sources only: RSSSF, Wikipedia, UEFA, the Saudi Pro League, Transfermarkt. No paid feeds, no API keys.
6. Light editorial paper theme — sharp 2px/4px radii, hairline rules, no glassmorphism, no dark gradients. Nothing below 12px.
7. **Never hand-edit the generated `<lang>/` pages.** Edit the English shell, then `npm run build:i18n`.
8. **Never let a script rewrite hand-authored page copy.** Two such scripts existed in the source project and injected the rival's figures into Ronaldo's text; they were deleted. Page copy is authored, the numbers come from the JSON, and the i18n pipeline is the only thing that writes the localized pages.

## Data sources

| Source | What it provides |
|---|---|
| `https://www.rsssf.org/miscellaneous/cronaldo-intlg.html` | The authoritative Portugal appearance list — 234 caps, 146 goals, the per-year split and the competitive/friendly split. |
| `https://en.wikipedia.org/wiki/List_of_career_achievements_by_Cristiano_Ronaldo` | The club season table, the honours list and the records. |
| `https://en.wikipedia.org/wiki/List_of_international_goals_scored_by_Cristiano_Ronaldo` | Every international goal with its date and competition. |
| `https://www.uefa.com/uefanationsleague/news/023f-0e9797c3479b…` | The 234th cap (27 September 2026) and the Champions League assist record. |
| `https://www.spl.com.sa/…` | The Saudi Pro League's own goal announcements. |
| `https://ronaldostats.app` | Season-level cross-check. |

## Timeline — append only, no rewrite

- 2026-10-19 — claude-opus-4.8 (1M context) — scaffold — cloned the MessiStats structure into `D:\Projects\ronaldo-stats` under the brand RonaldoStats / `ronaldostats.site`; migrated every brand, URL, slug and file name; split the nine inline dictionaries out of `src/app.js` into `src/i18n/<lang>.js` (513 KB → 289 KB); rebuilt the dataset from RSSSF, Wikipedia, UEFA and the SPL (20/20 assertions pass: 981 goals / 1,340 appearances); built the dated goal calendar (974 of 981 goals dated, hat-tricks validate at exactly 66); rewrote all twelve English page shells, `src/app.js`, the identity tokens and the build chain; deleted the two scripts that injected the rival's figures into Ronaldo's copy. Files: whole repo. Verify: `npm run build` (108 pages), `npm run build:data` (20/20), `npm run audit:i18n` (8/8 runtime dictionaries structurally identical to English).

<!-- ADD NEW ENTRIES BELOW THIS LINE — DO NOT EDIT ABOVE -->

- 2026-10-20 — claude-opus-4.8 (1M context) — the full RonaldoStats build — cloned the MessiStats structure into `D:\Projects\ronaldo-stats` under the brand **RonaldoStats** / `ronaldostats.site`; migrated every brand, URL, slug and file name; split the nine inline dictionaries out of `src/app.js` into `src/i18n/<lang>.js` (513 KB → 289 KB) and the page-shell copy into `src/i18n/shell/<lang>.json`; rebuilt the dataset from RSSSF, Wikipedia, UEFA and the Saudi Pro League (20/20 assertions: 981 goals / 1,340 appearances, 835 club / 146 Portugal, 140 Champions League goals, 35 trophies, 66 hat-tricks); built the dated goal calendar (974 of 981 goals dated, the 66 hat-tricks it derives match the published total exactly) and cross-checked it against ESPN's public match summaries; rewrote all twelve English page shells, `src/app.js`, the identity tokens (79 sub-12px type sizes raised to the 12px floor) and the build chain; deleted the four scripts that rewrote hand-authored copy with the source project's text — two of them had injected the rival's figures into Ronaldo's pages. Files: whole repo. Verify: `npm run verify:all` (data 20/20, i18n 8/8 runtime + 8/8 shell dictionaries structurally identical to English, production build 108 pages, dist audit, zero untranslated English runs).

