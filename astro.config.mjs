import { defineConfig } from "astro/config";

// The host serves dist/client as static assets and dist/server/index.js as the worker
// (see scripts/build-site.mjs), so Astro writes its static output into dist/client.
export default defineConfig({
  site: "https://tetiana-dovgalenko-portfolio.fairyorbit11.chatgpt.site",
  outDir: "./dist/client",
  devToolbar: { enabled: false },
});
