// The history, as nodes. PCE = Post-Conquering Era. Dates are only given
// where a source fixed them (see CLAUDE.md); otherwise the node is anchored
// to its book, which is how readers actually locate events anyway.

export type TimelineNode = {
  slug: string;
  title: string;
  when: string;
  where?: string;
  book: number; // clearance needed to open the node (0 = safe)
  summary: string;
  participants?: string[];
  consequences?: string;
  dead?: string[];
  related?: { people?: string[]; books?: string[] };
  status?: "sealed";
};

export const TIMELINE: TimelineNode[] = [
  {
    slug: "the-conquering",
    title: "The Conquering",
    when: "Year 0 PCE",
    where: "Luna, Earth",
    book: 0,
    summary:
      "Silenius, a Lunese upstart, rallies the Moon to independence from Earth and leads it to war against Earth’s nations. With his friend Akari au Raa he builds what comes next.",
    participants: ["Silenius au Lune", "Akari au Raa"],
    consequences: "Every calendar in the Society is dated from this war. Its victors write the next seven centuries.",
    related: { people: ["Lysander (House Lune)", "Diomedes and Atlas (House Raa)"] },
  },
  {
    slug: "color-society",
    title: "The Society",
    when: "Early PCE",
    where: "The Solar System",
    book: 0,
    summary:
      "Silenius becomes the first Sovereign. Humanity is divided into Colors, each engineered for a function, with Gold at the top. The pre-Color population on Earth is sterilized out of existence.",
    consequences: "The hierarchy is made hereditary, genetic and social at once. It is designed to look like the natural order.",
    related: { books: ["The Fourteen Colors (The World, coming in Phase 2)"] },
  },
  {
    slug: "dark-revolt",
    title: "The Dark Revolt",
    when: "200 PCE",
    book: 0,
    summary:
      "The Obsidians, bred by the millions to win the Conquering and then surplus to a peaceful Society, are to be culled. They rise instead.",
    participants: ["The Obsidians", "The Society"],
    consequences: "The revolt fails. Obsidian society and culture are reshaped afterward to keep them controllable.",
  },
  {
    slug: "sons-of-ares",
    title: "The Sons of Ares",
    when: "After 720 PCE",
    where: "Mars",
    book: 2,
    summary:
      "Fitchner au Barca, a Gold, secretly marries a Red woman, Bryn of Cryssos. The Society’s Board of Quality Control executes her. Fitchner answers by founding a rebellion.",
    participants: ["Fitchner au Barca", "Bryn of Cryssos", "Dancer", "Harmony"],
    consequences: "The organization that will one day find a grieving Helldiver in Lykos.",
    related: { people: ["Sevro, their son"], books: ["Red Rising: Sons of Ares (official comics)"] },
  },
  {
    slug: "eo",
    title: "Eo",
    when: "736 PCE",
    where: "Lykos, Mars",
    book: 1,
    summary:
      "Eo sings the forbidden song, the one the Reds call the Reaping Song or the Vale Song. On ArchGovernor Nero au Augustus’s order she is hanged while Darrow watches. He buries her, which is also forbidden, and is hanged in turn. His uncle Narol makes sure he survives it.",
    participants: ["Eo", "Darrow", "Nero au Augustus", "Narol"],
    dead: ["Eo"],
    consequences: "Everything.",
    related: { people: ["Darrow"], books: ["Red Rising"] },
  },
  {
    slug: "the-carving",
    title: "Darrow’s Carving",
    when: "Early 737 PCE",
    where: "Yorkton, Mars",
    book: 1,
    summary:
      "Dancer and Harmony of the Sons of Ares bring Darrow to Mickey, a Violet carver working out of Yorkton’s lowColor bazaar. Surgery and hormone therapy rebuild a Red into a Gold.",
    participants: ["Darrow", "Mickey", "Dancer", "Harmony"],
    consequences: "A Red inside a Gold. The one thing the Society never designed for.",
    related: { books: ["Red Rising"] },
  },
  {
    slug: "the-institute",
    title: "The Institute",
    when: "Red Rising",
    where: "The Institute, Mars",
    book: 1,
    summary:
      "The Passage kills Julian au Bellona by Darrow’s hand. Then the houses go to war as children, under the eyes of the Proctors. Darrow’s House Mars wins, at a cost.",
    participants: ["Darrow", "Mustang", "Sevro", "Cassius", "Roque", "The Jackal", "Pax au Telemanus", "Fitchner"],
    dead: ["Julian au Bellona", "Pax au Telemanus"],
    consequences: "Darrow earns the name the Reaper. The Jackal earns his.",
    related: { books: ["Red Rising"] },
  },
  {
    slug: "the-gala",
    title: "The Gala on Luna",
    when: "Golden Son",
    where: "Luna",
    book: 2,
    summary:
      "Darrow challenges Cassius before the Sovereign and severs his arm. Mustang stops the final blow. The duel was built to start a Gold civil war.",
    participants: ["Darrow", "Cassius", "Mustang", "Octavia au Lune", "Lorn au Arcos"],
    consequences: "Augustus and Bellona go to open war.",
    related: { books: ["Golden Son"] },
  },
  {
    slug: "iron-rain",
    title: "The Iron Rain",
    when: "Golden Son",
    where: "Mars",
    book: 2,
    summary: "Darrow leads soldiers falling from orbit onto Mars. The revolution learns what war at scale feels like.",
    participants: ["Darrow"],
    related: { books: ["Golden Son"] },
  },
  {
    slug: "the-triumph",
    title: "The Triumph",
    when: "Golden Son",
    where: "Mars",
    book: 2,
    summary:
      "Darrow’s victory celebration becomes a massacre. Roque poisons him. The Jackal, Aja, Cassius and Antonia lead the killing. Fitchner, who was Ares, is already dead: killed by Cassius in 742 PCE.",
    participants: ["The Jackal", "Roque", "Cassius", "Aja au Grimmus", "Antonia au Severus-Julii", "Lilath"],
    dead: ["Lorn au Arcos", "Nero au Augustus", "Fitchner au Barca"],
    consequences: "Darrow is taken, paralyzed, and marked for dissection.",
    related: { books: ["Golden Son"] },
  },
  {
    slug: "the-rising",
    title: "The Rising",
    when: "Morning Star",
    where: "Mars, the Rim, Luna",
    book: 3,
    summary:
      "Sevro, now Ares, breaks Darrow out. The Obsidians are freed. The lowColors rise. The war becomes a movement and the movement becomes a myth.",
    participants: ["Darrow", "Sevro", "Mustang", "Ragnar", "Victra", "The Howlers"],
    dead: ["Ragnar Volarus", "Roque au Fabii"],
    related: { books: ["Morning Star"] },
  },
  {
    slug: "the-fall",
    title: "The Fall of Luna",
    when: "November 743 PCE",
    where: "Luna",
    book: 3,
    summary: "Darrow kills Octavia au Lune. The Jackal is taken alive and later hanged. The Rising ends.",
    participants: ["Darrow", "Octavia au Lune", "The Jackal", "Mustang"],
    dead: ["Octavia au Lune", "Adrius au Augustus"],
    consequences: "The Solar Republic is founded.",
    related: { books: ["Morning Star"] },
  },
  {
    slug: "solar-republic",
    title: "The Solar Republic",
    when: "743 PCE",
    book: 3,
    summary:
      "Virginia au Augustus becomes Sovereign of a Republic that has won a war and inherited a system. The Morning Star becomes the flagship of the White Fleet.",
    consequences: "The hardest question: can revolution become government without becoming the thing it replaced?",
  },
  {
    slug: "ten-years",
    title: "Ten Years of War",
    when: "743-753 PCE",
    where: "Across the Solar System",
    book: 4,
    summary:
      "The Society Remnant refuses to stay dead. The Republic wins battle after battle and never quite wins the peace. The Morning Star, now the flagship of the White Fleet, fights in nearly every major engagement.",
    participants: ["Darrow", "The Solar Republic", "The Society Remnant"],
    consequences: "A generation of children, Pax among them, grows up knowing nothing but this war.",
    related: { books: ["Iron Gold"] },
  },
  {
    slug: "iron-gold",
    title: "Iron Gold",
    when: "c. 753 PCE",
    where: "Luna, Mars, the Belt, Mercury",
    book: 4,
    summary: "Four lives, four views of the Republic: Darrow, Lyria, Ephraim, Lysander.",
    related: { books: ["Iron Gold"] },
  },
  {
    slug: "dark-age",
    title: "Dark Age",
    when: "After Iron Gold",
    where: "Mercury, Luna, Mars",
    book: 5,
    summary: "The siege of Heliopolis. The Republic fractures. Harmony’s Red Hand kills Ulysses au Barca. Ephraim dies worthy.",
    dead: ["Ulysses au Barca", "Ephraim ti Horn"],
    related: { books: ["Dark Age"] },
  },
  {
    slug: "light-bringer",
    title: "Light Bringer",
    when: "After Dark Age",
    where: "Mars, Phobos",
    book: 6,
    summary: "Mars under siege. Darrow on the long way home. Cassius’s last charge.",
    dead: ["Cassius au Bellona"],
    related: { books: ["Light Bringer"] },
  },
  {
    slug: "red-god",
    title: "Red God",
    when: "Unwritten",
    book: 0,
    summary: "The final archive remains sealed.",
    status: "sealed",
  },
];
