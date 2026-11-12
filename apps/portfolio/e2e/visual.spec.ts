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
    // The mobile dock is fixed to the viewport. Keep component snapshots isolated; it has its own footer snapshot.
    if (region.name !== "footer") {
      await page.addStyleTag({ content: ".mobile-footer { display: none !important; }" });
    }
    const target = page.locator(region.locator);
    await target.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await expect(target).toHaveScreenshot(`${region.name}.png`, { animations: "disabled" });
  });
}

test("contact-popup @visual", async ({ page }, testInfo) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({ content: ".mobile-footer { display: none !important; }" });
  await page.getByRole("button", { name: "Get in touch" }).click();
  const dialog = page.getByRole("dialog", { name: "Get in touch" });
  if (testInfo.project.name === "desktop") await dialog.getByRole("button", { name: "Copy Email" }).hover();
  await expect(dialog).toHaveScreenshot("contact-popup.png", { animations: "disabled" });
});

test("mobile-menu @visual", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "The compact navigation is only shown on narrow screens.");
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(page).toHaveScreenshot("mobile-menu.png", { animations: "disabled" });
});

test("case-mobile-index @visual", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "The case index is only shown on narrow screens.");
  await page.goto("/work/design-to-production/");
  await page.addStyleTag({ content: ".mobile-footer { display: none !important; }" });
  const index = page.getByRole("navigation", { name: "In this case" });
  await index.getByText("In this case").click();
  await expect(index).toHaveScreenshot("case-mobile-index.png", { animations: "disabled" });
});

test("case-mobile-gallery @visual", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "The swipe gallery is only shown on narrow screens.");
  await page.goto("/work/design-to-production/");
  await page.addStyleTag({ content: ".mobile-footer { display: none !important; }" });
  const gallery = page.locator(".shots").first();
  await gallery.scrollIntoViewIfNeeded();
  await expect(gallery).toHaveScreenshot("case-mobile-gallery.png", { animations: "disabled" });
});

test("pigeon-mobile-rail @visual", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "The compact pigeon rail is only shown on narrow screens.");
  await page.goto("/");
  await page.addStyleTag({ content: ".mobile-footer { display: none !important; }" });
  const rail = page.locator("article[aria-labelledby='mature-title'] [data-pixel-stage]");
  await rail.scrollIntoViewIfNeeded();
  await expect(rail).toHaveScreenshot("pigeon-mobile-rail.png", { animations: "disabled" });
});
