import type { Metadata, Viewport } from "next";
import { Barlow, Barlow_Condensed, Cinzel, Courier_Prime, IM_Fell_English } from "next/font/google";
import SmoothScroll from "@/components/providers/SmoothScroll";
import SiteNav from "@/components/navigation/SiteNav";
import SiteFooter from "@/components/navigation/SiteFooter";
import "./globals.css";

// Typography, matched to the show's own lettering (brief section 03):
//   Cinzel: Roman inscription capitals, chiselled and monumental, the nearest
//     open font to the series' title lettering. THE WALLS / THE RUMBLING.
//     A faint ink-bleed filter (.ink in globals.css) roughens its edges.
//   IM Fell English: a digitised 17th-century type with real print wear, for
//     italic ledes and quotations: the voice of the historical record.
//   Barlow Condensed: the military voice. YEAR 845 / WALL MARIA / RESTRICTED.
//   Courier Prime: the typewriter, for reports, coordinates, archive IDs.
//   Barlow (regular width) for reading text.
const display = Cinzel({ subsets: ["latin"], weight: ["600", "700", "900"], variable: "--font-display-face" });
const serif = IM_Fell_English({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-serif-face" });
const military = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-military-face",
});
const sans = Barlow({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-sans-face" });
const mono = Courier_Prime({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-mono-face" });

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
    <html lang="en" className={`${display.variable} ${serif.variable} ${military.variable} ${sans.variable} ${mono.variable}`}>
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
        {/* ink bleed for display type: a whisper of displacement so the
            chiselled capitals read as printed, not rendered */}
        <svg aria-hidden width="0" height="0" className="absolute">
          <filter id="ink" x="-2%" y="-10%" width="104%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="2.2" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>
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
