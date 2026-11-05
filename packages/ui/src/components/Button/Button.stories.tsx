import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./Button";

const meta = {
  title: "Components/Button",
  component: Button,
  args: { href: "#", children: "See it in Timeflow" },
  argTypes: {
    variant: { control: "inline-radio", options: ["light", "dark", "text"] },
    size: { control: "inline-radio", options: ["m", "s"] },
    icon: { control: "inline-radio", options: ["↗", "↓", ""] },
    // Docgen drops props that live in a union, so these two are described here.
    external: {
      description: "Opens in a new tab with safe rel attributes.",
      control: "boolean",
      table: { type: { summary: "boolean" }, defaultValue: { summary: "false" } },
    },
    popoverTarget: {
      description: "Id of a popover to open: renders a real button instead of a link. Use it instead of href.",
      control: "text",
      table: { type: { summary: "string" } },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Light: Story = {};

export const Dark: Story = {
  args: { variant: "dark", size: "s", children: "Get in touch" },
  globals: { backgrounds: { value: "inverse" } },
};

export const Text: Story = {
  args: { variant: "text", external: true, children: "Open live product" },
};

export const Download: Story = {
  args: { icon: "↓", children: "Download CV" },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "2rem", alignItems: "center", flexWrap: "wrap" }}>
      <Button href="#">Light, m</Button>
      <Button href="#" size="s">
        Light, s
      </Button>
      <Button href="#" variant="text">
        Text
      </Button>
      <div style={{ padding: "2rem", background: "var(--color-surface-inverse)" }}>
        <Button href="#" variant="dark">
          Dark, m
        </Button>
      </div>
    </div>
  ),
};
