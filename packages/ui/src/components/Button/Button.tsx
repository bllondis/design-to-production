import type { ReactNode } from "react";
import { cx } from "../../lib/cx";
import styles from "./Button.module.css";

export type ButtonProps = {
  children: ReactNode;
  /** "light" white fill for dark surfaces · "dark" black fill for light surfaces · "text" underlined secondary link */
  variant?: "light" | "dark" | "text";
  size?: "m" | "s";
  /** Glyph after the label: "↗" onward (default), "↓" download, "" none. */
  icon?: string;
} & (
  | {
      href: string;
      /** Opens in a new tab with safe rel attributes. */
      external?: boolean;
      popoverTarget?: never;
    }
  | {
      /** Id of a popover to open: renders a real button instead of a link. */
      popoverTarget: string;
      href?: never;
      external?: never;
    }
);

/** A link styled as an action, or a button when it opens a popover. Hover inverts the fill. */
export function Button({ children, variant = "light", size = "m", icon = "↗", ...target }: ButtonProps) {
  const className = cx(styles.button, styles[variant], styles[size]);
  // A text link is underlined, and an underline runs under text but not under margins: the icon is set off by a
  // no-break space, so the line stays whole and the icon never wraps onto a line of its own.
  const content = (
    <>
      {children}
      {icon && variant === "text" && " "}
      {icon && <span aria-hidden="true">{icon}</span>}
    </>
  );
  if (target.popoverTarget) {
    return (
      <button type="button" className={className} popoverTarget={target.popoverTarget}>
        {content}
      </button>
    );
  }
  return (
    <a
      className={className}
      href={target.href}
      {...(target.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {content}
    </a>
  );
}
