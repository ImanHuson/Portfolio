import type { Metadata, Viewport } from "next";
import { Archivo, Bricolage_Grotesque, Noto_Sans_Thaana, Schibsted_Grotesk, Shippori_Mincho, Yuji_Syuku } from "next/font/google";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { searchIndex } from "@/lib/content";
import "./globals.css";

const atlas = Schibsted_Grotesk({ subsets: ["latin", "latin-ext"], variable: "--font-atlas", display: "swap" });
// Only downloaded where a page uses it (Japan); not preloaded on the globe.
const mincho = Shippori_Mincho({ weight: ["500", "700"], subsets: ["latin", "latin-ext"], variable: "--font-mincho", display: "swap", preload: false });
// Japanese text in Japan's pages: a brush face drawn from calligraphy.
const brush = Yuji_Syuku({ weight: "400", subsets: ["latin"], variable: "--font-brush", display: "swap", preload: false });
// Maldives: a rounded open grotesque, plus Thaana for the Dhivehi names.
const bricolage = Bricolage_Grotesque({ subsets: ["latin", "latin-ext"], variable: "--font-bricolage", display: "swap", preload: false });
const thaana = Noto_Sans_Thaana({ subsets: ["thaana"], weight: ["400", "600"], variable: "--font-thaana", display: "swap", preload: false });
// Switzerland: a tight grotesque in the Swiss Style tradition.
const archivo = Archivo({ subsets: ["latin", "latin-ext"], variable: "--font-archivo", display: "swap", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL("https://imanhuson.github.io/Portfolio/terrarum/"),
  title: { default: "Terrarum: explore the world from where you are", template: "%s · Terrarum" },
  description:
    "An interactive atlas for people who cannot travel: a globe, real places, licensed photographs and 360° views, with every fact sourced.",
  openGraph: { type: "website", siteName: "Terrarum", images: [{ url: "og.png", width: 1200, height: 630, alt: "Terrarum: a globe turned toward Asia with Japan marked, beside the line See the world from where you are." }] },
};

export const viewport: Viewport = { themeColor: "#0d1014", colorScheme: "dark light" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const index = searchIndex();
  return (
    <html lang="en" className={`${atlas.variable} ${mincho.variable} ${brush.variable} ${bricolage.variable} ${thaana.variable} ${archivo.variable}`}>
      <head>
        <link rel="preconnect" href="https://thumb.wikimedia.org" />
      </head>
      <body className="min-h-dvh antialiased">
        {/* If a photo hosted on Wikimedia Commons fails to load, swap in the
            site's own small copy (scripts/media/fallbacks.py). */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "addEventListener('error',function(e){var t=e.target;if(t&&t.tagName==='IMG'&&t.dataset.fallback&&t.getAttribute('src')!==t.dataset.fallback){t.removeAttribute('srcset');t.src=t.dataset.fallback}},true)",
          }}
        />
        <noscript>
          <style>{`[data-js-only]{display:none!important}`}</style>
        </noscript>
        {/* Sumi: the faint feathering of ink soaking into paper, for brush-written Japanese. */}
        <svg width="0" height="0" aria-hidden focusable="false" style={{ position: "absolute" }}>
          <filter id="sumi" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="2.2" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>
        <a className="skip-link" href="#main">Skip to content</a>
        <SiteHeader index={index} />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
