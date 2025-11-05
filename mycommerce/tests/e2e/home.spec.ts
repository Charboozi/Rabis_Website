import { test, expect } from "@playwright/test";

test("home lists products and shows prices", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await expect(page.locator("h1")).toHaveText(/Products|Produkter/i);
  // At least one product card exists
  await expect(page.locator("main li").first()).toBeVisible();
});

test("changing currency updates formatting", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await page.selectOption('select[name="currency"]', "USD");
  await page.selectOption('select[name="locale"]', "en");
  await page.click('button[type="submit"]');
  await page.waitForLoadState("networkidle");
  // Check for a currency symbol typical for USD (heuristic)
  const body = await page.textContent("body");
  expect(body?.match(/\$|USD/)).toBeTruthy();
});
