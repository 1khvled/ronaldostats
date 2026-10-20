/**
 * Fetch the real Amazon product photographs AND the real listing details for
 * the gear store.
 *
 *   node scripts/fetch-gear-products.mjs
 *
 * The store is an Amazon affiliate store: every product links to a listing on
 * amazon.com, so the photograph on the card must be that listing's
 * photograph, and the price on the card must be that listing's price. This
 * reads the listing's own search result card, which carries the listing's
 * picture, price, rating and review count, and saves the full-size catalogue
 * image.
 *
 * The listing that is the product is pinned in scripts/gear-products.keep.json:
 * Amazon's search ranking moves, the product does not.
 *
 * Every field is read from that listing's own card and is only accepted when
 * it is a sensible number — a rating between 0 and 5, a price that looks like
 * a price. A field that cannot be read is left empty rather than guessed.
 *
 * The images are Amazon's own catalogue images; they identify the product on
 * sale, which is what the affiliate programme requires.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TAG = "ronaldostats-20";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36";
const HOSTS = ["https://www.amazon.com", "https://www.amazon.de", "https://www.amazon.es", "https://www.amazon.co.uk"];

const KEEP = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts", "gear-products.keep.json"), "utf8"));

const headers = {
  "User-Agent": UA,
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
};

const strip = (s) => String(s || "").replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, " ").trim();

async function get(url) {
  for (const host of HOSTS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const r = await fetch(url.replace("https://www.amazon.com", host), { headers, redirect: "follow" });
        const html = r.ok ? await r.text() : "";
        if (html.length > 30000) return html;
      } catch (e) { /* try the next host */ }
      await new Promise((x) => setTimeout(x, 2500));
    }
  }
  return "";
}

