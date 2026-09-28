// The archive's table of contents: the story as one continuous shot, in the
// brief's three acts. `open` flips to true as each chapter is built.

export type Chapter = {
  id: string;
  title: string;
  line: string;
  open: boolean;
  href?: string;
  /** the chapter's own opening frame; the ending files have none on the index (they would spoil it) */
  image?: string;
};
export type Act = { name: string; register: string; chapters: Chapter[] };

export const ACTS: Act[] = [
  {
    name: "Humanity",
    register: "Stone, the military, and the Walls we were trapped inside.",
    chapters: [
      { id: "AOT-01", title: "The Wall", line: "Shiganshina, 845. The morning it ended.", open: true, href: "/", image: "/images/opening-845.webp" },
      { id: "AOT-02", title: "The Fall", line: "Wall Maria, the evacuation, and what it cost.", open: true, href: "/the-fall/", image: "/images/fall-845.webp" },
      { id: "AOT-03", title: "The Soldiers", line: "Personnel files of the 104th and the Survey Corps.", open: true, href: "/soldiers/", image: "/images/heads/soldiers.webp" },
      { id: "AOT-04", title: "The Titans", line: "Nine inheritances, and the research that tried to name them.", open: true, href: "/titans/", image: "/images/heads/titans.webp" },
    ],
  },
  {
    name: "Truth",
    register: "A photograph, a file from across the sea, and a world larger than we were told.",
    chapters: [
      { id: "AOT-05", title: "The Basement", line: "A key that did not fit, three books, one photograph.", open: true, href: "/the-basement/", image: "/images/basement/descent-3.webp" },
      { id: "AOT-06", title: "The World", line: "Marley, the Eldian question, and the other side of the sea.", open: true, href: "/the-world/", image: "/images/heads/world.webp" },
      { id: "AOT-07", title: "The War", line: "Liberio, the battle maps, and the gear that made it possible.", open: true, href: "/the-war/", image: "/images/heads/war.webp" },
    ],
  },
  {
    name: "Freedom",
    register: "The ending. Each of these files asks before it opens.",
    chapters: [
      { id: "AOT-08", title: "The Rumbling", line: "The largest thing that ever walked.", open: true, href: "/the-rumbling/" },
      { id: "AOT-09", title: "Paths", line: "Where every Eldian is connected.", open: true, href: "/paths/" },
      { id: "AOT-10", title: "The End", line: "A single tree.", open: true, href: "/the-end/" },
    ],
  },
];

/** All ten, in reading order. */
export const CHAPTERS: (Chapter & { act: string })[] = ACTS.flatMap((a) => a.chapters.map((c) => ({ ...c, act: a.name })));

/** The chapter a route belongs to (a dossier belongs to its chapter). */
export function chapterFor(pathname: string) {
  const path = pathname.endsWith("/") ? pathname : `${pathname}/`;
  if (path === "/") return CHAPTERS[0];
  return CHAPTERS.find((c) => c.href && c.href !== "/" && path.startsWith(c.href));
}
