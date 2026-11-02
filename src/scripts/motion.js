// Shared helpers for the animated components.

export const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

// Cheap deterministic noise so patterns stay stable between frames and reloads.
export const hash = (x, y = 0) => {
  const value = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return value - Math.floor(value);
};

export const whenVisible = (element, onChange, threshold = 0.2) => {
  if (!("IntersectionObserver" in window)) {
    onChange(true);
    return;
  }
  new IntersectionObserver(([entry]) => onChange(entry.isIntersecting), { threshold }).observe(element);
};

export const monoFont = () => getComputedStyle(document.documentElement).getPropertyValue("--font-family-mono");
