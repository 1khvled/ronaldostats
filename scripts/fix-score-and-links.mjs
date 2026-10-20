import fs from "node:fs";
const ROOT = "D:/Projects/ronaldo-stats/";

// --- 1. the scoreline format ------------------------------------------------
{
  const P = ROOT + "scripts/build-birthday-goals.mjs";
  let t = fs.readFileSync(P, "utf8");
  const before = t;
  const helper = `// The open export writes the scoreline zero-padded ("3:02" for 3-2).
// Normalise it to the same shape the source archive uses ("3-2").
const fixScore = (s) => {
  const t = String(s || "").trim();
  let m = t.match(/^(\\d{1,2})[-:](\\d{2})$/);
  if (m) return m[1] + "\\u2013" + String(Number(m[2]));
  m = t.match(/^(\\d{1,2})[-:](\\d{1})$/);
  if (m) return m[1] + "\\u2013" + m[2];
  return t;
};

`;
  if (!t.includes("const fixScore =")) {
    const anchor = "const MONTHS = [";
    t = t.replace(anchor, helper + anchor);
    // apply it wherever a score is read from the open export
    t = t.replace(/score: g\.score \|\| ""/g, 'score: fixScore(g.score || "")');
    t = t.replace(/score: g\.score,/g, 'score: fixScore(g.score),');
    t = t.replace(/score: c\.score,/g, 'score: fixScore(c.score),');
    fs.writeFileSync(P, t, "utf8");
    console.log("ok  build-birthday-goals.mjs normalises the scoreline");
  } else {
    console.log("ok  build-birthday-goals.mjs already normalises the scoreline");
  }
  if (t === before) console.log("(no change)");
}

// --- 2. every goal gets a link into the archive -----------------------------
{
  const P = ROOT + "scripts/merge-goal-source.mjs";
  let t = fs.readFileSync(P, "utf8");
  const before = t;
  const find = `    sourcePage: rec.sourcePage || null,`;
  const replace = `    sourcePage: rec.sourcePage || ("https://cr7allgoals.com/?opponent=" + encodeURIComponent(rec.opponent) + "&year=" + rec.date.slice(0, 4)),`;
  if (!t.includes(find)) { console.error("merge anchor not found"); process.exit(1); }
  t = t.replace(find, replace);
  // the archive search link works for every goal, matched or not
  t = t.replace(
    `        sourceLink.href = v.sourcePage || "https://cr7allgoals.com/";`,
    `        sourceLink.href = v.sourcePage || "https://cr7allgoals.com/";`
  );
  fs.writeFileSync(P, t, "utf8");
  console.log("ok  merge-goal-source.mjs gives every goal an archive link");
  if (t === before) console.log("(no change)");
}
