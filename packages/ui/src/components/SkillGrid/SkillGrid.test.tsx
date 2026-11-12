import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SkillGrid } from "./SkillGrid";

describe("SkillGrid", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("lists every skill under its label", () => {
    render(<SkillGrid items={["Domain modelling", "Information architecture"]} />);
    expect(screen.getByText("What I bring")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem").map((item) => item.textContent)).toEqual([
      "Domain modelling",
      "Information architecture",
    ]);
  });

  it("leaves the sequence inactive on wider screens, where CSS hover inverts cells instead", () => {
    render(<SkillGrid items={["Ideas", "Positive energy"]} />);
    expect(screen.getByRole("list")).not.toHaveAttribute("data-revealing");
  });

  it("replays the narrow reveal in the direction the grid enters the viewport", () => {
    vi.spyOn(window, "matchMedia").mockImplementation(
      (query) =>
        ({
          matches: query === "(max-width: 680px)",
          media: query,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        }) as unknown as MediaQueryList,
    );
    let scrollY = 100;
    vi.spyOn(window, "scrollY", "get").mockImplementation(() => scrollY);
    let notify: IntersectionObserverCallback = () => undefined;
    const disconnect = vi.fn();
    class MockIntersectionObserver {
      readonly root = null;
      readonly rootMargin = "";
      readonly thresholds = [];
      readonly disconnect = disconnect;
      readonly observe = vi.fn();
      readonly unobserve = vi.fn();
      readonly takeRecords = vi.fn(() => []);

      constructor(callback: IntersectionObserverCallback) {
        notify = callback;
      }
    }
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);

    render(<SkillGrid items={["Ideas", "Positive energy"]} />);
    const list = screen.getByRole("list");

    act(() => notify([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver));
    expect(list).toHaveAttribute("data-revealing", "true");
    expect(list).toHaveAttribute("data-reveal-direction", "forward");

    act(() => notify([{ isIntersecting: false } as IntersectionObserverEntry], {} as IntersectionObserver));
    expect(list).not.toHaveAttribute("data-revealing");

    scrollY = 20;
    fireEvent.scroll(window);
    act(() => notify([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver));
    expect(list).toHaveAttribute("data-revealing", "true");
    expect(list).toHaveAttribute("data-reveal-direction", "reverse");
  });
});
