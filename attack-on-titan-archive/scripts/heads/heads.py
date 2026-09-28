"""Chapter-opening frames for the chapters that had none (The Soldiers, The
Titans), composed from the archive's own treated images so every chapter
opens the same way: a full-bleed frame under the title.

    python3 scripts/heads/heads.py      (from attack-on-titan-archive/)

Writes public/images/heads/<name>.webp at 1680x1050.
"""
import random
from PIL import Image, ImageDraw, ImageFilter

W, H = 1680, 1050
BASE = (11, 12, 10)
IMG = "public/images"


def desk():
    """The dark ground with a soft pool of lamp light, and grain."""
    im = Image.new("RGB", (W, H), BASE)
    glow = Image.new("L", (W, H), 0)
    ImageDraw.Draw(glow).ellipse((W * 0.18, -H * 0.25, W * 0.95, H * 0.95), fill=46)
    glow = glow.filter(ImageFilter.GaussianBlur(220))
    im = Image.composite(Image.new("RGB", (W, H), (58, 54, 44)), im, glow)
    rnd = random.Random(7)
    noise = Image.effect_noise((W, H), 18).convert("L")
    return Image.blend(im, Image.merge("RGB", (noise,) * 3), 0.035), rnd


def shadowed(layer, rot):
    """An object laid on the desk: rotated, with a soft drop shadow."""
    layer = layer.rotate(rot, expand=True, resample=Image.BICUBIC)
    a = layer.split()[-1]
    sh = Image.new("RGBA", layer.size, (0, 0, 0, 0))
    sh.putalpha(a.point(lambda v: int(v * 0.75)).filter(ImageFilter.GaussianBlur(18)))
    return layer, sh


def place(canvas, layer, x, y, rot):
    layer, sh = shadowed(layer, rot)
    canvas.alpha_composite(sh, (int(x + 10), int(y + 26)))
    canvas.alpha_composite(layer, (int(x), int(y)))


def soldiers():
    bg, rnd = desk()
    c = bg.convert("RGBA")
    # personnel files spread across the desk, right of the title column
    names = ["hange", "erwin", "mikasa", "levi", "armin", "eren", "jean"]
    xs = [360, 560, 760, 960, 1160, 1330, 1490]
    for i, (n, x) in enumerate(zip(names, xs)):
        p = Image.open(f"{IMG}/personnel/{n}.webp").convert("RGBA")
        h = rnd.randint(520, 600)
        p = p.resize((int(p.width * h / p.height), h), Image.LANCZOS)
        place(c, p, x - p.width / 2, 110 + rnd.randint(-40, 60) + (i % 2) * 70, rnd.uniform(-5, 5))
    c.convert("RGB").save(f"{IMG}/heads/soldiers.webp", quality=80, method=6)


def titans():
    bg, rnd = desk()
    c = bg.convert("RGBA")
    # specimen plates, pinned in a row like a research wall
    for i, (n, x) in enumerate(zip(["armored", "colossal", "attack", "beast"], [300, 640, 980, 1320])):
        p = Image.open(f"{IMG}/titans/{n}-plate.webp").convert("RGBA")
        h = 640
        p = p.resize((int(p.width * h / p.height), h), Image.LANCZOS)
        place(c, p, x - p.width / 2, 80 + (i % 2) * 40, rnd.uniform(-2.5, 2.5))
    c.convert("RGB").save(f"{IMG}/heads/titans.webp", quality=80, method=6)


if __name__ == "__main__":
    soldiers()
    titans()

# world.webp and war.webp are frames captured from the built pages (the One
# Island pull-back at 70 % with its text hidden, and the relief map at rest
# with its markers hidden), 1680x1050, then saved as WebP q80.
