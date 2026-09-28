import type { Metadata, Viewport } from "next";
import { Barlow, Barlow_Condensed, IBM_Plex_Mono, Playfair_Display } from "next/font/google";
import SmoothScroll from "@/components/providers/SmoothScroll";
import SiteNav from "@/components/navigation/SiteNav";
import SiteFooter from "@/components/navigation/SiteFooter";
import "./globals.css";

// Three typographic personalities (brief section 03):
//   Playfair Display: high-contrast editorial serif, historical not futuristic.
//     THE WALLS / THE RUMBLING / PATHS. The brief names a serif for display,
//     and the register is a recovered historical document: the one case the
//     taste skill allows it. (Cormorant was used by the-rising-archive; not reused.)
//   Barlow Condensed: the military voice. YEAR 845 / WALL MARIA / RESTRICTED.
//   IBM Plex Mono: typewritten reports, coordinates, archive IDs.
//   Barlow (regular width) for reading text.
const display = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "800"],
  style: ["normal", "italic"],
  variable: "--font-display-face",
});
const military = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-military-face",
});
const sans = Barlow({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-sans-face" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono-face" });

const SITE = "https://imanhuson.github.io/Portfolio/attack-on-titan-archive";

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE}/`),
  title: {
    default: "Attack on Titan: The Archive",
    template: "%s | Attack on Titan: The Archive",
  },
  description:
    "An unofficial fan archive of Hajime Isayama's Attack on Titan: the Walls, the soldiers, the Titans, Marley, the Rumbling and Paths, recovered as military records.",
  openGraph: {
    type: "website",
    siteName: "Attack on Titan: The Archive",
    title: "Attack on Titan: The Archive",
    description: "Humanity lived behind the Walls for one hundred years. It took one day to destroy the illusion.",
    url: `${SITE}/`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Attack on Titan: The Archive",
    description: "Humanity lived behind the Walls for one hundred years. It took one day to destroy the illusion.",
  },
  alternates: { canonical: "./" },
};

export const viewport: Viewport = {
  themeColor: "#0b0c0a",
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Attack on Titan: The Archive",
  url: `${SITE}/`,
  description: "An unofficial fan archive of Hajime Isayama's Attack on Titan.",
  about: { "@type": "CreativeWorkSeries", name: "Attack on Titan", author: { "@type": "Person", name: "Hajime Isayama" } },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${military.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-paper focus:px-4 focus:py-2 focus:font-military focus:tracking-[0.2em] focus:text-ink focus:uppercase"
        >
          Skip to content
        </a>
        <noscript>
          <style>{`[data-js-only]{display:none!important}`}</style>
        </noscript>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <SmoothScroll>
          <SiteNav />
          <main id="main">{children}</main>
          <SiteFooter />
        </SmoothScroll>
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
