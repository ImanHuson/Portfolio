import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-line bg-void">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-16 md:grid-cols-[2fr_1fr_1fr] md:px-8">
        <div>
          <p className="font-display text-3xl font-bold tracking-tight uppercase">The Red Rising Archive</p>
          <p className="mt-4 max-w-[52ch] text-sm text-ash">
            An unofficial fan archive. Red Rising, its characters and its world belong to Pierce Brown and his publishers. Plot facts here were checked against published sources; interpretation is marked as the archivist&rsquo;s own.
          </p>
        </div>
        <nav aria-label="Footer">
          <p className="font-mono text-meta tracking-[0.18em] text-ash-2 uppercase">The Archive</p>
          <ul className="mt-4 grid gap-2 text-sm">
            <li><Link className="text-ash hover:text-bone" href="/">Opening</Link></li>
            <li><Link className="text-ash hover:text-bone" href="/story/">The Story</Link></li>
            <li><Link className="text-ash hover:text-bone" href="/story/timeline/">Timeline</Link></li>
            <li><Link className="text-ash hover:text-bone" href="/people/">The People</Link></li>
            <li><Link className="text-ash hover:text-bone" href="/people/the-vale/">The Vale</Link></li>
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
