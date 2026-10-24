import fs from "node:fs";
import path from "node:path";
const ROOT = "D:/Projects/ronaldo-stats/";

// ---------------------------------------------------------------------------
// 1. the dictionary string for the season video
// ---------------------------------------------------------------------------
const NOTE = {
  en: "Every goal Ronaldo scored in the {season} season.",
  es: "Todos los goles que marcó Ronaldo en la temporada {season}.",
  pt: "Todos os gols que o Ronaldo marcou na temporada {season}.",
  fr: "Tous les buts de Ronaldo lors de la saison {season}.",
};
{
  const dir = path.join(ROOT, "src", "i18n");
  for (const [lang, text] of Object.entries(NOTE)) {
    const f = path.join(dir, lang + ".js");
    let t = fs.readFileSync(f, "utf8");
    if (t.includes("seasonNote:")) { console.log(lang + ": already has seasonNote"); continue; }
    const re = /(\n\s*"compilationNote":)/;
    if (!re.test(t)) { console.error(lang + ": no compilationNote to anchor on"); continue; }
    t = t.replace(re, '\n    "seasonNote": ' + JSON.stringify(text) + ',$1');
    fs.writeFileSync(f, t, "utf8");
    console.log(lang + ": seasonNote added");
  }
}

// ---------------------------------------------------------------------------
// 2. app.js: play the Dailymotion clips and the season videos
// ---------------------------------------------------------------------------
{
  const P = path.join(ROOT, "src", "app.js");
  let t = fs.readFileSync(P, "utf8");
  const EOL = t.includes("\r\n") ? "\r\n" : "\n";

  const find = `  const youtubeId = (url) => {
    const m = String(url || "").match(/(?:youtube\\.com\\/(?:watch\\?v=|embed\\/|live\\/|shorts\\/)|youtu\\.be\\/)([A-Za-z0-9_-]{6,})/);
    return m ? m[1] : null;
  };`.split("\n").join(EOL);

  const replace = `  const youtubeId = (url) => {
    const m = String(url || "").match(/(?:youtube\\.com\\/(?:watch\\?v=|embed\\/|live\\/|shorts\\/)|youtu\\.be\\/)([A-Za-z0-9_-]{6,})/);
    return m ? m[1] : null;
  };
  // ronaldo7.net publishes some of the per-goal clips on Dailymotion
  const dailymotionId = (url) => {
    const m = String(url || "").match(/dailymotion\\.com\\/(?:embed\\/video\\/)?(x[a-z0-9]+)/i);
    return m ? m[1] : null;
  };`.split("\n").join(EOL);

  if (!t.includes(find)) { console.error("youtubeId not found"); process.exit(1); }
  t = t.replace(find, replace);

  const find2 = `  const isEmbeddable = (url) => {
    const u = String(url || "");
    if (!u) return false;
    if (youtubeId(u)) return true;
    return /\\.(mp4|webm)(\\?|$)/i.test(u);
  };`.split("\n").join(EOL);

  const replace2 = `  const isEmbeddable = (url) => {
    const u = String(url || "");
    if (!u) return false;
    if (youtubeId(u)) return true;
    if (dailymotionId(u)) return true;
    return /\\.(mp4|webm)(\\?|$)/i.test(u);
  };`.split("\n").join(EOL);

  if (!t.includes(find2)) { console.error("isEmbeddable not found"); process.exit(1); }
  t = t.replace(find2, replace2);

  // the player itself
  const find3 = `    const id = youtubeId(url);
    // A compilation is a real video with the goal inside it: play it and say
    // so, instead of pretending the goal itself is on screen.
    const note = v.kind === "compilation"
      ? '<p class="bday-media-note">' + (MEDIA.compilationNote || "") + '</p>'
      : "";`.split("\n").join(EOL);

  const replace3 = `    const id = youtubeId(url);
    const dmId = dailymotionId(url);
    // A compilation is a real video with the goal inside it, and a season
    // video holds every goal of that season: play it and say so, instead of
    // pretending the goal itself is on screen.
    let note = "";
    if (v.kind === "season") {
      note = '<p class="bday-media-note">' + String(MEDIA.seasonNote || "").replace("{season}", v.seasonLabel || "") + '</p>';
    } else if (v.kind === "compilation") {
      note = '<p class="bday-media-note">' + (MEDIA.compilationNote || "") + '</p>';
    }
    if (v.description) {
      note += '<p class="bday-media-desc">' + esc(v.description) + '</p>';
    }`.split("\n").join(EOL);

  if (!t.includes(find3)) { console.error("the media note block not found"); process.exit(1); }
  t = t.replace(find3, replace3);

  const find4 = `    if (/\\.(mp4|webm)(\\?|$)/i.test(url)) {
      return '<video controls playsinline webkit-playsinline preload="metadata" src="' + url +
        '" style="width:100%;aspect-ratio:16/9;background:#000;display:block;"></video>' + note;
    }
    return "";`.split("\n").join(EOL);

  const replace4 = `    if (dmId) {
      const src = v.embedUrl || ("https://www.dailymotion.com/embed/video/" + dmId);
      return '<div class="bday-media-frame"><iframe src="' + esc(src) +
        '" title="Ronaldo goal" loading="lazy" allow="autoplay; fullscreen" allowfullscreen' +
        ' referrerpolicy="strict-origin-when-cross-origin" style="width:100%;aspect-ratio:16/9;border:0;background:#000;display:block;"></iframe></div>' + note;
    }
    if (/\\.(mp4|webm)(\\?|$)/i.test(url)) {
      return '<video controls playsinline webkit-playsinline preload="metadata" src="' + url +
        '" style="width:100%;aspect-ratio:16/9;background:#000;display:block;"></video>' + note;
    }
    return "";`.split("\n").join(EOL);

  if (!t.includes(find4)) { console.error("the video branch not found"); process.exit(1); }
  t = t.replace(find4, replace4);

  fs.writeFileSync(P, t, "utf8");
  console.log("ok  app.js: the player handles Dailymotion, season videos and the goal description");
}

// ---------------------------------------------------------------------------
// 3. the styles for the new note and the description
// ---------------------------------------------------------------------------
{
  const P = path.join(ROOT, "src", "styles.css");
  let css = fs.readFileSync(P, "utf8");
  if (!css.includes(".bday-media-desc")) {
    css += `
/* ---------- birthday: the goal's own description ---------- */
.bday-media-desc {
  margin: 8px 0 0;
  font-size: 0.88rem;
  line-height: 1.55;
  color: var(--ink-soft);
  font-style: italic;
}
`;
    fs.writeFileSync(P, css, "utf8");
    console.log("ok  styles.css: the description style");
  } else console.log("ok  styles.css: the description style is already there");
}
