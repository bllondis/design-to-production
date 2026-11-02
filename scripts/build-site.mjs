import { cp, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Runs after `astro build`, which has already written the static site to dist/client.
// The host also needs the worker that adds security and cache headers.
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const server = join(root, "dist", "server");

await mkdir(server, { recursive: true });
await cp(join(root, "worker", "index.js"), join(server, "index.js"));

console.log("Built static portfolio for Sites.");
