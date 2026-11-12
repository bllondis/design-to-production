import type { Meta, StoryObj } from "@storybook/react-vite";
import { SkillGrid } from "./SkillGrid";

const meta = {
  title: "Components/SkillGrid",
  component: SkillGrid,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A responsive capability grid: three columns at wide widths, two below 980px and compact rows below 680px. Pointer hover inverts a cell on larger screens; on narrow screens the rows reveal in scroll direction whenever the grid re-enters the viewport. Reduced motion stays static.",
      },
    },
  },
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
