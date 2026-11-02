import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it } from "vitest";
import { Figure } from "../Figure/Figure";
import { Lightbox } from "./Lightbox";

beforeAll(() => {
  // jsdom has <dialog> but not its modal methods.
  HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
    this.removeAttribute("open");
  };
});

describe("Lightbox", () => {
  it("opens the clicked zoomable image and steps through the others", async () => {
    render(
      <>
        <Figure src="/one.jpg" alt="First screen" />
        <Figure src="/two.jpg" alt="Second screen" />
        <Figure src="/static.jpg" alt="Not zoomable" zoom={false} />
        <Lightbox />
      </>,
    );
    await userEvent.click(screen.getByAltText("Second screen"));
    const dialog = screen.getByRole("dialog", { hidden: true });
    expect(dialog).toHaveAttribute("open");
    expect(dialog).toHaveAccessibleName("Image 2 of 2: Second screen");

    await userEvent.click(screen.getByRole("button", { name: "Next image", hidden: true }));
    expect(dialog).toHaveAccessibleName("Image 1 of 2: First screen");

    await userEvent.click(screen.getByRole("button", { name: /Close/, hidden: true }));
    expect(dialog).not.toHaveAttribute("open");
  });
});
