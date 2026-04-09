import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
        const mockSettings = {
            is_active: true,
            user: {
                id: 'user-1',
            name: 'Test', 
            streak: 5, 
            last_week_update: '2026-W15'
            }
        };
        window.localStorage.setItem("fitParents", JSON.stringify(mockSettings));
    });

    await page.route('**/rest/v1/achievements*', async route => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([
                { id: 1, name: 'Upplåst', exercise_id: 1, description: 'Upplåst achievement', bronze: 10, silver: 20, gold: 30, icon: 'medalj' },
                { id: 2, name: 'Låst', exercise_id: 2, description: 'Låst achievement', bronze: 10, silver: 20, gold: 30, icon: 'stjärna' }
            ])
        });
    });

    await page.route('**/rest/v1/person_best*', async route => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([{ exercise_id: 1, total_reps: 25 }, { exercise_id: 2, total_reps: 1 }])
        });
    });

    await page.route('**/rest/v1/person_achievements*', async route => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([{achievements: {id: 1}, achieved_date: '2000-01-01'}])
        });
    });

    await page.route('**/rest/v1/persons*', async route => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
             body: JSON.stringify([{ id: 'user-1', name: 'Test', streak: 5, last_week_update: '2026-W15' }])
        });
    });

    await page.goto("/achievements.html");
});

test('dom is visible on page load', async ({ page }) => {
    const streakBanner = page.locator('#streak-banner');
    const streakBannerValue = page.locator('#user-streak')
    const unlocked = page.locator('#unlocked');
    const locked = page.locator('#locked');
    const modal = page.locator('#achievement-modal');
    const firstCard = page.locator('.achievement-card').first();
    const secondCard = page.locator('.achievement-card').nth(1);

    await expect(streakBannerValue).toContainText('5 veckor i rad');
    await expect(streakBanner).toBeVisible();
    await expect(unlocked).toBeVisible();
    await expect(locked).toBeVisible();
    await expect(modal).toBeHidden();
    await expect(firstCard).toBeVisible();
    await expect(secondCard).toBeVisible();
    await expect(firstCard).toContainText('Upplåst');
    await expect(secondCard).toContainText('Låst');
});

test('modal is clickable and showable', async ({ page }) => {
    const firstCard = page.locator('.achievement-card').first();
    const cardName1 = await firstCard.locator('.achievement-card__name').textContent();

    await firstCard.click();

    const modal = page.locator('#achievement-modal');
    await expect(modal).toHaveClass(/modal--open/);
    await expect(modal).toBeVisible();
    await expect(page.locator('#modal-title')).toContainText(cardName1);

    const description = page.locator('#modal-description');
    await expect(description).not.toBeEmpty();
    
    const modalDate = page.locator('#modal-date');
    const modalProgress = page.locator('#modal-progress-details');
    await expect(modalDate).toContainText('1 januari 2000');
    await expect(modalProgress).toContainText('25 av 30 för Guld');

    await modal.click({ position: { x: 5, y: 5 }, force: true });
    await expect(modal).toBeHidden();
});