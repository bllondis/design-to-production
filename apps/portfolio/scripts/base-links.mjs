import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

/** The HTML with root-relative links moved under `base`. Text is left alone, so code samples keep their paths. */
export const applyBase = (html, base) => {
  const folder = base.slice(1);
  const root = new RegExp(`(=\\s*"|&quot;|url=|url\\()/(?!/|${folder}(?:/|&quot;|"))`, "g");
  return html
    .replace(/<[a-zA-Z][^>]*>/g, (tag) => tag.replaceAll(root, `$1${base}/`))
    .replaceAll('location.replace("/', `location.replace("${base}/`);
};

/**
 * Astro's `base` covers the files it bundles but not the paths written by hand in content and data, or the old-URL
 * forwards in public/. This moves those once the pages are built, so sources keep writing "/work/…" on any host.
 */
export const baseLinks = () => {
  let base = "/";
  return {
    name: "base-links",
    hooks: {
      "astro:config:done": ({ config }) => {
        base = config.base.replace(/\/$/, "") || "/";
      },
      "astro:build:done": async ({ dir }) => {
        if (base === "/") return;
        const root = fileURLToPath(dir);
        const files = await readdir(root, { recursive: true });
        for (const file of files.filter((name) => name.endsWith(".html"))) {
          const path = join(root, file);
          await writeFile(path, applyBase(await readFile(path, "utf8"), base));
        }
      },
    },
  };
};
