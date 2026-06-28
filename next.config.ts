import type { NextConfig } from "next";
import path from "node:path";

// Static export: pure SSG, no server, no DB. Every route prerenders to HTML so the
// catalogue can be hosted anywhere (Vercel, GitHub Pages, an S3 bucket).
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  // This app lives inside the merch-buying-desk repo for now. Pin the workspace root
  // so Next/Turbopack don't walk up and adopt the parent app's lockfile/config.
  outputFileTracingRoot: path.join(__dirname),
  turbopack: { root: path.join(__dirname) },
};

export default nextConfig;
