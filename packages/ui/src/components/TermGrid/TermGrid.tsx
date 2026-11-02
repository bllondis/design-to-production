import { cx } from "../../lib/cx";
import styles from "./TermGrid.module.css";

export interface Term {
  term: string;
  detail: string;
}

export interface TermGridProps {
  items: Term[];
  /** "term" sets the term large and the detail as a mono note; "detail" flips that for short keys with longer values. */
  emphasis?: "term" | "detail";
  columns?: 2 | 3 | 4;
}

/** A grid of short terms with one-line explanations, e.g. edge cases and how each was handled. */
export function TermGrid({ items, emphasis = "term", columns = 4 }: TermGridProps) {
  return (
    <div className={styles.frame}>
      <dl className={cx(styles.grid, styles[`columns${columns}`], emphasis === "detail" && styles.flipped)}>
        {items.map((item) => (
          <div key={item.term} className={styles.cell}>
            <dt className={styles.term}>{item.term}</dt>
            <dd className={`${styles.detail} text-label-m`}>{item.detail}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
