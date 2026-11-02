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
