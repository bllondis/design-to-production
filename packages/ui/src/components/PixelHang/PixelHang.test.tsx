import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { climbFrames, hangTiming, PixelHang, slothRig } from "./PixelHang";

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

  it("goes down on its left arm and only then reaches up with the right", () => {
    const out = climbFrames(slothRig, "out");
    const stretchOf = (frame: Keyframe) => Number(/scaleY\(([\d.]+)\)/.exec(String(frame.transform))?.[1]);
    const tiltOf = (frame: Keyframe) => Number(/rotate\(([-\d.]+)deg\)/.exec(String(frame.transform))?.[1]);
    const late = Math.round(out.body.length * 0.7);

    // Most of the way down: the left arm at full stretch, the right still at the side, the body swung in under.
    expect(parseFloat(String(out.body[late].translate).split(" ")[1])).toBeGreaterThan(79);
    expect(stretchOf(out.upper[0][late])).toBeGreaterThan(2);
    expect(stretchOf(out.upper[1][late])).toBe(1);
    expect(tiltOf(out.lean[late])).toBeGreaterThan(5);

    // At the end both arms hold and the body hangs straight.
    const last = out.body.length - 1;
    expect(stretchOf(out.upper[1][last])).toBe(stretchOf(out.upper[0][last]));
    expect(tiltOf(out.lean[last])).toBe(0);
  });

  it("climbs back in with both arms together", () => {
    const back = climbFrames(slothRig, "in");
    back.upper[0].forEach((frame, index) => {
      const mirrored = String(frame.transform).replace(/rotate\((-?)([\d.]+)deg\)/g, (_, sign, turn) =>
        Number(turn) === 0 ? "rotate(0deg)" : `rotate(${sign ? "" : "-"}${turn}deg)`,
      );
      expect(String(back.upper[1][index].transform)).toBe(mirrored);
    });
    expect(back.lean.every((frame) => frame.transform === "rotate(0deg)")).toBe(true);
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
