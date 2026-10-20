import fs from "node:fs";
const APP = "D:/Projects/ronaldo-stats/src/app.js";
let t = fs.readFileSync(APP, "utf8");
const before = t;
const EOL = t.includes("\r\n") ? "\r\n" : "\n";
/** Replace a block, matching the file's own line endings. */
function rep(find, replace) {
  const f = find.split("\n").join(EOL);
  const r = replace.split("\n").join(EOL);
  if (!t.includes(f)) return false;
  t = t.replace(f, r);
  return true;
}
const must = (label, ok) => { if (!ok) { console.error("FAILED: " + label); process.exit(1); } console.log("ok  " + label); };

// --- 1. the new element handles -------------------------------------------
must("element handles", rep(
  `  const vpillXg = el("vpill-xg");`,
  `  const vpillXg = el("vpill-xg");
  const mediaSlot = el("bday-media-slot");
  const sourceLink = el("video-source-link");
  const clipLink = el("video-clip-link");
  const sourceLine = el("video-modal-source");
  const noClipTitle = el("bday-noclip-title");
  const noClipBody = el("bday-noclip-body");`));

// --- 2. the media renderer -------------------------------------------------
must("media renderer", rep(
  `  const openGoalVideo = (match, initialIndex = 0) => {`,
  `  // The sourced archive links each goal to the media that shows it: an exact
  // clip, the match highlights, or the compilation the goal appears in. A
  // YouTube link is embedded; anything else is offered as a link out, because
  // the clip itself belongs to its rights holder.
  const MEDIA = DICT.BDAY_MEDIA || {};
  const youtubeId = (url) => {
    const m = String(url || "").match(/(?:youtube\\.com\\/(?:watch\\?v=|embed\\/|live\\/|shorts\\/)|youtu\\.be\\/)([A-Za-z0-9_-]{6,})/);
    return m ? m[1] : null;
  };
  const mediaHtml = (v) => {
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
  };

  const openGoalVideo = (match, initialIndex = 0) => {`));

// --- 3. fill the panel -----------------------------------------------------
must("media slot filled", rep(
  `      if (videoFallback) videoFallback.hidden = true;
      if (videoBigPlayBtn) videoBigPlayBtn.hidden = true;`,
  `      const mHtml = mediaHtml(v);
      if (mediaSlot) {
        mediaSlot.innerHTML = mHtml;
        mediaSlot.hidden = !mHtml;
      }
      if (videoFallback) videoFallback.hidden = !!mHtml;
      if (videoBigPlayBtn) videoBigPlayBtn.hidden = true;
      if (noClipTitle) noClipTitle.textContent = MEDIA.noClip || "";
      if (noClipBody) noClipBody.textContent = MEDIA.noClipBody || "";`));

// --- 4. the assist and finish pills ---------------------------------------
must("assist and finish pills", rep(
  `      if (vpillAssist) {
        if (v.assist) {
          vpillAssist.hidden = false;
          vpillAssist.textContent = \`Assist: \${v.assist}\`;
        } else {
          vpillAssist.hidden = true;
        }
      }
      if (vpillXg) {
        if (v.xg != null) {
          vpillXg.hidden = false;
          vpillXg.textContent = \`xG: \${v.xg}\`;
        } else {
          vpillXg.hidden = true;
        }
      }`,
  `      if (vpillAssist) {
        if (v.assist) {
          vpillAssist.hidden = false;
          vpillAssist.textContent = (MEDIA.assist || "Assist: {name}").replace("{name}", v.assist);
        } else {
          vpillAssist.hidden = true;
        }
      }
      if (vpillXg) {
        const finish = v.finish || (v.types && v.types[idx]) || "";
        if (finish) {
          vpillXg.hidden = false;
          vpillXg.textContent = (MEDIA.finish || "Finish: {type}").replace("{type}", finish);
        } else {
          vpillXg.hidden = true;
        }
      }`));

// --- 5. the links ----------------------------------------------------------
must("links wired", rep(
  `      if (videoYtLink) {
        videoYtLink.href = \`https://www.youtube.com/results?search_query=Cristiano+Ronaldo+goal+vs+\${encodeURIComponent(match.opponent)}+\${match.date}\`;
      }`,
  `      if (videoYtLink) {
        videoYtLink.href = \`https://www.youtube.com/results?search_query=Cristiano+Ronaldo+goal+vs+\${encodeURIComponent(match.opponent)}+\${match.date}\`;
        videoYtLink.textContent = MEDIA.searchHighlights || videoYtLink.textContent;
      }
      if (sourceLink) {
        sourceLink.href = v.sourcePage || "https://cr7allgoals.com/";
        sourceLink.textContent = MEDIA.openArchive || sourceLink.textContent;
        sourceLink.hidden = !v.sourcePage;
      }
      if (clipLink) {
        const embeddable = !!mediaHtml(v);
        const clipUrl = v.videoUrl || "";
        clipLink.hidden = !clipUrl || embeddable;
        if (!clipLink.hidden) {
          clipLink.href = clipUrl;
          clipLink.textContent = (MEDIA.watchOn || "Watch on {publisher}").replace("{publisher}", v.publisher || "the publisher");
        }
      }
      if (sourceLine) {
        sourceLine.textContent = (MEDIA.sourceLine || "").replace("{source}", "cr7allgoals.com");
      }`));

// --- 6. the inline player in the match list --------------------------------
must("inline player uses the media renderer", rep(
  `            container.innerHTML = \`
              \${navHtml}
              <video controls playsinline webkit-playsinline preload="metadata" src="\${v.videoUrl}" style="width:100%;aspect-ratio:16/9;background:#000;display:block;">
                Your browser does not support video.
              </video>
            \`;`,
  `            container.innerHTML = \`
              \${navHtml}
              \${mediaHtml(v) || '<p class="bday-inline-noclip">' + (MEDIA.noClip || "") + "</p>"}
            \`;`));

// --- 7. the page-level source note ----------------------------------------
must("source note wired", rep(
  `  if (matchListEl) {
    matchListEl.addEventListener("click", (e) => {`,
  `  // The page states the source of every figure it shows.
  {
    const note = el("bday-source-note");
    if (note && MEDIA.sourceNote) {
      note.innerHTML = '<span class="bday-source-note-text">' + MEDIA.sourceNote + "</span>";
    }
  }

  if (matchListEl) {
    matchListEl.addEventListener("click", (e) => {`));

if (t === before) { console.error("no change applied"); process.exit(1); }
fs.writeFileSync(APP, t, "utf8");
console.log("\napp.js patched");
