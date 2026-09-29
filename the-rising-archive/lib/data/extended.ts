// The Extended Character Archive: ten more people, beneath the Ten Faces of
// Power. Not a ranking. Facts were checked (see CLAUDE.md fact-check notes)
// and corrected against the brief where it was wrong: Kavax is Primus of
// House Telemanus, not a Sovereign; Fitchner was House Mars's Proctor and
// Ares, not a Howler; Ephraim and Trigg were engaged, not married; Lyria
// joins the Howlers only in Dark Age. Apollonius moved here from the Ten
// Faces, and Victra moved up into them, at the user's call. Epithets marked `archive` are this
// archive's own names, not the books'. Every moment carries the book it
// spoils; anything the archive couldn't verify was left out.

import type { Register } from "@/lib/data/people";

/** A string is safe at the file's base book; `{ text, book }` gets its own seal. */
export type Gated = string | { text: string; book: number };

export type Moment = { title: string; text: string; book: number };
export type Connection = { name: string; note: string; book: number; slug?: string };
export type Words = { text: string; who: string; where: string; book: number };

/** Header treatments from the brief's visual direction, one per dossier. */
export type Mood =
  | "minotaur" // Apollonius: gold light on red velvet, a stage
  | "dust" // Lyria: red dust, worn fabric
  | "smoke" // Ephraim: dim, grey, smoky
  | "hearth" // Volga: snow outside, firelight inside
  | "snow" // Ragnar: cold, solemn
  | "bear" // Kavax: warm gold
  | "classified" // Fitchner: redacted, coded
  | "stone" // Lorn: parchment, stone, restraint
  | "nav" // Orion: navigation grid, deep blue
  | "rim"; // Romulus: the Rim's cold light

export type ExtendedPerson = {
  slug: string;
  file: number; // archive file number, 11-20: an index, not a rank
  name: string;
  epithet: string;
  epithetSource: "books" | "archive";
  color: string;
  origin: string;
  role: string;
  categories: string[];
  register: Register; // typographic voice for the name
  wash: "red" | "gold" | "rim" | "blue" | "apollonius";
  mood: Mood;
  firstBook: number;
  /** The personal archive line, safe at `lineBook`; `lineEarly` before it. */
  line: string;
  lineBook: number;
  lineEarly?: string;
  essence: Gated[]; // strings safe at firstBook - 1
  traits: string[];
  roleText: Gated[]; // strings safe at firstBook
  themes: string[];
  connections: Connection[];
  moments: Moment[];
  words?: Words;
  reading: string; // MY READING: labelled interpretation, never canon
  motif: string;
  easter?: "sophocles" | "howl" | "orbit" | "minotaur";
};

