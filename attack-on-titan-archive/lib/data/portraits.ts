// Personnel-file portraits (public/images/personnel/, made by
// scripts/portraits/treat.py). Every image is credited where it is shown.
// Screenshots are used for identification and commentary; the one piece of
// fan art is used at the site owner's decision and credited as such.

export type PortraitSource = "anime" | "fan-art";

export type Portrait = {
  id: string;
  name: string;
  source: PortraitSource;
  credit: string;
};

const ANIME = "Attack on Titan (anime). © Hajime Isayama, Kodansha / Attack on Titan Production Committee";

export const PORTRAITS: Portrait[] = [
  { id: "eren", name: "Eren Yeager", source: "anime", credit: ANIME },
  { id: "mikasa", name: "Mikasa Ackerman", source: "anime", credit: ANIME },
  { id: "armin", name: "Armin Arlert", source: "anime", credit: ANIME },
  // Fan art: the artist could not be identified. Replace this credit with
  // theirs if found (a reverse image search is the quickest route).
  { id: "levi", name: "Levi Ackerman", source: "fan-art", credit: "Fan art. Artist not identified." },
  { id: "erwin", name: "Erwin Smith", source: "anime", credit: ANIME },
  { id: "reiner", name: "Reiner Braun", source: "anime", credit: ANIME },
  { id: "connie", name: "Connie Springer", source: "anime", credit: ANIME },
  { id: "sasha", name: "Sasha Braus", source: "anime", credit: ANIME },
  { id: "jean", name: "Jean Kirstein", source: "anime", credit: ANIME },
  { id: "hange", name: "Hange Zoë", source: "anime", credit: ANIME },
  { id: "annie", name: "Annie Leonhart", source: "anime", credit: ANIME },
  { id: "grisha", name: "Grisha Yeager", source: "anime", credit: ANIME },
  { id: "gabi", name: "Gabi Braun", source: "anime", credit: ANIME },
  { id: "zeke", name: "Zeke Yeager", source: "anime", credit: ANIME },
  { id: "ymir", name: "Ymir", source: "anime", credit: ANIME },
  { id: "historia", name: "Historia Reiss", source: "anime", credit: ANIME },
];
