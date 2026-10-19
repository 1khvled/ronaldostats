# Translation brief — the five long strings

The page-shell dictionaries are complete except for **five** strings that the
extractor only picked up after its length limit was raised: three long
paragraphs, the long profile summary and the long keywords list.

For your language, add exactly these five keys to
`src/i18n/shell/<LANG>.json`, translated, and nothing else. Keep the file's
existing key order for the keys already in it; the five new keys may be
appended at the end.

The five source strings (English):

1. `Al Nassr made him captain in January 2023, and with his 197th cap he became the most-capped player in men's international football. Al Nassr gave him a new stage at 37, and the goals kept coming: 35 in a single Saudi league season, a record 35, the 800th club goal, the 100th for Al Nassr, the 900th of his career, and a league title in his fifth season there. At 41 he is still the most-capped player in the sport and the only man to have played in five different top-flight leagues on four continents.`

2. `Because the two careers distribute their output differently. Ronaldo leads on total goals (981 to 936), penalties (184 to 109), hat-tricks (66 to 62) and Champions League goals (140 to 129); Messi leads on assists (408 to 261), goal contributions (1,344 to 1,242), trophies (46 to 35) and goals per game (0.79 to 0.73). Both have passed 1,000 senior appearances, and both have been the best player in the world for a period of years — the difference is that Ronaldo's peak arrived in the Champions League and Messi's in the league.`

3. `RonaldoStats is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com. As an Amazon Associate I earn from qualifying purchases made through the links on this site.`

4. `Cristiano Ronaldo dos Santos Aveiro, born 5 February 1985 in Funchal, Madeira. 981 goals in 1,340 senior appearances: 835 for Sporting CP, Manchester United, Real Madrid, Juventus and Al Nassr, and 146 in 234 caps for Portugal. 261 assists, 184 penalties, 66 hat-tricks, 35 senior team trophies and 5 Ballons d'Or. 140 Champions League goals — the all-time record.`

5. `ronaldo vs messi, ronaldo vs messi stats, ronaldo vs messi free kicks, ronaldo vs messi penalties, ronaldo vs messi goals, ronaldo vs messi head to head, messi vs ronaldo goals, messi vs ronaldo stats, ronaldo and messi goals, ronaldo messi comparison, ronaldo messi career goals, messi ronaldo all time goals, ronaldo messi comparison, messi ronaldo comparison, ronaldo messi head to head goals`

Rules:
- **#5 is a keywords meta tag.** Translate the *phrases* naturally, but keep
  the search intent: it must still contain "ronaldo" and "messi" as plain
  Latin letters, because that is what people type. Keep the same number of
  comma-separated phrases and the same leading/trailing structure.
- **#3 is a legal affiliate disclosure.** Translate it faithfully — it names
  the "Amazon Services LLC Associates Program" and "Amazon.com" as they are.
- Keep every number, every date, every proper noun and every HTML entity
  exactly as they are.
- Keep the tone: factual, dry, editorial.
- Write the file as UTF-8 with no BOM, using Node `fs.readFileSync` /
  `writeFileSync` with `"utf8"`. NEVER use PowerShell `Set-Content`.

Verify afterwards: the file parses as JSON, has exactly the English key set
plus nothing else, contains no U+FFFD, and has no BOM.
