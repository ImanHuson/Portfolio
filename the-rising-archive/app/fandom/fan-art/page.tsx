import type { Metadata } from "next";
import PageHeader from "@/components/typography/PageHeader";
import Plate from "@/components/archive/Plate";
import Spotlight from "@/components/archive/Spotlight";
import FramedPortrait from "@/components/archive/FramedPortrait";
import { getExtended } from "@/lib/data/extended";
import { getPerson, safeAs } from "@/lib/data/people";
import { PORTRAITS, portraitCredit } from "@/lib/data/portraits";
import { CREDITS } from "@/lib/data/credits";

const portraitName = (slug: string) => {
  const p = getPerson(slug);
  if (p) return safeAs(p).name;
  return getExtended(slug)?.name ?? (slug === "eo" ? "Eo of Lykos" : slug);
};

export const metadata: Metadata = {
  title: "The archive’s plates",
  description: "The character portraits, fan art credited to its artists, and the archive’s own images: three.js renders and code-drawn plates made for this site.",
  alternates: { canonical: "./" },
};

const GROUPS: { title: string; note: string; items: { src: string; alt: string; w?: number; h?: number }[] }[] = [
  {
    title: "Six books",
    note: "Code-drawn plates, one symbol per book. Not the published covers.",
    items: ["red-rising", "golden-son", "morning-star", "iron-gold", "dark-age", "light-bringer"].map((s) => ({ src: `/images/books/${s}.webp`, alt: `Book plate for ${s.replace(/-/g, " ")}.`, w: 900, h: 1350 })),
  },
  {
    title: "Twenty relics",
    note: "One object for each of the twenty, rendered as museum pieces. They stood in for the portraits before the portraits came.",
    items: ["darrow", "virginia", "cassius", "sevro", "pax", "diomedes", "atlas", "lysander", "victra", "the-jackal", "apollonius", "lyria", "ephraim", "volga", "ragnar", "kavax", "fitchner", "lorn", "orion", "romulus"].map((s) => ({ src: `/images/people/${s}.webp`, alt: `The relic for ${s.replace(/-/g, " ")}.` })),
  },
  {
    title: "The Rising",
    note: "A movement, a war, a myth, a government.",
    items: ["movement", "war", "myth", "government"].map((s) => ({ src: `/images/renders/rising/${s}.webp`, alt: `The Rising: ${s}.`, w: 1600, h: 900 })),
  },
  {
    title: "Worlds, seals and machines",
    note: "Planets, house seals, and the Artifact Vault.",
    items: [
      ...["mars", "luna", "earth", "mercury", "venus", "io"].map((s) => ({ src: `/images/renders/places/${s}.webp`, alt: `${s}, rendered.` })),
      ...["augustus", "bellona", "lune", "telemanus", "raa"].map((s) => ({ src: `/images/renders/houses/${s}.webp`, alt: `The ${s} seal.` })),
      ...["razor", "starshell", "dreadnought", "starship", "minds-eye", "carving", "psychospike", "holotech"].map((s) => ({ src: `/images/renders/vault/${s}.webp`, alt: `${s.replace(/-/g, " ")}, from the Vault.` })),
    ],
  },
];

export default function FanArtPage() {
  return (
    <>
      <PageHeader
        trail={[{ href: "/", label: "Archive" }, { href: "/fandom/", label: "The Fandom" }, { href: "/fandom/fan-art/", label: "Fan art" }]}
        title="The archive’s plates"
        lede="The character portraits are the fandom’s work, credited to the artists below. The renders further down are the archive’s own: three.js scenes and posters drawn in code. Where a real, public-domain image came closer, the site uses it instead; those are listed at the end."
      >
        <p className="mt-6 max-w-[56ch] text-sm text-ash-2">
          For the fandom’s real artists, go where they post:{" "}
          <a href="https://www.reddit.com/r/RedRising/" target="_blank" rel="noopener noreferrer" className="text-ash underline decoration-line-strong underline-offset-4 hover:text-bone">
            r/RedRising
          </a>
          .
        </p>
      </PageHeader>
      <section aria-labelledby="portraits-title" className="border-t border-line px-5 py-16 md:px-8">
        <div className="mx-auto max-w-[1400px]">
          <h2 id="portraits-title" className="font-display text-h3 font-bold uppercase">The portraits</h2>
          <p className="mt-2 max-w-[70ch] text-ash">
            Fan art, shown in the archive’s frames and credited as each artist signed it. Where a signature isn’t legible or there isn’t one, the credit says so rather than guessing. If one of these is yours and you want it credited differently or taken down,{" "}
            <a href="https://github.com/ImanHuson/Portfolio/issues" target="_blank" rel="noopener noreferrer" className="text-ash underline decoration-line-strong underline-offset-4 hover:text-bone">
              open an issue
            </a>{" "}
            and it will be.
          </p>
          <ul role="list" className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
            {Object.keys(PORTRAITS).map((slug) => (
              <li key={slug}>
                <FramedPortrait slug={slug} name={portraitName(slug)} size="card" sizes="(min-width: 1024px) 18vw, 45vw" />
                <p className="mt-3 font-display text-lg leading-tight font-bold uppercase">{portraitName(slug)}</p>
                <p className="mt-1 font-mono text-meta tracking-[0.12em] text-ash uppercase">{portraitCredit(slug)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      {GROUPS.map((g) => (
        <section key={g.title} aria-labelledby={g.title} className="border-t border-line px-5 py-16 md:px-8">
          <div className="mx-auto max-w-[1400px]">
            <h2 id={g.title} className="font-display text-h3 font-bold uppercase">{g.title}</h2>
            <p className="mt-2 text-ash">{g.note}</p>
            <ul role="list" className={g.title === "Six books" ? "mt-8 grid grid-cols-2 gap-3 md:grid-cols-6" : g.title === "The Rising" ? "mt-8 grid gap-3 md:grid-cols-2" : "mt-8 grid grid-cols-2 gap-3 md:grid-cols-5"}>
              {g.items.map((it) => (
                <Spotlight as="li" tone="gold" key={it.src}>
                  <Plate src={it.src} alt={it.alt} width={it.w ?? 900} height={it.h ?? 900} sizes="(min-width: 768px) 20vw, 50vw" />
                </Spotlight>
              ))}
            </ul>
          </div>
        </section>
      ))}
      <section aria-labelledby="sources-title" className="border-t border-line px-5 py-16 md:px-8">
        <div className="mx-auto max-w-[1400px]">
          <h2 id="sources-title" className="font-display text-h3 font-bold uppercase">Real images used on the site</h2>
          <p className="mt-2 max-w-[70ch] text-ash">
            Where a real object, painting or photograph came close to what the books describe, it replaced the archive’s render. All are public domain: The Met’s Open Access collection and NASA.
          </p>
          <ul role="list" className="mt-8 grid gap-x-10 gap-y-3 md:grid-cols-2">
            {Object.entries(CREDITS).map(([src, c]) => (
              <li key={src} className="border-b border-line pb-3 text-sm">
                <a href={c.url} target="_blank" rel="noopener noreferrer" className="inline-block py-1 text-bone underline decoration-line-strong underline-offset-4 hover:text-red">
                  {c.title}
                </a>
                <span className="text-ash">. {c.by}. {c.source}.</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
