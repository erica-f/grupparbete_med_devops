import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.goto("/exercises.html");
    await page.waitForSelector(".exercise-card");
});

test("switching tab renders exercises for that body part group", async ({ page }) => {
    await page.click('.tab[data-group="nederkropp"]');
    await expect(page.locator('.tab[data-group="nederkropp"]')).toHaveClass(/tab--active/);
    await expect(page.locator('.tab[data-group="överkropp"]')).not.toHaveClass(/tab--active/);
    await expect(page.locator(".exercise-card").first()).toBeVisible();
});

test("clicking 'Visa hur' toggles exercise details open and closed", async ({ page }) => {
    const firstCard = page.locator(".exercise-card").first();
    await firstCard.locator(".how-to-btn").click();
    await expect(firstCard.locator(".exercise-card__details")).toBeVisible();

    await firstCard.locator(".how-to-btn").click();
    await expect(firstCard.locator(".exercise-card__details")).not.toBeVisible();
});
