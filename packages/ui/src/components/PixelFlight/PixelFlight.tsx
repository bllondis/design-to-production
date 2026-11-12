import { useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { prefersReducedMotion } from "../../lib/motion";
import { PixelDoor } from "../PixelDoor/PixelDoor";
import styles from "./PixelFlight.module.css";

type Phase = "home" | "greeting" | "out" | "returning" | "settling";
type Mode = "perch" | "walk" | "fly";
type Point = { x: number; y: number };
type Perch = { line: Element; spot: Point };

/** The outing in milliseconds, and the bird's pace in body lengths. */
export const flightTiming = {
  /** The door swings open and the bird is seen at home. */
  greet: 700,
  /** The flutter from the doorway down to the line below. */
  hop: 640,
  /** One full walk cycle, two steps; the bird takes `strides` of them before taking off. */
  cycle: 520,
  strides: 2,
  /** How often a rested bird takes a walk along its line before flying on, and for how many walk cycles. */
  wander: 0.5,
  stroll: [2, 5],
  /** How far one walk cycle carries the bird, in body lengths. */
  stride: 0.45,
  /** One flap of the wings. */
  flap: 340,
  /** The shortest and longest time spent on a perch. */
  rest: [2600, 6000],
  /** The bird is seen back home before the door closes. */
  settle: 480,
  /** Flying speed in body lengths a second, and the bounds any one flight is held to. */
  pace: 4.2,
  flight: [760, 2600],
  /** How near the pointer may come, in body lengths, before the bird takes fright. */
  shy: 1.3,
  /** A frightened bird flies this many times faster, and only pauses this long if it lands by the pointer again. */
  haste: 1.7,
  flinch: 260,
};

const between = (low: number, high: number) => low + Math.random() * (high - low);
const clamp = (value: number, low: number, high: number) => Math.min(Math.max(value, low), high);

// Points along a swoop from one spot to another: up off the perch, over, and down onto the next.
const swoop = (from: Point, to: Point, lift: number): Point[] => {
  const span = to.x - from.x;
  const first = { x: from.x + span * 0.25, y: from.y - lift };
  const second = { x: from.x + span * 0.75, y: to.y - lift * between(0.5, 0.9) };
  return Array.from({ length: 25 }, (_, index) => {
    const t = index / 24;
    const u = 1 - t;
    return {
      x: u ** 3 * from.x + 3 * u * u * t * first.x + 3 * u * t * t * second.x + t ** 3 * to.x,
      y: u ** 3 * from.y + 3 * u * u * t * first.y + 3 * u * t * t * second.y + t ** 3 * to.y,
    };
  });
};

export interface PixelFlightProps {
  /** Image shown behind the door while the bird is home. It faces right. */
  character: string;
  /** Walk cycle on a transparent background, as for PixelWalk: stand, one foot up, stand, the other foot up. */
  walk: string;
  /** One flap on a transparent background: four square frames in a row, wing up, level, down, level. */
  flight: string;
  /** Where the feet touch down, as a share of the frame height from the top. */
  ground?: number;
  /** Selector for the lines the bird may land on; it sits on an element's top edge. */
  perches?: string;
  /** Edge the door's leaf hangs on; the bird hops out the other way. */
  hinge?: "left" | "right";
  /** Flap half a beat after neighbouring doors, so stacked doors don't move in unison. */
  offset?: boolean;
  /** Ignore page scrolling (specimens); hover and click still work. */
  still?: boolean;
  /** Keep the top inset that lines the door up with the row's content (default on). */
  inset?: boolean;
  /** Accessible labels for the closed and the open door. */
  openLabel?: string;
  closeLabel?: string;
}

/**
 * A pixel door with a bird behind it. Open the door and the bird flutters down to the line below, and the door
 * shuts behind it. It walks a couple of steps and takes off: it flies about the page, resting on the lines marked
 * as perches, wherever the reader is, now and then walking a little way along one first, and flees to a far perch
 * when the pointer comes close. Open the door again and the bird flies home, and the door shuts on it.
 * Under reduced motion nothing leaves and the door is a plain toggle.
 */
export function PixelFlight({
  character,
  walk,
  flight,
  ground = 0.89,
  perches = "[data-perch]",
  hinge = "left",
  offset = false,
  still = false,
  inset = true,
  openLabel,
  closeLabel,
}: PixelFlightProps) {
  const [phase, setPhase] = useState<Phase>("home");
  const [mode, setMode] = useState<Mode>("perch");
  const [facing, setFacing] = useState<1 | -1>(1);
  const [open, setOpen] = useState(false);
  // The bird is as big as its door and starts out standing in the doorway, in page coordinates.
  const [size, setSize] = useState(0);
  const [doorstep, setDoorstep] = useState<Point>({ x: 0, y: 0 });
  const home = useRef<HTMLSpanElement>(null);
  const bird = useRef<HTMLSpanElement>(null);
  // Bumped to call off whatever the bird was doing; every step of an outing checks it is still the current one.
  const outing = useRef(0);
  const timers = useRef<number[]>([]);
  const motion = useRef<Animation | null>(null);
  const cutRestShort = useRef<(() => void) | null>(null);
  // Where the pointer last was in the window, and whether the bird is sitting still enough to notice it.
  const pointer = useRef<Point | null>(null);
  const resting = useRef(false);
  // Where a walk was stopped short by the pointer.
  const stoppedAt = useRef<Point | null>(null);

  const door = () => home.current?.querySelector("button") ?? null;
  const scrolled = (rect: DOMRect): Point => ({ x: rect.left + window.scrollX, y: rect.top + window.scrollY });

  const pause = (time: number) =>
    new Promise<void>((resolve) => {
      cutRestShort.current = resolve;
      timers.current.push(window.setTimeout(resolve, time));
    });

  // True when the pointer is within the bird's nerve of it.
  const spooked = () => {
    const rect = bird.current?.getBoundingClientRect();
    if (!rect || !pointer.current) return false;
    const reach = Math.hypot(
      pointer.current.x - (rect.left + rect.width / 2),
      pointer.current.y - (rect.top + rect.height / 2),
    );
    return reach < rect.width * flightTiming.shy;
  };

  // Moves the bird along the points and leaves it on the last one.
  const travel = (points: Point[], duration: number, easing: string) => {
    const element = bird.current;
    const last = points[points.length - 1];
    if (!element) return Promise.resolve();
    motion.current?.cancel();
    element.style.translate = `${last.x}px ${last.y}px`;
    if (typeof element.animate !== "function") return Promise.resolve();
    const animation = element.animate(
      points.map((point) => ({ translate: `${point.x}px ${point.y}px` })),
      { duration, easing },
    );
    motion.current = animation;
    return animation.finished.then(
      () => undefined,
      () => undefined,
    );
  };

  // A little way along the line the bird is on, one way or the other, as far as the line goes.
  const strollAlong = (line: Element, from: Point, body: number): Point => {
    const rect = line.getBoundingClientRect();
    const [fewest, most] = flightTiming.stroll;
    const reach = Math.floor(between(fewest, most)) * flightTiming.stride * body;
    const leftmost = rect.left + window.scrollX;
    const rightmost = rect.right + window.scrollX - body;
    const heading = Math.random() < 0.5 ? -1 : 1;
    const turned = from.x + heading * reach < leftmost || from.x + heading * reach > rightmost ? -heading : heading;
    return { x: clamp(from.x + turned * reach, leftmost, rightmost), y: from.y };
  };

  const flyTo = (from: Point, to: Point, body: number, { duration = 0, haste = 1 } = {}) => {
    const distance = Math.hypot(to.x - from.x, to.y - from.y);
    const [quickest, slowest] = flightTiming.flight;
    setMode("fly");
    if (to.x !== from.x) setFacing(to.x > from.x ? 1 : -1);
    return travel(
      swoop(from, to, clamp(distance * 0.3, body * 0.5, body * 2.2) * between(0.7, 1.2)),
      duration || clamp((distance / (body * flightTiming.pace)) * 1000, quickest, slowest) / haste,
      "ease-in-out",
    );
  };

  // A spot on one of the lines in view, or failing that on the line nearest the middle of the window.
  // A bird fleeing the pointer weighs up a handful of spots and takes the one furthest from it.
  const findPerch = (body: number, avoid?: Element, fleeing?: Point | null): Perch | null => {
    const lines = [...document.querySelectorAll(perches)]
      .map((line) => ({ line, rect: line.getBoundingClientRect() }))
      .filter(({ rect }) => rect.width >= body * 2);
    if (lines.length === 0) return null;
    const inView = lines.filter(({ rect }) => rect.top - ground * body >= 0 && rect.top <= window.innerHeight);
    const nearest = [...lines].sort(
      (a, b) => Math.abs(a.rect.top - window.innerHeight / 2) - Math.abs(b.rect.top - window.innerHeight / 2),
    );
    const fresh = inView.filter(({ line }) => line !== avoid || fleeing);
    const pool = fresh.length > 0 ? fresh : inView.length > 0 ? inView : nearest.slice(0, 1);
    const spots = Array.from({ length: fleeing ? 8 : 1 }, () => {
      const { line, rect } = pool[Math.floor(Math.random() * pool.length)];
      const left = rect.left + between(0, rect.width - body);
      const top = rect.top - ground * body;
      const clear = fleeing ? Math.hypot(left + body / 2 - fleeing.x, top + body / 2 - fleeing.y) : 0;
      return { line, clear, spot: { x: left + window.scrollX, y: top + window.scrollY } };
    });
    return spots.reduce((furthest, next) => (next.clear > furthest.clear ? next : furthest));
  };

  // The line under the doorway: the first perch below the door that reaches under it.
  const findFloor = (doorway: DOMRect) => {
    const below = [...document.querySelectorAll(perches)]
      .map((line) => ({ line, rect: line.getBoundingClientRect() }))
      .filter(({ rect }) => rect.top >= doorway.bottom && rect.left <= doorway.left && rect.right >= doorway.right)
      .sort((a, b) => a.rect.top - b.rect.top);
    return below.length > 0 ? { line: below[0].line, top: below[0].rect.top + window.scrollY } : null;
  };

  const leave = async () => {
    const trip = (outing.current += 1);
    const called = () => trip !== outing.current;
    const doorway = door()?.getBoundingClientRect();
    if (!doorway) return;
    const body = doorway.width;
    const inward = hinge === "right" ? -1 : 1;
    let spot = scrolled(doorway);

    setSize(body);
    setDoorstep(spot);
    setPhase("greeting");
    setOpen(true);
    await pause(flightTiming.greet);
    if (called()) return;

    setPhase("out");
    setFacing(inward);

    const floor = findFloor(doorway);
    if (floor) {
      const landing = { x: spot.x + inward * body * 1.05, y: floor.top - ground * body };
      await flyTo(spot, landing, body, { duration: flightTiming.hop });
      if (called()) return;
      setOpen(false);
      spot = { x: landing.x + inward * body * flightTiming.stride * flightTiming.strides, y: landing.y };
      setMode("walk");
      await travel([landing, spot], flightTiming.cycle * flightTiming.strides, "linear");
      if (called()) return;
    }
    // The door shuts behind the bird, as soon as it has landed or, with no line to land on, straight away.
    setOpen(false);

    let line = floor?.line;
    while (!called()) {
      const [briefest, longest] = flightTiming.rest;
      const fleeing = spooked() ? pointer.current : null;
      const perch = findPerch(body, line, fleeing);
      if (perch) {
        await flyTo(spot, perch.spot, body, { haste: fleeing ? flightTiming.haste : 1 });
        if (called()) return;
        spot = perch.spot;
        line = perch.line;
      }
      setMode("perch");
      resting.current = true;
      await pause(spooked() ? flightTiming.flinch : between(briefest, longest));
      if (!called() && line && !spooked() && Math.random() < flightTiming.wander) {
        const from = spot;
        spot = strollAlong(line, from, body);
        const strides = Math.abs(spot.x - from.x) / (flightTiming.stride * body);
        if (spot.x !== from.x) setFacing(spot.x > from.x ? 1 : -1);
        setMode("walk");
        stoppedAt.current = null;
        await travel([from, spot], flightTiming.cycle * strides, "linear");
        spot = stoppedAt.current ?? spot;
      }
      resting.current = false;
    }
  };

  const comeHome = async () => {
    const trip = (outing.current += 1);
    const element = bird.current;
    const doorway = door()?.getBoundingClientRect();
    if (!element || !doorway) return;

    setPhase("returning");
    setOpen(true);
    await flyTo(scrolled(element.getBoundingClientRect()), scrolled(doorway), doorway.width);
    if (trip !== outing.current) return;
    setFacing(1);
    setMode("perch");
    setPhase("settling");
    await pause(flightTiming.settle);
    if (trip !== outing.current) return;
    setPhase("home");
    setOpen(false);
  };

  const toggle = () => {
    if (prefersReducedMotion()) setOpen((value) => !value);
    else if (phase === "home") void leave();
    else if (phase === "out") void comeHome();
  };

  // A resized page moves its lines: the bird sets off for a fresh perch, or is simply home again if its door has
  // gone with the gutters.
  useEffect(() => {
    if (phase !== "out") return;
    const onResize = () => {
      if (home.current?.querySelector("button")?.getClientRects().length) {
        cutRestShort.current?.();
        return;
      }
      outing.current += 1;
      motion.current?.cancel();
      setPhase("home");
      setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [phase]);

  // The bird watches the pointer while it is out, and takes off if it comes close while the bird is resting.
  // Scrolling can bring the two together just as well as moving the mouse.
  useEffect(() => {
    if (phase !== "out") return;
    const startle = () => {
      const element = bird.current;
      if (!element || !resting.current || !spooked()) return;
      // Caught mid-walk, it stops where it stands and takes off from there.
      if (motion.current?.playState === "running") {
        const at = scrolled(element.getBoundingClientRect());
        stoppedAt.current = at;
        motion.current.cancel();
        element.style.translate = `${at.x}px ${at.y}px`;
      }
      cutRestShort.current?.();
    };
    const onPointer = (event: PointerEvent) => {
      pointer.current = { x: event.clientX, y: event.clientY };
      startle();
    };
    const onLeave = () => {
      pointer.current = null;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerdown", onPointer, { passive: true });
    window.addEventListener("scroll", startle, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      pointer.current = null;
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("scroll", startle);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [phase]);

  useEffect(() => {
    const pending = timers.current;
    return () => {
      outing.current += 1;
      pending.forEach((timer) => window.clearTimeout(timer));
      motion.current?.cancel();
    };
  }, []);

  const away = phase === "out" || phase === "returning";

  return (
    <span ref={home} className={styles.home} data-phase={phase}>
      <PixelDoor
        character={character}
        offset={offset}
        still={still}
        inset={inset}
        hinge={hinge}
        vacant={away}
        open={open}
        onToggle={toggle}
        openLabel={openLabel}
        closeLabel={closeLabel}
      />
      {phase !== "home" &&
        createPortal(
          <span
            ref={bird}
            className={styles.bird}
            data-mode={mode}
            data-facing={facing}
            data-out={away || phase === "settling" || undefined}
            aria-hidden="true"
            style={
              {
                width: size,
                height: size,
                translate: `${doorstep.x}px ${doorstep.y}px`,
                "--flight-ground": `${ground * 100}%`,
                "--flight-cycle": `${flightTiming.cycle}ms`,
                "--flight-flap": `${flightTiming.flap}ms`,
              } as CSSProperties
            }
          >
            <span className={styles.pose}>
              <span className={styles.walking} style={{ backgroundImage: `url(${walk})` }} />
              <span className={styles.flying} style={{ backgroundImage: `url(${flight})` }} />
            </span>
          </span>,
          document.body,
        )}
    </span>
  );
}
