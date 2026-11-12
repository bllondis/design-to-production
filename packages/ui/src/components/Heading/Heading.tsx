import { Fragment, useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { cx } from "../../lib/cx";
import { usePixelLetters } from "../../lib/hooks";
import styles from "./Heading.module.css";

export type HeadingSize = "display-1" | "display-2" | "display-3" | "display-4" | "heading-1";

export interface HeadingProps {
  /** The title. A "\n" forces a line break; screen readers hear it as a space. */
  text: string;
  /** The same wording with narrow-screen-only line breaks. */
  mobileText?: string;
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
 *
 * Pixel letters are not as wide as the letters they replace, so while they come and go the lines would rewrap
 * and the heading change height. Each word is therefore set twice: once unseen, with the resting letters, which
 * is what the layout measures, and once on top of that with the letters showing now. If those are wider than
 * the word's place, they are squeezed to fit rather than left to run into the next word.
 */
export function Heading({
  text,
  mobileText,
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
  const { pixels, resting } = usePixelLetters(ref, text, letterCount, pixel && animate);
  // How far past its place a word may reach before it is squeezed, in ems: a sliver of the space after it.
  const overhang = 0.1;

  useLayoutEffect(() => {
    const heading = ref.current;
    if (!heading || !pixel) return;
    const spare = (parseFloat(getComputedStyle(heading).fontSize) || 0) * overhang;
    heading.querySelectorAll<HTMLElement>(`.${styles.letters}`).forEach((letters) => {
      const room = (letters.previousElementSibling as HTMLElement).offsetWidth + spare;
      const wanted = letters.offsetWidth;
      letters.style.transform = wanted > room ? `scaleX(${room / wanted})` : "";
    });
  }, [pixels, pixel, mobileText]);

  const className = cx(styles.heading, styles[size], !pixel && styles.plain, tone === "inverse" && styles.inverse);
  const style = measure ? ({ "--heading-measure": `${measure}ch` } as CSSProperties) : undefined;

  if (!pixel) {
    if (mobileText) {
      return (
        <Tag ref={ref} id={id} className={className} style={style} aria-label={spoken}>
          <span className={styles.desktopText} aria-hidden="true">
            {byLine(text, (line) => line)}
          </span>
          <span className={styles.mobileText} aria-hidden="true">
            {byLine(mobileText, (line) => line)}
          </span>
        </Tag>
      );
    }

    return (
      <Tag ref={ref} id={id} className={className} style={style} aria-label={text.includes("\n") ? spoken : undefined}>
        {byLine(text, (line) => line)}
      </Tag>
    );
  }

  const letters = (word: string, first: number, picked: Set<number>) => {
    let index = first;
    return [...word].map((character, characterIndex) => {
      const pixelated = isLetter(character) && picked.has(index++);
      return (
        <span key={characterIndex} className={pixelated ? styles.pixel : undefined}>
          {character}
        </span>
      );
    });
  };

  const pixelText = (displayText: string) => {
    // Where each word's letters begin in the run of letters the pixel pick counts through.
    const lines: { word: string; first: number }[][] = [];
    let counted = 0;
    for (const line of displayText.split("\n")) {
      const words = [];
      for (const word of line.split(" ")) {
        words.push({ word, first: counted });
        counted += [...word].filter(isLetter).length;
      }
      lines.push(words);
    }

    return byLine(displayText, (_line, lineIndex) =>
      lines[lineIndex].map(({ word, first }, wordIndex) => (
        <span key={`${word}-${wordIndex}`}>
          {wordIndex > 0 && " "}
          <span className={styles.word}>
            <span className={styles.slot}>{letters(word, first, resting)}</span>
            <span className={styles.letters}>{letters(word, first, pixels)}</span>
          </span>
        </span>
      )),
    );
  };

  return (
    <Tag ref={ref} id={id} className={className} style={style}>
      <span className="visually-hidden">{spoken}</span>
      <span aria-hidden="true">
        <span className={mobileText ? styles.desktopText : undefined}>{pixelText(text)}</span>
        {mobileText && <span className={styles.mobileText}>{pixelText(mobileText)}</span>}
      </span>
    </Tag>
  );
}
