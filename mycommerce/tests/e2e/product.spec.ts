import { test, expect } from "@playwright/test";

test("non-existent slug shows 404 UI in dev", async ({ page }) => {
  await page.goto("http://localhost:3000/product/not-a-real-slug");
  await expect(page.getByTestId("not-found-title")).toBeVisible();
});