// the price of that listing
function priceOf(scope) {
  const off = scope.match(/a-offscreen">\$([0-9.,]+)/);
  if (off) return off[1].replace(/,/g, "");
  const whole = scope.match(/a-price-whole">([0-9,]+)(?:<span class="a-price-decimal">)?\.<\/span>?[\s\S]{0,200}?a-price-fraction">([0-9]{2})/);
  if (whole) return whole[1].replace(/,/g, "") + "." + whole[2];
  return "";
}

// the rating out of five and the review count Amazon prints beside it
function ratingOf(scope) {
  const m = scope.match(/a-icon-alt">([0-9.]+) out of 5 stars/) || scope.match(/title="([0-9.]+) out of 5 stars"/);
  if (!m) return { rating: "", reviews: "" };
  const n = parseFloat(m[1]);
  if (!(n >= 0 && n <= 5)) return { rating: "", reviews: "" };
  const after = scope.slice(m.index + m[0].length, m.index + m[0].length + 900);
  const count = (after.match(/aria-label="([0-9,]+) [Rr]atings?/) || after.match(/<span[^>]*class="[^"]*a-size-base[^"]*"[^>]*>\s*([0-9,]+)\s*<\/span>/) || [])[1];
  return { rating: m[1], reviews: count ? String(count).replace(/,/g, "") : "" };
}

// the catalogue picture of that listing, at full size: Amazon's picture ids
// carry a size and quality modifier that has to be replaced
function pictureOf(scope) {
  const m = scope.match(/m\.media-amazon\.com\/images\/I\/([A-Za-z0-9+-]+)\./);
  return m ? "https://m.media-amazon.com/images/I/" + m[1] + "._AC_SL1200_.jpg" : "";
}

// the listing's own card in the search results
async function cardFor(asin, query) {
  const html = await get("https://www.amazon.com/s?k=" + encodeURIComponent(query).replace(/%20/g, "+") + "&tag=" + TAG);
  if (!html) return null;
  for (const b of html.split(/<div[^>]+data-asin="/).slice(1)) {
    if (b.split('"')[0].trim() !== asin) continue;
    const title = strip((b.match(/<h2[^>]*aria-label="([^"]{10,400})"/) || [])[1] || "").replace(/^Sponsored Ad\s*-\s*/i, "");
    const image = pictureOf((b.match(/class="s-image"[^>]*src="[^"]+"/) || [""])[0]) || pictureOf(b);
    const { rating, reviews } = ratingOf(b);
    return { title, image, rating, reviews, price: priceOf(b) };
  }
  return null;
}

// the listing's own page, for the photograph and the price of the buy box
async function pageFor(asin) {
  const html = await get("https://www.amazon.com/dp/" + asin + "?tag=" + TAG);
  if (!html) return null;
  const t = html.indexOf('id="productTitle"');
  const scope = t > 0 ? html.slice(t, t + 40000) : html;
  const imgRegion = (html.match(/id="landingImage"[\s\S]{0,800}/) || html.match(/id="imgTagWrapperId"[\s\S]{0,1500}/) || [""])[0];
  const image = pictureOf(imgRegion) || pictureOf(html);
  const apex = (scope.match(/id="apex-pricetopay-accessibility-label"[^>]*>\s*\$([0-9.,]+)/) || [])[1] || "";
  const title = strip((html.match(/id="productTitle"[^>]*>([^<]{5,400})/) || [])[1] || "");
  return { title, image, price: apex.replace(/,/g, "") };
}

const out = [];
for (const [file, pinned] of Object.entries(KEEP)) {
  const card = await cardFor(pinned.asin, pinned.query);
  await new Promise((r) => setTimeout(r, 1600));
  // the listing's own page carries the product picture (the search card can
  // show a placeholder) and the price of the buy box
  const page = await pageFor(pinned.asin);
  await new Promise((r) => setTimeout(r, 1200));
  const data = {
    asin: pinned.asin,
    title: (card && card.title) || (page && page.title) || pinned.why,
    price: (card && card.price) || (page && page.price) || "",
    rating: (card && card.rating) || "",
    reviews: (card && card.reviews) || "",
    image: (page && page.image) || (card && card.image) || "",
  };
  if (!/^\d+(\.\d{2})?$/.test(data.price)) data.price = "";

  if (!data.image) { console.log("  " + file + ": no picture found"); continue; }

  // the full-size catalogue image
  let saved = false;
  const id = (data.image.match(/\/images\/I\/([A-Za-z0-9+]+)\./) || [])[1] || "";
  const variants = [];
  if (id) {
    variants.push("https://m.media-amazon.com/images/I/" + id + "._AC_SL1200_.jpg");
    variants.push("https://m.media-amazon.com/images/I/" + id + "._AC_UL600_.jpg");
    variants.push("https://m.media-amazon.com/images/I/" + id + ".jpg");
  }
  variants.push(data.image);
  for (const u of variants) {
    try {
      const r = await fetch(u, { headers: { "User-Agent": UA, Referer: "https://www.amazon.com/" } });
      if (!r.ok) continue;
      const buf = Buffer.from(await r.arrayBuffer());
      if (buf.length < 4000) continue;
      fs.writeFileSync(path.join(ROOT, "public/img/gear", file), buf);
      saved = true;
      data.image = u;
      break;
    } catch (e) { /* next */ }
  }
  if (!saved) { console.log("  " + file + ": the image could not be downloaded (" + data.image + ")"); continue; }

  out.push({ file, asin: data.asin, amazonTitle: data.title, price: data.price, rating: data.rating, reviews: data.reviews, image: data.image, url: "https://www.amazon.com/dp/" + data.asin + "?tag=" + TAG });
  console.log("  " + file.padEnd(24) + data.asin + "  $" + (data.price || "?").padStart(7) + "  " + (data.rating || "-") + "★  " + (data.reviews || "-").padStart(5) + " reviews  " + data.title.slice(0, 44));
}

fs.writeFileSync(path.join(ROOT, "public/data/gear-products.json"), JSON.stringify({ retrieved: new Date().toISOString().slice(0, 10), source: "amazon.com", note: "Prices and ratings are read from the listing on the retrieval date and change; the card says so.", products: out }, null, 1), "utf8");
console.log("\nwrote public/data/gear-products.json — " + out.length + " of " + Object.keys(KEEP).length + " products");
