import type { Meta, StoryObj } from "@storybook/react-vite";
import { AsciiVisual } from "./AsciiVisual";

const meta = {
  title: "Components/AsciiVisual",
  component: AsciiVisual,
  args: { src: "assets/bookit-floorplan.jpg", focus: "0.6 0.55", caption: "BookIT / Floorplan editor" },
  argTypes: {
    src: {
      control: "select",
      // Every capability visual and case cover the portfolio renders, so each can be checked here.
      options: [
        "assets/bookit-floorplan.jpg",
        "assets/docustream-dashboard.jpg",
        "assets/timeflow-review.jpg",
        "work/design-to-production/storybook-tokens.jpg",
        "work/dutchwaffle/app-flow.jpg",
        "work/dutchwaffle/screens.jpg",
        "work/docustream/dashboard-portfolio-overview.jpg",
        "work/ted/react-manager-heatmap.png",
      ],
    },
  },
  decorators: [
    (Story) => <div style={{ height: "28rem", border: "1px solid var(--color-border-default)" }}>{Story()}</div>,
  ],
} satisfies Meta<typeof AsciiVisual>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BookIT: Story = {};

export const DocuStream: Story = {
  args: { src: "assets/docustream-dashboard.jpg", focus: "0.6 0.45", caption: "DocuStream / Filings dashboard" },
};

/** A dark UI. Hover any story to open the lens onto the real screenshot. */
export const DutchWaffle: Story = {
  args: { src: "work/dutchwaffle/screens.jpg", focus: "0.39 0.62", caption: "DutchWaffle / lesson intro" },
};
