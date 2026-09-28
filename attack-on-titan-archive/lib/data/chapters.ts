// The archive's table of contents: the story as one continuous shot, in the
// brief's three acts. `open` flips to true as each chapter is built.

export type Chapter = { id: string; title: string; line: string; open: boolean; href?: string };
export type Act = { name: string; register: string; chapters: Chapter[] };

export const ACTS: Act[] = [
  {
    name: "Humanity",
    register: "Green. Stone. Military. We are trapped inside the Walls.",
    chapters: [
      { id: "AOT-01", title: "The Wall", line: "Shiganshina, 845. The morning it ended.", open: true, href: "/" },
      { id: "AOT-02", title: "The Fall", line: "Wall Maria, the evacuation, and what it cost.", open: true, href: "/the-fall/" },
      { id: "AOT-03", title: "The Soldiers", line: "Personnel files of the 104th and the Survey Corps.", open: true, href: "/soldiers/" },
      { id: "AOT-04", title: "The Titans", line: "Nine inheritances, and the research that tried to name them.", open: true, href: "/titans/" },
    ],
  },
  {
    name: "Truth",
    register: "Black. White. Concrete. Photography. The world is larger than we thought.",
    chapters: [
      { id: "AOT-05", title: "The Basement", line: "A key that did not fit, three books, one photograph.", open: true, href: "/the-basement/" },
      { id: "AOT-06", title: "The World", line: "Marley, the Eldian question, and the other side of the sea.", open: true, href: "/the-world/" },
      { id: "AOT-07", title: "The War", line: "Liberio, the battle maps, and the gear that made it possible.", open: true, href: "/the-war/" },
    ],
  },
  {
    name: "Freedom",
    register: "Void. Sand. Paths. Fire. The Walls were never the real prison.",
    chapters: [
      { id: "AOT-08", title: "The Rumbling", line: "The largest thing that ever walked.", open: true, href: "/the-rumbling/" },
      { id: "AOT-09", title: "Paths", line: "Where every Eldian is connected.", open: true, href: "/paths/" },
      { id: "AOT-10", title: "The End", line: "A single tree.", open: true, href: "/the-end/" },
    ],
  },
];
