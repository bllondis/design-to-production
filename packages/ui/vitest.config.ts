import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// Unit tests for the components, run in jsdom. CSS module class names stay readable for assertions.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}"],
    setupFiles: ["./src/test/setup.ts"],
    css: { modules: { classNameStrategy: "non-scoped" } },
  },
});
