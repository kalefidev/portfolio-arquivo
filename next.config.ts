import type { NextConfig } from "next";

// Keep compatible with `output: 'export'`: no API routes, server actions or server data.
// (Scaffold's cacheComponents / partialPrefetching removed: not in the stack, not needed.)
const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
