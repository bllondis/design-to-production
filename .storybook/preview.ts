import type { Preview } from "@storybook/react-vite";
import "../src/styles/global.css";

const preview: Preview = {
  parameters: {
    layout: "padded",
    backgrounds: {
      options: {
        page: { name: "Page (dark)", value: "#050607" },
        inverse: { name: "Inverse (light)", value: "#f4f5f0" },
      },
    },
    controls: { expanded: true },
    a11y: { test: "error" },
  },
  initialGlobals: {
    backgrounds: { value: "page" },
  },
  tags: ["autodocs"],
};

export default preview;
