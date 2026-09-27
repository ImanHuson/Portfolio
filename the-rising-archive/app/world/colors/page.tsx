import type { Metadata } from "next";
import PageHeader from "@/components/typography/PageHeader";
import { TowerLink, TowerSound } from "@/components/world/TowerLink";
import { COLORS } from "@/lib/data/colors";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "The Fourteen Colors",
  description: "The Society’s caste pyramid, from Red to Gold: fourteen Colors, each bred and raised for one function.",
  alternates: { canonical: "./" },
};

const FACE = {
  display: "font-display font-extrabold uppercase tracking-tight",
  sans: "font-sans font-semibold tracking-tight",
  mono: "font-mono font-medium uppercase tracking-[0.08em]",
  serif: "font-serif font-medium italic",
} as const;

export default function ColorsPage() {
  // Top of the page is the top of the pyramid; the climb starts at the bottom.
  const tower = [...COLORS].reverse();
  const n = tower.length;
  return (
    <>
      <PageHeader
        trail={[{ href: "/", label: "Archive" }, { href: "/world/", label: "The World" }, { href: "/world/colors/", label: "Colors" }]}
        title="Fourteen Colors"
        lede="Not a table of jobs. A tower. The hierarchy is hereditary, genetically engineered and socially enforced: each Color is raised for one function, and kept out of every other one."
      >
        <TowerLink
          to="tier-red"
          className="mt-10 inline-flex items-center gap-3 border-b border-red pb-1 font-mono text-meta tracking-[0.22em] uppercase transition-colors hover:text-red"
        >
          Begin at the bottom
        </TowerLink>
      </PageHeader>
      <TowerSound />

      <ol aria-label="The Colors, from the top of the pyramid to the bottom" className="border-t border-line">
        {tower.map((c, i) => {
          const depth = i / (n - 1); // 0 at Gold, 1 at Red
          const isGold = c.name === "Gold";
          const isRed = c.name === "Red";
          return (
            <li
              key={c.name}
              id={`tier-${c.name.toLowerCase()}`}
              className="relative flex min-h-[62svh] items-end overflow-hidden px-5 py-14 md:px-8 md:py-20"
              style={{ backgroundColor: c.hex, color: c.ink }}
            >
              {/* Lighting: the lower the Color, the less light reaches it. */}
              <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(7,7,10,${0.15 + depth * 0.55}), rgba(7,7,10,${0.35 + depth * 0.5}))` }} />
              {/* Architecture: the pyramid narrows as it rises. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 border-x"
                style={{ width: `${30 + depth * 70}%`, borderColor: `${c.ink}22` }}
              />
              <div className="relative mx-auto grid w-full max-w-[1400px] gap-8 md:grid-cols-[1fr_1fr] md:items-end">
                <h2 className={cn("text-[clamp(3.5rem,11vw,10rem)] leading-[0.85]", FACE[c.face])}>{c.name}</h2>
                <div className="md:pb-3">
                  <p className="font-mono text-meta tracking-[0.2em] uppercase opacity-80">{c.role}</p>
                  <p className={cn("mt-3 max-w-[34ch] text-2xl leading-snug md:text-3xl", c.face === "serif" ? "font-serif italic" : "font-sans")}>{c.voice}</p>
                  {isGold && (
                    <TowerLink to="tier-red" className="mt-8 inline-block border-b pb-1 font-mono text-meta tracking-[0.22em] uppercase" >
                      Descend again
                    </TowerLink>
                  )}
                  {isRed && (
                    <p className="mt-8 font-mono text-meta tracking-[0.22em] uppercase opacity-80">
                      Scroll up to ascend
                    </p>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </>
  );
}
