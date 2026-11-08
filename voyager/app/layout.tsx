import type { Metadata, Viewport } from "next";
import { Schibsted_Grotesk, Shippori_Mincho } from "next/font/google";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { searchIndex } from "@/lib/content";
import "./globals.css";

const atlas = Schibsted_Grotesk({ subsets: ["latin", "latin-ext"], variable: "--font-atlas", display: "swap" });
// Only downloaded where a page uses it (Japan); not preloaded on the globe.
const mincho = Shippori_Mincho({ weight: ["500", "700"], subsets: ["latin", "latin-ext"], variable: "--font-mincho", display: "swap", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL("https://imanhuson.github.io/Portfolio/voyager/"),
  title: { default: "Voyager: explore the world from where you are", template: "%s · Voyager" },
  description:
    "An interactive atlas for people who cannot travel: a globe, real places, licensed photographs and 360° views, with every fact sourced.",
  openGraph: { type: "website", siteName: "Voyager", images: [{ url: "og.png", width: 1200, height: 630, alt: "Voyager: a globe turned toward Asia with Japan marked, beside the line See the world from where you are." }] },
};

export const viewport: Viewport = { themeColor: "#0d1014", colorScheme: "dark light" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const index = searchIndex();
  return (
    <html lang="en" className={`${atlas.variable} ${mincho.variable}`}>
      <body className="min-h-dvh antialiased">
        <noscript>
          <style>{`[data-js-only]{display:none!important}`}</style>
        </noscript>
        <a className="skip-link" href="#main">Skip to content</a>
        <SiteHeader index={index} />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
