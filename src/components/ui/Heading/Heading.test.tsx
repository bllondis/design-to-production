import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Heading } from "./Heading";

describe("Heading", () => {
  it("exposes the full text once to assistive tech when pixel letters are on", () => {
    render(<Heading as="h3" size="display-4" text="Design Systems" />);
    const heading = screen.getByRole("heading", { level: 3, name: "Design Systems" });
    expect(heading.querySelector("[aria-hidden='true']")).toBeInTheDocument();
  });

  it("pixelates only a small, stable share of letters at rest", () => {
    const { container, rerender } = render(<Heading size="display-2" text="AI Design Engineering" />);
    const first = [...container.querySelectorAll(".pixel")].map((node) => node.textContent);
    expect(first.length).toBeGreaterThan(0);
    expect(first.length).toBeLessThan(8);
    rerender(<Heading size="display-2" text="AI Design Engineering" />);
    expect([...container.querySelectorAll(".pixel")].map((node) => node.textContent)).toEqual(first);
  });

  it("renders plain text without pixel markup when pixel is off", () => {
    render(<Heading as="h1" size="display-1" text="I design calm interfaces." pixel={false} />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading.children).toHaveLength(0);
    expect(heading).toHaveTextContent("I design calm interfaces.");
  });

  it("sets the measure as a custom property", () => {
    render(<Heading size="display-4" text="Design Systems" measure={16} />);
    expect(screen.getByRole("heading").style.getPropertyValue("--heading-measure")).toBe("16ch");
  });
});
