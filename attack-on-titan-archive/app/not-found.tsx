import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[100dvh] items-end px-4 pt-[var(--nav-h)] pb-20 md:px-8">
      <div className="mx-auto w-full max-w-[1400px]">
        <p className="font-mono text-meta text-ash">No file at this address</p>
        <h1 className="mt-4 font-display text-h1 leading-[0.92] font-extrabold text-paper uppercase">Name not recorded</h1>
        <p className="mt-6 max-w-[48ch] font-serif text-lede text-paper/85 italic">This page was lost, or never filed. The ten chapters are all still here.</p>
        <Link
          href="/#index"
          className="press mt-10 inline-flex items-center gap-3 border border-paper/50 px-5 py-3 font-military text-[1rem] tracking-[0.18em] text-paper uppercase hover:border-paper hover:bg-paper hover:text-ink"
        >
          Open the chapters
        </Link>
      </div>
    </section>
  );
}
