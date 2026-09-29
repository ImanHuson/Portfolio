// The twenty featured people as one list: the Ten Faces and the ones who
// deserve a place, with names that respect the cover rule. Shared by the
// network, the theme matrix, search and the Iron Rain prompt.
import { EXTENDED } from "@/lib/data/extended";
import { PEOPLE, shownAs, type Register } from "@/lib/data/people";

export type Featured = {
  slug: string;
  group: "ten" | "extended";
  firstBook: number;
  color: string;
  register: Register;
  /** Name and epithet as far as this clearance may know them. */
  as: (clearance: number) => { name: string; epithet: string };
  /** A short label for tight spaces ("The Jackal" stays whole). */
  short: (clearance: number) => string;
};

const shortOf = (name: string) => (name.startsWith("The ") ? name : name.split(" ")[0]);

export const FEATURED: Featured[] = [
  ...PEOPLE.map<Featured>((p) => ({
    slug: p.slug,
    group: "ten",
    firstBook: p.firstBook,
    color: p.color,
    register: p.register,
    as: (c) => shownAs(p, c),
    short: (c) => shortOf(shownAs(p, c).name),
  })),
  ...EXTENDED.map<Featured>((p) => ({
    slug: p.slug,
    group: "extended",
    firstBook: p.firstBook,
    color: p.color,
    register: p.register,
    as: () => ({ name: p.name, epithet: p.epithet }),
    short: () => shortOf(p.name),
  })),
];

export const getFeatured = (slug: string) => FEATURED.find((f) => f.slug === slug);
