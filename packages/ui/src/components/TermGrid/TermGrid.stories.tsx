import type { Meta, StoryObj } from "@storybook/react-vite";
import { TermGrid } from "./TermGrid";

const meta = {
  title: "Case/TermGrid",
  component: TermGrid,
  parameters: { layout: "fullscreen" },
  args: {
    items: [
      { term: "Jurisdiction-specific fields", detail: "Conditional requirements" },
      { term: "Lapse deadlines", detail: "Time-sensitive visibility" },
      { term: "Paper file requests", detail: "Alternate workflow path" },
      { term: "Multi-page addenda", detail: "Scalable document structure" },
      { term: "Conditional fields", detail: "Progressive disclosure" },
      { term: "UCC3 / UCC5", detail: "State-dependent follow-on filing" },
    ],
  },
} satisfies Meta<typeof TermGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EdgeCases: Story = {};
