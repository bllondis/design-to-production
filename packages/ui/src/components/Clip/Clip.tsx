import { useEffect, useRef } from "react";
import { observeVisibility, onReducedMotionChange, prefersReducedMotion } from "../../lib/motion";
import styles from "./Clip.module.css";

export interface ClipProps {
  src: string;
  /** Accessible description of what the clip shows. */
  label: string;
  poster?: string;
  caption?: string;
  /** "ambient" plays muted on a loop while on screen; "walkthrough" waits for the viewer to press play. */
  mode?: "ambient" | "walkthrough";
}

/** A product video in a frame. Ambient clips pause off screen and never play under reduced motion. */
export function Clip({ src, label, poster, caption, mode = "ambient" }: ClipProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || mode !== "ambient") return;
    let visible = false;
    const update = () => {
      if (visible && !prefersReducedMotion()) video.play().catch(() => {});
      else video.pause();
    };
    const stopVisibility = observeVisibility(
      video,
      (isVisible) => {
        visible = isVisible;
        update();
      },
      0.3,
    );
    const stopReducedMotion = onReducedMotionChange(update);
    return () => {
      stopVisibility();
      stopReducedMotion();
    };
  }, [mode]);

  return (
    <figure className={styles.clip}>
      <video
        ref={videoRef}
        className={styles.video}
        src={src}
        poster={poster}
        aria-label={label}
        controls
        muted={mode === "ambient"}
        loop={mode === "ambient"}
        playsInline
        preload="metadata"
      />
      {caption && <figcaption className={`${styles.caption} text-label-m`}>{caption}</figcaption>}
    </figure>
  );
}
