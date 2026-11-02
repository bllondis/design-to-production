import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { dirname, extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

// Serves the built site from dist/client the way the static host does, for end-to-end tests.
const root = join(dirname(dirname(fileURLToPath(import.meta.url))), "dist", "client");
const port = Number(process.env.PORT ?? 4322);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
  ".woff2": "font/woff2",
};

const resolve = async (pathname) => {
  const file = normalize(join(root, decodeURIComponent(pathname)));
  if (!file.startsWith(root)) return null;
  try {
    const info = await stat(file);
    return info.isDirectory() ? resolve(join(pathname, "index.html")) : file;
  } catch {
    return null;
  }
};

createServer(async (request, response) => {
  const file = await resolve(new URL(request.url ?? "/", "http://localhost").pathname);
  if (!file) {
    response.writeHead(404).end("Not found");
    return;
  }
  response.writeHead(200, { "Content-Type": types[extname(file)] ?? "application/octet-stream" });
  createReadStream(file).pipe(response);
}).listen(port, () => console.log(`Serving dist/client on http://localhost:${port}`));
