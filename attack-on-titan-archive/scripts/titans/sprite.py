"""Assemble each Titan's 24 turntable frames (from render.mjs, rendered at 2x)
into one horizontal sprite sheet, downsampled to 300x600 per frame.
    python3 scripts/titans/sprite.py <framesdir>
Output: public/images/titans/<slug>.webp"""
import sys
from pathlib import Path
from PIL import Image

SLUGS = ["founding", "attack", "colossal", "armored", "female", "beast", "jaw", "cart", "war-hammer"]
FRAMES, W, H = 24, 300, 600
src = Path(sys.argv[1])
out = Path(__file__).resolve().parents[2] / "public" / "images" / "titans"
out.mkdir(parents=True, exist_ok=True)
# two sizes: large for a Titan's own page, small for the index columns and
# the to-scale strip (where they show at ~150 px wide)
for f, slug in enumerate(SLUGS):
    for suffix, w, h, q in (("", W, H, 78), ("-sm", 180, 360, 50)):
        sheet = Image.new("RGBA", (w * FRAMES, h), (0, 0, 0, 0))
        for i in range(FRAMES):
            im = Image.open(src / f"t{f}_{i:02d}.png").convert("RGBA").resize((w, h), Image.LANCZOS)
            sheet.paste(im, (i * w, 0))
        name = out / f"{slug}{suffix}.webp"
        sheet.save(name, "WEBP", quality=q, alpha_quality=40, method=6)
        print(name.name, name.stat().st_size // 1024, "KB")
