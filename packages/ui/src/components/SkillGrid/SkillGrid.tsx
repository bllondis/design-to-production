import { useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./SkillGrid.module.css";

const narrow = "(max-width: 680px)";
const stillMotion = "(prefers-reduced-motion: reduce)";
type RevealDirection = "forward" | "reverse";

export interface SkillGridProps {
  items: string[];
  label?: string;
}

/**
 * A labelled grid of skills: three columns at wide widths and two below 980px.
 * On narrow screens its cells reveal in sequence whenever the grid re-enters the viewport.
 */
export function SkillGrid({ items, label = "What I bring" }: SkillGridProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const [revealing, setRevealing] = useState(false);
  const [direction, setDirection] = useState<RevealDirection>("forward");

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const narrowQuery = window.matchMedia(narrow);
    const motionQuery = window.matchMedia(stillMotion);
    let observer: IntersectionObserver | undefined;
    let listeningForScroll = false;
    let lastScrollY = window.scrollY;
    let scrollDirection: RevealDirection = "forward";

    const readDirection = () => {
      const nextScrollY = window.scrollY;
      if (nextScrollY > lastScrollY) scrollDirection = "forward";
      if (nextScrollY < lastScrollY) scrollDirection = "reverse";
      lastScrollY = nextScrollY;
    };

    const stop = () => {
      observer?.disconnect();
      observer = undefined;
      if (listeningForScroll) window.removeEventListener("scroll", readDirection);
      listeningForScroll = false;
    };

    const observe = () => {
      stop();
      setRevealing(false);
      if (!narrowQuery.matches || motionQuery.matches) return;

      lastScrollY = window.scrollY;
      window.addEventListener("scroll", readDirection, { passive: true });
      listeningForScroll = true;
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setDirection(scrollDirection);
            setRevealing(true);
          } else {
            setRevealing(false);
          }
        },
        { threshold: 0.18 },
      );
      observer.observe(list);
    };

    observe();
    narrowQuery.addEventListener("change", observe);
    motionQuery.addEventListener("change", observe);
    return () => {
      stop();
      narrowQuery.removeEventListener("change", observe);
      motionQuery.removeEventListener("change", observe);
    };
  }, []);

  return (
    <div className={styles.root} data-skill-grid>
      <p className={`${styles.label} text-label-l`}>{label}</p>
      <ul
        ref={listRef}
        className={styles.list}
        data-revealing={revealing ? "true" : undefined}
        data-reveal-direction={direction}
      >
        {items.map((item, index) => (
          <li
            key={item}
            className={styles.item}
            data-skill-cell
            style={
              {
                "--skill-index": index,
                "--skill-reverse-index": items.length - 1 - index,
              } as CSSProperties
            }
          >
            <span className={styles.text}>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
