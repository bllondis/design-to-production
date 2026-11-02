import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PixelDoor } from "./PixelDoor";

describe("PixelDoor", () => {
  afterEach(() => vi.useRealTimers());

  it("starts closed and opens on click", async () => {
    render(<PixelDoor character="/cat.jpg" still />);
    const door = screen.getByRole("button", { name: "Open the pixel door" });
    expect(door).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(door);
    expect(door).toHaveAttribute("aria-pressed", "true");
    expect(door).toHaveAccessibleName("Close the pixel door");
  });

  it("can start open", () => {
    render(<PixelDoor character="/cat.jpg" still initialState="open" />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
  });

  it("flaps while the page scrolls and settles after", () => {
    vi.useFakeTimers();
    render(<PixelDoor character="/cat.jpg" />);
    const door = screen.getByRole("button");
    act(() => {
      fireEvent.scroll(window);
    });
    expect(door).toHaveClass("flapping");
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(door).not.toHaveClass("flapping");
  });

  it("ignores scrolling when still", () => {
    render(<PixelDoor character="/cat.jpg" still />);
    act(() => {
      fireEvent.scroll(window);
    });
    expect(screen.getByRole("button")).not.toHaveClass("flapping");
  });
});
