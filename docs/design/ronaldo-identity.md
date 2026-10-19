# RonaldoStats — Identity & Design System Spec

**Applies to:** `ronaldostats.site` (Cristiano Ronaldo career-statistics archive)
**Derived from:** the Messi editorial-paper theme in `src/styles.css` — same geometry,
same typography, same flat-print feel. **Only the colour identity changes.**
**Target:** `https://www.ronaldostats.site`

The site is a statistical archive. It must read like **printed matter**: flat
paper ground, hairline rules, hard offset "stamp" shadows, tabular figures,
colour used *only* where it encodes data. No blur, no glass, no glow.

---

## 1. The CSS variable block (copy-paste ready)

Replace the `:root` and `[data-theme="dark"]` blocks in `src/styles.css` with the
following. Everything else (geometry, radii, shadows, fonts) is unchanged.

```css
/* RonaldoStats identity tokens: deep Portugal red primary, Real Madrid navy
   secondary, Portugal green for country data, gold reserved for records.
   GEOMETRY IS DELIBERATELY SHARP — 2px/4px radii, hairline rules, no ambient
   shadow blur. This is a statistical archive, so it reads like printed matter.
   Body text on white stays >= 4.5:1; fonts self-hosted. */
:root {
  --bg-1: #f2f3f0;
  --bg-2: #f2f3f0;
  --bg-3: #e9ebe6;
  --surface: #ffffff;
  --card: #ffffff;
  --surface-solid: #f4f5f2;
  --line: #d3d6ce;
  --line-soft: #e2e5dd;
  --ink: #10130f;
  --ink-soft: #363c33;
  --muted: #5c6357;
  --faint: #676e61;            /* was #767d70 — now AA on paper (4.74:1) */
  --brand: #b31217;            /* deep Portugal red */
  --brand-ink: #8c0e12;
  --brand-soft: #f7e3e2;
  --navy: #122a5e;             /* Real Madrid navy */
  --hero-grad: linear-gradient(112deg, #046a38 6%, #13295c 50%, #b31217 94%);
  --accent: #0e7a4f;           /* Portugal green — country / progression data */
  --accent-soft: #e1f0e9;
  --gold: #8a6300;             /* records — text-safe on paper */
  --gold-soft: #f7eecb;
  --gold-bright: #f2ce6b;      /* records ON brand/navy fills, and the CR7 "7" */
  --pink: #a61e63;             /* free kicks */
  --sky: #0e6fa8;              /* secondary dataset / away */
  --bar-1: #e2a0a0;            /* low-value bar fill (tint of --bar-2) */
  --bar-2: #b31217;            /* peak / current bar fill */
  /* Sharp archive geometry. Pills only where a pill is semantically right. */
  --radius: 3px;
  --radius-lg: 4px;
  --radius-pill: 2px;
  /* Depth comes from a 1px hairline + one hard offset stamp, never a soft blur. */
  --shadow: 2px 2px 0 var(--line);
  --shadow-sm: 1px 1px 0 var(--line);
  --hairline: 1px solid var(--line);
  --rule: 2px solid var(--ink);
  --rail-w: 76px;
  --rail-open: 248px;
  --font-body: "DM Sans", system-ui, -apple-system, "Segoe UI", sans-serif;
  --font-head: "Plus Jakarta Sans", "DM Sans", system-ui, sans-serif;
  --bday-tier-0: #eceee9;
  --bday-tier-0-ink: #8a9184;
  --bday-tier-1: #d9e6ef;
  --bday-tier-1-ink: #14425e;
  --bday-tier-2: #8fbed9;
  --bday-tier-2-ink: #0b3247;
  --bday-tier-3: #2b7fae;
  --bday-tier-3-ink: #ffffff;
  --bday-tier-4: #c98a08;
  --bday-tier-4-ink: #1e1300;
}

/* Dark theme is TRUE NEUTRAL BLACK — no navy/blue cast on any surface.
   Colour is reserved for data + accents only (brand red, gold, green, pink). */
[data-theme="dark"] {
  color-scheme: dark;
  --bg-1: #000000;
  --bg-2: #0a0a0a;
  --bg-3: #121212;
  --surface: #0d0d0d;
  --card: #121212;
  --surface-solid: #1a1a1a;
  --line: #2b2b2b;
  --line-soft: #1f1f1f;
  --ink: #f2f2f0;
  --ink-soft: #d2d2ce;
  --muted: #9d9d97;
  --faint: #83837c;
  --brand: #f2666b;
  --brand-ink: #ff9a9d;
  --brand-soft: rgba(242, 102, 107, 0.14);
  --navy: #26262a;             /* neutral — deliberately NOT blue in dark mode */
  --accent: #3fbf8c;
  --accent-soft: rgba(63, 191, 140, 0.14);
  --gold: #e8b93a;
  --gold-soft: rgba(232, 185, 58, 0.14);
  --gold-bright: #f2ce6b;
  --pink: #f58bbe;
  --sky: #6fb6dd;
  --bar-1: #6e2a2c;
  --bar-2: #f2666b;
  --shadow: 2px 2px 0 #000;
  --shadow-sm: 1px 1px 0 #000;
  --hairline: 1px solid var(--line);
  --rule: 2px solid var(--ink);
  --bday-tier-0: #161616;
  --bday-tier-0-ink: #4a4a45;
  --bday-tier-1: #1c4a66;
  --bday-tier-1-ink: #cfe6f4;
  --bday-tier-2: #2b7fae;
  --bday-tier-2-ink: #ffffff;
  --bday-tier-3: #5cb3e8;
  --bday-tier-3-ink: #04202e;
  --bday-tier-4: #e8b93a;
  --bday-tier-4-ink: #241a00;
}
```

