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
- Ikaruga (15 Nov 2026): the Fujinoki burial mound. The Agency for Cultural Affairs' records name its finds (crown, shoes, saddle fittings, beads of two burials) and a 2004 council record raises them to National Treasure, but no source read here places the mound in Ikaruga (only search summaries do), so the town page leaves it out. The town's own site (town.ikaruga.nara.jp) resets https connections from here.
- Ikaruga: tatsuta-age, the fried dish said to be named for the river's maples. Only recipe sites and a city press release that "there is a theory" support it; the town page marks food as not applicable instead of using it.

## Media discovery

- Openverse (`api.openverse.org`, anonymous, `page_size` ≤ 20) worked; Wikimedia Commons' API and Openverse thumbnails returned 429 from the build container; the Commons file host worked with standard thumbnail widths (1920, 1280) and a slow, backing-off downloader.
- Cleveland Museum of Art Open Access (CC0) supplied two Hiroshige prints at print resolution.
- Panoramas: Flickr user vitroid (CC BY 2.0), 1024×512 only. A search tagged "Inari" returned Nezu Shrine in Tokyo (tags `nezu`, `tokyo`); rejected as the wrong place.
- Hōryū-ji's own site (horyuji.or.jp) sends the wrong intermediate certificate (GlobalSign RSA DV SSL CA 2018 for a certificate issued by GCC R46 DV TLS CA 2025). It was read with the 2025 intermediate fetched from GlobalSign's AIA address and added to the trust bundle; verification stays on.
- Openverse's Hōryū-ji results are crowded by one photographer's "Primarina in Ikaruga" series (a toy figure); filter it out.
- Video: none verified. YouTube embeds of official channels (JNTO, the temples) were not checked from here.

## Content gaps

writing systems; contemporary life; festivals calendar; the Otowa waterfall today; traders' voices at Nishiki; higher-resolution panoramas; video.

## Update log

