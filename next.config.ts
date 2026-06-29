import type { NextConfig } from "next";
import path from "node:path";

// Mostly SSG: every content route still prerenders to HTML. We dropped
// `output: "export"` so the app can also serve ONE dynamic serverless route —
// /api/council (the live multi-model planner) — which a pure static export
// can't host. Content pages remain static; only the API route runs on demand.
const nextConfig: NextConfig = {
  images: { unoptimized: true },
  outputFileTracingRoot: path.join(__dirname),
  turbopack: { root: path.join(__dirname) },
};

export default nextConfig;
