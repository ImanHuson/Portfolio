import Link from "next/link";
import CardWash from "@/components/archive/CardWash";
import Plate from "@/components/archive/Plate";
import Reveal from "@/components/archive/Reveal";
import { cn } from "@/lib/utils";
import Spotlight from "@/components/archive/Spotlight";

const BRANCHES = [
  { href: "/story/", title: "The Story", body: "Six books as six chapters in the history of a civilization, and the timeline they sit on.", cta: "Open the story", plate: "/images/covers/shelf.webp", w: 1600, h: 900, span: "md:col-span-4 md:row-span-2 md:min-h-[34rem]" },
  { href: "/people/", title: "The People", body: "Ten faces of power, their dossiers, and what the war took from each of them.", cta: "Open the dossiers", plate: "/images/portraits/darrow.webp", w: 960, h: 1200, span: "md:col-span-2 md:row-span-2" },
  { href: "/world/", title: "The World", body: "Fourteen Colors, five houses, the factions, the planets, the machines.", cta: "Enter the world", plate: "/images/places/mars.webp", w: 900, h: 900, span: "md:col-span-2" },
  { href: "/ideas/", title: "The Ideas", body: "Six questions the saga won’t stop asking.", cta: "Ask them", plate: "/images/rising/movement.webp", w: 1600, h: 900, span: "md:col-span-2" },
  { href: "/fandom/", title: "The Fandom", body: "The arguments, the quotes, the chorus.", cta: "Join the argument", plate: "/images/portraits/sevro.webp", w: 960, h: 1200, span: "md:col-span-2" },
  { href: "/author/", title: "The Author", body: "Pierce Brown, the man who built Mars.", cta: "Meet him", plate: "/images/covers/light-bringer.webp", w: 900, h: 1350, span: "md:col-span-3" },
  { href: "/sealed/", title: "The Sealed File", body: "VII. Red God. Status: incomplete.", cta: "Access denied", plate: null, w: 0, h: 0, span: "md:col-span-3" },
];

const DEEP = [
  { href: "/story/timeline/", title: "The Timeline", body: "From the Conquering to the sealed file." },
  { href: "/people/relationships/", title: "The Constellation", body: "Everyone Darrow loved, lost, or fought." },
  { href: "/people/the-vale/", title: "The Vale", body: "The dead, remembered by name." },
  { href: "/what-survives/", title: "What survives", body: "The end of the archive." },
];

export default function ArchiveIndex() {
  return (
    <section aria-labelledby="index-title" className="border-t border-line px-5 py-28 md:px-8 md:py-36">
      <div className="mx-auto max-w-[1400px]">
        <p className="font-mono text-meta tracking-[0.22em] text-red uppercase">The archive</p>
        <h2 id="index-title" className="mt-4 max-w-[16ch] font-display text-h2 leading-[0.9] font-bold uppercase">
          Where do you want to begin?
        </h2>

        <ul role="list" className="mt-16 grid gap-px bg-line md:grid-cols-6">
          {BRANCHES.map((b, i) => (
            <Reveal as="li" cell key={b.href} delay={(i % 3) * 0.05} className={cn("bg-void", b.span)}>
              <Spotlight tone={b.href === "/sealed/" || i < 2 ? "red" : "gold"} className="h-full">
              <Link href={b.href} className="group relative flex h-full min-h-[20rem] flex-col justify-end overflow-hidden">
                {b.plate ? (
                  <>
                    <Plate
                      src={b.plate}
                      alt=""
                      width={b.w}
                      height={b.h}
                      className="absolute inset-0 h-full object-cover object-top opacity-60 transition-[opacity,transform] duration-700 group-hover:scale-[1.03] group-hover:opacity-85"
                      sizes="(min-width: 768px) 60vw, 100vw"
                    />
                    <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-void via-void/55 to-transparent" />
                  </>
                ) : (
                  <div aria-hidden className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_3px,rgba(233,228,218,0.025)_3px,rgba(233,228,218,0.025)_4px)]" />
                )}
                <div className="relative p-7 md:p-10">
                  <span className={cn("font-display leading-none font-bold uppercase", i === 0 ? "text-h2" : "text-h3", b.href === "/sealed/" && "text-red")}>
                    {b.title}
                  </span>
                  <span className="mt-3 block max-w-[40ch] text-ash">{b.body}</span>
                  <span className="mt-6 block font-mono text-meta tracking-[0.2em] text-bone uppercase group-hover:text-red">{b.cta}</span>
                </div>
              </Link>
              </Spotlight>
            </Reveal>
          ))}
        </ul>

        <ul role="list" className="mt-px grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
          {DEEP.map((d) => (
            <li key={d.href} className="bg-void">
              <Link href={d.href} className="group block p-8 wash-card">
                <span className="font-display text-2xl font-semibold uppercase group-hover:text-red">{d.title}</span>
                <span className="mt-2 block text-sm text-ash">{d.body}</span>
                <CardWash />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
