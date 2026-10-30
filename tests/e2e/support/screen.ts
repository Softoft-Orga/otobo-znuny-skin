import { mkdir, writeFile } from "node:fs/promises";

import { expect, type Locator, type Page } from "@playwright/test";

const STYLE_KEYS = [
  "color",
  "background-color",
  "font-size",
  "font-family",
  "font-weight",
  "padding",
  "margin",
  "width",
  "height",
  "display",
  "border-radius",
  "column-gap",
  "left",
  "text-align",
  "top",
] as const;

export type ComputedStyle = Record<(typeof STYLE_KEYS)[number], string>;

export async function captureScreen(
  page: Page,
  name: string,
  selectors: readonly string[],
): Promise<Record<string, ComputedStyle>> {
  await mkdir("screenshots", { recursive: true });
  await page.screenshot({
    path: `screenshots/${name}.png`,
    fullPage: true,
  });

  const report: Record<string, ComputedStyle> = {};
  for (const selector of selectors) {
    const locator = page.locator(selector).first();
    await expect(locator, selector).toBeVisible();
    report[selector] = await readStyle(locator);
  }

  await writeFile(
    `screenshots/${name}.styles.json`,
    `${JSON.stringify(report, null, 2)}\n`,
  );
  return report;
}

export function expectStyle(
  actual: ComputedStyle,
  expected: Partial<ComputedStyle>,
): void {
  for (const [key, value] of Object.entries(expected)) {
    expect(actual[key as keyof ComputedStyle], key).toBe(value);
  }
}

async function readStyle(locator: Locator): Promise<ComputedStyle> {
  return locator.evaluate((element, keys) => {
    const computed = getComputedStyle(element);
    const style = {} as ComputedStyle;
    for (const key of keys) {
      style[key] = computed.getPropertyValue(key);
    }
    return style;
  }, STYLE_KEYS);
}
