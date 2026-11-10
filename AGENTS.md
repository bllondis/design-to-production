# Working on this repo

Guidance for AI coding agents (and people) changing the portfolio or its design system. The system is documented
live at `/system` on the site and in Storybook (`npm run storybook`); this file is the short version of its rules.

## Layout

- `packages/tokens` (`@tetiana/tokens`): token source in `tokens/*.tokens.json` (W3C DTCG). `npm run tokens`
  regenerates `build/tokens.css` and `build/tokens.json` with Style Dictionary. Never edit `build/` by hand.
- `packages/ui` (`@tetiana/ui`): React + TypeScript components. Each lives in `src/components/<Name>/` with its CSS
  module, story and test; animation engines are in `src/lib/`. `src/styles/global.css` is the base layer.
- `apps/portfolio`: the Astro site. Pages in `src/pages`, layout and sections as `.astro` components, content in
  `src/data`, static files in `public/`. Case studies are MDX in `src/content/cases/`, rendered by
  `src/pages/work/[slug].astro` from the case components in `src/components/case/`; their images live in
  `public/work/<case>/`. The old URLs under `public/Cases/` and `public/bookit.updated.html` only forward to `/work/…`.

The app imports the system only through the package names (`@tetiana/ui`, `@tetiana/ui/styles.css`,
`@tetiana/tokens/...`). The packages never import from the app.

## Rules

1. **Use semantic and component tokens, never primitives.** Tokens come in three tiers, mirrored one-to-one by the
   Figma variable collections Primitives, Semantic and Component. In components write `var(--color-text-muted)`,
   `var(--space-inset)` or the component's own `var(--button-light-bg)`, never raw hex, px sizes or primitive tokens
   such as `--color-ink-400`. A decision that belongs to one component goes in
   `packages/tokens/tokens/component.tokens.json` and points at semantic tokens; a shared role goes in
   `semantic.tokens.json`. When you add or rename a token, update the matching Figma variable too.
2. **Reuse before you build.** Check `packages/ui/src/index.ts`, Storybook and `/system` first. Extend a component
   with a variant prop rather than copying it. New building blocks go in `@tetiana/ui` with a story and a test.
3. **Headings go through `Heading`.** Pick `as` for the outline and `size` for the look; keep `pixel` on for display
   titles on dark surfaces and off for long editorial headlines.
4. **Content lives in data.** Capability blocks come from `apps/portfolio/src/data/capabilities.js`; navigation and
   contact details from `apps/portfolio/src/data/site.js`; case studies are MDX files. Adding a capability or a case
   is a content change, not new markup — compose existing case components before inventing new ones.
5. **Hydrate only what moves.** Static components render without a client directive. Interactive ones
   (`PixelDoor`, `PixelWalk`, `PixelFlight`, `PixelBurrow`, `PixelHang`, `Heading` with pixels, `AsciiVisual`,
   `SignalField`) use `client:visible`, or `client:load` above the fold.
6. **Respect reduced motion.** Every animation must stop under `prefers-reduced-motion`; canvases draw a still frame.
7. **Keep the frame.** Full-width content sits in `Frame` → `FrameRow`; markers (Tile, PixelDoor) go in the
   `gutter` slot so they keep the 1-of-12 rhythm. A `PixelWalk` goes in the `across` slot, which spans both gutters.
8. **Accessibility is a requirement.** Visible text must have a real accessible name; decorative canvases are
   `aria-hidden`; interactive elements are buttons or links with clear labels.

## Before you finish

```bash
npm run lint && npm run format:check && npm run typecheck && npm test
npm run test:e2e          # builds, then runs Playwright: behaviour, axe accessibility, visual snapshots
```

After an intended visual change, refresh baselines from `apps/portfolio` with
`npx playwright test --grep @visual --update-snapshots` and look at the new images before committing them.

## Breakpoints

- wide: above 980px
- medium: 980px and below; frame gutters collapse, two-column layouts stack
- narrow: 680px and below; single column, page padding drops to 0.75rem
