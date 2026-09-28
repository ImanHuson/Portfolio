// The Nine Titans. Heights are the story's own figures; abilities, holders
// and events were checked against sources before being written (see
// CLAUDE.md). Where the record is partial (early Founding and War Hammer
// holders), the list says "known holders" and names only verified ones.

export type Titan = {
  slug: string;
  form: number; // form index in scripts/titans/render.html (x-ray plates, scale silhouettes)
  name: string;
  height: number; // metres
  localHeight: number; // the render model's height in units, to size its silhouette in the scale strip
  trait: string; // one line, shown on hover
  abilities: string[];
  holders: { name: string; slug?: string }[];
  events: { year: string; text: string }[];
  /** the specimen plate (scripts/titans/plates.py); sealed when the image itself spoils */
  plate: { source: "anime" | "fan-art"; credit: string; sealed?: boolean };
};

const ANIME = "Attack on Titan (anime). © Hajime Isayama, Kodansha / Attack on Titan Production Committee";
const anime = { source: "anime" as const, credit: ANIME };

export const ORIGIN =
  "When Ymir Fritz died, thirteen years after she gained the power of the Titans, that power was split into nine. Each of the Nine Titans is one part of it.";

export const INHERITANCE =
  "A Titan passes on when its holder is eaten by a Pure Titan, which then becomes human again with the power. If a holder dies any other way, the power passes to an Eldian child born at random. Every holder lives thirteen years from the day they inherit: the Curse of Ymir.";

export const STATUS = "Ended in 854. When Eren Yeager died, the power of the Titans left the world.";

