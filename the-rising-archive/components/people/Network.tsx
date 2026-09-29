"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useArchive } from "@/components/providers/ArchiveProvider";
import { FEATURED, getFeatured } from "@/lib/data/featured";
import { KINDS, LINKS, NODES, linkBook, linkStage, type LinkKind } from "@/lib/data/network";
import { BOOK_TITLES } from "@/lib/data/spoilers";
import { cn } from "@/lib/utils";

// Each kind is a line treatment first and a colour second, so the map
// reads without colour (brief section 55).
type Look = { stroke: string; width: number; dash?: string; cap?: "round"; double?: boolean };
export const LOOK: Record<LinkKind, Look> = {
  family: { stroke: "#d2ac47", width: 3.4 },
  friendship: { stroke: "#e9e4da", width: 1.6 },
  mentorship: { stroke: "#e9e4da", width: 1.6, dash: "16 6 3 6" },
  rivalry: { stroke: "#ec5a62", width: 1.8, dash: "10 8" },
  romance: { stroke: "#ec5a62", width: 1.3, double: true },
  loyalty: { stroke: "#aab2ba", width: 2.6, dash: "0.1 7", cap: "round" },
  betrayal: { stroke: "#c41e2a", width: 2.2, dash: "20 5 3 5 3 5" },
  ideology: { stroke: "#938f88", width: 1.6, dash: "26 12" },
};

export function Swatch({ kind, className }: { kind: LinkKind; className?: string }) {
  const l = LOOK[kind];
  const line = (y: number) => (
    <line x1="2" y1={y} x2="46" y2={y} stroke={l.stroke} strokeWidth={Math.max(l.width, 1.4)} strokeDasharray={l.dash} strokeLinecap={l.cap ?? "butt"} />
  );
  return (
    <svg aria-hidden viewBox="0 0 48 12" className={cn("h-3 w-12 shrink-0", className)}>
      {l.double ? (
        <>
          {line(3.5)}
          {line(8.5)}
        </>
      ) : (
        line(6)
      )}
    </svg>
  );
}

const POS = Object.fromEntries(NODES.map((n) => [n.slug, n]));

function Edge({ a, b, kind, opacity }: { a: string; b: string; kind: LinkKind; opacity: number }) {
  const p = POS[a], q = POS[b], l = LOOK[kind];
  const common = { stroke: l.stroke, strokeWidth: l.width, strokeDasharray: l.dash, strokeLinecap: l.cap ?? ("butt" as const), opacity, style: { transition: "opacity 300ms" } };
  if (!l.double) return <line x1={p.x} y1={p.y} x2={q.x} y2={q.y} {...common} />;
  const dx = q.x - p.x, dy = q.y - p.y, len = Math.hypot(dx, dy) || 1, nx = (-dy / len) * 3.2, ny = (dx / len) * 3.2;
  return (
    <g>
      <line x1={p.x + nx} y1={p.y + ny} x2={q.x + nx} y2={q.y + ny} {...common} />
      <line x1={p.x - nx} y1={p.y - ny} x2={q.x - nx} y2={q.y - ny} {...common} />
    </g>
  );
}

/** The full network of the twenty featured people. Pick a person to
 * isolate their links; pick a kind to see only that kind. Links you have
 * opened stay bright, so the map fills in as you explore. */
