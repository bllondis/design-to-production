import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Heading } from "./Heading";

describe("Heading", () => {
  afterEach(() => vi.restoreAllMocks());

  it("exposes the full text once to assistive tech when pixel letters are on", () => {
    render(<Heading as="h3" size="display-4" text="Design Systems" />);
    const heading = screen.getByRole("heading", { level: 3, name: "Design Systems" });
    expect(heading.querySelector("[aria-hidden='true']")).toBeInTheDocument();
  });

  it("pixelates only a small, stable share of letters at rest", () => {
    const { container, rerender } = render(<Heading size="display-2" text="AI Design Engineering" />);
    const first = [...container.querySelectorAll(".letters .pixel")].map((node) => node.textContent);
    expect(first.length).toBeGreaterThan(0);
    expect(first.length).toBeLessThan(8);
    rerender(<Heading size="display-2" text="AI Design Engineering" />);
    expect([...container.querySelectorAll(".letters .pixel")].map((node) => node.textContent)).toEqual(first);
  });

  it("pixelates Ukrainian letters as well as Latin ones", () => {
    const { container } = render(
      <Heading size="display-2" text={"Складні B2B-продукти\nРобочі процеси з ШІ\nДизайн-системи"} animate={false} />,
    );
    const pixelLetters = [...container.querySelectorAll(".letters .pixel")].map((node) => node.textContent ?? "");
    expect(pixelLetters.length).toBeGreaterThan(0);
    expect(pixelLetters.some((character) => /[А-Яа-яІіЇїЄєҐґ]/u.test(character))).toBe(true);
  });

  it("measures each word by its resting letters, so the letters showing cannot move the layout", () => {
    const { container } = render(<Heading size="display-2" text="AI Design Engineering" />);
    const words = [...container.querySelectorAll(".word")];
    expect(words.map((word) => word.querySelector(".slot")?.textContent)).toEqual(["AI", "Design", "Engineering"]);
    for (const word of words) {
      const pick = (layer: string) => [...word.querySelectorAll(`${layer} span`)].map((letter) => letter.className);
      expect(pick(".letters")).toEqual(pick(".slot"));
    }
  });

  it("squeezes a word whose letters have outgrown its place, and leaves the rest alone", () => {
    // jsdom lays nothing out: say every word has 100px of room and its showing letters want 130px.
    vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockImplementation(function (this: HTMLElement) {
      return this.classList.contains("letters") ? 130 : 100;
    });
    const { container, unmount } = render(<Heading size="display-2" text="Design Systems" />);
    const squeezed = [...container.querySelectorAll<HTMLElement>(".letters")].map((word) =>
      Number(/scaleX\(([\d.]+)\)/.exec(word.style.transform)?.[1]),
    );
    // 100 of 130, plus the sliver of overhang a word is allowed.
    expect(squeezed).toHaveLength(2);
    for (const scale of squeezed) {
      expect(scale).toBeGreaterThanOrEqual(100 / 130);
      expect(scale).toBeLessThan(0.82);
    }
    unmount();

    vi.restoreAllMocks();
    const fitting = render(<Heading size="display-2" text="Design Systems" />);
    expect(fitting.container.querySelector<HTMLElement>(".letters")?.style.transform).toBe("");
  });

  it("renders plain text without pixel markup when pixel is off", () => {
    render(<Heading as="h1" size="display-1" text="I design calm interfaces." pixel={false} />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading.children).toHaveLength(0);
    expect(heading).toHaveTextContent("I design calm interfaces.");
  });

  it("breaks lines at \\n and names the heading with plain spaces", () => {
    render(<Heading size="heading-1" text={"Working across\ncomplex systems."} pixel={false} />);
    const heading = screen.getByRole("heading", { name: "Working across complex systems." });
    expect(heading.querySelectorAll("br")).toHaveLength(1);
  });

  it("keeps forced breaks with pixel letters on", () => {
    const { container } = render(<Heading size="heading-1" text={"Working across\ncomplex systems."} />);
    expect(screen.getByRole("heading", { name: "Working across complex systems." })).toBeInTheDocument();
    expect(container.querySelectorAll("[aria-hidden='true'] br")).toHaveLength(1);
  });

  it("keeps a word joined for assistive tech when a visual break follows a hyphen", () => {
    render(<Heading size="display-2" text={"Дизайн-\nінженерія\nз ШІ"} />);
    expect(screen.getByRole("heading", { name: "Дизайн-інженерія з ШІ" })).toBeInTheDocument();
  });

  it("supports narrower visual line breaks without changing the accessible title", () => {
    const { container } = render(
      <Heading
        as="h3"
        size="display-4"
        text="Bestaande bedrijfssoftware uitbreiden"
        mobileText={"Bestaande\nbedrijfs-\nsoftware\nuitbreiden"}
      />,
    );
    expect(screen.getByRole("heading", { name: "Bestaande bedrijfssoftware uitbreiden" })).toBeInTheDocument();
    expect(container.querySelectorAll(".mobileText br")).toHaveLength(3);
  });

  it("sets the measure as a custom property", () => {
    render(<Heading size="display-4" text="Design Systems" measure={16} />);
    expect(screen.getByRole("heading").style.getPropertyValue("--heading-measure")).toBe("16ch");
  });
});
