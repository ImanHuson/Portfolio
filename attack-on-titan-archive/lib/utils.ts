import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Custom type-scale names (globals.css @theme) must be registered, or
// tailwind-merge reads `text-h1` as a colour and lets `text-lg` win.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["meta", "body", "lede", "h3", "h2", "h1", "colossal"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const asset = (p: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${p}`;
