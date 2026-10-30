import { expect, test } from "@playwright/test";

import { captureScreen, expectStyle } from "../support/screen";

const agentUser = process.env.OTOBO_AGENT_USER;
const agentPassword = process.env.OTOBO_AGENT_PASSWORD;

const objectLabel =
  ".MainBox.LayoutFixedSidebar.SidebarFirst > .ContentColumn > form.Validate > .WidgetSimple > .Content > fieldset.TableLike:nth-of-type(1) > label:nth-of-type(1)";
const objectValue =
  ".MainBox.LayoutFixedSidebar.SidebarFirst > .ContentColumn > form.Validate > .WidgetSimple > .Content > fieldset.TableLike:nth-of-type(1) > div.Value:nth-of-type(1)";

test("agent statistics view, settings sit next to the sidebar cards", async ({
  page,
}) => {
  test.skip(
    !agentUser || !agentPassword,
    "Set OTOBO_AGENT_USER and OTOBO_AGENT_PASSWORD after the installer.",
  );
  if (!agentUser || !agentPassword) {
    return;
  }

  await page.goto(
    "/otobo/index.pl?Action=AgentStatistics;Subaction=View;StatID=5",
  );
  const login = page.locator("#User");
  if (await login.isVisible()) {
    await login.fill(agentUser);
    await page.locator("#Password").fill(agentPassword);
    await page.locator("#LoginButton").click();
  }
  await expect(page.locator(objectLabel)).toBeVisible();

  const styles = await captureScreen(page, "agent-statistics-view", [
    objectLabel,
    objectValue,
  ]);

  expectStyle(styles[objectLabel], {
    width: "160px",
    "text-align": "left",
  });
  expectStyle(styles[objectValue], {
    margin: "0px 0px 0px 168px",
  });
});
