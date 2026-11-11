import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { MobileNav } from "./MobileNav";

const links = [
  { label: "CV", href: "/cv.pdf", external: true },
  { label: "GitHub", href: "https://github.com/example", external: true },
  { label: "Home", href: "/" },
];

const languages = [
  { code: "en", label: "English", flag: "🇬🇧", href: "/", active: true },
  { code: "nl", label: "Nederlands", flag: "🇳🇱", href: "/nl/" },
  { code: "uk", label: "Українська", flag: "🇺🇦", href: "/uk/" },
];

describe("MobileNav", () => {
  it("opens a named navigation panel and exposes every link", async () => {
    render(<MobileNav links={links} label="Primary navigation" />);
    const trigger = screen.getByRole("button", { name: "Open menu" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger).toHaveAccessibleName("Close menu");
    expect(screen.getByRole("navigation", { name: "Primary navigation" })).toBeVisible();
    expect(screen.getByRole("link", { name: /CV/ })).toHaveAttribute("target", "_blank");
    expect(screen.getByRole("link", { name: /Home/ })).not.toHaveAttribute("target");
    await waitFor(() => expect(screen.getByRole("link", { name: /CV/ })).toHaveFocus());
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("closes on Escape and returns focus to its trigger", async () => {
    render(<MobileNav links={links} />);
    const trigger = screen.getByRole("button", { name: "Open menu" });
    await userEvent.click(trigger);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveFocus();
    expect(document.body.style.overflow).toBe("");
  });

  it("uses localised trigger labels", async () => {
    render(<MobileNav links={links} openLabel="Відкрити меню" closeLabel="Закрити меню" />);
    const trigger = screen.getByRole("button", { name: "Відкрити меню" });
    await userEvent.click(trigger);
    expect(trigger).toHaveAccessibleName("Закрити меню");
  });

  it("shows language destinations and marks the current language", async () => {
    render(<MobileNav links={links} languages={languages} languageLabel="Languages" />);
    await userEvent.click(screen.getByRole("button", { name: "Open menu" }));
    const languageList = screen.getByRole("list", { name: "Languages" });
    expect(languageList).toBeVisible();
    expect(languageList.querySelectorAll("a")).toHaveLength(3);
    expect(screen.getByRole("link", { name: /English/ })).toHaveAttribute("aria-current", "page");
  });
});