export const EXTENDED: ExtendedPerson[] = [
  {
    slug: "apollonius",
    file: 11,
    name: "Apollonius au Valii-Rath",
    epithet: "The Minotaur of Mars",
    epithetSource: "books",
    color: "Gold",
    origin: "House Valii-Rath, Mars",
    role: "Warlord, prisoner, performer",
    categories: ["Power", "Performance", "Vengeance"],
    register: "gold",
    wash: "apollonius",
    mood: "minotaur",
    firstBook: 4,
    line: "Terrifying or hilarious. The answer is yes.",
    lineBook: 3,
    essence: [
      "He mastered the violin at twelve. He is a master of the razor, ranked among the finest fighters of his generation.",
      "He treats conversation like theater. He sees himself not merely as powerful but as a work of art still being perfected.",
    ],
    traits: ["Theatrical", "Vain", "Brilliant", "Musical", "Proud", "Charismatic", "Vengeful", "Cultured", "Unpredictable", "Dangerous"],
    roleText: [
      "Iron Gold brings him out of Deepgrave, the prison where he was meant to be forgotten: Darrow frees him to use him, with a bomb in his head to keep him cooperative. Every scene he enters becomes his stage.",
      { text: "In Dark Age he makes a secret pact with Lysander: the Society restored, and the lives of his betrayers delivered to him.", book: 5 },
    ],
    themes: ["Power", "Self-creation", "Performance", "Vengeance"],
    connections: [
      { name: "Darrow", note: "Freed him from Deepgrave to use him.", book: 4, slug: "darrow" },
      { name: "Tactus au Rath", note: "Younger brother.", book: 4 },
      { name: "Lysander au Lune", note: "A secret pact.", book: 5, slug: "lysander" },
      { name: "Kavax au Telemanus", note: "He breaks his spine at Phobos.", book: 6, slug: "kavax" },
    ],
    moments: [
      { title: "Deepgrave", text: "Imprisoned for crimes against the Republic, then broken out by Darrow’s crew with a bomb in his head to keep him honest.", book: 4 },
      { title: "The pact", text: "He allies with Lysander in secret, for the Society’s return and the lives of the people who betrayed him.", book: 5 },
      { title: "Phobos", text: "He breaks Kavax au Telemanus’s spine in the Battle of Phobos.", book: 6 },
      { title: "The Dockyards", text: "He takes the Venus Dockyards in an eight-day battle in October 754.", book: 6 },
    ],
    words: {
      text: "The mind is its own place, and in itself can make a heaven of hell or a hell out of heaven.",
      who: "Apollonius au Valii-Rath",
      where: "Iron Gold, chapter 34",
      book: 4,
    },
    reading: "Apollonius is power as self-creation: a man who decided to be a masterpiece and made the war his audience. The saga never lets him be only a joke or only a monster, and that is exactly why he frightens.",
    motif: "Gold marble. Red velvet. A violin string vibrating somewhere in the dark.",
    easter: "minotaur",
  },
  {
    slug: "lyria",
    file: 12,
    name: "Lyria of Lagalos",
    epithet: "The Survivor",
    epithetSource: "archive",
    color: "Red",
    origin: "Lagalos, Mars",
    role: "Former Gamma, survivor",
    categories: ["Consequences", "Identity", "Survival"],
    register: "red",
    wash: "red",
    mood: "dust",
    firstBook: 4,
    line: "The Rising promised freedom. Lyria asks what freedom actually feels like.",
    lineBook: 3,
    essence: [
      "Lyria gives the second half of the saga one of its most important points of view: an ordinary person living through the consequences of a revolution.",
      "She begins resentful of the Republic, because the promised transformation hasn’t reached people like her as safety or prosperity. Her journey changes what she understands by courage, loyalty, identity and freedom.",
    ],
    traits: ["Stubborn", "Straightforward", "Courageous", "Compassionate", "Independent", "Resourceful", "Resentful", "Loyal", "Determined", "Adaptable"],
    roleText: [
      "One of the second trilogy’s narrators. A lowRed of Lagalos, once a Gamma in the mines, now living with her family in poverty in one of the surface assimilation camps. Through her, the Republic is seen from the ground.",
    ],
    themes: ["Consequences", "Identity", "Survival", "Freedom"],
    connections: [
      { name: "Kavax au Telemanus", note: "She saves his life; he takes her into his household.", book: 4, slug: "kavax" },
      { name: "Ephraim ti Horn", note: "A friend who was using her.", book: 4, slug: "ephraim" },
      { name: "Volga Fjorgan", note: "Friend.", book: 4, slug: "volga" },
      { name: "Sevro", note: "Brings her into the Howlers.", book: 5, slug: "sevro" },
    ],
    moments: [
      { title: "The camp", text: "When the Red Hand attacks the camp and starts killing Gammas, she watches her brother Tiran die.", book: 4 },
      { title: "The river", text: "During the Republic’s defence she saves Kavax au Telemanus from drowning. He takes her on as a valet.", book: 4 },
      { title: "The device", text: "Ephraim befriends her and secretly plants a device on her that disables Kavax’s ship.", book: 4 },
      { title: "The pack", text: "Sevro inducts her into the Howlers.", book: 5 },
    ],
    words: { text: "Darrow is not the hugest man I’ve ever met, but he is the only man I’ve ever met who makes his own gravity.", who: "Lyria", where: "The second trilogy", book: 5 },
    reading: "Lyria is the human cost of political victory. Where Darrow’s chapters are mythology, hers are rent, hunger and grief, and the saga is better for having to answer to her.",
    motif: "A miner’s lamp, still lit, on red dust.",
  },
  {
    slug: "ephraim",
    file: 13,
    name: "Ephraim ti Horn",
    epithet: "The Broken Man",
    epithetSource: "archive",
    color: "Gray",
    origin: "Luna",
    role: "Ex-legionnaire, freelancer",
    categories: ["Trauma", "Redemption", "Found family"],
    register: "none",
    wash: "rim",
    mood: "smoke",
    firstBook: 4,
    line: "A man who stopped believing in anything, and then found people worth believing in.",
    lineBook: 3,
    essence: [
      "Ephraim is cynical, sarcastic, emotionally guarded, and deeply damaged by war. His first worldview is survival, not idealism.",
      "His relationships with the people around him slowly reveal someone capable of profound loyalty and sacrifice. His humour and his intelligence are not a mask over the damage; they are as much him as it is.",
    ],
    traits: ["Cynical", "Sarcastic", "Intelligent", "Resourceful", "Emotionally guarded", "Traumatized", "Protective", "Loyal", "Compassionate beneath it", "Morally complicated"],
    roleText: [
      "One of the second trilogy’s narrators. A Gray ex-legionnaire of Luna and a former agent of the Sons of Ares, now a thief for hire, who lost everything in the Rising.",
    ],
    themes: ["Trauma", "Redemption", "Found family", "Grief"],
    connections: [
      { name: "Trigg ti Nakamura", note: "Fiancé, lost in the war.", book: 3 },
      { name: "Holiday ti Nakamura", note: "Trigg’s sister.", book: 3 },
      { name: "Volga Fjorgan", note: "The one friend he has left. He calls her Snowball.", book: 4, slug: "volga" },
      { name: "Lyria of Lagalos", note: "The girl he was meant to use.", book: 4, slug: "lyria" },
    ],
    moments: [
      { title: "What the Rising cost", text: "He lost everything in the Rising, including his fiancé, Trigg ti Nakamura.", book: 4 },
      { title: "The contract", text: "Pressed by the Syndicate, his crew takes a contract to kidnap Pax and Sevro’s daughter Electra.", book: 4 },
      { title: "The choice", text: "He tries to kill Lyria and finds he can’t.", book: 4 },
      { title: "Worthy", text: "He dies in Dark Age. Volsung Fá tears out his heart and calls him worthy.", book: 5 },
    ],
    words: { text: "You are a world entire. You are grand and lovely.", who: "Ephraim, to Lyria", where: "Iron Gold", book: 4 },
    reading: "Ephraim is what war leaves behind: addiction, grief, a man who laughs so he doesn’t have to feel. He isn’t redeemed by a speech. He is redeemed, if at all, by the people he couldn’t stop caring about.",
    motif: "An empty frame in a dim room, the smoke still hanging.",
  },
  {
    slug: "volga",
    file: 14,
    name: "Volga Fjorgan",
    epithet: "The Gentle Giant",
    epithetSource: "archive",
    color: "Obsidian",
    origin: "Earth",
    role: "Freelancer, survivor",
    categories: ["Freedom", "Identity", "Humanity"],
    register: "red",
    wash: "red",
    mood: "hearth",
    firstBook: 4,
    line: "Born to be a weapon. Chose to be a person.",
    lineBook: 3,
    essence: [
      "Volga is physically formidable and emotionally gentle. She comes from a Color bred and raised for violence, and she keeps showing that she does not want to be only a weapon.",
      "She values the simple things: food, company, a quiet life, the people she calls hers.",
    ],
    traits: ["Gentle", "Loyal", "Compassionate", "Strong", "Protective", "Innocent", "Brave", "Family-oriented", "Reluctant warrior", "Resilient"],
    roleText: [
      "An Obsidian freelancer in Ephraim ti Horn’s crew of thieves, and the one friend he still has when Iron Gold begins.",
    ],
    themes: ["Freedom", "Identity", "Strength, not violence", "Family"],
    connections: [
      { name: "Ephraim ti Horn", note: "The closest thing she has to a father, for most of the story.", book: 4, slug: "ephraim" },
      { name: "Lyria of Lagalos", note: "Friend.", book: 4, slug: "lyria" },
      { name: "Ragnar Volarus", note: "Her father.", book: 5, slug: "ragnar" },
      { name: "Sefi the Quiet", note: "Ragnar’s sister, who needs her.", book: 5 },
    ],
    moments: [
      { title: "Snowball", text: "Ephraim rejects her friendship at first, then comes to care for her. He calls her Snowball.", book: 4 },
      { title: "Ragnar’s daughter", text: "She is revealed as Ragnar’s daughter: one of two hundred children grown in a laboratory on Luna from his seed, and sent to Earth for labour because she was judged too short.", book: 5 },
      { title: "The heir", text: "Sefi, poisoned by Atalantia, needs her as heir to the dream of an Obsidian homeland on Mars.", book: 5 },
      { title: "The crown", text: "From a life of crime to Queen of the Obsidian.", book: 6 },
    ],
    words: { text: "Well… I must eat. And I eat much more than you… smaller people. And I like beer.", who: "Volga", where: "Iron Gold, chapter 19", book: 4 },
    reading: "Volga is freedom from inherited identity. Her story is the clearest line the saga draws between strength and violence: she has all of the first and wants none of the second.",
    motif: "A small fire in the snow, and a place set beside it.",
  },
  {
    slug: "ragnar",
    file: 15,
    name: "Ragnar Volarus",
    epithet: "The Shield of Tinos",
    epithetSource: "books",
    color: "Obsidian",
    origin: "The Spires",
    role: "Stained warrior, liberator",
    categories: ["Strength", "Freedom", "Honor"],
    register: "red",
    wash: "red",
    mood: "snow",
    firstBook: 2,
    line: "The warrior who discovered that strength does not require hatred.",
    lineBook: 1,
    essence: [
      "Ragnar is one of the saga’s clearest examples of strength without cruelty.",
      "He was raised in a culture that expected him to become a weapon, and he builds his own understanding of honour, freedom and compassion instead.",
    ],
    traits: ["Strong", "Compassionate", "Loyal", "Disciplined", "Humble", "Courageous", "Protective", "Thoughtful", "Honorable", "Self-sacrificing"],
    roleText: [
      "A Stained Obsidian, the most feared of the Society’s warrior caste, who becomes Darrow’s friend and brother in arms.",
    ],
    themes: ["Strength", "Freedom", "Honor", "Sacrifice"],
    connections: [
      { name: "Darrow", note: "Brother by choice.", book: 2, slug: "darrow" },
      { name: "Sevro", note: "Brother in arms.", book: 2, slug: "sevro" },
      { name: "Sefi the Quiet", note: "Sister.", book: 3 },
      { name: "Volga Fjorgan", note: "Daughter he never knew.", book: 5, slug: "volga" },
    ],
    moments: [
      { title: "The Stained", text: "Introduced in Golden Son as a Stained Obsidian, the Society’s weapon at its most feared.", book: 2 },
      { title: "The alliance", text: "He helps secure the Rising’s alliance with the Obsidian of Mars.", book: 3 },
      { title: "The Shield falls", text: "Killed in battle by Aja au Grimmus.", book: 3 },
      { title: "What he left", text: "His death turns his sister Sefi to the Rising, and she becomes Queen of the Obsidians.", book: 3 },
    ],
    words: { text: "Yield I do not, for a man cannot yield to a dog.", who: "Ragnar", where: "The first trilogy", book: 3 },
    reading: "Ragnar is strength without domination. The Society built him to be its most perfect weapon, and he answered by becoming its most perfect argument against itself.",
    motif: "A dark blade planted in snow, under a cold sky.",
  },
  {
    slug: "kavax",
    file: 16,
    name: "Kavax au Telemanus",
    epithet: "The Bear",
    epithetSource: "archive",
    color: "Gold",
    origin: "House Telemanus, Mars",
    role: "Primus of House Telemanus, warrior, father",
    categories: ["Family", "Loyalty", "Nobility"],
    register: "gold",
    wash: "gold",
    mood: "bear",
    firstBook: 2,
    line: "The Bear with the heart of a father.",
    lineBook: 1,
    essence: [
      "Kavax combines immense physical power with warmth, humour and real affection for his family.",
      "He is the saga’s standing proof that strength and kindness don’t have to be opposites.",
    ],
    traits: ["Loyal", "Warm", "Humorous", "Protective", "Brave", "Family-oriented", "Generous", "Strong", "Noble", "Affectionate"],
    roleText: [
      "The Primus of House Telemanus: husband of Niobe, father of Daxo, Xana, Thraxa and Pax, and a longtime ally of Darrow and Virginia.",
    ],
    themes: ["Family", "Loyalty", "Nobility", "Grief"],
    connections: [
      { name: "Pax au Telemanus", note: "His youngest son, lost at the Institute.", book: 1 },
      { name: "Niobe au Telemanus", note: "Wife.", book: 2 },
      { name: "Daxo and Thraxa", note: "Son and daughter.", book: 2 },
      { name: "Lyria of Lagalos", note: "The girl who pulled him out of the water.", book: 4, slug: "lyria" },
    ],
    moments: [
      { title: "A father first", text: "His youngest, Pax au Telemanus, dies at the Institute protecting Darrow.", book: 1 },
      { title: "The river", text: "He nearly drowns leading the Republic’s defence against the Red Hand. Lyria pulls him out.", book: 4 },
      { title: "The ship", text: "Gravely wounded when his ship is disabled and the children in his care are taken.", book: 4 },
      { title: "Phobos", text: "Apollonius breaks his spine in the Battle of Phobos. He survives.", book: 6 },
    ],
    words: { text: "Magic! Sophocles has discovered a propitious sign of approval, by magic! What a good omen!", who: "Kavax", where: "Golden Son, chapter 27", book: 2 },
    reading: "Kavax is family as strength. In a saga full of fathers who use their children, he is the one who simply loves his, and it makes him formidable rather than soft.",
    motif: "A fox asleep by a great chair.",
    easter: "sophocles",
  },
  {
    slug: "fitchner",
    file: 17,
    name: "Fitchner au Barca",
    epithet: "The Architect",
    epithetSource: "archive",
    color: "Gold",
    origin: "Mars",
    role: "Proctor of House Mars",
    categories: ["Rebellion", "Legacy", "Fatherhood"],
    register: "gold",
    wash: "red",
    mood: "classified",
    firstBook: 1,
    line: "The rebellion had a father before it had a Reaper.",
    lineBook: 2,
    lineEarly: "The Proctor who seemed to care about nothing.",
    essence: [
      "The Proctor of House Mars at the Institute: sardonic, lazy-seeming, and much harder to read than he lets on.",
      { text: "He is the rebellion before Darrow became its face, one of the crucial bridges running Fitchner to Ares to Sevro to the Howlers to Darrow to the Rising.", book: 2 },
    ],
    traits: ["Intelligent", "Secretive", "Cynical", "Strategic", "Defiant", "Protective", "Rebellious", "Manipulative when necessary", "Resourceful", "Sacrificial"],
    roleText: [
      "Proctor of House Mars at the Mars campus of the Institute, the Gold charged with watching over Darrow’s house.",
      { text: "Secretly Ares: the founder of the Sons of Ares, and the architect of the rebellion that put Darrow in a Gold body.", book: 2 },
    ],
    themes: ["Rebellion", "Legacy", "Fatherhood", "Secrecy"],
    connections: [
      { name: "Sevro", note: "Son.", book: 1, slug: "sevro" },
      { name: "Darrow", note: "His student, then his weapon.", book: 1, slug: "darrow" },
      { name: "Bryn of Cryssos", note: "Wife. A Red.", book: 2 },
      { name: "Cassius au Bellona", note: "His killer.", book: 2, slug: "cassius" },
    ],
    moments: [
      { title: "The Proctor", text: "Proctor of House Mars at the Institute, watching Darrow’s year.", book: 1 },
      { title: "Ares", text: "Revealed as Ares, founder of the Sons of Ares.", book: 2 },
      { title: "Bryn", text: "His wife, Bryn of Cryssos, was a Red, killed for bearing a half-Gold son: Sevro.", book: 2 },
      { title: "The end of Ares", text: "Killed by Cassius au Bellona.", book: 2 },
    ],
    words: { text: "My wife called me Fitchner. But the Golds made me Ares.", who: "Fitchner", where: "Golden Son", book: 2 },
    reading: "Fitchner is the architecture behind revolution. The saga’s most important lesson about the Rising might be his: it was never one man’s war, and the Reaper was built before he was born.",
    motif: "A receiver in a buried room, dials lit, still listening.",
  },
  {
    slug: "lorn",
    file: 18,
    name: "Lorn au Arcos",
    epithet: "The Old Wolf",
    epithetSource: "archive",
    color: "Gold",
    origin: "House Arcos",
    role: "Rage Knight, master of the Willow Way",
    categories: ["Tradition", "Honor", "Violence"],
    register: "gold",
    wash: "gold",
    mood: "stone",
    firstBook: 2,
    line: "The old wolf who knew exactly what monsters look like.",
    lineBook: 1,
    essence: [
      "Lorn is an older idea of Gold power: teacher, warrior, philosopher, mentor and killer, all at once.",
      "His view of the world shapes Darrow, and shapes the whole culture of the razor.",
    ],
    traits: ["Disciplined", "Wise", "Severe", "Traditional", "Honorable", "Formidable", "Philosophical", "Protective", "Experienced", "Intimidating"],
    roleText: [
      "The Rage Knight of the Society for more than sixty years, a legendary razormaster, and the creator of the Willow Way.",
    ],
    themes: ["Tradition", "Honor", "Violence", "Mentorship"],
    connections: [
      { name: "Darrow", note: "Student.", book: 2, slug: "darrow" },
      { name: "Alexandar au Arcos", note: "Eldest grandson and heir.", book: 4 },
      { name: "Lysander au Lune", note: "Grandson.", book: 4, slug: "lysander" },
    ],
    moments: [
      { title: "The Rage Knight", text: "Rage Knight for more than sixty years; the razormaster who wrote the Willow Way.", book: 2 },
      { title: "The student", text: "He teaches Darrow the Willow Way.", book: 2 },
      { title: "The Triumph", text: "Killed in the massacre at Darrow’s Triumph, on the Jackal’s orders.", book: 2 },
      { title: "His line", text: "His grandsons carry the name on: Alexandar, heir to House Arcos, and Lysander au Lune.", book: 4 },
    ],
    words: { text: "A fool pulls the leaves. A brute chips the trunk. A sage digs the roots.", who: "Lorn au Arcos", where: "Golden Son", book: 2 },
    reading: "Lorn is tradition confronting revolution. He is everything admirable about the old order, which is exactly why the saga won’t let the old order off the hook.",
    motif: "A razor at rest on an old wooden stand, winter light through stone.",
    easter: "howl",
  },
  {
    slug: "orion",
    file: 19,
    name: "Orion xe Aquarii",
    epithet: "The Storm Captain",
    epithetSource: "archive",
    color: "Blue",
    origin: "Phobos",
    role: "Captain, admiral, Imperator",
    categories: ["Merit", "Leadership", "Freedom"],
    register: "rim",
    wash: "blue",
    mood: "nav",
    firstBook: 2,
    line: "She did not inherit command. She earned it.",
    lineBook: 1,
    essence: [
      "Orion is competence earned by ability, not inherited by birth.",
      "A commander whose identity is bound up with space, ships and the practical realities of war.",
    ],
    traits: ["Intelligent", "Competent", "Independent", "Courageous", "Strategic", "Disciplined", "Loyal", "Commanding", "Practical", "Ambitious"],
    roleText: [
      "A Blue of Phobos: a lowColor Darrow raises to command, who keeps rising on her own.",
    ],
    themes: ["Merit", "Leadership", "Freedom", "Loyalty"],
    connections: [
      { name: "Darrow", note: "He made her a captain.", book: 2, slug: "darrow" },
      { name: "Atlas au Raa", note: "Her torturer.", book: 5, slug: "atlas" },
      { name: "Oro Sculpturus", note: "Chosen to succeed her.", book: 5 },
    ],
    moments: [
      { title: "The Vanguard", text: "She is on the bridge when Darrow and Sevro take the Vanguard. Darrow names her captain of the renamed Pax.", book: 2 },
      { title: "The fleet", text: "By Morning Star she commands the Rising’s ships.", book: 3 },
      { title: "Imperator", text: "An Imperator of the Solar Republic’s navy.", book: 4 },
      { title: "The Ladon", text: "Captured and tortured by Atlas, she dies at the Battle of the Ladon.", book: 5 },
    ],
    words: { text: "I knew I never should have answered your call. I was rather enjoying being a pirate.", who: "Orion", where: "The first trilogy", book: 3 },
    reading: "Orion is merit over hierarchy. The Society said a Blue could fly a ship; she proved a Blue could command a war, and the Republic needed her more than it knew.",
    motif: "A brass orrery, its rings tilted toward a blue star.",
    easter: "orbit",
  },
  {
    slug: "romulus",
    file: 20,
    name: "Romulus au Raa",
    epithet: "The Philosopher King",
    epithetSource: "archive",
    color: "Gold",
    origin: "House Raa, the Rim",
    role: "Sovereign of the Rim Dominion",
    categories: ["Philosophy", "Civilization", "Duty"],
    register: "rim",
    wash: "rim",
    mood: "rim",
    firstBook: 3,
    line: "What if Gold actually believed its own philosophy?",
    lineBook: 2,
    essence: [
      "Romulus is another vision of Gold power, bound up with philosophy, family, tradition and an idea of civilization.",
      "His story asks what happens when someone sincerely believes the system he inherited can produce order and civilization.",
    ],
    traits: ["Philosophical", "Disciplined", "Traditional", "Intelligent", "Authoritative", "Family-oriented", "Principled", "Patient", "Strategic", "Dutiful"],
    roleText: [
      "The Sovereign of the Rim Dominion, who meets Darrow in Morning Star as a wary ally.",
    ],
    themes: ["Philosophy", "Civilization", "Duty", "Honor"],
    connections: [
      { name: "Darrow", note: "A wary ally.", book: 3, slug: "darrow" },
      { name: "Diomedes", note: "Son.", book: 4, slug: "diomedes" },
      { name: "Atlas", note: "Youngest brother.", book: 4, slug: "atlas" },
      { name: "Dido au Raa", note: "Wife, and his accuser.", book: 4 },
      { name: "Lysander", note: "The young man he warns.", book: 4, slug: "lysander" },
    ],
    moments: [
      { title: "The Moon Lord", text: "The Sovereign of the Rim Dominion becomes a wary ally of Darrow.", book: 3 },
      { title: "The trial", text: "Charged with treason for concealing footage he hid to avoid war with the Republic. Dido orchestrates the trial.", book: 4 },
      { title: "The end", text: "He takes his own life in ceremony, urging Lysander to stop the war before it consumes the system.", book: 4 },
    ],
    words: { text: "Honor is not what you say. It is not what you read. Honor is what you do.", who: "Romulus au Raa", where: "Morning Star", book: 3 },
    reading: "Romulus is civilization against freedom. Set him beside Diomedes, Lysander and Darrow and you get four different answers to what order is for. They do not agree, and the saga never pretends they do.",
    motif: "Old books under a single candle, in cold light.",
  },
];

export const getExtended = (slug: string) => EXTENDED.find((p) => p.slug === slug);
