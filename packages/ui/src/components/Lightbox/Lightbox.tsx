import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./Lightbox.module.css";

interface Shot {
  src: string;
  alt: string;
}

/**
 * One per page. Clicking any image marked data-zoom opens it full screen in a native dialog;
 * arrow keys and the side buttons step through every zoomable image on the page, Escape closes.
 */
export function Lightbox() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [shots, setShots] = useState<Shot[]>([]);
  const [index, setIndex] = useState(0);

  const step = useCallback(
    (delta: number) => setIndex((current) => (current + delta + shots.length) % Math.max(shots.length, 1)),
    [shots.length],
  );

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLImageElement>("img[data-zoom]");
      if (!target) return;
      const images = [...document.querySelectorAll<HTMLImageElement>("img[data-zoom]")];
      setShots(images.map((image) => ({ src: image.currentSrc || image.src, alt: image.alt })));
      setIndex(images.indexOf(target));
      dialogRef.current?.showModal();
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    dialog.addEventListener("keydown", onKey);
    return () => dialog.removeEventListener("keydown", onKey);
  }, [step]);

  const shot = shots[index];

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-label={shot ? `Image ${index + 1} of ${shots.length}: ${shot.alt}` : "Image viewer"}
      onClick={(event) => {
        if (event.target === dialogRef.current) dialogRef.current.close();
      }}
    >
      {shot && <img className={styles.image} src={shot.src} alt={shot.alt} />}
      <p className={`${styles.counter} text-label-s`} aria-hidden="true">
        {shots.length ? `${String(index + 1).padStart(2, "0")} / ${String(shots.length).padStart(2, "0")}` : ""}
      </p>
      <button type="button" className={`${styles.button} ${styles.close}`} onClick={() => dialogRef.current?.close()}>
        Close <span aria-hidden="true">×</span>
      </button>
      {shots.length > 1 && (
        <>
          <button type="button" className={`${styles.button} ${styles.prev}`} onClick={() => step(-1)}>
            <span aria-hidden="true">←</span>
            <span className="visually-hidden">Previous image</span>
          </button>
          <button type="button" className={`${styles.button} ${styles.next}`} onClick={() => step(1)}>
            <span aria-hidden="true">→</span>
            <span className="visually-hidden">Next image</span>
          </button>
        </>
      )}
    </dialog>
  );
}
