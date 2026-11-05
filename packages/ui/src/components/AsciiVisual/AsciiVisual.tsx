import { useEffect, useRef } from "react";
import { startAsciiVisual } from "../../lib/ascii-visual";
import styles from "./AsciiVisual.module.css";

export interface AsciiVisualProps {
  /** Screenshot to sample. */
  src: string;
  /** "x y" from 0 to 1: which part of the image to keep when cropping. */
  focus?: string;
  /** Small mono label in the bottom-left corner. */
  caption?: string;
  /** Show the real screenshot under the pointer, snapped to the glyph grid. On by default. */
  lens?: boolean;
}

/** A project screenshot redrawn as a coloured glyph mosaic. Fills its container. */
export function AsciiVisual({ src, focus = "0.5 0.5", caption, lens = true }: AsciiVisualProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const [x = 0.5, y = 0.5] = focus.split(" ").map(Number);
    return startAsciiVisual(canvas, src, [x, y], { lens });
  }, [src, focus, lens]);

  return (
    <figure className={styles.ascii}>
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
      {caption && <figcaption className={`${styles.caption} text-label-s`}>{caption}</figcaption>}
    </figure>
  );
}
