// Ten dossiers. Plot facts are verified (see CLAUDE.md fact-check notes);
// the dossier answers are the ARCHIVIST’S READING of those facts, and the
// UI labels them that way. Every answer carries the book it spoils.

export type Register = "red" | "gold" | "rim" | "none";

export type Answer = { q: string; a: string; book: number };

export type Person = {
  slug: string;
  name: string;
  epithet: string;
  /** "archive": the archive's own name for them, not the books'. */
  epithetSource?: "books" | "archive";
  color: string;
  register: Register;
  firstBook: number;
  titles: string[];
  face: string; // Ten Faces of Power
  hover?: string[]; // title cycle micro-interaction
  motif?: string;
  question: string;
  // Safe at firstBook - 1. A {text, book} entry is a sentence that spoils
  // something inside the character’s first book; it gets its own seal.
  intro: (string | { text: string; book: number })[];
  lenses: {
    person: string;
    belief: string;
    weapon: string;
    relationship: string;
    wound: string;
    legacy: string;
  };
  lensBook: number; // clearance needed to read the lenses
  /** Readings of the character as first met, safe at `book` (the clearance
   * before their first book, same rule as `intro`). Only lenses that can be
   * answered without plot are filled; the rest stay sealed until lensBook.
   * Legacy is never here: it is the ending by definition. */
  /** What to call them before clearance `book`: their full name or epithet
   * would spoil a reveal (Mustang’s family, the Jackal’s identity, whose son
   * Pax is). Static metadata always uses the cover. */
  cover?: { name: string; epithet: string; book: number };
  early?: { book: number; lenses: Partial<Record<"person" | "belief" | "weapon" | "relationship" | "wound", string>> };
  dossier: Answer[];
  bonds?: { name: string; note: string; book: number }[];
};

// `ask` is the plain-language question each lens answers, shown as the
// caption under the lens bar so a first-time reader knows what switching does.
export const LENSES = [
  { key: "person", label: "The Person", ask: "Who are they, underneath the titles?" },
  { key: "belief", label: "The Belief", ask: "What do they believe power is for?" },
  { key: "weapon", label: "The Weapon", ask: "What do they fight with?" },
  { key: "relationship", label: "The Relationship", ask: "Who matters most to them?" },
  { key: "wound", label: "The Wound", ask: "What broke them?" },
  { key: "legacy", label: "The Legacy", ask: "What do they leave behind?" },
] as const;

export type LensKey = (typeof LENSES)[number]["key"];