- 2026-11-08: research, fact-check, media, vertical slice built.
- 2026-11-15: Chūbu (Fujiyoshida, Kanazawa, Shirakawa-gō, Matsumoto; Mount Fuji, Kenroku-en, Ogimachi, Matsumoto Castle), almost entirely from JTA texts (Fujiyoshida's, Kanazawa's, Shirakawa village's and Matsumoto Castle's own sets, page ids matched by text and by each batch's id offset) and the Statistical Handbook (Fuji 3,776 m; World Heritage years). Cut on re-reading: "from the Pacific to the Sea of Japan", Kanazawa "on the Sea of Japan side" and "one of the largest cities" (the source says castle towns), "Japan's highest" for Fuji (the handbook gives the height; its ranking was not read), "Japanese Alps" for Matsumoto, "cloudy" sake, buses on the Subaru Line. Kanazawa and Matsumoto have no food passage: no source read covers it.
- 2026-11-15: Shikoku (Matsuyama, Takamatsu; Dōgo Onsen Honkan, Ishite-ji, Ritsurin Garden), from Dōgo Onsen's own site, Matsuyama City's tourism site and JTA texts. Ishite-ji's founding and bell come from a multilingual site guide whose author is not named (marked secondary); its gate date matches the Agency for Cultural Affairs' database. The Emon Saburō legend is mentioned, not told: no source read gives the story itself. Cut: Sōseki "as a teacher", Botchan "set in" Matsuyama, Shiki "a Matsuyama man", "stone hand temple", the drum "in its turret". Route length: JTA texts disagree (1,200 km, more than 1,400 km), so the pages say neither.
- 2026-11-15: Chūgoku (Hiroshima, Miyajima, Izumo; Peace Memorial Park, Itsukushima Shrine, Izumo Ōyashiro), mostly from the Japan Tourism Agency texts written with Hiroshima's council, the shrine and the Shimane Museum of Ancient Izumo. Cut on re-reading: "middle country" as the meaning of Chūgoku and its sharing a word with China (no source read), "on the morning of" 6 August (time not in the sources read), "the island's formal name" (the source names the shrine), "storm god" for Susanoo, a victim "sitting" on the bank steps, and Miyajima's municipality (Hatsukaichi) in captions. The Hiroshima visitor count in place-selection.md was not re-read and is not used.
- 2026-11-15: Ikaruga and Hōryū-ji, completing Kansai. Draft lines cut or fenced on re-reading: "orchards" and "the Tatsuta along its western edge" (unsourced); "in the generation before" (Hōryū-ji is a century before Nara); "poets made its maples a byword" (no source read); the Shaka triad's dates, where the two sources disagree (kept to "after the prince died in 622"); "clay" guardians and temple "fire drills" (not in the sources).
- 2026-11-15: Tōhoku (Hiraizumi, Matsushima, Aomori, Rikuzentakata; Chūson-ji, Zuigan-ji, Sannai-Maruyama, Takata-Matsubara), from Chūson-ji's own English and Japanese pages, the Sannai Maruyama Jōmon Culture Center's site, the Iwate Tsunami Memorial Museum's site, the Rikuzentakata tourism association's park guide, the Forestry Agency's Tōhoku office and JTA texts (ids matched by text; a first guess at the Nebuta ids by offset was wrong and was corrected before use). Cut or reworded on re-reading: a barrier "on the road north" (the source says only the Koromo barrier), "only the pond and its islands remain" at Muryōkō-in (the text read breaks off), the Godaidō "on an islet" (true in the photographs, not in any source read), the islands "taking much of the tsunami's force" (the source says only that they sheltered Zuigan-ji), "at the top of Honshu" for Aomori, the Konjikidō "glimmering" (Chūson-ji's own words are that it was decaying and barely gave off light), the plums "by the main hall" (they are in the courtyard). No death toll is given for Rikuzentakata: no primary figure was read. The place page's gallery had been filtering out every photograph the story uses, contrary to its own comment; fixed, so galleries now show the full set on every place page.
- 2026-11-15: Hokkaidō (Sapporo, Shiraoi, Shiretoko, Hakodate; Upopoy, Shiretoko Five Lakes, Goryōkaku), from Upopoy's own English pages (about, Ainu culture, park, memorial site), the Five Lakes field house's site, the Hakodate Magistrate's Office's own history pages (Japanese) and JTA texts. Cut or reworded on re-reading: Hokkaidō as Ainu land "long before the Japanese state reached it" (replaced by what the source says: hunters, gatherers and fishers), a heading implying five metres of snow lie on the ground (485 cm is a year's fall), Rausu "on the eastern side" and "first industry", Hakodate "on a neck of land between two bays" (true in the photographs, not in a source read), Motomachi's "slopes", a line about the kotan being "lived in by the imagination", and an editorial clause in Goryōkaku's summary. No Ainu population figure is given: none was read in an official source. Upopoy's Commons photographs are mostly overcast winter phone shots; the hero is usable but weak and is a candidate for replacement.
- 2026-11-16: Kyūshū and Okinawa (Fukuoka, Dazaifu, Nagasaki, Naha, Yakushima; Dazaifu Tenmangu, Ōura Church, Dejima, Shuri Castle, the Yakusugi forest), completing all eight regions. From Dazaifu Tenmangu's own English pages, Shurijo Castle Park's reconstruction pages and JTA texts; the Ōura and Dejima official sites could not be reached, so those pages rest on JTA texts written with the sites. Cut or reworded on re-reading: Fukuoka as "Kyūshū's largest city" (not in a source read), men carrying Hakata's floats (the source describes Tsuyazaki's), Nagasaki's "Western-style houses on the hillside" (the Glover Garden photographs are shown, but no source for them was read), Naha "grown up round Shuri", the Seiden "rebuilt for the fifth time" (the count is ambiguous), and a causal line tying the army headquarters to the castle's destruction. Shuri's Seiden is described as being rebuilt, with completion planned in fiscal 2026 on the park's own schedule: re-check and update when the park announces it. The sources disagree on the Jōmon Sugi's discovery (1966 or 1968); the page says so. Fukuoka's page is thin (no source for food, buildings or daily life could be read) and is the weakest city page in Japan.
