import { hash, monoFont, observeVisibility, onReducedMotionChange, prefersReducedMotion } from "./motion";

// Project screenshots redrawn as a coloured glyph field. Light UI is inverted so ink and colour carry the shape.
// With `lens`, the pointer opens a window onto the real screenshot, snapped to the glyph grid, so the field reads
// as a screen and not only as a texture.
const ramp = " .'`,:;~-_+<>i!lI?|/\\()1{}[]rcvunxzjftLCJUYXZO0Qoahkbdpqwm*#MW&8%B@$";

interface Cell {
  x: number;
  y: number;
  glyph: string;
  index: number;
  color: string;
  faint: string;
  block: string;
  noise: number;
}

export interface AsciiVisualOptions {
  lens?: boolean;
}

/** Samples `src` into the canvas, animates the reveal and pointer scramble, and returns a cleanup function. */
export const startAsciiVisual = (
  canvas: HTMLCanvasElement,
  src: string,
  focus: [number, number],
  { lens = true }: AsciiVisualOptions = {},
): (() => void) => {
  const context = canvas.getContext("2d");
  const sampler = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  if (!context || !sampler) return () => {};
  const host = canvas.parentElement ?? canvas;
  const image = new Image();
  const [focusX, focusY] = focus;
  const pointer = { x: -1000, y: -1000, active: false };
  let cells: Cell[] = [];
  let width = 0;
  let height = 0;
  let cellWidth = 10;
  let cellHeight = 16;
  // The part of the image the canvas shows, in image pixels, and whether it is light UI.
  let crop = { x: 0, y: 0, width: 0, height: 0 };
  let lightImage = false;
  let reveal = 0;
  let revealStart = 0;
  let animationFrame = 0;
  let lastFrame = 0;
  let visible = false;
  let resizeObserver: ResizeObserver | undefined;
  let stopVisibility = () => {};

  const draw = (time: number) => {
    context.clearRect(0, 0, width, height);
    const radius = lens ? Math.max(90, width * 0.2) : Math.max(70, width * 0.12);
    const open = lens && pointer.active && reveal === 1;
    if (open) {
      context.save();
      context.beginPath();
      for (const cell of cells) {
        if (Math.hypot(cell.x - pointer.x, cell.y - pointer.y) < radius)
          context.rect(cell.x, cell.y, cellWidth, cellHeight);
      }
      context.clip();
      // A slight blur keeps the screenshot behind the glyphs rather than on top of them. Light UI is inverted
      // here too, so the lens stays as dark as the field around it.
      context.filter = lightImage ? "blur(1.2px) invert(1) hue-rotate(180deg)" : "blur(1.2px)";
      context.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, width, height);
      context.restore();
    }
    // Inside an open lens the screenshot shows under light running glyphs; the full scramble rings it.
    const scrambleRadius = open ? radius + cellWidth * 3 : radius;
    for (const cell of cells) {
      if (cell.noise > reveal) {
        if (cell.noise < reveal + 0.18) {
          context.fillStyle = cell.faint;
          context.fillText(ramp[Math.floor(hash(cell.x, time) * ramp.length)], cell.x, cell.y);
        }
        continue;
      }
      const distance = pointer.active ? Math.hypot(cell.x - pointer.x, cell.y - pointer.y) : Infinity;
      if (open && distance < radius) {
        // A light, thinner run of glyphs keeps moving over the screenshot, so the lens stays part of the field.
        context.fillStyle = "rgba(244,245,240,0.3)";
        context.fillText(ramp[Math.floor(hash(cell.x + time * 0.004, cell.y) * ramp.length)], cell.x, cell.y);
        continue;
      }
      if (cell.block) {
        context.fillStyle = cell.block;
        context.fillRect(cell.x, cell.y, cellWidth, cellHeight);
      }
      let glyph = cell.glyph;
      if (distance < scrambleRadius && cell.index > 1) {
        glyph = ramp[Math.floor(hash(cell.x + time * 0.004, cell.y) * ramp.length)];
      } else if (cell.index > 1 && hash(cell.noise, Math.floor(time / 140)) > 0.985) {
        glyph = ramp[Math.max(1, cell.index - 4 + Math.floor(hash(cell.x, time) * 8))] || glyph;
      }
      if (!glyph) continue;
      context.fillStyle = cell.color;
      context.fillText(glyph, cell.x, cell.y);
    }
  };

  const build = () => {
    if (!image.complete || !image.naturalWidth) return;
    const bounds = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, bounds.width);
    height = Math.max(1, bounds.height);
    cellWidth = width < 520 ? 8 : 10;
    cellHeight = width < 520 ? 13 : 16;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.textBaseline = "top";
    context.font = `${cellHeight - 2}px ${monoFont()}`;

    const columns = Math.ceil(width / cellWidth);
    const rows = Math.ceil(height / cellHeight);
    const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
    const sourceWidth = width / scale;
    const sourceHeight = height / scale;
    sampler.canvas.width = columns;
    sampler.canvas.height = rows;
    sampler.imageSmoothingQuality = "high";
    sampler.drawImage(
      image,
      (image.naturalWidth - sourceWidth) * focusX,
      (image.naturalHeight - sourceHeight) * focusY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      columns,
      rows,
    );
    const pixels = sampler.getImageData(0, 0, columns, rows).data;
    crop = {
      x: (image.naturalWidth - sourceWidth) * focusX,
      y: (image.naturalHeight - sourceHeight) * focusY,
      width: sourceWidth,
      height: sourceHeight,
    };
    let luminance = 0;
    for (let offset = 0; offset < pixels.length; offset += 4) {
      luminance += 0.2126 * pixels[offset] + 0.7152 * pixels[offset + 1] + 0.0722 * pixels[offset + 2];
    }
    lightImage = luminance / (pixels.length / 4) > 128;

    cells = [];
    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const offset = (row * columns + column) * 4;
        const red = pixels[offset];
        const green = pixels[offset + 1];
        const blue = pixels[offset + 2];
        const max = Math.max(red, green, blue);
        const min = Math.min(red, green, blue);
        const saturation = max ? (max - min) / max : 0;
        const ink = 1 - (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;
        const coloured = saturation > 0.16;
        const density = Math.min(1, coloured ? 0.45 + saturation * 0.6 : 0.08 + Math.pow(ink, 0.7) * 1.05);
        const lift = coloured ? 255 / Math.max(max, 1) : 1;
        const tint = coloured
          ? `${Math.round(red * lift)},${Math.round(green * lift)},${Math.round(blue * lift)}`
          : "244,245,240";
        const noise = hash(column, row);
        cells.push({
          x: column * cellWidth,
          y: row * cellHeight,
          glyph: ramp[Math.min(ramp.length - 1, Math.floor(density * ramp.length) + Math.floor(noise * 3))],
          index: Math.floor(density * ramp.length),
          color: `rgba(${tint},${coloured ? 0.95 : (0.2 + density * 0.8).toFixed(2)})`,
          faint: `rgba(${tint},0.14)`,
          block: coloured
            ? `rgba(${tint},${(0.16 + saturation * 0.3).toFixed(2)})`
            : density > 0.5
              ? `rgba(244,245,240,${(density * 0.1).toFixed(2)})`
              : "",
          noise,
        });
      }
    }
    draw(performance.now());
  };

  const animate = (time: number) => {
    if (!revealStart) revealStart = time;
    reveal = Math.min(1, (time - revealStart) / 1400);
    if (time - lastFrame > 70) {
      draw(time);
      lastFrame = time;
    }
    animationFrame = window.requestAnimationFrame(animate);
  };

  const updateMotion = () => {
    window.cancelAnimationFrame(animationFrame);
    if (prefersReducedMotion()) {
      reveal = 1;
      draw(0);
    } else if (visible) {
      animationFrame = window.requestAnimationFrame(animate);
    }
  };

  const onPointerMove = (event: PointerEvent) => {
    const bounds = canvas.getBoundingClientRect();
    pointer.x = event.clientX - bounds.left;
    pointer.y = event.clientY - bounds.top;
    pointer.active = true;
    // Without the animation loop, the lens still follows the pointer: it is a direct response, not motion.
    if (lens && prefersReducedMotion()) draw(0);
  };
  const onPointerLeave = () => {
    pointer.active = false;
    if (lens && prefersReducedMotion()) draw(0);
  };
  const onLoad = () => {
    resizeObserver = new ResizeObserver(build);
    resizeObserver.observe(canvas);
    stopVisibility = observeVisibility(
      canvas,
      (isVisible) => {
        visible = isVisible;
        updateMotion();
      },
      0.05,
    );
  };

  host.addEventListener("pointermove", onPointerMove);
  host.addEventListener("pointerleave", onPointerLeave);
  image.addEventListener("load", onLoad);
  image.src = src;
  const stopReducedMotion = onReducedMotionChange(updateMotion);

  return () => {
    window.cancelAnimationFrame(animationFrame);
    host.removeEventListener("pointermove", onPointerMove);
    host.removeEventListener("pointerleave", onPointerLeave);
    image.removeEventListener("load", onLoad);
    resizeObserver?.disconnect();
    stopVisibility();
    stopReducedMotion();
  };
};
