import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/typography/PageHeader";
import Reveal from "@/components/archive/Reveal";
import { IDEAS } from "@/lib/data/ideas";

export const metadata: Metadata = {
  title: "The Ideas",
  description: "Freedom, power, revolution, honor, legacy and fatherhood: the Red Rising Saga’s themes, each asked as a question.",
  alternates: { canonical: "./" },
};

export default function IdeasPage() {
  return (
    <>
      <PageHeader
        trail={[{ href: "/", label: "Archive" }, { href: "/ideas/", label: "The Ideas" }]}
        title="Six questions the saga won’t stop asking"
        lede="Not a list of themes. Each one is a question, and none of them has a clean answer."
      />
      <section aria-label="The ideas" className="px-5 pb-28 md:px-8">
        <ol role="list" className="mx-auto max-w-[1400px] border-t border-line">
          {IDEAS.map((idea, i) => (
            <Reveal as="li" key={idea.slug} delay={i * 0.03} className="border-b border-line">
              <Link href={`/ideas/${idea.slug}/`} className="group grid gap-3 py-10 md:grid-cols-[18rem_1fr] md:gap-12 md:py-14">
                <span className="font-display text-h2 leading-none font-bold uppercase transition-colors group-hover:text-red">{idea.name}</span>
                <span className="max-w-[48ch] font-serif text-h3 leading-snug text-bone/85 italic">{idea.question}</span>
              </Link>
            </Reveal>
          ))}
        </ol>
        <div className="mx-auto mt-16 max-w-[1400px]">
          <Link href="/what-survives/" className="group inline-block">
            <span className="font-mono text-meta tracking-[0.22em] text-ash-2 uppercase">And after all six</span>
            <span className="mt-2 block font-display text-h3 font-bold uppercase group-hover:text-red">What the war couldn’t kill</span>
          </Link>
        </div>
      </section>
    </>
  );
}
