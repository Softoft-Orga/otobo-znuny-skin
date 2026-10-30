import { expect, test } from "@playwright/test";

import { captureScreen, expectStyle } from "../support/screen";

const agentUser = process.env.OTOBO_AGENT_USER;
const agentPassword = process.env.OTOBO_AGENT_PASSWORD;

test("agent email ticket, one element at a time", async ({ page }) => {
  test.skip(
    !agentUser || !agentPassword,
    "Set OTOBO_AGENT_USER and OTOBO_AGENT_PASSWORD after the installer.",
  );
  if (!agentUser || !agentPassword) {
    return;
  }

  await page.goto("/otobo/index.pl?Action=AgentTicketEmail");
  const login = page.locator("#User");
  if (await login.isVisible()) {
    await login.fill(agentUser);
    await page.locator("#Password").fill(agentPassword);
    await page.locator("#LoginButton").click();
  }
  await expect(page.locator("#NewEmailTicket")).toBeVisible();
  await expect(page.locator("#RichTextField .ck-editor")).toBeVisible();
  await expect(page.locator("#Dest_Search")).toBeVisible();

  const styles = await captureScreen(page, "agent-ticket-email", [
    ".MainBox.FormScreen > h1",
    ".MainBox.FormScreen > .LayoutFixedSidebar.SidebarLast",
    "#NewEmailTicket > fieldset.ModularForm > div.Row > div.FieldCell",
    "#NewEmailTicket",
    "#ToCustomer",
    "#CcCustomer",
    "#Subject",
    "#Signature",
    "#NextStateID_Search ~ .InputField_Selection .Text",
    "#PriorityID_Search ~ .InputField_Selection .Text",
    ".DnDUpload",
    "#submitRichText",
    "#CustomerInfo",
    "#CustomerInfo > .Header",
    "#CustomerInfo > .Content",
  ]);

  expectStyle(styles[".MainBox.FormScreen > h1"], {
    margin: "0px 0px 18px",
    "font-size": "20px",
    "text-align": "left",
  });
  expectStyle(styles[".MainBox.FormScreen > .LayoutFixedSidebar.SidebarLast"], {
    display: "grid",
    "column-gap": "24px",
  });
  expectStyle(styles["#NewEmailTicket > fieldset.ModularForm > div.Row > div.FieldCell"], {
    display: "flex",
  });
  expectStyle(styles["#NewEmailTicket"], {
    "background-color": "rgb(255, 255, 255)",
    "border-radius": "20px",
    padding: "28px 32px 32px",
  });
  expectStyle(styles["#ToCustomer"], {
    "border-radius": "12px",
    height: "44px",
    padding: "0px 44px 0px 14px",
  });
  expectStyle(styles["#CcCustomer"], {
    "border-radius": "12px",
    height: "44px",
  });
  expectStyle(styles["#Subject"], {
    "border-radius": "12px",
    "font-size": "14px",
    height: "44px",
  });
  expectStyle(styles["#Signature"], {
    "border-radius": "14px",
    height: "200px",
  });
  expectStyle(styles["#NextStateID_Search ~ .InputField_Selection .Text"], {
    "font-size": "14px",
    height: "32px",
    padding: "6px 14px",
  });
  expectStyle(styles["#PriorityID_Search ~ .InputField_Selection .Text"], {
    "font-size": "14px",
    height: "32px",
    padding: "6px 14px",
  });
  expectStyle(styles[".DnDUpload"], {
    "border-radius": "16px",
  });
  expectStyle(styles["#submitRichText"], {
    "border-radius": "12px",
    height: "46px",
    padding: "0px 28px",
  });
  expectStyle(styles["#CustomerInfo"], {
    "border-radius": "20px",
    margin: "0px",
  });
  expectStyle(styles["#CustomerInfo > .Header"], {
    padding: "20px 22px 0px",
  });
  expectStyle(styles["#CustomerInfo > .Content"], {
    padding: "12px 22px 22px",
  });
});
