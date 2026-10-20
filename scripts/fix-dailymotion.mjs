import fs from "node:fs";
import path from "node:path";
const ROOT = "D:/Projects/ronaldo-stats/";

// ---------------------------------------------------------------------------
// 1. Dailymotion serves "Forbidden" inside an iframe, so those clips cannot
//    be embedded: they open on dailymotion.com instead, like the Manchester
//    United clips already do.
// ---------------------------------------------------------------------------
{
  const P = path.join(ROOT, "src", "app.js");
  let t = fs.readFileSync(P, "utf8");
  const EOL = t.includes("\r\n") ? "\r\n" : "\n";

  const find = `  const isEmbeddable = (url) => {
    const u = String(url || "");
    if (!u) return false;
    if (youtubeId(u)) return true;
    if (dailymotionId(u)) return true;
    return /\\.(mp4|webm)(\\?|$)/i.test(u);
  };`.split("\n").join(EOL);
  const replace = `  const isEmbeddable = (url) => {
    const u = String(url || "");
    if (!u) return false;
    if (youtubeId(u)) return true;
    // Dailymotion refuses to be framed — it answers an embed with
    // "Forbidden" — so those clips open on dailymotion.com instead.
    if (dailymotionId(u)) return false;
    return /\\.(mp4|webm)(\\?|$)/i.test(u);
  };`.split("\n").join(EOL);
  if (!t.includes(find)) { console.error("isEmbeddable not found"); process.exit(1); }
  t = t.replace(find, replace);

  // the player must not try to frame a Dailymotion video either
  const find2 = `    if (dmId) {
      const src = v.embedUrl || ("https://www.dailymotion.com/embed/video/" + dmId);
      return '<div class="bday-media-frame"><iframe src="' + esc(src) +
        '" title="Ronaldo goal" loading="lazy" allow="autoplay; fullscreen" allowfullscreen' +
        ' referrerpolicy="strict-origin-when-cross-origin" style="width:100%;aspect-ratio:16/9;border:0;background:#000;display:block;"></iframe></div>' + note;
    }
`.split("\n").join(EOL);
  const replace2 = `    if (dmId) {
      // it cannot be framed: offer the page it plays on
      return '<p class="bday-media-note">' + esc(note.replace(/<[^>]+>/g, " ")) + '</p>';
    }
`.split("\n").join(EOL);
  if (t.includes(find2)) t = t.replace(find2, replace2);

  fs.writeFileSync(P, t, "utf8");
  console.log("ok  app.js: Dailymotion clips link out instead of being framed");
}

// ---------------------------------------------------------------------------
// 2. the publisher of a Dailymotion clip is Dailymotion, and the archive page
//    stays as the source
// ---------------------------------------------------------------------------
{
  const P = path.join(ROOT, "scripts", "merge-season-videos.mjs");
  let t = fs.readFileSync(P, "utf8");
  const find = `      slot.kind = "clip";
      slot.publisher = "ronaldo7.net";`;
  const replace = `      slot.kind = "clip";
      slot.publisher = g.provider === "dailymotion" ? "Dailymotion" : "ronaldo7.net";`;
  if (t.includes(find)) {
    t = t.replace(find, replace);
    fs.writeFileSync(P, t, "utf8");
    console.log("ok  merge-season-videos.mjs: a Dailymotion clip says Dailymotion");
  } else {
    console.log("ok  merge-season-videos.mjs: already right");
  }
}
