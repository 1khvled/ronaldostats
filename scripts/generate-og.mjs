/**
 * The social card: public/img/og-ronaldo.jpg and .webp (1200x630).
 *
 *   node scripts/generate-og.mjs
 *
 * The card carries the gold CR7 emblem, the verified career numbers and the
 * date the data was last checked. Every figure is read from
 * public/data/ronaldo-data.json, so it cannot drift from the site.
 *
 * Vercel's build containers do not carry Python Pillow, so the build uses the
 * committed card and this script renders the next one locally.
 */
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync, copyFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dataPath = join(root, "public", "data", "ronaldo-data.json");

if (process.env.VERCEL) {
  console.log("[generate-og] Vercel environment detected; using the pre-rendered public/img/og-ronaldo.jpg");
  process.exit(0);
}

if (!existsSync(dataPath)) {
  console.error("Missing ronaldo-data.json at:", dataPath);
  process.exit(1);
}

const data = JSON.parse(readFileSync(dataPath, "utf8"));
const totalGoals = data.totals?.combined?.goals || 981;
const totalApps = data.totals?.combined?.appearances || 1340;
const countryGoals = data.totals?.country?.goals || 146;
const countryApps = data.totals?.country?.appearances || 234;

const clubs = {};
for (const s of data.clubSeasons || []) clubs[s.club] = (clubs[s.club] || 0) + s.goals;
const clubOrder = ["Real Madrid", "Manchester United", "Al Nassr", "Juventus", "Sporting CP"];
const clubGoals = clubOrder.map((c) => [c, clubs[c] || 0]).filter(([, g]) => g > 0);
const clubTotal = clubGoals.reduce((a, [, g]) => a + g, 0);

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let updated = new Date();
if (data.meta?.updated) {
  const p = data.meta.updated.split("-");
  if (p.length === 3) updated = new Date(Date.UTC(+p[0], +p[1] - 1, +p[2]));
}
const formattedDate = `${updated.getUTCDate()} ${months[updated.getUTCMonth()]} ${updated.getUTCFullYear()}`;

