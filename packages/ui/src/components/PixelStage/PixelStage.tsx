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
  /** Tooltip passed to each door and shown while that door is hovered or pressed. */
  hint?: string;
}

/**
 * A compact, touch-first rail for the portfolio characters when frame gutters collapse.
 * It reserves its own space, so a moving character never covers the section copy.
 */
export function PixelStage({ character, motion, openLabel, closeLabel, hint }: PixelStageProps) {
  const shared = { character, still: true, inset: false, openLabel, closeLabel, hint };

  return (
    <div className={styles.stage} data-pixel-stage data-motion={motion.kind}>
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
            <PixelFlight {...shared} walk={motion.walk} flight={motion.flight} />
          ) : motion.kind === "burrow" ? (
            <PixelBurrow {...shared} sprite={motion.sprite} />
          ) : (
            <PixelHang {...shared} sprite={motion.sprite} />
          )}
        </div>
      )}
    </div>
  );
}
