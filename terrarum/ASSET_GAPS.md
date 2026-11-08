# Voyager: asset gaps

The queue of assets Voyager needs but could not source, make or legally use. Prompts are self-contained: paste them into ChatGPT (or Gemini) as they are. Drop results in `voyager/media-src/` with the expected file name and they will be processed by `scripts/media/process.py` (add the asset's alt text and licence there).

**Rule that overrides the brief here:** a generated image never stands in for a photograph or a 360° view of a real place. The brief asks for prompts for missing panoramas; a generated panorama of Fushimi Inari would be a fabricated photograph of a real location, which the same brief forbids. Those gaps are filled by sourcing, not generation, and say so below.

## Overview

| | Count |
|---|---|
| Total assets needed | 7 |
| Researching (sourcing, not generation) | 4 |
| Prompts ready | 1 |
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
- **Status:** Researching (sourcing, not generation)
- **Source research:** Openverse (Flickr + Commons), searches "fushimi inari 360", "fushimi equirectangular", "inari equirectangular". Only results were Tokyo shrines (Nezu, tagged `nezu, tokyo`), rejected. Wikimedia Commons category search blocked (HTTP 429) from the build container.
- **Why alternatives are insufficient:** No openly licensed equirectangular photo of this shrine was found. Generating one would fabricate a real place.
- **Routes to close it:** (1) Search Wikimedia Commons' "360° panoramas of Fushimi Inari-taisha" category from a normal browser and send the file names; (2) a Mapillary access token (free account) would allow embedding Mapillary's street-level imagery, if any exists on the paths; (3) Google Street View embed (paid API key, terms forbid storing imagery; needs your approval and key); (4) your own 360° photo if you visit.
- **Required format:** Equirectangular JPEG, 2:1, at least 4096×2048.
- **Expected filename / directory:** `media-src/pano-inari-<name>.jpg`
- **Integration:** add to `scripts/media/openverse-panos.json` (or a new manual entry), add a `PanoScene` to the place in `lib/content/japan.ts`.
- **Verification:** not integrated.

### AG-002: 360° view of Kiyomizu-dera

- Same as AG-001 for Kiyomizu-dera (stage and main hall). Searches: "kiyomizu equirectangular", "kyoto 360x180". **Status:** Researching. **Priority:** High.

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

---

## Credentials that would close gaps

| Service | What it unlocks | Cost |
|---|---|---|
| Mapillary access token | Street-level imagery embeds where coverage exists | Free account |
| Flickr API key | Original-size Flickr downloads (AG-003) | Free account |
| Google Maps Platform key | Street View embeds | Paid beyond a monthly allowance; needs explicit approval |
