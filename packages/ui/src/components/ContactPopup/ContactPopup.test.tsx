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

  it("makes email a whole-row copy action and opens the other rows in new tabs", () => {
    render(<ContactPopup id="contact" title="Get in touch" links={links} />);
    const email = screen.getByRole("button", { name: "Copy Email", hidden: true });
    const github = screen.getByRole("link", { name: /GitHub/, hidden: true });
    const cv = screen.getByRole("link", { name: /CV/, hidden: true });
    expect(email).toHaveTextContent("name@example.com");
    expect(github).toHaveAttribute("target", "_blank");
    expect(github).toHaveAttribute("rel", "noopener noreferrer");
    expect(cv).toHaveAttribute("target", "_blank");
    expect(email).toHaveAccessibleDescription("Copy");
    expect(github).toHaveAccessibleDescription("Open");
    expect(screen.getByRole("tooltip", { name: "Copy", hidden: true })).toBeInTheDocument();
    expect(screen.getAllByRole("tooltip", { name: "Open", hidden: true })).toHaveLength(2);
  });

  it("copies the email address and changes its tooltip to Copied", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    mockClipboard(writeText);
    render(<ContactPopup id="contact" title="Get in touch" links={links} />);

    fireEvent.click(screen.getByRole("button", { name: "Copy Email", hidden: true }));
    await screen.findByText("Email copied");
    expect(writeText).toHaveBeenLastCalledWith("name@example.com");
    expect(screen.getByRole("tooltip", { name: "Copied", hidden: true })).toBeInTheDocument();
  });

  it("positions a row tooltip above the pointer", () => {
    render(<ContactPopup id="contact" title="Get in touch" links={links} />);
    const row = screen.getByRole("button", { name: "Copy Email", hidden: true }).closest("li");
    expect(row).not.toBeNull();
    vi.spyOn(row!, "getBoundingClientRect").mockReturnValue({
      x: 100,
      y: 200,
      left: 100,
      top: 200,
      right: 500,
      bottom: 300,
      width: 400,
      height: 100,
      toJSON: () => ({}),
    });

    fireEvent.pointerMove(row!, { clientX: 260, clientY: 245 });
    expect(row).toHaveStyle({ "--tooltip-x": "160px", "--tooltip-y": "45px" });
  });

  it("says so when the browser refuses to copy", async () => {
    mockClipboard(vi.fn().mockRejectedValue(new Error("denied")));
    render(<ContactPopup id="contact" title="Get in touch" links={links} />);
    fireEvent.click(screen.getByRole("button", { name: "Copy Email", hidden: true }));
    await screen.findByText("Copying failed");
    expect(screen.getByRole("tooltip", { name: "Can't copy", hidden: true })).toBeInTheDocument();
  });

  it("has a close button that hides this popover", () => {
    render(<ContactPopup id="contact" title="Get in touch" links={links} />);
    const close = screen.getByRole("button", { name: /Close/, hidden: true });
    expect(close).toHaveAttribute("popovertarget", "contact");
    expect(close).toHaveAttribute("popovertargetaction", "hide");
  });

  it("uses localised interaction text", async () => {
    mockClipboard(vi.fn().mockResolvedValue(undefined));
    render(
      <ContactPopup
        id="contact"
        title="Зв’язатися"
        links={links}
        messages={{
          close: "Закрити",
          copy: "Копіювати",
          open: "Відкрити",
          copyAria: "Скопіювати — {label}",
          copied: "Скопійовано",
          copiedStatus: "{label} скопійовано",
        }}
      />,
    );

    expect(screen.getByRole("button", { name: /Закрити/, hidden: true })).toBeInTheDocument();
    const copy = screen.getByRole("button", { name: "Скопіювати — Email", hidden: true });
    fireEvent.click(copy);
    await screen.findByText("Email скопійовано");
    expect(screen.getByRole("tooltip", { name: "Скопійовано", hidden: true })).toBeInTheDocument();
  });
});
