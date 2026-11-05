import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TagList } from "./TagList";

describe("TagList", () => {
  it("renders plain tags as list items without links", () => {
    render(<TagList items={["Filing status", "Lapse tracking"]} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("renders a tag with an href as a named link", () => {
    render(<TagList items={[{ label: "Timeflow", href: "/work/timeflow/" }, "Plain"]} />);
    expect(screen.getByRole("link", { name: "Timeflow" })).toHaveAttribute("href", "/work/timeflow/");
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });
});
