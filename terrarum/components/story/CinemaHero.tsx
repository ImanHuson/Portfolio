import { Crumbs } from "@/components/ui/Crumbs";
import { Credit } from "@/components/ui/Figure";
import { NativeName } from "@/components/ui/NativeName";
import { asset, imgSrc, imgSrcSet, media } from "@/lib/content/media";
import type { CountryEntry } from "@/lib/content/types";

type Trail = { href?: string; label: string }[];

/**
 * A page's opening: a full-screen photograph (or a slow cross-dissolve of
 * several) that drifts as the page arrives, the title low on the left and the
 * native name, set the country's way, on the right.
 */
export function CinemaHero({
  ids,
  kicker,
  title,
  summary,
  native,
  entry,
  trail,
  children,
}: {
  ids: string[];
  kicker?: string;
  title: string;
  summary?: string;
  native?: string;
  entry: CountryEntry;
  trail: Trail;
  children?: React.ReactNode;
}) {
  const slides = ids.slice(0, 4);
  const total = slides.length * 9;
  return (
    <section data-hero className="cine relative isolate flex flex-col overflow-hidden text-[#f3ece0]">
      <div className={`absolute inset-0 -z-20 ${slides.length > 1 ? "cine-slides" : ""}`} style={{ "--slide-total": `${total}s` } as React.CSSProperties}>
        {slides.map((id, i) => {
          const m = media(id);
          return (
            <img
              key={id}
              src={imgSrc(m, 1920)}
              srcSet={imgSrcSet(m)}
              sizes="100vw"
              width={m.width}
              height={m.height}
              alt={i === 0 ? m.alt : ""}
              aria-hidden={i === 0 ? undefined : true}
              data-fallback={m.fallback ? asset(m.fallback) : undefined}
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : "auto"}
              decoding={i === 0 ? "sync" : "async"}
              className={`cine-img absolute inset-0 h-full w-full object-cover ${m.kind === "photo" ? "photo" : ""}`}
              style={{ "--slide-at": `${i * 9}s` } as React.CSSProperties}
            />
          );
        })}
      </div>
      <div className="cine-scrim absolute inset-0 -z-10" aria-hidden />


      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-4 pt-6 md:px-8 [&_a]:text-[#e9e1d2] [&_nav]:text-[#d6cfc2] [&_span[aria-current]]:text-white">
        <Crumbs trail={trail} />
      </div>

      <div className="relative z-10 mx-auto mt-auto grid w-full max-w-[1400px] items-end gap-8 px-4 pb-6 pt-24 md:px-8 md:pb-[9vh] lg:grid-cols-[minmax(0,1fr)_auto]">
        <div className="cine-copy max-w-[52rem]">
          {kicker && <p className="photo-label text-sm font-medium tracking-wide">{kicker}</p>}
          <h1 className="mt-3 font-display text-5xl leading-[1.02] tracking-tight md:text-7xl lg:text-8xl">{title}</h1>
          {summary && <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-[#e6dfd2] md:text-xl">{summary}</p>}
          {children && <div className="mt-7">{children}</div>}
        </div>
        {native && <NativeName text={native} entry={entry} size="md" className="write-in hidden self-end lg:block" />}
      </div>

      <p className="mx-auto w-full max-w-[1400px] px-4 pb-3 text-[12px] leading-snug text-[#d2cbbe] md:absolute md:bottom-3 md:right-8 md:w-auto md:max-w-[70ch] md:px-0 md:pb-0 md:text-right [&_a]:decoration-[#d2cbbe]/50" data-pagefind-ignore>
        {slides.map((id, i) => (
          <span key={id}>
            {i > 0 && "; "}
            <Credit id={id} />
          </span>
        ))}
      </p>
    </section>
  );
}
