import { useEffect, useId, useRef, useState } from "react";
import styles from "./MobileNav.module.css";

export interface MobileNavLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface MobileNavLanguage {
  code: string;
  label: string;
  flag?: string;
  href: string;
  active?: boolean;
}

export interface MobileNavProps {
  links: MobileNavLink[];
  /** Language destinations shown after the primary links. */
  languages?: MobileNavLanguage[];
  /** Accessible and visible label for the language group. */
  languageLabel?: string;
  /** Accessible name for the navigation panel. */
  label?: string;
  /** Accessible name for the closed trigger. */
  openLabel?: string;
  /** Accessible name for the open trigger. */
  closeLabel?: string;
}

/** Compact navigation for narrow screens. It opens below the site header and closes on Escape or outside press. */
export function MobileNav({
  links,
  languages = [],
  languageLabel = "Languages",
  label = "Primary navigation",
  openLabel = "Open menu",
  closeLabel = "Close menu",
}: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.dataset.mobileNavOpen = "";
    const focusFrame = window.requestAnimationFrame(() => panel.current?.querySelector<HTMLElement>("a")?.focus());
    const closeOutside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = [
        ...(root.current?.querySelectorAll<HTMLElement>("button:not([disabled]), a[href]") ?? []),
      ].filter((element) => !element.hasAttribute("hidden"));
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeWithEscape);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      delete document.body.dataset.mobileNavOpen;
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeWithEscape);
    };
  }, [open]);

  return (
    <div ref={root} className={styles.root} data-mobile-nav>
      <button
        ref={trigger}
        className={styles.trigger}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? closeLabel : openLabel}
        onClick={() => setOpen((value) => !value)}
      >
        <span className={`${styles.icon} ${open ? styles.iconOpen : ""}`} aria-hidden="true">
          <span />
          <span />
        </span>
      </button>
      <div className={styles.backdrop} hidden={!open} aria-hidden="true" onClick={() => setOpen(false)} />
      <div className={styles.sheet} role="dialog" aria-modal="true" aria-label={label} hidden={!open}>
        <nav ref={panel} id={panelId} className={styles.panel} aria-label={label}>
          <ul className={styles.linkList}>
            {links.map((link) => (
              <li key={`${link.href}-${link.label}`}>
                <a
                  className={styles.link}
                  href={link.href}
                  {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  onClick={() => setOpen(false)}
                >
                  <span>{link.label}</span>
                  <span aria-hidden="true">{link.external ? "↗" : "→"}</span>
                </a>
              </li>
            ))}
          </ul>
          {languages.length > 0 && (
            <div className={styles.languages}>
              <p className={styles.languageLabel}>{languageLabel}</p>
              <ul className={styles.languageList} aria-label={languageLabel}>
                {languages.map((language) => (
                  <li key={language.code}>
                    <a
                      className={styles.languageLink}
                      href={language.href}
                      lang={language.code}
                      aria-current={language.active ? "page" : undefined}
                      onClick={() => setOpen(false)}
                    >
                      <span className={styles.languageFlag} aria-hidden="true">
                        {language.flag}
                      </span>
                      <span>{language.label}</span>
                      <span className={styles.languageMark} aria-hidden="true">
                        {language.active ? "●" : ""}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </nav>
      </div>
    </div>
  );
}
