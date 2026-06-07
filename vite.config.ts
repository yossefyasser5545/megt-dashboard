// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).

import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: {
      // SSR entry file (must exist in /src/server.ts or /server.ts depending on your project)
      entry: "server",
    },
  },

  vite: {
    // Cloudflare-friendly optimizations (safe overrides only)
    ssr: {
      noExternal: ["@tanstack/start"],
    },

    build: {
      sourcemap: true,
    },
  },
});