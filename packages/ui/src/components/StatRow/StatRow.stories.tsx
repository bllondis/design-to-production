import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatRow } from "./StatRow";

const meta = {
  title: "Case/StatRow",
  component: StatRow,
  parameters: { layout: "fullscreen" },
  args: {
    items: [
      { value: "100", suffix: "+", label: "Legal document types and forms" },
      { value: "7", suffix: "+", label: "Lifecycle states" },
      { value: "6", label: "User roles" },
    ],
  },
} satisfies Meta<typeof StatRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ThreeStats: Story = {};

export const FourStats: Story = {
  args: {
    items: [
      { value: "200K", suffix: "+", label: "Active users" },
      { value: "1,200", suffix: "+", label: "Locations" },
      { value: "40", suffix: "+", label: "Countries" },
      { value: "85K", label: "Reservations daily" },
    ],
  },
};
