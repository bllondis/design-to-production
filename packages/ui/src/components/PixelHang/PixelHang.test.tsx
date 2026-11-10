import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { hangTiming, PixelHang } from "./PixelHang";

const setup = () => {
  const { container } = render(<PixelHang character="/sloth.jpg" sprite="/sloth-hang.png" still />);
  return { hang: container.firstElementChild as HTMLElement, door: screen.getByRole("button") };
};

const advance = (time: number) => act(() => vi.advanceTimersByTime(time));
const out = hangTiming.greet + hangTiming.climb + hangTiming.doze;

describe("PixelHang", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("keeps the character behind its door, and its moving self out of the accessibility tree", () => {
    const { hang, door } = setup();
    expect(hang).toHaveAttribute("data-phase", "home");
    expect(door).toHaveAttribute("aria-pressed", "false");
    expect(door.querySelector("img")).toHaveAttribute("src", "/sloth.jpg");
    expect(hang.querySelector(".stage")).toHaveAttribute("aria-hidden", "true");
  });

  it("climbs out, hangs from the door and falls asleep, and the door shuts above it", () => {
    vi.useFakeTimers();
    const { hang, door } = setup();

    fireEvent.click(door);
    expect(hang).toHaveAttribute("data-phase", "greeting");
    expect(door).toHaveAttribute("aria-pressed", "true");
    expect(door.querySelector("img")).not.toBeNull();

    advance(hangTiming.greet);
    expect(hang).toHaveAttribute("data-phase", "climbing");
    expect(door.querySelector("img")).toBeNull();

    advance(hangTiming.climb);
    expect(hang).toHaveAttribute("data-phase", "hanging");
    expect(door).toHaveAttribute("aria-pressed", "false");

    advance(hangTiming.doze);
    expect(hang).toHaveAttribute("data-phase", "asleep");
    expect(door).toBeEnabled();
  });

  it("ends the climb with the body below the sill and the arms reaching up for it", () => {
    vi.useFakeTimers();
    const { hang, door } = setup();
    fireEvent.click(door);
    advance(out);

    // The sloth's shoulders start 0.583 down the frame and end 0.38 below the sill: 0.797 lower.
    expect(hang.querySelector<HTMLElement>(".figure")?.style.translate).toBe("0 79.7%");
    const [left, right] = [".upperLeft", ".upperRight"].map(
      (piece) => hang.querySelector<HTMLElement>(piece)?.style.transform ?? "",
    );
    const turn = Number(/rotate\(([-\d.]+)deg\)/.exec(left)?.[1]);
    const stretch = Number(/scaleY\(([\d.]+)\)/.exec(left)?.[1]);
    expect(turn).toBeGreaterThan(120);
    expect(turn).toBeLessThan(170);
    expect(stretch).toBeGreaterThan(2);
    expect(right).toContain(`rotate(${-turn}deg)`);
  });

  it("wakes and climbs back in when the door is opened again", () => {
    vi.useFakeTimers();
    const { hang, door } = setup();
    fireEvent.click(door);
    advance(out);

    fireEvent.click(door);
    expect(hang).toHaveAttribute("data-phase", "waking");
    expect(door).toHaveAttribute("aria-pressed", "true");

    advance(hangTiming.wake);
    expect(hang).toHaveAttribute("data-phase", "returning");

    advance(hangTiming.climb);
    expect(hang).toHaveAttribute("data-phase", "settling");
    expect(door.querySelector("img")).not.toBeNull();
    expect(hang.querySelector<HTMLElement>(".figure")?.style.translate).toBe("0 0%");

    advance(hangTiming.settle);
    expect(hang).toHaveAttribute("data-phase", "home");
    expect(door).toHaveAttribute("aria-pressed", "false");
  });

  it("ignores clicks while the character is climbing", () => {
    vi.useFakeTimers();
    const { hang, door } = setup();
    fireEvent.click(door);
    advance(hangTiming.greet + 1000);
    fireEvent.click(door);
    expect(hang).toHaveAttribute("data-phase", "climbing");
  });

  it("only opens the door under reduced motion", () => {
    vi.spyOn(window, "matchMedia").mockImplementation(
      (query) => ({ matches: query.includes("reduce"), media: query }) as MediaQueryList,
    );
    const { hang, door } = setup();

    fireEvent.click(door);
    expect(hang).toHaveAttribute("data-phase", "home");
    expect(door).toHaveAttribute("aria-pressed", "true");
    expect(door.querySelector("img")).not.toBeNull();
  });
});
