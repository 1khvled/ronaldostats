# The photographs

The site ships one photograph per era, one per trophy card and one for the
head-to-head page. `scripts/install-photos.py` installs a picture into any of
those slots.

## How to install one

1. Put the file in the `photos/` folder at the repository root, named after the
   slot: `photos/era-2002-sporting.jpg`.
2. Run `python scripts/install-photos.py`.
3. Run `npm run build:i18n && npm run build`.

The picture is cropped to the slot, resized and written as WebP where the page
expects it. Nothing else has to change.

## The rights

The site publishes these pictures and takes advertising on them, so only
pictures that may be republished belong here: a picture you took, one your
club, agency or the player released for reuse, or one you licensed from a photo
library. A picture found in a search engine is licensed to whoever shot it -
Getty, Shutterstock, Alamy, AFP and Reuters all sell photographs rather than
give them away - and publishing one without a licence is copyright
infringement. That is why every file in `public/img` carries a licence line in
`public/img/CREDITS.md`.

## The slots

| Slot | Where it appears | What it should show |
|---|---|---|
| `era-2002-sporting` | timeline: the Sporting CP chapter; the debut milestone card | Ronaldo at Sporting CP, 2002-03 |
| `era-2004-manutd` | timeline: the Manchester United chapter; the 2003 signing card | Ronaldo in the United number 7 shirt, 2004-09 |
| `era-2008-ballon1` | timeline: the Ballon d'Or years chapter; the 2008 Ballon d'Or card; the achievements Ballon d'Or card | Ronaldo in 2008, the year of his first Ballon d'Or |
| `era-2009-real` | timeline: the Real Madrid chapter; the 2009 signing card; the achievements Champions League card | Ronaldo in the Real Madrid number 7 shirt, 2009-18 |
| `era-2013-ballon3` | timeline: the Ballon d'Or years chapter; the 2013 hat-trick card; the achievements FIFA Club World Cup card | Ronaldo in the Portugal number 7 shirt, 2013 |
| `era-2014-ballon4` | the Real Madrid page | Ronaldo in the Real Madrid shirt, the season of the tenth European Cup |
| `era-2016-ballon5` | timeline: the Ballon d'Or years chapter; the 2016 Euro card | Ronaldo with the 2016 Ballon d'Or |
| `era-2017-ucl` | the Champions League page | Ronaldo in the Champions League, 2017 |
| `era-2018-juve` | timeline: the Juventus chapter; the Juventus signing card | Ronaldo in the Juventus shirt, 2018-19 |
| `era-2021-manutd` | timeline: the second Manchester United spell; the 2021 return card | Ronaldo in the United shirt, 2021-22 |
| `era-2023-alnassr` | timeline: the Al Nassr chapter; the 2023 captaincy card | Ronaldo in the Al Nassr number 7 shirt |
| `era-2026-record` | timeline: the record book; the goal 981 card | Ronaldo in the Portugal number 7 shirt at the 2026 World Cup |
| `cab-copa` | timeline: the European Championship chapter | Ronaldo in the Portugal number 7 shirt, 2016 |
| `cab-liga` | achievements: the La Liga card | Ronaldo in the Real Madrid number 7 shirt |
| `cab-wc` | achievements: the World Cup card | Ronaldo in the Portugal number 7 shirt at the 2018 World Cup |
| `cab-ballon` | trophies: the Ballon d'Or card | Ronaldo holding the Ballon d'Or trophy |
| `cab-ucl` | trophies: the Champions League card | Ronaldo holding the Champions League trophy |
| `cab-cwc` | trophies: the Club World Cup card | Ronaldo and Real Madrid celebrating the FIFA Club World Cup |
| `ronaldo-vs-messi` | the head-to-head page | Ronaldo and Messi together |

The product photographs on the shop page are not in this list: they come from
the listings themselves, and `npm run fetch:gear` refreshes them.

## The shapes

- The era photographs are 1200 x 675 (16:9).
- The trophy cards are 800 x 600 (4:3).
- The head-to-head photograph is 1107 x 800.

A picture of any shape works: it is cropped to fill the frame, centred
horizontally and weighted to the top third, which keeps a player's face in
the picture.
