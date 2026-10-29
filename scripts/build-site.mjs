import { cp, mkdir, readdir, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const output = join(root, "dist");
const client = join(output, "client");
const server = join(output, "server");

const rootFiles = [
  "index.html",
  "styles.css",
  "script.js",
  "case-shell.css",
  "bookit.updated.html",
  "docustream.html",
];

await rm(output, { recursive: true, force: true });
await mkdir(client, { recursive: true });
await mkdir(server, { recursive: true });

for (const file of rootFiles) {
  await cp(join(root, file), join(client, file));
}

for (const directory of ["assets", "Cases"]) {
  await cp(join(root, directory), join(client, directory), { recursive: true });
}

await rm(join(client, "Cases", ".DS_Store"), { force: true });

const publicDirectory = join(root, "public");
try {
  for (const entry of await readdir(publicDirectory)) {
    await cp(join(publicDirectory, entry), join(client, entry), { recursive: true });
  }
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

await cp(join(root, "worker", "index.js"), join(server, "index.js"));

console.log("Built static portfolio for Sites.");
