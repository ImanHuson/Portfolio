import type { Metadata } from "next";
import PageHeader from "@/components/typography/PageHeader";
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
  title: "Fan art and sources",
  description: "The character portraits, fan art credited to its artists, and the source of every other image on the site.",
  alternates: { canonical: "./" },
};

export default function FanArtPage() {
  return (
    <>
      <PageHeader
        trail={[{ href: "/", label: "Archive" }, { href: "/fandom/", label: "The Fandom" }, { href: "/fandom/fan-art/", label: "Fan art" }]}
        title="Fan art and sources"
        lede="The character portraits are the fandom’s work, credited to the artists below. Every other image on the site is a real object, painting, photograph or published cover, and each is listed at the end with where it came from."
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
      <section aria-labelledby="sources-title" className="border-t border-line px-5 py-16 md:px-8">
        <div className="mx-auto max-w-[1400px]">
          <h2 id="sources-title" className="font-display text-h3 font-bold uppercase">Real images used on the site</h2>
          <p className="mt-2 max-w-[70ch] text-ash">
            Where a real object, painting or photograph came close to what the books describe, it stands in for the thing itself. Most are public domain, from The Met’s Open Access collection and NASA. The two warship plates are art from the video game Dreadnought, credited to it. The book covers are credited on the Story pages.
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
