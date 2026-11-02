import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatRow } from "./StatRow";

describe("StatRow", () => {
  it("pairs each number with its label as a description list", () => {
    render(
      <StatRow
        items={[
          { value: "100", suffix: "+", label: "Document types" },
          { value: "6", label: "Roles" },
        ]}
      />,
    );
    expect(screen.getByText("Document types").tagName).toBe("DT");
    expect(screen.getByText("Document types").nextElementSibling).toHaveTextContent("100+");
  });
});
