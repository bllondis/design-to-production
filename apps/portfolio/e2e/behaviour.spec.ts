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
  await expect(dialog.getByRole("link")).toHaveCount(3);
  const email = dialog.getByRole("button", { name: "Copy Email" });
  const emailRow = email.locator("..");
  await email.hover();
  await expect(emailRow.getByRole("tooltip", { name: "Copy" })).toHaveCSS("opacity", "1");

  for (const label of ["LinkedIn", "GitHub", "CV"]) {
    const link = dialog.getByRole("link", { name: new RegExp(label) });
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
  }

  const linkedin = dialog.getByRole("link", { name: /LinkedIn/ });
  const linkedinRow = linkedin.locator("..");
  await linkedin.hover();
  await expect(linkedinRow.getByRole("tooltip", { name: "Open" })).toHaveCSS("opacity", "1");
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

test("method steps highlight on hover instead of scroll", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "Touch layouts do not expose hover states.");
  await page.goto("/");
  const step = page.locator("section[aria-labelledby='method-title'] li").first();
  await step.scrollIntoViewIfNeeded();
  await expect(page.locator("section[aria-labelledby='method-title'] [data-active]")).toHaveCount(0);

  const restingBackground = await step.evaluate((element) => getComputedStyle(element).backgroundColor);
  await step.hover();
  await expect
    .poll(() => step.evaluate((element) => getComputedStyle(element).backgroundColor))
    .not.toBe(restingBackground);
});

test("the language switcher navigates between the three home pages", async ({ page }) => {
  await page.goto("/");
  const switcher = page.locator("[data-language-switcher]");
  const trigger = switcher.locator("summary");

  await expect(trigger).toHaveAccessibleName("Change language. Current language: English");
  await trigger.click();
  await expect(switcher.getByRole("link")).toHaveCount(3);
  await expect(switcher.getByRole("link")).toHaveText([/English/, /Nederlands/, /Українська/]);
  await expect(switcher.getByRole("link", { name: /English/ })).toHaveAttribute("aria-current", "page");

  await switcher.getByRole("link", { name: /Nederlands/ }).click();
  await expect(page).toHaveURL(/\/nl\/$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "nl");
  await expect(page.locator("[data-language-switcher] summary")).toHaveAccessibleName(
    "Taal wijzigen. Huidige taal: Nederlands",
  );

  await page.locator("[data-language-switcher] summary").click();
  await page.getByRole("link", { name: /Українська/ }).click();
  await expect(page).toHaveURL(/\/uk\/$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "uk");
});

for (const locale of [
  { path: "/", work: "Work", about: "About" },
  { path: "/uk/", work: "Роботи", about: "Про мене" },
  { path: "/nl/", work: "Werk", about: "Over mij" },
]) {
  test(`${locale.path} omits work and about from the header navigation`, async ({ page }) => {
    await page.goto(locale.path);
    const header = page.locator("body > header");
    await expect(header.getByRole("link", { name: locale.work, exact: true })).toHaveCount(0);
    await expect(header.getByRole("link", { name: locale.about, exact: true })).toHaveCount(0);
  });
}

test("case pages provide a clear route home", async ({ page }) => {
  await page.goto("/work/design-to-production/");
  const header = page.locator("body > header");
  const home = header.getByRole("link", { name: "Home", exact: true });
  await expect(home).toHaveAttribute("href", "/#top");
  await expect(header.getByRole("link", { name: "Work", exact: true })).toHaveCount(0);
  await expect(header.getByRole("link", { name: "About", exact: true })).toHaveCount(0);
  await home.click();
  await expect(page).toHaveURL(/\/#top$/);
});

for (const locale of [
  {
    path: "/",
    lang: "en",
    title: "Tetiana Dovgalenko | Product Designer and Design Engineer",
    heading: "Complex B2B products AI‑assisted workflows Design systems",
    work: "Capabilities",
  },
  {
    path: "/uk/",
    lang: "uk",
    title: "Тетяна Довгаленко — продуктова дизайнерка та дизайн-інженерка",
    heading: "Складні B2B-продукти Робочі процеси з ШІ Дизайн-системи",
    work: "Напрями роботи",
  },
  {
    path: "/nl/",
    lang: "nl",
    title: "Tetiana Dovgalenko — productdesigner en design engineer",
    heading: "Complexe B2B-producten Workflows met AI Designsystemen",
    work: "Expertise",
  },
]) {
  test(`${locale.path} renders localised metadata, content and stable destinations`, async ({ page }) => {
    await page.goto(locale.path);
    await expect(page.locator("html")).toHaveAttribute("lang", locale.lang);
    await expect(page).toHaveTitle(locale.title);
    await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName(locale.heading);
    await expect(page.getByRole("region", { name: locale.work })).toBeVisible();
    await expect(page.locator('a[href="/work/docustream/"]').first()).toBeVisible();
    await expect(page.locator('a[href="/Tetiana_Dovgalenko_Resume.pdf"]').first()).toHaveAttribute("target", "_blank");
    await expect(page.locator('link[rel="alternate"]')).toHaveCount(4);
  });
}

test("localised anchors and case links resolve from nested language routes", async ({ page }) => {
  await page.goto("/uk/");
  const work = page.locator("body > footer").getByRole("link", { name: "Роботи" }).first();
  await expect(work).toHaveAttribute("href", "/uk/#work");
  await work.click();
  await expect(page).toHaveURL(/\/uk\/#work$/);

  await page.getByRole("link", { name: "Переглянути кейс DocuStream" }).click();
  await expect(page).toHaveURL(/\/work\/docustream\/$/);
});

test("the Ukrainian contact panel opens and copies a contact value", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/uk/");
  await page.getByRole("button", { name: "Зв’язатися" }).click();
  const dialog = page.getByRole("dialog", { name: "Зв’язатися" });
  await expect(dialog).toBeVisible();

  const copy = dialog.getByRole("button", { name: "Скопіювати — Електронна пошта" });
  const emailRow = copy.locator("..");
  await copy.click();
  await expect(emailRow.getByRole("tooltip", { name: "Скопійовано" })).toBeVisible();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe("tetiana.dovgalenko@gmail.com");
});
