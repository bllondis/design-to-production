import type { Meta, StoryObj } from "@storybook/react-vite";
import { InfoCard } from "./InfoCard";

const meta = {
  title: "Case/InfoCard",
  component: InfoCard,
  args: {
    label: "Guided Wizard",
    title: "Structure when confidence needs support",
    children: "For users who benefit from additional structure and guidance.",
    items: ["Contextual instructions", "Progressive disclosure", "Save as draft"],
  },
  decorators: [
    (Story) => <div style={{ maxWidth: "36rem", border: "1px solid var(--color-border-default)" }}>{Story()}</div>,
  ],
} satisfies Meta<typeof InfoCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithList: Story = {};

export const Learning: Story = {
  args: {
    label: undefined,
    items: undefined,
    title: "Model the system before the screens",
    children: "Formalise states, conditional rules, warnings and available actions as a shared artifact.",
  },
};
