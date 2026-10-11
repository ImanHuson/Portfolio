"""The archive's own paintings: generated on Cloudflare Workers AI inside the
FREE daily allowance only (10,000 neurons a UTC day; the user's call: no
paid route, spread the set over days), upscaled and depth-mapped locally.

    python3 -I scripts/gen/generate.py            (from attack-on-titan-archive/)
    python3 -I scripts/gen/generate.py --dry      (what today's budget would make)
    python3 -I scripts/gen/generate.py name ...   (only these, still within budget)

Needs CF_ACCOUNT_ID and CF_API_TOKEN in the environment. The account is on
Cloudflare's FREE plan (its 429 says "upgrade to Workers Paid"), so going
over the allowance fails rather than bills; the allowance did not reset at
00:00 UTC sharp, so a 429 just means try later (exit code 3). The token cannot
read the account's usage or plan, so this script keeps its own ledger
(ledger.json, committed so a new container sees today's spend) and prices
every call conservatively: whole 512x512 tiles rounded up, Cloudflare's
published per-tile and per-step rates. It stops at BUDGET and on any quota
error, never retries into overage.

Two tiers, by where the image is used:
  hero   Leonardo Phoenix 1.0 at 1536x1024 (~3,400 neurons): the pinned scroll
         scenes and the opening, which also get a depth map for parallax
  bg     FLUX.1 schnell at 1024x1024, 4 steps (~60 neurons): section backgrounds,
         which sit behind scrims and text; cropped wide, upscaled x2.5

Raw output goes to bg-src/gen/ (gitignored). Then: Real-ESRGAN general x4v3
(BSD-3) upscales, Depth Anything V2 small (Apache-2.0) makes depth maps,
both ONNX on the CPU, downloaded once into scripts/gen/models/ (gitignored),
and the archive's grade writes public/images/gen/<name>.webp (+ -depth.webp).
"""
import base64
import datetime
import json
import os
import pathlib
import sys
import urllib.request
import zlib

import numpy as np
from PIL import Image, ImageEnhance, ImageFilter

HERE = pathlib.Path(__file__).parent
RAW = pathlib.Path("bg-src/gen")
OUT = pathlib.Path("public/images/gen")
MODELS = HERE / "models"
LEDGER = HERE / "ledger.json"
BUDGET = 8_700  # of the 10,000 free neurons: real usage ran ~8% above this ledger's estimates

MODELS_URL = {
    "x4v3.onnx": "https://huggingface.co/tamnvcc/Real-ESRGAN-General-x4v3_float/resolve/main/onnx/model.onnx",
    "depth.onnx": "https://huggingface.co/onnx-community/depth-anything-v2-small/resolve/main/onnx/model.onnx",
}

# Cloudflare's published rates, as neurons ($0.011 per 1,000 neurons)
TIERS = {
    "hero": dict(model="@cf/leonardo/phoenix-1.0", w=1536, h=1024, steps=25, tile=527, step=10),
    "bg": dict(model="@cf/black-forest-labs/flux-1-schnell", w=1024, h=1024, steps=4, tile=4.8, step=9.6),
}


