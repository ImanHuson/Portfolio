/**
 * The old Japanese calendar: 24 sekki (seasonal divisions) and 72 kō
 * (microseasons of about five days), as listed by Nippon.com ("Japan's 72
 * Microseasons", source id nippon-72). Dates are that table's: approximate, and
 * they can move by a day from year to year. Readings vary between sources too.
 * Parsed from the article, not retyped; every day of the year falls in one kō.
 */
export interface Sekki { ja: string; romaji: string; en: string }
export interface Ko { sekki: number; start: string; end: string; ja: string; romaji: string; en: string }

export const SEKKI: Sekki[] = [
  { ja: "立春", romaji: "Risshun", en: "Beginning of spring" },
  { ja: "雨水", romaji: "Usui", en: "Rainwater" },
  { ja: "啓蟄", romaji: "Keichitsu", en: "Insects awaken" },
  { ja: "春分", romaji: "Shunbun", en: "Spring equinox" },
  { ja: "清明", romaji: "Seimei", en: "Pure and clear" },
  { ja: "穀雨", romaji: "Kokuu", en: "Grain rains" },
  { ja: "立夏", romaji: "Rikka", en: "Beginning of summer" },
  { ja: "小満", romaji: "Shōman", en: "Lesser ripening" },
  { ja: "芒種", romaji: "Bōshu", en: "Grain beards and seeds" },
  { ja: "夏至", romaji: "Geshi", en: "Summer solstice" },
  { ja: "小暑", romaji: "Shōsho", en: "Lesser heat" },
  { ja: "大暑", romaji: "Taisho", en: "Greater heat" },
  { ja: "立秋", romaji: "Risshū", en: "Beginning of autumn" },
  { ja: "処暑", romaji: "Shosho", en: "Manageable heat" },
  { ja: "白露", romaji: "Hakuro", en: "White dew" },
  { ja: "秋分", romaji: "Shūbun", en: "Autumn equinox" },
  { ja: "寒露", romaji: "Kanro", en: "Cold dew" },
  { ja: "霜降", romaji: "Sōkō", en: "Frost falls" },
  { ja: "立冬", romaji: "Rittō", en: "Beginning of winter" },
  { ja: "小雪", romaji: "Shōsetsu", en: "Lesser snow" },
  { ja: "大雪", romaji: "Taisetsu", en: "Greater snow" },
  { ja: "冬至", romaji: "Tōji", en: "Winter solstice" },
  { ja: "小寒", romaji: "Shōkan", en: "Lesser cold" },
  { ja: "大寒", romaji: "Daikan", en: "Greater cold" },
];

