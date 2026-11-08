# Terrarum: asset gaps

The queue of assets Terrarum needs but could not source, make or legally use. Prompts are self-contained: paste them into ChatGPT (or Gemini) as they are. Drop results in `terrarum/media-src/` with the expected file name and they will be processed by `scripts/media/process.py` (add the asset's alt text and licence there).

**Rule (the user's, November 2026):** every asset is searched first (Openverse across Commons and Flickr, museum CC0 collections, the other open sources). Only when nothing usable is found is a generation request written here for the user to run. A generated image of a real place is shown labelled as an AI-generated impression, never as a photograph.

## Overview

| | Count |
|---|---|
| Total assets needed | 8 |
| Researching | 2 |
| Prompts ready | 4 |
| Awaiting user-provided assets | 2 |
| Received | 0 |
| Integrated | 1 |
| Verified | 1 |

---

### AG-001: 360° view of Fushimi Inari Taisha

- **Related location:** Fushimi Inari Taisha, Kyoto, Japan
- **UI component:** Place page, "Look around" section (`app/[country]/[region]/[city]/[place]/page.tsx`)
- **Purpose:** The torii tunnels are the place's defining experience; a 360° view is the closest thing to walking them.
- **Priority:** High
- **Status:** Prompt prepared (searched first, nothing found)
- **Source research (searched first):** Openverse across Flickr and Commons, licences CC0/PD/BY/BY-SA/BY-NC/BY-NC-SA, terms "fushimi inari 360", "fushimi equirectangular", "inari equirectangular", "fushimi inari panorama", "fushimi 360", "inari taisha 360", "fushimi inari photosphere", "photosphere kyoto" (three pages each). No 2:1 photo of this shrine exists in the pool; the only "Inari" panoramas were Nezu Shrine in Tokyo. Commons category browsing is rate-blocked from the build container.
- **Required format:** Equirectangular image, exactly 2:1, as large as the tool allows (ideally 4096×2048 or more), JPEG or PNG.
- **Expected filename / directory:** `terrarum/media-src/pano-inari-ai.jpg`
- **Labelling on the site:** "AI-generated impression of the torii paths, not a photograph."
- **Generation prompt:**

  > A seamless 360-degree equirectangular panorama, exactly 2:1, for a VR photo viewer: standing in the middle of a narrow stone-flagged footpath that runs straight ahead and straight behind through a continuous tunnel of closely spaced vermilion Shinto torii gates on a wooded hillside in Kyoto, Japan, in soft overcast daylight. The gates are lacquered vermilion with black-painted bases and black lacquered top beams, set so close together that only thin slits of green forest show between the posts; the posts carry vertical columns of black brush-written donor inscriptions on their sides (illegible, abstract brush strokes, not real characters). Moss on the stones at the foot of the posts, a few stone lanterns, cedar trees above. The image must wrap: the left and right edges join seamlessly, the top is sky and canopy converging to a point, the bottom is the stone path converging to a point, with natural equirectangular distortion. Photographic realism, natural colour, no people, no text overlays, no watermark, no logo, no visible camera or tripod.

- **Integration:** add a manual entry for it in `scripts/media/process.py` with an AI-generated licence note, a `PanoScene` on the place in `lib/content/japan.ts`, and the label above in its description.
- **Verification:** not integrated.

### AG-002: 360° view of Kiyomizu-dera

- **Status:** Prompt prepared (searched first). **Priority:** High.
- **Source research:** the same Openverse search with "kiyomizu 360", "kiyomizu panorama", "kiyomizudera 360", "kiyomizu-dera equirectangular", "kyoto 360x180". About 30 wide flat panoramas exist (CC BY / BY-NC, 1024 px wide, roughly 120° to 180° of view), none a full 360° and all too small to look around in.
- **Expected filename / directory:** `terrarum/media-src/pano-kiyomizu-ai.jpg`. **Labelling:** "AI-generated impression of the stage, not a photograph."
- **Generation prompt:**

  > A seamless 360-degree equirectangular panorama, exactly 2:1, for a VR photo viewer: standing on the broad wooden stage of an ancient Buddhist temple hall built out over a steep wooded hillside in eastern Kyoto, Japan, in late afternoon autumn light. Underfoot, weathered pale hinoki cypress floorboards running toward a low wooden railing; beyond the railing, a sea of red and orange maple and green cedar treetops falling away down the slope, a three-storey vermilion pagoda on the hill to one side, and the city of Kyoto spread across the valley to the far mountains on the horizon. Behind the viewer, the hall's deep dark wooden interior under a heavy cypress-bark roof with massive round wooden columns. The image must wrap: left and right edges join seamlessly, the top converges to sky and the dark roof eaves, the bottom to the floorboards. Photographic realism, natural colour, a few small distant visitors at most and no faces, no text overlays, no watermark, no logo, no camera or tripod.

### AG-003: Higher-resolution panoramas for Nishiki Tenmangū and Kyoto Station

- **UI component:** Place page (Nishiki Market) and city page (Kyoto).
- **Problem:** The two panoramas in use are 1024×512 (the largest size Openverse exposes for these Flickr photos). They are soft when zoomed; the viewer limits zoom (min hfov 60°) to hide it.
- **Route:** The originals on Flickr (user vitroid, CC BY 2.0) may be larger. Downloading the original size needs a Flickr API key or a browser; send the original files or a key.
- **Priority:** Medium. **Status:** Awaiting user-provided asset.

### AG-004: Video for Kyoto places

- **UI component:** Place pages (a "Watch" section, not yet built).
- **Requirement:** Authorised embeds only, from the institutions themselves or official tourism bodies (JNTO, Kyoto City Tourism Association, the temple or shrine). Embed IDs could not be verified from the build container.
- **Route:** Send YouTube links from official channels you trust, or approve a session that checks them.
- **Priority:** Medium. **Status:** Awaiting user-provided asset.

### AG-005: Heian-kyō plan, an illustrated reconstruction

- **Related location:** Kyoto (city page, "A capital drawn on a grid")
- **Purpose:** Show the 794 grid plan and the Suzaku-ōji axis the passage describes.
- **Priority:** Medium. **Status:** Prompt prepared.
- **Why alternatives are insufficient:** No CC0 plan of Heian-kyō found in the Cleveland collection; Commons blocked. A code-drawn SVG needs the plan's block counts and dimensions, which are not yet researched.
- **Required format:** PNG, 1600×2000 (4:5), transparent or `#f1ede4` background.
- **Expected filename:** `media-src/illus-heiankyo-plan.png`
- **Labelling on the site:** "Illustrated reconstruction, AI-generated from a description; not a historical map."
- **Generation prompt:**

  > An illustrated reconstruction of the plan of Heian-kyō, the Japanese capital founded in 794 at present-day Kyoto, drawn as a clean cartographic illustration seen from directly above. A rectangular city laid out on a strict grid of streets, longer north to south than east to west, with one very wide central avenue (Suzaku-ōji) running north to south from a southern gate (Rashōmon) to the palace enclosure (Daidairi) set at the centre of the northern edge. Thin ink linework on warm washi-paper ground #f1ede4, streets in indigo #1c2333, the central avenue and palace enclosure picked out in vermilion #c23b2a, rivers to the east (Kamo) and west (Katsura) in pale grey-blue, low hills suggested along the north, east and west edges with fine hatching. Restrained, scholarly, like a museum plate; no compass rose decorations, no legend, no text or labels of any kind, no Chinese or Japanese characters, no signatures or watermarks. Portrait 4:5, 1600×2000 px, PNG. Leave a 6% empty margin on all sides.

- **Integration:** process to WebP; add as a `kind: "artwork"` entry with a new licence value "AI-generated illustration (user-supplied)"; show beside the "grid" passage with the label above.

### AG-006: Region illustrations for the seven unresearched Japanese regions

- Not needed until those regions are researched. Listed so it is not forgotten. **Priority:** Low. **Status:** Researching.

### AG-007: Social share image

- **UI component:** `og:image` for the home page.
- **Status:** Verified. Rendered from the live globe hero; no generation needed. **Priority:** Low.
- **Integration:** done: home hero screenshotted at 1200×630 (header hidden, reduced motion), `public/og.png`, referenced in `app/layout.tsx`. Re-render if the hero changes.

### AG-008: 360° views for the Maldives and Bern places

- **Related locations:** Hukuru Miskiy (Malé); Zytglogge and the Federal Palace (Bern)
- **UI component:** Place pages, "Look around"
- **Priority:** Medium. **Status:** Prompts prepared (searched first, nothing found)
- **Source research:** Openverse across Flickr and Commons, all CC licences except no-derivatives, terms "male maldives 360", "maldives equirectangular", "maldives photosphere", "bern equirectangular", "bern 360", "bundesplatz 360", "zytglogge 360". Malé: only a 1024×132 strip (CC BY-NC-SA). Bern: nothing. Malé Fish Market already has a real 2005 360° strip.
- **Labelling on the site:** "AI-generated impression, not a photograph."
- **Expected files:** `terrarum/media-src/pano-hukuru-ai.jpg`, `pano-zytglogge-ai.jpg`, `pano-bundesplatz-ai.jpg` (equirectangular, exactly 2:1, as large as the tool allows)
- **Generation prompts:**

  > Hukuru Miskiy: A seamless 360-degree equirectangular panorama, exactly 2:1, for a VR photo viewer: standing in the sandy courtyard of a small 17th-century mosque built of pale carved coral stone blocks in Malé, Maldives, in bright tropical midday light. The low mosque hall sits on a carved coral plinth under a wide pale grey metal roof; beside it a white drum-shaped minaret bound with metal bands; around the courtyard old coral gravestones, some with rounded tops and some pointed, and frangipani and palm trees; modern white city buildings rise beyond the compound wall. The image must wrap seamlessly left to right, sky converging at the top and sand at the bottom. Photographic realism, natural colour, no people, no text, no watermark, no camera.

  > Zytglogge: A seamless 360-degree equirectangular panorama, exactly 2:1, for a VR photo viewer: standing in the middle of a medieval street in the old town of Bern, Switzerland, on an overcast late afternoon, facing a tall stone clock tower with a large painted astronomical clock face and a pointed roof spanning the street through a gate arch. Behind and to both sides, sandstone townhouses with continuous stone arcades at street level, flower boxes, a painted Renaissance fountain on a column in the street, cobblestones and tram rails. The image must wrap seamlessly left to right. Photographic realism, natural colour, a few distant passers-by at most, no faces, no shop signs with readable text, no watermark, no camera.

  > Federal Palace: A seamless 360-degree equirectangular panorama, exactly 2:1, for a VR photo viewer: standing in the middle of a large paved city square in Bern, Switzerland, on a clear morning, facing a grand domed sandstone parliament building of the late 19th century with a central green copper dome and corner towers. Around the square: stately stone bank and office buildings, café terraces, and a grid of small fountain jets set flush in the paving. The image must wrap seamlessly left to right. Photographic realism, natural colour, a few distant people, no faces, no readable text, no flags with emblems, no watermark, no camera.

---

## Credentials that would close gaps

| Service | What it unlocks | Cost |
|---|---|---|
| Mapillary access token | Street-level imagery embeds where coverage exists | Free account |
| Flickr API key | Original-size Flickr downloads (AG-003) | Free account |
| Google Maps Platform key | Street View embeds | Paid beyond a monthly allowance; needs explicit approval |
