import type { Metadata } from "next";
import PageHeader from "@/components/typography/PageHeader";
import FramedPortrait from "@/components/archive/FramedPortrait";
import { COMICS } from "@/lib/data/author";

export const metadata: Metadata = {
  title: "Sons of Ares",
  description: "Red Rising: Sons of Ares, the in-continuity comic about the founding of the revolution and Fitchner au Barca.",
  alternates: { canonical: "./" },
};

export default function SonsOfAresPage() {
  const c = COMICS[0];
  return (
    <>
      <PageHeader
        trail={[{ href: "/", label: "Archive" }, { href: "/author/", label: "The Author" }, { href: "/author/sons-of-ares/", label: "Sons of Ares" }]}
        title="Before Darrow"
        lede={c.title}
      />
      <section aria-label="The comic" className="border-t border-line px-5 py-20 md:px-8">
        <div className="mx-auto grid max-w-[1400px] gap-12 md:grid-cols-[7fr_5fr] md:items-start">
          <div className="max-w-[60ch] space-y-6">
            <p className="font-mono text-meta tracking-[0.18em] text-ash uppercase">{c.detail}</p>
            <p className="text-lede text-bone/85">{c.body}</p>
            <p className="text-ash">
              Where the novels start with the revolution already underground, this is the underground being dug.
            </p>
          </div>
          <figure>
            <FramedPortrait slug="fitchner" name="Fitchner au Barca" size="hero" sizes="(min-width: 768px) 30vw, 80vw" />
            <figcaption className="mt-3 font-mono text-meta tracking-[0.16em] text-ash uppercase">Fitchner, the comic’s centre. Fan art, not the comic’s.</figcaption>
          </figure>
        </div>
      </section>
    </>
  );
}
