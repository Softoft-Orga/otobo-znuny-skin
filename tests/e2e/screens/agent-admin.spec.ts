import { expect, test } from "@playwright/test";

import { captureScreen, expectStyle } from "../support/screen";

const agentUser = process.env.OTOBO_AGENT_USER;
const agentPassword = process.env.OTOBO_AGENT_PASSWORD;

const category =
  ".MainBox.LayoutFixedSidebar.SidebarFirst > .ContentColumn > .WidgetSimple:nth-child(2)";
const tile =
  ".MainBox.LayoutFixedSidebar.SidebarFirst > .ContentColumn .ItemListGrid.WithIcons > li > a.AsBlock";
const tileGrid =
  ".MainBox.LayoutFixedSidebar.SidebarFirst > .ContentColumn .ItemListGrid.WithIcons";

test("agent admin overview, one element at a time", async ({ page }) => {
  test.skip(
    !agentUser || !agentPassword,
    "Set OTOBO_AGENT_USER and OTOBO_AGENT_PASSWORD after the installer.",
  );
  if (!agentUser || !agentPassword) {
    return;
  }

  await page.goto("/otobo/index.pl?Action=Admin");
  const login = page.locator("#User");
  if (await login.isVisible()) {
    await login.fill(agentUser);
    await page.locator("#Password").fill(agentPassword);
    await page.locator("#LoginButton").click();
  }
  await expect(page.locator(category)).toBeVisible();

  const styles = await captureScreen(page, "agent-admin", [
    ".MainBox.LayoutFixedSidebar.SidebarFirst > .SidebarColumn",
    category,
    tileGrid,
    tile,
    "#Filter",
  ]);

  expectStyle(
    styles[".MainBox.LayoutFixedSidebar.SidebarFirst > .SidebarColumn"],
    {
      margin: "0px 12px 0px 0px",
    },
  );
  expectStyle(styles[category], {
    "border-radius": "18px",
    margin: "0px 0px 12px",
  });
  expectStyle(styles[tileGrid], {
    "column-gap": "8px",
  });
  expectStyle(styles[tile], {
    "border-radius": "16px",
    padding: "60px 16px 18px",
  });
  expectStyle(styles["#Filter"], {
    "border-radius": "14px",
    padding: "10px 14px",
  });
});
