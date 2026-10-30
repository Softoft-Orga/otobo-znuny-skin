import { expect, test } from "@playwright/test";

import { captureScreen, expectStyle } from "../support/screen";

const agentUser = process.env.OTOBO_AGENT_USER;
const agentPassword = process.env.OTOBO_AGENT_PASSWORD;

test("agent dashboard, one element at a time", async ({ page }) => {
  test.skip(
    !agentUser || !agentPassword,
    "Set OTOBO_AGENT_USER and OTOBO_AGENT_PASSWORD after the installer.",
  );
  if (!agentUser || !agentPassword) {
    return;
  }

  await page.goto("/otobo/index.pl");
  await page.locator("#User").fill(agentUser);
  await page.locator("#Password").fill(agentPassword);
  await page.locator("#LoginButton").click();
  await expect(page.locator("#Header")).toBeVisible();

  const styles = await captureScreen(page, "agent-dashboard", [
    "#Header",
    "#NavigationContainer",
    "#Dashboard0120-TicketNew-box",
    "#Dashboard0120-TicketNew table.DataTable thead th.Title",
    "#Dashboard0120-TicketNew table.DataTable tbody td",
    "#Dashboard0120-TicketNewAll",
    "#Footer",
    ".SettingsWidget .WidgetAction.Toggle i",
  ]);

  expectStyle(styles["#Header"], {
    "border-radius": "18px",
    margin: "16px 24px 0px",
    padding: "16px 22px",
    height: "100px",
  });
  expectStyle(styles["#NavigationContainer"], {
    left: "46px",
  });
  expectStyle(styles[".SettingsWidget .WidgetAction.Toggle i"], {
    top: "16px",
    left: "16px",
  });
  expectStyle(styles["#Dashboard0120-TicketNew-box"], {
    "border-radius": "18px",
    margin: "0px 0px 24px",
  });
  expectStyle(styles["#Dashboard0120-TicketNew table.DataTable thead th.Title"], {
    "background-color": "rgba(0, 0, 0, 0)",
    "font-size": "11px",
    "font-weight": "700",
    padding: "2px 10px 10px",
  });
  expectStyle(styles["#Dashboard0120-TicketNew table.DataTable tbody td"], {
    "background-color": "rgba(0, 0, 0, 0)",
    "font-size": "13px",
    padding: "10px",
  });
  expectStyle(styles["#Dashboard0120-TicketNewAll"], {
    "font-size": "13px",
    "font-weight": "700",
    padding: "0px 0px 6px",
  });
  expectStyle(styles["#Footer"], {
    "border-radius": "16px",
    margin: "0px 24px 20px",
  });
});
