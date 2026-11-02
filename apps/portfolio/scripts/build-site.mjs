import { cp, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Runs after `astro build` and the Storybook build, which have already written dist/client at the repo root.
// The host also needs the worker that adds security and cache headers.
const app = dirname(dirname(fileURLToPath(import.meta.url)));
const server = join(app, "..", "..", "dist", "server");

await mkdir(server, { recursive: true });
await cp(join(app, "worker", "index.js"), join(server, "index.js"));

console.log("Built static portfolio for Sites.");
