import type { ReactNode } from "react";
import styles from "./InfoCard.module.css";

export interface InfoCardProps {
  title: string;
  /** Mono label above the title, e.g. a mode or a level. */
  label?: string;
  children?: ReactNode;
  /** Optional bullet list under the text. */
  items?: string[];
}

/** A titled card for parallel ideas: modes, levels, learnings. Sits in a grid of equal cells. */
export function InfoCard({ title, label, children, items }: InfoCardProps) {
  return (
    <article className={styles.card}>
      {label && <p className={`${styles.label} text-label-m`}>{label}</p>}
      <h3 className={styles.title}>{title}</h3>
      {children && <div className={styles.body}>{children}</div>}
      {items && items.length > 0 && (
        <ul className={styles.list}>
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </article>
  );
}