export const KO: Ko[] = [
  { sekki: 0, start: "02-04", end: "02-08", ja: "東風解凍", romaji: "Harukaze kōri o toku", en: "East wind melts the ice" },
  { sekki: 0, start: "02-09", end: "02-13", ja: "黄鶯睍睆", romaji: "Kōō kenkan su", en: "Bush warblers start singing in the mountains" },
  { sekki: 0, start: "02-14", end: "02-18", ja: "魚上氷", romaji: "Uo kōri o izuru", en: "Fish emerge from the ice" },
  { sekki: 1, start: "02-19", end: "02-23", ja: "土脉潤起", romaji: "Tsuchi no shō uruoi okoru", en: "Rain moistens the soil" },
  { sekki: 1, start: "02-24", end: "02-28", ja: "霞始靆", romaji: "Kasumi hajimete tanabiku", en: "Mist starts to linger" },
  { sekki: 1, start: "03-01", end: "03-05", ja: "草木萌動", romaji: "Sōmoku mebae izuru", en: "Grass sprouts, trees bud" },
  { sekki: 2, start: "03-06", end: "03-10", ja: "蟄虫啓戸", romaji: "Sugomori mushito o hiraku", en: "Hibernating insects surface" },
  { sekki: 2, start: "03-11", end: "03-15", ja: "桃始笑", romaji: "Momo hajimete saku", en: "First peach blossoms" },
  { sekki: 2, start: "03-16", end: "03-20", ja: "菜虫化蝶", romaji: "Namushi chō to naru", en: "Caterpillars become butterflies" },
  { sekki: 3, start: "03-21", end: "03-25", ja: "雀始巣", romaji: "Suzume hajimete sukū", en: "Sparrows start to nest" },
  { sekki: 3, start: "03-26", end: "03-30", ja: "櫻始開", romaji: "Sakura hajimete saku", en: "First cherry blossoms" },
  { sekki: 3, start: "03-31", end: "04-04", ja: "雷乃発声", romaji: "Kaminari sunawachi koe o hassu", en: "Distant thunder" },
  { sekki: 4, start: "04-05", end: "04-09", ja: "玄鳥至", romaji: "Tsubame kitaru", en: "Swallows return" },
  { sekki: 4, start: "04-10", end: "04-14", ja: "鴻雁北", romaji: "Kōgan kaeru", en: "Wild geese fly north" },
  { sekki: 4, start: "04-15", end: "04-19", ja: "虹始見", romaji: "Niji hajimete arawaru", en: "First rainbows" },
  { sekki: 5, start: "04-20", end: "04-24", ja: "葭始生", romaji: "Ashi hajimete shōzu", en: "First reeds sprout" },
  { sekki: 5, start: "04-25", end: "04-29", ja: "霜止出苗", romaji: "Shimo yamite nae izuru", en: "Last frost, rice seedlings grow" },
  { sekki: 5, start: "04-30", end: "05-04", ja: "牡丹華", romaji: "Botan hana saku", en: "Peonies bloom" },
  { sekki: 6, start: "05-05", end: "05-09", ja: "蛙始鳴", romaji: "Kawazu hajimete naku", en: "Frogs start singing" },
  { sekki: 6, start: "05-10", end: "05-14", ja: "蚯蚓出", romaji: "Mimizu izuru", en: "Worms surface" },
  { sekki: 6, start: "05-15", end: "05-20", ja: "竹笋生", romaji: "Takenoko shōzu", en: "Bamboo shoots sprout" },
  { sekki: 7, start: "05-21", end: "05-25", ja: "蚕起食桑", romaji: "Kaiko okite kuwa o hamu", en: "Silkworms start feasting on mulberry leaves" },
  { sekki: 7, start: "05-26", end: "05-30", ja: "紅花栄", romaji: "Benibana sakau", en: "Safflowers bloom" },
  { sekki: 7, start: "05-31", end: "06-05", ja: "麦秋至", romaji: "Mugi no toki itaru", en: "Wheat ripens and is harvested" },
  { sekki: 8, start: "06-06", end: "06-10", ja: "蟷螂生", romaji: "Kamakiri shōzu", en: "Praying mantises hatch" },
  { sekki: 8, start: "06-11", end: "06-15", ja: "腐草為螢", romaji: "Kusaretaru kusa hotaru to naru", en: "Rotten grass becomes fireflies" },
  { sekki: 8, start: "06-16", end: "06-20", ja: "梅子黄", romaji: "Ume no mi kibamu", en: "Plums turn yellow" },
  { sekki: 9, start: "06-21", end: "06-26", ja: "乃東枯", romaji: "Natsukarekusa karuru", en: "Self-heal withers" },
  { sekki: 9, start: "06-27", end: "07-01", ja: "菖蒲華", romaji: "Ayame hana saku", en: "Irises bloom" },
  { sekki: 9, start: "07-02", end: "07-06", ja: "半夏生", romaji: "Hange shōzu", en: "Crow-dipper sprouts" },
  { sekki: 10, start: "07-07", end: "07-11", ja: "温風至", romaji: "Atsukaze itaru", en: "Warm winds blow" },
  { sekki: 10, start: "07-12", end: "07-16", ja: "蓮始開", romaji: "Hasu hajimete hiraku", en: "First lotus blossoms" },
  { sekki: 10, start: "07-17", end: "07-22", ja: "鷹乃学習", romaji: "Taka sunawachi waza o narau", en: "Hawks learn to fly" },
  { sekki: 11, start: "07-23", end: "07-28", ja: "桐始結花", romaji: "Kiri hajimete hana o musubu", en: "Paulownia trees produce seeds" },
  { sekki: 11, start: "07-29", end: "08-02", ja: "土潤溽暑", romaji: "Tsuchi uruōte mushi atsushi", en: "Earth is damp, air is humid" },
  { sekki: 11, start: "08-03", end: "08-07", ja: "大雨時行", romaji: "Taiu tokidoki furu", en: "Great rains sometimes fall" },
  { sekki: 12, start: "08-08", end: "08-12", ja: "涼風至", romaji: "Suzukaze itaru", en: "Cool winds blow" },
  { sekki: 12, start: "08-13", end: "08-17", ja: "寒蝉鳴", romaji: "Higurashi naku", en: "Evening cicadas sing" },
  { sekki: 12, start: "08-18", end: "08-22", ja: "蒙霧升降", romaji: "Fukaki kiri matō", en: "Thick fog descends" },
  { sekki: 13, start: "08-23", end: "08-27", ja: "綿柎開", romaji: "Wata no hana shibe hiraku", en: "Cotton flowers bloom" },
  { sekki: 13, start: "08-28", end: "09-01", ja: "天地始粛", romaji: "Tenchi hajimete samushi", en: "Heat starts to die down" },
  { sekki: 13, start: "09-02", end: "09-07", ja: "禾乃登", romaji: "Kokumono sunawachi minoru", en: "Rice ripens" },
  { sekki: 14, start: "09-08", end: "09-12", ja: "草露白", romaji: "Kusa no tsuyu shiroshi", en: "Dew glistens white on grass" },
  { sekki: 14, start: "09-13", end: "09-17", ja: "鶺鴒鳴", romaji: "Sekirei naku", en: "Wagtails sing" },
  { sekki: 14, start: "09-18", end: "09-22", ja: "玄鳥去", romaji: "Tsubame saru", en: "Swallows leave" },
  { sekki: 15, start: "09-23", end: "09-27", ja: "雷乃収声", romaji: "Kaminari sunawachi koe o osamu", en: "Thunder ceases" },
  { sekki: 15, start: "09-28", end: "10-02", ja: "蟄虫坏戸", romaji: "Mushi kakurete to o fusagu", en: "Insects hole up underground" },
  { sekki: 15, start: "10-03", end: "10-07", ja: "水始涸", romaji: "Mizu hajimete karuru", en: "Farmers drain fields" },
  { sekki: 16, start: "10-08", end: "10-12", ja: "鴻雁来", romaji: "Kōgan kitaru", en: "Wild geese return" },
  { sekki: 16, start: "10-13", end: "10-17", ja: "菊花開", romaji: "Kiku no hana hiraku", en: "Chrysanthemums bloom" },
  { sekki: 16, start: "10-18", end: "10-22", ja: "蟋蟀在戸", romaji: "Kirigirisu to ni ari", en: "Crickets chirp around the door" },
  { sekki: 17, start: "10-23", end: "10-27", ja: "霜始降", romaji: "Shimo hajimete furu", en: "First frost" },
  { sekki: 17, start: "10-28", end: "11-01", ja: "霎時施", romaji: "Kosame tokidoki furu", en: "Light rains sometimes fall" },
  { sekki: 17, start: "11-02", end: "11-06", ja: "楓蔦黄", romaji: "Momiji tsuta kibamu", en: "Maple leaves and ivy turn yellow" },
  { sekki: 18, start: "11-07", end: "11-11", ja: "山茶始開", romaji: "Tsubaki hajimete hiraku", en: "Camellias bloom" },
  { sekki: 18, start: "11-12", end: "11-16", ja: "地始凍", romaji: "Chi hajimete kōru", en: "Land starts to freeze" },
  { sekki: 18, start: "11-17", end: "11-21", ja: "金盞香", romaji: "Kinsenka saku", en: "Daffodils bloom" },
  { sekki: 19, start: "11-22", end: "11-26", ja: "虹蔵不見", romaji: "Niji kakurete miezu", en: "Rainbows hide" },
  { sekki: 19, start: "11-27", end: "12-01", ja: "朔風払葉", romaji: "Kitakaze konoha o harau", en: "North wind blows the leaves from the trees" },
  { sekki: 19, start: "12-02", end: "12-06", ja: "橘始黄", romaji: "Tachibana hajimete kibamu", en: "Tachibana citrus tree leaves start to turn yellow" },
  { sekki: 20, start: "12-07", end: "12-11", ja: "閉塞成冬", romaji: "Sora samuku fuyu to naru", en: "Cold sets in, winter begins" },
  { sekki: 20, start: "12-12", end: "12-16", ja: "熊蟄穴", romaji: "Kuma ana ni komoru", en: "Bears start hibernating in their dens" },
  { sekki: 20, start: "12-17", end: "12-21", ja: "鱖魚群", romaji: "Sake no uo muragaru", en: "Salmon gather and swim upstream" },
  { sekki: 21, start: "12-22", end: "12-26", ja: "乃東生", romaji: "Natsukarekusa shōzu", en: "Self-heal sprouts" },
  { sekki: 21, start: "12-27", end: "12-31", ja: "麋角解", romaji: "Sawashika no tsuno otsuru", en: "Deer shed antlers" },
  { sekki: 21, start: "01-01", end: "01-04", ja: "雪下出麦", romaji: "Yuki watarite mugi nobiru", en: "Wheat sprouts under snow" },
  { sekki: 22, start: "01-05", end: "01-09", ja: "芹乃栄", romaji: "Seri sunawachi sakau", en: "Parsley flourishes" },
  { sekki: 22, start: "01-10", end: "01-14", ja: "水泉動", romaji: "Shimizu atataka o fukumu", en: "Springs thaw" },
  { sekki: 22, start: "01-15", end: "01-19", ja: "雉始雊", romaji: "Kiji hajimete naku", en: "Pheasants start to call" },
  { sekki: 23, start: "01-20", end: "01-24", ja: "款冬華", romaji: "Fuki no hana saku", en: "Butterburs bud" },
  { sekki: 23, start: "01-25", end: "01-29", ja: "水沢腹堅", romaji: "Sawamizu kōri tsumeru", en: "Ice thickens on streams" },
  { sekki: 23, start: "01-30", end: "02-03", ja: "鶏始乳", romaji: "Niwatori hajimete toya ni tsuku", en: "Hens start laying eggs" },
];

