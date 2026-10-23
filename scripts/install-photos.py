"""
Install the photographs you have the rights to.

  python scripts/install-photos.py

Drop a file into the `photos/` folder at the repository root, named after the
slot it fills, and run this. The picture is cropped to the slot, resized and
written as WebP into public/img, exactly where the site expects it.

    photos/era-2002-sporting.jpg     ->  public/img/era/era-2002-sporting.webp
    photos/cab-ucl.jpg               ->  public/img/cab-ucl-2026.webp

PHOTOS.md says what each slot wants and where it is used.

The site publishes these pictures, so a picture can only be installed if you
hold the rights to it: one you took, one your club or agency released, or one
you licensed from a photo library. A picture found in a search engine belongs
to whoever shot it, and the site cannot republish it without a licence.
"""
import os
import sys
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DROP = os.path.join(ROOT, "photos")
IMG = os.path.join(ROOT, "public", "img")

# slot -> (the file under public/img, the width, the height)
SLOTS = {
    "era-2002-sporting": ("era/era-2002-sporting.webp", 1200, 675),
    "era-2004-manutd": ("era/era-2004-manutd.webp", 1200, 675),
    "era-2008-ballon1": ("era/era-2008-ballon1.webp", 1200, 675),
    "era-2009-real": ("era/era-2009-real.webp", 1200, 675),
    "era-2013-ballon3": ("era/era-2013-ballon3.webp", 1200, 675),
    "era-2014-ballon4": ("era/era-2014-ballon4.webp", 1200, 675),
    "era-2016-ballon5": ("era/era-2016-ballon5.webp", 1200, 675),
    "era-2017-ucl": ("era/era-2017-ucl.webp", 1200, 675),
    "era-2018-juve": ("era/era-2018-juve.webp", 1200, 675),
    "era-2021-manutd": ("era/era-2021-manutd.webp", 1200, 675),
    "era-2023-alnassr": ("era/era-2023-alnassr.webp", 1200, 675),
    "era-2026-record": ("era/era-2026-record.webp", 1200, 675),
    "cab-copa": ("cab-copa.webp", 800, 600),
    "cab-liga": ("cab-liga.webp", 800, 600),
    "cab-wc": ("cab-wc.webp", 800, 600),
    "cab-ballon": ("cab-ballon-2026.webp", 800, 600),
    "cab-ucl": ("cab-ucl-2026.webp", 800, 600),
    "cab-cwc": ("cab-cwc-2026.webp", 800, 600),
    "ronaldo-vs-messi": ("ronaldo-vs-messi.webp", 1107, 800),
}


def install(path, slot):
    target, w, h = SLOTS[slot]
    im = Image.open(path).convert("RGB")
    # fill the frame: crop the centre to the slot's shape, then resize
    want = w / h
    have = im.width / im.height
    if have > want:
        nw = int(im.height * want)
        left = (im.width - nw) // 2
        im = im.crop((left, 0, left + nw, im.height))
    else:
        nh = int(im.width / want)
        top = (im.height - nh) // 3
        im = im.crop((0, top, im.width, top + nh))
    im = im.resize((w, h), Image.LANCZOS)
    out = os.path.join(IMG, target)
    os.makedirs(os.path.dirname(out), exist_ok=True)
    im.save(out, "WEBP", quality=86, method=6)
    print("  %-22s -> %-34s %6.1f KB" % (os.path.basename(path), target, os.path.getsize(out) / 1024))


def main():
    if not os.path.isdir(DROP):
        print("no photos/ folder - drop a picture named after the slot into it and run this again")
        return
    names = [n for n in sorted(os.listdir(DROP)) if not n.startswith(".")]
    if not names:
        print("the photos/ folder is empty")
        return
    for name in names:
        stem, ext = os.path.splitext(name)
        if ext.lower() not in (".jpg", ".jpeg", ".png", ".webp", ".avif"):
            print("  [skip] %s (not a picture)" % name)
            continue
        if stem not in SLOTS:
            print("  [skip] %s (no slot with that name - see PHOTOS.md)" % name)
            continue
        install(os.path.join(DROP, name), stem)
    print("\nrun `npm run build:i18n` and `npm run build` to publish them")


if __name__ == "__main__":
    main()
