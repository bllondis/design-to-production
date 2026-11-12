import { useEffect, useRef, useState, type CSSProperties } from "react";
import { cx } from "../../lib/cx";
import { prefersReducedMotion } from "../../lib/motion";
import { PixelDoor } from "../PixelDoor/PixelDoor";
import styles from "./PixelHang.module.css";

type Phase = "home" | "greeting" | "climbing" | "hanging" | "asleep" | "waking" | "returning" | "settling";

/** Both trips in milliseconds. */
export const hangTiming = {
  /** The door swings open and the character is seen at home. */
  greet: 700,
  /** The climb, out over the sill or back in: very, very slow. Out, the second arm takes the last quarter of it. */
  climb: 7600,
  /** Hanging there with its eyes open before they close. */
  doze: 1500,
  /** Eyes open again, and a moment to remember where it is. */
  wake: 1400,
  /** The character is seen back home before the door closes. */
  settle: 480,
  /** One swing to and fro while it sleeps, and the time one snored z takes to drift away. */
  sway: 4600,
  snore: 3600,
};

/** Where a character's arms are, as shares of its square frame measured from the top left. */
export interface HangRig {
  /** The left shoulder, the point its arm turns about. The right arm mirrors the left. */
  shoulder: [number, number];
  /** The claws of the left arm as the character stands. */
  claws: [number, number];
  /** How far along the arm the hand begins; only the arm above it stretches. */
  wrist: number;
  /** How far in from the side of the door the claws take hold of the sill. */
  grip: number;
  /** How far below the sill the shoulders end up. */
  hang: number;
}

export const slothRig: HangRig = {
  shoulder: [0.389, 0.583],
  claws: [0.322, 0.789],
  wrist: 0.75,
  grip: 0.13,
  hang: 0.38,
};

const degrees = (radians: number) => (radians * 180) / Math.PI;
const round = (value: number) => Math.round(value * 1000) / 1000;

// The arm for a body lowered this far below its place in the doorway, in frame heights. Until the shoulders come
// down to the sill the arms swing out towards it; from there on the claws stay put and the arms reach for them.
const armAt = (rig: HangRig, lowered: number) => {
  const [shoulderX, shoulderY] = rig.shoulder;
  const [clawsX, clawsY] = rig.claws;
  const rest = Math.hypot(clawsX - shoulderX, clawsY - shoulderY);
  const lean = Math.atan2(shoulderX - clawsX, clawsY - shoulderY);
  const upper = rest * rig.wrist;
  const reach = (from: number) => {
    const across = rig.grip - shoulderX;
    const down = 1 - (shoulderY + from);
    return { turn: Math.atan2(-across, down), length: Math.hypot(across, down) };
  };

  const takesHold = 1 - shoulderY - 0.04;
  const hold = reach(Math.max(lowered, takesHold));
  const near = Math.min(lowered / takesHold, 1);
  const eased = near * near * (3 - 2 * near);
  const turn = lean + (hold.turn - lean) * eased;
  const stretch = (rest + (hold.length - rest) * eased - (rest - upper)) / upper;
  return { turn: degrees(turn), lean: degrees(lean), stretch, slide: upper * (stretch - 1) * 100 };
};

const smooth = (amount: number) => {
  const held = Math.min(Math.max(amount, 0), 1);
  return held * held * (3 - 2 * held);
};

// Climbing out, the share of the climb spent going down on one arm; the other arm comes up in what is left.
const oneArmed = 0.74;
// How far, in degrees, the body swings in under the one arm it hangs from.
const sag = 7;

/**
 * The whole climb as keyframes for the body, its lean and the four arm pieces, sampled finely enough to pass for
 * exact. Out, it lets itself down on its left arm, the right one at its side, then reaches up with the right
 * and takes hold. In, read backwards, both arms work together.
 */
