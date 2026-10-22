"""A contact sheet of every photograph the site ships, with its name."""
import os
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = os.path.join(ROOT, "public", "img")

files = []
for d in ("era", "gear", ""):
    folder = os.path.join(IMG, d) if d else IMG
    for name in sorted(os.listdir(folder)):
        if name.lower().endswith((".webp", ".jpg", ".png")) and "logo" not in name and "favicon" not in name and "apple-touch" not in name and "banner" not in name and "og-ronaldo" not in name:
            files.append((d + "/" + name if d else name, os.path.join(folder, name)))

COLS, CELL, PAD, LABEL = 4, 300, 10, 22
rows = (len(files) + COLS - 1) // COLS
sheet = Image.new("RGB", (COLS * (CELL + PAD) + PAD, rows * (CELL + PAD + LABEL) + PAD), (250, 250, 248))
d = ImageDraw.Draw(sheet)

for i, (name, path) in enumerate(files):
    try:
        im = Image.open(path).convert("RGB")
    except Exception:
        continue
    im.thumbnail((CELL, CELL), Image.LANCZOS)
    x = PAD + (i % COLS) * (CELL + PAD)
    y = PAD + (i // COLS) * (CELL + PAD + LABEL)
    sheet.paste(im, (x + (CELL - im.width) // 2, y + (CELL - im.height) // 2))
    d.text((x, y + CELL + 4), name.split("/")[-1][:44], fill=(20, 20, 20))

out = os.path.join(ROOT, "public", "contact-sheet.png")
sheet.save(out)
print("the sheet has %d photographs: %s" % (len(files), out))
for name, _ in files:
    print("  " + name)
