import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent } from "storybook/test";
import { PixelWalk } from "./PixelWalk";

const meta = {
  title: "Components/PixelWalk",
  component: PixelWalk,
  args: { character: "assets/pixel-cat.jpg", sprite: "assets/pixel-cat-walk.png", still: true, inset: false },
  // A stand-in for a frame row: the walk fills it, and its bottom line is the floor.
  decorators: [
    (Story) => (
      <div style={{ padding: "1rem 3rem 3rem" }}>
        <div style={{ height: "14rem", borderBottom: "1px solid var(--color-border-default)" }}>{Story()}</div>
      </div>
    ),
  ],
} satisfies Meta<typeof PixelWalk>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Click the door the character is behind to send it across; the empty door does nothing. */
export const AtHome: Story = {};

export const Inset: Story = {
  args: { inset: true },
};

/**
 * One door: a somersault out, a walk to the middle of the row, and the full stage bow — a hop with arms up,
 * a bow to each side, a deep one to the front — then back the same way.
 */
export const TakeABow: Story = {
  args: {
    character: "assets/pixel-waffle.jpg",
    sprite: "assets/pixel-waffle-walk.png",
    flourish: "assets/pixel-waffle-bow.png",
    route: "bow",
    leap: "flip",
  },
};

/** Only the character's door is a button; a click opens it and the walk begins. */
export const ClickToWalk: Story = {
  play: async ({ canvas }) => {
    const door = canvas.getByRole("button", { name: "Open the pixel door" });
    await userEvent.click(door);
    await expect(door).toHaveAttribute("aria-pressed", "true");
  },
};
