# Translation brief — RonaldoStats page shells

You are translating the **page shell** copy of RonaldoStats
(https://www.ronaldostats.site) — a career-statistics site for Cristiano
Ronaldo. The English source of truth is `src/i18n/shell/en.json`.

## The file format

`src/i18n/shell/en.json` maps every translatable string found in the twelve
English page shells to a record:

```json
"Career goals": { "count": 3, "pages": ["index", "dashboard"], "ctx": "… [Career goals] …" }
```

- `count` — how many times the string appears on the site.
- `pages` — which pages it appears on.
- `ctx` — the surrounding text, so you can tell whether the string is a whole
  sentence or a fragment cut out of one by an inline element.

## The one rule

**Your output must have exactly the same keys as the source.** The generator
(`scripts/generate-i18n-pages.mjs`) looks every string up in your file and
substitutes it; a missing key leaves English on the page.

Write `src/i18n/shell/<LANG>.json` as a **flat map**:

```json
{ "Career goals": "Goles de carrera", "…": "…" }
```

Every key from `en.json` must be present, with a translated value.

## Fragments

Many strings are fragments — the shell wraps part of a sentence in `<b>` or
`<a>`, and the text node on either side becomes its own entry:

- `"Career Goals &amp; Efficiency"` → one entry
- `": Ronaldo has 981 goals in 1,340 senior games (0.73 per game); Messi has…"` → another

Use `ctx` to work out how the fragment reads in the sentence, and translate
it so it still fits grammatically in that position. Keep the leading or
trailing punctuation and spacing the fragment has (for example a fragment that
starts with `", won the"` keeps its comma). If a fragment begins or ends with
a space, keep it.

## What to keep verbatim

- Numbers, dates, units and the decimal point.
- HTML entities: `&mdash;`, `&ndash;`, `&rarr;`, `&amp;`, `&quot;`.
- `<b>`, `<a href="...">`, `<br>` and any other tag inside a value — and the
  href itself, which is a route, not copy.
- Proper nouns: Cristiano Ronaldo (or the local spelling your language's
  press uses), CR7, Ballon d'Or, Real Madrid, Manchester United, Juventus,
  Al Nassr, Sporting CP, Portugal, La Liga, Premier League, Serie A,
  Saudi Pro League, UEFA Champions League (or the conventional local name).
- Route fragments inside an href.

## What to translate

Everything else: the headings, the sentences, the labels, the table
captions, the aria-labels, the alt text, the meta descriptions and keywords.

Keep the editorial tone of the source: a statistical archive, factual and
dry. Where the source compares Ronaldo and Messi, keep it a comparison of
figures rather than a claim about who is better.

## Output

Write exactly one file: `src/i18n/shell/<LANG>.json`.

Do not touch any other file in the repository — other agents are working in
the same tree right now.

## Method

1. Read `src/i18n/shell/en.json` in full.
2. Write `src/i18n/shell/<LANG>.json` — UTF-8, no BOM, every key present.
   Use Node `fs.readFileSync` / `writeFileSync` with `"utf8"`. NEVER use
   PowerShell `Set-Content` (it writes a BOM and mangles the em dashes).
3. Verify, with a Node script you write to
   `C:/Users/Abdelli/AppData/Local/Temp/opencode/`:
   - it parses as JSON;
   - its key set is **identical** to the source's — no missing keys, no extra
     keys (report any difference);
   - no value contains U+FFFD and the file has no BOM;
   - every value that should have been translated contains at least one
     character that is not an ASCII letter or digit — list the values you
     deliberately left identical (proper nouns, numbers, tags) and say why;
   - a scan for whole English clauses longer than six words — each hit must
     be a deliberate decision you can justify.
4. Fix anything that fails and re-run until it passes.

## Report

Under 25 lines: the file, the key-parity result, the values left in English
and why, and the verification results.
