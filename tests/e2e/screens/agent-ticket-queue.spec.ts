import { expect, test } from "@playwright/test";

import { captureScreen, expectStyle } from "../support/screen";

const agentUser = process.env.OTOBO_AGENT_USER;
const agentPassword = process.env.OTOBO_AGENT_PASSWORD;

test("agent ticket queue, one element at a time", async ({ page }) => {
  test.skip(
    !agentUser || !agentPassword,
    "Set OTOBO_AGENT_USER and OTOBO_AGENT_PASSWORD after the installer.",
  );
  if (!agentUser || !agentPassword) {
    return;
  }

  await page.goto("/otobo/index.pl?Action=AgentTicketQueue;View=Small");
  const login = page.locator("#User");
  if (await login.isVisible()) {
    await login.fill(agentUser);
    await page.locator("#Password").fill(agentPassword);
    await page.locator("#LoginButton").click();
  }
  await expect(page.locator(".OverviewBox > h1")).toBeVisible();

  const styles = await captureScreen(page, "agent-ticket-queue", [
    ".OverviewBox > h1",
    ".OverviewBox > .WidgetSimple.QueueOverview",
    "ul.QueueOverviewList.Level_0 > li > a.Active",
    "#OverviewControl",
    "#OverviewControl > div > .ControlRow > ul.Tabs > li > a",
    "#OverviewBody",
  ]);

  expectStyle(styles[".OverviewBox > h1"], {
    "font-size": "22px",
    "font-weight": "700",
    color: "rgb(26, 29, 43)",
    margin: "0px 0px 14px",
  });
  expectStyle(styles[".OverviewBox > .WidgetSimple.QueueOverview"], {
    "background-color": "rgb(255, 255, 255)",
    "border-radius": "18px",
    margin: "0px 0px 16px",
  });
  expectStyle(styles["ul.QueueOverviewList.Level_0 > li > a.Active"], {
    "font-size": "13px",
    "font-weight": "700",
    padding: "12px 0px 10px",
  });
  expectStyle(styles["#OverviewControl"], {
    "background-color": "rgb(255, 255, 255)",
    "border-radius": "18px 18px 0px 0px",
  });
  expectStyle(styles["#OverviewControl > div > .ControlRow > ul.Tabs > li > a"], {
    "font-size": "13px",
    "font-weight": "600",
    "background-color": "rgba(0, 0, 0, 0)",
  });
  expectStyle(styles["#OverviewBody"], {
    "background-color": "rgb(255, 255, 255)",
    "border-radius": "0px 0px 18px 18px",
    margin: "0px 24px 24px",
  });
});
