import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent } from "storybook/test";
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
  parameters: {
    docs: {
      description: {
        component:
          "A native popover with whole-row contact actions. Tooltips follow the pointer, appear on keyboard focus, and report copy feedback.",
      },
    },
  },
} satisfies Meta<typeof ContactPopup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CopyTooltip: Story = {
  args: { id: "contact-copy-tooltip" },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Get in touch" }));
    const email = canvas.getByRole("button", { name: "Copy Email" });
    await userEvent.hover(email);
    await expect(canvas.getByRole("tooltip", { name: "Copy" })).toBeVisible();
  },
};

export const OpenTooltip: Story = {
  args: { id: "contact-open-tooltip" },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Get in touch" }));
    const linkedin = canvas.getByRole("link", { name: /LinkedIn/ });
    await userEvent.hover(linkedin);
    await expect(canvas.getAllByRole("tooltip", { name: "Open" })[0]).toBeVisible();
  },
};

export const CopiedFeedback: Story = {
  args: { id: "contact-copied-feedback" },
  play: async ({ canvas }) => {
    Object.defineProperty(window.navigator, "clipboard", {
      value: { writeText: async () => undefined },
      configurable: true,
    });
    await userEvent.click(canvas.getByRole("button", { name: "Get in touch" }));
    await userEvent.click(canvas.getByRole("button", { name: "Copy Email" }));
    await expect(await canvas.findByRole("tooltip", { name: "Copied" })).toBeVisible();
  },
};

export const KeyboardFocus: Story = {
  args: { id: "contact-keyboard-focus" },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Get in touch" }));
    await userEvent.tab();
    await userEvent.tab();
    const email = canvas.getByRole("button", { name: "Copy Email" });
    await expect(email).toHaveFocus();
    await expect(canvas.getByRole("tooltip", { name: "Copy" })).toBeVisible();
  },
};
