import { monoFont, observeVisibility, onReducedMotionChange, prefersReducedMotion } from "./motion";

export type SignalTone = "dark" | "light";

// Canvas palettes per tone. "dark" sits on the page background, "light" on inverse bands.
const palettes: Record<SignalTone, { ink: string; blocks: string[]; accents: string[] }> = {
  dark: {
    ink: "244,245,240",
    blocks: ["rgba(124,162,255,0.22)", "rgba(199,215,98,0.18)", "rgba(255,109,88,0.16)"],
    accents: ["rgba(160,184,255,0.92)", "rgba(215,228,126,0.88)", "rgba(255,137,116,0.84)"],
  },
  light: {
    ink: "5,6,7",
    blocks: ["rgba(49,94,211,0.16)", "rgba(150,165,40,0.18)", "rgba(222,82,60,0.14)"],
    accents: ["rgba(49,94,211,0.95)", "rgba(112,124,18,0.95)", "rgba(206,66,44,0.92)"],
  },
};

const glyphs = "01+·/:*<>[]{}xyzuvw";

const noise = (x: number, y: number, offset = 0) => {
  const value = Math.sin(x * 12.9898 + y * 78.233 + offset * 37.719) * 43758.5453;
  return value - Math.floor(value);
};

/**
 * Starts the glyph field on a canvas and returns a cleanup function.
 * The pointer is tracked on the nearest [data-signal-host] (or the canvas parent); a
 * [data-field-toggle] button and [data-field-status] label inside that host are wired up too.
 */
export const startSignalField = (canvas: HTMLCanvasElement, tone: SignalTone, text = ""): (() => void) => {
  const context = canvas.getContext("2d", { alpha: true });
  if (!context) return () => {};
  const host = canvas.closest<HTMLElement>("[data-signal-host]") ?? canvas.parentElement ?? canvas;
  const status = host.querySelector("[data-field-status]");
  const toggle = host.querySelector<HTMLButtonElement>("[data-field-toggle]");
  const toggleLabel = host.querySelector("[data-field-toggle-label]");
  const { ink, blocks, accents } = palettes[tone];
  const pointer = { x: -1000, y: -1000, active: false };
  let width = 0;
  let height = 0;
  let cellSize = 13;
  let columns = 0;
  let rows = 0;
  let animationFrame = 0;
  let lastFrame = 0;
  let paused = false;
  let visible = true;

  const draw = (time: number, still = false) => {
    context.clearRect(0, 0, width, height);
    const phase = still ? 0 : time * 0.00035;
    const pointerRadius = Math.max(95, width * 0.085);
    const shift = still ? 0 : Math.floor(time / 200);

    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const x = column * cellSize;
        const y = row * cellSize;
        const base = noise(column, row);
        const wave = (Math.sin(column * 0.21 + row * 0.09 + phase * 4) + 1) / 2;
        const vertical = (Math.cos(row * 0.18 - phase * 3 + base * 2) + 1) / 2;
        const distance = Math.hypot(x - pointer.x, y - pointer.y);
        const pointerForce = pointer.active ? Math.max(0, 1 - distance / pointerRadius) : 0;
        const signal = wave * 0.48 + vertical * 0.25 + base * 0.27 + pointerForce * 0.85;
        const glyphIndex = Math.floor((base + phase * 0.16 + pointerForce * 0.7) * glyphs.length) % glyphs.length;

        if (signal > 0.87 && base > 0.62) {
          context.fillStyle = blocks[Math.floor(noise(column + 40, row + 10) * 3)];
          context.fillRect(x, y, cellSize, cellSize);
        }

        context.fillStyle =
          signal > 1.02
            ? accents[Math.floor(noise(column + 60, row + 30) * 3)]
            : `rgba(${ink},${0.055 + signal * 0.34})`;

        // With text, each row reads the text on a loop and scrolls sideways; otherwise random glyphs.
        const glyph = text
          ? text[(((column + row * 5 - shift) % text.length) + text.length) % text.length]
          : glyphs[glyphIndex];
        context.fillText(glyph, x + 1, y);
      }
    }
  };

  const resize = () => {
    const bounds = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    width = Math.max(1, bounds.width);
    height = Math.max(1, bounds.height);
    cellSize = width < 680 ? 12 : 13;
    columns = Math.ceil(width / cellSize);
    rows = Math.ceil(height / cellSize);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.textBaseline = "top";
    context.font = `${cellSize - 2}px ${monoFont()}`;
    if (status) status.textContent = `CELLS / ${columns * rows}`;
    draw(0, true);
  };

  const animate = (time: number) => {
    if (time - lastFrame > 42) {
      draw(time);
      lastFrame = time;
    }
    animationFrame = window.requestAnimationFrame(animate);
  };

  const updateMotion = () => {
    window.cancelAnimationFrame(animationFrame);
    if (prefersReducedMotion() || paused) {
      draw(lastFrame || 0, true);
    } else if (visible) {
      animationFrame = window.requestAnimationFrame(animate);
    }
  };

  const onPointerMove = (event: PointerEvent) => {
    const bounds = canvas.getBoundingClientRect();
    pointer.x = event.clientX - bounds.left;
    pointer.y = event.clientY - bounds.top;
    pointer.active = true;
  };
  const onPointerLeave = () => {
    pointer.active = false;
  };
  const onToggle = () => {
    paused = !paused;
    toggle?.setAttribute("aria-pressed", String(paused));
    if (toggleLabel) toggleLabel.textContent = paused ? "Resume signal" : "Pause signal";
    const icon = toggle?.querySelector("[aria-hidden='true']");
    if (icon) icon.textContent = paused ? "[ > ]" : "[ II ]";
    updateMotion();
  };

  host.addEventListener("pointermove", onPointerMove);
  host.addEventListener("pointerleave", onPointerLeave);
  toggle?.addEventListener("click", onToggle);
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  const stopReducedMotion = onReducedMotionChange(updateMotion);
  const stopVisibility = observeVisibility(
    host,
    (isVisible) => {
      visible = isVisible;
      updateMotion();
    },
    0,
  );

  return () => {
    window.cancelAnimationFrame(animationFrame);
    host.removeEventListener("pointermove", onPointerMove);
    host.removeEventListener("pointerleave", onPointerLeave);
    toggle?.removeEventListener("click", onToggle);
    resizeObserver.disconnect();
    stopReducedMotion();
    stopVisibility();
  };
};
