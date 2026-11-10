import { useEffect, useRef, useState, type CSSProperties } from "react";
import { cx } from "../../lib/cx";
import { prefersReducedMotion } from "../../lib/motion";
import { PixelDoor } from "../PixelDoor/PixelDoor";
import styles from "./PixelWalk.module.css";

type Side = "start" | "end";
type Phase = "home" | "greeting" | "leaping" | "strolling" | "bowing" | "entering" | "settling";

const sides: Side[] = ["start", "end"];
const across = (side: Side): Side => (side === "start" ? "end" : "start");
const shut: Record<Side, boolean> = { start: false, end: false };

/** One run in milliseconds; the stylesheet reads the same numbers through custom properties. */
export const walkTiming = {
  /** The door swings open and the character is seen at home. */
  greet: 700,
  /** One jump: out of a door and down to the floor, or back up into the other one. */
  leap: 760,
  /** The walk along the floor. Doors are a twelfth of the row, so pace is the same at any width. */
  stroll: 4600,
  /** How long before arrival the far door opens. */
  welcome: 600,
  /** The character is seen in its new home before the door closes. */
  settle: 480,
  /** One full walk cycle, two steps. */
  cycle: 520,
  /** A bow in the middle of the row, and the share of the full walk it takes to get there. */
  bow: 1500,
  halfway: 0.46,
};

export interface PixelWalkProps {
  /** Image shown behind the door the character is in. */
  character: string;
  /**
   * Walk cycle of the same character on a transparent background: four square frames in a row
   * (stand, one foot up, stand, the other foot up), the standing frame matching `character`.
   */
  sprite: string;
  /** Where the feet touch down, as a share of the frame height from the top. */
  ground?: number;
  /**
   * Where the walk goes: "across" (default) to a second door at the far end of the row, or "bow" out to the middle
   * of the row, a bow, and back to the one door.
   */
  route?: "across" | "bow";
  /** How the character leaves a door and enters one: a plain "jump" (default) or a somersault, "flip". */
  leap?: "jump" | "flip";
  /** Flap half a beat after neighbouring doors, so stacked doors don't move in unison. */
  offset?: boolean;
  /** Ignore page scrolling (specimens); hover and click still work. */
  still?: boolean;
  /** Keep the top inset that lines the doors up with the row's content (default on). */
  inset?: boolean;
  /** Accessible labels for a closed and an open door. */
  openLabel?: string;
  closeLabel?: string;
}

/**
 * Pixel doors at the ends of a row and the character that lives behind one of them.
 * Click that door: it opens, the character jumps out, walks the bottom line of the row and hops into the door
 * across, which shuts behind it and becomes the one to click. The empty door stays inert. With `route="bow"` there
 * is one door: the character walks to the middle of the row, bows and walks back. Fill a row with it; each door is
 * a twelfth of the width, like the frame gutters. Under reduced motion nothing travels and the character's door is
 * a plain toggle.
 */
