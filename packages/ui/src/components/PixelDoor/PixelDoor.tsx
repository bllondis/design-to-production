import { useState } from "react";
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
}

/**
 * A dark pixel-art door hiding a character.
 * closed → peek (hover, or flapping while the page scrolls) → open (click). Ajar doors leak warm light.
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
}: PixelDoorProps) {
  const [ownOpen, setOwnOpen] = useState(initialState === "open");
  const open = controlledOpen ?? ownOpen;
  const scrolling = useScrollActivity(!still);

  return (
    <button
      type="button"
      className={cx(
        styles.door,
        inset && styles.inset,
        offset && styles.offset,
        hinge === "right" && styles.hingeRight,
        initialState === "peek" && styles.peek,
        scrolling && styles.flapping,
      )}
      aria-pressed={open}
      aria-hidden={disabled || undefined}
      disabled={disabled}
      aria-label={open ? closeLabel : openLabel}
      onClick={() => {
        setOwnOpen((value) => !value);
        onToggle?.();
      }}
    >
      {!vacant && <img src={character} alt="" width={360} height={360} loading="lazy" />}
      <span className={styles.floor} aria-hidden="true" />
      <span className={styles.leaf} aria-hidden="true" />
    </button>
  );
}
