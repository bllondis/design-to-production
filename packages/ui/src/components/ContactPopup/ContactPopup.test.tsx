import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ContactPopup } from "./ContactPopup";

const links = [
  { label: "Email", detail: "name@example.com", href: "mailto:name@example.com" },
  { label: "GitHub", href: "https://github.com/", external: true },
  { label: "CV", href: "/cv.pdf", external: true },
];

const mockClipboard = (writeText: (text: string) => Promise<void>) =>
  Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });

describe("ContactPopup", () => {
  it("is a popover dialog named by its title", () => {
    const { container } = render(<ContactPopup id="contact" title="Get in touch" links={links} />);
    const popup = container.firstElementChild;
    expect(popup).toHaveAttribute("popover", "auto");
    expect(popup).toHaveAttribute("id", "contact");
    expect(popup).toHaveAttribute("role", "dialog");
    expect(popup).toHaveAttribute("aria-labelledby", "contact-title");
    expect(screen.getByText("Get in touch")).toHaveAttribute("id", "contact-title");
  });

  it("opens external links in a new tab and leaves the others alone", () => {
    const { container } = render(<ContactPopup id="contact" title="Get in touch" links={links} />);
    const [email, github] = Array.from(container.querySelectorAll("a"));
    expect(email).toHaveAttribute("href", "mailto:name@example.com");
    expect(email).not.toHaveAttribute("target");
    expect(email).toHaveTextContent("name@example.com");
    expect(github).toHaveAttribute("target", "_blank");
    expect(github).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("copies the address for email and a full URL for site paths", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    mockClipboard(writeText);
    render(<ContactPopup id="contact" title="Get in touch" links={links} />);

    fireEvent.click(screen.getByRole("button", { name: "Copy link: Email", hidden: true }));
    await screen.findByText("Email link copied");
    expect(writeText).toHaveBeenLastCalledWith("name@example.com");
    expect(screen.getByRole("button", { name: "Copy link: Email", hidden: true })).toHaveTextContent("Copied");

    fireEvent.click(screen.getByRole("button", { name: "Copy link: CV", hidden: true }));
    await screen.findByText("CV link copied");
    expect(writeText).toHaveBeenLastCalledWith(`${window.location.origin}/cv.pdf`);
  });

  it("says so when the browser refuses to copy", async () => {
    mockClipboard(vi.fn().mockRejectedValue(new Error("denied")));
    render(<ContactPopup id="contact" title="Get in touch" links={links} />);
    fireEvent.click(screen.getByRole("button", { name: "Copy link: GitHub", hidden: true }));
    await screen.findByText("Copying failed");
    expect(screen.getByRole("button", { name: "Copy link: GitHub", hidden: true })).toHaveTextContent("Can't copy");
  });

  it("has a close button that hides this popover", () => {
    const { container } = render(<ContactPopup id="contact" title="Get in touch" links={links} />);
    const close = container.querySelector("button");
    expect(close).toHaveAttribute("popovertarget", "contact");
    expect(close).toHaveAttribute("popovertargetaction", "hide");
  });
});
