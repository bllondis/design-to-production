import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SkillGrid } from "./SkillGrid";

describe("SkillGrid", () => {
  it("lists every skill under its label", () => {
    render(<SkillGrid items={["Domain modelling", "Information architecture"]} />);
    expect(screen.getByText("What I bring")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem").map((item) => item.textContent)).toEqual([
      "Domain modelling",
      "Information architecture",
    ]);
  });
});
