import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent } from "storybook/test";
import { PixelBurrow } from "./PixelBurrow";

const line = "1px solid var(--color-border-default)";

const meta = {
  title: "Components/PixelBurrow",
  component: PixelBurrow,
  args: { character: "assets/pixel-beet.jpg", sprite: "assets/pixel-beet-walk.png", still: true },
  // A stand-in for a frame gutter: a positioned cell a door wide, with a line above and below.
  decorators: [
    (Story) => (
      <div style={{ padding: "2rem 3rem" }}>
        <div style={{ position: "relative", width: "7rem", height: "20rem", borderTop: line, borderBottom: line }}>
          {Story()}
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof PixelBurrow>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Open the door to plant the character in the line below; open it again to bring it back round. */
export const AtHome: Story = {};

/** With the door at the very top of the cell, the character comes out of the top line straight into the doorway. */
export const Flush: Story = {
  args: { inset: false },
};

/** A click opens the door, which stays a button while the character is planted. */
export const OpenToPlant: Story = {
  play: async ({ canvas }) => {
    const door = canvas.getByRole("button", { name: "Open the pixel door" });
    await userEvent.click(door);
    await expect(door).toHaveAttribute("aria-pressed", "true");
    await expect(door).toBeEnabled();
  },
};
