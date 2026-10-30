import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const accent = process.argv[2];
const expected = {
  "softoft-indigo": "rgb(30, 58, 95)",
  "softoft-teal": "rgb(30, 70, 54)",
  "softoft-amber": "rgb(61, 68, 81)",
  "softoft-crimson": "rgb(110, 48, 48)",
};

if (!expected[accent]) {
  console.error("Pass softoft-indigo, softoft-teal, softoft-amber, or softoft-crimson.");
  process.exit(1);
}

const outDir = path.resolve("screenshots/accents");
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const user = process.env.OTOBO_AGENT_USER || "root@localhost";
const password = process.env.OTOBO_AGENT_PASSWORD || "root";
await page.goto("http://127.0.0.1:8111/otobo/index.pl");
await page.locator("#User").fill(user);
await page.locator("#Password").fill(password);
await page.locator("#LoginButton").click();
await page.locator("#Header").waitFor();
// Lab notices (superuser, daemon, time zone) sit above the skin. Hide them in the shot.
await page.addStyleTag({ content: ".MessageBox { display: none !important; }" });

const header = await page.locator("#Header").evaluate((node) => getComputedStyle(node).backgroundColor);
if (header !== expected[accent]) {
  console.error(`Header is ${header}, expected ${expected[accent]} for ${accent}.`);
  await browser.close();
  process.exit(1);
}

const file = path.join(outDir, `${accent}-dashboard.png`);
await page.screenshot({ path: file });
console.log(file);
await browser.close();
