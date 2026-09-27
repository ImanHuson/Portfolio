import type { NextConfig } from "next";

// Static export deployed as a subpath of the repo's GitHub Pages site,
// assembled alongside the other builds by .github/workflows/pages.yml.
const basePath = "/Portfolio/the-rising-archive";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
