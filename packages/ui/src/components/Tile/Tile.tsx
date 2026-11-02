import { cx } from "../../lib/cx";
import styles from "./Tile.module.css";

export interface TileProps {
  label: string;
  /** Keep the top inset that lines the tile up with the row's content (default on). */
  inset?: boolean;
}

/** Square chapter marker for the frame gutter. Same footprint as PixelDoor. */
export function Tile({ label, inset = true }: TileProps) {
  return (
    <span className={cx(styles.tile, inset && styles.inset)} aria-hidden="true">
      {label}
    </span>
  );
}
