import { useEffect, useId, useRef, useState, type PointerEvent } from "react";
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
  messages?: Partial<ContactPopupMessages>;
}

export interface ContactPopupMessages {
  close: string;
  copy: string;
  open: string;
  copyAria: string;
  copied: string;
  failed: string;
  copiedStatus: string;
  failedStatus: string;
}

const defaultMessages: ContactPopupMessages = {
  close: "Close",
  copy: "Copy",
  open: "Open",
  copyAria: "Copy {label}",
  copied: "Copied",
  failed: "Can't copy",
  copiedStatus: "{label} copied",
  failedStatus: "Copying failed",
};

const withLabel = (template: string, label: string) => template.replace("{label}", label);

// What a person wants to paste: the address rather than "mailto:…", and a full URL rather than a site path.
const copyValue = (href: string) =>
  href.startsWith("mailto:") ? href.slice("mailto:".length) : new URL(href, window.location.href).href;

function ContactRow({ link, messages }: { link: ContactLink; messages: ContactPopupMessages }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const tooltipId = useId();
  const reset = useRef(0);
  const copiesValue = link.href.startsWith("mailto:");
  useEffect(() => () => window.clearTimeout(reset.current), []);

  const trackTooltip = (event: PointerEvent<HTMLLIElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--tooltip-x", `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty("--tooltip-y", `${event.clientY - bounds.top}px`);
  };

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

  const content = (
    <>
      <span>{link.label}</span>
      {link.detail && <span className={`${styles.detail} text-label-m`}>{link.detail}</span>}
    </>
  );
  const tooltip = status === "copied" ? messages.copied : status === "failed" ? messages.failed : messages.copy;

  return (
    <li className={styles.row} onPointerMove={trackTooltip}>
      {copiesValue ? (
        <button
          type="button"
          className={styles.action}
          aria-label={withLabel(messages.copyAria, link.label)}
          aria-describedby={tooltipId}
          onClick={copy}
        >
          {content}
        </button>
      ) : (
        <a
          className={styles.action}
          href={link.href}
          aria-describedby={tooltipId}
          {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {content}
        </a>
      )}
      <span id={tooltipId} role="tooltip" className={`${styles.tooltip} text-label-s`} data-status={status}>
        {copiesValue ? tooltip : messages.open}
      </span>
      <span className="visually-hidden" role="status">
        {status === "copied"
          ? withLabel(messages.copiedStatus, link.label)
          : status === "failed"
            ? messages.failedStatus
            : ""}
      </span>
    </li>
  );
}

/**
 * Contact actions in a native popover: opening, Escape and a click outside need no script. The email row copies its
 * value and reports the result; the other whole-row actions open their destinations.
 */
export function ContactPopup({ id, title, links, messages }: ContactPopupProps) {
  const titleId = `${id}-title`;
  const copy = { ...defaultMessages, ...messages };
  return (
    <div id={id} popover="auto" role="dialog" aria-labelledby={titleId} className={styles.popup}>
      <div className={styles.head}>
        <p id={titleId} className="text-label-l">
          {title}
        </p>
        <button type="button" className={`${styles.close} text-label-m`} popoverTarget={id} popoverTargetAction="hide">
          {copy.close} <span aria-hidden="true">×</span>
        </button>
      </div>
      <ul className={styles.links}>
        {links.map((link) => (
          <ContactRow key={link.label} link={link} messages={copy} />
        ))}
      </ul>
    </div>
  );
}
