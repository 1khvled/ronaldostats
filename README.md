# ronaldo-stats

**RonaldoStats** — a static career-statistics archive for Cristiano Ronaldo.
**https://www.ronaldostats.site**

Twelve pages in nine languages, one JSON source of truth, no backend, no API
keys, no third-party requests by default.

Live figures: **981 goals in 1,340 senior appearances** — 835 club goals for
Sporting CP, Manchester United, Real Madrid, Juventus and Al Nassr, plus 146
in 234 caps for Portugal. 261 assists, 184 penalties, 66 direct free kicks,
66 hat-tricks, 35 senior team trophies, 5 Ballons d'Or, and the all-time
Champions League records of 140 goals and 42 assists.

## Run locally

```powershell
cd D:\Projects\ronaldo-stats
npm install
npm run dev          # http://localhost:5173/
```

Build check: `npm run build` then `npm run preview` (http://localhost:4173/).

## The pages

| Page | Route | What it does |
|---|---|---|
| Home | `/` | The headline totals, the profile card, the 27 club seasons, the road to 1,000 |
| Dashboard | `/dashboard` | Every chart, filterable by club, finish type, body part and competition |
| Goals by year | `/goalsbyyear` | 2002 → 2026 with the running career total and his age |
| Goals by season | `/goalsbyseason` | All 27 club seasons split by format, plus Portugal year by year |
| Timeline | `/timeline` | Seven eras, every dated milestone |
| Achievements | `/achievements` | The itemised honours list and the trophy cabinet |
| Birthday | `/birthday` | Every dated goal laid across the 366 calendar days |
| Latest goal | `/latest-goal` | The most recent goal, with its match record |
| Champions League | `/champions-league` | 140 goals, 183 appearances, 42 assists, 5 titles |
| Real Madrid years | `/real-madrid` | 18 goals against Barcelona across nine years at Real Madrid |
| Ronaldo vs Messi | `/ronaldo-vs-messi` | The full head-to-head, by the numbers |
| Gear | `/gear` | The merchandise store |

Every page exists in English, Spanish, Portuguese and French.

## The data rule (no mistakes)

- `public/data/ronaldo-data.json` is the **only** source of truth the pages
  render from. Every total in it is **computed from the rows**, never typed
  by hand, so the four-way checksum cannot drift:
  `calendarYears = byCompetition = byFinish = byBodyPart = totals.combined.goals`.
- `npm run build:data` rebuilds it and runs **20 assertions** — the career
  total, the per-club totals, the Champions League split, the trophy count —
  and refuses to write the file if any of them fail.
- The **provisional** splits — the finish-type split (open play 731 /
  penalties 184 / free kicks 66) and the body-part split (right foot 634 /
  left foot 186 / head 158 / other 3) — are published compiled tallies, and
  every page that shows them carries the caveat.
- `public/data/birthday-goals.json` holds **974 dated goals** (146 of them
  international, from RSSSF's appearance list) with the opponent, the
  competition, the score, the minute and the finish type. The 66 hat-tricks
  it derives match the published career total exactly.
- `public/data/messi.json` holds the rival's comparison figures only.

## Where the numbers come from

Free, public, named sources — no paid feeds, no keys, no logins:

- **RSSSF** — the authoritative Portugal appearance list: 234 caps, 146 goals,
  the per-year split and the competitive-versus-friendly split.
- **Wikipedia** — the club season table, the honours list, the records, and
  every international goal with its date.
- **UEFA** — the 234th cap (27 September 2026) and the Champions League
  assist record.
- **The Saudi Pro League** — its own goal announcements.
- **Transfermarkt / worldfootball.net** — the season-by-season cross-check.
- **cr7allgoals.com** — the per-goal archive behind the birthday explorer: every
  goal with its date, competition, scoreline, minute, finish and assist, plus
  the media that shows it. Its own list is Wikipedia's *List of senior career
  goals by Cristiano Ronaldo* (CC BY-SA 4.0, built on FBref's goal log) and its
  reviewed event data comes from StatsBomb open data. `npm run fetch:goals`
  refreshes the vendored, attributed snapshot in
  `public/data/ronaldo-goals.json`.

The verification trail lives in `meta.verification` inside the JSON.

## Internationalisation

The English page shells are the source of truth. The eight localized page sets
are **generated**:

```
src/i18n/<lang>.js        runtime dictionaries (12 exports each)
src/i18n/shell/<lang>.json  page-shell copy (English string -> translation)
```

```powershell
npm run build:i18n    # re-extract the strings and regenerate all 96 pages
npm run audit:i18n    # imports every dictionary and compares it with English
```

`scripts/verify-all-i18n.cjs` imports the modules and compares exports, key
order, value kinds and function arity against the English source, so a
missing or renamed key fails the audit rather than blanking a page.

## Deploy

The site builds to `dist/` and deploys as static assets.

- **Vercel** — `vercel.json` pins the build (`npm run build`), the output
  directory (`dist`), `cleanUrls` and the cache headers. No environment
  variables are required.
- **Cloudflare Workers** — the same `dist/` as static assets, with
  `worker/smart-check.js` running the cron. `wrangler.toml` ships with
  `REPLACE-WITH-D1-ID` until the database exists.

## Layout

```
public/data/      the source of truth
src/app.js        the renderer
src/i18n/         the nine languages
src/styles.css    the design system
scripts/          the build, data and audit pipeline
docs/             the content spec, the design spec, the briefs
```

`CONTEXT.md` is the agent protocol — read it before editing.
