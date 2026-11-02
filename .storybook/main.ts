import type { StorybookConfig } from "@storybook/react-vite";

// Storybook renders the React building blocks in isolation. Pages and layout stay in Astro.
const config: StorybookConfig = {
  framework: "@storybook/react-vite",
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  staticDirs: [{ from: "../public/assets", to: "/assets" }],
  core: { disableTelemetry: true },
  // Only the character and screenshot images are needed; don't copy the whole site's public folder.
  viteFinal: (viteConfig) => ({ ...viteConfig, publicDir: false }),
};

export default config;