export default function Network() {
  const { clearance } = useArchive();
  const [sel, setSel] = useState<string | null>(null);
  const [kind, setKind] = useState<LinkKind | null>(null);
  const [seen, setSeen] = useState<string[]>([]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSel(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const choose = (slug: string | null) => {
    setSel((cur) => (cur === slug ? null : slug));
    if (slug) setSeen((s) => (s.includes(slug) ? s : [...s, slug]));
  };

  const live = useMemo(
    () =>
      LINKS.map((l) => ({ l, stage: linkStage(l, clearance) }))
        .filter((x) => x.stage !== null)
        .map((x) => ({ ...x.l, stage: x.stage! })),
    [clearance],
  );
  const sealedCount = LINKS.length - live.length;

  const person = sel ? getFeatured(sel) : null;
  const mine = sel ? live.filter((l) => l.a === sel || l.b === sel) : [];
  const mineSealed = sel ? LINKS.filter((l) => (l.a === sel || l.b === sel) && linkBook(l) > clearance).length : 0;

  const edgeOpacity = (l: (typeof live)[number]) => {
    if (sel) return l.a === sel || l.b === sel ? (kind && l.stage.kind !== kind ? 0.25 : 1) : 0.05;
    if (kind) return l.stage.kind === kind ? 0.95 : 0.05;
    return seen.includes(l.a) || seen.includes(l.b) ? 0.9 : 0.42;
  };
  const nodeLit = (slug: string) => {
    if (sel) return slug === sel || mine.some((l) => l.a === slug || l.b === slug);
    if (kind) return live.some((l) => l.stage.kind === kind && (l.a === slug || l.b === slug));
    return true;
  };

  return (
    <div className="mx-auto max-w-[1400px]">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2" role="group" aria-label="Show one kind of link">
        {KINDS.map((k) => (
          <button
            key={k.key}
            type="button"
            aria-pressed={kind === k.key}
            onClick={() => setKind((c) => (c === k.key ? null : k.key))}
            className={cn(
              "inline-flex min-h-10 items-center gap-2 border px-3 py-1.5 font-mono text-meta tracking-[0.14em] uppercase transition-colors",
              kind === k.key ? "border-red text-bone" : "border-line text-ash hover:border-line-strong hover:text-bone",
            )}
          >
            <Swatch kind={k.key} />
            {k.label}
          </button>
        ))}
        {(kind || sel) && (
          <button
            type="button"
            onClick={() => {
              setKind(null);
              setSel(null);
            }}
            className="min-h-10 px-2 font-mono text-meta tracking-[0.18em] text-red uppercase hover:text-bone"
          >
            Show everyone
          </button>
        )}
      </div>

      <div className="mt-8 grid items-start gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div className="relative aspect-square w-full overflow-hidden border border-line bg-void">
          <svg aria-hidden viewBox="0 0 1000 1000" className="absolute inset-0 h-full w-full">
            {live.map((l) => (
              <Edge key={`${l.a}-${l.b}`} a={l.a} b={l.b} kind={l.stage.kind} opacity={edgeOpacity(l)} />
            ))}
          </svg>
          {NODES.map((n) => {
            const f = getFeatured(n.slug)!;
            const lit = nodeLit(n.slug);
            return (
              <button
                key={n.slug}
                type="button"
                onClick={() => choose(n.slug)}
                aria-pressed={sel === n.slug}
                aria-label={`${f.as(clearance).name}: show their links`}
                className={cn("group absolute -translate-x-1/2 -translate-y-1/2 px-1.5 py-1 text-center transition-opacity duration-300", !lit && "opacity-25")}
                style={{ left: `${n.x / 10}%`, top: `${n.y / 10}%` }}
              >
                <span
                  aria-hidden
                  className={cn(
                    "mx-auto block rounded-full border transition-transform group-hover:scale-150",
                    n.slug === "darrow" ? "size-3.5" : "size-2.5",
                    "border-bone bg-bone",
                    sel === n.slug && "border-red bg-red",
                    seen.includes(n.slug) && sel !== n.slug && "ring-2 ring-red/50",
                  )}
                />
                <span className="mt-1 block bg-void/85 px-1 py-0.5 font-display text-[0.7rem] leading-none font-bold whitespace-nowrap uppercase sm:text-sm">
                  <span className="md:hidden">{f.short(clearance)}</span>
                  <span className="hidden md:inline">{f.as(clearance).name}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="lg:sticky lg:top-[calc(var(--nav-h)+2rem)]" aria-live="polite">
          {person ? (
            <div>
                <p className="font-mono text-meta tracking-[0.2em] text-red uppercase">Their links</p>
                <h3 className="mt-3 font-display text-h2 leading-[0.9] font-bold uppercase">{person.as(clearance).name}</h3>
                <p className="mt-2 font-serif text-xl text-ash italic">{person.as(clearance).epithet}</p>
                {mine.length === 0 && (
                  <p className="mt-6 max-w-[44ch] text-ash">
                    {clearance < person.firstBook
                      ? `First met in ${BOOK_TITLES[person.firstBook]}. Their links are sealed at your clearance; raise it from the top bar to open them.`
                      : "Their links are sealed at your clearance; raise it from the top bar to open them."}
                  </p>
                )}
                <ul role="list" className="mt-8 divide-y divide-line border-y border-line empty:hidden">
                  {mine.map((l) => {
                    const other = getFeatured(l.a === sel ? l.b : l.a)!;
                    const history = l.stages.filter((st) => st.book <= clearance);
                    return (
                      <li key={`${l.a}-${l.b}`} className="py-4">
                        <button type="button" onClick={() => choose(other.slug)} className="group flex w-full items-center gap-3 text-left">
                          <Swatch kind={l.stage.kind} />
                          <span className="font-display text-xl font-bold uppercase group-hover:text-red">{other.as(clearance).name}</span>
                          <span className="ml-auto font-mono text-meta tracking-[0.16em] text-ash uppercase">{KINDS.find((k) => k.key === l.stage.kind)!.label}</span>
                        </button>
                        <p className="mt-2 text-ash">{l.stage.note}</p>
                        {history.length > 1 && (
                          <p className="mt-1 font-mono text-meta tracking-[0.12em] text-ash-2 uppercase">
                            {history.map((st) => KINDS.find((k) => k.key === st.kind)!.label).join(" → ")}
                          </p>
                        )}
                      </li>
                    );
                  })}
                </ul>
                {mineSealed > 0 && (
                  <p className="mt-4 font-mono text-meta tracking-[0.16em] text-ash-2 uppercase">
                    {mineSealed} more {mineSealed === 1 ? "link" : "links"} sealed at your clearance
                  </p>
                )}
                <div className="mt-8 flex flex-wrap gap-6">
                  <Link href={`/people/${person.slug}/`} className="border-b border-red pb-1 font-mono text-meta tracking-[0.2em] uppercase hover:text-red">
                    Open the dossier
                  </Link>
                  <button type="button" onClick={() => setSel(null)} className="font-mono text-meta tracking-[0.2em] text-ash uppercase hover:text-bone">
                    Back to everyone
                  </button>
                </div>
            </div>
          ) : (
            <div>
              <h3 className="font-display text-h3 font-bold uppercase">Pick anyone</h3>
              <p className="mt-4 max-w-[46ch] text-ash">
                Twenty people and the lines between them. Choose a name to see only their links, or a kind of link above. The people you open stay marked, so the web fills in as you go.
              </p>
              <p className="mt-6 font-mono text-meta tracking-[0.16em] text-ash-2 uppercase">
                {seen.length} of {FEATURED.length} opened
                {sealedCount > 0 && ` · ${sealedCount} links sealed at your clearance`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
