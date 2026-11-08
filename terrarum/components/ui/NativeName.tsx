import { themeFor } from "@/lib/themes";
import type { CountryEntry } from "@/lib/content/types";

/**
 * A place's name in the country's own language, set the way that language is
 * set: vertically for Japanese, right to left for Thaana, or as a stack where a
 * country has several official names. Decorative beside the English heading,
 * so hidden from screen readers (the heading says the name).
 */
export function NativeName({ text, entry, size = "lg", className = "" }: { text?: string; entry: CountryEntry; size?: "lg" | "md"; className?: string }) {
  if (!text) return null;
  const mode = themeFor(entry.slug)?.native ?? "inline";
  const langs = (entry.nativeLang ?? "").split(" ");
  if (mode === "vertical") {
    return (
      <p className={`tategaki font-display text-accent ${size === "lg" ? "text-6xl md:text-8xl" : "text-5xl md:text-7xl"} ${className}`} lang={langs[0]} aria-hidden>
        {text}
      </p>
    );
  }
  if (mode === "stack") {
    return (
      <ul className={`font-display leading-[1.05] tracking-tight ${size === "lg" ? "text-3xl md:text-5xl" : "text-2xl md:text-4xl"} ${className}`} aria-hidden>
        {text.split(" / ").map((t, i) => (
          <li key={t} lang={langs[i] ?? langs[0]} className={i === 0 ? "text-accent" : "text-muted"}>
            {t}
          </li>
        ))}
      </ul>
    );
  }
  return (
    <p
      className={`native-script text-accent ${size === "lg" ? "text-5xl md:text-7xl" : "text-4xl md:text-6xl"} ${className}`}
      lang={langs[0]}
      dir={entry.nativeDir ?? "auto"}
      aria-hidden
    >
      {text}
    </p>
  );
}
