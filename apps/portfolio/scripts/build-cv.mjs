import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";

// Prints resume/resume.html to the PDF the site links to. The source sits outside public/, so only the PDF ships.
const app = dirname(dirname(fileURLToPath(import.meta.url)));
const source = join(app, "resume", "resume.html");
const target = join(app, "public", "Tetiana_Dovgalenko_Resume.pdf");

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.goto(pathToFileURL(source).href, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  // The font comes from Google Fonts: without a connection the PDF would silently fall back to another typeface.
  if (!(await page.evaluate(() => document.fonts.check('400 16px "Urbanist"')))) {
    throw new Error("Urbanist did not load, so the CV was not rebuilt.");
  }
  await page.pdf({ path: target, preferCSSPageSize: true, printBackground: true });
  console.log(`Wrote ${target}`);
} finally {
  await browser.close();
}
