import { useEffect, useRef, useState } from "react";
import styles from "./ContactPopup.module.css";

export interface ContactLink {
  label: string;
  /** Shown beside the label, e.g. the address itself. */
  detail?: string;
  href: string;
  external?: boolean;
}

export interface ContactPopupProps {
  /** Point a Button's `popoverTarget` at this id to open the popup. */
  id: string;
  title: string;
  links: ContactLink[];
}

// What a person wants to paste: the address rather than "mailto:…", and a full URL rather than a site path.
const copyValue = (href: string) =>
  href.startsWith("mailto:") ? href.slice("mailto:".length) : new URL(href, window.location.href).href;

function ContactRow({ link }: { link: ContactLink }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const reset = useRef(0);
  useEffect(() => () => window.clearTimeout(reset.current), []);

  const copy = async () => {
    window.clearTimeout(reset.current);
    try {
      await navigator.clipboard.writeText(copyValue(link.href));
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
    reset.current = window.setTimeout(() => setStatus("idle"), 1600);
  };

  return (
    <li className={styles.row}>
      <a
        className={styles.link}
        href={link.href}
        {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        <span>{link.label}</span>
        {link.detail && <span className={`${styles.detail} text-label-m`}>{link.detail}</span>}
      </a>
      <button
        type="button"
        className={`${styles.copy} text-label-s`}
        data-status={status}
        aria-label={`Copy link: ${link.label}`}
        onClick={copy}
      >
        {status === "copied" ? "Copied" : status === "failed" ? "Can't copy" : "Copy link"}
      </button>
      <span className="visually-hidden" role="status">
        {status === "copied" ? `${link.label} link copied` : status === "failed" ? "Copying failed" : ""}
      </span>
    </li>
  );
}

/**
 * Contact links in a native popover: opening, Escape and a click outside need no script. Hovering a row offers
 * to copy its link, which does need one, so hydrate this with client:idle (a closed popover never scrolls into view).
 */
export function ContactPopup({ id, title, links }: ContactPopupProps) {
  const titleId = `${id}-title`;
  return (
    <div id={id} popover="auto" role="dialog" aria-labelledby={titleId} className={styles.popup}>
      <div className={styles.head}>
        <p id={titleId} className="text-label-l">
          {title}
        </p>
        <button type="button" className={`${styles.close} text-label-m`} popoverTarget={id} popoverTargetAction="hide">
          Close <span aria-hidden="true">×</span>
        </button>
      </div>
      <ul className={styles.links}>
        {links.map((link) => (
          <ContactRow key={link.label} link={link} />
        ))}
      </ul>
    </div>
  );
}