def cost(tier):
    t = TIERS[tier]
    tiles = -(-t["w"] // 512) * -(-t["h"] // 512)
    return round(tiles * t["tile"] + t["steps"] * t["step"])


# One art direction for the whole archive: dark matte painting, the site's
# palette (charcoal, bone, one blood red), scale, haze. Never a character's
# likeness or the series' emblems: the archive's own interpretation.
STYLE = (
    "dark cinematic matte painting, epic scale, volumetric light through atmospheric haze, "
    "muted desaturated palette of charcoal black, bone white and deep blood red accents, "
    "painterly film concept art, subtle film grain, highly detailed, no text, no watermark, no logo"
)
NEG = "text, letters, watermark, logo, signature, frame, border, cartoon, anime, cel shading, oversaturated, extra limbs, deformed hands"
WALL = "a colossal perfectly smooth sheer stone wall fifty metres high with no battlements, it dwarfs every building"

# name: (tier, priority (lower first), prompt). Names match lib/data/backgrounds.ts.
QUEUE = {
    # heroes: the opening and the pinned scenes, with depth maps
    "hero-city": ("hero", 1, f"aerial view from very high above at dawn, {WALL}, curving in a giant ring to the horizon, a small medieval town of red tile roofs packed against its inner foot, open farmland and morning mist outside the wall"),
    "hero-rampart": ("hero", 1, f"standing on top of {WALL}, a row of old iron cannons on rails along the wide stone walkway, looking out over an endless empty plain at dusk, storm clouds and a fork of lightning on the horizon, a dizzying drop below"),
    "hero-colossal": ("hero", 2, f"an enormous skinless giant's head with exposed red muscle and bared teeth rising above the top of {WALL}, wreathed in billowing white steam, seen from the rooftops of the town below looking up, birds scattering, terrifying scale"),
    "hero-stair": ("hero", 2, "a narrow worn stone staircase descending into a pitch dark cellar beneath a burned-out house, a single lantern glow on the steps, dust in a shaft of cold daylight from a hatch above, an iron-strapped wooden door at the bottom"),
    "hero-study": ("hero", 3, "a small stone cellar study lit by one oil lamp, an old wooden desk with an open drawer, three worn leather-bound books on it, glass medicine vials and instruments, shelves of jars in deep shadow"),
    "hero-sea": ("hero", 3, "a calm grey sea at dusk under a heavy sky, on the far horizon a vast wall of white steam rising, ominous stillness, a dark rocky shore in the foreground"),
    "hero-march": ("hero", 4, "from far away across a burning plain, an endless line of colossal featureless giants walking side by side, each taller than the clouds, silhouetted in steam and dust against a blood red sunset, a town crushed beneath them"),
    "hero-clouds": ("hero", 4, "high above the clouds at dawn, the heads and shoulders of countless colossal giants rising through a sea of cloud and steam, marching toward the viewer, awe and dread"),
    "hero-desert": ("hero", 5, "a vast desert of pale sand dunes at night under an impossibly dense starfield and milky way, in the far distance a single enormous glowing tree of light branching up into the sky, a tiny kneeling figure on a dune"),
    # section backgrounds (cheap tier; heroes may replace the most visible later)
    "shiganshina845": ("bg", 0, "a vast perfectly smooth featureless grey stone wall like a dam, no towers, no crenellations, rising fifty metres above a small medieval town of red tile roofs, a huge column of white steam rising from behind the top of the wall, dawn, seen from a town street"),
    "shiganshina": ("bg", 0, f"aerial view of a medieval town with red tile roofs packed inside {WALL}, curving away, morning mist, wide panoramic composition"),
    "wallTop": ("bg", 0, f"on top of {WALL}, a wide stone walkway with old cannons, a medieval town far below, golden hour, wide panoramic composition"),
    "trostAerial": ("bg", 0, "aerial view of a large medieval city with a river, canals and bell towers, bounded by an enormous smooth stone wall, overcast, wide panoramic composition"),
    "refugees": ("bg", 0, "a crowd of refugees with carts and bundles crossing a stone bridge toward a massive gate in a colossal wall, dust, dusk, seen from behind"),
    "titansField": ("bg", 0, "a misty green plain at dawn, enormous humanoid giants seen only as dark silhouettes in the fog, a small farmhouse in the foreground, eerie"),
    "colossalBreach": ("bg", 0, "a huge hole smashed through the base of a vast perfectly smooth featureless grey stone wall like a dam, no towers, no crenellations, boulders and dust exploding into a medieval town, seen from inside the town"),
    "ymirDevil": ("bg", 0, "a dark ancient forest at night, a glowing hollow at the roots of an enormous gnarled tree, mystical light, a small girl seen from behind"),
    "scoutsRide": ("bg", 0, "a column of cavalry soldiers in dark green hooded cloaks galloping across an open plain toward a forest of gigantic trees, dust, low sun, seen from behind"),
    "surveyCorps": ("bg", 0, f"a line of soldiers in dark green hooded cloaks standing on top of {WALL} at dawn, seen from behind, cloaks blowing in the wind"),
    "wings": ("bg", 0, "soldiers in green cloaks flying through the air on grappling wires between colossal trees in a forest, sunbeams, motion"),
    "basementRoom": ("bg", 0, "a dark stone cellar room lit by a single oil lamp, a wooden desk, shelves of medical jars, deep shadow"),
    "basementSearch": ("bg", 0, "a lantern lit stone cellar with scattered papers and an opened desk drawer, dust in the air"),
    "threeBooks": ("bg", 0, "three old leather-bound journals on a wooden desk under lamplight, close-up, shallow depth of field, dust"),
    "grishaKey": ("bg", 0, "an old iron key on a cord lying on a dark wooden table, warm rim light, close-up, shallow depth of field"),
    "keyDoor": ("bg", 0, "a heavy wooden cellar door with iron straps and an iron lock at the bottom of stone stairs, lantern light"),
    "leviDoor": ("bg", 0, "a splintered wooden cellar door broken off its hinges, dust hanging in a lantern beam, stone stairs"),
    "ocean": ("bg", 0, "an endless calm ocean at sunrise seen from a pale sand beach, vast and quiet, wide panoramic composition"),
    "liberioCity": ("bg", 0, "an early twentieth century European industrial city at night, brick tenements, searchlights, an airship, factory smoke"),
    "marleyMap": ("bg", 0, "an antique engraved nautical chart on dark aged paper, one large island in an empty sea, fine coastline engraving, rhumb lines and a compass rose, no labels, no writing"),
    "oldMap": ("bg", 0, "a cartographer's desk at night with brass instruments and folded sea charts, candlelight, no writing"),
    "trostFormation": ("bg", 0, f"soldiers with cannons lined along the top of {WALL} above a burning medieval city, smoke"),
    "scoutsShiganshina": ("bg", 0, f"cavalry silhouetted on a hill at night overlooking a ruined medieval town inside {WALL}, moonlight"),
    "odmFlight": ("bg", 0, "a soldier in a green cloak swinging between rooftops of a medieval town on taut steel wires, jets of gas, motion"),
    "aftermath": ("bg", 0, "a field of rubble at dawn after a terrible battle, smoke, a torn green cloak on the stones, a ruined town, silence"),
    "odmCase": ("bg", 0, "an armoury workbench with leather harness straps, steel gas canisters and sword hilts, lamp light, close-up"),
    "stohess": ("bg", 0, "a refined stone city with spires and a cathedral, a street collapsed into ruins, dust, afternoon light"),
    "wallTown": ("bg", 0, "a hill of tall grass under a lone tree at golden hour, a walled medieval town far away, wind"),
    "wallSea": ("bg", 0, "a colossal stone wall crumbling apart to reveal enormous stone-skinned giants inside it, steam rising, seen from far away at dusk"),
    "titansBegin": ("bg", 0, "a vast perfectly smooth featureless grey stone wall like a dam, no towers, no crenellations cracking apart along its whole length, giant grey figures half emerging from inside it, huge plumes of steam, dusk, seen from far away across a plain"),
    "titansMarch": ("bg", 0, "an endless line of colossal giants marching across a plain, dust, blood red sky, seen from far away"),
    "rumblingMarley": ("bg", 0, "colossal giants walking through an industrial city, buildings collapsing, smoke and fire, seen from far away"),
    "titansMarching": ("bg", 0, "an endless line of colossal grey humanoid giants walking at night through steam, seen from very far away, small silhouettes against a glowing horizon, no glowing eyes"),
    "wallTitan": ("bg", 0, "a gigantic stone-skinned face exposed in a broken section of a wall, one eye open, rubble"),
    "pathsStars": ("bg", 0, "a glowing branching tree of light rising into a starry void above a pale sand desert"),
    "ymirMolding": ("bg", 0, "a lone small figure shaping giant figures out of sand in a starlit desert, endless"),
    "grave": ("bg", 0, "a single grave marker under a large lone tree on a grassy hill at dusk, a red scarf on it"),
    "threeSea": ("bg", 0, "exactly three small figures standing side by side on a pale beach seen from behind, facing a calm sunset ocean, wide empty composition"),
}


def load_ledger():
    return json.loads(LEDGER.read_text()) if LEDGER.exists() else {}


def spend(ledger, n):
    d = datetime.datetime.now(datetime.timezone.utc).date().isoformat()
    ledger[d] = ledger.get(d, 0) + n
    LEDGER.write_text(json.dumps(ledger, indent=1, sort_keys=True) + "\n")


def today(ledger):
    return ledger.get(datetime.datetime.now(datetime.timezone.utc).date().isoformat(), 0)


def model(name):
    MODELS.mkdir(exist_ok=True)
    f = MODELS / name
    if not f.exists():
        f.write_bytes(urllib.request.urlopen(MODELS_URL[name], timeout=300).read())
    return str(f)


def call(tier, prompt, seed):
    t = TIERS[tier]
    body = {"prompt": f"{prompt}, {STYLE}"}
    if tier == "hero":  # schnell rejects a seed; Phoenix takes one, so heroes are reproducible
        body |= {"seed": seed, "width": t["w"], "height": t["h"], "num_steps": t["steps"], "negative_prompt": NEG}
    else:
        body |= {"steps": t["steps"]}
    url = f"https://api.cloudflare.com/client/v4/accounts/{os.environ['CF_ACCOUNT_ID']}/ai/run/{t['model']}"
    req = urllib.request.Request(url, data=json.dumps(body).encode(), headers={
        "Authorization": f"Bearer {os.environ['CF_API_TOKEN']}", "Content-Type": "application/json"})
    try:
        r = urllib.request.urlopen(req, timeout=300)
    except urllib.error.HTTPError as e:
        body = e.read()[:300]
        if e.code == 400 and b"NSFW" in body:  # the model's filter refused this prompt: skip it, reword later
            raise ValueError(f"filtered: {body!r}")
        print(f"stopped: {e.code} {body!r}")  # quota or error: never retry here
        raise SystemExit(3 if e.code == 429 else 1)
    data = r.read()
    if "image" in r.headers.get("content-type", ""):
        return data
    d = json.loads(data)
    img = (d.get("result") or {}).get("image")
    if not img:
        raise SystemExit(f"stopped: {json.dumps(d)[:300]}")
    return base64.b64decode(img)


def upscale(im, factor):
    """Real-ESRGAN general x4v3, 128 px tiles with a 16 px overlap"""
    import onnxruntime as ort
    a = np.asarray(im, np.float32) / 255
    H, W, _ = a.shape
    T, O = 128, 16
    S = T - 2 * O
    sess = ort.InferenceSession(model("x4v3.onnx"), providers=["CPUExecutionProvider"])
    pad = np.pad(a, ((O, O + T), (O, O + T), (0, 0)), mode="reflect")
    res = np.zeros((H * 4, W * 4, 3), np.float32)
    for y in range(0, H, S):
        for x in range(0, W, S):
            o = sess.run(None, {"image": pad[y:y + T, x:x + T].transpose(2, 0, 1)[None]})[0][0].transpose(1, 2, 0)
            h, w = min(S * 4, (H - y) * 4), min(S * 4, (W - x) * 4)
            res[y * 4:y * 4 + h, x * 4:x * 4 + w] = o[O * 4:O * 4 + h, O * 4:O * 4 + w]
    out = Image.fromarray((np.clip(res, 0, 1) * 255).round().astype(np.uint8))
    return out.resize((round(W * factor), round(H * factor)), Image.LANCZOS)


def depth(im):
    """Depth Anything V2 small: white is near. Half size, softened, so the
    parallax shader never tears at hard edges."""
    import onnxruntime as ort
    W, H = im.size
    s = 770 / max(W, H)
    w, h = round(W * s / 14) * 14, round(H * s / 14) * 14
    x = np.asarray(im.resize((w, h), Image.BICUBIC), np.float32) / 255
    x = ((x - [0.485, 0.456, 0.406]) / [0.229, 0.224, 0.225]).transpose(2, 0, 1)[None].astype(np.float32)
    sess = ort.InferenceSession(model("depth.onnx"), providers=["CPUExecutionProvider"])
    d = sess.run(None, {sess.get_inputs()[0].name: x})[0][0]
    d = (d - d.min()) / (d.max() - d.min() + 1e-6)
    out = Image.fromarray((d * 255).astype(np.uint8)).resize((W // 2, H // 2), Image.BICUBIC)
    return out.filter(ImageFilter.GaussianBlur(3))


def grade(im):
    """the archive's grade: colour eased, whites held below paper, blacks
    lifted to the page ground, a little grain"""
    im = ImageEnhance.Color(im).enhance(0.92)
    lut = []
    for lo, hi in ((11, 238), (12, 232), (10, 214)):
        lut += [round(lo + (hi - lo) * (v / 255)) for v in range(256)]
    im = im.point(lut)
    noise = Image.effect_noise(im.size, 22).convert("L")
    return Image.blend(im, Image.merge("RGB", (noise,) * 3), 0.035)


def treat(name, tier):
    im = Image.open(RAW / f"{name}.img").convert("RGB")
    if tier == "bg":  # square to a 16:10 band, then x1.875 (1920 wide: 2560 px backdrops decoded mid-scroll dropped frames)
        W, H = im.size
        band = round(W * 10 / 16)
        top = (H - band) // 2
        im = upscale(im.crop((0, top, W, top + band)), 1.875)
    else:  # 1536x1024 to 2560x1707
        im = upscale(im, 2560 / 1536)
        depth(im).save(OUT / f"{name}-depth.webp", quality=82)
    grade(im).save(OUT / f"{name}.webp", quality=80, method=6)
    print("treated", name, im.size)


if __name__ == "__main__":
    dry = "--dry" in sys.argv
    only = [a for a in sys.argv[1:] if not a.startswith("--")]
    RAW.mkdir(parents=True, exist_ok=True)
    OUT.mkdir(parents=True, exist_ok=True)
    ledger = load_ledger()
    todo = [n for n in (only or QUEUE) if not (OUT / f"{n}.webp").exists() or n in only]
    todo.sort(key=lambda n: (QUEUE[n][1], n))
    # raw files already made (an earlier run, same container) only need treating
    for n in [n for n in todo if (RAW / f"{n}.img").exists()]:
        if not dry:
            treat(n, QUEUE[n][0])
        todo.remove(n)
    left = BUDGET - today(ledger)
    for n in todo:
        tier, _, prompt = QUEUE[n]
        c = cost(tier)
        if c > left:
            continue  # a cheaper one may still fit
        print(("would make" if dry else "making"), n, tier, c, "neurons")
        if dry:
            left -= c
            continue
        try:
            data = call(tier, prompt, seed=zlib.crc32(n.encode()) % 2**31)
        except ValueError as err:
            print("skipped", n, err)
            continue
        spend(ledger, c)  # a refused call costs nothing on the free plan
        left -= c
        (RAW / f"{n}.img").write_bytes(data)
        treat(n, tier)
    print("spent today:", today(ledger), "of", BUDGET)
