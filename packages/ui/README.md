# @tetiana/ui

React + TypeScript components for the portfolio design system. Styled with CSS modules on top of
[`@tetiana/tokens`](../tokens); documented in Storybook and on the portfolio's `/system` page.

## Components

| Component     | What it is                                                    | Variants and states                                                         |
| ------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `Button`      | A link styled as an action                                    | `variant` light · dark · text, `size` m · s, `icon`, `external`             |
| `Heading`     | Every title on the site, with optional pixel letters          | `size` display-1…4 · heading-1, `as` h1–h4, `tone`, `pixel`, `measure`      |
| `Tile`        | Square chapter marker for the frame gutter                    | `label`, `inset`                                                            |
| `PixelDoor`   | Pixel-art door hiding a character; leaks warm light when ajar | closed · peek (hover, flapping on scroll) · open (click), `offset`, `still` |
| `SkillGrid`   | Labelled grid of skills, inverts on hover                     | 3 → 2 → 1 columns                                                           |
| `AsciiVisual` | Screenshot redrawn as a coloured glyph mosaic                 | `src`, `focus`, `caption`                                                   |
| `SignalField` | Animated glyph field for hero and contact backgrounds         | `tone` dark · light, `text`, `fade`, `top`, `opacity`                       |

## Use

```tsx
import "@tetiana/ui/styles.css"; // tokens + base layer, once per page
import { Button, Heading, PixelDoor } from "@tetiana/ui";

<Heading as="h3" size="display-4" text="Design Systems" />
<Button href="/Cases/timeflow.html">See it in Timeflow</Button>
```

Components that animate (`Heading` with pixels, `PixelDoor`, `AsciiVisual`, `SignalField`) need to run on the
client. In Astro, render them with `client:visible` (or `client:load` above the fold); the rest render as static HTML.
Every animation stops under `prefers-reduced-motion`.

## Develop

```bash
npm run storybook -w @tetiana/ui   # Storybook on http://localhost:6006
npm test -w @tetiana/ui            # Vitest + Testing Library
npm run typecheck -w @tetiana/ui
```

Each component lives in `src/components/<Name>/` with its CSS module, story and test. Animation engines are in
`src/lib/` and return cleanup functions so React can stop them.