export const PEOPLE: Person[] = [
  {
    slug: "darrow",
    name: "Darrow O’Lykos",
    epithet: "The Reaper of Mars",
    color: "Red, carved Gold",
    register: "red",
    firstBook: 1,
    titles: ["Darrow of Lykos", "The Reaper", "Morning Star", "Son of Ares", "ArchImperator"],
    face: "Power as rebellion",
    hover: ["Darrow of Lykos", "The Reaper", "Morning Star", "Father"],
    motif: "A clawDrill’s tooth, worn smooth.",
    question: "If the Reaper finally wins, does Darrow get to live?",
    intro: [
      "Before the banners, the razors, the Iron Rains and the mythology, there is a Helldiver of Lykos who wants to make a good life with Eo. That is important. Darrow begins as a boy who wants a family.",
      "The tragedy of Darrow is not that he becomes a monster. It is that he becomes extraordinarily good at becoming one.",
    ],
    lenses: {
      person: "A miner who learned every language of power the Golds spoke, and kept speaking them long after he meant to stop.",
      belief: "That the chains Eo sang about can be broken, and that he is the one who has to break them.",
      weapon: "The razor, and then the myth. By the end, the myth cuts deeper.",
      relationship: "Sevro, the brother who followed him into every fire.",
      wound: "Eo’s execution. Everything after is an answer to it.",
      legacy: "A Republic, a son, and a question about whether the man survived the weapon.",
    },
    lensBook: 3,
    early: {
      book: 0,
      lenses: {
        person: "A sixteen-year-old Helldiver in the mines of Mars, trusted with the most dangerous drill in his clan.",
        belief: "What every Red is taught: that their work underground is making Mars livable for the people who will come after.",
        weapon: "A clawDrill, and hands quick enough to steer it through the deep.",
        relationship: "Eo, his wife, who asks more of the world than he dares to.",
        wound: "Being born Red, in a Society that ranks every person by Color and puts his at the bottom.",
      },
    },
    dossier: [
      { q: "Who was he before the war?", a: "A sixteen-year-old Helldiver in Lykos, married to Eo, proud of his speed in the mines and certain the Society’s story about Reds was true.", book: 1 },
      { q: "What does he believe?", a: "At first, that Eo was naive. Then, that she was right. The saga is the long work of finding out what her dream actually requires.", book: 1 },
      { q: "What is he afraid of?", a: "That the Reaper is all that is left. That his son will know him only as a legend on a feed.", book: 4 },
      { q: "What does he love?", a: "Eo. Then Virginia. Sevro. Pax. The Howlers. The idea of a Mars where a Red can look at the sky without permission.", book: 3 },
      { q: "What does he lie about?", a: "Everything, for years. His Color, his past, his loyalties. The carving made him a lie with a body. The harder lie is the one he tells himself about how much more war he can survive.", book: 1 },
      { q: "Who does he resemble?", a: "Fitchner, more than either would have admitted. Both hid a Red heart inside a Gold role, and both started a war out of grief.", book: 2 },
      { q: "Who does he hate?", a: "The Jackal, cleanly. The Society, abstractly. And, in the dark hours, himself.", book: 3 },
      { q: "Who understands him?", a: "Virginia understands what he is trying to build. Sevro understands what it costs.", book: 3 },
      { q: "What did the war take from him?", a: "Eo, first. Then friends at the Triumph, in the Rain, at Heliopolis. Then years of his son’s childhood.", book: 5 },
      { q: "What did he become?", a: "Reaper. Morning Star. ArchImperator. A man trying to remember why he started.", book: 4 },
      { q: "What does his name mean to the story?", a: "Lykos is Greek for wolf. The saga’s wolf is a miner’s boy from a mine town that shares the name.", book: 1 },
    ],
    bonds: [
      { name: "Eo", note: "The beginning.", book: 1 },
      { name: "Mustang", note: "Love, marriage, and the only equal in every room he enters.", book: 3 },
      { name: "Sevro", note: "Brotherhood.", book: 1 },
      { name: "Cassius", note: "Friendship, blood, forgiveness.", book: 3 },
      { name: "Ragnar", note: "Trust across a manufactured divide.", book: 2 },
      { name: "Lysander", note: "Opposing visions of civilization.", book: 4 },
      { name: "Pax", note: "The life he is fighting to preserve.", book: 4 },
    ],
  },
  {
    slug: "virginia",
    cover: { name: "Mustang", epithet: "Of House Minerva", book: 1 },
    name: "Virginia au Augustus",
    epithet: "Mustang",
    color: "Gold",
    register: "gold",
    firstBook: 1,
    titles: ["Mustang", "Primus of House Minerva", "Sovereign of the Solar Republic"],
    face: "Power as governance",
    motif: "A chessboard with pieces removed.",
    question: "Can you build a humane government with people trained by tyranny?",
    intro: [
      "Virginia is easy to flatten into the genius. Don’t. Her defining trait is not intelligence. It is understanding people: a room, a government, a family, an enemy. Sometimes Darrow.",
      "She was born inside the machine Darrow wanted to destroy, and she understood both its strength and its rot.",
      { text: "She is the daughter of Nero au Augustus, the ArchGovernor who hanged Darrow’s wife.", book: 1 },
    ],
    lenses: {
      person: "Nero au Augustus’s daughter and the Jackal’s twin, who chose to be neither of them.",
      belief: "That a revolution is only as good as the government it leaves behind.",
      weapon: "The room. The vote. The alliance nobody else thought possible.",
      relationship: "Darrow: husband, partner, the person she keeps asking what they are actually building.",
      wound: "A father who loved her the way Golds love a strategic asset, and a brother who became the Jackal.",
      legacy: "The Solar Republic, fragile and hers.",
    },
    lensBook: 3,
    early: {
      book: 0,
      lenses: {
        person: "A Gold student at the Institute, known to everyone there as Mustang.",
        belief: "That loyalty is earned, not taken.",
        weapon: "Reading people: a room, an ally, an enemy.",
        relationship: "Darrow, a rival from another house. What they become is the story.",
      },
    },
    dossier: [
      { q: "Who was she before the war?", a: "Primus of House Minerva at the Institute, and the only student there who seemed to think past the next battle.", book: 1 },
      { q: "What does she believe?", a: "That the question after victory matters more than the victory. Her political philosophy is patience in a family built on appetite.", book: 3 },
      { q: "What is she afraid of?", a: "That the Republic becomes a new Society with better branding.", book: 4 },
      { q: "What does she love?", a: "Darrow. Pax. And the unglamorous machinery of governing: the Senate, the compromise, the slow vote.", book: 4 },
      { q: "What does she lie about?", a: "How fragile it all is. A Sovereign can’t afford to look afraid.", book: 5 },
      { q: "Who does she resemble?", a: "Her father, in the way she reads a board. Never in what she is willing to spend to win it.", book: 2 },
      { q: "Who does she hate?", a: "Hate is too simple for her. The closest she comes is Adrius.", book: 3 },
      { q: "Who understands her?", a: "Fewer people than she deserves. Darrow on his best days.", book: 3 },
      { q: "What did the war take from her?", a: "Her father, her brother, a normal marriage, and years of her son’s peace.", book: 3 },
      { q: "What did she become?", a: "Sovereign of the Solar Republic, and the saga’s real political protagonist. Fans still argue about that last part.", book: 4 },
      { q: "What does her name mean to the story?", a: "Augustus: the first Roman emperor, the one who made a republic into an empire. His descendant is trying to do the reverse.", book: 1 },
    ],
  },
  {
    slug: "cassius",
    name: "Cassius au Bellona",
    epithet: "The Morning Knight",
    color: "Gold",
    register: "gold",
    firstBook: 1,
    titles: ["Morning Knight", "Swordsman", "Brother", "Exile"],
    face: "Power as honor",
    hover: ["Cassius au Bellona", "Brother", "Morning Knight", "My honor remains."],
    motif: "A broken razor laid beside an untouched glass of wine.",
    question: "What remains when honor outlives the people who taught you what honor meant?",
    intro: [
      "Cassius is contradiction. Beautiful. Arrogant. Funny. Vain. Loyal. Petty. Romantic. Grieving. And, eventually, capable of enormous grace.",
      "He begins as Darrow’s friend in House Mars.",
      { text: "Then Darrow kills his brother Julian in the Passage, and one fact destroys everything.", book: 1 },
    ],
    lenses: {
      person: "A Bellona son raised to be a perfect knight, who had to learn which parts of that were worth keeping.",
      belief: "That honor is real even when the people who preach it are not.",
      weapon: "The razor, carried with more style than anyone in the saga.",
      relationship: "Darrow: friend, enemy, brother, in that order and at great cost.",
      wound: "Julian. Then his arm, his family, and his faith in the Society.",
      legacy: "He protects a boy who might become the next Sovereign, and dies naming himself.",
    },
    lensBook: 6,
    early: {
      book: 0,
      lenses: {
        person: "A Bellona son at the Institute: handsome, arrogant, funny, and very good with a blade.",
        belief: "In his family’s honor, which he was raised to carry as his own.",
        weapon: "The razor, carried with more style than anyone in the saga.",
        relationship: "Darrow, a friend from the first days in House Mars.",
      },
    },
    dossier: [
      { q: "Who was he before the war?", a: "The golden son of House Bellona, charming and sure of himself, with a brother, Julian, gentler than he was.", book: 1 },
      { q: "What does he believe?", a: "In honor, first as inheritance, later as a decision he makes alone.", book: 3 },
      { q: "What is he afraid of?", a: "Being nobody once the house and the war and the Sovereign are gone.", book: 4 },
      { q: "What does he love?", a: "Julian. His family. Later, Lysander, and against every instinct, Darrow.", book: 4 },
      { q: "What does he lie about?", a: "That revenge would be enough.", book: 2 },
      { q: "Who does he resemble?", a: "Lysander, whom he shapes. And Darrow, whom he spent years refusing to resemble.", book: 4 },
      { q: "Who does he hate?", a: "Darrow, for Julian. Then the Sovereign, for everything she spent his family on.", book: 3 },
      { q: "Who understands him?", a: "Darrow, eventually, which is the whole tragedy and the whole grace of the thing.", book: 6 },
      { q: "What did the war take from him?", a: "His brother in the Passage. His arm at the Gala, to Darrow’s razor. His family. His home.", book: 3 },
      { q: "What did he become?", a: "The Morning Knight. An exile. A guardian. A brother.", book: 4 },
      { q: "What does his name mean to the story?", a: "Bellona was the Roman goddess of war. Her last knight chose mercy.", book: 6 },
    ],
  },
  {
    slug: "sevro",
    name: "Sevro au Barca",
    epithet: "The Goblin",
    color: "Gold, son of a Red",
    register: "red",
    firstBook: 1,
    titles: ["The Goblin", "Ares", "Howler", "Husband", "Father"],
    face: "Power as loyalty",
    motif: "A wolf wearing a crown it doesn’t want.",
    question: "How do you stop carrying the war home?",
    intro: [
      "Sevro is the character who stops the saga from becoming too solemn. Obscene where Darrow is mythic. Feral where Darrow is disciplined. Funny when everyone else is dying.",
      "Underneath all of it: terrified of losing the people he loves.",
    ],
    lenses: {
      person: "Fitchner’s son, born on Mars to a Red mother his father was never allowed to marry.",
      belief: "That the people beside you are the only cause worth the name.",
      weapon: "The Howlers.",
      relationship: "Darrow. Two men who built a revolution together and kept hurting each other because neither knew how to stop.",
      wound: "His mother’s execution. His father’s death at Cassius’s hand. And later, his son.",
      legacy: "Victra, four children, and a war he never wanted to inherit.",
    },
    lensBook: 5,
    early: {
      book: 0,
      lenses: {
        person: "A small, feral Gold in House Mars whom nobody takes seriously. They should.",
        belief: "That the people beside you are the only cause worth the name.",
        weapon: "Surprise, filth, and not caring what anyone thinks of him.",
        relationship: "Darrow, whose closest friend he becomes.",
      },
    },
    dossier: [
      { q: "Who was he before the war?", a: "A feral Gold at the Institute who everyone underestimated, born to Fitchner au Barca and Bryn of Cryssos, a Red woman.", book: 1 },
      { q: "What does he believe?", a: "In the Howlers. In Darrow. In the Sons of Ares his father built.", book: 2 },
      { q: "What is he afraid of?", a: "Losing his family the way his father lost his mother.", book: 5 },
      { q: "What does he love?", a: "Victra. Electra, Calypso and Diana-Selene. Darrow, loudly and profanely.", book: 4 },
      { q: "What does he lie about?", a: "Being fine.", book: 4 },
      { q: "Who does he resemble?", a: "Fitchner: the jokes over the grief, the rebellion over the Gold birthright.", book: 2 },
      { q: "Who does he hate?", a: "Whoever threatens his family. The list gets long.", book: 5 },
      { q: "Who understands him?", a: "Victra, who is no gentler than he is.", book: 4 },
      { q: "What did the war take from him?", a: "His father, killed by Cassius. His newborn son Ulysses, killed by Harmony’s Red Hand.", book: 5 },
      { q: "What did he become?", a: "Ares. A husband. A father trying to stay one.", book: 3 },
      { q: "What does his name mean to the story?", a: "Barca: Hannibal’s family, the great enemy of Rome. The Barcas were always going to be the ones fighting the empire.", book: 1 },
    ],
  },
  {
    slug: "pax",
    cover: { name: "Pax", epithet: "The First Child", book: 3 },
    name: "Pax au Augustus",
    epithet: "The First Child",
    color: "No Color designation",
    register: "none",
    firstBook: 4,
    titles: ["Heir to the Morning Chair", "Engineer", "Son"],
    face: "Power as inheritance",
    motif: "A hoverbike he had to build himself.",
    question: "What does freedom look like to a child who never experienced the cage?",
    intro: [
      "Pax is not merely Darrow’s son. He is the first generation born with no Color designation under the new Republic: something that did not exist when his father was born.",
      "He is named for Pax au Telemanus, the enormous, laughing Gold who died shielding Darrow at the Institute.",
    ],
    lenses: {
      person: "A ten-year-old heir with his father’s absence and his mother’s mind.",
      belief: "That things can be built, not only fought for.",
      weapon: "Engineering. A harness he made himself.",
      relationship: "Darrow, whom he knows as the Reaper and wants to know as Dad.",
      wound: "Growing up inside the consequences of his father’s mythology.",
      legacy: "Proof that the Republic produced something the Society never could.",
    },
    lensBook: 6,
    early: {
      book: 3,
      lenses: {
        person: "Darrow and Virginia’s ten-year-old son, the first child of the new Republic.",
        belief: "That things can be built, not only fought for.",
        weapon: "Engineering. He makes things with his hands.",
        relationship: "Darrow, whom he knows as the Reaper and wants to know as Dad.",
      },
    },
    dossier: [
      { q: "Who was he before the war?", a: "There is no before. He was born into it.", book: 4 },
      { q: "What does he believe?", a: "That you can have the hoverbike if you build it yourself. His mother told him so, and he did.", book: 4 },
      { q: "What is he afraid of?", a: "That his father will never come home as himself.", book: 4 },
      { q: "What does he love?", a: "Machines. Invention. A handheld ocular device he designed that plays opera for one listener only.", book: 6 },
      { q: "What does he lie about?", a: "How scared he is. He learned that from both parents.", book: 6 },
      { q: "Who does he resemble?", a: "Virginia, in the mind. Darrow, in the stubbornness.", book: 4 },
      { q: "Who does he hate?", a: "Not yet anyone. That may be the most hopeful fact in the archive.", book: 4 },
      { q: "Who understands him?", a: "Electra au Barca, who grew up inside the same war.", book: 4 },
      { q: "What did the war take from him?", a: "A sheltered childhood. He comes out of it with scars and skills.", book: 6 },
      { q: "What did he become?", a: "Not a soldier first. An engineer who had to become brave.", book: 6 },
      { q: "What does his name mean to the story?", a: "Pax: peace. Named for a warrior who died protecting his father.", book: 4 },
    ],
  },
  {
    slug: "diomedes",
    name: "Diomedes au Raa",
    epithet: "The Storm Knight of the Rim",
    color: "Gold of the Rim",
    register: "rim",
    firstBook: 4,
    titles: ["Storm Knight", "Son of Romulus and Dido", "Duelist"],
    face: "Power as duty",
    motif: "A storm cloak, alive with cloud and lightning.",
    question: "What does honor ask of you when your own people disagree about what it means?",
    intro: [
      "Diomedes belongs to a culture with its own traditions, distance and discipline. He is quiet. Serious. Extremely capable. When he speaks, it matters.",
      "White-gold hair streaked with black. A face that is a depository of scars. His left ear is gone. A painted dragon on his helm.",
    ],
    lenses: {
      person: "The second son of Romulus au Raa, raised in the Rim’s older idea of Gold.",
      belief: "Duty, as the Rim understands it: to family, to people, to the oath.",
      weapon: "The duel. Among the finest of his generation.",
      relationship: "His uncle Atlas, who wields fear the way Diomedes wields a blade.",
      wound: "Serving a house that argues with itself about what honor requires.",
      legacy: "Proof that the Solar System is not culturally uniform.",
    },
    lensBook: 5,
    early: {
      book: 3,
      lenses: {
        person: "The second son of Romulus au Raa, raised in the Rim’s older idea of Gold.",
        belief: "Duty, as the Rim understands it: to family, to people, to the oath.",
        weapon: "The duel. Among the finest of his generation.",
      },
    },
    dossier: [
      { q: "Who was he before the war?", a: "A Rim knight, far from the Core’s politics, trained in the Raa family’s discipline.", book: 4 },
      { q: "What does he believe?", a: "In the Rim’s honor, which is older and stranger than the Core’s.", book: 4 },
      { q: "What is he afraid of?", a: "Disgrace. Not death.", book: 5 },
      { q: "What does he love?", a: "His family and his people, more than any Sovereign.", book: 4 },
      { q: "What does he lie about?", a: "Little. It is one of the ways he is unlike his uncle.", book: 5 },
      { q: "Who does he resemble?", a: "Cassius, in the devotion to honor. Never in the vanity.", book: 5 },
      { q: "Who does he hate?", a: "Those who break oaths.", book: 5 },
      { q: "Who understands him?", a: "The archive does not claim to know. The books keep him at a distance on purpose.", book: 5 },
      { q: "What did the war take from him?", a: "The Rim’s isolation. It pulled him into the Core’s war.", book: 4 },
      { q: "What did he become?", a: "A knight fans still argue about as the best duelist in the saga.", book: 5 },
      { q: "What does his name mean to the story?", a: "Diomedes: the Greek hero who wounded gods at Troy.", book: 4 },
    ],
  },
  {
    slug: "atlas",
    name: "Atlas au Raa",
    epithet: "The Fear Knight",
    color: "Gold of the Rim",
    register: "rim",
    firstBook: 4,
    titles: ["The Fear Knight", "Legate of Legio Zero", "Brother of Romulus", "Father of Ajax"],
    face: "Power as fear",
    motif: "A shelf of carved totems, each one a person who fooled him.",
    question: "How deeply can you understand an enemy before you become them?",
    intro: [
      "Atlas should not be presented as the scary villain. That is exactly the shallow treatment the character escapes. He represents a different kind of warfare.",
      "Not how many people can I kill, but how deeply can I understand the enemy.",
    ],
    lenses: {
      person: "Romulus au Raa’s youngest brother, and the Society’s Fear Knight until his banishment to the Kuiper Belt.",
      belief: "That fear, understood precisely, is more efficient than force.",
      weapon: "Patience. Psychology. Legio Zero.",
      relationship: "Diomedes, his nephew, whose honor is everything Atlas’s methods are not.",
      wound: "Being fooled, once, by his own prejudice.",
      legacy: "A war fought with fear, and a lesson about what it cannot do.",
    },
    lensBook: 5,
    early: {
      book: 3,
      lenses: {
        person: "Romulus au Raa’s youngest brother, who holds the Society’s title of Fear Knight.",
        belief: "That fear, understood precisely, is more efficient than force.",
        weapon: "Patience. Psychology.",
      },
    },
    dossier: [
      { q: "Who was he before the war?", a: "A son of House Raa who left the Rim to serve the Society as its Fear Knight, commanding Legio Zero, the Pavor Nocturnus. Banished to the Kuiper Belt in 739 PCE.", book: 4 },
      { q: "What does he believe?", a: "That war is an exercise in understanding.", book: 5 },
      { q: "What is he afraid of?", a: "Being understood as completely as he understands others.", book: 5 },
      { q: "What does he love?", a: "The archive does not know. That silence is part of his file.", book: 5 },
      { q: "What does he lie about?", a: "Almost everything, on purpose, as method.", book: 5 },
      { q: "Who does he resemble?", a: "Octavia, in the long view. Darrow, uncomfortably, in the willingness to become what the war needs.", book: 5 },
      { q: "Who does he hate?", a: "Hate would be inefficient.", book: 5 },
      { q: "Who understands him?", a: "Daedre, for one week in 747 PCE. That is why she is carved into a totem.", book: 6 },
      { q: "What did the war take from him?", a: "His home in the Rim. The trust of the people who know what he does.", book: 5 },
      { q: "What did he become?", a: "A mind behind a mask, and a man who carves reminders of his own mistakes.", book: 5 },
      { q: "What does his name mean to the story?", a: "Atlas held up the sky. This one holds up a war.", book: 4 },
    ],
  },
  {
    slug: "lysander",
    name: "Lysander au Lune",
    epithet: "The Heir",
    color: "Gold",
    register: "gold",
    firstBook: 4,
    titles: ["Heir of House Lune", "Grandson of Octavia", "Student of the Mind’s Eye"],
    face: "Power as order",
    motif: "A pristine portrait with a hairline fracture.",
    question: "Is he a tragic character, or a tyrant in the making? The archive won’t decide for you.",
    intro: [
      "Lysander is not interesting because he’s the bad guy. He’s interesting because he can look at the same civilization Darrow sees and reach a different conclusion.",
      "Raised by Octavia. Trained in the Mind’s Eye. Formed by years in exile with Cassius. He understands the cruelty of the Society and still believes its fall produced something worse.",
    ],
    lenses: {
      person: "The last Sovereign’s grandson, raised to inherit a world that was taken from him.",
      belief: "That civilization requires order, and order requires someone to hold it.",
      weapon: "The Mind’s Eye, and the loyalty of people who miss the old world.",
      relationship: "Cassius, the guardian who taught him honor and may have taught it too well.",
      wound: "Growing up in the ruins of his family’s world.",
      legacy: "The Society’s future, if it has one.",
    },
    lensBook: 6,
    early: {
      book: 3,
      lenses: {
        person: "Octavia au Lune’s grandson, carried out of the fall of her world as a boy.",
        belief: "That civilization requires order, and order requires someone to hold it.",
        weapon: "The Mind’s Eye, the training his grandmother gave him.",
        relationship: "Cassius, the guardian who took him into exile.",
        wound: "Growing up in the ruins of his family’s world.",
      },
    },
    dossier: [
      { q: "Who was he before the war?", a: "A child at Octavia’s court on Luna, the heir of House Lune.", book: 3 },
      { q: "What does he believe?", a: "Order. Continuity. Hierarchy. Responsibility. Civilization.", book: 4 },
      { q: "What is he afraid of?", a: "Chaos, and becoming the monster his grandmother was.", book: 5 },
      { q: "What does he love?", a: "Cassius. The idea of a gentler Society.", book: 4 },
      { q: "What does he lie about?", a: "Whether a gentler Society is possible.", book: 6 },
      { q: "Who does he resemble?", a: "Octavia, more than he wants to. Cassius, less than he thinks.", book: 5 },
      { q: "Who does he hate?", a: "The Reaper, for what he did to Lysander’s world.", book: 5 },
      { q: "Who understands him?", a: "Cassius. Possibly no one else.", book: 4 },
      { q: "What did the war take from him?", a: "His grandmother, his home, his childhood on Luna.", book: 3 },
      { q: "What did he become?", a: "The Society’s heir in fact, not just in name.", book: 6 },
      { q: "What does his name mean to the story?", a: "Lysander: the Spartan admiral who won the war and ended Athens’s democracy.", book: 4 },
    ],
  },
  {
    slug: "victra",
    name: "Victra au Julii",
    epithet: "The Iron Woman",
    epithetSource: "archive",
    color: "Gold",
    register: "gold",
    firstBook: 2,
    titles: ["Daughter of House Julii", "Warrior", "Victra au Barca", "Mother"],
    face: "Power as loyalty, chosen",
    motif: "Gold shards, split and sharpened, on dark stone.",
    question: "What does it take to choose your own name when your family already chose it for you?",
    intro: [
      "Victra au Julii is fiercely independent, brutally direct, intensely loyal and exceptionally dangerous.",
      { text: "She enters Golden Son among the Golds around Darrow, a daughter of House Julii, and becomes one of his closest friends.", book: 2 },
    ],
    lenses: {
      person: "A daughter of House Julii, raised on its ruthlessness, who chose loyalty instead and kept choosing it.",
      belief: "That loyalty is a choice, and that once she has made it, it is not up for negotiation.",
      weapon: "The razor, and a bluntness sharper than it.",
      relationship: "Sevro, the man she asked to marry her.",
      wound: "The Triumph: shot in the spine by her half-sister, her mother killed beside her.",
      legacy: "She trades Julii for Barca and builds the family her own never was.",
    },
    lensBook: 4,
    early: {
      book: 1,
      lenses: {
        person: "A daughter of House Julii: rich, blunt, and famously dangerous.",
        belief: "In strength, and in saying exactly what she means.",
        weapon: "The razor, and a bluntness sharper than it.",
        relationship: "Darrow, the new Gold she decides to trust.",
      },
    },
    dossier: [
      { q: "Who was she before the war?", a: "A daughter of Agrippina au Julii, Primus of one of Mars’s richest houses, and half-sister to Antonia.", book: 2 },
      { q: "What does she believe?", a: "That loyalty is chosen, and that she decides who has earned it.", book: 2 },
      { q: "What is she afraid of?", a: "Being only what the Julii made her.", book: 2 },
      { q: "What does she love?", a: "Sevro. Their daughters. Darrow, as a brother she chose.", book: 4 },
      { q: "What does she lie about?", a: "That she needs no one.", book: 3 },
      { q: "Who does she resemble?", a: "Sevro, which is exactly why it works.", book: 3 },
      { q: "Who does she hate?", a: "Antonia, who shot her and killed their mother.", book: 2 },
      { q: "Who understands her?", a: "Sevro, who is no gentler than she is.", book: 3 },
      { q: "What did the war take from her?", a: "Her mother, at the Triumph. Later a newborn son, to the Red Hand, and an ear.", book: 5 },
      { q: "What did she become?", a: "Victra au Barca: wife, mother, and one of the Rising’s fiercest fighters.", book: 4 },
      { q: "What does her name mean to the story?", a: "It echoes victrix, the Latin for a woman who conquers. She keeps the name and trades the house.", book: 3 },
    ],
  },
  {
    slug: "the-jackal",
    cover: { name: "The Jackal", epithet: "Of House Pluto", book: 1 },
    name: "Adrius au Augustus",
    epithet: "The Jackal",
    color: "Gold",
    register: "gold",
    firstBook: 1,
    titles: ["The Jackal", "Son of Nero", "Virginia’s twin"],
    face: "Power as control",
    motif: "A chess piece swept off the board.",
    question: "What happens when someone learns every lesson of the Society except mercy?",
    intro: [
      "Every revolution needs someone who shows what the old world produces when it works exactly as designed. The Jackal is that person.",
      "The most intelligent monster in the saga.",
      { text: "His name is Adrius au Augustus: Virginia’s twin, Nero’s son.", book: 1 },
    ],
    lenses: {
      person: "The son Nero au Augustus never loved enough, and who never forgave him for it.",
      belief: "That control is the only safety.",
      weapon: "Patience, cruelty, and a talent for knowing where everyone will stand.",
      relationship: "Virginia, the sister who became everything he couldn’t.",
      wound: "A father’s contempt, and a brother, Claudius, he arranged to have killed as a child.",
      legacy: "The man who proved Darrow’s revolution was necessary.",
    },
    lensBook: 3,
    early: {
      book: 0,
      lenses: {
        person: "The Primus of House Pluto at the Institute, known only as the Jackal.",
        belief: "That control is the only safety.",
        weapon: "Patience, and a talent for knowing where everyone will stand.",
      },
    },
    dossier: [
      { q: "Who was he before the war?", a: "A slight, brilliant Augustus son at the Institute, underestimated by his father.", book: 1 },
      { q: "What does he believe?", a: "That everyone is a piece, and that he is the only player.", book: 2 },
      { q: "What is he afraid of?", a: "Being unloved, and being powerless. For him those are the same thing.", book: 2 },
      { q: "What does he love?", a: "The archive has not found evidence.", book: 3 },
      { q: "What does he lie about?", a: "Everything, with precision.", book: 2 },
      { q: "Who does he resemble?", a: "Nero. That is the tragedy he kills his father over.", book: 2 },
      { q: "Who does he hate?", a: "Darrow. Nero. Virginia. The list is shorter than the list of people he hasn’t hurt.", book: 2 },
      { q: "Who understands him?", a: "Virginia, too well.", book: 3 },
      { q: "What did the war take from him?", a: "His tongue, to Darrow’s razor. Then his life, at the end of a rope.", book: 3 },
      { q: "What did he become?", a: "The villain of the first trilogy, and its most complete warning.", book: 3 },
      { q: "What does his name mean to the story?", a: "Jackals scavenge the dead. He killed Pax au Telemanus, who was shielding Darrow’s body with his own.", book: 1 },
    ],
  },
];

export const getPerson = (slug: string) => PEOPLE.find((p) => p.slug === slug);

/** Name and epithet as far as this clearance may know them. */
export const shownAs = (p: Person, clearance: number) =>
  p.cover && clearance < p.cover.book ? { name: p.cover.name, epithet: p.cover.epithet } : { name: p.name, epithet: p.epithet };
/** The always-safe version, for static text (titles, alt, no-JS). */
export const safeAs = (p: Person) => shownAs(p, 0);
