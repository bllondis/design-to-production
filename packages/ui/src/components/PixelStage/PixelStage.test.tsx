import { render, screen } from "@testing-library/react";
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

  it("lets the flying character use the page perches without adding a shelf to its rail", () => {
    const { container } = render(
      <PixelStage
        character="/pigeon.jpg"
        motion={{ kind: "fly", walk: "/pigeon-walk.png", flight: "/pigeon-fly.png" }}
      />,
    );
    expect(container.querySelector("[data-pixel-stage-perch]")).not.toBeInTheDocument();
    expect(container.querySelector('[data-pixel-stage][data-motion="fly"]')).toBeInTheDocument();
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
});
