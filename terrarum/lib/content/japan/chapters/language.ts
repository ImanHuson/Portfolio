import type { Chapter } from "../../types";

/** Brief section J for Japan. Every statement is from the source it cites. */
export const language: Chapter = {
  slug: "language",
  title: "Language",
  native: "言葉",
  summary: "One language spoken almost nowhere else, written in three scripts at once, with eight smaller languages at its edges that are in danger of falling silent.",
  hero: "shinjuku-neon",
  facts: [
    { label: "Scripts in daily use", value: "Kanji, hiragana and katakana", cite: ["afe-language"] },
    { label: "Chinese characters adopted", value: "About 1,400 years ago", cite: ["afe-language"] },
    { label: "Endangered languages", value: "8, on UNESCO’s 2009 atlas", cite: ["bunka-endangered"] },
    { label: "Current kanji list", value: "Issued 30 November 2010", cite: ["bunka-joyo"] },
  ],
  passages: [
    {
      id: "language-japanese",
      heading: "A language of one country",
      body: [
        "English is the national language of many countries, and many more people use it as an international language. Japanese is spoken almost only in Japan, or by Japanese people living abroad, and that is part of how its speakers think of themselves.",
        "It is built very differently from English. Particles, such as wa and o, show how the words in a sentence are related. The subject is often left out altogether. Singular and plural are rarely marked. Verbs change to show tense, as in English, but so do adjectives. “I bought a book yesterday” is Kinō watakushi wa hon o kaimashita.",
      ],
      cite: ["afe-language"],
      covers: ["main"],
      status: "fact-checked",
    },
    {
      id: "language-sound",
      heading: "How it sounds",
      body: [
        "The sounds are few and regular. Japanese is made of about a hundred distinct syllables: five single vowels, and consonants combined with a vowel, sometimes with a y between. One consonant can stand alone, n. Written in roman letters, each letter stands for one sound, and g is always hard, as in “get”.",
        "A line over a vowel means the same sound held twice as long, so Tōkyō is said To-o-kyo-o. Syllables are never accented. English speakers tend to say Hi-RO-shi-ma or Hi-ro-SHI-ma; Japanese stresses neither.",
        "Some English sounds, l and v among them, do not exist in Japanese, so borrowed words are fitted to the nearest syllables. France becomes Huransu.",
      ],
      cite: ["afe-language"],
      covers: ["pronunciation"],
      status: "fact-checked",
    },
    {
      id: "language-politeness",
      heading: "Words that change with the listener",
      body: [
        "One of the greatest differences from English is politeness. People speak differently depending on who they are talking to and who they are talking about. A high-school student uses one set of forms to the class teacher and another to classmates. It is not only the verb endings that change: nouns and pronouns do too. A person uses one word for father when speaking to him and a different one when speaking about him to someone else. To address someone correctly you need to know their age and their position, in a school or a company, relative to yours.",
        "Two everyday phrases frame a meal: itadakimasu before eating and gochisōsama after, both words of thanks. Many common words are loans from English, reshaped by Japanese sounds: terebi for television, aisu kurīmu for ice cream.",
      ],
      cite: ["afe-language", "maff-washoku"],
      covers: ["expressions"],
      images: ["akiba-chuodori-night"],
      status: "fact-checked",
    },
    {
      id: "language-scripts",
      heading: "Three scripts in one sentence",
      body: [
        "Japanese is written with three sets of symbols used together. Kanji are characters taken from Chinese, each carrying a meaning as well as a sound. Some look like what they mean, as 三 does for three; most do not. A character can be a single stroke, like 一, one, or twenty strokes or more.",
        "Beside them run two syllabaries of forty-six symbols each, in which a symbol stands for a whole syllable: か is ka, つ is tsu. Hiragana writes verb endings, particles and other native words. Katakana, squarer in shape, writes foreign loan words and foreign names, and is used for emphasis the way English uses underlining. An ordinary sentence mixes kanji and hiragana, with katakana wherever a foreign word appears.",
        "The text can run horizontally from left to right. More usually it runs in vertical columns from right to left, which is why a Japanese book opens from what an English reader would call the back. A student needs about two thousand symbols to have the basic tools of the written language.",
      ],
      cite: ["afe-language"],
      covers: ["writing"],
      images: ["inari-lantern"],
      places: ["fushimi-inari-taisha"],
      status: "fact-checked",
    },
    {
      id: "language-history",
      heading: "Borrowed characters, home-made alphabets",
      body: [
        "All languages were spoken before they were written. About 1,400 years ago its speakers began to use the Chinese writing system. They did it in two ways at once: a character could be read for its meaning, with a Japanese word, or for its sound, with something close to the Chinese pronunciation. That is why a single kanji can have more than one reading.",
        "Chinese words are short, and Japanese words, with their strings of endings, are long, so characters alone were awkward. The answer was kana, symbols developed from kanji that record sound without meaning.",
        "The system has been questioned more than once. During the Meiji era some people wanted to replace it with the roman alphabet, or even to switch to English. After the Second World War the written language was simplified and standardised to make it easier to learn. The government’s list of kanji for general use was last issued, by cabinet notice, on 30 November 2010.",
      ],
      cite: ["afe-language", "bunka-joyo"],
      covers: ["development"],
      status: "fact-checked",
    },
    {
      id: "language-ainu",
      heading: "Ainu, a language apart",
      body: [
        "Japanese borrowed its writing from Chinese and many words from English, but Ainu is unrelated to it. It is the language of the indigenous people of the northern islands: Hokkaidō, Sakhalin and the Kurils. The word Ainu itself means “human”, and Ainu place names across Hokkaidō describe the land they belong to.",
        "For most of its history Ainu was only spoken. It is now written either in the Latin alphabet or in katakana with a few extra characters. It declined fast under the modernisation policies of the Meiji period, and UNESCO’s atlas of 2009 rates it critically endangered.",
      ],
      cite: ["afe-language", "upopoy-culture", "jta-h30-00005", "bunka-endangered"],
      covers: ["relationships"],
      images: ["upopoy-museum"],
      places: ["upopoy"],
      status: "fact-checked",
    },
    {
      id: "language-islands",
      heading: "Eight languages in danger",
      body: [
        "UNESCO’s Atlas of the World’s Languages in Danger, in its 2009 edition, lists about 2,500 languages worldwide. Eight are in Japan. Ainu is rated critically endangered. Yaeyama and Yonaguni are severely endangered. Hachijō, Amami, Kunigami, Okinawa and Miyako are definitely endangered.",
        "Whether these are languages at all is partly a matter of naming. UNESCO does not separate language from dialect and calls all eight languages. In Japan, the seven other than Ainu are more usually called dialects.",
      ],
      cite: ["bunka-endangered"],
      covers: ["minority"],
      images: ["shuri-shureimon"],
      places: ["shuri-castle"],
      status: "fact-checked",
    },
    {
      id: "language-record",
      heading: "Recording what is left",
      body: [
        "The government’s reconstruction policy of July 2011, after the earthquake and tsunami, pointed to the dialects of the stricken areas as being at risk as well. The Agency for Cultural Affairs pays for surveys, recordings and revival work.",
        "The National Institute for Japanese Language and Linguistics keeps an open database of endangered languages and dialects. It holds word lists in which every word can be heard spoken by a native speaker, and stories recorded in the field, written out and translated.",
      ],
      cite: ["bunka-endangered", "ninjal-endangered-db"],
      covers: ["diversity"],
      status: "fact-checked",
    },
  ],
  status: "fact-checked",
};
