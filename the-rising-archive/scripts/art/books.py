"""Six book plates for The Red Rising Archive, one consistent series (2:3).
Original symbolic designs, not reproductions of the published covers."""
import sys, math
import os
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", "..", "..", ".claude", "skills", "level-1-image-generator", "lib"))
from render import Design

VOID = (7, 7, 10); BONE = (233, 228, 218); ASH = (147, 143, 136); RED = (196, 30, 42)
DEEP = (122, 15, 23); MARS = (181, 69, 42); GOLD = (200, 169, 106); RIM = (238, 240, 242)
OUT = os.environ.get("ART_OUT", os.path.join(HERE, "renders"))
os.makedirs(OUT, exist_ok=True)

BOOKS = [
    ("I", "RED RISING", "The end of the world he knew", "2014"),
    ("II", "GOLDEN SON", "The rise of the Reaper", "2015"),
    ("III", "MORNING STAR", "The Rising", "2016"),
    ("IV", "IRON GOLD", "The cost of victory", "2018"),
    ("V", "DARK AGE", "The war after the war", "2019"),
    ("VI", "LIGHT BRINGER", "What survives", "2023"),
]


def frame(d, numeral, title, sub, year, accent):
    L = 0.09
    d.write(L, 0.075, "THE RED RISING ARCHIVE", role="mono", size=22, color=ASH, tracking=5)
    d.write(1 - L, 0.075, numeral, role="mono", size=22, color=accent, tracking=4, align="right")
    d.line(L, 0.09, 1 - L, 0.09, 1, (40, 40, 46))
    size = d.fit_size(title, 0.82, role="display", weight="bold")
    size = min(size, 230)
    d.write(L, 0.845, title, role="display", weight="bold", size=size, color=BONE, tracking=1)
    d.write(L, 0.895, sub, role="serif_book", italic=True, size=40, color=accent)
    d.line(L, 0.925, 1 - L, 0.925, 1, (40, 40, 46))
    d.write(L, 0.952, f"BOOK {numeral}", role="mono", size=20, color=ASH, tracking=5)
    d.write(1 - L, 0.952, year, role="mono", size=20, color=ASH, tracking=5, align="right")


def base(d, glow_col, center=(0.5, 0.42), strength=0.35, radius=0.55):
    d.fill(VOID)
    d.overlay_glow(center, glow_col, radius, strength=strength, mode="screen")
    d.vignette(0.55, center=(0.5, 0.45), radius=0.7)


def book1():
    d = Design("2:3", background=VOID)
    base(d, DEEP, (0.5, 0.52), 0.5, 0.6)
    # Mars rising over the rim of the mine, a shaft straight down
    d.gradient_sphere(0.5, 0.5, 0.2, [(214, 96, 52), MARS, (60, 18, 10)], light=(-0.3, -0.45), shadow=True, specular=0.05, rim=0.06)
    d.rect(0.0, 0.5, 1.0, 1.0, VOID)
    d.line(0.09, 0.5, 0.91, 0.5, 2, (90, 30, 24))
    d.line(0.5, 0.5, 0.5, 0.76, 3, RED)
    for i in range(5):
        d.line(0.47, 0.54 + i * 0.045, 0.53, 0.54 + i * 0.045, 1, (70, 22, 20))
    frame(d, *BOOKS[0], RED)
    d.save(f"{OUT}/book-red-rising.png", grain=6, chroma=1.5)


def book2():
    d = Design("2:3", background=VOID)
    base(d, (90, 70, 30), (0.5, 0.4), 0.45)
    # a gold ring, split: the son who is two people
    d.ring(0.5, 0.4, 0.23, 14, GOLD)
    d.pie(0.5, 0.4, 0.17, 270, 450, GOLD)
    d.pie(0.5, 0.4, 0.17, 90, 270, (40, 16, 14))
    d.ring(0.5, 0.4, 0.17, 3, (120, 100, 60))
    d.line(0.5, 0.14, 0.5, 0.66, 2, RED)
    frame(d, *BOOKS[1], GOLD)
    d.save(f"{OUT}/book-golden-son.png", grain=6, chroma=1.5)


