import { useEffect, useRef, type CSSProperties } from "react";
import { cx } from "../../../lib/cx";
import { startSignalField, type SignalTone } from "../../../lib/signal-field";
import styles from "./SignalField.module.css";

export interface SignalFieldProps {
  /** "dark" light glyphs for dark surfaces · "light" dark glyphs for inverse bands */
  tone?: SignalTone;
  /** Run this text on a loop instead of random glyphs. */
  text?: string;
  /** Leave room at the top, e.g. under a header. */
  top?: string;
  /** Fade the bottom quarter out. */
  fade?: boolean;
  /** Overall strength, 0–1. */
  opacity?: number;
}

/**
 * The animated glyph field. It fills the nearest positioned ancestor; mark that ancestor
 * data-signal-host so the pointer, the pause toggle and the status label are found there.
 */
export function SignalField({ tone = "dark", text = "", top = "0px", fade = false, opacity = 1 }: SignalFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    return startSignalField(canvas, tone, text);
  }, [tone, text]);

  return (
    <canvas
      ref={canvasRef}
      className={cx(styles.field, fade && styles.fade)}
      style={{ "--field-top": top, "--field-opacity": opacity } as CSSProperties}
      aria-hidden="true"
    />
  );
}
