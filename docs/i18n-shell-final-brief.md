# Final translation pass — the last few strings

Each language dictionary is complete except for a handful of strings listed in
`src/i18n/shell/<LANG>.missing.json` (and a few now-obsolete keys listed in
the "extra" report below).

Your job:

1. Read `D:\Projects\ronaldo-stats\src\i18n\shell\en.json` — the English
   source of truth.
2. Read `D:\Projects\ronaldo-stats\src\i18n\shell\<LANG>.missing.json` — the
   exact keys you must add.
3. Read `D:\Projects\ronaldo-stats\src\i18n\shell\<LANG>.json` — the file to
   extend.
4. For every key in the missing list, add a translation, using the same
   rules as the rest of the file (keep the numbers, the dates, the proper
   nouns, the HTML entities and the tags; translate the prose; keep the
   editorial tone).
5. Delete the keys listed as "extra" in the report below — they no longer
   exist in the English source.
6. Write the file back as UTF-8 with no BOM, using Node
   `fs.readFileSync` / `writeFileSync` with `"utf8"`. NEVER use PowerShell
   `Set-Content`.

Afterwards the file must have exactly the same key set as `en.json` — the
same keys, in the same order, with the five/six newest keys appended at the
end.

Verify: the file parses as JSON, the key set matches `en.json` exactly (no
missing, no extra), there is no U+FFFD and no BOM.
