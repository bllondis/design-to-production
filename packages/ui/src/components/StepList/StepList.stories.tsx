import type { Meta, StoryObj } from "@storybook/react-vite";
import { StepList } from "./StepList";

const meta = {
  title: "Case/StepList",
  component: StepList,
  parameters: { layout: "fullscreen" },
  args: {
    items: [
      { label: "Work signals", title: "Calendar", detail: "Real events today; future connected tools later." },
      { label: "Normalise", title: "Activity signals", detail: "Events become consistent, source-attributed records." },
      { label: "Structure", title: "AI layer", detail: "An LLM groups and classifies signals into proposed entries." },
      { label: "Review", title: "User in control", detail: "See source and confidence, then edit or remove." },
      { label: "Submit", title: "Human confirmed", detail: "Only reviewed entries become the timesheet." },
    ],
  },
} satisfies Meta<typeof StepList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Pipeline: Story = {};