> **One deliberate change from the Messi theme:** `--faint` moves from `#767d70`
> to `#676e61` (light theme). `#767d70` measures **3.82:1** on `--bg-1` and is
> used for real text (table headers at 12.16px, photo credits), so it fails
> WCAG AA. `#676e61` measures **4.74:1** on paper and **5.28:1** on white.
> The dark-theme `--faint` (`#83837c`) already passes at 5.50:1 on black.

---

## 2. What each colour means

| Token | Hex | Meaning it encodes | Contrast vs intended bg |
|---|---|---|---|
| `--brand` | `#b31217` | **Portugal red.** Club-goal aggregate, primary CTA, links, the CR7 "7" plate, the default bar fill. | 6.96:1 on white · 6.25:1 on paper · **white on it 6.96:1** |
| `--brand-ink` | `#8c0e12` | Brand colour for **text** on paper/white (link hover, `.tp-count` chip text, `.record .num`). | 9.60:1 on white · 8.62:1 on paper · 7.79:1 on `--brand-soft` |
| `--brand-soft` | `#f7e3e2` | Wash behind brand chips/badges. Never text background with white text. | brand on it 5.65:1 |
| `--navy` | `#122a5e` | **Real Madrid navy.** Real-Madrid club goals, the cumulative line on charts, the active rail item. | 13.83:1 on white · white on it 13.83:1 |
| `--hero-grad` | `linear-gradient(112deg,#046a38 6%,#13295c 50%,#b31217 94%)` | The heritage tri-colour: Portugal green → Madrid navy → Portugal red. Used only on the rail badge / hero band. | white on it: 6.72:1 (green) · 14.01:1 (navy) · 6.96:1 (red) |
| `--accent` | `#0e7a4f` | **Portugal green.** Country / international goals, assists, progression, "verified/live" state. | 5.36:1 on white · 4.82:1 on paper · white on it 5.36:1 |
| `--accent-soft` | `#e1f0e9` | Wash behind green chips. | accent on it 4.56:1 |
| `--gold` | `#8a6300` | **Records.** Milestones, all-time records, Ballons d'Or, "world record" rules. Text-safe on paper. | 5.43:1 on white · 4.88:1 on paper · 4.67:1 on `--gold-soft` |
| `--gold-soft` | `#f7eecb` | Wash behind record chips. | — |
| `--gold-bright` | `#f2ce6b` | Records **on** dark/brand fills (the "7" in the logo mark, the gold rule on `--brand`). | 4.58:1 on `--brand` · 9.10:1 on `--navy` |
| `--pink` | `#a61e63` | **Free kicks.** Second goal-type series. | 7.03:1 on white · 6.31:1 on paper |
| `--sky` | `#0e6fa8` | **Penalties.** Third goal-type series / secondary dataset. | 5.44:1 on white |
| `--bar-1` | `#e2a0a0` | Non-peak bar fill (tint of `--bar-2`). | graphic only |
| `--bar-2` | `#b31217` | Peak / current-season bar fill. | graphic only |

