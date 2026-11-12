import { act, render, screen, waitFor } from "@testing-library/react";
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

  it("reveals every cell immediately outside the narrow layout", async () => {
    render(<SkillGrid items={["Ideas", "Positive energy"]} />);
    const cells = screen.getAllByRole("listitem");

    await waitFor(() => expect(cells.every((cell) => cell.dataset.revealed === "true")).toBe(true));
    expect(cells.map((item) => item.style.getPropertyValue("--skill-reveal-order"))).toEqual(["0", "1"]);
  });

  it("reveals only the mobile cells that enter the reading area", () => {
    const originalObserver = window.IntersectionObserver;
    const media = vi.spyOn(window, "matchMedia").mockImplementation(
      (query) =>
        ({
          matches: query === "(max-width: 680px)",
          media: query,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        }) as unknown as MediaQueryList,
    );
    let reveal: IntersectionObserverCallback | undefined;
    const unobserve = vi.fn();
    window.IntersectionObserver = class {
      constructor(callback: IntersectionObserverCallback) {
        reveal = callback;
      }
      observe() {}
      unobserve = unobserve;
      disconnect() {}
    } as unknown as typeof IntersectionObserver;

    render(<SkillGrid items={["Ideas", "Positive energy"]} />);
    const [first, second] = screen.getAllByRole("listitem");
    expect(first).not.toHaveAttribute("data-revealed");
    expect(second).not.toHaveAttribute("data-revealed");

    act(() => {
      reveal?.(
        [{ isIntersecting: true, target: first } as unknown as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });

    expect(first).toHaveAttribute("data-revealed", "true");
    expect(second).not.toHaveAttribute("data-revealed");
    expect(unobserve).toHaveBeenCalledWith(first);

    window.IntersectionObserver = originalObserver;
    media.mockRestore();
  });
});
