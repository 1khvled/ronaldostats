import fs from "node:fs";
import path from "node:path";
const ROOT = "D:/Projects/ronaldo-stats/";

// ---------------------------------------------------------------------------
// 1. one more string, in every language
// ---------------------------------------------------------------------------
const NOTE = {
  en: "This goal appears in an all-goals compilation. Use the archive link to find its exact position.",
  es: "Este gol aparece en una compilación de todos los goles. Usa el enlace del archivo para encontrar su posición exacta.",
  pt: "Este golo aparece numa compilação de todos os golos. Use o link do arquivo para encontrar a posição exata.",
  fr: "Ce but figure dans une compilation de tous les buts. Utilisez le lien de l'archive pour trouver sa position exacte.",
};
{
  const dir = path.join(ROOT, "src", "i18n");
  for (const [lang, text] of Object.entries(NOTE)) {
    const f = path.join(dir, lang + ".js");
    let t = fs.readFileSync(f, "utf8");
    if (t.includes("compilationNote:")) { console.log(lang + ": already has compilationNote"); continue; }
    const re = /(\n\s*"compilationLabel":)/;
    if (!re.test(t)) { console.error(lang + ": no compilationLabel to anchor on"); continue; }
    t = t.replace(re, '\n    "compilationNote": ' + JSON.stringify(text) + ',$1');
    fs.writeFileSync(f, t, "utf8");
    console.log(lang + ": compilationNote added");
  }
}

// ---------------------------------------------------------------------------
// 2. app.js
// ---------------------------------------------------------------------------
{
  const P = path.join(ROOT, "src", "app.js");
  let t = fs.readFileSync(P, "utf8");
  const EOL = t.includes("\r\n") ? "\r\n" : "\n";

  // 2a. the player: a compilation is a real video too, so say so under it
  const find = `  const mediaHtml = (v) => {
    const url = v && v.videoUrl ? String(v.videoUrl) : "";
    if (!url) return "";
    const id = youtubeId(url);
    if (id) {
      return '<div class="bday-media-frame"><iframe src="https://www.youtube-nocookie.com/embed/' + id +
        '" title="Ronaldo goal" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen' +
        ' referrerpolicy="strict-origin-when-cross-origin" style="width:100%;aspect-ratio:16/9;border:0;background:#000;display:block;"></iframe></div>';
    }
    if (/\\.(mp4|webm)(\\?|$)/i.test(url)) {
      return '<video controls playsinline webkit-playsinline preload="metadata" src="' + url +
        '" style="width:100%;aspect-ratio:16/9;background:#000;display:block;"></video>';
    }
    return "";
  };`.split("\n").join(EOL);
  const replace = `  const isEmbeddable = (url) => {
    const u = String(url || "");
    if (!u) return false;
    if (youtubeId(u)) return true;
    return /\\.(mp4|webm)(\\?|$)/i.test(u);
  };
  const mediaHtml = (v) => {
    const url = v && v.videoUrl ? String(v.videoUrl) : "";
    if (!url) return "";
    const id = youtubeId(url);
    // A compilation is a real video with the goal inside it: play it and say
    // so, instead of pretending the goal itself is on screen.
    const note = v.kind === "compilation"
      ? '<p class="bday-media-note">' + (MEDIA.compilationNote || "") + '</p>'
      : "";
    if (id) {
      return '<div class="bday-media-frame"><iframe src="https://www.youtube-nocookie.com/embed/' + id +
        '" title="Ronaldo goal" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen' +
        ' referrerpolicy="strict-origin-when-cross-origin" style="width:100%;aspect-ratio:16/9;border:0;background:#000;display:block;"></iframe></div>' + note;
    }
    if (/\\.(mp4|webm)(\\?|$)/i.test(url)) {
      return '<video controls playsinline webkit-playsinline preload="metadata" src="' + url +
        '" style="width:100%;aspect-ratio:16/9;background:#000;display:block;"></video>' + note;
    }
    return "";
  };`.split("\n").join(EOL);
  if (!t.includes(find)) { console.error("mediaHtml not found"); process.exit(1); }
  t = t.replace(find, replace);

  // 2b. the per-goal row: play it whenever it can be played
  const rowFind = `            const watch = (v.videoUrl && v.kind === "clip")
              ? \`<button type="button" class="bday-goal-watch" data-idx="\${matchIdx}" data-gidx="\${gi}">\${MEDIA.watchGoal || "▶ Watch this goal"}</button>\`
              : \`<a class="bday-goal-watch" href="\${watchUrl}" target="_blank" rel="noopener noreferrer">\${MEDIA.watchGoal || "▶ Watch this goal"}</a>\`;`.split("\n").join(EOL);
  const rowReplace = `            // Play it when it can be played: an embeddable clip opens the
            // player, a clip on the publisher's own site opens there, and a
            // goal with no published video opens a search for the footage.
            const watch = isEmbeddable(v.videoUrl)
              ? \`<button type="button" class="bday-goal-watch" data-idx="\${matchIdx}" data-gidx="\${gi}">\${MEDIA.watchGoal || "▶ Watch this goal"}</button>\`
              : v.videoUrl
                ? \`<a class="bday-goal-watch" href="\${v.videoUrl}" target="_blank" rel="noopener noreferrer">\${MEDIA.watchGoal || "▶ Watch this goal"}</a>\`
                : \`<a class="bday-goal-watch" href="\${watchUrl}" target="_blank" rel="noopener noreferrer">\${MEDIA.watchGoal || "▶ Watch this goal"}</a>\`;`.split("\n").join(EOL);
  if (!t.includes(rowFind)) { console.error("the goal row not found"); process.exit(1); }
  t = t.replace(rowFind, rowReplace);

  fs.writeFileSync(P, t, "utf8");
  console.log("ok  app.js: every goal plays when it can be played");
}

// ---------------------------------------------------------------------------
// 3. the note under the player
// ---------------------------------------------------------------------------
{
  const P = path.join(ROOT, "src", "styles.css");
  let css = fs.readFileSync(P, "utf8");
  if (!css.includes(".bday-media-note")) {
    css += `
/* ---------- birthday: the note under a compilation ---------- */
.bday-media-note {
  margin: 10px 0 0;
  padding: 9px 12px;
  font-size: 0.84rem;
  line-height: 1.5;
  color: var(--muted);
  background: var(--brand-soft);
  border-left: 3px solid var(--brand);
  border-radius: 0 8px 8px 0;
}
`;
    fs.writeFileSync(P, css, "utf8");
    console.log("ok  styles.css: the compilation note");
  } else console.log("ok  styles.css: the compilation note is already there");
}
