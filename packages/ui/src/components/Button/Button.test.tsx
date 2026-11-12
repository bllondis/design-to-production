import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("renders a link with the label and an onward arrow hidden from assistive tech", () => {
    render(<Button href="/cases">See it in Timeflow</Button>);
    const link = screen.getByRole("link", { name: "See it in Timeflow" });
    expect(link).toHaveAttribute("href", "/cases");
    expect(link.querySelector("[aria-hidden='true']")).toHaveTextContent("↗");
  });

  it("renders a real button when it opens a popover", () => {
    render(<Button popoverTarget="contact">Get in touch</Button>);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    const button = screen.getByRole("button", { name: "Get in touch" });
    expect(button).toHaveAttribute("popovertarget", "contact");
    expect(button).toHaveAttribute("type", "button");
  });

  it("applies variant and size classes", () => {
    render(
      <Button href="#" variant="dark" size="s">
        Get in touch
      </Button>,
    );
    expect(screen.getByRole("link")).toHaveClass("button", "dark", "s");
  });

  it("opens external links in a new tab safely", () => {
    render(
      <Button href="https://example.com" external>
        Live product
      </Button>,
    );
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("drops the icon when asked", () => {
    render(
      <Button href="#" icon="">
        Plain
      </Button>,
    );
    expect(screen.getByRole("link").querySelector("[aria-hidden='true']")).toBeNull();
  });

  it("keeps a text link's underline whole by setting the icon off with a no-break space", () => {
    render(
      <Button href="/demo/" variant="text">
        Try it in the browser
      </Button>,
    );
    const link = screen.getByRole("link");
    expect(link.textContent).toBe("Try it in the browser\u00a0↗");
  });
});
