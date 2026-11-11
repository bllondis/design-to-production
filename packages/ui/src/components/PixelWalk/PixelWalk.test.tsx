import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PixelWalk, walkTiming } from "./PixelWalk";

const setup = () => {
  const { container } = render(<PixelWalk character="/cat.jpg" sprite="/cat-walk.png" still />);
  // The empty door is hidden from assistive tech, so the pair is read from the DOM rather than by role.
  const [start, end] = [...container.querySelectorAll("button")];
  return { stage: container.firstElementChild as HTMLElement, start, end };
};

const advance = (time: number) => act(() => vi.advanceTimersByTime(time));

describe("PixelWalk", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("keeps the character behind the start door, the only one that can be opened", () => {
    const { stage, start, end } = setup();
    expect(stage).toHaveAttribute("data-phase", "home");
    expect(start.querySelector("img")).toHaveAttribute("src", "/cat.jpg");
    expect(end.querySelector("img")).toBeNull();
    expect(screen.getAllByRole("button")).toEqual([start]);
    expect(start).toBeEnabled();
    expect(end).toBeDisabled();
  });

  it("walks the character from its door to the one across", () => {
    vi.useFakeTimers();
    const { stage, start, end } = setup();

    fireEvent.click(start);
    expect(stage).toHaveAttribute("data-phase", "greeting");
    expect(start).toHaveAttribute("aria-pressed", "true");
    expect(start.querySelector("img")).not.toBeNull();

    advance(walkTiming.greet);
    expect(stage).toHaveAttribute("data-phase", "leaping");
    expect(start.querySelector("img")).toBeNull();

    advance(walkTiming.leap);
    expect(stage).toHaveAttribute("data-phase", "strolling");
    expect(start).toHaveAttribute("aria-pressed", "false");

    advance(walkTiming.stroll - walkTiming.welcome);
    expect(end).toHaveAttribute("aria-pressed", "true");

    advance(walkTiming.welcome);
    expect(stage).toHaveAttribute("data-phase", "entering");

    advance(walkTiming.leap);
    expect(stage).toHaveAttribute("data-phase", "settling");
    expect(end.querySelector("img")).not.toBeNull();

    advance(walkTiming.settle);
    expect(stage).toHaveAttribute("data-phase", "home");
    expect(stage).toHaveAttribute("data-from", "end");
    expect(end).toHaveAttribute("aria-pressed", "false");
    expect(end.querySelector("img")).not.toBeNull();
    expect(start.querySelector("img")).toBeNull();
    expect(screen.getAllByRole("button")).toEqual([end]);
    expect(start).toBeDisabled();
  });

  it("hands keyboard focus to the door the character moved into", () => {
    vi.useFakeTimers();
    const { start, end } = setup();
    start.focus();
    fireEvent.click(start);
    advance(walkTiming.greet + walkTiming.leap * 2 + walkTiming.stroll + walkTiming.settle);
    expect(end).toHaveFocus();
  });

  it("ignores the empty door, and every click until the character arrives", () => {
    vi.useFakeTimers();
    const { stage, start, end } = setup();

    fireEvent.click(end);
    expect(stage).toHaveAttribute("data-phase", "home");

    fireEvent.click(start);
    advance(walkTiming.greet);
    fireEvent.click(start);
    fireEvent.click(end);
    expect(stage).toHaveAttribute("data-phase", "leaping");
  });

  it("hides the walker from assistive tech and hangs the far door on the right", () => {
    const { stage, start, end } = setup();
    expect(stage.querySelector("[aria-hidden='true'].walker")).not.toBeNull();
    expect(start).not.toHaveClass("hingeRight");
    expect(end).toHaveClass("hingeRight");
  });

  it("jumps by default and somersaults when asked to flip", () => {
    const { stage } = setup();
    expect(stage).toHaveAttribute("data-leap", "jump");
    const { container } = render(<PixelWalk character="/waffle.jpg" sprite="/waffle-walk.png" leap="flip" still />);
    expect(container.firstElementChild).toHaveAttribute("data-leap", "flip");
  });

  it("brings its arm poses to the bow when given a flourish", () => {
    const { stage } = setup();
    expect(stage).not.toHaveAttribute("data-flourish");
    const { container } = render(
      <PixelWalk character="/waffle.jpg" sprite="/waffle-walk.png" flourish="/waffle-bow.png" route="bow" still />,
    );
    const bowing = container.firstElementChild as HTMLElement;
    expect(bowing).toHaveAttribute("data-flourish");
    expect(bowing.style.getPropertyValue("--walk-sprite")).toBe("url(/waffle-walk.png)");
    expect(bowing.style.getPropertyValue("--walk-flourish")).toBe("url(/waffle-bow.png)");
  });

  it("on the bow route walks to the middle, bows and comes back through its one door", () => {
    vi.useFakeTimers();
    const { container } = render(
      <PixelWalk character="/waffle.jpg" sprite="/waffle-walk.png" route="bow" leap="flip" still />,
    );
    const stage = container.firstElementChild as HTMLElement;
    const door = screen.getByRole("button");
    const halfway = walkTiming.stroll * walkTiming.halfway;
    expect(container.querySelectorAll("button")).toHaveLength(1);

    fireEvent.click(door);
    advance(walkTiming.greet + walkTiming.leap);
    expect(stage).toHaveAttribute("data-phase", "strolling");
    expect(stage).toHaveAttribute("data-leg", "out");
    expect(door).toHaveAttribute("aria-pressed", "false");
    expect(door).toBeEnabled();

    advance(halfway);
    expect(stage).toHaveAttribute("data-phase", "bowing");

    advance(walkTiming.bow);
    expect(stage).toHaveAttribute("data-phase", "strolling");
    expect(stage).toHaveAttribute("data-leg", "back");

    advance(halfway - walkTiming.welcome);
    expect(door).toHaveAttribute("aria-pressed", "true");

    advance(walkTiming.welcome);
    expect(stage).toHaveAttribute("data-phase", "entering");

    advance(walkTiming.leap);
    expect(stage).toHaveAttribute("data-phase", "settling");
    expect(door.querySelector("img")).not.toBeNull();

    advance(walkTiming.settle);
    expect(stage).toHaveAttribute("data-phase", "home");
    expect(stage).toHaveAttribute("data-from", "start");
    expect(stage).toHaveAttribute("data-leg", "out");
    expect(door).toHaveAttribute("aria-pressed", "false");
  });

  it("only opens the character's door under reduced motion", () => {
    vi.spyOn(window, "matchMedia").mockImplementation(
      (query) => ({ matches: query.includes("reduce"), media: query }) as MediaQueryList,
    );
    const { stage, start, end } = setup();

    fireEvent.click(start);
    expect(stage).toHaveAttribute("data-phase", "home");
    expect(start).toHaveAttribute("aria-pressed", "true");
    expect(end).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(start);
    expect(start).toHaveAttribute("aria-pressed", "false");
  });
});
