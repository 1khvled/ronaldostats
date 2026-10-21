import fs from "node:fs";
const P = "D:/Projects/ronaldo-stats/scripts/sync-all-rails.mjs";
let t = fs.readFileSync(P, "utf8");
const before = t;

// The rail's badge is the CR7 monogram in the Ronaldo palette. The build
// script still wrote the Messi project's shield - the blue-and-crimson crest
// with M10 on it - so every build put the rival's crest back on the twelve
// pages.
const messi = '<a aria-label="${L.badgeAria}" class="rail-badge" href="/${lang}"><svg aria-hidden="true" class="rail-mark" viewbox="0 0 64 64"><defs><lineargradient id="msg-${lang}-${activeSlug}" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#6d0f2e"></stop><stop offset=".55" stop-color="#1d3fae"></stop><stop offset="1" stop-color="#0e7cc0"></stop></lineargradient></defs><path d="M32 3 55 10v20c0 16-11 26-23 31C20 56 9 46 9 30V10Z" fill="url(#msg-${lang}-${activeSlug})" stroke="#e3b93e" stroke-linejoin="round" stroke-width="2.5"></path><path d="M47.5 9.5l1.7 3.5 3.8.6-2.8 2.7.7 3.8-3.4-1.8-3.4 1.8.7-3.8-2.8-2.7 3.8-.6z" fill="#e3b93e"></path><text fill="#fff" font-family="\'Plus Jakarta Sans\',Arial,sans-serif" font-size="19" font-weight="800" text-anchor="middle" x="31" y="44">M10</text></svg><span class="rail-word">Ronaldo<b>Stats</b></span></a>';
const cr7 = '<a aria-label="${L.badgeAria}" class="rail-badge" href="/${lang}"><svg class="rail-mark" viewBox="0 0 64 64" aria-hidden="true"><path d="M9 9h46v33L32 55 9 42Z" fill="none" stroke="#f2ce6b" stroke-width="3" stroke-linejoin="round"></path><text fill="#ffffff" font-family="\'Plus Jakarta Sans\',Arial,sans-serif" font-size="21" font-weight="800" text-anchor="middle" x="32" y="37">CR7</text></svg><span class="rail-word">Ronaldo<b>Stats</b></span></a>';

if (!t.includes(messi)) {
  console.log("  (the Messi crest line was not found - it may already be fixed)");
} else {
  t = t.replace(messi, cr7);
  fs.writeFileSync(P, t, "utf8");
  console.log(before === t ? "  (nothing changed)" : "ok  sync-all-rails.mjs writes the CR7 monogram, not the Messi's crest");
}
console.log("   the M10 crest is still in the script: " + /M10/.test(t));
console.log("   the msg- gradient id is still in the script: " + /msg-\$\{lang\}/.test(t));