/** The kō (and its place in the year) for a date, in the given time zone. */
export function microseasonOf(date: Date, timeZone: string): { ko: Ko; n: number; sekki: Sekki } {
  const parts = new Intl.DateTimeFormat("en-GB", { month: "2-digit", day: "2-digit", timeZone }).formatToParts(date);
  const mm = parts.find((p) => p.type === "month")!.value;
  let dd = parts.find((p) => p.type === "day")!.value;
  if (mm === "02" && dd === "29") dd = "28"; // the table has no leap day; it belongs to the kō before
  const md = `${mm}-${dd}`;
  const i = KO.findIndex((k) => k.start <= md && md <= k.end);
  // Only the kō that spans the new year (none does in this table) would miss; fall back to the last.
  const n = i < 0 ? KO.length - 1 : i;
  return { ko: KO[n], n, sekki: SEKKI[KO[n].sekki] };
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
/** "12–16 November", "28 October–1 November". */
export function koSpan(k: Ko): string {
  const [sm, sd] = k.start.split("-").map(Number);
  const [em, ed] = k.end.split("-").map(Number);
  return sm === em ? `${sd}–${ed} ${MONTHS[em - 1]}` : `${sd} ${MONTHS[sm - 1]}–${ed} ${MONTHS[em - 1]}`;
}

/** "7 November": the day a kō begins. */
export function koStart(k: Ko): string {
  const [m, d] = k.start.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]}`;
}
