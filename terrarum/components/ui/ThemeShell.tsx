import { themeFor, themeStyle } from "@/lib/themes";

/** Puts a country's identity on everything inside it: tokens for both colour
 * schemes (or one held scheme), its display face, texture and ground. Pages
 * never branch on country. */
export function ThemeShell({ country, children }: { country: string; children: React.ReactNode }) {
  const theme = themeFor(country);
  if (!theme) return <>{children}</>;
  return (
    <div
      data-theme={theme.id}
      data-display={theme.display}
      data-motif={theme.motif}
      data-gallery={theme.gallery}
      data-heading={theme.heading}
      data-ground={theme.ground}
      data-scheme={theme.scheme}
      style={themeStyle(theme)}
      className="min-h-dvh"
    >
      {/* A fixed atmosphere behind everything: light and depth instead of a flat colour. */}
      {theme.ground !== "plain" && <div className="atmos" aria-hidden />}
      {children}
    </div>
  );
}
