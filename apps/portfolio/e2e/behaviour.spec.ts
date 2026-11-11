import { expect, test } from "@playwright/test";

test("every capability has a door that opens to its character", async ({ page }) => {
  await page.goto("/");
  // One active door per capability: the empty door across a walk rail is hidden from assistive tech.
  const doors = page.getByRole("button", { name: "Open the pixel door" });
  await expect(doors).toHaveCount(5);

  const first = doors.first();
  await first.scrollIntoViewIfNeeded();
  await first.click();
  await expect(page.getByRole("button", { name: "Close the pixel door" })).toHaveAttribute("aria-pressed", "true");
});

test("the cat walks from its door to the one across the row", async ({ page }) => {
  // The suite runs with reduced motion, under which nothing travels.
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const row = page.locator("article[aria-labelledby='systems-title'] > header");
  const stage = row.locator("[data-route='across']:visible");
  const doors = stage.locator("button");
  await expect(doors).toHaveCount(2);
  await expect(doors.first().locator("img")).toHaveCount(1);
  await expect(doors.last().locator("img")).toHaveCount(0);
  await expect(doors.last()).toBeDisabled();

  await doors.first().scrollIntoViewIfNeeded();
  await doors.first().click();
  await expect(stage).toHaveAttribute("data-phase", "strolling");
  await expect(stage).toHaveAttribute("data-phase", "home", { timeout: 10_000 });
  await expect(stage).toHaveAttribute("data-from", "end");
  await expect(doors.last().locator("img")).toHaveCount(1);
  await expect(doors.first().locator("img")).toHaveCount(0);
  await expect(doors.last()).toBeEnabled();
  await expect(doors.first()).toBeDisabled();
});

test("the pigeon leaves its door, and flies home when the door is opened again", async ({ page }) => {
  // The suite runs with reduced motion, under which nothing leaves.
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const row = page.locator("article[aria-labelledby='mature-title'] > header");
  const home = row.locator("[data-phase]:visible");
  const door = home.getByRole("button");
  const bird = page.locator("body > span[data-mode]");
  await expect(bird).toHaveCount(0);

  await door.scrollIntoViewIfNeeded();
  await door.click();
  await expect(home).toHaveAttribute("data-phase", "out");
  await expect(bird).toBeVisible();
  // The door shuts behind it, empty.
  await expect(door).toHaveAttribute("aria-pressed", "false");
  await expect(door.locator("img")).toHaveCount(0);

  await door.click();
  await expect(home).toHaveAttribute("data-phase", "home", { timeout: 10_000 });
  await expect(bird).toHaveCount(0);
  await expect(door).toHaveAttribute("aria-pressed", "false");
  await expect(door.locator("img")).toHaveCount(1);
});

test("the beet plants itself under its door, and comes back when the door is opened again", async ({ page }) => {
  // The suite runs with reduced motion, under which nothing leaves.
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const row = page.locator("article[aria-labelledby='greenfield-title'] > header");
  const home = row.locator("[data-phase]:visible");
  const door = home.getByRole("button");

  await door.scrollIntoViewIfNeeded();
  await door.click();
  await expect(home).toHaveAttribute("data-phase", "planted", { timeout: 10_000 });
  await expect(door).toHaveAttribute("aria-pressed", "false");
  await expect(door.locator("img")).toHaveCount(0);

  await door.click();
  await expect(home).toHaveAttribute("data-phase", "home", { timeout: 10_000 });
  await expect(door.locator("img")).toHaveCount(1);
});

