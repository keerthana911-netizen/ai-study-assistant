import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets CI or a local verification run use an isolated output directory.
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
