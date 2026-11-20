# Japan: design direction (round 4 redesign)

## Why this exists

The first Japan build applied the brief's identity list (palette, Mincho type,
washi grain, vertical names, a sideways photo strip) as a skin over a generic
article template: a light cream ground, a boxed hero, a narrow text column with
small marginal photos, the same card grid on every page. The user's verdict was
that it read as "just another tour site or Wikipedia", plain, archival, not
premium. They were right, and the cause was that no research had been done on
what makes this kind of site feel premium; the effort had all gone into content.

## What the research found

Reference sites looked at in a browser at 1440 px (Nov 2026): HOSHINOYA
(hoshinoya.com), Aman Kyoto (aman.com), My Switzerland (myswitzerland.com), the
Kyoto City official guide (kyoto.travel), Japan House London. Practitioner
writing on luxury and Japanese web design (the utsubo Japanese web design guide,
IIAD "why some websites just feel expensive", KIJO) agrees with what the sites
show; none of it is measured research, so it is treated as consensus, not proof.

1. Atmosphere, not a flat colour. HOSHINOYA sits on a near-black green ground
   with a soft radial glow: the page has depth and light. A flat cream ground is
   the most common generic choice (the taste skill lists #efeae0-family creams as
   the default AI palette), and it is what we had.
2. Photography at full scale, sizes varied, with ma. Aman and HOSHINOYA give a
   photograph the whole screen, then offset a smaller one against open space.
   Ma (間) is the interval that gives an element weight, not leftover space.
3. Type as image. The Kyoto guide sets 京都 enormous and faint behind content.
4. One screen, one moment. Each step of a scroll shows one image and one idea.
5. Slow, quiet motion: a hero that drifts, images that settle, galleries that are
   moved through rather than browsed.
6. Documentary journalism's answer to "it reads like an archive" is scroll-told
   storytelling: a full-screen photograph stays pinned while short passages pass
   over or beside it, and the picture changes with the story.

## Decisions

- **Ground: sumi night.** Japan is locked to a dark sumi-indigo ground with a
  fixed atmosphere layer (an indigo glow from the upper left, a faint ember from
  the lower right, a vignette, washi grain). Photographs and the Edo prints carry
  the colour; the page is the dark room they hang in. Locked dark because the
  light cream was the generic default and because the photographs read better
  on dark; other countries keep their own grounds.
- **Palette:** sumi ground, ivory text, shu vermilion as the one accent, used
  sparingly (vertical names, rules, active states), and hinoki wood as a
  secondary material tone: the hand-scroll runs between two wooden rollers and
  the figures are divided by wooden rules, as a shoji frame or notice board is.
- **Bokashi:** the ground's top band is a graded indigo, the technique of the
  prussian-blue skies in Hiroshige's prints, rather than an arbitrary glow.
- **Not used as identity:** cherry blossoms, anime and neon. The brief warns
  against reducing Japan to them; as motifs they are the most worn Japan
  clichés online, and anime imagery is copyrighted. They belong in content, in
  proportion (hanami in the seasons, manga and anime in the art chapter with
  licensed or official material only, Tokyo's night districts on its page).
- **Contemporary Japan:** the first region open is mostly temples; the balance
  comes with Tokyo, Naoshima and the other regions, and the identity must not
  read as "old Japan only".
- **Type:** Shippori Mincho for display at a much larger scale; the native name
  doubles as a typographic image, huge and faint, behind the opening statement
  or the band of figures (on the photograph it muddied the picture).
- **Heroes:** every page opens on a full-screen photograph that drifts slowly,
  with the title low on the left and the vertical native name on the right.
- **Passages become a scroll-told story:** a pinned full-height photograph on
  one side, passages on the other; the photograph changes as each passage comes
  into view. On phones, and without JavaScript, each passage carries its own
  photograph above it.
- **Facts become a band of large figures**, not a list.
- **The gallery becomes a real hand-scroll:** a pinned section that unrolls
  right to left as the reader scrolls, photographs at varied heights with open
  space between them; selecting one opens a full-screen viewer.
- **Places to go next become an asymmetric collage**, one large, others smaller.
- **Maps go dark** to sit in the same night.
- Motion uses GSAP ScrollTrigger only where something is pinned or scrubbed, and
  CSS scroll-driven animation elsewhere; everything is still under reduced motion.

## Kept

All content, citations, URLs, credits, the sound design, accessibility (WCAG AA),
reading without JavaScript, and static export.

## Round 6: place cards (Nov 2026)

The user found the collage tiles flat and asked about a 3D tilt, depth-map
parallax and frosted glass. Thirteen sites were measured in a browser (glass,
gradients, photos moving inside their frames) and screenshotted: Aman, HOSHINO
Resorts and HOSHINOYA Kyoto, MySwitzerland, Kyoto Travel, JNTO, National
Geographic, Condé Nast Traveler, Apple, Leica, Locomotive, darkroom.engineering.
Lusion, Aesop, Rolex, Bottega Veneta and Awwwards gave no usable reading
(WebGL-only, or a blocked automated browser).

- **No glass on content cards anywhere.** Glass appears only on chrome:
  headers and small buttons (MySwitzerland, Leica, Kyoto Travel).
- **The premium sites keep the photograph clean.** Text sits below or beside
  it (Aman, Apple, Leica, Condé Nast, HOSHINOYA), or in a solid label that
  overlaps the photo's edge (HOSHINO Resorts, Leica, MySwitzerland's
  Matterhorn).
- **Long dark overlays carrying text are the tourism-board look** (JNTO,
  MySwitzerland's tiles).
- Photos moving inside their frames were rare. Motion on cards is a short fade
  on load (Aman, 0.5 s) or a reveal on hover (Locomotive).

What changed in `Collage`:
- The summary moved off the photograph, below it.
- Only the name sits on the photo, on a band sized to the text block plus 5rem
  above it. Before, a scrim covered 70% of every tile; the band now covers
  about a third on desktop and 40 to 47% on phones.
- Phone tiles are 4:5, so the band stays under half the tile.
- The photo is 116% of its frame and drifts through it on a CSS `view()`
  timeline.
- On hover, the photo grows slightly (`scale`, so it composes with the drift)
  and the vermilion mark lengthens.
- `sizes` accounts for the photo being drawn wider than a portrait tile.

**Blur was built, measured and removed.** On the Kyoto page, median frame time
while scrolling, desktop:

| Version | Median frame time |
|---|---|
| Old version | 16.7 ms |
| With `backdrop-filter` | 33.4 ms |
| With a blurred copy of the photo | 33.3 ms |
| Without blur | 16.7 ms |

The drift itself costs nothing. A blur over a moving photo is redrawn every
frame. Don't add one to scrolling content.
