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

## 16 Nov 2026: History chapter

Sources read in full: Columbia's Asia for Educators essays (Heian, the samurai centuries, Meiji, the road to war, the occupation) and its period timeline, the official Jōmon World Heritage site's period page, the Statistical Handbook (chapters 2 and 3), plus JTA texts already used on place pages (Sannai-Maruyama, Hōryū-ji, Dejima, the Hidden Christian sites, Shuri, the Atomic Bomb Dome, the Miracle Pine).

Cut or changed on re-reading against the sources: "the future Tokyo" for Edo (not in the essays), "fan-shaped" and "empty island" for Dejima, "mostly" from the lower samurai, "unions were legalised" (a few existed before the war), "ruled from Shuri Castle" (the text calls it the dynasty's monument), "growing rich on sea trade", and "before the twentieth century" for the Mongol invasions (the essay says before the Second World War). Not used from the samurai essay: 1263 for Khubilai as emperor of China and 1333 for the Ashikaga (the timeline's 1336 is used).

Not covered because no source here supports it: the annexation of Korea by year, the Ainu and the settlement of Hokkaidō under Meiji, the annexation of Ryukyu, the death tolls of the war and the bombings, and anything after 1990 beyond population figures and the 2011 tsunami. web-japan.org, mofa.go.jp and Britannica refuse this machine.

## 16 Nov 2026: Religion and belief chapter

