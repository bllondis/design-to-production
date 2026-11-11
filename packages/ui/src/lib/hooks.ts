import { useEffect, useMemo, useState, type RefObject } from "react";
import { hash, observeVisibility, prefersReducedMotion } from "./motion";

const restingShare = 0.1;

const seedFrom = (text: string): number => [...text].reduce((sum, character) => sum + character.charCodeAt(0), 0);

const pick = (count: number, seed: number, share: number, step: number): Set<number> => {
  const picked = new Set<number>();
  for (let index = 0; index < count; index += 1) {
    if (hash(index + seed * 31, step) < share) picked.add(index);
  }
  return picked;
};

/**
 * Which letters of a heading render in the pixel face. The resting pick is deterministic, so the
 * server render and the hydrated one agree. On first view the share settles from ~60% to ~10%,
 * then a random letter flickers now and then while the heading stays on screen.
 * Returns the letters showing now and the resting pick, which a heading uses to hold its layout still.
 */
export const usePixelLetters = (
  ref: RefObject<HTMLElement | null>,
  text: string,
  letterCount: number,
  animate: boolean,
): { pixels: Set<number>; resting: Set<number> } => {
  const seed = useMemo(() => seedFrom(text), [text]);
  const resting = useMemo(() => pick(letterCount, seed, restingShare, 1), [letterCount, seed]);
  const [pixels, setPixels] = useState(resting);

  useEffect(() => {
    const element = ref.current;
    if (!element || !animate || prefersReducedMotion() || letterCount === 0) return;
    let timer = 0;
    let played = false;

    const stop = observeVisibility(
      element,
      (visible) => {
        window.clearTimeout(timer);
        if (!visible) {
          setPixels(resting);
          return;
        }
        let step = played ? 12 : 0;
        played = true;
        const tick = () => {
          step += 1;
          if (step <= 12) {
            setPixels(pick(letterCount, seed, 0.6 - step * 0.042, step));
          } else {
            const flicker = Math.floor(Math.random() * letterCount);
            setPixels(() => {
              const next = new Set(resting);
              if (next.has(flicker)) next.delete(flicker);
              else next.add(flicker);
              return next;
            });
            window.setTimeout(() => setPixels(resting), 450);
          }
          timer = window.setTimeout(tick, step < 12 ? 70 : 900);
        };
        tick();
      },
      0.4,
    );

    return () => {
      window.clearTimeout(timer);
      stop();
    };
  }, [ref, animate, letterCount, seed, resting]);

  return { pixels, resting };
};

/** True while the page is scrolling, false ~150ms after it stops. Always false under reduced motion. */
export const useScrollActivity = (enabled = true): boolean => {
  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    let settle = 0;
    const onScroll = () => {
      if (prefersReducedMotion()) return;
      setScrolling(true);
      window.clearTimeout(settle);
      settle = window.setTimeout(() => setScrolling(false), 150);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(settle);
      window.removeEventListener("scroll", onScroll);
    };
  }, [enabled]);

  return scrolling;
};
