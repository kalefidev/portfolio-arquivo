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
      // Phosphor `fill` icons are imported as SVG source text (src/three/archetypes/icons.ts).
      "*-fill.svg": { type: "raw" },
      // …and so are the `regular` ones the UI inlines (IndexMenu, SettingsPanel, archetypeIcons).
      "**/assets/regular/*.svg": { type: "raw" },
    },
  },
};

export default nextConfig;
