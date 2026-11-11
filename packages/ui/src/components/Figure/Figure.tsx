import { cx } from "../../lib/cx";
import styles from "./Figure.module.css";

export interface FigureProps {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  /** Let the page's Lightbox open this image full screen (default on). */
  zoom?: boolean;
  /** "wide" fills the content column; "inset" leaves breathing room around a framed screenshot. */
  layout?: "wide" | "inset";
}

/** A product screenshot with a mono caption. Zoomable images are picked up by Lightbox. */
export function Figure({ src, alt, caption, width, height, zoom = true, layout = "inset" }: FigureProps) {
  return (
    <figure className={cx(styles.figure, styles[layout])}>
      <div className={styles.media}>
        <img
          className={cx(styles.image, zoom && styles.zoomable)}
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
          data-zoom={zoom ? "" : undefined}
        />
        {zoom && (
          <button type="button" className={styles.zoomButton} data-zoom-trigger aria-label={`Open image: ${alt}`}>
            <span aria-hidden="true">↗</span>
          </button>
        )}
      </div>
      {caption && <figcaption className={`${styles.caption} text-label-m`}>{caption}</figcaption>}
    </figure>
  );
}
