import { describe, test, expect, beforeEach, vi } from "vitest";
import * as db from "../../src/api/getDataFns.js";

vi.mock("../../src/api/getDataFns.js", () => ({
    getAchievements: vi.fn(),
    getUserAchievements: vi.fn(),
    getPersonalBest: vi.fn(),
    getUser: vi.fn()
}));

beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
      document.body.innerHTML = `
        <div class="page">
            <div class="container section">
                <div class="page-header">
                    <button class="btn--secondary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
                            stroke-linejoin="round" class="lucide lucide-arrow-left">
                            <path d="m12 19-7-7 7-7"></path>
                            <path d="M19 12H5"></path>
                        </svg>
                    </button>
                    <h1 class="page-title">Dina prestationer</h1>
                </div>
                <div class="streak-banner">
                    <div class="icon-circle">
                        <svg class="icon green" width="32" height="32">
                            <use href="img/icons/achievements.svg#streak-fire"></use>
                        </svg>
                    </div>
                    <div>
                        <span class="streak-banner__label">Hittills har du gjort</span>
                        <h2 class="streak-banner__value"></h2>
                        <p class="streak-banner__sub"><p>
                    </div>
                </div>
                <section class="section-container">
                    <h2 class="card-title">
                        <svg class="icon green" width="18" height="18">
                            <use href="img/icons/achievements.svg#award-icon"></use>
                        </svg>
                        Upplåsta utmärkelser
                    </h2>
                    <div id="unlocked" class="achievement-grid"></div>
                </section>
                <section class="section-container">
                    <h2 class="card-title">
                        <svg class="icon" width="18" height="18">
                            <use href="img/icons/achievements.svg#locked-icon"></use>
                        </svg>
                        Nästa mål
                    </h2>
                    <div id="locked" class="achievement-grid">
                    </div>
                </section>
                <p class="section-label">Varje litet steg räknas ❤️</p>
            </div>
            <div id="achievement-modal" class="modal">
                <div class="modal-content">
                    <div id="modal-icon-container"></div>
                    <h2 id="modal-title"></h2>
                    <p id="modal-description"></p>
                    <p id="modal-date"></p>
                    <div id="modal-progress-details"></div>
                </div>
            </div>
        </div>
        `
});

describe('initAchievements integration', () => {
    test('hämtar data från databasen, bearbetar den och renderar', async () => {
        const { initAchievements } = await import('../../src/js/achievements.js');
        const mockAchievements = [{ id: 1, name: 'Springa', exercise_id: 10, bronze: 10, silver: 20, gold: 30}];
        const mockStats = [{ exercise_id: 10, total_reps: 25}];
        const mockClaimed = [{ achievements: { id: 1 }, achieved_date: '2000-01-01' }];
        
        db.getUser.mockResolvedValue({ id: 'user-1', name: 'Test' });
        db.getAchievements.mockResolvedValue(mockAchievements);
        db.getPersonalBest.mockResolvedValue(mockStats);
        db.getUserAchievements.mockResolvedValue(mockClaimed);

        await initAchievements('user-1');

        const card = document.querySelector('.achievement-card');
        const svg = card.querySelector('svg');
        expect(svg.classList.contains('silver')).toBe(true);

        const progressText = card.querySelector('.next-goal').textContent;
        expect(progressText).toContain('25 / 30');

        const useTag = card.querySelector('use');
        expect(useTag.getAttribute('href')).toContain('#award-icon');

        const unlockedContainer = document.getElementById('unlocked');
        expect(unlockedContainer.innerHTML).toContain('Springa');
    });

    test('sortering och filtrering till rätt containrar', async () => {
        const { initAchievements } = await import('../../src/js/achievements.js');
        db.getPersonalBest.mockResolvedValue([{ exercise_id: 1, total_reps: 50 }]);
        db.getAchievements.mockResolvedValue([
            { id: 1, name: 'Guld-övning', exercise_id: 1, bronze: 10, silver: 20, gold: 30},
            { id: 2, name: 'Låst-övning', exercise_id: 2, bronze: 100, silver: 200, gold: 300}
        ]);
        db.getUser.mockResolvedValue({ id: 'user-1', name: 'Test' });
        db.getUserAchievements.mockResolvedValue([]);

        await initAchievements('user-1');

        const unlockedContainer = document.getElementById('unlocked');
        const lockedContainer = document.getElementById('locked');

        expect(unlockedContainer.children).toHaveLength(1);
        expect(lockedContainer.children).toHaveLength(1);

        expect(unlockedContainer.innerHTML).toContain('Guld-övning');
        expect(lockedContainer.innerHTML).toContain('Låst-övning');
    });
});