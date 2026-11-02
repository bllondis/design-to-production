# Working on this portfolio

Guidance for AI coding agents (and people) changing this site. The design system is documented live at `/system`
and in Storybook (`npm run storybook`); this file is the short version of its rules.

## Stack

- **Astro** builds static pages from `src/pages`. Page layout and sections are `.astro` components.
- **React + TypeScript** for the UI building blocks in `src/components/ui/<Name>/`: component, CSS module, story, test.
- **Tokens** in `tokens/*.tokens.json` (W3C DTCG). `npm run tokens` generates `src/styles/tokens.css` and
  `src/data/tokens.json` with Style Dictionary. Never edit the generated files.
- Case study pages in `public/Cases/` and `public/bookit.updated.html` are standalone HTML and not yet on the system.

## Rules

1. **Use semantic tokens only.** In components write `var(--color-text-muted)`, `var(--space-inset)`,
   `var(--font-size-display-4)`, never raw hex, px sizes or primitive tokens such as `--color-ink-400`.
   If no token fits, add a semantic token in `tokens/semantic.tokens.json` instead of hard-coding a value.
2. **Reuse before you build.** Check `src/components/ui/index.ts` and `/system` first. Extend a component with a
   variant prop rather than copying it.
3. **Headings go through `Heading`.** Pick `as` for the outline and `size` for the look; keep `pixel` on for display
   titles on dark surfaces and off for long editorial headlines.
4. **Content lives in data.** Capability blocks come from `src/data/capabilities.js`; navigation and contact details
   from `src/data/site.js`. Adding a capability is a data change, not new markup.
5. **Hydrate only what moves.** Static React components render without a client directive. Interactive ones
   (`PixelDoor`, `Heading` with pixels, `AsciiVisual`, `SignalField`) use `client:visible`, or `client:load` above the fold.
6. **Respect reduced motion.** Every animation must stop under `prefers-reduced-motion`; canvases draw a still frame.
7. **Keep the frame.** Full-width content sits in `Frame` → `FrameRow`; markers (Tile, PixelDoor) go in the
   `gutter` slot so they keep the 1-of-12 rhythm.
8. **Accessibility is a requirement.** Visible text must have a real accessible name; decorative canvases are
   `aria-hidden`; interactive elements are buttons or links with clear labels.

## Before you finish

```bash
npm run lint && npm run format:check && npm run typecheck && npm test
npm run test:e2e          # builds, then runs Playwright: behaviour, axe accessibility, visual snapshots
```

After an intended visual change, refresh baselines with `npx playwright test --grep @visual --update-snapshots`
and look at the new images before committing them.

## Breakpoints

- wide: above 980px
- medium: 980px and below; frame gutters collapse, two-column layouts stack
- narrow: 680px and below; single column, page padding drops to 0.75rem
