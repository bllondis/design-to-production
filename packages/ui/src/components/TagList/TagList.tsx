import styles from "./TagList.module.css";

/** A wrapped row of mono tags, e.g. the dimensions a dashboard tracks. */
export function TagList({ items }: { items: string[] }) {
  return (
    <ul className={styles.list}>
      {items.map((item) => (
        <li key={item} className={`${styles.tag} text-label-m`}>
          {item}
        </li>
      ))}
    </ul>
  );
}
