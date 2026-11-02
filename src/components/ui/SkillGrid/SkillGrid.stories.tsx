import type { Meta, StoryObj } from "@storybook/react-vite";
import { SkillGrid } from "./SkillGrid";

const meta = {
  title: "Components/SkillGrid",
  component: SkillGrid,
  parameters: { layout: "fullscreen" },
  args: {
    items: [
      "Domain modelling",
      "Information architecture",
      "Role-based workflows",
      "Lifecycle and state design",
      "Progressive guidance",
      "Research and validation",
    ],
  },
} satisfies Meta<typeof SkillGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SixSkills: Story = {};

export const ThreeSkills: Story = {
  args: { items: ["Foundations and design tokens", "Component architecture and variants", "Accessibility by default"] },
};
