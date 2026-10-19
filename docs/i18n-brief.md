# Translation brief — RonaldoStats dictionaries

You are translating the runtime dictionary of **RonaldoStats**
(https://www.ronaldostats.site), a career-statistics site for Cristiano
Ronaldo. The English source of truth is `src/i18n/en.js`.

## The one rule

**Translate the VALUES. Never touch the KEYS, the ORDER, the EXPORT NAMES or
the FUNCTION SIGNATURES.**

The renderer (`src/app.js`) reads these dictionaries by exact key name, and
the eight other languages are generated from the same shape. A missing or
renamed key is a runtime crash on that page.

Concretely, your output file must have:

- the same 12 `export const X = { ... };` statements, in the same order:
  `HOME`, `BY_YEAR`, `BY_SEASON`, `DASH`, `TIMELINE`, `ACH`, `BDAY`,
  `LATEST_GOAL`, `ARG_STREAM`, `EXPLORE_LANGS`, `ERA_INTROS`, `CABINET`;
- inside each dictionary, the same key names, in the same order, with the
  same value kinds (string vs function);
- for every function value, the same parameter names and the same number of
  parameters, and the same order of use.

Inside a value you may change the text freely. Keep:

- every HTML tag (`<b>`, `<a href="...">`, `<br>`) exactly as it is, including
  the href values (they are routes, not copy);
- every `${...}` interpolation and every backtick;
- every `&mdash;` / `&ndash;` / `&rarr;` entity;
- every number, and the decimal separator style of the source (the source
  uses `.` — keep `.`).

## Terminology

| Concept | Keep as |
|---|---|
| Cristiano Ronaldo | the name, in the local spelling used by your language's press |
| CR7 | CR7 (never translated) |
| Ballon d'Or | Ballon d'Or (never translated) |
| Champions League | UEFA Champions League, translated by convention in your language |
| Real Madrid, Manchester United, Juventus, Al Nassr, Sporting CP | keep the club's own name, as the local press writes it |
| Portugal | Portugal / the national team name in your language |
| hat-trick | the term your language uses (often a loanword — keep it if that is natural) |
| free kick, penalty, assist | the terms your language uses |

Numbers stay in Western digits. The renderer has a helper that renders
Bengali numerals for the `bn` locale; you supply the Western digits.

## Tone

Editorial statistical archive: confident, factual, dry. British English in
the source; write naturally in your language rather than translating word by
word. Keep the source's structure — a heading, a figure, a caveat.

Two things must survive translation:

1. **The provisional caveat.** Where the source says the finish-type split
   (open play 731 / penalties 184 / free kicks 66) or the body-part split
   (right foot 634 / left foot 186 / head 158 / other 3) is a compiled tally,
   the caveat must remain — those figures are provisional until a
   match-by-match hand count. Keep the sense of "provisional until a hand
   count".
2. **The factual tone.** The rivalry copy compares Ronaldo and Messi by
   numbers and lets the reader judge. Do not turn it into a claim that
   either player is "the best" — keep it a comparison of figures.

## Output

Write exactly one file: `src/i18n/<LANG>.js`.

Do not touch any other file in the repository. Other agents are working in
the same tree right now.

## Method

1. Read `src/i18n/en.js` in full.
2. Write `src/i18n/<LANG>.js` — a complete translation, UTF-8, no BOM.
   Use Node `fs.readFileSync` / `writeFileSync` with `"utf8"`. NEVER use
   PowerShell `Set-Content` (it writes a BOM and mangles the em dashes).
3. Verify, with a Node script you write to
   `C:/Users/Abdelli/AppData/Local/Temp/opencode/`:
   - the file parses as an ES module (`node --check` on a `.mjs` copy);
   - importing it and importing `src/i18n/en.js` and comparing gives the
     **same export names, the same key names in the same order, the same
     value kinds and the same function arity** for all 12 dictionaries —
     report any difference;
   - every string value that differs from the English one contains at least
     one character that is not a letter/digit (i.e. it really was
     translated) — list any value you deliberately left identical (proper
     nouns, numbers, route fragments) and say why;
   - no U+FFFD replacement characters and no BOM;
   - a grep for leftover English sentences in your file (a whole English
     clause longer than six words is a miss). Proper nouns are fine.
4. Fix anything that fails and re-run until it passes.

## Report

Under 30 lines: the file you wrote, the key-parity result, the values you
deliberately left in English and why, and the verification results.
