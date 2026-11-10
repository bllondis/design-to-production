import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent } from "storybook/test";
import { PixelFlight } from "./PixelFlight";

const line = { borderTop: "1px solid var(--color-border-default)", height: "9rem" };

const meta = {
  title: "Components/PixelFlight",
  component: PixelFlight,
  args: {
    character: "assets/pixel-pigeon.jpg",
    walk: "assets/pixel-pigeon-walk.png",
    flight: "assets/pixel-pigeon-fly.png",
    still: true,
    inset: false,
  },
  // A few lines to land on, marked as perches the way FrameRow marks its own.
  decorators: [
    (Story) => (
      <div style={{ padding: "2rem 3rem" }}>
        <div style={{ ...line, display: "flex" }} data-perch>
          <div style={{ width: "7rem", paddingTop: "1rem" }}>{Story()}</div>
        </div>
        <div style={line} data-perch />
        <div style={line} data-perch />
        <div style={line} data-perch />
      </div>
    ),
  ],
} satisfies Meta<typeof PixelFlight>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Open the door to let the bird out; it shuts behind the bird. Open it again to call the bird home. */
export const AtHome: Story = {};

/** Hung on the right, for the right-hand gutter: the bird hops out to the left. */
export const HingedRight: Story = {
  args: { hinge: "right" },
  decorators: [(Story) => <div style={{ marginLeft: "auto", width: "7rem" }}>{Story()}</div>],
};

/** A click opens the door; it stays a button while the bird is out. */
export const OpenToFly: Story = {
  play: async ({ canvas }) => {
    const door = canvas.getByRole("button", { name: "Open the pixel door" });
    await userEvent.click(door);
    await expect(door).toHaveAttribute("aria-pressed", "true");
    await expect(door).toBeEnabled();
  },
};