export const climbFrames = (rig: HangRig, direction: "out" | "in") => {
  const drop = 1 - rig.shoulder[1] + rig.hang;
  const takesHold = 1 - rig.shoulder[1] - 0.04;
  const hung = armAt(rig, drop);
  const steps = 64;
  const frames = {
    body: [] as Keyframe[],
    lean: [] as Keyframe[],
    upper: [[], []] as Keyframe[][],
    hand: [[], []] as Keyframe[][],
  };
  for (let step = 0; step <= steps; step += 1) {
    const time = step / steps;
    const down = direction === "out" ? Math.min(time / oneArmed, 1) : time;
    const lowered = (drop * (1 - Math.cos(Math.PI * down))) / 2;
    const first = armAt(rig, lowered);
    const joining = smooth((time - oneArmed) / (1 - oneArmed));
    const second =
      direction === "in"
        ? first
        : {
            ...first,
            turn: first.lean + (hung.turn - first.lean) * joining,
            stretch: 1 + (hung.stretch - 1) * joining,
            slide: hung.slide * joining,
          };
    const tilt = direction === "in" ? 0 : sag * smooth((lowered - takesHold) / (drop - takesHold)) * (1 - joining);

    frames.body.push({ translate: `0 ${round(lowered * 100)}%` });
    frames.lean.push({ transform: `rotate(${round(tilt)}deg)` });
    [first, second].forEach(({ turn, lean, stretch, slide }, index) => {
      const side = index === 0 ? 1 : -1;
      const swing = `rotate(${round(side * turn)}deg)`;
      const straighten = `rotate(${round(-side * lean)}deg)`;
      frames.upper[index].push({ transform: `${swing} scaleY(${round(stretch)}) ${straighten}` });
      frames.hand[index].push({ transform: `${swing} translateY(${round(slide)}%) ${straighten}` });
    });
  }
  return frames;
};

export interface PixelHangProps {
  /** Image shown behind the door while the character is home. */
  character: string;
  /**
   * The same character in layers on a transparent background: six square frames in a row — the body without its
   * arms, the body asleep, then the left upper arm, left hand, right upper arm and right hand.
   */
  sprite: string;
  /** Where the arms are and how they take hold; the default fits the sloth. */
  rig?: HangRig;
  /** Flap half a beat after neighbouring doors, so stacked doors don't move in unison. */
  offset?: boolean;
  /** Ignore page scrolling (specimens); hover and click still work. */
  still?: boolean;
  /** Keep the top inset that lines the door up with the row's content (default on). */
  inset?: boolean;
  /** Accessible labels for the closed and the open door. */
  openLabel?: string;
  closeLabel?: string;
  /** Short visual prompt revealed on a touch screen after the first tap on the door. */
  hint?: string;
}

/**
 * A pixel door and a character too slow to go anywhere. Open the door: it lets itself down over the sill on one
 * arm, very slowly, reaches up with the other, and hangs from the door's bottom edge by its claws; there it falls
 * asleep, and the door shuts above it.
 * Open the door again: it wakes and climbs back in, just as slowly. It needs a door's height of room below the door.
 * Under reduced motion nothing leaves and the door is a plain toggle.
 */
