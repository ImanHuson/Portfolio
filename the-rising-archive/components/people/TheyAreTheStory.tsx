import Link from "next/link";
import { EXTENDED } from "@/lib/data/extended";
import { PEOPLE, safeAs } from "@/lib/data/people";

// The closing of the character archive: every featured name surfacing in
// turn, slowly, then the way into The World. Names are the spoiler-safe
// versions (Mustang, The Jackal, Pax), because this is static text.
const NAMES = [...PEOPLE.map((p) => safeAs(p).name), ...EXTENDED.map((p) => p.name)].map((n) =>
  n.startsWith("The ") || !n.includes(" ") ? n : n.split(" ")[0],
);

export default function TheyAreTheStory() {
  return (
    <section aria-labelledby="story-title" className="relative overflow-hidden border-t border-line px-5 py-28 md:px-8 md:py-36">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_60%,rgba(122,15,23,0.28),transparent_70%)]" />
      <div className="relative mx-auto max-w-[1400px]">
        <h2 id="story-title" className="font-display text-h1 leading-[0.9] font-extrabold uppercase">
          They are the story
        </h2>
        <p className="mt-8 max-w-[34ch] font-serif text-h3 leading-snug text-bone/90 italic">
          Revolutions are remembered through their heroes. But worlds are built, broken and remembered by everyone around them.
        </p>
        <ul role="list" aria-label="Every featured name" className="relative mt-16 h-[26rem] border-y border-line md:h-[22rem]">
          {NAMES.map((n, i) => {
            const col = i % 4;
            const row = Math.floor(i / 4);
            const jitter = ((i * 37) % 7) - 3;
            return (
              <li
                key={n}
                className="story-name absolute -translate-x-1/2 -translate-y-1/2 font-display text-lg font-semibold whitespace-nowrap text-bone uppercase md:text-2xl"
                style={{ left: `${14 + col * 24 + jitter}%`, top: `${12 + row * 19}%`, animationDelay: `${i}s` }}
              >
                {n}
              </li>
            );
          })}
        </ul>
        <Link href="/world/" className="group mt-14 inline-block">
          <span className="font-mono text-meta tracking-[0.22em] text-ash-2 uppercase">Next</span>
          <span className="mt-2 block font-display text-h2 font-bold uppercase group-hover:text-red">
            The World <span aria-hidden>→</span>
          </span>
        </Link>
      </div>
    </section>
  );
}
