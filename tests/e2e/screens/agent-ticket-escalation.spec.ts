import { expect, test } from "@playwright/test";

import { captureScreen, expectStyle } from "../support/screen";

const agentUser = process.env.OTOBO_AGENT_USER;
const agentPassword = process.env.OTOBO_AGENT_PASSWORD;

test("agent ticket escalation view, one element at a time", async ({ page }) => {
  test.skip(
    !agentUser || !agentPassword,
    "Set OTOBO_AGENT_USER and OTOBO_AGENT_PASSWORD after the installer.",
  );
  if (!agentUser || !agentPassword) {
    return;
  }

  await page.goto("/otobo/index.pl?Action=AgentTicketEscalationView;View=Small");
  const login = page.locator("#User");
  if (await login.isVisible()) {
    await login.fill(agentUser);
    await page.locator("#Password").fill(agentPassword);
    await page.locator("#LoginButton").click();
  }
  await expect(page.locator(".OverviewBox > h1")).toBeVisible();

  const styles = await captureScreen(page, "agent-ticket-escalation", [
    ".OverviewBox > h1",
    "#OverviewControl",
    "#OverviewControl > div > .ControlRow > ul.Tabs > li.Active > a",
  ]);

  expectStyle(styles[".OverviewBox > h1"], {
    "font-size": "22px",
    "font-weight": "700",
    margin: "0px 0px 14px",
  });
  expectStyle(styles["#OverviewControl"], {
    "background-color": "rgb(255, 255, 255)",
    "border-radius": "18px 18px 0px 0px",
  });
  expectStyle(styles["#OverviewControl > div > .ControlRow > ul.Tabs > li.Active > a"], {
    "font-size": "13px",
    "font-weight": "700",
    padding: "10px 0px 8px",
  });
});
