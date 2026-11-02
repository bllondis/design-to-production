import { cx } from "../../lib/cx";
import styles from "./MediaRow.module.css";

export interface MediaRowProps {
  src: string;
  alt: string;
  label: string;
  title: string;
  text: string;
  width?: number;
  height?: number;
  /** Put the image on the right. */
  flip?: boolean;
}

/** A research artifact: the image beside a label, title and one-paragraph takeaway. Zoomable via Lightbox. */
export function MediaRow({ src, alt, label, title, text, width, height, flip = false }: MediaRowProps) {
  return (
    <article className={cx(styles.row, flip && styles.flip)}>
      <div className={styles.media}>
        <img src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async" data-zoom="" />
      </div>
      <div className={styles.text}>
        <p className={`${styles.label} text-label-m`}>{label}</p>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.body}>{text}</p>
      </div>
    </article>
  );
}
