# RED RISING SAGA — Fan Archive: design.md

Fan-made archive. Not affiliated with Pierce Brown, Del Rey, or Penguin Random House.
Direction: **epic — brutal — cinematic**, secondary: imperial / atmospheric / editorial / monumental / mysterious.
Reference blend: A24 sci-fi film + luxury editorial magazine + classified military archive + ancient Roman monument + modern digital product design. Referenced for principles, not cloned.

## Typography

- **Display** (`Cinzel`) — dramatic serif, very large, high contrast. Hero title, section numerals, monument-scale statements.
- **Heading** (`Cinzel` at smaller weights, or `Fraunces` for editorial body headers) — editorial serif.
- **Body** (`Inter`) — highly readable sans, sentence case.
- **Label** (`Oswald`) — condensed, uppercase, tracking-heavy. Nav, eyebrows, metadata, kickers.

No generic sci-fi display fonts (no Orbitron-style faces). The type should read as history + literature + military command, not as a video game UI.

## Color system

```
--obsidian:      #08090B   /* base canvas */
--charcoal:      #111317   /* raised surface */
--iron:          #252A30   /* card / hairline surface */
--bone:          #E7E1D5   /* primary text, "archive" white */
--ash:           #9B9A94   /* secondary text */
--blood:         #7E1018   /* rebellion accent */
--deep-crimson:  #4A080E   /* blood, darker variant */
--aged-gold:     #B79A61   /* power / hierarchy accent */
--pale-gold:     #D8C38A   /* gold highlight, hover states */
```

Dark is the dominant experience. Gold and red are accents used deliberately (headings, dividers, hover states, the Color Hierarchy visualization) — never as a constant background wash. Gold = power/legacy/hierarchy. Red = rebellion/violence/Darrow/the Rising. Bone/white = archive/literature/memory/truth.

## Material language

Subtle grain (SVG noise overlay, low opacity), faint architectural shadow, engraved hairline dividers, starfield/dust in hero and section transitions, planetary red glow behind key sections. All textures stay under ~6% opacity so nothing fights legibility — this is the brief's own rule ("everything should remain legible") and it's enforced literally in the CSS, not just as a slogan.

## Symbol language

Real canon house sigils used where verified (see `src/data/houses.js` — Augustus/lion, Bellona/eagle, Telemanus/fox, all confirmed against the Red Rising Wiki, not invented). Fan-original geometric motifs (fourteen-point star, orbital line work, engraved slash/razor mark) used for original decorative elements, never presented as official heraldry.

## Spacing & rhythm

8px base unit. Section rhythm is generous (96–160px between major bands) — the brief's "contrast, not everything loud" principle means most of the page is quiet archival typography with a small number of monumental moments (hero, book-scroll, color hierarchy) that go big.

## Motion

Lenis (smooth scroll) + GSAP ScrollTrigger (section reveals, quiet fade/lift only — see the opacity bug already fixed once in this repo's other build; same rule applies here: never gate real content behind opacity:0 pending a scroll event). One genuine 3D moment: a React Three Fiber scroll-driven sequence for the six books, using stylized geometric slabs (not photorealistic covers — avoids the same copyright issue as real cover art, and fits the "archive artifact" aesthetic better than a literal book render).

## What this explicitly is not

Not a template with cards. Not a SaaS landing page with gradients. Not neon cyberpunk. Not "excessive gold gradients." Not Roman cosplay. The brief's ban-list is treated as load-bearing, not decorative.
