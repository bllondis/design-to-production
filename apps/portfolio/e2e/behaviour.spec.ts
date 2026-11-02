import { expect, test } from "@playwright/test";

test("every capability has a door that opens to its character", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "Doors live in the frame gutters, which collapse on narrow screens.");
  await page.goto("/");
  const doors = page.getByRole("button", { name: "Open the pixel door" });
  await expect(doors).toHaveCount(4);

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

test("proof links point at the case studies", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "See it in DocuStream" })).toHaveAttribute(
    "href",
    "/Cases/docustream.html",
  );
  const response = await page.request.get("/Cases/docustream.html");
  expect(response.ok()).toBe(true);
});

test("the page never scrolls sideways", async ({ page }) => {
  await page.goto("/");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});
