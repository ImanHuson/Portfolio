"""Turn licensed source images into site media plus an attribution registry.

Inputs (raw files are gitignored, metadata is committed):
  media-src/<key>.jpg          downloaded originals or Commons thumbnails
  media-src/cma-<id>.jpg       Cleveland Museum of Art "print" images (CC0)
  media-src/pano-<flickr>.jpg  Flickr equirectangular panoramas
  scripts/media/openverse-picks.json, openverse-panos.json, <cma id>.json

Outputs:
  public/media/<key>.webp      max 2000 px wide, quality 80
  public/media/<key>-sm.webp   900 px wide, for cards and small screens
  public/pano/<key>.jpg        panoramas, untouched pixels, re-encoded
  lib/content/media.generated.json

Run from terrarum/:  python3 scripts/media/process.py
Nothing is recoloured; the per-country photo filter is CSS, so originals stay
honest documentary photographs.
"""
import json
import os
from PIL import Image

HERE = os.path.dirname(__file__)
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
SRC = os.path.join(ROOT, "media-src")
ACCESSED = "2026-11-08"

LIC = {
    ("cc0", "1.0"): ("CC0 1.0", "https://creativecommons.org/publicdomain/zero/1.0/"),
    ("by", "2.0"): ("CC BY 2.0", "https://creativecommons.org/licenses/by/2.0/"),
    ("by", "2.5"): ("CC BY 2.5", "https://creativecommons.org/licenses/by/2.5/"),
    ("by", "4.0"): ("CC BY 4.0", "https://creativecommons.org/licenses/by/4.0/"),
    ("by-sa", "2.0"): ("CC BY-SA 2.0", "https://creativecommons.org/licenses/by-sa/2.0/"),
    ("by-sa", "2.5"): ("CC BY-SA 2.5", "https://creativecommons.org/licenses/by-sa/2.5/"),
    ("by-sa", "3.0"): ("CC BY-SA 3.0", "https://creativecommons.org/licenses/by-sa/3.0/"),
    ("by", "3.0"): ("CC BY 3.0", "https://creativecommons.org/licenses/by/3.0/"),
    ("by-sa", "4.0"): ("CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0/"),
}