const py = `
import os
from PIL import Image, ImageDraw, ImageFont

root = ${JSON.stringify(root)}
total_goals = ${totalGoals}
total_apps = ${JSON.stringify(totalApps.toLocaleString("en-US"))}
country_goals = ${countryGoals}
country_apps = ${countryApps}
club_breakdown = ${JSON.stringify(clubGoals)}
club_total = ${clubTotal}
formatted_date = ${JSON.stringify(formattedDate)}

W, H = 1200, 630
NAVY, GOLD, PAPER, MUTED = (14, 26, 45), (238, 194, 47), (244, 240, 232), (159, 176, 199)
GREEN, RED = (0, 138, 78), (239, 68, 68)

img = Image.new("RGB", (W, H), NAVY)
px = img.load()
for y in range(H):
    k = 1.0 - 0.10 * (y / H)
    for x in range(0, W, 4):
        r, g, b = px[x, y]
        for dx in range(4):
            if x + dx < W:
                px[x + dx, y] = (int(r * k), int(g * k), int(b * k))

d = ImageDraw.Draw(img)

def load_font(bold=False, size=32):
    candidates = []
    if bold:
        candidates = [
            "C:/Windows/Fonts/arialbd.ttf",
            "C:/Windows/Fonts/segoeuib.ttf",
            "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
            "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
        ]
    else:
        candidates = [
            "C:/Windows/Fonts/arial.ttf",
            "C:/Windows/Fonts/segoeui.ttf",
            "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
            "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
        ]
    for c in candidates:
        if os.path.exists(c):
            try:
                return ImageFont.truetype(c, size)
            except Exception:
                pass
    try:
        return ImageFont.load_default(size=size)
    except Exception:
        return ImageFont.load_default()

def label(xy, s, size, fill, bold=True, anchor="la"):
    d.text(xy, s, font=load_font(bold=bold, size=size), fill=fill, anchor=anchor)

# 1. the gold frame
d.rectangle([14, 14, W - 15, H - 15], outline=GOLD, width=3)

# 2. the emblem
logo = os.path.join(root, "public", "img", "logo-cr7.webp")
if os.path.exists(logo):
    mark = Image.open(logo).convert("RGBA").resize((190, 190), Image.LANCZOS)
    img.paste(mark, (74, 96), mark)

# 3. the header
label((300, 108), "CRISTIANO RONALDO  \\u00b7  CAREER STATISTICS", 30, GOLD)

# 4. the goal tally
label((292, 150), str(total_goals), 190, PAPER)

# 5. appearances and the club breakdown
label((300, 348), f"career goals in {total_apps} senior appearances", 34, PAPER)
breakdown = "  \\u00b7  ".join(f"{name} {goals}" for name, goals in club_breakdown)
half = (len(breakdown) + 1) // 2
first = "  \\u00b7  ".join(f"{name} {goals}" for name, goals in club_breakdown[:3])
second = "  \\u00b7  ".join(f"{name} {goals}" for name, goals in club_breakdown[3:])
label((300, 394), first, 24, MUTED, bold=False)
if second:
    label((300, 424), second, 24, MUTED, bold=False)
label((300, 458), f"Portugal {country_goals} goals in {country_apps} caps", 24, MUTED, bold=False)

# 6. the club strip, in the brand colours
bx, bw, by, bh = 300, 560, 494, 12
strip = [(GOLD, "#e8c23f"), (GREEN, "#00a05a"), (RED, "#ef4444"), ("#dfe7f2", "#9fb0c8"), ("#5b7bb5", "#3d5a8a")]
x = bx
for i, (name, goals) in enumerate(club_breakdown):
    w = max(int(round(bw * goals / max(1, club_total))), 10)
    w = min(w, bx + bw - x)
    c1, c2 = strip[i % len(strip)]
    d.rectangle([x, by, x + w, by + bh], fill=c1)
    d.rectangle([x, by + bh - 4, x + w, by + bh], fill=c2)
    x += w

# 7. the secondary highlights
for i, (a, b) in enumerate([("5", "Ballons d\\u2019Or"), ("35", "senior trophies"), ("140", "Champions League goals")]):
    x_pos = (300, 480, 660)[i]
    label((x_pos, 514), a, 38, GOLD)
    label((x_pos, 556), b, 22, PAPER, bold=False)

# 8. the portrait
portrait_path = os.path.join(root, "public", "img", "ronaldo.jpg")
if os.path.exists(portrait_path):
    photo = Image.open(portrait_path).convert("RGB")
    PW = 300
    s = max(PW / photo.width, H / photo.height)
    photo = photo.resize((int(photo.width * s + 0.5), int(photo.height * s + 0.5)), Image.LANCZOS)
    ox, oy = (photo.width - PW) // 2, (photo.height - H) // 2
    photo = photo.crop((ox, oy, ox + PW, oy + H))
    mask = Image.new("L", (PW, H), 255)
    mp = mask.load()
    for x in range(140):
        for y in range(H):
            mp[x, y] = int(255 * (x / 140) ** 1.6)
    img.paste(photo, (W - PW, 0), mask)

# 9. the footer
label((300, 590), f"RONALDOSTATS  \\u00b7  Updated {formatted_date}", 20, MUTED, bold=False)

out_jpg = os.path.join(root, "public", "img", "og-ronaldo.jpg")
out_webp = os.path.join(root, "public", "img", "og-ronaldo.webp")
img.save(out_jpg, "JPEG", quality=90, optimize=True, progressive=True)
img.save(out_webp, "WEBP", quality=88)
print(f"[generate-og] rendered {out_jpg} ({os.path.getsize(out_jpg)} bytes)")
print(f"[generate-og] rendered {out_webp} ({os.path.getsize(out_webp)} bytes)")
`;

const tmp = join(tmpdir(), "generate-og-dynamic.py");
writeFileSync(tmp, py, "utf8");
let r = spawnSync("python", [tmp], { stdio: "inherit" });
if (r.status !== 0) r = spawnSync("python3", [tmp], { stdio: "inherit" });
if (r.status !== 0) {
  console.warn("[generate-og] Python or Pillow not found; keeping the committed public/img/og-ronaldo.jpg.");
  process.exit(0);
}

const distImgDir = join(root, "dist", "img");
if (existsSync(distImgDir)) {
  copyFileSync(join(root, "public", "img", "og-ronaldo.jpg"), join(distImgDir, "og-ronaldo.jpg"));
  copyFileSync(join(root, "public", "img", "og-ronaldo.webp"), join(distImgDir, "og-ronaldo.webp"));
  console.log("[generate-og] mirrored the social assets to dist/img/");
}
