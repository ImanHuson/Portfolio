import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/typography/PageHeader";
import Reveal from "@/components/archive/Reveal";
import SpoilerGate from "@/components/archive/SpoilerGate";
import Stamp from "@/components/archive/Stamp";
import { ARGUMENTS, CHORUS, OPEN_QUESTIONS } from "@/lib/data/fandom";
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
          <Link href="/fandom/fan-art/" className="border-b border-line-strong pb-1 text-ash hover:text-bone">The archive’s plates</Link>
        </div>
      </PageHeader>

      <section aria-labelledby="args" className="px-5 pb-24 md:px-8">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex flex-wrap items-center gap-4 border-t border-line pt-10">
            <h2 id="args" className="font-display text-h2 leading-none font-bold uppercase">The great arguments</h2>
            <Stamp kind="argued" />
          </div>
          <ol role="list" className="mt-10 grid gap-px bg-line md:grid-cols-2">
            {ARGUMENTS.map((a, i) => (
              <Reveal as="li" key={a.q} delay={(i % 2) * 0.05} className="bg-void">
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
          <ul role="list" className="mt-12 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
            {CHORUS.map((c) => (
              <Spotlight as="li" tone="red" key={c.name} className="bg-void p-7">
                <SpoilerGate book={c.book} compact>
                  <p className="font-display text-4xl leading-none font-extrabold uppercase">{c.name}</p>
                  <p className="mt-3 text-sm text-ash">{c.note}</p>
                </SpoilerGate>
              </Spotlight>
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
