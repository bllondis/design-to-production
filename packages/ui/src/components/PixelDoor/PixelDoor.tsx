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
}: PixelDoorProps) {
  const [open, setOpen] = useState(initialState === "open");
  const scrolling = useScrollActivity(!still);

  return (
    <button
      type="button"
      className={cx(
        styles.door,
        inset && styles.inset,
        offset && styles.offset,
        initialState === "peek" && styles.peek,
        scrolling && styles.flapping,
      )}
      aria-pressed={open}
      aria-label={open ? "Close the pixel door" : "Open the pixel door"}
      onClick={() => setOpen((value) => !value)}
    >
      <img src={character} alt="" width={360} height={360} loading="lazy" />
      <span className={styles.floor} aria-hidden="true" />
      <span className={styles.leaf} aria-hidden="true" />
    </button>
  );
}
