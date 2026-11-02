import styles from "./Checklist.module.css";

export interface ChecklistItem {
  title: string;
  detail?: string;
  /** Small mono tag after the title, e.g. a colour value. */
  tag?: string;
}

export interface ChecklistProps {
  items: ChecklistItem[];
  /** "check" for principles that hold, "number" for an ordered set of outcomes. */
  marker?: "check" | "number";
}

/** Principles or outcomes as a ruled list: marker, title, one-line detail. */
export function Checklist({ items, marker = "check" }: ChecklistProps) {
  return (
    <ul className={styles.list}>
      {items.map((item, index) => (
        <li key={item.title} className={styles.item}>
          <span className={styles.marker} aria-hidden="true">
            {marker === "number" ? String(index + 1).padStart(2, "0") : "✓"}
          </span>
          <span className={styles.title}>
            {item.title}
            {item.tag && <span className={`${styles.tag} text-label-s`}>{item.tag}</span>}
          </span>
          {item.detail && <span className={styles.detail}>{item.detail}</span>}
        </li>
      ))}
    </ul>
  );
}
