import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-line bg-void">
      {/* pb leaves room for the fixed sealed-passages notice */}
      <div className="mx-auto grid max-w-[1400px] gap-10 px-5 pt-16 pb-28 md:grid-cols-[2fr_1fr_1fr] md:px-8">
        <div>
          <p className="font-display text-3xl font-bold tracking-tight uppercase">The Red Rising Archive</p>
          <p className="mt-4 max-w-[52ch] text-sm text-ash">
            An unofficial fan archive. Red Rising, its characters and its world belong to Pierce Brown and his publishers. Plot facts here were checked against published sources; interpretation is marked as the archivist&rsquo;s own. Every image is an archive plate rendered for this site, not published artwork.
          </p>
        </div>
        <nav aria-label="Footer">
          <p className="font-mono text-meta tracking-[0.18em] text-ash-2 uppercase">The Archive</p>
          <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <li><Link className="text-ash hover:text-bone" href="/">Opening</Link></li>
            <li><Link className="text-ash hover:text-bone" href="/story/">The Story</Link></li>
            <li><Link className="text-ash hover:text-bone" href="/people/">The People</Link></li>
            <li><Link className="text-ash hover:text-bone" href="/world/">The World</Link></li>
            <li><Link className="text-ash hover:text-bone" href="/ideas/">The Ideas</Link></li>
            <li><Link className="text-ash hover:text-bone" href="/fandom/">The Fandom</Link></li>
            <li><Link className="text-ash hover:text-bone" href="/author/">The Author</Link></li>
            <li><Link className="text-ash hover:text-bone" href="/sealed/">The Sealed File</Link></li>
            <li><Link className="text-ash hover:text-bone" href="/what-survives/">What survives</Link></li>
          </ul>
        </nav>
        <div>
          <p className="font-mono text-meta tracking-[0.18em] text-ash-2 uppercase">Official</p>
          <ul className="mt-4 grid gap-2 text-sm">
            <li>
              <a className="text-ash hover:text-bone" href="https://www.piercebrown.com/" target="_blank" rel="noopener noreferrer">
                Pierce Brown&rsquo;s site
              </a>
            </li>
            <li>
              <Link className="text-ash hover:text-bone" href="/author/sources/">
                Sources this archive uses
              </Link>
            </li>
            <li>
              <a className="text-ash hover:text-bone" href="/Portfolio/">
                Portfolio home
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
