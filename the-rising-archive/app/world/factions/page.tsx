import type { Metadata } from "next";
import PageHeader from "@/components/typography/PageHeader";
import Reveal from "@/components/archive/Reveal";
import Redacted from "@/components/archive/Redacted";
import SpoilerGate from "@/components/archive/SpoilerGate";
import Stamp from "@/components/archive/Stamp";
import HowlerRollCall from "@/components/world/HowlerRollCall";
import { ASCOMANNI, FACTIONS, KNIGHTS } from "@/lib/data/factions";
import { cn } from "@/lib/utils";
import Spotlight from "@/components/archive/Spotlight";

export const metadata: Metadata = {
  title: "The Factions",
  description: "The Society, the Sons of Ares, the Rising, the Solar Republic, the Howlers, the Olympic Knights, and a redacted file on the Ascomanni.",
  alternates: { canonical: "./" },
};

const VOICE = {
  gold: { wrap: "text-center", name: "font-serif font-medium text-gold", creed: "font-serif italic text-bone/80" },
  red: { wrap: "", name: "font-display font-extrabold uppercase text-red tracking-tight", creed: "font-mono uppercase tracking-[0.2em] text-bone" },
  display: { wrap: "", name: "font-display font-extrabold uppercase text-bone", creed: "font-display uppercase text-ash" },
  rim: { wrap: "", name: "font-sans font-light text-rim tracking-tight", creed: "font-sans text-rim-dim" },
} as const;

export default function FactionsPage() {
  return (
    <>
      <PageHeader
        trail={[{ href: "/", label: "Archive" }, { href: "/world/", label: "The World" }, { href: "/world/factions/", label: "Factions" }]}
        title="Who fights, and for what"
        lede="Each faction in its own visual language, because each one sees the world differently."
      />

      {FACTIONS.map((f) => {
        const v = VOICE[f.voice];
        return (
          <section key={f.slug} id={f.slug} aria-labelledby={`${f.slug}-t`} className="border-t border-line px-5 py-24 md:px-8">
            <Reveal className={cn("mx-auto max-w-[1100px]", v.wrap)}>
              <h2 id={`${f.slug}-t`} className={cn("text-h1 leading-[0.9]", v.name)}>{f.name}</h2>
              <p className={cn("mt-5 text-h3 leading-snug", v.creed)}>{f.creed}</p>
              <div className={cn("mt-10 space-y-5", f.voice === "gold" ? "mx-auto max-w-[56ch]" : "max-w-[60ch]")}>
                {f.body.map((b) => (
                  <SpoilerGate key={b.text} book={b.book} compact>
                    <p className="text-lede text-bone/85">{b.text}</p>
                  </SpoilerGate>
                ))}
              </div>
            </Reveal>
          </section>
        );
      })}

      <section id="howlers" aria-labelledby="howlers-t" className="border-t border-line px-5 py-24 md:px-8">
        <div className="mx-auto max-w-[1400px]">
          <h2 id="howlers-t" className="font-display text-h1 leading-[0.9] font-extrabold uppercase">The Howlers</h2>
          <p className="mt-5 max-w-[56ch] text-lede text-ash">
            Not “Sevro’s irregular strike unit.” A pack, from the Institute on. This is its roll call.
          </p>
          <div className="mt-12">
            <HowlerRollCall />
          </div>
          <p className="mt-6 max-w-[64ch] text-sm text-ash-2">
            From the Institute pack to the Solar War. Weapons and details appear only where the archive could verify them; names listed without detail are on the roll and nothing more is claimed.
          </p>
        </div>
      </section>

      <section id="knights" aria-labelledby="knights-t" className="border-t border-line px-5 py-24 md:px-8">
        <div className="mx-auto max-w-[1400px]">
          <h2 id="knights-t" className="font-serif text-h1 leading-[0.9] gold-foil">The Olympic Knights</h2>
          <p className="mt-5 max-w-[56ch] text-lede text-ash">
            Twelve seats. The Society’s champions, each with an armour, a title and a reputation. Ten of the twelve titles are named here, plus a disputed thirteenth. Where the archive couldn’t confirm a detail, it says so.
          </p>
          <ul role="list" className="mt-12 grid gap-px bg-line md:grid-cols-2 lg:grid-cols-3">
            {KNIGHTS.map((k) => (
              <Spotlight as="li" tone="gold" key={k.title} className="flex flex-col gap-4 bg-void p-7">
                <div className="flex items-start justify-between gap-4">
                  <p className="font-serif text-3xl text-bone">{k.title}</p>
                  {k.disputed && <Stamp kind="disputed" />}
                </div>
                <div>
                  <p className="font-mono text-meta tracking-[0.18em] text-ash-2 uppercase">Armour</p>
                  <p className="mt-1 text-ash">{k.armour ?? <Stamp kind="unknown" />}</p>
                </div>
                <div>
                  <p className="font-mono text-meta tracking-[0.18em] text-ash-2 uppercase">Held by</p>
                  {k.holder ? (
                    <SpoilerGate book={k.holder.book} compact className="mt-1">
                      <p className="mt-1 text-bone/85">{k.holder.text}</p>
                    </SpoilerGate>
                  ) : (
                    <Stamp kind="unknown" className="mt-1" />
                  )}
                </div>
                {k.note && (
                  <SpoilerGate book={k.note.book} compact>
                    <p className="text-sm text-ash">{k.note.text}</p>
                  </SpoilerGate>
                )}
              </Spotlight>
            ))}
          </ul>
        </div>
      </section>

      <section id="ascomanni" aria-labelledby="asco-t" className="border-t border-line bg-void-2 px-5 py-24 md:px-8">
        <div className="mx-auto max-w-[900px] border border-line-strong bg-void p-8 font-mono md:p-12">
          <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-line pb-4 text-meta tracking-[0.2em] text-ash-2 uppercase">
            <span>Intelligence file</span>
            <span className="text-red">Classification: fragmentary</span>
          </div>
          <h2 id="asco-t" className="mt-8 font-display text-h2 leading-none font-extrabold tracking-tight uppercase">Ascomanni</h2>
          <p className="mt-4 text-sm text-ash">Minimal information. Fragments, rumours, reports.</p>
          <ul role="list" className="mt-10 space-y-5 text-sm leading-relaxed text-bone/85">
            {ASCOMANNI.map((l) => (
              <li key={l.text}>
                <Redacted book={l.book}>
                  <p>{l.text}</p>
                </Redacted>
              </li>
            ))}
          </ul>
          <p className="mt-10 border-t border-line pt-4 text-meta tracking-[0.2em] text-ash-2 uppercase">End of file</p>
        </div>
      </section>
    </>
  );
}
