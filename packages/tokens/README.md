# @tetiana/tokens

Design tokens for the portfolio design system, written in the [W3C DTCG](https://www.designtokens.org/) format.

## Tiers

- **Primitives** (`tokens/primitives.tokens.json`): raw values with no meaning attached — the ink and paper
  palettes, the amber light, font stacks, durations, easings.
- **Semantic** (`tokens/semantic.tokens.json`): what a value is for — surfaces, text, borders, accent, door light,
  the type scale, tracking, line heights, spacing, layout and motion. Components use only this tier.

## Build

```bash
npm run build -w @tetiana/tokens
```

[Style Dictionary](https://styledictionary.com/) writes:

| File                | Use                                                                   |
| ------------------- | --------------------------------------------------------------------- |
| `build/tokens.css`  | CSS custom properties, e.g. `--color-text-muted`, `--space-inset`     |
| `build/tokens.json` | Flat list with values, references and descriptions, for documentation |

The build output is committed so the site and Storybook work straight after install. Edit the source files, never
the build output.

## Exports

```js
import "@tetiana/tokens/tokens.css";
import tokens from "@tetiana/tokens/tokens.json";
```