def book3():
    d = Design("2:3", background=VOID)
    d.linear_gradient([(0, VOID), (0.45, (16, 10, 14)), (0.66, (70, 16, 20)), (0.7, (140, 44, 30))], angle=90)
    d.overlay_glow((0.5, 0.7), (255, 190, 150), 0.35, strength=0.5, mode="screen")
    d.rect(0.0, 0.7, 1.0, 1.0, VOID)
    # the morning star: one point, low, with long rays
    for a in range(0, 360, 15):
        r = 0.05 if a % 45 else 0.14
        x1 = 0.5 + math.cos(math.radians(a)) * r * 1.0
        y1 = 0.62 + math.sin(math.radians(a)) * r * 0.667
        d.line(0.5, 0.62, x1, y1, 2 if a % 45 else 3, RIM)
    d.disk(0.5, 0.62, 0.012, RIM, glow={"color": (255, 230, 210)})
    d.line(0.09, 0.7, 0.91, 0.7, 2, (150, 60, 40))
    frame(d, *BOOKS[2], RED)
    d.save(f"{OUT}/book-morning-star.png", grain=6, chroma=1.5)


def book4():
    d = Design("2:3", background=VOID)
    base(d, (60, 62, 70), (0.5, 0.4), 0.4)
    # iron plate, a gold fracture, four marks for four voices
    d.rect(0.2, 0.16, 0.8, 0.64, (46, 47, 52), radius=0)
    d.rect(0.2, 0.16, 0.8, 0.64, (46, 47, 52))
    pts = [(0.46, 0.16), (0.52, 0.28), (0.47, 0.36), (0.55, 0.47), (0.5, 0.56), (0.53, 0.64)]
    for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
        d.line(x0, y0, x1, y1, 5, GOLD)
    for i in range(4):
        d.rect(0.26 + i * 0.03, 0.59, 0.275 + i * 0.03, 0.615, RED)
    frame(d, *BOOKS[3], GOLD)
    d.save(f"{OUT}/book-iron-gold.png", grain=6, chroma=1.5)


def book5():
    d = Design("2:3", background=VOID)
    base(d, (40, 8, 12), (0.5, 0.4), 0.45)
    # an eclipse: the light is still there, just behind something
    d.disk(0.5, 0.4, 0.215, (150, 30, 36), glow={"color": (180, 30, 40)})
    d.disk(0.515, 0.395, 0.205, VOID)
    d.ring(0.5, 0.4, 0.3, 2, (50, 30, 34))
    frame(d, *BOOKS[4], RED)
    d.save(f"{OUT}/book-dark-age.png", grain=7, chroma=1.5)


def book6():
    d = Design("2:3", background=VOID)
    base(d, (70, 60, 50), (0.5, 0.42), 0.5)
    # light from a single point
    for i in range(72):
        a = math.radians(i * 5 + 2.5)
        r = 0.36 if i % 3 == 0 else 0.22
        d.line(0.5, 0.42, 0.5 + math.cos(a) * r, 0.42 + math.sin(a) * r * 0.667, 1 if i % 3 else 2, (220, 214, 200))
    d.disk(0.5, 0.42, 0.03, BONE, glow={"color": (255, 240, 220)})
    frame(d, *BOOKS[5], BONE)
    d.save(f"{OUT}/book-light-bringer.png", grain=6, chroma=1.5)


def og():
    d = Design("1200x630", background=VOID)
    d.fill(VOID)
    d.overlay_glow((0.78, 0.5), DEEP, 0.55, strength=0.55, mode="screen")
    d.gradient_sphere(0.8, 0.5, 0.19, [(214, 96, 52), MARS, (40, 12, 8)], light=(-0.5, -0.3), shadow=False, specular=0.04, rim=0.05)
    d.vignette(0.5)
    d.write(0.07, 0.2, "736 PCE  /  MARS  /  LYKOS", role="mono", size=20, color=ASH, tracking=5)
    d.write(0.07, 0.56, "RED RISING", role="display", weight="bold", size=150, color=BONE)
    d.write(0.07, 0.7, "THE ARCHIVE", role="display", weight="bold", size=54, color=RED, tracking=10)
    d.write(0.07, 0.86, "An unofficial fan archive of Pierce Brown's saga", role="serif_book", italic=True, size=28, color=ASH)
    d.save(f"{OUT}/og.png", grain=5, chroma=1)


for f in (book1, book2, book3, book4, book5, book6, og):
    f()
print("ok")
