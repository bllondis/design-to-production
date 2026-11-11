import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { PixelStage } from "./PixelStage";

describe("PixelStage", () => {
  it("renders a compact two-door walk rail", () => {
    const { container } = render(
      <PixelStage character="/cat.jpg" motion={{ kind: "walk", sprite: "/cat-walk.png" }} />,
    );
    expect(container.querySelector('[data-pixel-stage][data-motion="walk"]')).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Open the pixel door" })).toHaveLength(1);
    expect(container.querySelector('[data-route="across"]')).toHaveAttribute("data-phase", "home");
  });

  it("keeps a bow route in one door", () => {
    const { container } = render(
      <PixelStage character="/waffle.jpg" motion={{ kind: "bow", sprite: "/waffle-walk.png" }} />,
    );
    expect(container.querySelector('[data-route="bow"]')).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Open the pixel door" })).toHaveLength(1);
  });

  it("hands the bow's arm poses on to the walk", () => {
    const { container } = render(
      <PixelStage
        character="/waffle.jpg"
        motion={{ kind: "bow", sprite: "/waffle-walk.png", flourish: "/waffle-bow.png" }}
      />,
    );
    const walk = container.querySelector<HTMLElement>('[data-route="bow"]');
    expect(walk).toHaveAttribute("data-flourish");
    expect(walk?.style.getPropertyValue("--walk-flourish")).toBe("url(/waffle-bow.png)");
  });

  it("scopes the flying character to perches inside its rail", () => {
    const { container } = render(
      <PixelStage
        character="/pigeon.jpg"
        motion={{ kind: "fly", walk: "/pigeon-walk.png", flight: "/pigeon-fly.png" }}
      />,
    );
    const perches = container.querySelectorAll("[data-pixel-stage-perch]");
    expect(perches).toHaveLength(2);
    expect(perches[0].getAttribute("data-pixel-stage-perch")).toBe(perches[1].getAttribute("data-pixel-stage-perch"));
  });

  it("passes localised labels to a single-door motion", () => {
    render(
      <PixelStage
        character="/sloth.jpg"
        motion={{ kind: "hang", sprite: "/sloth-hang.png" }}
        openLabel="Відкрити дверцята"
        closeLabel="Закрити дверцята"
      />,
    );
    expect(screen.getByRole("button", { name: "Відкрити дверцята" })).toBeInTheDocument();
  });

  it("removes its one-time hint after the first door interaction", async () => {
    render(<PixelStage character="/cat.jpg" motion={{ kind: "walk", sprite: "/cat-walk.png" }} hint="Tap a door" />);
    expect(screen.getByText("Tap a door")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Open the pixel door" }));
    expect(screen.queryByText("Tap a door")).not.toBeInTheDocument();
  });
});
