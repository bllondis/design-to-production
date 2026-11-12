import { useEffect, useRef, useState } from "react";
import styles from "./SkillGrid.module.css";

// Wider screens invert a hovered cell instead, and reduced motion plays nothing that would clear the flag.
const narrow = "(max-width: 680px)";
const stillMotion = "(prefers-reduced-motion: reduce)";

export interface SkillGridProps {
  items: string[];
  label?: string;
}

/**
 * A labelled grid of skills: three columns, two at medium width and on narrow screens.
 * On narrow screens a cell that is hovered or touched lights up and its words rise into place.
 */
export function SkillGrid({ items, label = "What I bring" }: SkillGridProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const [lit, setLit] = useState<Set<number>>(() => new Set());
  const light = (index: number) => {
    if (!window.matchMedia(narrow).matches || window.matchMedia(stillMotion).matches) return;
    setLit((current) => (current.has(index) ? current : new Set(current).add(index)));
  };

  // The glow plays once through; when the words have settled the cell can light again on the next hover or touch.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const settle = (event: AnimationEvent) => {
      const cell = event.target as HTMLElement;
      if (event.pseudoElement || !cell.dataset.skillIndex) return;
      const index = Number(cell.dataset.skillIndex);
      setLit((current) => {
        if (!current.has(index)) return current;
        const next = new Set(current);
        next.delete(index);
        return next;
      });
    };
    list.addEventListener("animationend", settle);
    return () => list.removeEventListener("animationend", settle);
  }, []);

  return (
    <div className={styles.root} data-skill-grid>
      <p className={`${styles.label} text-label-l`}>{label}</p>
      <ul ref={listRef} className={styles.list}>
        {items.map((item, index) => (
          <li
            key={item}
            className={styles.item}
            data-skill-cell
            data-skill-index={index}
            data-lit={lit.has(index) ? "true" : undefined}
            onPointerEnter={() => light(index)}
            onPointerDown={() => light(index)}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