# Written by looking at each image, not from its title.
ALT = {
    "inari-lantern": ("A lantern hanging over a curving path under closely spaced vermilion torii, their posts inscribed in black.", "Fushimi Inari Taisha, Kyoto"),
    "inari-fox": ("A stone fox statue wearing a red bib at the shrine.", "Fushimi Inari Taisha, Kyoto"),
    "inari-inscribed": ("A straight tunnel of vermilion torii, each post painted with black inscriptions.", "Fushimi Inari Taisha, Kyoto"),
    "inari-senbon": ("Sunlight falling in stripes through the gaps of a tunnel of vermilion torii.", "Fushimi Inari Taisha, Kyoto"),
    "inari-curve": ("A path under vermilion torii curving away out of sight.", "Fushimi Inari Taisha, Kyoto"),
    "kiyo-hero": ("Kiyomizu-dera's main hall and wooden stage on its frame of pillars, among autumn trees.", "Kiyomizu-dera, Kyoto"),
    "kiyo-06": ("Kiyomizu-dera lit up at night above the trees, with a pagoda and the lights of the city beyond.", "Kiyomizu-dera, Kyoto"),
    "kiyo-stage": ("The main hall and its crowded stage seen from the side, standing out over the wooded slope.", "Kiyomizu-dera, Kyoto"),
    "kiyo-otowa": ("Looking down from the stage to the Otowa waterfall and the buildings below.", "Kiyomizu-dera, Kyoto"),
    "kiyo-niomon": ("The vermilion two-storey Niō gate at the temple entrance.", "Kiyomizu-dera, Kyoto"),
    "nishiki-hirousu": ("Fried tofu balls (hirōsu) for sale in a shop tray.", "Nishiki Market, Kyoto"),
    "kyoto-yasaka": ("An empty early-morning street of wooden townhouses climbing toward the five-storey Yasaka pagoda.", "Yasaka-dōri, Higashiyama, Kyoto"),
    "kyoto-kamo": ("Stepping stones crossing the shallow Kamo River.", "Kamo River, Kyoto"),
    "nishiki-ignis": ("Shoppers in winter coats at brightly lit stalls along the covered market street.", "Nishiki Market, Kyoto"),
    "nishiki-1": ("Men in white happi coats marked with the character 錦 crowd the covered street during a festival.", "Nishiki Market, Kyoto"),
    "nishiki-tsukemono": ("Wooden barrels of pickled vegetables lining a shop along the covered market street.", "Nishiki Market, Kyoto"),
    "nishiki-kintoki": ("Long red Kintoki carrots on a vegetable stall.", "Nishiki Market, Kyoto"),
    "nishiki-tenmangu": ("The entrance of Nishiki Tenmangū shrine with its lanterns.", "Nishiki Tenmangū, Kyoto"),
    "nishiki-tenmangu-entrance": ("The torii and entrance of Nishiki Tenmangū.", "Nishiki Tenmangū, Kyoto"),
    "nishiki-tofu": ("Blocks of tofu and soy products at a tofu shop.", "Nishiki Market, Kyoto"),
    "kyoto-station": ("The glass and steel front of the Kyoto Station building.", "Kyoto Station, Kyoto"),
    "mv-dhoni": ("A dhoni with a purple hull and a single mast at anchor in a turquoise lagoon.", "Maldives"),
    "mv-fishmonger": ("A fishmonger at a tiled counter cutting a pair of large tuna, smaller reef fish laid out beside them.", "Malé"),
    "mv-male": ("Malé seen from the air: the whole island covered in buildings, ringed by harbours and boats, with other islands in the distance.", "Malé"),
    "mv-male-detail": ("Looking straight down on Malé's packed rooftops and narrow streets.", "Malé"),
    "mv-mosque-ext": ("The Old Friday Mosque: a low coral stone hall on a carved plinth under a pale metal roof.", "Hukuru Miskiy, Malé"),
    "mv-mosque-ext2": ("The side of the mosque, its carved coral plinth and walls under the wide eaves.", "Hukuru Miskiy, Malé"),
    "mv-mosque-hall": ("The prayer hall: dark lacquered wooden columns, a red carpet and light from the doorways.", "Hukuru Miskiy, Malé"),
    "mv-mosque-window": ("A carved wooden lattice screen beneath a panel of Arabic calligraphy.", "Hukuru Miskiy, Malé"),
    "mv-mosque-cemetery": ("Rows of carved coral gravestones, some with rounded tops and some pointed, in the mosque's cemetery.", "Hukuru Miskiy, Malé"),
    "mv-mosque-cemetery2": ("Two coral stone mausoleums with carved panels and wooden doors, among gravestones.", "Hukuru Miskiy, Malé"),
    "pano-mv-fishmarket": ("360° strip photograph of the quay in front of Malé Fish Market, with market sheds and moored boats.", "Malé Fish Market"),
    "ch-bern-hero": ("Bern's old town on its hill above autumn trees, roofs packed together and the Minster spire rising in the middle.", "Bern, from the Rosengarten"),
    "ch-bern-aare": ("Houses along the bank of the green Aare below the old town, the Minster spire above them.", "Bern, the Aare"),
    "ch-zyt-cc0": ("The Zytglogge clock tower at the end of an arcaded street, its large clock face and astronomical dial below a pointed spire.", "Zytglogge, Bern"),
    "ch-zyt": ("A cobbled arcaded street with a Bernese flag hanging out, leading to the Zytglogge tower; a cyclist and walkers in the street.", "Kramgasse, Bern"),
    "ch-kramgasse": ("A painted fountain column in the middle of the arcaded street, with the Zytglogge at its far end.", "Kramgasse, Bern"),
    "ch-palace-eiger": ("The green copper dome of the Parliament Building with the snow-covered Eiger behind it.", "Federal Palace, Bern"),
    "ch-palace-towers": ("Two green copper domes of the Parliament Building, each flying the Swiss flag.", "Federal Palace, Bern"),
    "ch-palace-square": ("A fountain figure on a column, with the Parliament Building's dome behind the trees.", "Bärenplatz, Bern"),
    "ch-landgemeinde": ("Albert Welti's mural of a crowded open-air assembly framed by painted arches, in the Council of States chamber.", "Federal Palace, Bern"),
    "ch-finster": ("The Finsteraarhorn seen from the air: a dark rock pyramid above snowfields and glaciers.", "Finsteraarhorn, Bernese Alps"),
    "cma-shono": ("Woodblock print: travellers bent under hats and capes run up a slope through slanting rain past swaying bamboo.", "Shōno, on the Tōkaidō road"),
    "cma-gion": ("Woodblock print: women with umbrellas pass beneath a stone torii in a shrine precinct under heavy snow.", "The Gion Shrine, Kyoto"),
    "pano-kyoto-station": ("360° photograph of the plaza in front of Kyoto Station.", "Kyoto Station, Kyoto"),
    "pano-nishiki-tenmangu": ("360° photograph at the gateway of Nishiki Tenmangū and a covered arcade.", "Nishiki Tenmangū, Kyoto"),
}


# Titles where Commons' own is markup or a file name.
TITLES = {
    "ch-finden": "The Bernese Alps",
}

# Artworks: (date, repository) shown in the credit instead of a photographer line.
ARTWORK = {
    "ch-finden": ("engraving", "Yale Center for British Art, via Wikimedia Commons"),
}


def creator_name(raw):
    if not raw:
        return "Unknown"
    return raw.split(" from ")[0].strip()


