/**
 * Rewrite the gear grid in gear.html from the real Amazon listing data.
 *
 *   node scripts/apply-gear-products.mjs
 *
 * The store links to eight listings on amazon.com. This writes each card's
 * photograph, price, rating, review count and link from the listing data that
 * scripts/fetch-gear-products.mjs collected, so the card always shows the
 * listing's own picture and the listing's own numbers.
 *
 * The wording of each card lives in scripts/gear-copy.json, and the price,
 * rating and review count are re-read from the listing every run.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, "$1"), "..");
const copy = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts", "gear-copy.json"), "utf8"));
const data = JSON.parse(fs.readFileSync(path.join(ROOT, "public", "data", "gear-products.json"), "utf8"));
const byFile = new Map((data.products || []).map((p) => [p.file, p]));

const stars = (rating) => {
  // a half star is not drawn, so a rating of 4.5 shows four full stars
  const n = Math.max(0, Math.min(5, Math.floor((parseFloat(rating) || 0) + 0.3)));
  return "★".repeat(n) + "☆".repeat(5 - n);
};

// the pixel size of the photograph, so the card reserves the right box
function imageSize(file) {
  const buf = fs.readFileSync(path.join(ROOT, "public", "img", "gear", file));
  if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) return [buf.readUInt32BE(16), buf.readUInt32BE(20)];
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i < buf.length - 9) {
      if (buf[i] !== 0xff) { i++; continue; }
      const marker = buf[i + 1];
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) return [buf.readUInt16BE(i + 7), buf.readUInt16BE(i + 5)];
      i += 2 + buf.readUInt16BE(i + 2);
    }
  }
  return [1200, 1200];
}

const card = (c) => {
  const p = byFile.get(c.file);
  if (!p) return null;
  const price = p.price ? "$" + p.price : "—";
  const note = p.price ? copy.priceNote : copy.priceNoteNoPrice;
  const rating = p.rating || "";
  const reviews = p.reviews ? Number(p.reviews).toLocaleString("en-US") : "";
  const [w, h] = imageSize(c.file);
  // the stars and the review count only appear when Amazon prints them
  const ratingLine = rating
    ? `        <span class="gear-stars" data-gear="${c.file}">${stars(rating)}</span>
        <span class="gear-rating-count"><span class="gear-score" data-gear="${c.file}">${rating}</span><span class="gear-sep"> · </span><span class="gear-revnum" data-gear="${c.file}">${reviews}</span> <span class="gear-revword">${copy.reviewWord}</span></span>`
    : "";
  return `
  <!-- ${c.title} -->
  <article class="gear-card" data-category="${c.category}" data-keywords="${c.keywords}">
    <div class="gear-card-header">
      <img src="/img/gear/${c.file}" alt="${c.alt}" class="gear-card-img" loading="lazy" width="${w}" height="${h}" />
      <span class="gear-badge${c.badgeStyle ? " " + c.badgeStyle : ""}">${c.badge}</span>
    </div>
    <div class="gear-card-body">
      <span class="gear-category">${c.categoryLabel}</span>
      <h3 class="gear-card-title">${c.title}</h3>
${ratingLine ? '      <div class="gear-rating">\n' + ratingLine + '\n      </div>' : ""}
      <ul class="gear-features">
${copy.bullets.map((b) => "        <li>" + b + "</li>").join("\n")}
      </ul>
      <div class="gear-price-row">
        <div class="gear-price-tag">
          <span class="gear-price-val" data-gear="${c.file}">${price}</span>
          <span class="gear-price-note">${note}</span>
        </div>
        <a href="${p.url}" target="_blank" rel="noopener sponsored" class="gear-amazon-btn" data-product="${c.product}">
          <span>Check on Amazon ↗</span>
        </a>
      </div>
    </div>
  </article>
`;
};

const cards = copy.cards.map(card).filter(Boolean);
if (cards.length !== copy.cards.length) {
  console.error("some products have no listing data — run scripts/fetch-gear-products.mjs first");
  process.exit(1);
}

const file = path.join(ROOT, "gear.html");
let html = fs.readFileSync(file, "utf8");
const open = '<div class="gear-grid" id="gear-grid">';
const start = html.indexOf(open);
const anchor = html.indexOf("<!-- Affiliate FTC Disclosure -->");
const gridEnd = html.lastIndexOf("</div>", anchor);
if (start < 0 || gridEnd < 0) { console.error("the gear grid was not found in gear.html"); process.exit(1); }
const block = html.slice(0, start + open.length) + "\n" + cards.join("\n") + "\n" + html.slice(gridEnd);

// the schema.org ItemList names the same products, so they are kept in step
const jsonld = block.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/g, (m, openTag, body, closeTag) => {
  let data;
  try { data = JSON.parse(body); } catch (e) { return m; }
  let k = 0;
  const walk = (node) => {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) { node.forEach(walk); return; }
    // the product list is the one whose items carry a picture
    if (node["@type"] === "ListItem" && node.image) {
      const c = copy.cards[k++];
      if (c) node.name = c.title;
    }
    for (const v of Object.values(node)) walk(v);
  };
  walk(data);
  if (k !== copy.cards.length) console.warn("  (the schema.org list had " + k + " products, not " + copy.cards.length + ")");
  return openTag + JSON.stringify(data, null, 2) + closeTag;
});

fs.writeFileSync(file, jsonld, "utf8");
console.log("ok  gear.html: " + cards.length + " cards written from the live listing data");
for (const c of copy.cards) {
  const p = byFile.get(c.file);
  console.log("   " + c.file.padEnd(24) + p.asin + "  $" + (p.price || "?").padStart(7) + "  " + (p.rating || "-") + "★  " + (p.reviews || "-") + " reviews");
}
