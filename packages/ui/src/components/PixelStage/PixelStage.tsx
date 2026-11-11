import { useId, useState } from "react";
import { PixelBurrow } from "../PixelBurrow/PixelBurrow";
import { PixelFlight } from "../PixelFlight/PixelFlight";
import { PixelHang } from "../PixelHang/PixelHang";
import { PixelWalk } from "../PixelWalk/PixelWalk";
import styles from "./PixelStage.module.css";

export type PixelStageMotion =
  | { kind: "walk"; sprite: string }
  | { kind: "bow"; sprite: string; flourish?: string }
  | { kind: "fly"; walk: string; flight: string }
  | { kind: "burrow"; sprite: string }
  | { kind: "hang"; sprite: string };

export interface PixelStageProps {
  character: string;
  motion: PixelStageMotion;
  openLabel?: string;
  closeLabel?: string;
  /** One-time touch hint. It disappears after the first interaction with the rail. */
  hint?: string;
}

/**
 * A compact, touch-first rail for the portfolio characters when frame gutters collapse.
 * It reserves its own space, so a moving character never covers the section copy.
 */
export function PixelStage({ character, motion, openLabel, closeLabel, hint }: PixelStageProps) {
  const perchId = useId().replaceAll(":", "");
  const [interacted, setInteracted] = useState(false);
  const perchSelector = `[data-pixel-stage-perch="${perchId}"]`;
  const shared = { character, still: true, inset: false, openLabel, closeLabel };

  return (
    <div
      className={styles.stage}
      data-pixel-stage
      data-motion={motion.kind}
      data-interacted={interacted ? "" : undefined}
      onPointerDownCapture={() => setInteracted(true)}
      onKeyDownCapture={(event) => {
        if (event.key === "Enter" || event.key === " ") setInteracted(true);
      }}
    >
      {hint && !interacted && (
        <span className={`${styles.hint} text-label-m`} aria-hidden="true">
          {hint}
        </span>
      )}
      {motion.kind === "walk" || motion.kind === "bow" ? (
        <PixelWalk
          {...shared}
          sprite={motion.sprite}
          route={motion.kind === "bow" ? "bow" : "across"}
          leap={motion.kind === "bow" ? "flip" : "jump"}
          flourish={motion.kind === "bow" ? motion.flourish : undefined}
        />
      ) : (
        <div className={styles.cell}>
          {motion.kind === "fly" ? (
            <PixelFlight {...shared} walk={motion.walk} flight={motion.flight} perches={perchSelector} />
          ) : motion.kind === "burrow" ? (
            <PixelBurrow {...shared} sprite={motion.sprite} />
          ) : (
            <PixelHang {...shared} sprite={motion.sprite} />
          )}
        </div>
      )}
      {motion.kind === "fly" && (
        <>
          <span className={styles.flightShelf} data-pixel-stage-perch={perchId} aria-hidden="true" />
          <span className={styles.floor} data-pixel-stage-perch={perchId} aria-hidden="true" />
        </>
      )}
    </div>
  );
}
