"use client";

import { useRef } from "react";
import Link from "next/link";
import Sealed from "@/components/archive/Sealed";
import { ERAS, EVENTS } from "@/lib/data/timeline";
import { cn } from "@/lib/utils";

/**
 * The whole story on one line. Wide screens: a horizontal track you can drag
 * (mouse), scroll sideways (trackpad, shift + wheel), tab through, or jump
 * along by era. Phones: the same entries as a vertical list. With JS off it
 * is still the full list, scrollable.
 */
export default function Timeline() {
  const track = useRef<HTMLOListElement>(null);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);

  const dragged = useRef(false);
  const endDrag = () => {
    if (!drag.current) return;
    dragged.current = drag.current.moved;
    drag.current = null;
    if (track.current) track.current.style.scrollSnapType = "";
  };

  const jump = (era: string) => {
    const el = track.current?.querySelector<HTMLElement>(`[data-era-start='${era}']`);
    if (!el || !track.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const behavior = reduce ? "auto" : "smooth";
    if (window.matchMedia("(max-width: 767px)").matches) {
      el.scrollIntoView({ block: "start", behavior });
      return;
    }
    // bring the track on screen, then slide it to the era
    track.current.scrollIntoView({ block: "center", behavior });
    track.current.scrollTo({ left: el.offsetLeft - track.current.offsetLeft - 32, behavior });
  };

  return (
    <div className="[timeline-scope:--tl]">
      <nav aria-label="Eras" data-js-only className="mx-auto flex max-w-[1400px] flex-wrap gap-2 px-4 md:px-8">
        {ERAS.map((e) => (
          <button
            key={e.id}
            type="button"
            onClick={() => jump(e.id)}
            className="press border border-line-strong px-3 py-2 text-left transition-colors hover:border-paper/60"
          >
            <span className="block font-military text-[0.95rem] font-semibold tracking-[0.12em] text-paper uppercase">{e.name}</span>
            <span className="block font-mono text-meta text-ash">{e.span}</span>
          </button>
        ))}
      </nav>

      <ol
        ref={track}
        tabIndex={0}
        aria-label="Timeline, from Ymir Fritz to the end"
        data-lenis-prevent
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse" || !track.current) return;
          drag.current = { x: e.clientX, left: track.current.scrollLeft, moved: false };
          // snapping fights a drag; let go of it until the pointer is up
          track.current.style.scrollSnapType = "none";
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d || !track.current) return;
          const dx = e.clientX - d.x;
          if (Math.abs(dx) > 4) d.moved = true;
          track.current.scrollLeft = d.left - dx;
        }}
        onPointerUp={() => endDrag()}
        onPointerLeave={() => endDrag()}
        onClickCapture={(e) => {
          // a drag is not a click on the link under the pointer
          if (dragged.current) e.preventDefault();
          dragged.current = false;
        }}
        className="timeline-track mt-10 flex flex-col gap-0 px-4 md:mt-14 md:flex-row md:gap-5 md:overflow-x-auto md:px-8 md:pb-10 md:[scroll-snap-type:x_proximity] md:[scroll-padding-inline:2rem] md:[scrollbar-width:thin] md:cursor-grab md:active:cursor-grabbing"
      >
        {EVENTS.map((ev, i) => {
          const first = i === 0 || EVENTS[i - 1].era !== ev.era;
          const era = ERAS.find((e) => e.id === ev.era)!;
          return (
            <li
              key={ev.title}
              data-era-start={first ? ev.era : undefined}
              className="relative scroll-mt-[calc(var(--nav-h)+1rem)] border-l border-line pb-10 pl-6 md:w-[22rem] md:shrink-0 md:border-t md:border-l-0 md:pt-8 md:pb-0 md:pl-0 md:[scroll-snap-align:start]"
            >
              {/* the line's marker */}
              <span aria-hidden className="absolute top-1 -left-[5px] size-[9px] rotate-45 border border-paper/60 bg-base md:-top-[5px] md:left-0" />
              {/* every card keeps the era line's height, so the dates line up across the track */}
              <p aria-hidden={!first} className={cn("mb-3 font-military text-[0.95rem] font-semibold tracking-[0.16em] text-alert uppercase", !first && "hidden md:invisible md:block")}>
                {era.name}
              </p>
              <p className="font-display text-h3 leading-none font-bold text-paper tabular-nums">{ev.when}</p>
              <h3 className="mt-3 font-military text-[1.25rem] font-semibold tracking-[0.1em] text-paper uppercase">{ev.title}</h3>
              <p className="mt-2 max-w-[44ch] leading-relaxed text-paper/80">{ev.text}</p>
              {ev.sealed && (
                <Sealed label={`Sealed: until ${ev.chapter}`} className="mt-4 max-w-[44ch]">
                  <p className="pt-1 leading-relaxed text-paper/85">{ev.sealed}</p>
                </Sealed>
              )}
              <Link href={ev.href} className="group mt-4 inline-flex items-baseline gap-2 font-mono text-meta text-ash transition-colors hover:text-paper">
                Read {ev.chapter}
                <span aria-hidden className="transition-transform motion-safe:[@media(hover:hover)]:group-hover:translate-x-1">&rarr;</span>
              </Link>
            </li>
          );
        })}
      </ol>
      {/* where the track is: a hairline that fills as it scrolls sideways (where supported) */}
      <div aria-hidden className="mx-4 mt-2 hidden h-px bg-line md:mx-8 md:block">
        <div className="timeline-progress h-px origin-left bg-alert" />
      </div>
    </div>
  );
}
