import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// The archive's type scale (globals.css @theme) uses custom font-size names.
// Without registering them, tailwind-merge reads `text-h1` as a color and
// lets a component default like `text-lg` win.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["eyebrow", "meta", "body", "lede", "h3", "h2", "h1", "colossal"] }],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
