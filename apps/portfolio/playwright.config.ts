import { defineConfig, devices } from "@playwright/test";

// End-to-end checks against the built site (run `npm run build` at the repo root first; `npm run test:e2e` there does both).
// Visual snapshots are tagged @visual: baselines are per-OS, so CI runs the rest with --grep-invert @visual.
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:4322",
    // Still frames make canvases and pixel headings deterministic for snapshots.
    reducedMotion: "reduce",
  },
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.01 } },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: "node scripts/serve-dist.mjs",
    url: "http://localhost:4322",
    reuseExistingServer: !process.env.CI,
  },
});
