import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  {
    // Static export with images.unoptimized: next/image would add nothing but
    // a wrapper, and it does not prefix basePath on src. Plain <img> with
    // explicit width/height (no layout shift) is the deliberate choice here.
    rules: { "@next/next/no-img-element": "off" },
  },
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Offline art scripts (three.js / Pillow renders), not app code.
    "scripts/**",
  ]),
]);

export default eslintConfig;
