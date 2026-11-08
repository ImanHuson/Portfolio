import type { NextConfig } from "next";

// Static export served under the repo's GitHub Pages site, assembled with the
// other builds by .github/workflows/pages.yml. No server: content is data in
// lib/content, search runs in the browser over a prebuilt index.
const basePath = "/Portfolio/terrarum";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
