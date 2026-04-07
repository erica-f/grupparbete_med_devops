import { getUserAchievements, getAchievements, getPersonalBest } from "../api/getDataFns.js"

const iconMap = {
    "medalj": "award-icon",
    "hus": "house-icon",
    "hantel": "dumbbell-icon",
    "barn": "baby-icon",
    "måne": "moon-icon",
    "sol": "sun-icon",
    "blixt": "lightning-icon",
    "stjärna": "star-icon",
    "klocka": "clock-icon",
    "kalender": "calendar-icon",
    "arm": "bicep-icon",
    "vikt": "weight-icon"
};

const getIconId = (iconName) => iconMap[iconName] || "medalj-icon";

function getNextGoal(ach, status) {
    if (status === 'locked') return { label: 'Brons', value: ach.bronze };
    if (status === 'bronze') return { label: 'Silver', value: ach.silver};
    if (status === 'silver') return { label: 'Guld', value: ach.gold};
    return null;
};

function getStatus(achievement, userProgress) {
    if (userProgress >= achievement.gold) return 'gold';
    if (userProgress >= achievement.silver) return 'silver';
    if (userProgress >= achievement.bronze) return 'bronze'
    return 'locked'
};

const getUserStats = async (userId) => {
    const personalBest = await getPersonalBest(userId);

    const statsLookup = {};
    personalBest.forEach(pb => {
        statsLookup[pb.exercise_id] = pb.total_reps;
    });
    console.log("data", statsLookup)
    return statsLookup;
};

function prepareAchievements(allAchievements, userStats, userClaimed) {
    const locked = [];
    const unlocked = [];

    allAchievements.forEach(ach => {
        const progress = userStats[String(ach.exercise_id)] || 0;
        const claim = userClaimed.find(c => c.achievements && c.achievements.id === ach.id);
        const userClaimedDate = claim ? claim.achieved_date : null;
        console.log(`Achievement: ${ach.name}, Claim:`, !!claim, "Datum:", userClaimedDate);
        
        const enrichedAch = {
            ...ach,
            currentProgress: progress,
            status: getStatus(ach, progress),
            achieved_at: userClaimedDate
        };

        if (enrichedAch.status === 'locked') {
            locked.push(enrichedAch);
        } else {
            unlocked.push(enrichedAch)
        };
    });

    return { locked, unlocked };
};

function renderProgress(next, current) {
    if (!next) {
        return `<span class="completed">Maxad!</span>`;
    };

    const percentage = Math.min((current / next.value) * 100, 100);

    return `
        <div class="progress-info">
            <span class="next-goal">Mål ${next.label}: ${current} / ${next.value}</span>
            <div class="progress-bar-bg">
                <div class="progress-bar-fill" style="width: ${percentage}%"></div>
            </div>
        </div>
    `;
};

function renderAchievement(ach) {
    const iconId = getIconId(ach.icon);
    const next = getNextGoal(ach, ach.status);

    return `
        <div class="achievement-card ${ach.status === 'locked' ? 'achievement-card--locked' : ''}"
            data-achievement-id="${ach.id}">
            <div class="icon-circle">
                <svg class="icon ${ach.status}" width="24" height="24">
                    <use href="img/icons/achievements.svg#${iconId}"></use>
                </svg>
            </div>
            <p class="achievement-card__name">${ach.name}</p>
            ${renderProgress(next, ach.currentProgress)}
        </div>
    `;
};

function renderToContainer(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = data.map(ach => renderAchievement(ach)).join('');
};

function displayUnlocked(unlocked) {
    renderToContainer('unlocked', unlocked);
};

function displayLocked(locked) {
    renderToContainer('locked', locked);
};

export async function initAchievements(userId) {
    let totalAchievements = [];
    try {
        const [allAch, stats, claimed] = await Promise.all([
            getAchievements(),
            getUserStats(userId),
            getUserAchievements(userId)
        ]);

        const result = prepareAchievements(allAch, stats, claimed);
        totalAchievements = [...result.locked, ...result.unlocked]

        displayUnlocked(result.unlocked);
        displayLocked(result.locked);
    } catch (error) {
        console.error("Kunde inte ladda achievements:", error);
    };
};

initAchievements(3);