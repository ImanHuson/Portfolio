import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/typography/PageHeader";
import Plate from "@/components/archive/Plate";
import Reveal from "@/components/archive/Reveal";
import { cn } from "@/lib/utils";
import Spotlight from "@/components/archive/Spotlight";

export const metadata: Metadata = {
  title: "The World",
  description: "The Colors, the houses, the factions, the places and the technology of the Red Rising Saga.",
  alternates: { canonical: "./" },
};

const PARTS = [
  { href: "/world/colors/", title: "Fourteen Colors", body: "A caste tower. Start at the bottom and climb.", plate: "/images/places/mars.webp", alt: "Mars, half in shadow.", span: "md:col-span-4 md:row-span-2" },
  { href: "/world/houses/", title: "Houses", body: "Five Gold dynasties, opened as sealed dossiers.", plate: "/images/houses/augustus.webp", alt: "The Augustus seal.", span: "md:col-span-2" },
  { href: "/world/factions/", title: "Factions", body: "The Society, the Sons of Ares, the Howlers, the Knights.", plate: "/images/rising/myth.webp", alt: "A masked idol over a crowd.", span: "md:col-span-2" },
  { href: "/world/places/", title: "Places", body: "A map of the Solar System’s grievances.", plate: "/images/places/io.webp", alt: "Io in front of Jupiter.", span: "md:col-span-3" },
  { href: "/world/vault/", title: "The Vault", body: "Razors, StarShells, dreadnoughts and worse.", plate: "/images/vault/dreadnought.webp", alt: "A dreadnought above Mars.", span: "md:col-span-3" },
];

export default function WorldPage() {
  return (
    <>
      <PageHeader
        trail={[{ href: "/", label: "Archive" }, { href: "/world/", label: "The World" }]}
        title="The world the war was fought over"
        lede="The pyramid, the families at its top, the factions tearing at it, the worlds it spans, and the machines it built."
      />
      <section aria-label="Parts of the world" className="px-5 pb-28 md:px-8">
        <ul role="list" className="mx-auto grid max-w-[1400px] gap-px bg-line md:grid-cols-6">
          {PARTS.map((p, i) => (
            <Reveal as="li" key={p.href} delay={i * 0.04} className={cn("bg-void", p.span)}>
              <Spotlight tone="gold" className="h-full">
              <Link href={p.href} className="group relative flex h-full min-h-[22rem] flex-col justify-end overflow-hidden">
                <Plate src={p.plate} alt={p.alt} className="absolute inset-0 h-full object-cover opacity-70 transition-[opacity,transform] duration-700 group-hover:scale-[1.03] group-hover:opacity-90" sizes="(min-width: 768px) 60vw, 100vw" />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-void via-void/60 to-transparent" />
                <div className="relative p-7 md:p-10">
                  <span className="font-display text-h3 leading-none font-bold uppercase group-hover:text-red">{p.title}</span>
                  <span className="mt-2 block max-w-[40ch] text-ash">{p.body}</span>
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
