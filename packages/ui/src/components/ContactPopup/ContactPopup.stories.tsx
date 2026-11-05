import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../Button/Button";
import { ContactPopup } from "./ContactPopup";

const meta = {
  title: "Components/ContactPopup",
  component: ContactPopup,
  args: {
    id: "contact-links",
    title: "Get in touch",
    links: [
      { label: "Email", detail: "name@example.com", href: "mailto:name@example.com" },
      { label: "LinkedIn", detail: "in/example", href: "https://www.linkedin.com/", external: true },
      { label: "GitHub", detail: "example", href: "https://github.com/", external: true },
      { label: "CV", detail: "PDF", href: "#", external: true },
    ],
  },
  render: (args) => (
    <>
      <Button popoverTarget={args.id}>{args.title}</Button>
      <ContactPopup {...args} />
    </>
  ),
} satisfies Meta<typeof ContactPopup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
