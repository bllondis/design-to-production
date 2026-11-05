import styles from "./TagList.module.css";

export interface TagLink {
  label: string;
  href: string;
}

/** A wrapped row of mono tags, e.g. the dimensions a dashboard tracks. A tag given an href is a link. */
export function TagList({ items }: { items: (string | TagLink)[] }) {
  return (
    <ul className={styles.list}>
      {items.map((item) =>
        typeof item === "string" ? (
          <li key={item} className={`${styles.tag} text-label-m`}>
            {item}
          </li>
        ) : (
          <li key={item.label}>
            <a className={`${styles.tag} ${styles.link} text-label-m`} href={item.href}>
              {item.label}
            </a>
          </li>
        ),
      )}
    </ul>
  );
}