Dark-theme counterparts: `--brand #f2666b` (6.89:1 on black), `--brand-ink #ff9a9d`
(10.36:1), `--accent #3fbf8c` (9.04:1), `--gold #e8b93a` (11.43:1), `--pink #f58bbe`
(9.32:1), `--sky #6fb6dd` (9.41:1), `--ink #f2f2f0` (18.73:1), `--muted #9d9d97` (7.70:1).

### Neutral tokens (unchanged from the Messi theme — keep them)
`--ink #10130f` (16.80:1 on paper) · `--ink-soft #363c33` · `--muted #5c6357`
(5.58:1 on paper) · `--faint #676e61` (4.74:1 on paper) · `--line #d3d6ce` ·
`--line-soft #e2e5dd` · `--bg-1 #f2f3f0` · `--bg-3 #e9ebe6` · `--surface #ffffff`.

---

## 3. Semantic colour assignments for the data-visualisation code

Use **exactly** these. Do not invent per-chart colours; a reader must be able to
learn "gold = record" once and apply it everywhere.

### Bar / column charts (`svg.spark .bar`, `.hbar-fill`)
| Series | Token | Hex |
|---|---|---|
| Default / current bar | `--bar-2` | `#b31217` |
| Non-peak / historical bar | `--bar-1` | `#e2a0a0` |
| Peak bar (season record) | `--bar-2` + `--gold-bright` 2px top rule | `#b31217` / `#f2ce6b` |
| Cumulative-goal line | `--navy` | `#122a5e` |
| Thousand-goal reference rule | `--gold` | `#8a6300` (dashed 1.5px) |
| Country / international series | `--accent` | `#0e7a4f` |

### Donut / segmented arcs (`svg.donut circle`) — goal-type split
| Segment | Meaning | Token | Hex |
|---|---|---|---|
| 1 | Open play | `--brand` | `#b31217` |
| 2 | Penalties | `--sky` | `#0e6fa8` |
| 3 | Free kicks | `--pink` | `#a61e63` |
| 4 | Headers | `--navy` | `#122a5e` |
| 5 | Own goals / other | `--accent` | `#0e7a4f` |

### Categorical ramp — goals by club (5 steps, fixed order)
`--brand #b31217` → `--navy #122a5e` → `--accent #0e7a4f` → `--gold #8a6300` → `--sky #0e6fa8`
Assign in this order: Real Madrid, Manchester United, Juventus, Sporting CP, Al Nassr.
Country (Portugal) always uses `--accent` and is never part of the club ramp.

### KPI / stat-tile accents
| KPI | Accent | Token |
|---|---|---|
| Career goals (headline KPI) | brand red | `--brand` |
| Club goals | navy | `--navy` |
| Country goals | green | `--accent` |
| Assists | green | `--accent` |
| Penalties | sky | `--sky` |
| Free kicks | pink | `--pink` |
| Records / trophies / Ballons d'Or | gold | `--gold` |
| Any "record" hairline rule | gold | `--gold` (3px solid on the OG/era cards) |

---

## 4. Typography (unchanged, but the floor is binding)

- Body / reading paragraphs: **15–16px**, DM Sans, `--ink` or `--muted`.
- Data rows, table cells, `.hbar-row`, legend rows: **≥ 14px**.
- Metadata, captions, `.photo-credit`, table column headers: **≥ 12px**.
- Chips, buttons, badges: **≥ 13px**.
- Headings: Plus Jakarta Sans, `--font-head`, `letter-spacing: -0.015em`.
- All figures: `font-variant-numeric: tabular-nums` (`.tnum`, `td`, `.kpi-value`,
  `.trophy-value`, `.num`).

**Hard floor: no `font-size` below 12px anywhere, ever.**

