// The Solar System map. Orbit radii are for the diagram, not to scale.
export type Place = {
  slug: string;
  name: string;
  orbit: number; // diagram orbit radius, 0-1
  angle: number; // degrees on the diagram
  plate: string;
  lines: { text: string; book: number }[];
};

export const PLACES: Place[] = [
  {
    slug: "mercury",
    name: "Mercury",
    orbit: 0.17,
    angle: 200,
    plate: "/images/places/mercury.webp",
    lines: [
      { text: "Heat. War.", book: 0 },
      { text: "The battlefield that becomes synonymous with Dark Age. Mercury saw some of the Society’s worst abuses, and still Lysander finds people willing to rise against the Republic in Heliopolis.", book: 5 },
    ],
  },
  {
    slug: "venus",
    name: "Venus",
    orbit: 0.27,
    angle: 320,
    plate: "/images/places/venus.webp",
    lines: [
      { text: "Wealth. Luxury. Shipyards.", book: 0 },
      { text: "The Minotaur. Apollonius au Valii-Rath takes the Venus Dockyards in an eight-day battle in October 754.", book: 6 },
    ],
  },
  {
    slug: "earth",
    name: "Earth",
    orbit: 0.38,
    angle: 40,
    plate: "/images/places/earth.webp",
    lines: [
      { text: "The old homeworld. The symbolic centre of humanity, long after it stopped being the political one.", book: 0 },
    ],
  },
  {
    slug: "luna",
    name: "Luna",
    orbit: 0.38,
    angle: 40,
    plate: "/images/places/luna.webp",
    lines: [
      { text: "The political centre of Gold power. Palaces, Senate halls and old blood.", book: 0 },
      { text: "Where the Society’s Sovereign falls.", book: 3 },
    ],
  },
  {
    slug: "mars",
    name: "Mars",
    orbit: 0.5,
    angle: 150,
    plate: "/images/places/mars.webp",
    lines: [
      { text: "Darrow’s birthplace, and the heart of House Augustus.", book: 0 },
      { text: "The world where the lie began for him: a Red colony told it was terraforming a planet for humanity, while the surface was already alive.", book: 1 },
    ],
  },
  {
    slug: "io",
    name: "Io and the Rim",
    orbit: 0.82,
    angle: 260,
    plate: "/images/places/io.webp",
    lines: [
      { text: "Io, Jupiter’s innermost moon. The seat of House Raa.", book: 0 },
      { text: "Not simply outer-system territory. A different political culture, a different memory of the Society, and a different relationship with war.", book: 3 },
    ],
  },
];