export const TITANS: Titan[] = [
  {
    slug: "founding",
    form: 0,
    name: "Founding Titan",
    height: 13,
    localHeight: 5.9,
    trait: "Command over every Titan, and over the minds of every Eldian.",
    abilities: [
      "Commands Pure Titans and the other Titan shifters.",
      "Through the Paths, can alter the memories and bodies of Eldians.",
      "Its full power answers only to a holder of royal blood, or one in contact with a Titan of royal blood.",
    ],
    holders: [{ name: "The Fritz and Reiss royal line" }, { name: "Frieda Reiss" }, { name: "Grisha Yeager", slug: "grisha" }, { name: "Eren Yeager", slug: "eren" }],
    events: [
      { year: "845", text: "Grisha Yeager takes it from the Reiss family and passes it, with the Attack Titan, to Eren." },
      { year: "854", text: "Eren uses it to begin the Rumbling." },
    ],
    // the only plate that shows the ending, so it opens only on request
    plate: { source: "fan-art", credit: "Fan art by Metaleks.", sealed: true },
  },
  {
    slug: "attack",
    form: 1,
    name: "Attack Titan",
    height: 15,
    localHeight: 6.1,
    trait: "It has always fought for freedom.",
    abilities: [
      "Its holders have always fought for freedom.",
      "Can see the memories of its future holders.",
    ],
    holders: [{ name: "Eren Kruger" }, { name: "Grisha Yeager", slug: "grisha" }, { name: "Eren Yeager", slug: "eren" }],
    events: [
      { year: "845", text: "Grisha Yeager passes it to his son." },
      { year: "850", text: "Eren transforms for the first time, in the Battle of Trost." },
      { year: "854", text: "Eren attacks Liberio." },
    ],
    plate: anime,
  },
  {
    slug: "colossal",
    form: 2,
    name: "Colossal Titan",
    height: 60,
    localHeight: 6.2,
    trait: "Sixty metres tall, and a blast of heat when it forms.",
    abilities: ["Immense size: taller than the Walls.", "An explosive transformation and scalding steam."],
    holders: [{ name: "Bertholdt Hoover" }, { name: "Armin Arlert", slug: "armin" }],
    events: [
      { year: "845", text: "Kicks in the outer gate of Shiganshina." },
      { year: "850", text: "Appears again at Trost. Later that year, at Shiganshina, Armin inherits it." },
      { year: "854", text: "Armin transforms in Liberio's harbour and destroys Marley's fleet." },
    ],
    plate: anime,
  },
  {
    slug: "armored",
    form: 3,
    name: "Armored Titan",
    height: 15,
    localHeight: 6.1,
    trait: "Hardened plates over the whole body.",
    abilities: ["Hardened armour plates that blades cannot cut."],
    holders: [{ name: "Reiner Braun", slug: "reiner" }],
    events: [
      { year: "845", text: "Breaks through the inner gate of Wall Maria." },
      { year: "850", text: "Fights Eren at the Battle of Shiganshina." },
      { year: "854", text: "Fights Eren again, in Liberio." },
    ],
    plate: anime,
  },
  {
    slug: "female",
    form: 4,
    name: "Female Titan",
    height: 14,
    localHeight: 6.05,
    trait: "A scream that calls the Pure Titans.",
    abilities: [
      "Can harden parts of its body at will.",
      "Its scream draws Pure Titans to it.",
      "Can take on the traits of other Titans.",
    ],
    holders: [{ name: "Annie Leonhart", slug: "annie" }],
    events: [
      { year: "850", text: "Attacks the Survey Corps' expedition beyond the Walls." },
      { year: "850", text: "Exposed and cornered in Stohess; its holder seals herself in crystal." },
      { year: "854", text: "Annie comes out of the crystal." },
    ],
    plate: anime,
  },
  {
    slug: "beast",
    form: 5,
    name: "Beast Titan",
    height: 17,
    localHeight: 5.4,
    trait: "Its shape follows its holder.",
    abilities: [
      "Takes an animal form that differs from holder to holder.",
      "Under Zeke, throws with devastating accuracy.",
      "Zeke, who has royal blood, could turn Eldians who had taken his spinal fluid into Titans with a scream.",
    ],
    holders: [{ name: "Tom Ksaver" }, { name: "Zeke Yeager", slug: "zeke" }],
    events: [
      { year: "850", text: "Appears inside Wall Rose; the people of Ragako become Titans." },
      { year: "850", text: "Bombards the Survey Corps at Shiganshina." },
      { year: "854", text: "Zeke helps stop Eren, and Levi kills him." },
    ],
    plate: anime,
  },
  {
    slug: "jaw",
    form: 6,
    name: "Jaw Titan",
    height: 5,
    localHeight: 4.6,
    trait: "Jaws and claws that bite through hardening.",
    abilities: ["The strongest jaws of the Nine, able to bite through hardened Titan flesh.", "Small, fast and agile."],
    holders: [{ name: "Marcel Galliard" }, { name: "Ymir", slug: "ymir" }, { name: "Porco Galliard" }, { name: "Falco Grice" }],
    events: [
      { year: "845", text: "Ymir, a Pure Titan, eats Marcel Galliard and becomes human again." },
      { year: "850", text: "Ymir fights for the 104th at Utgard Castle." },
      { year: "854", text: "Falco Grice inherits it." },
    ],
    plate: anime,
  },
  {
    slug: "cart",
    form: 7,
    name: "Cart Titan",
    height: 4,
    localHeight: 3.4,
    trait: "It can stay transformed for months.",
    abilities: ["Extraordinary endurance: its holder has stayed transformed for about two months.", "Four-legged, and can carry equipment and armament."],
    holders: [{ name: "Pieck Finger" }],
    events: [
      { year: "850", text: "At the Battle of Shiganshina." },
      { year: "854", text: "Fights in Liberio with a mounted gun." },
    ],
    plate: anime,
  },
  {
    slug: "war-hammer",
    form: 8,
    name: "War Hammer Titan",
    height: 15,
    localHeight: 6.3,
    trait: "Weapons forged from its own hardened flesh.",
    abilities: [
      "Forms weapons and structures from hardened Titan flesh: a hammer, pikes, spikes.",
      "Its holder can stay sealed in a crystal and control the Titan through a cord of flesh.",
    ],
    holders: [{ name: "The Tybur family" }, { name: "Lara Tybur" }, { name: "Eren Yeager", slug: "eren" }],
    events: [{ year: "854", text: "Lara Tybur fights Eren in Liberio; he takes its power." }],
    plate: anime,
  },
];

export const getTitan = (slug: string) => TITANS.find((t) => t.slug === slug);