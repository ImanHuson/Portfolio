import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#2a313a] bg-[#0d1014] text-[#9aa1a8]">
      <div className="mx-auto grid max-w-[1400px] gap-6 px-4 py-10 text-sm md:grid-cols-[2fr_1fr] md:px-8">
        <p className="max-w-[60ch]">
          Terrarum is a personal, non-commercial project. Every fact links to its source and every image to its
          creator and licence. Country shapes from Natural Earth; maps © OpenStreetMap contributors.
        </p>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 md:justify-end">
          <li><Link href="/saved/" className="hover:text-white">Saved places</Link></li>
          <li><Link href="/sources/" className="hover:text-white">Sources and credits</Link></li>
          <li><Link href="/method/" className="hover:text-white">How this is made</Link></li>
          <li><a href="https://imanhuson.github.io/Portfolio/" className="hover:text-white">Portfolio</a></li>
        </ul>
      </div>
    </footer>
  );
}
