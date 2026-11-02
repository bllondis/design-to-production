import type { ReactNode } from "react";
import { cx } from "../../lib/cx";
import styles from "./Button.module.css";

export interface ButtonProps {
  href: string;
  children: ReactNode;
  /** "light" white fill for dark surfaces · "dark" black fill for light surfaces · "text" underlined secondary link */
  variant?: "light" | "dark" | "text";
  size?: "m" | "s";
  /** Glyph after the label: "↗" onward (default), "↓" download, "" none. */
  icon?: string;
  /** Opens in a new tab with safe rel attributes. */
  external?: boolean;
}

/** A link styled as an action. Hover inverts the fill. */
export function Button({ href, children, variant = "light", size = "m", icon = "↗", external = false }: ButtonProps) {
  return (
    <a
      className={cx(styles.button, styles[variant], styles[size])}
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
      {icon && <span aria-hidden="true">{icon}</span>}
    </a>
  );
}
