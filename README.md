# Tetiana Dovgalenko — portfolio and design system

A monorepo with the portfolio site and the design system it is built from.

```
packages/
  tokens/      @tetiana/tokens   DTCG design tokens → CSS custom properties (Style Dictionary)
  ui/          @tetiana/ui       React + TypeScript components, Storybook, unit tests
apps/
  portfolio/   portfolio         Astro site, /system docs page, end-to-end tests, hosting worker
```

The site consumes the design system as packages (`@tetiana/ui`, `@tetiana/tokens`) through npm workspaces, so
changes show up immediately without publishing, while the boundary between product and system stays explicit.

## Commands

Run from the repo root.

| Command             | What it does                                                                               |
| ------------------- | ------------------------------------------------------------------------------------------ |
| `npm install`       | Installs every workspace                                                                   |
| `npm run dev`       | Portfolio on http://localhost:4321 (design system docs at `/system/`)                      |
| `npm run storybook` | Storybook on http://localhost:6006                                                         |
| `npm run tokens`    | Rebuilds `@tetiana/tokens` after editing token source files                                |
| `npm run build`     | Site into `dist/client`, Storybook into `dist/client/storybook`, worker into `dist/server` |
| `npm test`          | Component unit tests (Vitest + Testing Library)                                            |
| `npm run test:e2e`  | Builds, then Playwright: behaviour, axe accessibility, visual snapshots                    |
| `npm run lint`      | ESLint across all workspaces                                                               |
| `npm run typecheck` | TypeScript in every workspace                                                              |
| `npm run format`    | Prettier                                                                                   |

## Working with AI agents

[`AGENTS.md`](AGENTS.md) holds the rules agents follow when changing the site or the system.