Sources read in full: Jinja Honcho's Shinto page and FAQ, the Sōtō school's own history page, and texts already used on place pages (Hōryū-ji, Tōdai-ji, Kōyasan, Kōtoku-in, Kenchō-ji, Daishō-in, Chūson-ji, Muryōkō-in, Meiji Jingū, the Shikoku pilgrimage, Izumo's Kamiari festival, the Hidden Christian sites, Upopoy).

Cut on re-reading: that the myths "are not holy books in the sense a Bible is"; that the court was building temples "within a few decades"; "the emperor" and "bronze" for the Nara Great Buddha (the temple's history page as noted gives neither); that Kūkai "rests in meditation still" (the source says he died in meditation and was laid in a grotto); a line that the schools differ in what they ask a person to do; "reciting his name" as a gloss of nenbutsu; Confucianism as "more a set of ideas than a religion"; that temples have "halls for images of the Buddha"; "small" for the Konjikidō; that Bon is Buddhist (the Sapporo text only describes the dancing); that the parishioner system "tied households to temples".

Not covered because no source here supports it: numbers of adherents by religion (the Agency for Cultural Affairs yearbook was not read), Tendai and Nichiren, new religions, Okinawan belief, Islam and other faiths of residents.

## 16 Nov 2026: Food chapter

Sources: the Ministry of Agriculture's WASHOKU booklet (36 pages; the pages on the prologue, respect for nature, family and region, special occasions, regional diversity, the chronology, menu structure, foodstuff, flavour and sake were read), UNESCO's 2013 listing text, and texts already used on place pages (Sanuki udon, Hiroshima okonomiyaki and oysters, Nikkō yuba, awamori, Tokyo local food and Edomae sushi, Osaka's kuidaore).

Cut on re-reading: "burdock" in the vegetable list, "a warm current and a cold one" (the booklet names the currents, not their temperatures), "in the nineteenth century" for the end of the meat ban, "the chemist" and "was named" for Ikeda and umami, rice farming "from the continent", "temple kitchens", "Portuguese and Spanish" for the Nanban trade, "after 1868", "grows less than 40% of its own food" (the booklet gives a self-sufficiency ratio), a gloss of nigiri as "a slice of fish on a ball of rice", "stall-keeper" for Hanaya Yohei, "pine" for kadomatsu and "spiced" for otoso.

The booklet's chronology prints as a table whose period columns do not survive text extraction, so the chapter gives no period for tofu, Eisai's tea, honzen ryōri or the first cookbook beyond what the entries themselves say. Not covered: ramen, curry rice, convenience-store food, school lunches, tea and sweets in any detail, whisky and beer; the booklet's pages on nutrition, arrangement, chopsticks and sweets were not read.

## 16 Nov 2026: Language chapter

Sources read in full: Columbia's Asia for Educators essay on the Japanese language, the Agency for Cultural Affairs page on endangered languages and dialects (UNESCO's 2009 atlas: eight in Japan), the agency's page for the 2010 jōyō kanji cabinet notice, NINJAL's endangered-languages database front page, plus the Upopoy and JTA texts on Ainu already in use.

Not used from the Columbia essay: its school kanji counts (881 and 1,850), which are from an older list. The agency's notice page does not state the number of jōyō kanji, so the chapter gives the date of the list and no count. Cut on re-reading: "a working language", particles "follow a noun", a word-by-word gloss of the example sentence, "most of them a consonant followed by a vowel", "four beats", "the hardest thing for a learner", "no neat English equivalent", "in print", "Japanese had no script of its own", "the oldest neighbour inside the country", "the most serious category", "in the far south-west" for Yaeyama and Yonaguni.

Not covered because no source here supports it: the number of speakers, whether Japanese is related to any other language, regional dialects such as Kansai speech, keigo in detail, foreign residents' languages, sign language.

## 16 Nov 2026: Architecture and art chapter

Sources: JTA texts read in full from the bulk file and matched to their page ids by text (Rinpa R1-01716, calligraphy R1-01555, Arita ware R2-01921, Nishijin-ori R2-01452, Unkei's Mujaku and Seshin R1-00254, the Tōgudō R1-00459, Benesse Art Site Naoshima R2-01886, the Setouchi Triennale R2-01890, the Wajima Lacquer Museum R4-00536), plus sources already used on place pages (Hōryū-ji, Nikkō Tōshōgū, Himeji, Ogimachi, Kōtoku-in, the Peace Memorial Museum).

Cut on re-reading: "the shogun" for Yoshimasa, a line that white walls gave Himeji its name, "steep thatched" for gasshō roofs, "its most lavish descendant" for Rinpa, "gold leaf above all", "sculpture in Japan is mostly Buddhist, and its greatest name is Unkei", "Europe knew it as Imari ware" (the text says the name came from shipping through Imari), "modern Japanese architecture found its voice in Hiroshima", and Naoshima as "one of the country's best-known art sites".

Photography is marked not written: no source was read. Also missing for the same reason: ukiyo-e prints (the corpus mentions them only in passing; prints by Hiroshige are shown with their museum credits but nothing is claimed about the genre), ink painting, gardens, tea-house architecture, mingei, manga and graphic design, and architects other than Tange and Andō. The Kano sliding-panel text at Myōhō-in was read but its page id could not be matched, so it is not cited.

## 16 Nov 2026: Music, literature and performance chapter

Sources: JTA texts read in full and matched to their page ids by text (the Chūson-ji noh stage R1-00019, noh on Sado R1-01451, kabuki H30-01116, gagaku R1-01552, Bashō in Ōtsu R2-01414, Takachiho yokagura R1-01024, the Awa puppet theatre R2-01791, San'yūtei Enchō R1-00106, the Yokote Masuda Manga Museum R3-00432), Columbia's Heian essay for the Tale of Genji, Sei Shōnagon and waka, and the Akihabara and geiko sources already in use.

Cut on re-reading: syllable counts for waka and haiku (no source here gives them), "storytellers who need only a cushion", kabuki as "the loud counterpart" and "fully formed by about 1700", "eleventh-century" for the Tale of Genji, "the poet most people can quote", "nineteenth-century Edo", stories "everyone in the audience once knew", and a sentence that attributed the Awa puppet theatre's description to Bunraku.

Marked not written, because no source was read: contemporary music and film. Also missing: the shamisen, shakuhachi and taiko as instruments in their own right, folk song, Awa Odori (its text was read but its page id could not be matched, so it is not cited), modern literature, anime as an industry beyond Akihabara.

## 17 Nov 2026: Everyday life and customs chapter; all eight chapters open

Sources: the Statistical Handbook (households, births, transport shares, convenience stores, hours worked, housing, schooling, rural ageing), and sources already read for other pages and chapters (Columbia on language and the occupation, Jinja Honcho's FAQ, the Kyoto geiko foundation, the washoku booklet, the Shikoku pilgrimage, Dōgo Onsen, Nishijin, Wajima, Nebuta, Ogimachi's preservation society, Shinjuku Station, Nishiki, Nakamise, Akihabara, the Setouchi Triennale).

Cut on re-reading: a sentence on the host's care at a formal meal (only a fragment of the booklet's sentence had been read), "three-storey wooden" for the Dōgo bathhouse (from a photo, not the source), kimono "at their grandest", "that division of labour is typical of craft work", "organised from below", "thatched" and "industry" for Ogimachi, "all three figures were lower" for working hours (the annual change is not given), "the oldest kind of shopping street" and "the newest", and "farming and fishing" narrowed to what the handbook says.

Thin or missing because no source was read: greetings beyond speech levels (bowing, gifts, shoes off), onsen etiquette, school clubs and entrance exams, commuting, company life, the shinkansen, and recent trends beyond the population figures.

`npx tsx scripts/audit-content.ts japan all` now passes every check: scope, chapters, cities, places, cites, pano.
