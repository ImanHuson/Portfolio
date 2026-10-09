import { CHAPTERS } from "@/lib/data/chapters";
import SectionBackdrop from "@/components/archive/SectionBackdrop";
import { cn } from "@/lib/utils";

/** The head of an opened ending file: the same id, act and title as every
 * other chapter, but on black and without a picture, because the scene that
 * follows is the picture. */
export default function EndingHeader({ id, lede, image, contain }: { id: string; lede: string; image?: string; contain?: boolean }) {
  const c = CHAPTERS.find((x) => x.id === id);
  return (
    <header className={cn("relative isolate bg-void px-4 pt-[calc(var(--nav-h)+5rem)] pb-16 md:px-8 md:pb-20", image && "flex min-h-[88dvh] flex-col justify-end")}>
      {image && <SectionBackdrop src={image} contain={contain} strength={0.6} />}
      <div className="mx-auto w-full max-w-[1400px]">
        <p className="font-mono text-meta text-paper/75">
          {id}
          {c && <span className="text-paper/55"> &middot; {c.act}</span>}
        </p>
        <h1 className="mt-4 font-display text-h1 leading-[0.92] font-extrabold text-paper uppercase">{c?.title}</h1>
        <p className="mt-6 max-w-[52ch] font-serif text-lede leading-snug text-paper/85 italic">{lede}</p>
      </div>
    </header>
  );
}
