# Section backgrounds to generate (Gemini Nano Banana or ChatGPT)

These are the sections whose background needs a real illustration or
photographic environment, which the tools in this repo can't make well (they
read as game assets). Paste one prompt per image. Save each result in
`attack-on-titan-archive/bg-src/` with the exact file name given, then the
treatment script grades it into the site's look:

    cd attack-on-titan-archive && python3 -I scripts/bg/treat.py

**For every prompt, keep these rules (they're already written into each one):**
no people or characters (a likeness of the show's characters is both a
copyright problem and the thing image models get wrong), no text, no logos,
no watermark, no frame or border.

**Palette (site tokens):**
- ground `#0b0c0a`
- paper `#d8d0b8`
- ash `#8f8a7a`
- the one accent, blood `#6e1717` / `#a8261c`

Every background sits under text, so each needs **quiet, darker space on the
left third**.

---

## 1. `paths-wide.png` (Paths, desktop): highest priority

Your Paths artwork is portrait, 768 × 1376. On a wide screen it's shown at
full height in the centre with black at the sides, which works, but a wide
version would fill the frame.

> A vast dark void at night, deep navy-black (#05070f), with a colossal tree made of luminous threads rising from the bottom centre and branching outward and upward across the whole frame. The trunk is a braid of warm gold light (#f2d58a), and the branches cool into teal and aqua (#3fd1b5, #2a8fa0) as they spread into thousands of fine glowing filaments. Tiny motes of light drift upward. Soft volumetric glow, subtle depth of field, cinematic and quiet, otherworldly. A faint desert horizon line at the very bottom. Keep the left third darker and emptier for text. No people, no figures, no text, no logos, no watermark, no border. 16:9, at least 2560 × 1440, PNG.

## 2. `soldiers.png` (The Soldiers, behind the personnel desk)

> Top-down photograph of an old wooden military desk in a dim barracks at night, lit by a single warm oil lamp from the upper right. On the desk: a folded dark green wool cloak with an embroidered emblem out of focus (no readable symbol), leather straps and buckles, a brass compass, scattered blank paper files tied with string, wax drips, an inkwell. Rich texture, shallow depth of field, cinematic, desaturated with warm highlights (#d8d0b8) and deep shadows (#0b0c0a). The left third is dark empty desk surface for text. No people, no hands, no readable text or insignia, no logos, no watermark, no border. 16:9, at least 2400 × 1350, PNG.

## 3. `titans-lab.png` (The Titans, the inheritance rules)

> Interior of a vast 19th-century anatomical research hall, stone vaults disappearing into darkness, tall arched windows with cold grey daylight. Enormous anatomical drawings of a giant humanoid's skeleton and muscles pinned to wooden boards on the walls, rendered as faint sepia engravings (too far to read). Dust in the light shafts, iron scaffolding, glass jars on shelves. Moody, cold blue-grey shadows (#1a1b17) with warm paper highlights (#d8d0b8). Left third dark and empty. No people, no creatures in the room, no readable text, no logos, no watermark, no border. 16:9, at least 2400 × 1350, PNG.

## 4. `liberio.png` (The World, around the Marleyan file)

> A walled internment district in an early-20th-century European port city at dusk, seen from a high window: narrow brick streets, tenement roofs, a tall grim concrete wall with a guarded gate cutting through the district, gas lamps coming on, haze from chimneys, a harbour with steamships in the far background. Muted concrete greys (#3b3832), warm lamplight, deep shadow (#0b0c0a). Cinematic, melancholic, painterly realism. Left third darker (shadowed rooftops). No people visible, no flags or readable text, no logos, no watermark, no border. 16:9, at least 2400 × 1350, PNG.

## 5. `forest.png` (The War, the ODM gear section)

> Inside a forest of impossibly giant trees: trunks as wide as houses rising out of frame, roots like walls, the canopy hundreds of metres up, beams of hazy morning light cutting down through the mist, moss and bark texture in sharp detail in the foreground, deep green-black shadows (#0b0c0a) and pale gold light (#d8d0b8). Sense of enormous vertical scale. Cinematic, photographic. Left third in shadow. No people, no animals, no text, no logos, no watermark, no border. 16:9, at least 2400 × 1350, PNG.

## 6. `memorial.png` (The War, the memorial)

> A long stone memorial wall at night in a quiet square, engraved with endless rows of names too small and blurred to read, a few candles and wilted wildflowers at its foot, soft rain on the flagstones reflecting the candlelight, cold blue night (#0b0c0a) with warm candle highlights. Solemn, still, cinematic, shallow depth of field. Left third dark. No people, no readable text, no flags, no logos, no watermark, no border. 16:9, at least 2400 × 1350, PNG.

## 7. `archive.png` (the home page, behind "Ten files")

> A dim archive room: tall wooden shelves of bound military files and boxes receding into darkness, a long table in the foreground with an unrolled hand-drawn map of three concentric walls (no readable labels), a brass lamp, dust in a beam of light from a high window. Warm paper tones (#d8d0b8) against deep shadow (#0b0c0a), one small red wax seal on a file as the only colour accent (#a8261c). Cinematic, still. Left third dark. No people, no readable text, no logos, no watermark, no border. 16:9, at least 2400 × 1350, PNG.

---

When you send them, I'll run the treatment, wire each one into its section,
check them at phone and desktop size, and deploy. If any comes back with text
in it, extra limbs, or a character's face, I'll say so rather than ship it.
