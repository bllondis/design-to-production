import { Fragment, useRef, type CSSProperties, type ReactNode } from "react";
import { cx } from "../../lib/cx";
import { usePixelLetters } from "../../lib/hooks";
import styles from "./Heading.module.css";

export type HeadingSize = "display-1" | "display-2" | "display-3" | "display-4" | "heading-1";

export interface HeadingProps {
  /** The title. A "\n" forces a line break; screen readers hear it as a space. */
  text: string;
  /** Semantic tag: choose it for the document outline, not for looks. */
  as?: "h1" | "h2" | "h3" | "h4";
  /** Visual step from the type scale: display-1 hero · display-2 chapter · display-3 editorial · display-4 capability · heading-1 band. */
  size: HeadingSize;
  tone?: "default" | "inverse";
  /** Swap a few letters into the pixel face. */
  pixel?: boolean;
  /** Settle and flicker the pixel letters on view; off keeps the resting pick. */
  animate?: boolean;
  /** Max line length in ch. */
  measure?: number;
  id?: string;
}

// Unicode properties keep the pixel treatment available to every locale, not only Latin text.
const isLetter = (character: string) => /[\p{L}\p{N}]/u.test(character);

// Each forced line, with a <br> before every line after the first.
const byLine = (text: string, render: (line: string, lineIndex: number) => ReactNode) =>
  text.split("\n").map((line, lineIndex) => (
    <Fragment key={lineIndex}>
      {lineIndex > 0 && <br />}
      {render(line, lineIndex)}
    </Fragment>
  ));

/**
 * One component for every title. The visible text is split into letters for the pixel effect;
 * screen readers get the plain text once.
 */
export function Heading({
  text,
  as: Tag = "h2",
  size,
  tone = "default",
  pixel = true,
  animate = true,
  measure,
  id,
}: HeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const spoken = text.replaceAll("-\n", "-").replaceAll("\n", " ");
  const letterCount = pixel ? [...text].filter(isLetter).length : 0;
  const pixels = usePixelLetters(ref, text, letterCount, pixel && animate);
  const className = cx(styles.heading, styles[size], tone === "inverse" && styles.inverse);
  const style = measure ? ({ "--heading-measure": `${measure}ch` } as CSSProperties) : undefined;

  if (!pixel) {
    return (
      <Tag ref={ref} id={id} className={className} style={style} aria-label={text.includes("\n") ? spoken : undefined}>
        {byLine(text, (line) => line)}
      </Tag>
    );
  }

  let letterIndex = 0;

  return (
    <Tag ref={ref} id={id} className={className} style={style}>
      <span className="visually-hidden">{spoken}</span>
      <span aria-hidden="true">
        {byLine(text, (line) =>
          line.split(" ").map((word, wordIndex) => (
            <span key={`${word}-${wordIndex}`}>
              {wordIndex > 0 && " "}
              <span className={styles.word}>
                {[...word].map((character, characterIndex) => {
                  const index = isLetter(character) ? letterIndex++ : -1;
                  return (
                    <span key={characterIndex} className={index >= 0 && pixels.has(index) ? styles.pixel : undefined}>
                      {character}
                    </span>
                  );
                })}
              </span>
            </span>
          )),
        )}
      </span>
    </Tag>
  );
}
