import { expect, test } from "@playwright/test";

import { captureScreen } from "../support/screen";

test("agent entry screen is reachable", async ({ page }) => {
  const response = await page.goto("/otobo/index.pl");
  expect(response?.ok()).toBeTruthy();
  await expect(page.locator("body")).toBeVisible();
  await captureScreen(page, "agent-entry", ["body"]);
});
