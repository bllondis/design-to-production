import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SkillGrid } from "./SkillGrid";

describe("SkillGrid", () => {
  it("lists every skill under its label", () => {
    render(<SkillGrid items={["Domain modelling", "Information architecture"]} />);
    expect(screen.getByText("What I bring")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem").map((item) => item.textContent)).toEqual([
      "Domain modelling",
      "Information architecture",
    ]);
  });

  it("leaves cells unlit on wider screens, where hover inverts them instead", () => {
    render(<SkillGrid items={["Ideas", "Positive energy"]} />);
    const [first] = screen.getAllByRole("listitem");
    fireEvent.pointerOver(first);
    expect(first).not.toHaveAttribute("data-lit");
  });

  it("lights a narrow cell while it is hovered or touched, once through", () => {
    const media = vi.spyOn(window, "matchMedia").mockImplementation(
      (query) =>
        ({
          matches: query === "(max-width: 680px)",
          media: query,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        }) as unknown as MediaQueryList,
    );

    render(<SkillGrid items={["Ideas", "Positive energy"]} />);
    const [first, second] = screen.getAllByRole("listitem");
    expect(first).not.toHaveAttribute("data-lit");

    fireEvent.pointerOver(first);
    expect(first).toHaveAttribute("data-lit", "true");
    expect(second).not.toHaveAttribute("data-lit");

    fireEvent.animationEnd(first);
    expect(first).not.toHaveAttribute("data-lit");

    media.mockRestore();
  });
});