> ⚠️ **Action required by the `src/styles.css` owner.** The inherited theme
> currently violates its own floor in ~147 rules. Worst offenders that must be
> raised: `0.66rem` (`.photo-credit`, 10.6px), `0.65rem`, `0.63rem`, `0.62rem`,
> `0.6rem` (`.club-badge`, `.rail nav a span`), `0.68rem`, `0.72rem`. Anything
> that is genuine iconography (`.club-badge` monogram) may stay small, but any
> real text must be lifted to ≥ 12px.

---

## 5. Geometry & depth (unchanged — do not touch)

- Radii: `--radius: 3px`, `--radius-lg: 4px`, `--radius-pill: 2px`.
  (Some legacy components use larger radii — 9/10/14/16/24px — for chrome; keep
  them as-is, they are not part of the data surface.)
- Depth: `--shadow: 2px 2px 0 var(--line)`, `--shadow-sm: 1px 1px 0 var(--line)`.
  Hard offset only.
- Rules: `--hairline: 1px solid var(--line)`, `--rule: 2px solid var(--ink)`.

---

## 6. DO NOT

1. **No glassmorphism.** No `backdrop-filter`, no `blur()`, no translucent
   overlapping panels that read as frosted glass. The paper is opaque.
2. **No dark gradients / neon.** No purple-blue "AI product" gradients, no
   glow, no `text-shadow` on data, no `box-shadow` with a blur radius.
   The one sanctioned gradient is `--hero-grad` (flat brand gradient on the
   rail badge / hero band only).
3. **No navy cast in dark mode.** Dark surfaces are true neutral black
   (`#000000` / `#0d0d0d` / `#121212` / `#1a1a1a`). `--navy` in dark mode is
   `#26262a` — neutral, never blue.
4. **No tiny type.** Nothing below 12px. No `text-[10px]` / `text-[11px]` /
   `0.6rem` / `0.66rem` for real text.
5. **No colour for decoration.** Brand/gold/green/pink/sky are reserved for
   encoded data. Never colour a heading, a divider, or a hover state "just
   because". If a colour carries no meaning, it stays ink or line grey.
6. **No gradients on data marks.** Bars, donuts and sparklines use flat fills.
7. **No rounded-blob charts.** Bars/donuts inherit the 3px radius discipline;
   donut segments are flat, not glossy.
8. **No trademarked marks.** No club crests, no league logos, no kit-manufacturer
   logos, no federation badges — including in image assets. Use the original
   geometric monograms in `public/img/teams/`.
9. **No drop shadows on flat artwork.** Assets use hairline outlines and hard
   offsets, matching `--shadow`.

---

## 7. Asset inventory produced with this spec

| Path | Purpose |
|---|---|
| `public/img/logo-ronaldo.svg` | Primary mark (512 viewBox, glyph outlines embedded) |
| `public/img/logo-ronaldo-wordmark.svg` | Horizontal lockup, mark + RONALDOSTATS |
| `public/img/logo.png` / `logo-192.png` | Mark raster, transparent |
| `public/img/favicon.svg` / `favicon.ico` (16/32/48) / `favicon-48x48.png` / `favicon-96x96.png` | Tab + small icons (shield mark) |
| `public/img/favicon-192x192.png` / `favicon-512x512.png` / `apple-touch-icon.png` | PWA/app icons (brand-red tile, maskable-safe) |
| `public/img/site.webmanifest` | PWA manifest (points at the icons above) |
| `public/img/og-ronaldo.jpg` | 1200×630 Open Graph card |
| `public/img/ronaldo-450.webp` | 450×600 hero crop (preloaded for LCP) |
| `public/img/ronaldo.jpg` | 533×800 JPEG derivative of the source portrait |
| `public/img/ronaldo-vs-messi.webp` | 1107×800 rivalry header (derived from `messi-vs-ronaldo.webp`) |
| `public/img/teams/*.png` | 7 original geometric team monograms, 256×256 RGBA |
| `public/img/era/*.webp` | 12 typographic era cards, 1200×675 |
| `public/img/gear/*.jpg` | 8 generic product mockups, 800×800 |

> **Wiring note (for the HTML owner):** the site root still serves
> `public/favicon.ico`, `public/favicon.svg`, `public/favicon-*.png`,
> `public/apple-touch-icon.png` and `public/site.webmanifest`. Those are the
> Messi-theme files and are **outside the asset lane's write scope** — copy the
> new files over them, or repoint the `<link>` tags to `/img/...`.
