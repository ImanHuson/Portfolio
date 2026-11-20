/**
 * Recordings a country's theme can play, off until the reader turns sound on:
 * for Japan, its own instruments (koto and shakuhachi), licence and author
 * checked on each Commons file page; encoded here as quiet mono AAC
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
    id: "jp-koto",
    file: "sound/jp-koto.m4a",
    title: "A woman plays a 13-string koto",
    short: "Koto",
    creator: "Torsodog",
    date: "24 May 2006",
    license: "CC BY 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by/3.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Koto_performance.ogg",
    loop: true,
  },
  {
    id: "jp-shakuhachi",
    file: "sound/jp-shakuhachi.m4a",
    title: "Shika no Tōne (The Distant Cry of the Deer), a honkyoku for shakuhachi, played by Araki Kodō III (Victor 13029), the first three minutes",
    short: "Shakuhachi, Shika no Tōne",
    creator: "Araki Kodō III (1879–1935); restoration by Torsodog",
    date: "recorded between 1925 and 1937",
    license: "Public domain",
    licenseUrl: "https://creativecommons.org/publicdomain/mark/1.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Shikanotoone_new.ogg",
    loop: true,
  },
];

export const sound = (id: string) => SOUNDS.find((s) => s.id === id);
