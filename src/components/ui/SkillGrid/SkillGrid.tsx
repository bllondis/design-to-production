import styles from "./SkillGrid.module.css";

export interface SkillGridProps {
  items: string[];
  label?: string;
}

/** A labelled grid of skills: three columns, two at medium width, a list on narrow screens. */
export function SkillGrid({ items, label = "What I bring" }: SkillGridProps) {
  return (
    <div>
      <p className={`${styles.label} text-label-l`}>{label}</p>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item} className={styles.item}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
