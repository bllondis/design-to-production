import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const outputDirectory = join(root, "assets");

const selections = [
  {
    source: "Cases/docustream.html",
    alt: "Dashboard - portfolio overview",
    output: "docustream-dashboard.jpg",
  },
  {
    source: "Cases/timeflow.html",
    alt: "Review your day - don't log it",
    output: "timeflow-review.jpg",
  },
  {
    source: "bookit.updated.html",
    alt: "Floorplan editor - main view",
    output: "bookit-floorplan.jpg",
  },
];

function escapeExpression(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

await mkdir(outputDirectory, { recursive: true });

for (const selection of selections) {
  const html = await readFile(join(root, selection.source), "utf8");
  const alt = escapeExpression(selection.alt).replace("&", "(?:&|&amp;)");
  const pattern = new RegExp(
    `<img\\b(?=[^>]*\\balt="${alt}")(?=[^>]*\\bsrc="data:([^;,\"]+)(?:;[^,\"]*)?,([^\"]+)")[^>]*>`,
    "i",
  );
  const match = html.match(pattern);

  if (!match) {
    throw new Error(`Could not find ${selection.alt} in ${selection.source}`);
  }

  const [, , encoded] = match;
  await writeFile(join(outputDirectory, selection.output), Buffer.from(encoded, "base64"));
  console.log(`Extracted ${selection.output}`);
}
