import Reveal from "@/components/archive/Reveal";

export default function LiveForMore() {
  return (
    <section id="live-for-more" aria-labelledby="lfm-title" className="relative overflow-hidden px-5 py-32 md:px-8 md:py-48">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_45%,rgba(122,15,23,0.35),transparent_70%)]"
      />
      <div className="relative mx-auto max-w-[1400px] text-center">
        <Reveal>
          <h2 id="lfm-title" className="font-display text-colossal leading-[0.8] font-extrabold tracking-tight uppercase">
            Live <span className="text-red">for</span> more
          </h2>
        </Reveal>
        <Reveal delay={0.1} className="mx-auto mt-14 max-w-[34ch]">
          <p className="font-serif text-h3 leading-snug text-bone italic">
            Not as a slogan.
            <br />
            As a question.
          </p>
          <p className="mt-8 text-lede text-ash">
            What does it actually mean to live for more after everything you loved has been taken from you?
          </p>
          <p className="mt-10 font-mono text-meta tracking-[0.2em] text-ash-2 uppercase">After Eo, Red Rising</p>
        </Reveal>
      </div>
    </section>
  );
}
