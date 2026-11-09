/**
 * Japan's 35 national parks as the Ministry of the Environment lists them
 * (env.go.jp/en/nature/nps/park/parks/, read November 2026): name as the
 * ministry writes it, date first designated, area, and the prefectures each
 * reaches into (ISO 3166-2 codes). Areas marked landOnly exclude sea areas.
 */
export interface NationalPark {
  name: string;
  designated: string;
  areaHa: number;
  landOnly: boolean;
  prefectures: string[];
  region: string;
  note?: string;
}

export const NATIONAL_PARKS: NationalPark[] = [
 {
  "name": "Setonaikai",
  "designated": "1934-03-16",
  "areaHa": 67280,
  "landOnly": true,
  "prefectures": [
   "JP-27",
   "JP-28",
   "JP-30",
   "JP-33",
   "JP-34",
   "JP-35",
   "JP-36",
   "JP-37",
   "JP-38",
   "JP-40",
   "JP-44"
  ],
  "region": "Kinki Region"
 },
 {
  "name": "Unzen-Amakusa",
  "designated": "1934-03-16",
  "areaHa": 28355,
  "landOnly": true,
  "prefectures": [
   "JP-42",
   "JP-43",
   "JP-46"
  ],
  "region": "Kyushu Region"
 },
 {
  "name": "Kirishima-Kinkowan",
  "designated": "1934-03-16",
  "areaHa": 36605,
  "landOnly": true,
  "prefectures": [
   "JP-45",
   "JP-46"
  ],
  "region": "Kyushu Region"
 },
 {
  "name": "Akan-Mashu",
  "designated": "1934-12-04",
  "areaHa": 91413,
  "landOnly": false,
  "prefectures": [
   "JP-01"
  ],
  "region": "Hokkaido Region"
 },
 {
  "name": "Daisetsuzan",
  "designated": "1934-12-04",
  "areaHa": 226764,
  "landOnly": false,
  "prefectures": [
   "JP-01"
  ],
  "region": "Hokkaido Region"
 },
 {
  "name": "Nikko",
  "designated": "1934-12-04",
  "areaHa": 114908,
  "landOnly": false,
  "prefectures": [
   "JP-07",
   "JP-09",
   "JP-10"
  ],
  "region": "Kanto Region"
 },
 {
  "name": "Chubusangaku",
  "designated": "1934-12-04",
  "areaHa": 174323,
  "landOnly": false,
  "prefectures": [
   "JP-15",
   "JP-16",
   "JP-20",
   "JP-21"
  ],
  "region": "Chubu Region"
 },
 {
  "name": "Aso-Kuju",
  "designated": "1934-12-04",
  "areaHa": 73017,
  "landOnly": false,
  "prefectures": [
   "JP-43",
   "JP-44"
  ],
  "region": "Kyushu Region"
 },
 {
  "name": "Towada-Hachimantai",
  "designated": "1936-02-01",
  "areaHa": 85534,
  "landOnly": false,
  "prefectures": [
   "JP-02",
   "JP-05",
   "JP-03"
  ],
  "region": "Tohoku Region"
 },
 {
  "name": "Fuji-Hakone-Izu",
  "designated": "1936-02-01",
  "areaHa": 121755,
  "landOnly": true,
  "prefectures": [
   "JP-13",
   "JP-14",
   "JP-19",
   "JP-22"
  ],
  "region": "Kanto Region"
 },
 {
  "name": "Yoshino-Kumano",
  "designated": "1936-02-01",
  "areaHa": 61406,
  "landOnly": true,
  "prefectures": [
   "JP-24",
   "JP-29",
   "JP-30"
  ],
  "region": "Kinki Region"
 },
 {
  "name": "Daisen-Oki",
  "designated": "1936-02-01",
  "areaHa": 35097,
  "landOnly": true,
  "prefectures": [
   "JP-31",
   "JP-32",
   "JP-33"
  ],
  "region": "Chugoku & Shikoku Regions"
 },
 {
  "name": "Ise-Shima",
  "designated": "1946-11-20",
  "areaHa": 55544,
  "landOnly": false,
  "prefectures": [
   "JP-24"
  ],
  "region": "Chubu Region"
 },
 {
  "name": "Shikotsu-Toya",
  "designated": "1949-05-16",
  "areaHa": 99473,
  "landOnly": false,
  "prefectures": [
   "JP-01"
  ],
  "region": "Hokkaido Region"
 },
 {
  "name": "Joshin'etsukogen",
  "designated": "1949-09-07",
  "areaHa": 151053,
  "landOnly": false,
  "prefectures": [
   "JP-10",
   "JP-15",
   "JP-20"
  ],
  "region": "Chubu Region"
 },
 {
  "name": "Chichibu-Tama-Kai",
  "designated": "1950-07-10",
  "areaHa": 126259,
  "landOnly": false,
  "prefectures": [
   "JP-11",
   "JP-13",
   "JP-19",
   "JP-20"
  ],
  "region": "Kanto Region"
 },
 {
  "name": "Bandai-Asahi",
  "designated": "1950-09-05",
  "areaHa": 186375,
  "landOnly": false,
  "prefectures": [
   "JP-06",
   "JP-07",
   "JP-15"
  ],
  "region": "Tohoku Region"
 },
 {
  "name": "Saikai",
  "designated": "1955-03-16",
  "areaHa": 24646,
  "landOnly": true,
  "prefectures": [
   "JP-42"
  ],
  "region": "Kyushu Region"
 },
 {
  "name": "Sanriku Fukko",
  "designated": "1955-05-02",
  "areaHa": 28539,
  "landOnly": true,
  "prefectures": [
   "JP-02",
   "JP-03",
   "JP-04"
  ],
  "region": "Tohoku Region",
  "note": "May 2, 1955 (as Rikuchukaigan National Park) / May 24, 2013 (as Sanriku Fukko National Park)"
 },
 {
  "name": "Hakusan",
  "designated": "1962-11-12",
  "areaHa": 49900,
  "landOnly": false,
  "prefectures": [
   "JP-16",
   "JP-17",
   "JP-18",
   "JP-21"
  ],
  "region": "Chubu Region"
 },
 {
  "name": "San'inkaigan",
  "designated": "1963-07-15",
  "areaHa": 9006,
  "landOnly": true,
  "prefectures": [
   "JP-26",
   "JP-28",
   "JP-31"
  ],
  "region": "Kinki Region"
 },
 {
  "name": "Shiretoko",
  "designated": "1964-06-01",
  "areaHa": 38954,
  "landOnly": false,
  "prefectures": [
   "JP-01"
  ],
  "region": "Hokkaido Region"
 },
 {
  "name": "Minami Alps",
  "designated": "1964-06-01",
  "areaHa": 35752,
  "landOnly": false,
  "prefectures": [
   "JP-19",
   "JP-20",
   "JP-22"
  ],
  "region": "Kanto Region"
 },
 {
  "name": "Iriomote-Ishigaki",
  "designated": "1972-05-15",
  "areaHa": 40658,
  "landOnly": true,
  "prefectures": [
   "JP-47"
  ],
  "region": "Kyushu Region"
 },
 {
  "name": "Ogasawara",
  "designated": "1972-10-16",
  "areaHa": 6629,
  "landOnly": true,
  "prefectures": [
   "JP-13"
  ],
  "region": "Kanto Region"
 },
 {
  "name": "Ashizuri-Uwakai",
  "designated": "1972-11-10",
  "areaHa": 11345,
  "landOnly": true,
  "prefectures": [
   "JP-38",
   "JP-39"
  ],
  "region": "Chugoku & Shikoku Regions"
 },
 {
  "name": "Rishiri-Rebun-Sarobetsu",
  "designated": "1974-09-20",
  "areaHa": 24166,
  "landOnly": false,
  "prefectures": [
   "JP-01"
  ],
  "region": "Hokkaido Region"
 },
 {
  "name": "Kushiroshitsugen",
  "designated": "1987-07-31",
  "areaHa": 28788,
  "landOnly": false,
  "prefectures": [
   "JP-01"
  ],
  "region": "Hokkaido Region"
 },
 {
  "name": "Oze",
  "designated": "2007-08-30",
  "areaHa": 37222,
  "landOnly": false,
  "prefectures": [
   "JP-07",
   "JP-09",
   "JP-10",
   "JP-15"
  ],
  "region": "Kanto Region"
 },
 {
  "name": "Yakushima (Island)",
  "designated": "2012-03-16",
  "areaHa": 24566,
  "landOnly": true,
  "prefectures": [
   "JP-46"
  ],
  "region": "Kyushu Region"
 },
 {
  "name": "Keramashoto",
  "designated": "2014-03-05",
  "areaHa": 3520,
  "landOnly": true,
  "prefectures": [
   "JP-47"
  ],
  "region": "Kyushu Region"
 },
 {
  "name": "Myoko-Togakushi renzan",
  "designated": "2015-03-27",
  "areaHa": 39772,
  "landOnly": false,
  "prefectures": [
   "JP-15",
   "JP-20"
  ],
  "region": "Chubu Region"
 },
 {
  "name": "Yambaru",
  "designated": "2016-09-15",
  "areaHa": 17352,
  "landOnly": true,
  "prefectures": [
   "JP-47"
  ],
  "region": "Kyushu Region"
 },
 {
  "name": "Amamigunto",
  "designated": "2017-03-07",
  "areaHa": 42196,
  "landOnly": true,
  "prefectures": [
   "JP-46"
  ],
  "region": "Kyushu Region"
 },
 {
  "name": "Hidakasanmyaku-Erimo-Tokachi",
  "designated": "2024-06-25",
  "areaHa": 245668,
  "landOnly": true,
  "prefectures": [
   "JP-01"
  ],
  "region": "Hokkaido Region"
 }
];
