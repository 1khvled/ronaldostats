import fs from "node:fs";
const ROOT = "D:/Projects/ronaldo-stats/";

// --- 1. the finish type on every video entry -------------------------------
{
  const P = ROOT + "scripts/merge-goal-source.mjs";
  let t = fs.readFileSync(P, "utf8");
  const before = t;
  t = t.replace(
    `    kind: pick ? pick.kind : null,
    publisher: pick ? pick.publisher : null,`,
    `    kind: pick ? pick.kind : null,
    publisher: pick ? pick.publisher : null,
    finish: rec.type || "",
    type: rec.type || "",`
  );
  if (t === before) { console.error("merge patch failed"); process.exit(1); }
  fs.writeFileSync(P, t, "utf8");
  console.log("ok  merge-goal-source.mjs writes the finish type");
}

// --- 2. the styles for the new elements ------------------------------------
{
  const P = ROOT + "src/styles.css";
  let css = fs.readFileSync(P, "utf8");
  const before = css;
  const block = `
/* ================= birthday: sourced goal media ================= */
.bday-media-slot { margin: 0 0 12px; }
.bday-media-slot[hidden] { display: none; }
.bday-media-frame {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #000;
  overflow: hidden;
  border: 1px solid var(--line);
}
.bday-media-frame iframe,
.bday-media-frame video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
}
.bday-inline-noclip {
  margin: 0;
  padding: 14px 16px;
  font-size: 0.86rem;
  color: var(--muted);
  background: var(--surface-solid);
  border: 1px solid var(--line);
}
.video-modal-links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}
.video-modal-links .btn { font-size: 0.84rem; }
.video-modal-source {
  margin: 10px 0 0;
  font-size: 0.76rem;
  line-height: 1.5;
  color: var(--faint);
  border-top: 1px solid var(--line-soft);
  padding-top: 10px;
}
.video-modal-source a { color: var(--brand); }
.bday-source-note { margin-top: 10px; }
.bday-source-note-text {
  display: block;
  font-size: 0.78rem;
  line-height: 1.55;
  color: var(--faint);
}
.bday-source-note a { color: var(--brand); }
`;
  if (!css.includes(".bday-media-slot")) {
    css = css.replace(/\s*$/, "") + "\n" + block;
    fs.writeFileSync(P, css, "utf8");
    console.log("ok  styles.css: birthday media styles added");
  } else {
    console.log("ok  styles.css already has the media styles");
  }
  if (css === before) console.log("(no change)");
}
