import type { Meta, StoryObj } from "@storybook/react-vite";
import { Lightbox } from "../Lightbox/Lightbox";
import { Figure } from "./Figure";

const meta = {
  title: "Case/Figure",
  component: Figure,
  parameters: { layout: "fullscreen" },
  args: {
    src: "/assets/docustream-dashboard.jpg",
    alt: "DocuStream filings dashboard",
    caption: "The dashboard connects individual filing work to the wider operational picture.",
  },
  argTypes: { layout: { control: "inline-radio", options: ["inset", "wide"] } },
} satisfies Meta<typeof Figure>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Inset: Story = {};

/** Click the image: the page-level Lightbox opens it full screen. */
export const WithLightbox: Story = {
  render: (args) => (
    <>
      <Figure {...args} />
      <Lightbox />
    </>
  ),
};
