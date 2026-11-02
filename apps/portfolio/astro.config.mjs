import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import { defineConfig } from "astro/config";

// The host serves dist/client (at the repo root) as static assets and dist/server/index.js as the worker
// (see scripts/build-site.mjs). Storybook is built into dist/client/storybook alongside.
export default defineConfig({
  site: "https://tetiana-dovgalenko-portfolio.fairyorbit11.chatgpt.site",
  outDir: "../../dist/client",
  integrations: [react(), mdx()],
  devToolbar: { enabled: false },
  // The design system ships TypeScript and CSS modules as source, so Vite compiles it for the server render too.
  vite: { ssr: { noExternal: ["@tetiana/ui"] } },
});
