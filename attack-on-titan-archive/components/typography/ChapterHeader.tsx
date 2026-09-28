import { CHAPTERS } from "@/lib/data/chapters";
import { asset } from "@/lib/utils";

/** The head of a chapter, the same on every chapter: a full-bleed frame from
 * the archive, the file number and act, the title, one line of lede. */
export default function ChapterHeader({
  id,
  title,
  lede,
  image,
  imagePosition = "50% 50%",
}: {
  id: string;
  title: string;
  lede: React.ReactNode;
  image: string;
  imagePosition?: string;
}) {
  const chapter = CHAPTERS.find((c) => c.id === id);
  return (
    <header className="relative min-h-[82dvh] overflow-hidden px-4 pt-[calc(var(--nav-h)+2rem)] md:px-8">
      <img
        src={asset(image)}
        alt=""
        width={1680}
        height={1050}
        fetchPriority="high"
        className="absolute inset-0 size-full object-cover"
        style={{ objectPosition: imagePosition }}
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-base from-15% via-base/70 to-base/20 md:from-5% md:via-base/50" />
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_10%_95%,rgba(11,12,10,0.9),transparent_60%)]" />
      <div className="relative mx-auto flex min-h-[calc(82dvh-var(--nav-h)-2rem)] max-w-[1400px] flex-col justify-end pb-14 md:pb-16">
        <p className="font-mono text-meta text-paper/75">
          {id}
          {chapter && <span className="text-paper/55"> &middot; {chapter.act}</span>}
        </p>
        <h1 className="mt-4 font-display text-h1 leading-[0.92] font-extrabold text-paper uppercase">{title}</h1>
        <div className="mt-6 max-w-[52ch] font-serif text-lede leading-snug text-paper/90 italic">{lede}</div>
      </div>
    </header>
  );
}
