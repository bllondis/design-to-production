import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { burrowTiming, PixelBurrow } from "./PixelBurrow";

const setup = () => {
  const { container } = render(<PixelBurrow character="/beet.jpg" sprite="/beet-walk.png" still />);
  return { burrow: container.firstElementChild as HTMLElement, door: screen.getByRole("button") };
};

const advance = (time: number) => act(() => vi.advanceTimersByTime(time));
const plantIt = (door: HTMLElement) => {
  fireEvent.click(door);
  advance(burrowTiming.greet + burrowTiming.drop + burrowTiming.sink);
};

describe("PixelBurrow", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("keeps the character behind its door, and its moving self out of the accessibility tree", () => {
    const { burrow, door } = setup();
    expect(burrow).toHaveAttribute("data-phase", "home");
    expect(door).toHaveAttribute("aria-pressed", "false");
    expect(door.querySelector("img")).toHaveAttribute("src", "/beet.jpg");
    expect(burrow.querySelector(".plot")).toHaveAttribute("aria-hidden", "true");
  });

  it("jumps down and plants itself, and the door shuts behind it", () => {
    vi.useFakeTimers();
    const { burrow, door } = setup();

    fireEvent.click(door);
    expect(burrow).toHaveAttribute("data-phase", "greeting");
    expect(door).toHaveAttribute("aria-pressed", "true");
    expect(door.querySelector("img")).not.toBeNull();

    advance(burrowTiming.greet);
    expect(burrow).toHaveAttribute("data-phase", "dropping");
    expect(door.querySelector("img")).toBeNull();

    advance(burrowTiming.drop);
    expect(burrow).toHaveAttribute("data-phase", "sinking");
    expect(door).toHaveAttribute("aria-pressed", "false");

    advance(burrowTiming.sink);
    expect(burrow).toHaveAttribute("data-phase", "planted");
    expect(door).toBeEnabled();
    expect(door.querySelector("img")).toBeNull();
  });

  it("comes back round through the top of the cell when the door is opened again", () => {
    vi.useFakeTimers();
    const { burrow, door } = setup();
    plantIt(door);

    fireEvent.click(door);
    expect(burrow).toHaveAttribute("data-phase", "rising");
    expect(door).toHaveAttribute("aria-pressed", "true");

    advance(burrowTiming.rise);
    expect(burrow).toHaveAttribute("data-phase", "falling");

    advance(burrowTiming.fall);
    expect(burrow).toHaveAttribute("data-phase", "settling");
    expect(door.querySelector("img")).not.toBeNull();

    advance(burrowTiming.settle);
    expect(burrow).toHaveAttribute("data-phase", "home");
    expect(door).toHaveAttribute("aria-pressed", "false");
  });

  it("ignores clicks while the character is on the move", () => {
    vi.useFakeTimers();
    const { burrow, door } = setup();

    fireEvent.click(door);
    advance(burrowTiming.greet);
    fireEvent.click(door);
    expect(burrow).toHaveAttribute("data-phase", "dropping");

    advance(burrowTiming.drop);
    fireEvent.click(door);
    expect(burrow).toHaveAttribute("data-phase", "sinking");
  });

  it("tells the stylesheet where the feet and the eyes are", () => {
    const { container } = render(<PixelBurrow character="/beet.jpg" sprite="/beet-walk.png" ground={0.9} eyes={0.5} />);
    const burrow = container.firstElementChild as HTMLElement;
    expect(burrow.style.getPropertyValue("--burrow-ground")).toBe("90%");
    expect(burrow.style.getPropertyValue("--burrow-eyes")).toBe("50%");
  });

  it("only opens the door under reduced motion", () => {
    vi.spyOn(window, "matchMedia").mockImplementation(
      (query) => ({ matches: query.includes("reduce"), media: query }) as MediaQueryList,
    );
    const { burrow, door } = setup();

    fireEvent.click(door);
    expect(burrow).toHaveAttribute("data-phase", "home");
    expect(door).toHaveAttribute("aria-pressed", "true");
    expect(door.querySelector("img")).not.toBeNull();
  });
});
