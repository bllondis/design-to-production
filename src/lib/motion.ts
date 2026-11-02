// Shared helpers for the animated components.

export const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const onReducedMotionChange = (listener: () => void): (() => void) => {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", listener);
  return () => query.removeEventListener("change", listener);
};

// Cheap deterministic noise so patterns stay stable between frames, renders and reloads.
export const hash = (x: number, y = 0): number => {
  const value = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return value - Math.floor(value);
};

export const observeVisibility = (
  element: Element,
  onChange: (visible: boolean) => void,
  threshold = 0.2,
): (() => void) => {
  if (!("IntersectionObserver" in window)) {
    onChange(true);
    return () => {};
  }
  const observer = new IntersectionObserver(([entry]) => onChange(entry.isIntersecting), { threshold });
  observer.observe(element);
  return () => observer.disconnect();
};

export const monoFont = (): string => getComputedStyle(document.documentElement).getPropertyValue("--font-family-mono");
