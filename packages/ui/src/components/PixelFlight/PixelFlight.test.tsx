import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { flightTiming, PixelFlight } from "./PixelFlight";

const setup = () => {
  const { container, unmount } = render(
    <PixelFlight character="/pigeon.jpg" walk="/pigeon-walk.png" flight="/pigeon-fly.png" still />,
  );
  return { home: container.firstElementChild as HTMLElement, door: screen.getByRole("button"), unmount };
};

const bird = () => document.body.querySelector<HTMLElement>(":scope > .bird");
const advance = (time: number) => act(() => vi.advanceTimersByTimeAsync(time));

// jsdom lays nothing out: give the door a place on the page, and optionally a line under it and the bird a spot.
const layOut = (line?: HTMLElement, birdAt?: DOMRect) =>
  vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(function (this: Element) {
    if (this === line) return new DOMRect(0, 400, 1200, 300);
    if (this.tagName === "BUTTON") return new DOMRect(1000, 100, 100, 100);
    if (birdAt && this.classList.contains("bird")) return birdAt;
    return new DOMRect();
  });

describe("PixelFlight", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    delete (HTMLElement.prototype as Partial<HTMLElement>).animate;
    document.body.querySelectorAll("[data-perch]").forEach((line) => line.remove());
  });

  it("keeps the bird behind its door", () => {
    const { home, door } = setup();
    expect(home).toHaveAttribute("data-phase", "home");
    expect(door).toHaveAttribute("aria-pressed", "false");
    expect(door.querySelector("img")).toHaveAttribute("src", "/pigeon.jpg");
    expect(bird()).toBeNull();
  });

  it("lets the bird out when the door opens, and shuts the door behind it", async () => {
    vi.useFakeTimers();
    const { home, door } = setup();

    fireEvent.click(door);
    expect(home).toHaveAttribute("data-phase", "greeting");
    expect(door).toHaveAttribute("aria-pressed", "true");
    expect(door.querySelector("img")).not.toBeNull();

    await advance(flightTiming.greet);
    expect(home).toHaveAttribute("data-phase", "out");
    expect(door).toHaveAttribute("aria-pressed", "false");
    expect(door).toBeEnabled();
    expect(door.querySelector("img")).toBeNull();
    expect(bird()).toHaveAttribute("aria-hidden", "true");
    expect(bird()).toHaveAttribute("data-out");
  });

  it("hops out away from the hinge and settles on a perch", async () => {
    vi.useFakeTimers();
    const line = document.body.appendChild(document.createElement("div"));
    line.setAttribute("data-perch", "");
    layOut(line);
    render(<PixelFlight character="/pigeon.jpg" walk="/w.png" flight="/f.png" hinge="right" ground={0.9} still />);

    fireEvent.click(screen.getByRole("button"));
    await advance(flightTiming.greet + 100);
    expect(bird()).toHaveAttribute("data-mode", "perch");
    expect(bird()).toHaveStyle({ width: "100px", height: "100px" });
    // Feet on the line: 400 down the page, less nine tenths of a 100px bird.
    expect(bird()?.style.translate).toMatch(/px 310px$/);
  });

  it("flees to another spot when the pointer comes close, and not before", async () => {
    vi.useFakeTimers();
    const random = vi.spyOn(Math, "random").mockReturnValue(0.9);
    const line = document.body.appendChild(document.createElement("div"));
    line.setAttribute("data-perch", "");
    layOut(line, new DOMRect(500, 310, 100, 100));
    setup();

    fireEvent.click(screen.getByRole("button"));
    await advance(flightTiming.greet + 100);
    // Nine tenths of the way along the room a 100px bird has on a 1200px line.
    expect(bird()?.style.translate).toBe("990px 311px");

    random.mockReturnValue(0.1);
    fireEvent.pointerMove(window, { clientX: 50, clientY: 50 });
    await advance(0);
    expect(bird()?.style.translate).toBe("990px 311px");

    fireEvent.pointerMove(window, { clientX: 560, clientY: 350 });
    await advance(0);
    expect(bird()?.style.translate).toBe("110px 311px");
  });

  it("sometimes walks along its line before flying on", async () => {
    vi.useFakeTimers();
    vi.spyOn(Math, "random").mockReturnValue(0.2);
    // Movements that take their time, so the walk can be caught in the act.
    HTMLElement.prototype.animate = vi.fn((_frames, options) => ({
      finished: new Promise<void>((resolve) => {
        window.setTimeout(resolve, Number((options as KeyframeAnimationOptions).duration));
      }),
      cancel: vi.fn(),
    })) as unknown as typeof HTMLElement.prototype.animate;
    const line = document.body.appendChild(document.createElement("div"));
    line.setAttribute("data-perch", "");
    layOut(line);
    setup();
    const until = async (mode: string) => {
      for (let step = 0; step < 200 && bird()?.dataset.mode !== mode; step += 1) await advance(100);
      expect(bird()).toHaveAttribute("data-mode", mode);
    };

    // Out of the door: the flutter down, the first two steps, the flight to a perch.
    fireEvent.click(screen.getByRole("button"));
    await until("fly");
    await until("walk");
    await until("perch");
    expect(bird()?.style.translate).toBe("220px 311px");

    // Two cycles to the left, 0.45 of a 100px body each.
    await until("walk");
    expect(bird()).toHaveAttribute("data-facing", "-1");
    expect(bird()?.style.translate).toBe("130px 311px");
    await until("fly");
  });

  it("flies home when its door is opened again", async () => {
    vi.useFakeTimers();
    const { home, door } = setup();
    fireEvent.click(door);
    await advance(flightTiming.greet);

    fireEvent.click(door);
    await advance(0);
    expect(home).toHaveAttribute("data-phase", "settling");
    expect(door).toHaveAttribute("aria-pressed", "true");
    expect(door.querySelector("img")).not.toBeNull();

    await advance(flightTiming.settle);
    expect(home).toHaveAttribute("data-phase", "home");
    expect(door).toHaveAttribute("aria-pressed", "false");
    expect(bird()).toBeNull();
  });

  it("takes the bird off the page with the door", async () => {
    vi.useFakeTimers();
    const { door, unmount } = setup();
    fireEvent.click(door);
    await advance(flightTiming.greet);
    expect(bird()).not.toBeNull();
    unmount();
    expect(bird()).toBeNull();
  });

  it("only opens the door under reduced motion", () => {
    vi.spyOn(window, "matchMedia").mockImplementation(
      (query) => ({ matches: query.includes("reduce"), media: query }) as MediaQueryList,
    );
    const { home, door } = setup();

    fireEvent.click(door);
    expect(home).toHaveAttribute("data-phase", "home");
    expect(door).toHaveAttribute("aria-pressed", "true");
    expect(door.querySelector("img")).not.toBeNull();
    expect(bird()).toBeNull();
  });
});
