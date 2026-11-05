import { expect, test } from "@playwright/test";

test("every capability has a door that opens to its character", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "Doors live in the frame gutters, which collapse on narrow screens.");
  await page.goto("/");
  const doors = page.getByRole("button", { name: "Open the pixel door" });
  await expect(doors).toHaveCount(5);

  const first = doors.first();
  await first.scrollIntoViewIfNeeded();
  await first.click();
  await expect(page.getByRole("button", { name: "Close the pixel door" })).toHaveAttribute("aria-pressed", "true");
});

test("capability headings read as plain text to assistive tech", async ({ page }) => {
  await page.goto("/");
  for (const name of ["Design Systems", "AI Product Building", "Greenfield Enterprise Products"]) {
    await expect(page.getByRole("heading", { level: 3, name })).toBeVisible();
  }
});

test("proof links open the case studies", async ({ page }) => {
  await page.goto("/");
  const link = page.getByRole("link", { name: "See it in DocuStream" });
  await expect(link).toHaveAttribute("href", "/work/docustream/");
  await link.click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/high-stakes legal filing/);
});

for (const slug of ["design-to-production", "ted-design-system", "timeflow", "dutchwaffle", "docustream", "bookit"]) {
  test(`${slug} case renders its hero and sections`, async ({ page }) => {
    await page.goto(`/work/${slug}/`);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(await page.getByRole("heading", { level: 2 }).count()).toBeGreaterThan(3);
  });
}

test("get in touch opens the contact links and Escape closes them", async ({ page }) => {
  await page.goto("/");
  const dialog = page.getByRole("dialog", { name: "Get in touch" });
  await expect(dialog).toBeHidden();
  await page.getByRole("button", { name: "Get in touch" }).click();
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("link")).toHaveCount(4);
  await expect(dialog.getByRole("link", { name: /Email/ })).toHaveAttribute("href", /^mailto:/);
  await expect(dialog.getByRole("link", { name: /CV/ })).toHaveAttribute("target", "_blank");
  await dialog.getByRole("link", { name: /GitHub/ }).hover();
  await expect(dialog.getByRole("button", { name: "Copy link: GitHub" })).toHaveCSS("opacity", "1");
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("hidden cases stay out of the next-case links", async ({ page }) => {
  await page.goto("/work/design-to-production/");
  await expect(page.locator('a[href="/work/ted-design-system/"]')).toHaveCount(0);
  await expect(page.locator('main a[href="/work/timeflow/"]')).not.toHaveCount(0);
});

test("old case URLs forward to the new pages", async ({ page }) => {
  await page.goto("/Cases/timeflow.html");
  await expect(page).toHaveURL(/\/work\/timeflow\/$/);
  await page.goto("/bookit.updated.html");
  await expect(page).toHaveURL(/\/work\/bookit\/$/);
});

test("case screenshots open full screen", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "Covered on desktop; the viewer is the same component.");
  await page.goto("/work/docustream/");
  const shot = page.getByAltText("Filing detail - Details panel");
  await shot.scrollIntoViewIfNeeded();
  await shot.click();
  const viewer = page.getByRole("dialog");
  await expect(viewer).toHaveAccessibleName(/Filing detail - Details panel/);
  await page.keyboard.press("Escape");
  await expect(viewer).toBeHidden();
});

test("the page never scrolls sideways", async ({ page }) => {
  await page.goto("/");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});
