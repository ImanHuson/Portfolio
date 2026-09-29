import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/typography/PageHeader";
import Reveal from "@/components/archive/Reveal";
import SpoilerGate from "@/components/archive/SpoilerGate";
import Stamp from "@/components/archive/Stamp";
import { ARGUMENTS, CHORUS, OPEN_QUESTIONS } from "@/lib/data/fandom";
import { BEST_LINES } from "@/lib/data/quotes";
import Spotlight from "@/components/archive/Spotlight";

export const metadata: Metadata = {
  title: "The Fandom",
  description: "The great arguments of the Red Rising fandom, the questions readers carry into Red God, and the names they keep coming back to.",
  alternates: { canonical: "./" },
};

export default function FandomPage() {
  return (
    <>
      <PageHeader
        trail={[{ href: "/", label: "Archive" }, { href: "/fandom/", label: "The Fandom" }]}
        title="What the fandom keeps arguing about"
        lede="Not generic “fan opinions.” The questions readers actually return to, with the two readings that keep colliding."
      >
        <div className="mt-10 flex flex-wrap gap-8 font-mono text-meta tracking-[0.2em] uppercase">
          <Link href="/fandom/quotes/" className="border-b border-red pb-1 hover:text-red">Words that survived</Link>
          <Link href="/fandom/fan-art/" className="border-b border-line-strong pb-1 text-ash hover:text-bone">Fan art and sources</Link>
        </div>
      </PageHeader>

      <section aria-labelledby="words" className="px-5 pb-24 md:px-8">
        <div className="mx-auto grid max-w-[1400px] gap-12 border-t border-line pt-10 lg:grid-cols-[5fr_7fr]">
          <div>
            <h2 id="words" className="font-display text-h2 leading-none font-bold uppercase">Words that survived</h2>
            <p className="mt-5 max-w-[44ch] text-ash">
              The saga’s best lines, and one line for each of the archive’s twenty characters. Each is sealed at the book it comes from, so a first-time reader can open only what they have read.
            </p>
            <Link
              href="/fandom/quotes/"
              className="mt-8 inline-flex min-h-11 items-center gap-3 border border-red px-5 py-3 font-mono text-meta tracking-[0.2em] text-bone uppercase transition-colors hover:bg-red/15"
            >
              Read all the quotes <span aria-hidden>→</span>
            </Link>
          </div>
          <div>
            <figure>
              <blockquote className="max-w-[26ch] font-serif text-h2 leading-tight text-bone italic">“{BEST_LINES[0].text}”</blockquote>
              <figcaption className="mt-4 font-mono text-meta tracking-[0.18em] text-ash uppercase">
                {BEST_LINES[0].who}, <span className="text-ash-2">{BEST_LINES[0].where}</span>
              </figcaption>
            </figure>
            <p className="mt-10 font-mono text-meta tracking-[0.18em] text-ash-2 uppercase">Also in the lines that stayed</p>
            <p className="mt-3 max-w-[60ch] text-lede text-bone/85">{BEST_LINES.slice(1).map((q) => q.speaker).join(" · ")}</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="args" className="px-5 pb-24 md:px-8">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex flex-wrap items-center gap-4 border-t border-line pt-10">
            <h2 id="args" className="font-display text-h2 leading-none font-bold uppercase">The great arguments</h2>
            <Stamp kind="argued" />
          </div>
          <ol role="list" className="mt-10 grid hairline md:grid-cols-2">
            {ARGUMENTS.map((a, i) => (
              <Reveal as="li" cell key={a.q} delay={(i % 2) * 0.05} className="bg-void">
                <Spotlight tone="red" className="h-full p-7 md:p-10">
                <SpoilerGate book={a.book} compact>
                  <p className="font-serif text-h3 leading-snug text-bone">{a.q}</p>
                  <dl className="mt-6 grid gap-5 sm:grid-cols-2">
                    <div>
                      <dt className="font-mono text-meta tracking-[0.2em] text-red uppercase">One reading</dt>
                      <dd className="mt-2 text-ash">{a.yes}</dd>
                    </div>
                    <div>
                      <dt className="font-mono text-meta tracking-[0.2em] text-ash-2 uppercase">The other</dt>
                      <dd className="mt-2 text-ash">{a.no}</dd>
                    </div>
                  </dl>
                </SpoilerGate>
                </Spotlight>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="open" className="border-t border-line px-5 py-24 md:px-8">
        <div className="mx-auto grid max-w-[1400px] gap-10 md:grid-cols-[5fr_7fr]">
          <div>
            <h2 id="open" className="font-display text-h2 leading-none font-bold uppercase">Theories</h2>
            <p className="mt-5 max-w-[40ch] text-ash">
              Not predictions. The archive doesn’t guess at an ending the author hasn’t written. These are the questions the published books leave open.
            </p>
            <Stamp kind="unconfirmed" className="mt-6" />
          </div>
          <SpoilerGate book={6}>
            <ul role="list" className="space-y-6">
              {OPEN_QUESTIONS.map((q) => (
                <li key={q} className="border-l-2 border-red pl-6 font-serif text-h3 leading-snug text-bone italic">{q}</li>
              ))}
            </ul>
          </SpoilerGate>
        </div>
      </section>

      <section aria-labelledby="chorus" className="border-t border-line px-5 py-24 md:px-8">
        <div className="mx-auto max-w-[1400px]">
          <h2 id="chorus" className="font-display text-h2 leading-none font-bold uppercase">The Howler’s Chorus</h2>
          <p className="mt-5 max-w-[60ch] text-ash">
            The names readers keep returning to in discussion threads. Not a ranking: no formal poll was found, so this is a chorus, and the loudest voices are argued about as much as they are loved.
          </p>
          <ul role="list" className="mt-12 grid hairline sm:grid-cols-2 lg:grid-cols-4">
            {CHORUS.map((c) => (
              <Spotlight as="li" tone="red" key={c.name} className="bg-void p-7">
                <SpoilerGate book={c.book} compact>
                  <p className="font-display text-4xl leading-none font-extrabold uppercase">{c.name}</p>
                  <p className="mt-3 text-sm text-ash">{c.note}</p>
                </SpoilerGate>
              </Spotlight>
            ))}
            {/* Fill the grid's last row, so no bare seam shows through. */}
            {CHORUS.length % 2 === 1 && <li aria-hidden className="hidden bg-void sm:block lg:hidden" />}
            {Array.from({ length: (4 - (CHORUS.length % 4)) % 4 }, (_, i) => (
              <li key={i} aria-hidden className="hidden bg-void lg:block" />
            ))}
          </ul>
          <p className="mt-8 text-sm text-ash-2">
            Join the argument where it actually happens:{" "}
            <a href="https://www.reddit.com/r/RedRising/" target="_blank" rel="noopener noreferrer" className="text-ash underline decoration-line-strong underline-offset-4 hover:text-bone">
              r/RedRising
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
