import StyleDictionary from "style-dictionary";

// Tokens live in tokens/*.tokens.json (DTCG format). This turns them into CSS custom properties
// (build/tokens.css) and a flat JSON list for documentation (build/tokens.json).
const here = new URL(".", import.meta.url).pathname;
const dictionary = new StyleDictionary({
  source: [`${here}tokens/*.tokens.json`],
  usesDtcg: true,
  log: { verbosity: "silent" },
  platforms: {
    css: {
      transformGroup: "css",
      transforms: ["name/kebab", "fontFamily/css", "cubicBezier/css"],
      buildPath: `${here}build/`,
      files: [
        {
          destination: "tokens.css",
          format: "css/variables",
          options: { outputReferences: true },
        },
      ],
    },
    docs: {
      transforms: ["name/kebab", "fontFamily/css", "cubicBezier/css"],
      buildPath: `${here}build/`,
      files: [{ destination: "tokens.json", format: "docs/flat" }],
    },
  },
});

dictionary.registerFormat({
  name: "docs/flat",
  format: ({ dictionary: { allTokens } }) =>
    JSON.stringify(
      allTokens.map((token) => ({
        name: token.name,
        path: token.path,
        type: token.$type,
        value: token.$value,
        reference:
          typeof token.original.$value === "string" && token.original.$value.startsWith("{")
            ? token.original.$value.slice(1, -1)
            : null,
        description: token.$description ?? null,
        tier: token.filePath.includes("primitives") ? "primitive" : "semantic",
      })),
      null,
      2,
    ),
});

await dictionary.buildAllPlatforms();
console.log("Built design tokens.");