export function PixelWalk({
  character,
  sprite,
  ground = 0.936,
  route = "across",
  leap = "jump",
  offset = false,
  still = false,
  inset = true,
  openLabel,
  closeLabel,
}: PixelWalkProps) {
  const [home, setHome] = useState<Side>("start");
  const [phase, setPhase] = useState<Phase>("home");
  const [open, setOpen] = useState(shut);
  // On the bow route: walking out to the middle, or back from it.
  const [leg, setLeg] = useState<"out" | "back">("out");
  const strollTime = route === "bow" ? walkTiming.stroll * walkTiming.halfway : walkTiming.stroll;
  const timers = useRef<number[]>([]);
  const stage = useRef<HTMLDivElement>(null);
  const focusFollows = useRef(false);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((timer) => window.clearTimeout(timer));
  }, []);

  // Keyboard focus was on the door the character left; hand it to the door it moved into.
  useEffect(() => {
    if (!focusFollows.current) return;
    focusFollows.current = false;
    stage.current?.querySelector<HTMLButtonElement>("button:enabled")?.focus({ preventScroll: true });
  }, [home]);

  const at = (time: number, step: () => void) => timers.current.push(window.setTimeout(step, time));

  const run = () => {
    const from = home;
    const to = across(from);
    const leapAt = walkTiming.greet;
    const strollAt = leapAt + walkTiming.leap;
    const enterAt = strollAt + walkTiming.stroll;
    const settleAt = enterAt + walkTiming.leap;

    focusFollows.current = stage.current?.contains(document.activeElement) ?? false;
    setPhase("greeting");
    setOpen({ ...shut, [from]: true });
    at(leapAt, () => setPhase("leaping"));
    at(strollAt, () => {
      setPhase("strolling");
      setOpen(shut);
    });
    at(enterAt - walkTiming.welcome, () => setOpen({ ...shut, [to]: true }));
    at(enterAt, () => setPhase("entering"));
    at(settleAt, () => setPhase("settling"));
    at(settleAt + walkTiming.settle, () => {
      timers.current.length = 0;
      setHome(to);
      setPhase("home");
      setOpen(shut);
    });
  };

  // Out to the middle of the row, a bow, and back in through the same door.
  const takeBow = () => {
    const leapAt = walkTiming.greet;
    const strollAt = leapAt + walkTiming.leap;
    const bowAt = strollAt + strollTime;
    const backAt = bowAt + walkTiming.bow;
    const enterAt = backAt + strollTime;
    const settleAt = enterAt + walkTiming.leap;

    setPhase("greeting");
    setOpen({ ...shut, [home]: true });
    at(leapAt, () => setPhase("leaping"));
    at(strollAt, () => {
      setPhase("strolling");
      setOpen(shut);
    });
    at(bowAt, () => setPhase("bowing"));
    at(backAt, () => {
      setLeg("back");
      setPhase("strolling");
    });
    at(enterAt - walkTiming.welcome, () => setOpen({ ...shut, [home]: true }));
    at(enterAt, () => setPhase("entering"));
    at(settleAt, () => setPhase("settling"));
    at(settleAt + walkTiming.settle, () => {
      timers.current.length = 0;
      setLeg("out");
      setPhase("home");
      setOpen(shut);
    });
  };

  const toggle = (side: Side) => {
    if (phase !== "home") return;
    if (prefersReducedMotion()) setOpen((doors) => ({ ...doors, [side]: !doors[side] }));
    else if (route === "bow") takeBow();
    else run();
  };

  // The picture behind a door: at home until the jump, then wherever the character has landed.
  const arrival = route === "bow" ? home : across(home);
  const lodger = phase === "settling" ? arrival : phase === "home" || phase === "greeting" ? home : null;

  return (
    <div
      ref={stage}
      className={cx(styles.walk, inset && styles.inset)}
      data-from={home}
      data-phase={phase}
      data-route={route}
      data-leap={leap}
      data-leg={leg}
      style={
        {
          "--walk-ground": `${ground * 100}%`,
          "--walk-leap": `${walkTiming.leap}ms`,
          "--walk-stroll": `${strollTime}ms`,
          "--walk-bow": `${walkTiming.bow}ms`,
          "--walk-cycle": `${walkTiming.cycle}ms`,
        } as CSSProperties
      }
    >
      {(route === "bow" ? sides.slice(0, 1) : sides).map((side) => (
        <div key={side} className={cx(styles.slot, side === "end" && styles.slotEnd)}>
          <PixelDoor
            character={character}
            offset={offset}
            still={still}
            inset={inset}
            hinge={side === "end" ? "right" : "left"}
            vacant={lodger !== side}
            disabled={route === "across" && lodger !== side}
            open={open[side]}
            onToggle={() => toggle(side)}
            openLabel={openLabel}
            closeLabel={closeLabel}
          />
        </div>
      ))}
      <span className={styles.walker} aria-hidden="true">
        <span className={styles.hop}>
          <span className={styles.sprite} style={{ backgroundImage: `url(${sprite})` }} />
        </span>
      </span>
    </div>
  );
}
