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

  it("uses localised state labels", async () => {
    render(<PixelDoor character="/cat.jpg" still openLabel="Відкрити" closeLabel="Закрити" />);
    const door = screen.getByRole("button", { name: "Відкрити" });
    await userEvent.click(door);
    expect(door).toHaveAccessibleName("Закрити");
  });

  it("shows nobody when vacant", () => {
    const { container } = render(<PixelDoor character="/cat.jpg" still vacant />);
    expect(container.querySelector("img")).toBeNull();
    expect(screen.getByRole("button")).toBeEnabled();
  });

  it("cannot be opened, and is hidden from assistive tech, when disabled", () => {
    const { container } = render(<PixelDoor character="/cat.jpg" still disabled />);
    expect(container.querySelector("button")).toBeDisabled();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("hangs on the right when asked", () => {
    render(<PixelDoor character="/cat.jpg" still hinge="right" />);
    expect(screen.getByRole("button")).toHaveClass("hingeRight");
  });

  it("lets a parent drive it", async () => {
    const onToggle = vi.fn();
    render(<PixelDoor character="/cat.jpg" still open={false} onToggle={onToggle} />);
    const door = screen.getByRole("button");
    await userEvent.click(door);
    expect(onToggle).toHaveBeenCalledOnce();
    expect(door).toHaveAttribute("aria-pressed", "false");
  });

  it("opens on the first touch tap", () => {
    const onToggle = vi.fn();
    render(<PixelDoor character="/cat.jpg" still onToggle={onToggle} />);
    const door = screen.getByRole("button");
    fireEvent.pointerDown(door, { pointerType: "touch" });
    fireEvent.click(door);
    expect(door).toHaveAttribute("aria-pressed", "true");
    expect(onToggle).toHaveBeenCalledOnce();
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

  it("stays shut while the page scrolls when disabled", () => {
    const { container } = render(<PixelDoor character="/cat.jpg" disabled />);
    act(() => {
      fireEvent.scroll(window);
    });
    expect(container.querySelector("button")).not.toHaveClass("flapping");
  });

  it("ignores scrolling when still", () => {
    render(<PixelDoor character="/cat.jpg" still />);
    act(() => {
      fireEvent.scroll(window);
    });
    expect(screen.getByRole("button")).not.toHaveClass("flapping");
  });
});