export function PixelHang({
  character,
  sprite,
  rig = slothRig,
  offset = false,
  still = false,
  inset = true,
  openLabel,
  closeLabel,
  hint,
}: PixelHangProps) {
  const [phase, setPhase] = useState<Phase>("home");
  const [open, setOpen] = useState(false);
  const timers = useRef<number[]>([]);
  const moves = useRef<Animation[]>([]);
  const body = useRef<HTMLSpanElement>(null);
  const lean = useRef<HTMLSpanElement>(null);
  const upperLeft = useRef<HTMLSpanElement>(null);
  const handLeft = useRef<HTMLSpanElement>(null);
  const upperRight = useRef<HTMLSpanElement>(null);
  const handRight = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const pending = timers.current;
    const playing = moves.current;
    return () => {
      pending.forEach((timer) => window.clearTimeout(timer));
      playing.forEach((move) => move.cancel());
    };
  }, []);

  const at = (time: number, step: () => void) => timers.current.push(window.setTimeout(step, time));

  // Plays the climb out, or the same climb backwards, and leaves every piece where it ends.
  const climb = (direction: "out" | "in") => {
    const frames = climbFrames(rig, direction);
    const parts: [HTMLSpanElement | null, Keyframe[]][] = [
      [body.current, frames.body],
      [lean.current, frames.lean],
      [upperLeft.current, frames.upper[0]],
      [handLeft.current, frames.hand[0]],
      [upperRight.current, frames.upper[1]],
      [handRight.current, frames.hand[1]],
    ];
    moves.current.forEach((move) => move.cancel());
    moves.current.length = 0;
    parts.forEach(([piece, steps]) => {
      if (!piece) return;
      const path = direction === "out" ? steps : [...steps].reverse();
      const last = path[path.length - 1];
      piece.style.translate = String(last.translate ?? "");
      piece.style.transform = String(last.transform ?? "");
      if (typeof piece.animate === "function") {
        moves.current.push(piece.animate(path, { duration: hangTiming.climb, easing: "linear" }));
      }
    });
  };

  const climbOut = () => {
    const climbAt = hangTiming.greet;
    const hangAt = climbAt + hangTiming.climb;

    setPhase("greeting");
    setOpen(true);
    at(climbAt, () => {
      setPhase("climbing");
      climb("out");
    });
    at(hangAt, () => {
      setPhase("hanging");
      setOpen(false);
    });
    at(hangAt + hangTiming.doze, () => setPhase("asleep"));
  };

  const climbIn = () => {
    const climbAt = hangTiming.wake;
    const settleAt = climbAt + hangTiming.climb;

    setPhase("waking");
    setOpen(true);
    at(climbAt, () => {
      setPhase("returning");
      climb("in");
    });
    at(settleAt, () => setPhase("settling"));
    at(settleAt + hangTiming.settle, () => {
      timers.current.length = 0;
      setPhase("home");
      setOpen(false);
    });
  };

  const toggle = () => {
    if (prefersReducedMotion()) setOpen((value) => !value);
    else if (phase === "home") climbOut();
    else if (phase === "asleep") climbIn();
  };

  const layer = { backgroundImage: `url(${sprite})` };

  return (
    <span
      className={cx(styles.hang, inset && styles.inset)}
      data-phase={phase}
      style={
        {
          "--hang-shoulder-x": `${rig.shoulder[0] * 100}%`,
          "--hang-shoulder-y": `${rig.shoulder[1] * 100}%`,
          "--hang-grip-x": `${rig.grip * 100}%`,
          "--hang-sway": `${hangTiming.sway}ms`,
          "--hang-snore": `${hangTiming.snore}ms`,
        } as CSSProperties
      }
    >
      <PixelDoor
        character={character}
        offset={offset}
        still={still}
        inset={false}
        vacant={phase !== "home" && phase !== "greeting" && phase !== "settling"}
        open={open}
        onToggle={toggle}
        openLabel={openLabel}
        closeLabel={closeLabel}
        hint={hint}
      />
      <span className={styles.stage} aria-hidden="true">
        <span className={styles.swing}>
          <span ref={lean} className={styles.lean}>
            <span ref={body} className={styles.figure}>
              <span ref={upperLeft} className={cx(styles.layer, styles.left, styles.upperLeft)} style={layer} />
              <span ref={handLeft} className={cx(styles.layer, styles.left, styles.handLeft)} style={layer} />
              <span ref={upperRight} className={cx(styles.layer, styles.right, styles.upperRight)} style={layer} />
              <span ref={handRight} className={cx(styles.layer, styles.right, styles.handRight)} style={layer} />
              <span className={cx(styles.layer, styles.body)} style={layer} />
              <span className={styles.snore}>
                <span>z</span>
                <span>z</span>
                <span>z</span>
              </span>
            </span>
          </span>
        </span>
      </span>
    </span>
  );
}
