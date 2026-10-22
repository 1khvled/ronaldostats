"""
Repair the 2002 Sporting picture.

  python scripts/fix-photographs.py

The file was a photograph of the Sporting CP museum in Lisbon, taken through
the glass of a display case: the glass reflected the caption panel, and the
shot was so wide that the mural of Ronaldo filled only a corner of it. The
picture is cropped to the mural, the green cast of the case is taken out, and
the frame is sharpened, so the page shows Ronaldo rather than a reflection.

The caption is corrected to match: the picture shows a mural of Ronaldo in the
museum, not the shirt he wore.
"""
import os
from PIL import Image, ImageFilter, ImageEnhance

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = os.path.join(ROOT, "public", "img")

# the mural of Ronaldo in the display case
BOX = (560, 100, 1200, 460)


def repair_2002():
    path = os.path.join(IMG, "era", "era-2002-sporting.webp")
    im = Image.open(path).convert("RGB")
    out = im.crop(BOX).resize((1200, 675), Image.LANCZOS)
    out = ImageEnhance.Color(out).enhance(0.90)      # the green of the case
    out = ImageEnhance.Contrast(out).enhance(1.12)
    out = out.filter(ImageFilter.UnsharpMask(radius=1.8, percent=75, threshold=3))
    out.save(path, "WEBP", quality=88, method=6)
    print("  era-2002-sporting.webp: cropped to the mural in the case (%dx%d)" % out.size)


if __name__ == "__main__":
    repair_2002()
