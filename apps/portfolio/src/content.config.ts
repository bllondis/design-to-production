import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Case studies are MDX: frontmatter feeds the hero, the body is composed from the case components.
const cases = defineCollection({
  loader: glob({ pattern: "*.mdx", base: "./src/content/cases" }),
  schema: z.object({
    title: z.string(),
    client: z.string(),
    kicker: z.string(),
    summary: z.array(z.string()),
    meta: z.array(z.string()),
    note: z.string().optional(),
    stats: z.array(z.object({ value: z.string(), suffix: z.string().optional(), label: z.string() })).optional(),
    actions: z.array(z.object({ label: z.string(), href: z.string(), external: z.boolean().optional() })).optional(),
    cover: z.object({ src: z.string(), focus: z.string().optional(), caption: z.string().optional() }),
    character: z.string(),
    order: z.number(),
    // Hidden cases keep their page but are left out of the next-case links.
    hidden: z.boolean().default(false),
  }),
});

export const collections = { cases };
