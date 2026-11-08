# Japan: research dossier

Status: open (Milestone 2 vertical slice). Researched 2026-11-08.

Published content lives in `lib/content/japan.ts`; every passage there cites ids from `lib/content/sources.ts`. This file is the trail behind it: what each source was read for, what was cut, and what is still missing.

## Scope of the vertical slice

Globe → Japan → Kansai → Kyoto → Nishiki Market / Fushimi Inari Taisha / Kiyomizu-dera.

Kyoto's three places were chosen partly by what legitimate media exists. Only Nishiki Market (at Nishiki Tenmangū) and Kyoto Station have openly licensed equirectangular panoramas; Fushimi Inari and Kiyomizu-dera have none in Openverse, so their pages say so instead of showing a stand-in.

## Sources read, and what they support

| Source | Read for | Reliability |
|---|---|---|
| Statistical Handbook of Japan 2026 (Statistics Bureau) | Land area 377,980 km², islands, terrain, population 123.80 m (2024), 47 prefectures, Kyoto City 1,464,000 (2020 census), Kinki metro area 19.2 m (2020), Kyoto climate normals, foreign visitors 36.87 m (2024) and 42.68 m (2025, provisional), World Heritage list, washoku on UNESCO's intangible list | Primary, government |
| Fushimi Inari Taisha (inari.jp): About, History, FAQ, precinct map | 711 enshrinement, ~30,000 Inari shrines, Fudoki origin story, Ōnin destruction 1468, rebuilding 1499, main gate 1589, 233 m Inariyama, ~10,000 torii, foxes as messengers, vermilion pigment, precinct 870,000 m² | Primary; it is the shrine's own account of its origins and is presented as such |
| Kiyomizu-dera (kiyomizudera.or.jp): home, Learn | Founded 778, founding story, grounds and buildings, fires, stage restoration 2008-2020, earthquake-resistant frame, the "jump off the stage" saying, Kannon image | Primary |
| National Diet Library, Kiyomizu-dera column (Japanese) | Main Hall rebuilt 1633 with Tokugawa Iemitsu's help; National Treasure; stage ~13 m | Primary, national library |
| Kyoto Nishiki Market association (kyoto-nishiki.or.jp) | 1615 recognition, Heian estimate, groundwater 15-18 °C, wells, 390 m length, products, Itō Jakuchū, old street names | Primary; market association |
| City of Kyoto, World Heritage page | 17 properties (A-Q), inscription December 1994, eligibility rules; confirms Kiyomizu-dera is a component and Fushimi Inari is not | Primary, municipal |
| Nippon.com, "Imperial City" | 794 founding on Chinese models, Suzaku-ōji, Ōnin War, 1869 move to Tokyo | Reputable feature by an architectural historian |
| Nippon.com, religious adherents | End-2016 yearbook counts and why they exceed the population; Buddhism's arrival and the Meiji separation | Reputable; based on the Agency for Cultural Affairs yearbook |
| Columbia University, Asia for Educators timeline | Period names and dates | Academic teaching resource; gives Nara as 710-814, flagged on the page |
| The Japan Times, Ainu language | UNESCO atlas: eight endangered languages, Ainu the only critically endangered | Reputable newspaper citing the atlas definition |
| OpenStreetMap via Nominatim | Coordinates: Nishiki Market (way 772134672), Fushimi Inari Rōmon gate (node 10964856510), Inariyama summit (node 2503700051), Kiyomizu-dera (way 336641107), Nishiki Tenmangū (way 1304786192) | Open data |

## Claims cut or corrected during checking

- "Each torii carries the name of whoever gave it": not stated by the shrine's FAQ. Cut. (The inscriptions are visible in the photographs, but what they say was not verified.)
- "Sei Shōnagon, around the year 1000": the shrine's history gives no date for her visit. Date cut.
- Edo period note "woodblock prints among it": not in the cited timeline. Cut.
- "Most often over Mie" (where Kansai's boundary is disputed): only search-result support. Cut; the page says only that definitions differ.
- Global Voices (2009) called Ainu "severely endangered"; The Japan Times quotes the atlas's "critically endangered" definition. Global Voices dropped as a source.
- "Fox statues guard the shrine buildings": rewritten to describe only what is pictured.
- Jakuchū painting "from shops like his family's": rewritten to what the source says (the vegetables he painted).
- Columbia's Nara end date (814) differs from the usual 794; the page uses 794 and explains why.

## Unverified, not published

- Kyoto Station building's architect and opening year (only a Commons file title supports 1997).
- Whether the festival photo in Nishiki Market (men in 錦 happi coats) shows the Gion Festival's Nishigoza mikoshi. The market association says Nishiki carries one of the festival's mikoshi, but the photo is undated and uncaptioned, so the page does not link the two.
- 2024 country ranking of international arrivals (see `research/expansion.md`).

## Media discovery

- Openverse (`api.openverse.org`, anonymous, `page_size` ≤ 20) worked; Wikimedia Commons' API and Openverse thumbnails returned 429 from the build container; the Commons file host worked with standard thumbnail widths (1920, 1280) and a slow, backing-off downloader.
- Cleveland Museum of Art Open Access (CC0) supplied two Hiroshige prints at print resolution.
- Panoramas: Flickr user vitroid (CC BY 2.0), 1024×512 only. A search tagged "Inari" returned Nezu Shrine in Tokyo (tags `nezu`, `tokyo`); rejected as the wrong place.
- Video: none verified. YouTube embeds of official channels (JNTO, the temples) were not checked from here.

## Content gaps

Seven of eight regions; Tokyo; writing systems; contemporary life; festivals calendar; the Otowa waterfall today; traders' voices at Nishiki; higher-resolution panoramas; video.

## Update log

- 2026-11-08: research, fact-check, media, vertical slice built.
