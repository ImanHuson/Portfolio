import type { Metadata } from "next";
import PageHeader from "@/components/typography/PageHeader";
import Plate from "@/components/archive/Plate";

export const metadata: Metadata = {
  title: "The archive’s plates",
  description: "The fan-made images of this archive: three.js renders and code-drawn plates, made for this site.",
  alternates: { canonical: "./" },
};

const GROUPS: { title: string; note: string; items: { src: string; alt: string; w?: number; h?: number }[] }[] = [
  {
    title: "Six books",
    note: "Code-drawn plates, one symbol per book. Not the published covers.",
    items: ["red-rising", "golden-son", "morning-star", "iron-gold", "dark-age", "light-bringer"].map((s) => ({ src: `/images/books/${s}.webp`, alt: `Book plate for ${s.replace(/-/g, " ")}.`, w: 900, h: 1350 })),
  },
  {
    title: "Ten relics",
    note: "One object for each of the Ten Faces, rendered as museum pieces.",
    items: ["darrow", "virginia", "cassius", "sevro", "pax", "diomedes", "atlas", "lysander", "apollonius", "the-jackal"].map((s) => ({ src: `/images/people/${s}.webp`, alt: `The relic for ${s.replace(/-/g, " ")}.` })),
  },
  {
    title: "The Rising",
    note: "A movement, a war, a myth, a government.",
    items: ["movement", "war", "myth", "government"].map((s) => ({ src: `/images/rising/${s}.webp`, alt: `The Rising: ${s}.`, w: 1600, h: 900 })),
  },
  {
    title: "Worlds, seals and machines",
    note: "Planets, house seals, and the Artifact Vault.",
    items: [
      ...["mars", "luna", "earth", "mercury", "venus", "io"].map((s) => ({ src: `/images/places/${s}.webp`, alt: `${s}, rendered.` })),
      ...["augustus", "bellona", "lune", "telemanus", "raa"].map((s) => ({ src: `/images/houses/${s}.webp`, alt: `The ${s} seal.` })),
      ...["razor", "starshell", "dreadnought", "starship", "minds-eye", "carving", "psychospike", "holotech"].map((s) => ({ src: `/images/vault/${s}.webp`, alt: `${s.replace(/-/g, " ")}, from the Vault.` })),
    ],
  },
];

export default function FanArtPage() {
  return (
    <>
      <PageHeader
        trail={[{ href: "/", label: "Archive" }, { href: "/fandom/", label: "The Fandom" }, { href: "/fandom/fan-art/", label: "Fan art" }]}
        title="The archive’s plates"
        lede="This archive’s own fan art. Every image was generated for this site: three.js scenes rendered headlessly, and posters drawn in code. None of it is published artwork, and none of it tries to be."
      >
        <p className="mt-6 max-w-[56ch] text-sm text-ash-2">
          For the fandom’s real artists, go where they post:{" "}
          <a href="https://www.reddit.com/r/RedRising/" target="_blank" rel="noopener noreferrer" className="text-ash underline decoration-line-strong underline-offset-4 hover:text-bone">
            r/RedRising
          </a>
          .
        </p>
      </PageHeader>
      {GROUPS.map((g) => (
        <section key={g.title} aria-labelledby={g.title} className="border-t border-line px-5 py-16 md:px-8">
          <div className="mx-auto max-w-[1400px]">
            <h2 id={g.title} className="font-display text-h3 font-bold uppercase">{g.title}</h2>
            <p className="mt-2 text-ash">{g.note}</p>
            <ul role="list" className={g.title === "Six books" ? "mt-8 grid grid-cols-2 gap-3 md:grid-cols-6" : g.title === "The Rising" ? "mt-8 grid gap-3 md:grid-cols-2" : "mt-8 grid grid-cols-2 gap-3 md:grid-cols-5"}>
              {g.items.map((it) => (
                <li key={it.src}>
                  <Plate src={it.src} alt={it.alt} width={it.w ?? 900} height={it.h ?? 900} sizes="(min-width: 768px) 20vw, 50vw" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}
    </>
  );
}
