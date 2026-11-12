import { useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./SkillGrid.module.css";

export interface SkillGridProps {
  items: string[];
  label?: string;
}

/** A labelled grid of skills: three columns, two at medium width, a list on narrow screens. */
export function SkillGrid({ items, label = "What I bring" }: SkillGridProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState<Set<number>>(() => new Set());

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const cells = [...root.querySelectorAll<HTMLElement>("[data-skill-cell]")];
    const reveal = (indexes: number[]) => {
      if (!indexes.length) return;
      setRevealed((current) => {
        const next = new Set(current);
        indexes.forEach((index) => next.add(index));
        return next;
      });
    };

    if (!window.matchMedia("(max-width: 680px)").matches || !("IntersectionObserver" in window)) {
      reveal(cells.map((_, index) => index));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const indexes: number[] = [];
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const cell = entry.target as HTMLElement;
          indexes.push(Number(cell.dataset.skillIndex));
          observer.unobserve(cell);
        });
        reveal(indexes);
      },
      {
        // Reveal a row well inside the viewport, rather than when the component merely starts hydrating.
        rootMargin: "0px 0px -35% 0px",
        threshold: 0.15,
      },
    );

    cells.forEach((cell) => observer.observe(cell));
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={rootRef} className={styles.root} data-skill-grid>
      <p className={`${styles.label} text-label-l`}>{label}</p>
      <ul className={styles.list}>
        {items.map((item, index) => (
          <li
            key={item}
            className={styles.item}
            data-skill-cell
            data-skill-index={index}
            data-revealed={revealed.has(index) ? "true" : undefined}
            style={{ "--skill-reveal-order": index % 2 } as CSSProperties}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
