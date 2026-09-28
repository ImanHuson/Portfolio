import Sealed from "@/components/archive/Sealed";
import { MEMORIAL, MEMORIAL_104, MEMORIAL_NOTE, TROST_LOSS } from "@/lib/data/war";
import { cn } from "@/lib/utils";

const UNNAMED = 144;

/** A quiet list. The dead fade as they pass; the living stay. No effects beyond that. */
export default function Memorial() {
  return (
    <section aria-labelledby="memorial-title" className="border-t border-line bg-void px-4 py-28 md:px-8 md:py-40">
      <div className="mx-auto max-w-[900px]">
        <header className="text-center">
          <h2 id="memorial-title" className="font-display text-h1 leading-none font-bold tracking-[0.06em] text-paper uppercase">
            Survey Corps
          </h2>
          <p className="mt-6 font-serif text-lede text-paper/70 italic">Shinzō o sasageyo. Dedicate your hearts.</p>
        </header>

        <ol className="mt-24 grid gap-0">
          {MEMORIAL.map((m) => (
            <li
              key={m.name}
              className={cn(
                "grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1 border-b border-paper/10 py-5 md:grid-cols-[16rem_6rem_1fr]",
                m.fate === "KIA" && "memorial-fade",
              )}
            >
              <span className="font-display text-[1.25rem] font-bold text-paper">{m.name}</span>
              <span
                className={cn(
                  "font-mono text-meta tracking-[0.2em]",
                  m.fate === "SURVIVED" ? "font-bold text-paper" : m.fate === "KIA" ? "text-ash" : "text-paper/60",
                )}
              >
                {m.fate}
              </span>
              <span className="col-span-2 text-[0.92rem] leading-relaxed text-paper/60 md:col-span-1">
                {m.note}
                {m.later && (
                  <Sealed label="Sealed: after 850" className="mt-1">
                    <p className="pt-1 text-paper/75">{m.later}</p>
                  </Sealed>
                )}
              </span>
            </li>
          ))}
        </ol>

        <h3 className="mt-24 text-center font-mono text-meta tracking-[0.24em] text-ash uppercase">104th Cadet Corps. Trost, 850</h3>
        <p className="mt-3 text-center text-[0.9rem] text-paper/50">{TROST_LOSS}</p>
        <ol className="mt-10 grid gap-0">
          {MEMORIAL_104.map((m) => (
            <li key={m.name} className="memorial-fade grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1 border-b border-paper/10 py-5 md:grid-cols-[16rem_6rem_1fr]">
              <span className="font-display text-[1.25rem] font-bold text-paper">{m.name}</span>
              <span className="font-mono text-meta tracking-[0.2em] text-ash">KIA</span>
              <span className="col-span-2 text-[0.92rem] leading-relaxed text-paper/60 md:col-span-1">
                {m.note}
                {m.later && (
                  <Sealed label="Sealed: how he died" className="mt-1">
                    <p className="pt-1 text-paper/75">{m.later}</p>
                  </Sealed>
                )}
              </span>
            </li>
          ))}
        </ol>

        <div aria-label="Soldiers the story does not name" className="mt-20 grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3 md:grid-cols-4">
          {Array.from({ length: UNNAMED }, (_, i) => (
            <span key={i} aria-hidden={i > 0} className="memorial-fade font-mono text-meta tracking-[0.16em] text-paper/35 uppercase">
              Name not recorded
            </span>
          ))}
        </div>
        <p className="mt-16 max-w-[60ch] text-[0.85rem] leading-relaxed text-ash">{MEMORIAL_NOTE}</p>
      </div>
    </section>
  );
}