test("the sloth climbs out of its door and falls asleep hanging from it", async ({ page }) => {
  // The suite runs with reduced motion, under which nothing leaves.
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const row = page.locator("article[aria-labelledby='ai-building-title'] > header");
  const home = row.locator("[data-phase]:visible");
  const door = home.getByRole("button");

  await door.scrollIntoViewIfNeeded();
  await door.click();
  await expect(home).toHaveAttribute("data-phase", "climbing");
  // It is in no hurry.
  await expect(home).toHaveAttribute("data-phase", "asleep", { timeout: 15_000 });
  await expect(door).toHaveAttribute("aria-pressed", "false");
  await expect(door.locator("img")).toHaveCount(0);

  await door.click();
  await expect(home).toHaveAttribute("data-phase", "waking");
  await expect(door).toHaveAttribute("aria-pressed", "true");
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
    await expect(page.getByRole("button", { name: /^(open|close) the pixel door$/i })).toHaveCount(0);
    expect(await page.getByRole("heading", { level: 2 }).count()).toBeGreaterThan(3);
  });
}

test("links that leave the site open in a new tab", async ({ page }) => {
  await page.goto("/work/timeflow/");
  const live = page.getByRole("link", { name: "Open the live product" });
  await expect(live).toHaveCount(2);
  for (const link of await live.all()) {
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
  }
});

test("the system page and Storybook open in a new tab from their case", async ({ page }) => {
  await page.goto("/work/design-to-production/");
  for (const name of ["Explore the design system", "Open Storybook"]) {
    const link = page.getByRole("link", { name });
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
  }
  await expect(page.getByRole("link", { name: "Open Storybook" })).toHaveAttribute("href", "/storybook/");
});

test("get in touch opens the contact links and Escape closes them", async ({ page }, testInfo) => {
  await page.goto("/");
  const dialog = page.getByRole("dialog", { name: "Get in touch" });
  await expect(dialog).toBeHidden();
  await page.getByRole("button", { name: "Get in touch" }).click();
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("link")).toHaveCount(3);
  const email = dialog.getByRole("button", { name: "Copy Email" });
  const emailRow = email.locator("..");
  if (testInfo.project.name === "desktop") {
    await email.hover();
    await expect(emailRow.getByRole("tooltip", { name: "Copy" })).toHaveCSS("opacity", "1");
  } else {
    await expect(emailRow.locator('[role="tooltip"]')).toBeHidden();
  }

  for (const label of ["LinkedIn", "GitHub", "CV"]) {
    const link = dialog.getByRole("link", { name: new RegExp(label) });
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
  }

  const linkedin = dialog.getByRole("link", { name: /LinkedIn/ });
  const linkedinRow = linkedin.locator("..");
  if (testInfo.project.name === "desktop") {
    await linkedin.hover();
    await expect(linkedinRow.getByRole("tooltip", { name: "Open" })).toHaveCSS("opacity", "1");
  } else {
    await expect(linkedinRow.locator('[role="tooltip"]')).toBeHidden();
  }
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

test("case screenshots open full screen", async ({ page }) => {
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

test("the language switcher navigates between the three home pages", async ({ page }, testInfo) => {
  await page.goto("/");
  if (testInfo.project.name === "mobile") {
    const openMenu = async (label: string) => {
      await page.getByRole("button", { name: label }).click();
      return page.getByRole("list", { name: /Languages|Talen|Мови/ });
    };

    let languages = await openMenu("Open menu");
    await expect(languages.getByRole("link")).toHaveText([/English/, /Nederlands/, /Українська/]);
    await expect(languages.getByRole("link", { name: /English/ })).toHaveAttribute("aria-current", "page");
    await languages.getByRole("link", { name: /Nederlands/ }).click();
    await expect(page).toHaveURL(/\/nl\/$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "nl");

    languages = await openMenu("Menu openen");
    await languages.getByRole("link", { name: /Українська/ }).click();
    await expect(page).toHaveURL(/\/uk\/$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "uk");
    return;
  }

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

test("the mobile header opens every primary destination from a burger menu", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "The compact navigation is only shown on narrow screens.");
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto("/");
  const header = page.locator("body > header");
  const trigger = header.locator("[data-mobile-nav] > button");
  await expect(trigger).toHaveAccessibleName("Open menu");
  await trigger.click();
  await expect(trigger).toHaveAccessibleName("Close menu");
  const navigation = header.getByRole("navigation", { name: "Primary navigation" });
  await expect(navigation).toBeVisible();
  await expect(navigation.locator("a")).toHaveText([/CV/, /GitHub/, /LinkedIn/, /English/, /Nederlands/, /Українська/]);
  await expect(navigation.getByRole("link", { name: /English/ })).toHaveAttribute("aria-current", "page");
  await page.keyboard.press("Escape");
  await expect(trigger).toHaveAccessibleName("Open menu");
  await expect(trigger).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
});

test("the mobile header hides on the way down and returns on the way up", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "The compact sticky header is mobile-only.");
  await page.goto("/");
  const header = page.locator("body > header");
  await page.evaluate(() => window.scrollTo(0, 900));
  await expect(header).toHaveClass(/header--hidden/);
  await page.evaluate(() => window.scrollTo(0, 500));
  await expect(header).not.toHaveClass(/header--hidden/);
});

test("the mobile hero reveals its message within a short first viewport", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "The compact hero is mobile-only.");
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("/");
  const box = await page.getByRole("heading", { level: 1 }).boundingBox();
  expect(box).not.toBeNull();
  expect((box?.y ?? 0) + (box?.height ?? 0)).toBeLessThanOrEqual(667);
  const hero = await page.locator("#top").boundingBox();
  expect(hero).not.toBeNull();
  expect(hero?.height ?? 667).toBeLessThan(667);
});

