import { expect, test } from "@playwright/test";

import { captureScreen, expectStyle } from "../support/screen";

const agentUser = process.env.OTOBO_AGENT_USER;
const agentPassword = process.env.OTOBO_AGENT_PASSWORD;

test("agent ticket status view, one element at a time", async ({ page }) => {
  test.skip(
    !agentUser || !agentPassword,
    "Set OTOBO_AGENT_USER and OTOBO_AGENT_PASSWORD after the installer.",
  );
  if (!agentUser || !agentPassword) {
    return;
  }

  await page.goto("/otobo/index.pl?Action=AgentTicketStatusView;View=Small");
  const login = page.locator("#User");
  if (await login.isVisible()) {
    await login.fill(agentUser);
    await page.locator("#Password").fill(agentPassword);
    await page.locator("#LoginButton").click();
  }
  await expect(page.locator(".OverviewBox > h1")).toBeVisible();

  const styles = await captureScreen(page, "agent-ticket-status", [
    ".OverviewBox > h1",
    "#OverviewControl",
    "#OverviewBody > form > table.TableSmall > thead > tr > th",
    "#OverviewBody > form > table.TableSmall > tbody > tr > td",
  ]);

  expectStyle(styles[".OverviewBox > h1"], {
    "font-size": "22px",
    "font-weight": "700",
  });
  expectStyle(styles["#OverviewControl"], {
    "background-color": "rgb(255, 255, 255)",
    "border-radius": "18px 18px 0px 0px",
  });
  expectStyle(styles["#OverviewBody > form > table.TableSmall > thead > tr > th"], {
    "background-color": "rgba(0, 0, 0, 0)",
    "font-size": "11px",
    "font-weight": "700",
    padding: "8px 10px 10px",
  });
  expectStyle(styles["#OverviewBody > form > table.TableSmall > tbody > tr > td"], {
    "font-size": "13px",
    padding: "10px",
  });
});
