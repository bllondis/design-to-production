import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import { defineConfig } from "astro/config";
import { baseLinks } from "./scripts/base-links.mjs";

// GitHub Pages serves dist/client (at the repo root) from a subfolder: the deploy workflow sets SITE_BASE, while local
// dev and tests run at the root. Storybook is built into dist/client/storybook alongside.
export default defineConfig({
  site: "https://bllondis.github.io",
  base: process.env.SITE_BASE,
  outDir: "../../dist/client",
  integrations: [react(), mdx(), baseLinks()],
  devToolbar: { enabled: false },
  // The design system ships TypeScript and CSS modules as source, so Vite compiles it for the server render too.
  vite: { ssr: { noExternal: ["@tetiana/ui"] } },
});