test("the first mobile character rail explains the door interaction", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "The compact character rail is mobile-only.");
  await page.goto("/");
  const hint = page.getByText("Tap a door", { exact: true });
  await hint.scrollIntoViewIfNeeded();
  await expect(hint).toBeVisible();
  await hint.locator("..").getByRole("button", { name: "Open the pixel door" }).click();
  await expect(hint).toHaveCount(0);
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
  const home = header.getByRole("link", { name: "Back to home", exact: true });
  await expect(home).toHaveAttribute("href", "/#top");
  await expect(header.getByRole("link", { name: "Work", exact: true })).toHaveCount(0);
  await expect(header.getByRole("link", { name: "About", exact: true })).toHaveCount(0);
  await home.click();
  await expect(page).toHaveURL(/\/#top$/);
});

test("mobile case pages expose an index, reading progress and swipeable media", async ({ page, context }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "The case index and swipe layout are mobile-only.");
  await page.goto("/work/design-to-production/");
  const index = page.getByRole("navigation", { name: "In this case" });
  await expect(index).toBeVisible();
  await index.getByText("In this case").click();
  const links = index.getByRole("link");
  expect(await links.count()).toBeGreaterThan(5);
  await links.first().click();
  await expect(index.locator("details")).not.toHaveAttribute("open", "");
  await expect(page.locator("body > header")).toHaveAttribute("data-reading-progress", "");

  const gallery = page.locator(".shots").first();
  await gallery.scrollIntoViewIfNeeded();
  expect(await gallery.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);

  const copy = page.locator("[data-copy-snippet]").first();
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await copy.scrollIntoViewIfNeeded();
  await copy.click();
  await expect(copy).toHaveText("Copied");
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

test("the Ukrainian contact panel opens and copies a contact value", async ({ page, context }, testInfo) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/uk/");
  await page.getByRole("button", { name: "Зв’язатися" }).click();
  const dialog = page.getByRole("dialog", { name: "Зв’язатися" });
  await expect(dialog).toBeVisible();

  const copy = dialog.getByRole("button", { name: "Скопіювати — Електронна пошта" });
  const emailRow = copy.locator("..");
  await copy.click();
  await expect(emailRow.locator("[data-touch-feedback]")).toHaveText("Скопійовано");
  if (testInfo.project.name === "mobile") {
    await expect(emailRow.locator("[data-touch-feedback]")).toBeVisible();
  } else {
    await expect(emailRow.locator("[data-touch-feedback]")).toBeHidden();
  }
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe("tetiana.dovgalenko@gmail.com");
});
