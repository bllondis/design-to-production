import type { Meta, StoryObj } from "@storybook/react-vite";
import { SignalField } from "./SignalField";

const meta = {
  title: "Components/SignalField",
  component: SignalField,
  parameters: { layout: "fullscreen" },
  argTypes: { tone: { control: "inline-radio", options: ["dark", "light"] } },
  decorators: [
    (Story, { args }) => (
      <div
        data-signal-host
        style={{
          position: "relative",
          height: "24rem",
          overflow: "hidden",
          isolation: "isolate",
          background: args.tone === "light" ? "var(--color-surface-inverse)" : "var(--color-surface-page)",
        }}
      >
        {Story()}
      </div>
    ),
  ],
} satisfies Meta<typeof SignalField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Dark: Story = { args: { tone: "dark" } };

export const LightWithName: Story = {
  args: { tone: "light", text: "TetianaDovgalenko", opacity: 0.65 },
};
