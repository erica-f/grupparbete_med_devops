import { test, expect } from "@playwright/test";
import { deleteUser } from "../../src/api/deleteDataFns";

// prompt: create e2e tests for homepage.js, exclude unit and integration tests
test.describe("homepage e2e", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders homepage and shows choose user flow", async ({ page }) => {
    await expect(page).toHaveURL("/");
    await expect(page.locator("text=Vem ska träna?")).toBeVisible();
  });

  test("creates new user and redirects to training preferences", async ({
    page,
  }) => {
    await page.fill('input[placeholder="Skriv ditt namn..."]', "E2E User");
    await page.click('button:has-text("Skapa ny profil")');
    //getting sent to new menu for training preferences
    await page.click('label[for="t10"]');
    await page.click('label[for="home"]');
    await page.click('label[for="with-equipment"]');
    await expect(page.locator("#trainingBtn")).toBeDisabled();

    await page.click('label[for="kids-yes"]');
    await expect(page.locator("#trainingBtn")).toBeEnabled();

    await page.locator("#trainingBtn").click();
    await expect(page).toHaveURL(/training/);
    const storage = await page.evaluate(() => ({ ...localStorage }));
    const user = JSON.parse(storage.fitParents).user.id;
    await deleteUser(user);
  });
});
