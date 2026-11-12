import { useEffect, useRef, useState } from "react";
import { cx } from "../../lib/cx";
import { useScrollActivity } from "../../lib/hooks";
import styles from "./PixelDoor.module.css";

export type DoorState = "closed" | "peek" | "open";

export interface PixelDoorProps {
  /** Image shown behind the door. */
  character: string;
  /** Flap half a beat after neighbouring doors, so stacked doors don't move in unison. */
  offset?: boolean;
  /** Ignore page scrolling (specimens); hover and click still work. */
  still?: boolean;
  /** Starting state; "peek" holds the door ajar, which is useful for documentation. */
  initialState?: DoorState;
  /** Keep the top inset that lines the door up with the row's content (default on). */
  inset?: boolean;
  /** Edge the leaf hangs on. A door in the right-hand gutter hangs on the right, so both sides swing outwards. */
  hinge?: "left" | "right";
  /** Nobody home: the door opens onto the empty dark. */
  vacant?: boolean;
  /** Nothing to open: the door ignores the pointer and keyboard and is hidden from assistive tech. */
  disabled?: boolean;
  /** Open state when a parent drives the door (PixelWalk); leave out and the door toggles itself. */
  open?: boolean;
  /** Called on every click. */
  onToggle?: () => void;
  /** Accessible labels for the closed and open states. */
  openLabel?: string;
  closeLabel?: string;
  /** Short visual prompt revealed whenever this enabled door is hovered, pressed or tapped once on a touch screen. */
  hint?: string;
}

/**
 * A dark pixel-art door hiding a character.
 * closed → peek (hover, or flapping while the page scrolls) → open (click). Ajar doors leak warm light.
 * On a touch screen the first tap stands in for hover (hint and flapping), and the second opens the door.
 */
export function PixelDoor({
  character,
  offset = false,
  still = false,
  initialState = "closed",
  inset = true,
  hinge = "left",
  vacant = false,
  disabled = false,
  open: controlledOpen,
  onToggle,
  openLabel = "Open the pixel door",
  closeLabel = "Close the pixel door",
  hint,
}: PixelDoorProps) {
  const [ownOpen, setOwnOpen] = useState(initialState === "open");
  const open = controlledOpen ?? ownOpen;
  const scrolling = useScrollActivity(!still);
  // A touch screen has no hover, so the first tap on a closed door stands in for it: the hint shows and the door
  // rattles. The next tap opens it; a tap anywhere else lets it rest again.
  const [armed, setArmed] = useState(false);
  const pointer = useRef("");
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!armed) return;
    const rest = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) setArmed(false);
    };
    document.addEventListener("pointerdown", rest);
    return () => document.removeEventListener("pointerdown", rest);
  }, [armed]);

  return (
    <button
      ref={ref}
      type="button"
      className={cx(
        styles.door,
        inset && styles.inset,
        offset && styles.offset,
        hinge === "right" && styles.hingeRight,
        initialState === "peek" && styles.peek,
        (scrolling || armed) && styles.flapping,
        armed && styles.armed,
      )}
      aria-pressed={open}
      aria-hidden={disabled || undefined}
      disabled={disabled}
      aria-label={open ? closeLabel : openLabel}
      onPointerDown={(event) => {
        pointer.current = event.pointerType;
      }}
      onClick={() => {
        // A finger, or any pointer on a screen that cannot hover; the keyboard opens the door straight away.
        const touch =
          pointer.current === "touch" || (pointer.current !== "" && window.matchMedia("(hover: none)").matches);
        pointer.current = "";
        if (touch && !open && !armed) {
          setArmed(true);
          return;
        }
        setArmed(false);
        setOwnOpen((value) => !value);
        onToggle?.();
      }}
    >
      {!vacant && <img src={character} alt="" width={360} height={360} loading="lazy" />}
      <span className={styles.floor} aria-hidden="true" />
      <span className={styles.leaf} aria-hidden="true" />
      {hint && (
        <span className={`${styles.hint} text-label-s`} data-door-hint aria-hidden="true">
          <span className={styles.hintBubble}>{hint}</span>
        </span>
      )}
    </button>
  );
}
