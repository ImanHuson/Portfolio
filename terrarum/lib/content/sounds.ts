/**
 * Field recordings a country's theme can play, off until the reader turns
 * sound on. Each is a real recording of the place or thing named, licence and
 * author checked on its Commons file page; encoded here as quiet mono AAC
 * (loudness-normalised, faded at the ends so a loop does not click).
 */
export interface Sound {
  id: string;
  file: string;
  /** What is heard, as shown beside the control while it plays. */
  title: string;
  /** Short form for small screens. */
  short: string;
  creator: string;
  date: string;
  license: string;
  licenseUrl: string;
  sourceUrl: string;
  loop: boolean;
}

export const SOUNDS: Sound[] = [
  {
    id: "jp-suikinkutsu",
    file: "sound/jp-suikinkutsu.m4a",
    title: "Water dripping into a suikinkutsu, the buried echo jar of a garden basin, at Taizō-in, Kyoto",
    short: "Suikinkutsu, Taizō-in",
    creator: "Fg2",
    date: "30 December 2008",
    license: "Public domain",
    licenseUrl: "https://creativecommons.org/publicdomain/mark/1.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Suikinkutsu-LS100128.ogg",
    loop: true,
  },
  {
    id: "jp-higurashi",
    file: "sound/jp-higurashi.m4a",
    title: "Higurashi cicadas at 7 in the evening, 28 July 2018",
    short: "Higurashi, July evening",
    creator: "あおもりくま (aomorikuma)",
    date: "28 July 2018",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Higurashi_20180728_1902.ogg",
    loop: true,
  },
  {
    id: "jp-bonsho",
    file: "sound/jp-bonsho.m4a",
    title: "The bonshō, the great temple bell, of Chōmei-ji, Shiga, struck once",
    short: "Bonshō, Chōmei-ji",
    creator: "Jnn",
    date: "2006",
    license: "CC BY 2.1 JP",
    licenseUrl: "https://creativecommons.org/licenses/by/2.1/jp/deed.en",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Bonsyou5599.ogg",
    loop: false,
  },
];

export const sound = (id: string) => SOUNDS.find((s) => s.id === id);
