import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import astro from "eslint-plugin-astro";
import reactHooks from "eslint-plugin-react-hooks";
import storybook from "eslint-plugin-storybook";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "dist/",
      "build-docustream.mjs",
      "tools/",
      "storybook-static/",
      "legacy/",
      "public/",
      ".astro/",
      "src/styles/tokens.css",
      "src/data/tokens.json",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  reactHooks.configs.flat.recommended,
  ...storybook.configs["flat/recommended"],
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  prettier,
);
