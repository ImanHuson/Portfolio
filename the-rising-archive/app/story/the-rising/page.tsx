import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/typography/PageHeader";
import RisingStack from "@/components/sections/RisingStack";
import Reveal from "@/components/archive/Reveal";

export const metadata: Metadata = {
  title: "The Rising",
  description: "The Rising in Red Rising: not an organization but a movement, a war, a myth, and eventually a government.",
  alternates: { canonical: "./" },
};

export default function RisingPage() {
  return (
    <>
      <PageHeader
        trail={[{ href: "/story/", label: "The Story" }, { href: "/story/the-rising/", label: "The Rising" }]}
        title="The Rising"
        lede="Not an organization. It changes shape four times, and each shape is harder to hold than the last."
      />
      <RisingStack />
      <section aria-label="The question" className="px-5 py-40 md:px-8">
        <Reveal className="mx-auto max-w-[1100px] text-center">
          <p className="font-serif text-h2 leading-tight text-bone italic">
            Can revolution become government without becoming the thing it replaced?
          </p>
          <Link
            href="/story/timeline/"
            className="mt-12 inline-block border-b border-red pb-1 font-mono text-meta tracking-[0.2em] uppercase hover:text-red"
          >
            Follow it on the timeline
          </Link>
        </Reveal>
      </section>
    </>
  );
}
