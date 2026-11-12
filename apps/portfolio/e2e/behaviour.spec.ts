import { expect, test } from "@playwright/test";

test("every capability has a door that opens to its character", async ({ page }) => {
  await page.goto("/");
  // One active door per capability: the empty door across a walk rail is hidden from assistive tech.
  const doors = page.getByRole("button", { name: "Open the pixel door" });
  await expect(doors).toHaveCount(5);

  const first = doors.first();
  await first.scrollIntoViewIfNeeded();
  await expect(first).toHaveCSS("cursor", "pointer");
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
  await expect(doors.last()).toHaveCSS("cursor", "default");

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
  if (test.info().project.name === "mobile") await expect(row.locator("[data-pixel-stage-perch]")).toHaveCount(0);

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

test("visible text stays inside every narrow page block", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "The narrow-column wrapping is mobile-only.");

  const routes = [
    "/",
    "/uk/",
    "/nl/",
    "/work/design-to-production/",
    "/work/timeflow/",
    "/work/dutchwaffle/",
    "/work/docustream/",
    "/work/bookit/",
    "/work/ted-design-system/",
    "/system/",
  ];

  for (const width of [319, 375]) {
    await page.setViewportSize({ width, height: 812 });

    for (const path of routes) {
      await page.goto(path);
      await page.evaluate(async () => document.fonts.ready);

      const audit = await page.evaluate(() => {
        const visible = (element: Element) => {
          const style = getComputedStyle(element);
          const rect = element.getBoundingClientRect();
          return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
        };
        const elements = [
          ...document.querySelectorAll("h1, h2, h3, h4, h5, h6, p, li, dt, dd, figcaption, a, button, span"),
        ]
          .filter(visible)
          .filter((element) => (element as HTMLElement).innerText.trim());

        return {
          page: document.documentElement.scrollWidth - innerWidth,
          elements: elements
            .filter((element) => {
              const overflow = getComputedStyle(element).overflowX;
              return !["hidden", "clip"].includes(overflow) && element.scrollWidth > element.clientWidth + 1;
            })
            .map((element) => ({
              tag: element.tagName,
              text: (element as HTMLElement).innerText.trim().replace(/\s+/g, " ").slice(0, 120),
              clientWidth: element.clientWidth,
              scrollWidth: element.scrollWidth,
            })),
        };
      });

      expect(audit.page, `${path} at ${width}px has horizontal page overflow`).toBeLessThanOrEqual(0);
      expect(audit.elements, `${path} at ${width}px has overflowing text`).toEqual([]);
    }
  }
});

test("mobile skill rows glow only when they enter the reading area", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "The scroll reveal is mobile-only.");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/nl/");
  const cell = page.locator("[data-skill-grid] li").first();
  await expect(cell).not.toHaveAttribute("data-revealed", "true");
  await cell.scrollIntoViewIfNeeded();
  await expect(cell).toHaveAttribute("data-revealed", "true");
  const animation = await cell.evaluate((element) => getComputedStyle(element, "::before").animationName);
  expect(animation).toContain("skill-reveal-glow");
});

test("skill cells do not present a false hover state at mobile width", async ({ page }) => {
  await page.setViewportSize({ width: 319, height: 909 });
  await page.goto("/nl/");
  const cell = page.locator("[data-skill-grid] li").nth(3);
  await cell.scrollIntoViewIfNeeded();
  await cell.hover();
  await expect(cell).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await expect(cell).toHaveCSS("color", "rgb(244, 245, 240)");
});

