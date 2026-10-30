import { expect, test, type Locator } from "@playwright/test";

import { captureScreen, expectStyle } from "../support/screen";

const agentUser = process.env.OTOBO_AGENT_USER;
const agentPassword = process.env.OTOBO_AGENT_PASSWORD;

test("agent ticket zoom, one element at a time", async ({ page }) => {
  test.skip(
    !agentUser || !agentPassword,
    "Set OTOBO_AGENT_USER and OTOBO_AGENT_PASSWORD after the installer.",
  );
  if (!agentUser || !agentPassword) {
    return;
  }

  await page.goto("/otobo/index.pl?Action=AgentTicketZoom;TicketID=1");
  const login = page.locator("#User");
  if (await login.isVisible()) {
    await login.fill(agentUser);
    await page.locator("#Password").fill(agentPassword);
    await page.locator("#LoginButton").click();
  }
  await expect(page.locator(".TicketZoom > .Headline")).toBeVisible();

  const styles = await captureScreen(page, "agent-ticket-zoom", [
    "#AppWrapper > .MessageBox.Error",
    "#AppWrapper > .MessageBox.Notice",
    ".MainBox.TicketZoom",
    ".TicketZoom .ContentColumn > .WidgetSimple",
    "#ArticleTree > .WidgetSimple",
    "#ArticleTable thead th",
    "#ArticleTable tbody td",
    "#nav-Back a",
    "#ArticleItems .WidgetSimple",
    ".TicketZoom .SidebarColumn > .WidgetSimple",
  ]);

  expectStyle(styles["#AppWrapper > .MessageBox.Error"], {
    margin: "8px 24px 0px",
    "border-radius": "14px",
  });
  expectStyle(styles["#AppWrapper > .MessageBox.Notice"], {
    margin: "8px 24px 0px",
    "border-radius": "14px",
  });
  expectStyle(styles[".MainBox.TicketZoom"], {
    padding: "12px 24px 56px",
  });
  expectStyle(styles[".TicketZoom .ContentColumn > .WidgetSimple"], {
    margin: "0px 0px 20px",
    "border-radius": "18px",
  });
  expectStyle(styles["#ArticleTree > .WidgetSimple"], {
    margin: "0px 0px 20px",
    "border-radius": "18px",
  });
  expectStyle(styles["#ArticleTable thead th"], {
    "background-color": "rgba(0, 0, 0, 0)",
    "font-size": "11px",
    "font-weight": "700",
    padding: "2px 10px 10px",
  });
  expectStyle(styles["#ArticleTable tbody td"], {
    "font-size": "13px",
    padding: "10px",
  });
  expectStyle(styles["#nav-Back a"], {
    "background-color": "rgb(247, 248, 250)",
    "border-radius": "999px",
    "font-size": "13px",
    "font-weight": "600",
    padding: "7px 12px",
  });
  expectStyle(styles["#ArticleItems .WidgetSimple"], {
    margin: "0px 0px 20px",
    "border-radius": "18px",
  });
  expectStyle(styles[".TicketZoom .SidebarColumn > .WidgetSimple"], {
    margin: "0px 0px 20px",
    "border-radius": "18px",
  });

  await page.locator("#nav-Priority a").click();
  const dialog = page.frameLocator("#LabTicketActionDialog > iframe");
  await expect(dialog.locator("#Compose .LayoutPopup > .Header h1")).toContainText(
    "Change Priority",
  );

  const dialogStyles = await captureScreen(page, "agent-ticket-priority", [
    "#LabTicketActionShade",
    "#LabTicketActionDialog",
  ]);
  expectStyle(dialogStyles["#LabTicketActionShade"], {
    "background-color": "rgba(0, 2, 60, 0.45)",
    width: "1440px",
    height: "900px",
  });
  expectStyle(dialogStyles["#LabTicketActionDialog"], {
    width: "880px",
    height: "820px",
    "background-color": "rgb(255, 255, 255)",
    "border-radius": "20px",
  });

  const header = dialog.locator("#Compose .LayoutPopup > .Header");
  const submit = dialog.locator("#submitRichText");
  await expect(header).toBeVisible();
  await expect(submit).toBeVisible();
  expect(await computed(header, "padding")).toBe("22px 28px 0px");
  expect(await computed(header, "background-color")).toBe("rgb(255, 255, 255)");
  expect(await computed(submit, "height")).toBe("46px");
  expect(await computed(submit, "border-radius")).toBe("12px");
  const accent = await dialog.locator("body").evaluate((body) => {
    const probe = body.ownerDocument.createElement("span");
    probe.style.color = "var(--colMainLight)";
    body.appendChild(probe);
    const color = getComputedStyle(probe).color;
    probe.remove();
    return color;
  });
  expect(await computed(submit, "background-color")).toBe(accent);
});

async function computed(locator: Locator, key: string): Promise<string> {
  return locator.evaluate(
    (element, property) => getComputedStyle(element).getPropertyValue(property),
    key,
  );
}
