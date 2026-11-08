import { themeFor, themeStyle } from "@/lib/themes";

/** Puts a country's identity on everything inside it: tokens for both colour
 * schemes, its display face and its texture. Pages never branch on country. */
export function ThemeShell({ country, children }: { country: string; children: React.ReactNode }) {
  const theme = themeFor(country);
  if (!theme) return <>{children}</>;
  return (
    <div data-theme={theme.id} data-display={theme.display} data-motif={theme.motif} style={themeStyle(theme)} className="min-h-dvh">
      {children}
    </div>
  );
}
