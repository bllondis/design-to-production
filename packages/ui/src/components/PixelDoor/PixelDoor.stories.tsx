import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent } from "storybook/test";
import { PixelDoor } from "./PixelDoor";

const meta = {
  title: "Components/PixelDoor",
  component: PixelDoor,
  args: { character: "assets/pixel-cat.jpg", still: true, inset: false },
  argTypes: {
    initialState: { control: "inline-radio", options: ["closed", "peek", "open"] },
    character: {
      control: "select",
      options: ["assets/pixel-cat.jpg", "assets/pixel-waffle.jpg", "assets/pixel-beet.jpg", "assets/pixel-girl.jpg"],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: "1rem 8rem 3rem 0" }}>
        <div style={{ width: "7rem" }}>{Story()}</div>
      </div>
    ),
  ],
} satisfies Meta<typeof PixelDoor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {};

export const Peek: Story = {
  args: { initialState: "peek", character: "assets/pixel-waffle.jpg" },
};

export const Open: Story = {
  args: { initialState: "open", character: "assets/pixel-girl.jpg" },
};

/** Hung on the right, for a right-hand gutter: the leaf, the light and the beam all mirror. */
export const HingedRight: Story = {
  args: { hinge: "right", initialState: "peek" },
};

/** Nobody home: the door opens onto the empty dark. PixelWalk and the other characters use it while theirs is out. */
export const Vacant: Story = {
  args: { vacant: true, initialState: "open" },
};

/** Nothing to open: no hover, no click, and hidden from assistive tech. */
export const Disabled: Story = {
  args: { disabled: true, vacant: true },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector("button")).toBeDisabled();
  },
};

/** Clicking toggles the door and keeps the accessible name in sync. */
export const ClickToOpen: Story = {
  play: async ({ canvas }) => {
    const door = canvas.getByRole("button", { name: "Open the pixel door" });
    await userEvent.click(door);
    await expect(door).toHaveAttribute("aria-pressed", "true");
    await expect(door).toHaveAccessibleName("Close the pixel door");
  },
};
