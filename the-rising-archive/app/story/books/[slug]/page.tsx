import type { Metadata } from "next";
import Link from "next/link";
import CardWash from "@/components/archive/CardWash";
import { notFound } from "next/navigation";
import Plate from "@/components/archive/Plate";
import Reveal from "@/components/archive/Reveal";
import SpoilerGate from "@/components/archive/SpoilerGate";
import { BOOKS, COVER_CREDIT, coverSrc, getBook } from "@/lib/data/books";

export const dynamicParams = false;

export function generateStaticParams() {
  return BOOKS.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: PageProps<"/story/books/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const b = getBook(slug);
  if (!b) return {};
  return {
    title: `${b.numeral}. ${b.title}`,
    description: `${b.title} (${b.published}), book ${b.numeral} of the Red Rising Saga: ${b.subtitle}. ${b.premise[0]}`,
    alternates: { canonical: "./" },
    openGraph: { title: `${b.title} | The Red Rising Archive`, description: b.premise[0] },
  };
}

export default async function BookPage({ params }: PageProps<"/story/books/[slug]">) {
  const { slug } = await params;
  const book = getBook(slug);
  if (!book) notFound();
  const idx = BOOKS.findIndex((b) => b.slug === slug);
  const prev = BOOKS[idx - 1];
  const next = BOOKS[idx + 1];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    author: { "@type": "Person", name: "Pierce Brown" },
    datePublished: String(book.published),
    isPartOf: { "@type": "BookSeries", name: "Red Rising Saga" },
    position: book.n,
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="relative overflow-hidden px-5 pt-[calc(var(--nav-h)+4rem)] pb-20 md:px-8 md:pt-[calc(var(--nav-h)+6rem)] md:pb-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_15%_20%,rgba(122,15,23,0.25),transparent_70%)]" />
        <div className="relative mx-auto grid max-w-[1400px] gap-12 md:grid-cols-[8fr_4fr] md:items-end">
          <div>
          <nav aria-label="Breadcrumb" className="font-mono text-meta tracking-[0.18em] text-ash-2 uppercase">
            <Link href="/story/" className="hover:text-bone">The Story</Link>
            <span aria-hidden> / </span>
            <span>Book {book.numeral}</span>
          </nav>
          <h1 className="mt-6 font-display text-h1 leading-[0.85] font-extrabold tracking-tight uppercase">{book.title}</h1>
          <p className="mt-4 font-serif text-h3 text-red italic">{book.subtitle}</p>
          <dl className="mt-12 grid max-w-3xl grid-cols-2 gap-6 md:grid-cols-3">
            <div>
              <dt className="font-mono text-meta tracking-[0.18em] text-ash-2 uppercase">Published</dt>
              <dd className="mt-1 text-bone">{book.published}</dd>
            </div>
            <div>
              <dt className="font-mono text-meta tracking-[0.18em] text-ash-2 uppercase">Told by</dt>
              <dd className="mt-1 text-bone">{book.narrators.join(", ")}</dd>
            </div>
            <div className="col-span-2 md:col-span-1">
              <dt className="font-mono text-meta tracking-[0.18em] text-ash-2 uppercase">Where</dt>
              <dd className="mt-1 text-bone">{book.settings.join(", ")}</dd>
            </div>
          </dl>
          </div>
          <figure className="mx-auto w-full max-w-[360px] md:mx-0 md:justify-self-end">
            <Plate src={coverSrc(book.slug)} alt={`Cover of ${book.title} by Pierce Brown.`} width={900} height={1350} priority className="border border-line" sizes="(min-width: 768px) 30vw, 80vw" />
            <figcaption className="mt-3 font-mono text-meta tracking-[0.18em] text-ash-2 uppercase">{COVER_CREDIT}</figcaption>
          </figure>
        </div>
      </header>

      <section aria-label="Premise" className="border-t border-line px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-[1400px]">
          <SpoilerGate book={book.n - 1}>
            <div className="grid gap-10 md:grid-cols-[7fr_5fr] md:items-end md:gap-16">
              <Reveal>
                <p className="max-w-[18ch] font-display text-h2 leading-[0.92] font-bold uppercase">{book.premise[0]}</p>
              </Reveal>
              <Reveal delay={0.08} className="space-y-4">
                {book.premise.slice(1).map((line, i) => (
                  <p key={i} className="max-w-[44ch] text-lede text-bone/85">
                    {line}
                  </p>
                ))}
              </Reveal>
            </div>
          </SpoilerGate>
        </div>
      </section>

      <section aria-label="The chapter in history" className="px-5 pb-20 md:px-8 md:pb-28">
        <div className="mx-auto grid max-w-[1400px] gap-12 md:grid-cols-[3fr_9fr]">
          <p className="font-mono text-meta tracking-[0.18em] text-ash-2 uppercase md:pt-2">What happens</p>
          <SpoilerGate book={book.n}>
            <div className="space-y-12">
              {book.chapters.map((para, i) => (
                <Reveal key={i} className="max-w-[60ch] space-y-5">
                  {para.map((line, j) => (
                    <p key={j} className={j === 0 && para.length > 1 ? "text-lede text-bone" : "text-lede text-bone/80"}>
                      {line}
                    </p>
                  ))}
                </Reveal>
              ))}
              <Reveal>
                <blockquote className="border-l-2 border-red pl-6 font-serif text-h3 leading-snug text-bone italic">
                  {book.closing}
                </blockquote>
              </Reveal>
            </div>
          </SpoilerGate>
        </div>
      </section>

      <section aria-label="Archive record" className="border-t border-line px-5 py-20 md:px-8">
        <div className="mx-auto grid max-w-[1400px] gap-14 md:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-bold uppercase">Archive themes</h2>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3" role="list">
              {book.themes.map((t) => (
                <li key={t} className="font-serif text-2xl text-bone/90 italic">
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold uppercase">Key memories</h2>
            <SpoilerGate book={book.n} compact className="mt-6">
              <ul className="mt-6 grid grid-cols-2 hairline" role="list">
                {book.memories.map((m) => (
                  <li key={m} className="bg-void px-4 py-3 text-sm text-ash">
                    {m}
                  </li>
                ))}
              </ul>
            </SpoilerGate>
          </div>
        </div>
      </section>

      <nav aria-label="Other books" className="grid border-t border-line md:grid-cols-2">
        {prev ? (
          <Link href={`/story/books/${prev.slug}/`} className="group border-line p-8 wash-card md:border-r md:p-12">
            <span className="font-mono text-meta tracking-[0.18em] text-ash-2 uppercase">Previous, book {prev.numeral}</span>
            <span className="mt-2 block font-display text-h3 font-bold uppercase group-hover:text-red">{prev.title}</span>
            <CardWash />
          </Link>
        ) : (
          <Link href="/story/timeline/" className="group border-line p-8 wash-card md:border-r md:p-12">
            <span className="font-mono text-meta tracking-[0.18em] text-ash-2 uppercase">Before the books</span>
            <span className="mt-2 block font-display text-h3 font-bold uppercase group-hover:text-red">The Timeline</span>
            <CardWash />
          </Link>
        )}
        {next ? (
          <Link href={`/story/books/${next.slug}/`} className="group p-8 text-right wash-card md:p-12">
            <span className="font-mono text-meta tracking-[0.18em] text-ash-2 uppercase">Next, book {next.numeral}</span>
            <span className="mt-2 block font-display text-h3 font-bold uppercase group-hover:text-red">{next.title}</span>
            <CardWash />
          </Link>
        ) : (
          <div className="p-8 text-right md:p-12">
            <span className="font-mono text-meta tracking-[0.18em] text-ash-2 uppercase">Next, book VII</span>
            <span className="mt-2 block font-display text-h3 font-bold text-ash-2 uppercase">Red God. Archive sealed.</span>
          </div>
        )}
      </nav>
    </article>
  );
}
