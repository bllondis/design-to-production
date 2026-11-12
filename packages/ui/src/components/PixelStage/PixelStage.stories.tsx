import type { Meta, StoryObj } from "@storybook/react-vite";
import { PixelStage } from "./PixelStage";

const meta = {
  title: "Components/PixelStage",
  component: PixelStage,
  args: {
    character: "/assets/pixel-cat.jpg",
    motion: { kind: "walk", sprite: "/assets/pixel-cat-walk.png" },
    hint: "Tap a door",
  },
  decorators: [
    (Story) => (
      <div style={{ width: "min(100%, 42rem)", borderInline: "1px solid rgba(244,245,240,.45)" }}>{Story()}</div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "The touch-first character rail used when frame gutters collapse. Its optional hint appears above whichever enabled door is hovered or pressed; the pigeon still flies between perches across the page.",
      },
    },
  },
} satisfies Meta<typeof PixelStage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Walk: Story = {};

export const Bow: Story = {
  args: {
    character: "/assets/pixel-waffle.jpg?v=2",
    motion: { kind: "bow", sprite: "/assets/pixel-waffle-walk.png" },
  },
};

export const Burrow: Story = {
  args: {
    character: "/assets/pixel-beet.jpg?v=2",
    motion: { kind: "burrow", sprite: "/assets/pixel-beet-walk.png" },
  },
};

export const Hang: Story = {
  args: {
    character: "/assets/pixel-sloth.jpg",
    motion: { kind: "hang", sprite: "/assets/pixel-sloth-hang.png" },
  },
};

export const Flight: Story = {
  args: {
    character: "/assets/pixel-pigeon.jpg",
    motion: {
      kind: "fly",
      walk: "/assets/pixel-pigeon-walk.png",
      flight: "/assets/pixel-pigeon-fly.png",
    },
  },
};
