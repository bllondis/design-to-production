import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent } from "storybook/test";
import { PixelHang } from "./PixelHang";

const meta = {
  title: "Components/PixelHang",
  component: PixelHang,
  args: { character: "assets/pixel-sloth.jpg", sprite: "assets/pixel-sloth-hang.png", still: true, inset: false },
  // A door wide, with a door's height of room underneath to hang in.
  decorators: [
    (Story) => (
      <div style={{ padding: "1rem 3rem 9rem" }}>
        <div style={{ width: "7rem" }}>{Story()}</div>
      </div>
    ),
  ],
} satisfies Meta<typeof PixelHang>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Open the door and wait: it climbs out and falls asleep. Open it again to wake it and send it back in. */
export const AtHome: Story = {};

/** A click opens the door, which stays a button while the character hangs from it. */
export const OpenToClimb: Story = {
  play: async ({ canvas }) => {
    const door = canvas.getByRole("button", { name: "Open the pixel door" });
    await userEvent.click(door);
    await expect(door).toHaveAttribute("aria-pressed", "true");
    await expect(door).toBeEnabled();
  },
};
