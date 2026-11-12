import { useEffect, useRef, useState, type CSSProperties } from "react";
import { cx } from "../../lib/cx";
import { prefersReducedMotion } from "../../lib/motion";
import { PixelDoor } from "../PixelDoor/PixelDoor";
import styles from "./PixelBurrow.module.css";

type Phase = "home" | "greeting" | "dropping" | "sinking" | "planted" | "rising" | "falling" | "settling";

/** Both trips in milliseconds; the stylesheet reads the same numbers through custom properties. */
export const burrowTiming = {
  /** The door swings open and the character is seen at home. */
  greet: 700,
  /** A look over the edge, then the careful jump down to the line. */
  drop: 1500,
  /** Working its way into the line, down to the eyes. */
  sink: 2800,
  /** Going under for good while it comes down out of the line above, feet first and kicking. */
  rise: 3000,
  /** One kick of each leg. */
  kick: 300,
  /** Clear of the line above, it drops into the doorway. */
  fall: 460,
  /** The character is seen back home before the door closes. */
  settle: 480,
  /** One twist from side to side as it works its way in, and one sway of its top once planted. */
  twist: 700,
  sway: 3400,
};

export interface PixelBurrowProps {
  /** Image shown behind the door while the character is home. */
  character: string;
  /**
   * The same character on a transparent background: four square frames in a row (stand, one foot up, stand, the
   * other foot up), the standing frame matching `character`. Its legs kick through them as it comes out on top.
   */
  sprite: string;
  /** Where the feet touch down, as a share of the frame height from the top. */
  ground?: number;
  /** How much stays above the line once it has dug in, as a share of the frame height from the top: to under the eyes. */
  eyes?: number;
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
 * A pixel door at the top of a cell and a character that plants itself in the cell's bottom line.
 * Open the door: it jumps down, carefully, and works its way into the line until only its top shows, from the eyes
 * up; the door shuts behind it. Open the door again: it sinks out of sight and, as it goes, comes down out of the
 * cell's top line feet first, legs kicking, until all of it is out and it drops into the doorway. The cell is the nearest positioned ancestor, a frame gutter for
 * one. Under reduced motion nothing leaves and the door is a plain toggle.
 */
export function PixelBurrow({
  character,
  sprite,
  ground = 0.92,
  eyes = 0.64,
  offset = false,
  still = false,
  inset = true,
  openLabel,
  closeLabel,
}: PixelBurrowProps) {
  const [phase, setPhase] = useState<Phase>("home");
  const [open, setOpen] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((timer) => window.clearTimeout(timer));
  }, []);

  const at = (time: number, step: () => void) => timers.current.push(window.setTimeout(step, time));

  const plant = () => {
    const dropAt = burrowTiming.greet;
    const sinkAt = dropAt + burrowTiming.drop;

    setPhase("greeting");
    setOpen(true);
    at(dropAt, () => setPhase("dropping"));
    at(sinkAt, () => {
      setPhase("sinking");
      setOpen(false);
    });
    at(sinkAt + burrowTiming.sink, () => setPhase("planted"));
  };

  const uproot = () => {
    const fallAt = burrowTiming.rise;
    const settleAt = fallAt + burrowTiming.fall;

    setPhase("rising");
    setOpen(true);
    at(fallAt, () => setPhase("falling"));
    at(settleAt, () => setPhase("settling"));
    at(settleAt + burrowTiming.settle, () => {
      timers.current.length = 0;
      setPhase("home");
      setOpen(false);
    });
  };

  const toggle = () => {
    if (prefersReducedMotion()) setOpen((value) => !value);
    else if (phase === "home") plant();
    else if (phase === "planted") uproot();
  };

  return (
    <span
      className={cx(styles.burrow, inset && styles.inset)}
      data-phase={phase}
      style={
        {
          "--burrow-ground": `${ground * 100}%`,
          "--burrow-eyes": `${eyes * 100}%`,
          "--burrow-drop": `${burrowTiming.drop}ms`,
          "--burrow-sink": `${burrowTiming.sink}ms`,
          "--burrow-rise": `${burrowTiming.rise}ms`,
          "--burrow-kick": `${burrowTiming.kick}ms`,
          "--burrow-fall": `${burrowTiming.fall}ms`,
          "--burrow-twist": `${burrowTiming.twist}ms`,
          "--burrow-sway": `${burrowTiming.sway}ms`,
        } as CSSProperties
      }
    >
      <PixelDoor
        character={character}
        offset={offset}
        still={still}
        inset={inset}
        vacant={phase !== "home" && phase !== "greeting" && phase !== "settling"}
        open={open}
        onToggle={toggle}
        openLabel={openLabel}
        closeLabel={closeLabel}
      />
      <span className={styles.plot} aria-hidden="true">
        <span className={styles.mover}>
          <span className={styles.sprite} style={{ backgroundImage: `url(${sprite})` }} />
          <span className={cx(styles.sprite, styles.above)} style={{ backgroundImage: `url(${sprite})` }} />
        </span>
      </span>
    </span>
  );
}
