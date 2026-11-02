import { expect, test } from "@playwright/test";

// Run `npx playwright test --update-snapshots` after an intended visual change.
const regions = [
  { name: "hero", page: "/", locator: "#top" },
  { name: "capability", page: "/", locator: "article[aria-labelledby='systems-title']" },
  { name: "contact", page: "/", locator: "#contact" },
  { name: "footer", page: "/", locator: "body > footer" },
  { name: "system-components", page: "/system/", locator: "#components" },
];

for (const region of regions) {
  test(`${region.name} @visual`, async ({ page }) => {
    await page.goto(region.page);
    await page.evaluate(() => document.fonts.ready);
    // Tall element shots are stitched, which can catch the off-screen skip link; it isn't part of the design.
    await page.addStyleTag({ content: ".skip-link { display: none !important; }" });
    const target = page.locator(region.locator);
    await target.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await expect(target).toHaveScreenshot(`${region.name}.png`, { animations: "disabled" });
  });
}
