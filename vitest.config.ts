/// <reference types="vitest/config" />
import { getViteConfig } from "astro/config";

// Unit tests for the React building blocks, run in jsdom with Astro's Vite setup (CSS modules, JSX).
export default getViteConfig({
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}"],
    setupFiles: ["./src/test/setup.ts"],
    css: { modules: { classNameStrategy: "non-scoped" } },
  },
});