def save(img, key, out):
    img = img.convert("RGB")
    w, h = img.size
    big = img if w <= 2000 else img.resize((2000, round(h * 2000 / w)), Image.LANCZOS)
    big.save(os.path.join(ROOT, "public", "media", f"{key}.webp"), quality=80, method=6)
    sm = img.resize((900, round(h * 900 / w)), Image.LANCZOS) if w > 900 else img
    sm.save(os.path.join(ROOT, "public", "media", f"{key}-sm.webp"), quality=78, method=6)
    out["width"], out["height"] = big.size


def main():
    os.makedirs(os.path.join(ROOT, "public", "media"), exist_ok=True)
    os.makedirs(os.path.join(ROOT, "public", "pano"), exist_ok=True)
    registry = []
    picks = {}
    for name in sorted(os.listdir(HERE)):
        if name.startswith("picks-") and name.endswith(".json"):
            picks.update(json.load(open(os.path.join(HERE, name))))
    for key, p in picks.items():
        f = os.path.join(SRC, f"{key}.jpg")
        if key not in ALT:
            continue  # downloaded as a candidate but not used on the site
        if not os.path.exists(f):
            print("missing", key)
            continue
        lic, lurl = LIC[(p["license"], p["lv"])]
        alt, loc = ALT[key]
        title = TITLES.get(key) or (p["title"].removeprefix("File:").rsplit(".", 1)[0] if p["title"].startswith("File:") else p["title"])
        item = {
            "id": key, "kind": "artwork" if key in ARTWORK else "photo", "title": title,
            "creator": creator_name(p.get("creator")), "sourceUrl": p["landing"], "repository": "Wikimedia Commons",
            "license": lic, "licenseUrl": lurl, "src": f"/media/{key}.webp", "alt": alt, "location": loc,
            "modified": "Resized and converted to WebP", "accessed": ACCESSED, "status": "license-verified", "hosting": "local-copy",
        }
        if key in ARTWORK:
            item["date"], item["repository"] = ARTWORK[key]
            item.pop("modified")
        save(Image.open(f), key, item)
        registry.append(item)
    for key, p in json.load(open(os.path.join(HERE, "panos-commons.json"))).items():
        f = os.path.join(SRC, f"{key}.jpg")
        if key not in ALT or not os.path.exists(f):
            continue
        img = Image.open(f).convert("RGB")
        img.save(os.path.join(ROOT, "public", "pano", f"{key}.jpg"), quality=88)
        lic, lurl = LIC[(p["license"], p["lv"])]
        alt, loc = ALT[key]
        registry.append({
            "id": key, "kind": "panorama", "title": p["title"], "creator": creator_name(p.get("creator")),
            "sourceUrl": p["landing"], "repository": "Wikimedia Commons", "license": lic, "licenseUrl": lurl,
            "src": f"/pano/{key}.jpg", "width": img.size[0], "height": img.size[1], "alt": alt, "location": loc,
            "modified": "Resized and re-encoded as JPEG", "accessed": ACCESSED, "status": "license-verified", "hosting": "local-copy",
        })
    for fid, p in json.load(open(os.path.join(HERE, "openverse-panos.json"))).items():
        key = {"3667254503": "pano-kyoto-station", "4259644860": "pano-nishiki-tenmangu"}[fid]
        f = os.path.join(SRC, f"pano-{fid}.jpg")
        img = Image.open(f).convert("RGB")
        img.save(os.path.join(ROOT, "public", "pano", f"{key}.jpg"), quality=90)
        lic, lurl = LIC[(p["license"], p["license_version"])]
        alt, loc = ALT[key]
        registry.append({
            "id": key, "kind": "panorama", "title": p["title"], "creator": p["creator"], "creatorUrl": p.get("creator_url"),
            "sourceUrl": p["foreign_landing_url"], "repository": "Flickr", "license": lic, "licenseUrl": lurl,
            "src": f"/pano/{key}.jpg", "width": img.size[0], "height": img.size[1], "alt": alt, "location": loc,
            "modified": "Re-encoded as JPEG", "accessed": ACCESSED, "status": "license-verified", "hosting": "local-copy",
        })
    for cid, key in (("126086", "cma-shono"), ("106961", "cma-gion")):
        a = json.load(open(os.path.join(HERE, f"{cid}.json")))["data"]
        alt, loc = ALT[key]
        item = {
            "id": key, "kind": "artwork", "title": a["title"], "creator": a["creators"][0]["description"],
            "sourceUrl": a["url"], "repository": "Cleveland Museum of Art Open Access", "license": "CC0 1.0",
            "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/", "src": f"/media/{key}.webp",
            "alt": alt, "location": loc, "date": a["creation_date"], "accessed": ACCESSED, "status": "license-verified",
            "hosting": "local-copy",
        }
        save(Image.open(os.path.join(SRC, f"cma-{cid}.jpg")), key, item)
        registry.append(item)
    with open(os.path.join(ROOT, "lib", "content", "media.generated.json"), "w") as fh:
        json.dump(registry, fh, indent=1, ensure_ascii=False)
    print(len(registry), "assets")


if __name__ == "__main__":
    main()