test("the mobile footer presents a scroll-aware icon dock", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "The icon dock is mobile-only.");
  await page.goto("/");
  const footer = page.locator("body > footer");
  const mobileFooter = footer.locator(".mobile-footer");
  const dock = footer.locator(".mobile-dock");
  await expect(dock.locator("a")).toHaveCount(5);
  await expect(dock.locator("a span")).toHaveCount(0);
  await expect(mobileFooter).toHaveCSS("position", "fixed");
  await expect(mobileFooter).toHaveAttribute("data-visible", "false");
  await expect(mobileFooter).toHaveAttribute("inert", "");
  await expect(dock.locator("svg")).toHaveCount(5);
  await expect(footer.getByRole("link", { name: "Design to Production" })).toBeHidden();
  await expect(footer.getByRole("link", { name: "Design Systems" })).toBeHidden();

  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, window.innerHeight * 2);
  });
  await page.evaluate(
    () => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))),
  );
  await expect(mobileFooter).toHaveAttribute("data-visible", "false");
  await page.evaluate(() => window.scrollBy(0, -window.innerHeight * 0.3));
  await expect(mobileFooter).toHaveAttribute("data-visible", "true");
  await expect(mobileFooter).not.toHaveAttribute("inert", "");

  for (const name of ["Email", "LinkedIn", "GitHub", "CV", "Back to top"]) {
    await expect(dock.getByRole("link", { name, exact: true })).toBeVisible();
  }

  await page.evaluate(() => window.scrollBy(0, window.innerHeight * 0.3));
  await expect(mobileFooter).toHaveAttribute("data-visible", "false");

  await page.locator("#contact").scrollIntoViewIfNeeded();
  await expect(mobileFooter).toHaveAttribute("data-visible", "true");
  await dock.getByRole("link", { name: "Back to top" }).click();
  await expect(page).toHaveURL(/\/#top$/);
  await expect(mobileFooter).toHaveAttribute("data-visible", "false");
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

test("each mobile hero statement stays on one line in every locale", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "The compact hero is mobile-only.");
  await page.setViewportSize({ width: 319, height: 812 });

  for (const path of ["/", "/uk/", "/nl/"]) {
    await page.goto(path);
    await page.evaluate(async () => document.fonts.ready);
    const metrics = await page.locator("#hero-title").evaluate((heading) => {
      const style = getComputedStyle(heading);
      return {
        authoredLines: (heading as HTMLElement).innerText.trim().split("\n").length,
        renderedLines: heading.getBoundingClientRect().height / Number.parseFloat(style.lineHeight),
        clientWidth: heading.clientWidth,
        scrollWidth: heading.scrollWidth,
      };
    });

    expect(metrics.authoredLines, path).toBe(3);
    expect(metrics.renderedLines, path).toBeLessThan(3.1);
    expect(metrics.scrollWidth, path).toBeLessThanOrEqual(metrics.clientWidth);
  }
});

test("every capability door shows its localised hint only while it is hovered", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "A mouse is required to exercise hover.");

  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 812 });

    for (const locale of [
      { path: "/", hint: "Tap a door" },
      { path: "/uk/", hint: "Торкніться дверцят" },
      { path: "/nl/", hint: "Tik op een deur" },
    ]) {
      await page.goto(locale.path);
      const doors = page.locator("main button:enabled:visible").filter({ has: page.locator("[data-door-hint]") });
      await expect(doors).toHaveCount(5);

      for (const door of await doors.all()) {
        const hint = door.getByText(locale.hint, { exact: true });
        await door.hover();
        await expect(hint).toBeVisible();
        await page.mouse.move(200, 0);
        await expect(hint).toBeHidden();
      }
    }
  }
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

test("localised anchors and case links resolve from nested language routes", async ({ page }, testInfo) => {
  await page.goto("/uk/");
  const footer = page.locator("body > footer");
  if (testInfo.project.name === "mobile") {
    await footer.scrollIntoViewIfNeeded();
    await expect(footer.locator(".mobile-footer")).toHaveAttribute("data-visible", "true");
    const top = footer.getByRole("link", { name: "На початок сторінки" });
    await expect(top).toHaveAttribute("href", "/uk/#top");
    await top.click();
    await expect(page).toHaveURL(/\/uk\/#top$/);
  } else {
    const work = footer.getByRole("link", { name: "Роботи" }).first();
    await expect(work).toHaveAttribute("href", "/uk/#work");
    await work.click();
    await expect(page).toHaveURL(/\/uk\/#work$/);
  }

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
