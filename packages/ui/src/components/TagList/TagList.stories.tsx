import type { Meta, StoryObj } from "@storybook/react-vite";
import { TagList } from "./TagList";

const meta = {
  title: "Case/TagList",
  component: TagList,
  args: { items: ["Filing status", "Submission volume", "Assignee workload", "Lapse tracking"] },
} satisfies Meta<typeof TagList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Dimensions: Story = {};

export const Links: Story = {
  args: {
    items: [
      { label: "Design to production", href: "/work/design-to-production/" },
      { label: "Timeflow", href: "/work/timeflow/" },
      { label: "DutchWaffle", href: "/work/dutchwaffle/" },
    ],
  },
};
