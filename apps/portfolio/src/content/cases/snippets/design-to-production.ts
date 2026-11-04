// Source excerpts shown in the Design to production case. They live here, not in the MDX, so Prettier's
// Markdown formatting can't reflow or escape them.

export const componentTokens = `"button": {
  "light": {
    "$type": "color",
    "bg": { "$value": "{color.surface.inverse}" },
    "fg": { "$value": "{color.text.inverse}" },
    "bg-hover": { "$value": "{color.surface.page}" },
    "fg-hover": { "$value": "{color.text.primary}" }
  }
}`;

export const tokensCss = `--color-paper-50: #f4f5f0;
--color-surface-inverse: var(--color-paper-50);
--color-text-inverse: var(--color-ink-950);

--button-light-bg: var(--color-surface-inverse);
--button-light-fg: var(--color-text-inverse);
--button-light-bg-hover: var(--color-surface-page);
--button-light-fg-hover: var(--color-text-primary);`;

export const buttonCss = `.light {
  border: 1px solid var(--button-light-bg);
  background: var(--button-light-bg);
  color: var(--button-light-fg);
}

.light:hover {
  background: var(--button-light-bg-hover);
  color: var(--button-light-fg-hover);
}`;

export const pixelDoorProps = `export type DoorState = "closed" | "peek" | "open";

export interface PixelDoorProps {
  /** Image shown behind the door. */
  character: string;
  /** Flap half a beat after neighbouring doors. */
  offset?: boolean;
  /** Ignore page scrolling (specimens). */
  still?: boolean;
  /** Starting state; "peek" holds the door ajar. */
  initialState?: DoorState;
}`;

export const pixelDoorTest = `it("starts closed and opens on click", async () => {
  render(<PixelDoor character="/cat.jpg" still />);
  const door = screen.getByRole("button", { name: "Open the pixel door" });
  expect(door).toHaveAttribute("aria-pressed", "false");
  await userEvent.click(door);
  expect(door).toHaveAttribute("aria-pressed", "true");
  expect(door).toHaveAccessibleName("Close the pixel door");
});`;

export const ciSteps = `- run: npm ci
- run: npm run tokens
- run: npm run lint
- run: npm run format:check
- run: npm run typecheck
- run: npm test
- run: npm run build
- run: npx playwright install --with-deps chromium
  working-directory: apps/portfolio
# Visual baselines are recorded on macOS, so CI runs behaviour and accessibility only.
- run: npx playwright test --grep-invert @visual
  working-directory: apps/portfolio`;

export const agentRules = `1. **Use semantic and component tokens, never primitives.** Tokens come in three tiers,
   mirrored one-to-one by the Figma variable collections Primitives, Semantic and Component.
   In components write \`var(--color-text-muted)\`, \`var(--space-inset)\` or the component's
   own \`var(--button-light-bg)\`, never raw hex, px sizes or primitive tokens.
2. **Reuse before you build.** Check \`packages/ui/src/index.ts\`, Storybook and \`/system\` first.
   Extend a component with a variant prop rather than copying it.`;
