import type { Meta, StoryObj } from "@storybook/react-vite";
import { Clip } from "./Clip";

const meta = {
  title: "Case/Clip",
  component: Clip,
  parameters: { layout: "fullscreen" },
  args: {
    src: "/work/timeflow/review-your-day.mp4",
    poster: "/work/timeflow/review-your-day-don-t-log-it.jpg",
    label: "Review your day - don't log it",
  },
  argTypes: { mode: { control: "inline-radio", options: ["ambient", "walkthrough"] } },
} satisfies Meta<typeof Clip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ambient: Story = {};

export const Walkthrough: Story = {
  args: { mode: "walkthrough", caption: "Playback is user-controlled and does not autoplay." },
};
