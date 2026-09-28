export default function SiteFooter() {
  return (
    <footer className="border-t border-line bg-base px-4 py-14 md:px-8">
      <div className="mx-auto grid max-w-[1400px] gap-8 md:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="font-military text-[0.95rem] font-semibold tracking-[0.28em] text-paper uppercase">Attack on Titan: The Archive</p>
          <p className="mt-4 max-w-[62ch] text-[0.95rem] text-ash">
            An unofficial fan archive. Not affiliated with or endorsed by Hajime Isayama, Kodansha, or the anime&apos;s
            production committee. Attack on Titan and all related names are theirs. Scenes on this site are procedural
            renders made for it; any images of characters are used for identification and commentary.
          </p>
        </div>
        <div className="text-[0.95rem] leading-relaxed text-ash md:text-right">
          <p>
            <a href="/Portfolio/" className="inline-block py-1 underline decoration-ash/50 underline-offset-4 transition-colors hover:text-paper">
              Back to the portfolio
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
