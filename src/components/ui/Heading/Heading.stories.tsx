import type { Meta, StoryObj } from "@storybook/react-vite";
import { Heading } from "./Heading";

const meta = {
  title: "Components/Heading",
  component: Heading,
  args: { text: "Design Systems", size: "display-4", as: "h3" },
  argTypes: {
    size: { control: "select", options: ["display-1", "display-2", "display-3", "display-4", "heading-1"] },
    as: { control: "inline-radio", options: ["h1", "h2", "h3", "h4"] },
    tone: { control: "inline-radio", options: ["default", "inverse"] },
  },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Capability: Story = {};

export const Chapter: Story = {
  args: { text: "AI Design Engineering", size: "display-2", as: "h2", measure: 9.5 },
};

export const WithoutPixels: Story = {
  args: {
    text: "Make the model clear before making the screen polished.",
    size: "display-3",
    pixel: false,
    measure: 10,
  },
};

export const Inverse: Story = {
  args: { text: "Have a complex system that needs to feel simple?", size: "heading-1", tone: "inverse", measure: 14 },
  globals: { backgrounds: { value: "inverse" } },
};

export const Scale: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "2rem" }}>
      {(["display-1", "display-2", "display-3", "display-4", "heading-1"] as const).map((size) => (
        <Heading key={size} as="h2" size={size} text={`Calm systems / ${size}`} animate={false} />
      ))}
    </div>
  ),
};
