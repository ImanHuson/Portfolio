import type { Metadata, Viewport } from "next";
import { Big_Shoulders, Cormorant_Garamond, Geist, Geist_Mono } from "next/font/google";
import SmoothScroll from "@/components/providers/SmoothScroll";
import ArchiveProvider from "@/components/providers/ArchiveProvider";
import SiteNav from "@/components/navigation/SiteNav";
import SiteFooter from "@/components/navigation/SiteFooter";
import "./globals.css";

// Type system: Big Shoulders (industrial, condensed: the Red / mining /
// rebellion voice) for display; Cormorant Garamond only for quotation and
// Gold-register lines (the Society is Roman-aristocratic, which is the one
// case the taste skill allows a serif); Geist for reading; Geist Mono for
// archive metadata and sealed-file stamps.
const display = Big_Shoulders({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-display-face",
  adjustFontFallback: false,
  fallback: ["Impact", "Arial Narrow", "sans-serif"],
});
const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600"], style: ["normal", "italic"], variable: "--font-serif-face" });
const sans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

const SITE = "https://imanhuson.github.io/Portfolio/the-rising-archive";

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE}/`),
  title: {
    default: "The Red Rising Archive",
    template: "%s | The Red Rising Archive",
  },
  description:
    "A personal record of the Rising, the people it made, and the people it broke. An unofficial fan archive of Pierce Brown’s Red Rising Saga.",
  openGraph: {
    type: "website",
    siteName: "The Red Rising Archive",
    title: "The Red Rising Archive",
    description: "Six published novels. One unfinished revolution. A solar system full of ghosts.",
    url: `${SITE}/`,
  },
  twitter: {
    card: "summary",
    title: "The Red Rising Archive",
    description: "Six published novels. One unfinished revolution. A solar system full of ghosts.",
  },
  alternates: { canonical: "./" },
};

export const viewport: Viewport = {
  themeColor: "#07070a",
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "The Red Rising Archive",
  url: `${SITE}/`,
  description: "An unofficial fan archive of Pierce Brown’s Red Rising Saga.",
  about: { "@type": "BookSeries", name: "Red Rising Saga", author: { "@type": "Person", name: "Pierce Brown" } },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${serif.variable} ${sans.variable} ${mono.variable}`}
    >
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-bone focus:px-4 focus:py-2 focus:font-mono focus:text-meta focus:text-void focus:uppercase"
        >
          Skip to content
        </a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <SmoothScroll>
          <ArchiveProvider>
            <SiteNav />
            <main id="main">{children}</main>
            <SiteFooter />
          </ArchiveProvider>
        </SmoothScroll>
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
