import fs from "node:fs";
import path from "node:path";
const ROOT = "D:/Projects/ronaldo-stats/";
const TMP = "C:/Users/Abdelli/AppData/Local/Temp/opencode/";

// every pick, in the order the cards appear
const FINAL = {
  "era-2002-sporting.webp": "C.Ronaldo at Museum Mundo Sporting.JPG",
  "era-2004-manutd.webp": "Cristiano Ronaldo.jpg",
  "era-2008-ballon1.webp": "Cristiano Ronaldo of Manchester United, November 5, 2008.jpg",
  "era-2009-real.webp": "Kaka and Cristiano Ronaldo of Real Madrid, August 29, 2009.jpg",
  "era-2013-ballon3.webp": "C. Ronaldo - Ballon d'Or 2014.jpg",
  "era-2014-ballon4.webp": "Cristiano Ronaldo - Ballon d'Or.jpg",
  "era-2016-ballon5.webp": "1 cristiano ronaldo 2016.jpg",
  "era-2017-ucl.webp": "Cristiano Ronaldo (35480124482).jpg",
  "era-2018-juve.webp": "Cristiano-ronaldo-juventus-2019.jpg",
  "era-2021-manutd.webp": "Cristiano Ronaldo vs Everton 2021.jpg",
  "era-2023-alnassr.webp": "Cristiano Ronaldo with Al Nassr, 19 September 2023 - 09.jpg",
  "era-2026-record.webp": "Cristiano Ronaldo Iran vs Portugal.jpg",
};

// gather the metadata from every list the picks came from
const meta = new Map();
const collect = (obj) => {
  if (!obj) return;
  if (Array.isArray(obj)) { for (const o of obj) collect(o); return; }
  if (typeof obj !== "object") return;
  if (obj.title && obj.licence) meta.set(obj.title.replace(/^File:\s*/, ""), obj);
  for (const v of Object.values(obj)) if (v && typeof v === "object") collect(v);
};
for (const f of ["era-credits.json", "cand/candidates.json", "cand/candidates2.json", "cand/sporting.json"]) {
  const p = TMP + f;
  if (fs.existsSync(p)) collect(JSON.parse(fs.readFileSync(p, "utf8")));
}

// the two whose title changed between passes: look them up again
const H = { "User-Agent": "RonaldoStats/1.0 (https://www.ronaldostats.site; build script)" };
for (const title of Object.values(FINAL)) {
  if (meta.has(title)) continue;
  const url = "https://commons.wikimedia.org/w/api.php?action=query&titles=" +
    encodeURIComponent("File:" + title) + "&prop=imageinfo&iiprop=url|extmetadata&format=json&origin=*";
  const j = await (await fetch(url, { headers: H })).json();
  const p = Object.values(j.query.pages)[0];
  const ii = (p.imageinfo || [])[0];
  if (!ii) { console.log("  no metadata for " + title); continue; }
  const em = ii.extmetadata || {};
  meta.set(title, {
    title: "File:" + title,
    page: "https://commons.wikimedia.org/wiki/" + encodeURIComponent(("File:" + title).replace(/ /g, "_")),
    author: ((em.Artist && em.Artist.value) || "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim().slice(0, 90),
    licence: (em.LicenseShortName && em.LicenseShortName.value) || "",
    licenceUrl: ((em.LicenseUrl && em.LicenseUrl.value) || "").trim(),
    credit: ((em.Credit && em.Credit.value) || "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim().slice(0, 120),
  });
}

// ---------------------------------------------------------------------------
// rewrite the era section of CREDITS.md
// ---------------------------------------------------------------------------
const P = path.join(ROOT, "public/img/CREDITS.md");
let t = fs.readFileSync(P, "utf8");

// drop the blocks written earlier
t = t.replace(/\n### `public\/img\/era\/[^`]+`\n\n(?:- \*\*[^\n]*\n)+/g, "\n");

const blocks = Object.entries(FINAL).map(([file, title]) => {
  const c = meta.get(title);
  if (!c) return "";
  return `
### \`public/img/era/${file}\`

- **Source file page:** [${title}](${c.page})
- **Author / photographer:** ${c.author || "see the file page"}
- **Credit:** ${c.credit || "see the file page"}
- **Licence:** ${c.licence}${c.licenceUrl ? " (" + c.licenceUrl + ")" : ""}
`;
}).join("");

const marker = "\n---\n";
const i = t.indexOf(marker);
t = t.slice(0, i) + blocks + t.slice(i);
fs.writeFileSync(P, t, "utf8");
console.log("ok  CREDITS.md: " + Object.keys(FINAL).length + " career photographs are credited");
const missing = Object.values(FINAL).filter((x) => !meta.has(x));
if (missing.length) console.log("  still missing: " + missing.join(", "));
