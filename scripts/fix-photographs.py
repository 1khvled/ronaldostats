"""
Fix the photographs that are wrong.

  python scripts/fix-photographs.py

  - the 2002 Sporting picture is a double exposure of a celebration and a
    museum panel; the celebration is the photograph, so the picture is cropped
    back to it;
  - the Real Madrid page carried the Messi picture, which belongs on the
    head-to-head page alone.

The site only ships photographs it may republish, so a picture cannot be
taken from a search engine and published: those are licensed to the agency
that sold them. scripts/install-photos.py installs photographs you have the
rights to; public/photos/SLOTS.md says which slot wants which picture.
"""
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = os.path.join(ROOT, "public", "img")


def crop_2002():
    """The Sporting debut picture: keep the celebration, drop the panel."""
    path = os.path.join(IMG, "era", "era-2002-sporting.webp")
    im = Image.open(path).convert("RGB")
    w, h = im.size
    # the celebration stands in the right half; the museum panel is the left
    left = int(w * 0.36)
    top = int(h * 0.02)
    out = im.crop((left, top, w, top + int((w - left) * 9 / 16)))
    out = out.resize((1200, 675), Image.LANCZOS)
    out.save(path, "WEBP", quality=86, method=6)
    print("  era-2002-sporting.webp: cropped to the celebration (%dx%d)" % out.size)


if __name__ == "__main__":
    crop_2002()
