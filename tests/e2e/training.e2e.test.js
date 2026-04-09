import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto('/training');
  await page.evaluate(() => localStorage.setItem('storeExerciseSettings', '5, 5, false, true, false'));
});

test('Load sections and exercises on start', async ({ page }) => {
    const localStorageData = await page.evaluate(() => localStorage.getItem('storeExerciseSettings'));
    expect(localStorageData).toBe('5, 5, false, true, false');
    await expect(page).toHaveTitle('Dagens pass');
    await expect(page.locator('.page-title')).toBeVisible();
    await expect(page.locator('#exercises')).toBeVisible();
    let exercises = page.locator('.exercise');
    await expect(exercises).toHaveCount(2);
    await expect(exercises.nth(1)).toBeVisible();
    await expect(exercises.nth(1).locator('.exercise-header')).toBeVisible();
    await expect(page.locator('.rep-input')).toHaveCount(6);
    await expect(page.locator('.rep-input').nth(2)).not.toBeVisible();
    await expect(page.locator('#progress-percent')).toHaveText('0%');
    await expect(page.locator('#complete-workout-btn')).toBeVisible();
});

test('Marking a checkbox done updates the progress meter and saves a session storage', async ({ page }) => {
   let completed = page.locator('#checkbox-1');
   completed.click();
   await expect(completed).toBeChecked();
    await expect(page.locator('#progress-percent')).toHaveText('50%');
    await expect(page.locator('#exercises-completed')).toHaveText('1');
    let sessionStorageData = await page.evaluate(() => sessionStorage.getItem('completedExercises'));
    expect(sessionStorageData).toBe('["1"]');

    completed.click();
    await expect(completed).not.toBeChecked();
    await expect(page.locator('#progress-percent')).toHaveText('0%');
    await expect(page.locator('#exercises-completed')).toHaveText('0');
    let sessionStorageData2 = await page.evaluate(() => sessionStorage.getItem('completedExercises'));
    expect(sessionStorageData2).toBe('[]');
});

test('Clicking exchange exercise creates a list of exercises, and selecting one updates the correct exercise card', async ({ page }) => {
    let exchangeButton = page.locator('#exercise-1');
    exchangeButton.click();
    
    let exchangeOptionsContainer = page.locator('#exchange-options-1');

    let exchangeOption = exchangeOptionsContainer.locator('.exchange-option');
    let exchangeOptionText = await exchangeOption.first().getByRole('heading').textContent();
    await expect(exchangeOptionsContainer).toBeVisible();

    await expect(exchangeOption.first()).toBeVisible();
    await expect(exchangeOption.nth(3)).toBeVisible();

    exchangeOption.first().click();
  
    await expect(exchangeOptionsContainer).not.toBeVisible();
    await expect(page.locator('#exercise-card-1').getByRole('heading')).toHaveText(exchangeOptionText);
    await expect(exchangeOption.first()).not.toBeVisible();
});