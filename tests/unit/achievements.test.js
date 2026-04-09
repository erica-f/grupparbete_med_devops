import { describe, test, expect } from "vitest";
import { getIconId, getNextGoal, getStatus } from "../../src/js/achievements"

describe("Achievement helpers", () => {

    describe('getIconId()', () => {
        test('ska returnera rätt id för rätt ikon', () => {
            const iconName = 'hus';
            const house = getIconId(iconName);

            expect(house).toBe('house-icon'); 
        });

        test('ska returnera fallback för saknad ikon', () => {
            const iconName = 'bil';
            const defaultIcon = getIconId(iconName);

            expect(defaultIcon).toBe('award-icon');
        });
    });

    describe('getNextGoal()', () => {
        test('ska returnera silver om status är bronze', () => {
            const ach = {id: 1, name: 'test', bronze: 1, silver: 5, gold: 10, status: 'bronze'};
            const next = getNextGoal(ach, ach.status);

            expect(next).toEqual({label: 'Silver', value: 5});
        });
    });

    describe('getStatus()', () => {
        test('poäng som inte når brons', () => {
            const ach = {id: 1, name: 'test', bronze: 2, silver: 5, gold: 10};
            const progress = 1;
            const status = getStatus(ach, progress);

            expect(status).toBe('locked');
        });

        test('poäng som når exakt silver', () => {
            const ach = {id: 1, name: 'test', bronze: 2, silver: 5, gold: 10};
            const progress = 5;
            const status = getStatus(ach, progress);

            expect(status).toBe('silver');
        });

        test('poäng som går över guld', () => {
            const ach = {id: 1, name: 'test', bronze: 2, silver: 5, gold: 10};
            const progress = 11;
            const status = getStatus(ach, progress);

            expect(status).toBe('gold');
        });
    });
});