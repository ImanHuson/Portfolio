"""The home page's wide Story plate: the six book plates side by side on a dark
table, placed in the upper half so card text below never collides with them.
Run after the book plates exist in public/images/books/."""
import os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
BOOKS = os.path.join(HERE, "..", "..", "public", "images", "books")
W, H = 1600, 900
bg = Image.new("RGB", (W, H), (9, 8, 10))
glow = Image.new("RGB", (W, H), (0, 0, 0))
ImageDraw.Draw(glow).ellipse((250, -100, 1350, 560), fill=(70, 14, 18))
glow = glow.filter(ImageFilter.GaussianBlur(150))
bg = Image.fromarray(np.clip(np.asarray(bg).astype(int) + np.asarray(glow).astype(int), 0, 255).astype("uint8"))
names = ["red-rising", "golden-son", "morning-star", "iron-gold", "dark-age", "light-bringer"]
pw, ph, gap, y0 = 200, 300, 20, 70
x0 = (W - (6 * pw + 5 * gap)) // 2
for i, n in enumerate(names):
    im = Image.open(os.path.join(BOOKS, f"{n}.webp")).convert("RGB").resize((pw, ph), Image.LANCZOS)
    x, y = x0 + i * (pw + gap), y0 + (0 if i % 2 == 0 else 16)
    sh = Image.new("L", (W, H), 0)
    ImageDraw.Draw(sh).rectangle((x + 10, y + 18, x + pw + 10, y + ph + 18), fill=190)
    bg = Image.composite(Image.new("RGB", (W, H), (0, 0, 0)), bg, sh.filter(ImageFilter.GaussianBlur(16)))
    bg.paste(im, (x, y))
    ImageDraw.Draw(bg).rectangle((x, y, x + pw - 1, y + ph - 1), outline=(60, 52, 48))
a = np.asarray(bg).astype(np.float32) / 255
yy, xx = np.mgrid[0:H, 0:W]
r = np.sqrt(((xx - W / 2) / (W * 0.62)) ** 2 + ((yy - H * 0.3) / (H * 0.8)) ** 2)
a *= np.clip(1.15 - r * 0.55, 0.35, 1)[..., None]
a += np.random.default_rng(3).normal(0, 0.012, (H, W, 1))
Image.fromarray((np.clip(a, 0, 1) * 255).astype("uint8")).save(os.path.join(BOOKS, "shelf.webp"), "WEBP", quality=82, method=6)
