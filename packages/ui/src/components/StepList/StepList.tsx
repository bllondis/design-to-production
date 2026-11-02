import type { CSSProperties } from "react";
import styles from "./StepList.module.css";

export interface Step {
  /** Mono label, e.g. "Work signals" or "Foundations". */
  label: string;
  title: string;
  detail?: string;
}

/** Numbered stages of a flow, read left to right; stacks on narrow screens. */
export function StepList({ items }: { items: Step[] }) {
  return (
    <ol className={styles.list} style={{ "--step-columns": items.length } as CSSProperties}>
      {items.map((item, index) => (
        <li key={item.title} className={styles.step}>
          <span className={`${styles.label} text-label-m`}>
            {String(index + 1).padStart(2, "0")} / {item.label}
          </span>
          <strong className={styles.title}>{item.title}</strong>
          {item.detail && <span className={styles.detail}>{item.detail}</span>}
        </li>
      ))}
    </ol>
  );
}
