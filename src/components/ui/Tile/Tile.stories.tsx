import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tile } from "./Tile";

const meta = {
  title: "Components/Tile",
  component: Tile,
  args: { label: "01", inset: false },
  decorators: [(Story) => <div style={{ width: "7rem" }}>{Story()}</div>],
} satisfies Meta<typeof Tile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Chapter: Story = {};
