import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./screens",
  timeout: 60_000,
  use: {
    baseURL: "http://127.0.0.1:8111",
    viewport: { width: 1440, height: 900 },
  },
  outputDir: "./test-results",
});
