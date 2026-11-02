import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checklist } from "./Checklist";

const meta = {
  title: "Case/Checklist",
  component: Checklist,
  parameters: { layout: "fullscreen" },
  args: {
    items: [
      { title: "Show the source", detail: "People can see which signal an entry came from." },
      { title: "Warm foundation", tag: "#F5F2EC", detail: "Parchment and Urbanist soften an administrative workflow." },
      { title: "Require human confirmation", detail: "Submission stays an explicit user action." },
    ],
  },
  argTypes: { marker: { control: "inline-radio", options: ["check", "number"] } },
} satisfies Meta<typeof Checklist>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Principles: Story = {};

export const Outcomes: Story = { args: { marker: "number" } };
