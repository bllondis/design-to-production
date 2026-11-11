import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent } from "storybook/test";
import { MobileNav } from "./MobileNav";

const links = [
  { label: "CV", href: "#", external: true },
  { label: "GitHub", href: "#", external: true },
  { label: "LinkedIn", href: "#", external: true },
];

const languages = [
  { code: "en", label: "English", flag: "🇬🇧", href: "#", active: true },
  { code: "nl", label: "Nederlands", flag: "🇳🇱", href: "#" },
  { code: "uk", label: "Українська", flag: "🇺🇦", href: "#" },
];

const meta = {
  title: "Components/MobileNav",
  component: MobileNav,
  args: { links, languages, languageLabel: "Languages", label: "Primary navigation" },
  parameters: {
    viewport: { defaultViewport: "mobile2" },
    docs: {
      description: {
        component:
          "A narrow-screen navigation trigger and focus-managed sheet. It locks page scroll and closes on Escape, backdrop press or link selection.",
      },
    },
  },
  decorators: [
    (Story) => <div style={{ minHeight: "18rem", display: "flex", justifyContent: "flex-end" }}>{Story()}</div>,
  ],
} satisfies Meta<typeof MobileNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {};

export const Open: Story = {
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("button", { name: "Open menu" });
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(canvas.getByRole("navigation", { name: "Primary navigation" })).toBeVisible();
  },
};
