import type { CSSProperties } from "react";
import styles from "./StatRow.module.css";

export interface Stat {
  value: string;
  /** Small trailing mark such as "+" or "%". */
  suffix?: string;
  label: string;
}

/** A row of headline numbers. Collapses to a column on narrow screens. */
export function StatRow({ items }: { items: Stat[] }) {
  return (
    <dl className={styles.row} style={{ "--stat-columns": items.length } as CSSProperties}>
      {items.map((item) => (
        <div key={item.label} className={styles.stat}>
          <dt className={`${styles.label} text-label-m`}>{item.label}</dt>
          <dd className={styles.value}>
            {item.value}
            {item.suffix && <span className={styles.suffix}>{item.suffix}</span>}
          </dd>
        </div>
      ))}
    </dl>
  );
}
