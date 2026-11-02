import type { StorybookConfig } from "@storybook/react-vite";

// Storybook renders the components in isolation. The characters and screenshots used in stories are the
// portfolio's own images, served from the app's public folder.
const config: StorybookConfig = {
  framework: "@storybook/react-vite",
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  staticDirs: [{ from: "../../../apps/portfolio/public/assets", to: "/assets" }],
  core: { disableTelemetry: true },
  // Only those images are needed; don't let Vite copy a public folder of its own.
  viteFinal: (viteConfig) => ({ ...viteConfig, publicDir: false }),
};

export default config;
