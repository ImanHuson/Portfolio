import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/typography/PageHeader";
import Plate from "@/components/archive/Plate";
import { altFor } from "@/lib/data/credits";
import Reveal from "@/components/archive/Reveal";
import { HOUSES } from "@/lib/data/houses";
import { cn } from "@/lib/utils";
import Spotlight from "@/components/archive/Spotlight";

export const metadata: Metadata = {
  title: "The Houses",
  description: "Five Gold houses as sealed political dossiers: Augustus, Bellona, Lune, Telemanus and Raa.",
  alternates: { canonical: "./" },
};

export default function HousesPage() {
  return (
    <>
      <PageHeader
        tone="gold"
        trail={[{ href: "/", label: "Archive" }, { href: "/world/", label: "The World" }, { href: "/world/houses/", label: "Houses" }]}
        title="Five houses"
        lede="Opened like sealed political dossiers, not encyclopedia cards. Each file unseals further as your clearance allows."
      />
      <section aria-label="The houses" className="px-5 pb-28 md:px-8">
        <ul role="list" className="mx-auto grid max-w-[1400px] gap-px bg-line md:grid-cols-6">
          {HOUSES.map((h, i) => (
            <Reveal as="li" cell key={h.slug} delay={i * 0.04} className={cn("bg-void", i < 2 ? "md:col-span-3" : "md:col-span-2")}>
              <Spotlight tone="gold" className="h-full">
              <Link href={`/world/houses/${h.slug}/`} className="group flex h-full flex-col">
                <div className="overflow-hidden">
                  <Plate
                    src={h.plate}
                    alt={altFor(h.plate, `The ${h.name} seal.`)}
                    className="aspect-square object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    sizes={i < 2 ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 33vw, 100vw"}
                  />
                </div>
                <div className="flex flex-1 flex-col p-7 md:p-9">
                  <span className="font-display text-h3 leading-none font-bold uppercase group-hover:text-red">{h.name}</span>
                  {h.motto ? (
                    <span className="mt-3 font-serif text-xl italic">
                      <span className="gold-foil">{h.motto}.</span> <span className="text-ash">{h.mottoEn}.</span>
                    </span>
                  ) : (
                    <span className="mt-3 font-serif text-xl text-ash-2 italic">No motto verified.</span>
                  )}
                  <span className="mt-auto pt-6 font-mono text-meta tracking-[0.16em] text-ash-2 uppercase">{h.seat}</span>
                </div>
              </Link>
              </Spotlight>
            </Reveal>
          ))}
        </ul>
      </section>
    </>
  );
}
