"""
Build the site assets from the new RonaldoStats artwork.

  python scripts/build-brand-assets.py

  - the gold CR7 crown emblem (the logo) with a transparent surround, at every
    size the site uses: the brand, the rail mark, the favicons, the touch icon
    and the schema logo;
  - the RonaldoStats banner, for the expanded rail.

The emblem is a disc on black: the black inside the ring is part of the mark
and stays, the black outside it becomes transparent, so the logo sits on the
page instead of a black square.
"""
import math
import os
from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = os.path.join(ROOT, "public", "img")
DOWNLOADS = os.path.expanduser("~/Downloads")
LOGO_SRC = os.path.join(DOWNLOADS, "Gold CR7 Crown Emblem on Portuguese Ring.png")
BANNER_SRC = os.path.join(DOWNLOADS, "RonaldoStats CR7 Football Analytics Banner.png")


def emblem():
    """The logo: the disc of the emblem, the black outside it made transparent."""
    im = Image.open(LOGO_SRC).convert("RGB")
    grey = im.convert("L")
    # the lit area: the emblem and its glow
    mask = grey.point(lambda v: 255 if v > 18 else 0)
    bbox = mask.getbbox()
    im = im.crop(bbox)
    w, h = im.size
    cx, cy = w / 2, h / 2

    # the radial brightness profile: the ring's outer edge is where the light
    # falls away, the glow ends a little further out
    prof = []
    px = grey.crop(bbox).load()
    steps = 400
    for i in range(steps):
        r = (i + 0.5) * (max(w, h) / 2) / steps
        total = 0
        count = 0
        for a in range(0, 360, 3):
            x = int(cx + r * math.cos(math.radians(a)))
            y = int(cy + r * math.sin(math.radians(a)))
            if 0 <= x < w and 0 <= y < h:
                total += px[x, y]
                count += 1
        prof.append((r, total / count if count else 0))

    def radius_where(level):
        # the profile starts inside the mark, where the field is black, so the
        # edge is found from the outside in: the last radius still lit
        for r, v in reversed(prof):
            if v >= level:
                return r
        return prof[-1][0]

    ring_out = radius_where(30)   # the outer edge of the ring
    glow_end = radius_where(9)    # where the glow dies out

    # the alpha: the mark and its field stay solid, the glow fades out
    alpha = Image.new("L", (w, h), 0)
    ap = alpha.load()
    span = max(1.0, glow_end - ring_out)
    for y in range(h):
        dy = y - cy
        for x in range(w):
            r = math.hypot(x - cx, dy)
            if r <= ring_out:
                ap[x, y] = 255
            elif r >= glow_end:
                ap[x, y] = 0
            else:
                t = 1.0 - (r - ring_out) / span
                ap[x, y] = int(255 * t * t)
    alpha = alpha.filter(ImageFilter.GaussianBlur(1.2))

    out = im.convert("RGBA")
    out.putalpha(alpha)
    return out


def banner():
    """The banner for the expanded rail."""
    im = Image.open(BANNER_SRC).convert("RGB")
    w, h = im.size
    scale = 1200 / w
    return im.resize((1200, int(h * scale)), Image.LANCZOS)


def save(im, name, size=None, webp=False, palette=False):
    if size:
        im = im.resize(size, Image.LANCZOS)
    path = os.path.join(IMG, name)
    if palette:
        im = im.quantize(colors=256, method=Image.FASTOCTREE)
        im.save(path, "PNG", optimize=True)
    else:
        im.save(path, "PNG", optimize=True)
    if webp:
        im.save(path.replace(".png", ".webp"), "WEBP", quality=88, method=6)
    print("  %-26s %6.1f KB" % (name, os.path.getsize(path) / 1024))


def favicon_ico(im):
    path = os.path.join(IMG, "favicon.ico")
    sizes = [(16, 16), (32, 32), (48, 48)]
    frames = []
    for s in sizes:
        f = im.resize(s, Image.LANCZOS)
        frames.append(f)
    frames[0].save(path, "ICO", sizes=[(s[0], s[1]) for s in sizes])
    print("  %-26s %6.1f KB" % ("favicon.ico", os.path.getsize(path) / 1024))


def favicon_svg(im):
    """An SVG that carries the emblem, so the browser's SVG icon is the mark."""
    import base64
    import io
    buf = io.BytesIO()
    im.resize((128, 128), Image.LANCZOS).quantize(colors=256, method=Image.FASTOCTREE).save(buf, "PNG", optimize=True)
    data = base64.b64encode(buf.getvalue()).decode("ascii")
    svg = (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">'
        '<image width="128" height="128" href="data:image/png;base64,' + data + '"/>'
        "</svg>\n"
    )
    path = os.path.join(IMG, "favicon.svg")
    with open(path, "w", encoding="utf-8") as f:
        f.write(svg)
    print("  %-26s %6.1f KB" % ("favicon.svg", os.path.getsize(path) / 1024))


def main():
    print("the emblem:")
    mark = emblem()
    square = mark.resize((512, 512), Image.LANCZOS)
    save(square, "logo.png", size=(256, 256), palette=True)
    save(mark.resize((192, 192), Image.LANCZOS), "logo-192.png", palette=True)
    save(square, "logo-cr7.webp", webp=True)
    save(mark.resize((180, 180), Image.LANCZOS), "apple-touch-icon.png")
    for px in (48, 96, 192, 512):
        save(mark.resize((px, px), Image.LANCZOS), "favicon-%dx%d.png" % (px, px), palette=True)
    favicon_ico(mark)
    favicon_svg(mark)

    print("the banner:")
    save(banner(), "banner-ronaldostats.png", webp=True)


if __name__ == "__main__":
    main()
