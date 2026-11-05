import type { Meta, StoryObj } from "@storybook/react-vite";
import { MediaRow } from "./MediaRow";

const meta = {
  title: "Case/MediaRow",
  component: MediaRow,
  parameters: { layout: "fullscreen" },
  args: {
    src: "work/timeflow/competitive-analysis.jpg",
    alt: "Competitive analysis",
    label: "03 · Research",
    title: "Competitive analysis",
    text: "A scan of ten time-tracking products exposed recurring patterns and a gap for transparent, review-first interaction.",
  },
} satisfies Meta<typeof MediaRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ImageLeft: Story = {};

export const ImageRight: Story = { args: { flip: true } };
