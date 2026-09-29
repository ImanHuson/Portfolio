import type { Metadata } from "next";
import PageHeader from "@/components/typography/PageHeader";
import Plate from "@/components/archive/Plate";
import { altFor, creditLine } from "@/lib/data/credits";
import Reveal from "@/components/archive/Reveal";
import SpoilerGate from "@/components/archive/SpoilerGate";
import Stamp from "@/components/archive/Stamp";
import { INSTRUMENTS, VAULT } from "@/lib/data/vault";
import { cn } from "@/lib/utils";
import Spotlight from "@/components/archive/Spotlight";

export const metadata: Metadata = {
  title: "The Artifact Vault",
  description: "The saga’s technology as museum pieces: razors, StarShells, dreadnoughts, starships, the Mind’s Eye, Carvings, PsychoSpikes and holotech.",
  alternates: { canonical: "./" },
};

export default function VaultPage() {
  return (
    <>
      <PageHeader
        tone="rim"
        trail={[{ href: "/", label: "Archive" }, { href: "/world/", label: "The World" }, { href: "/world/vault/", label: "Vault" }]}
        title="The Artifact Vault"
        lede="The machinery of the war, catalogued like museum pieces. Where something real comes close, it stands in: a real sword for the razor, real armour for the StarShell. The rest are the archive’s own renders."
      />
      <section aria-label="Artifacts" className="px-5 pb-20 md:px-8">
        <ul role="list" className="mx-auto grid max-w-[1400px] gap-px bg-line md:grid-cols-2">
          {VAULT.map((a, i) => (
            <Reveal as="li" key={a.slug} delay={(i % 2) * 0.06} className="bg-void">
              <Spotlight as="article" tone="red" className={cn("grid h-full gap-0 sm:grid-cols-2", i % 4 >= 2 && "sm:[&>*:first-child]:order-2")}>
                <Plate src={a.plate} alt={altFor(a.plate, `${a.name}, rendered for this archive.`)} className="aspect-square object-cover" sizes="(min-width: 768px) 25vw, 50vw" />
                <div className="flex flex-col p-6 md:p-8">
                  <h2 className="font-display text-3xl leading-none font-bold uppercase">{a.name}</h2>
                  <p className="mt-3 font-serif text-lg text-bone/90 italic">{a.line}</p>
                  <div className="mt-5 space-y-3 text-sm text-ash">
                    {a.body.map((b) => (
                      <SpoilerGate key={b.text} book={b.book} compact>
                        <p>{b.text}</p>
                      </SpoilerGate>
                    ))}
                  </div>
                  {a.reading && <Stamp kind="reading" className="mt-auto self-start pt-0" />}
                  <p className="mt-6 font-mono text-[0.7rem] tracking-[0.12em] text-ash-2 uppercase">{creditLine(a.plate) || "Archive render"}</p>
                </div>
              </Spotlight>
            </Reveal>
          ))}
        </ul>
      </section>
      <section aria-labelledby="instruments" className="border-t border-line px-5 py-20 md:px-8">
        <div className="mx-auto grid max-w-[1400px] gap-10 md:grid-cols-[3fr_9fr]">
          <h2 id="instruments" className="font-mono text-meta tracking-[0.18em] text-ash-2 uppercase md:pt-1">Smaller instruments</h2>
          <dl className="grid gap-8 sm:grid-cols-2">
            {INSTRUMENTS.map((x) => (
              <div key={x.name}>
                <dt className="font-display text-2xl font-bold uppercase">{x.name}</dt>
                <dd className="mt-2">
                  <SpoilerGate book={x.book} compact>
                    <p className="text-ash">{x.text}</p>
                  </SpoilerGate>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
