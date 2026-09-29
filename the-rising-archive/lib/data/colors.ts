// The fourteen Colors, bottom of the pyramid to the top. Functions follow the
// saga's own caste roles (checked against the Red Rising Wiki and the brief's
// corrected table). The `voice` lines are this archive's own flavour writing,
// describing the function, not quoting the books.

export type ColorTier = {
  name: string;
  hex: string;
  ink: string; // text colour that reads on the tier's band
  role: string;
  voice: string;
  face: "display" | "sans" | "mono" | "serif";
};

export const COLORS: ColorTier[] = [
  { name: "Red", hex: "#7e1018", ink: "#f3d9d4", role: "Manual labour and mining", voice: "The bottom of the world. The drills, the heat, the songs that are forbidden.", face: "display" },
  { name: "Pink", hex: "#b77487", ink: "#1b0c11", role: "Pleasure and social functions", voice: "Bought company. Bred to please the people above.", face: "sans" },
  { name: "Obsidian", hex: "#1d1e22", ink: "#cfd2d8", role: "Elite warriors", voice: "Giants bred for war, raised far from the cities that use them.", face: "display" },
  { name: "Brown", hex: "#5d4631", ink: "#efe3d2", role: "Servants and domestic labour", voice: "The hands that clean the palaces and are never seen in them.", face: "sans" },
  { name: "Gray", hex: "#6f7379", ink: "#0e0f11", role: "Soldiers and police", voice: "The Society’s enforcement. Orders, rifles, and the long patrol.", face: "mono" },
  { name: "Orange", hex: "#b8622b", ink: "#1c0d04", role: "Mechanics and engineering", voice: "Engines, reactors, the machinery that keeps the ships alive.", face: "mono" },
  { name: "Violet", hex: "#6f5584", ink: "#f1e8f6", role: "Art and creative work", voice: "The makers. Artists, designers, and the Carvers who reshape bodies.", face: "serif" },
  { name: "Green", hex: "#3f6b4d", ink: "#e3f1e6", role: "Programming and technology", voice: "Code, networks, systems. The Society’s nervous system.", face: "mono" },
  { name: "Yellow", hex: "#caa640", ink: "#1f1804", role: "Medicine and research", voice: "Doctors and scientists. The people who keep the body of power alive.", face: "sans" },
  { name: "Blue", hex: "#355f9c", ink: "#e6eefb", role: "Pilots and ship crews", voice: "Raised for the void. The ones who actually fly the empire.", face: "sans" },
  { name: "Copper", hex: "#a8703f", ink: "#1a0f05", role: "Administration and bureaucracy", voice: "Forms, ledgers, permissions. The pyramid, written down.", face: "mono" },
  { name: "White", hex: "#e7e3da", ink: "#141414", role: "Clergy and judiciary", voice: "The law, and the faith that says the law is right.", face: "serif" },
  { name: "Silver", hex: "#b9bcc2", ink: "#121315", role: "Finance and commerce", voice: "Money, trade, and the quiet power of owning debt.", face: "serif" },
  { name: "Gold", hex: "#d2ac47", ink: "#0e0b05", role: "Rulers", voice: "The people who designed the pyramid.", face: "serif" },
];
