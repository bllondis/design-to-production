import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(() => cleanup());

// jsdom lacks these browser APIs; the components only need them to exist.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }),
});

class NoopObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.IntersectionObserver = NoopObserver as unknown as typeof IntersectionObserver;
window.ResizeObserver = NoopObserver as unknown as typeof ResizeObserver;
