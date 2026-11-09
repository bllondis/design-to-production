import { expect, test } from "@playwright/test";

// Run `npx playwright test --update-snapshots` after an intended visual change.
const regions = [
  { name: "hero", page: "/", locator: "#top" },
  { name: "hero-uk", page: "/uk/", locator: "#top" },
  { name: "hero-nl", page: "/nl/", locator: "#top" },
  { name: "case-header", page: "/work/design-to-production/", locator: "body > header" },
  {
    name: "chapter-uk",
    page: "/uk/",
    locator: "section[aria-labelledby='engineering-title'] > header",
  },
  {
    name: "chapter-nl",
    page: "/nl/",
    locator: "section[aria-labelledby='engineering-title'] > header",
  },
  { name: "method", page: "/", locator: "section[aria-labelledby='method-title']" },
  { name: "method-uk", page: "/uk/", locator: "section[aria-labelledby='method-title']" },
  { name: "method-nl", page: "/nl/", locator: "section[aria-labelledby='method-title']" },
  { name: "capability", page: "/", locator: "article[aria-labelledby='systems-title']" },
  { name: "about", page: "/", locator: "#about" },
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

test("contact-popup @visual", async ({ page }, testInfo) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await page.getByRole("button", { name: "Get in touch" }).click();
  const dialog = page.getByRole("dialog", { name: "Get in touch" });
  if (testInfo.project.name === "desktop") await dialog.getByRole("button", { name: "Copy Email" }).hover();
  await expect(dialog).toHaveScreenshot("contact-popup.png", { animations: "disabled" });
});
