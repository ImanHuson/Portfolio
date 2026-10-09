// Ways into the archive other than reading the ten files in order: by theme.
// Most lead into a chapter; Timeline and Military are pages of their own.

export type Way = { name: string; href: string; line: string };

export const WAYS: Way[] = [
  { name: "Timeline", href: "/timeline/", line: "The whole story on one line" },
  { name: "People", href: "/soldiers/", line: "Sixteen personnel files" },
  { name: "Military", href: "/military/", line: "The branches, and who led them" },
  { name: "Titans", href: "/titans/", line: "The Nine, to scale" },
  { name: "World", href: "/the-world/", line: "Paradis, Marley and the mirror" },
  { name: "Battles", href: "/the-war/", line: "The battle map, the gear, the fallen" },
];
