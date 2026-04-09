import { getUserAchievements, getAchievements, getPersonalBest, getUser } from "../api/getDataFns.js"
import { updUserStreak, updPersonAchievement } from "../api/updDataFns.js";
import { createPersonAchievement } from "../api/createDataFns.js";

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
}

function getSvgPath() {
    const existingIcon = document.querySelector('use[href*="achievements.svg"]');
    let path = "";

    if (existingIcon) {
        path = existingIcon.getAttribute('href').split('#')[0];
    }
    return path || 'img/icons/achievements.svg';
}

export const getIconId = (iconName) => iconMap[iconName] || "award-icon";

export function getNextGoal(ach, status) {
    if (status === 'locked') return { label: 'Brons', value: ach.bronze }
    if (status === 'bronze') return { label: 'Silver', value: ach.silver}
    if (status === 'silver') return { label: 'Guld', value: ach.gold}
    return null;
}

export function getStatus(achievement, userProgress) {
    if (userProgress >= achievement.gold) return 'gold';
    if (userProgress >= achievement.silver) return 'silver';
    if (userProgress >= achievement.bronze) return 'bronze'
    return 'locked'
}

export const getUserStats = async (userId) => {
    const personalBest = (await getPersonalBest(userId)) || [];
    const statsLookup = {};
    personalBest.forEach(pb => {
        statsLookup[pb.exercise_id] = pb.total_reps;
    });
    return statsLookup;
}

export function prepareAchievements(allAchievements, userStats, userClaimed) {
    const locked = [];
    const unlocked = [];

    allAchievements.forEach(ach => {
        const progress = userStats[String(ach.exercise_id)] || 0;
        const claim = userClaimed.find(c => c.achievements && c.achievements.id === ach.id);
        const userClaimedDate = claim ? claim.achieved_date : null;
        
        const enrichedAch = {
            ...ach,
            currentProgress: progress,
            status: getStatus(ach, progress),
            achieved_at: userClaimedDate
        };

        if (enrichedAch.status === 'locked') {
            locked.push(enrichedAch);
        } else {
            unlocked.push(enrichedAch);
        }
    })

    return { locked, unlocked };
}

function renderProgress(next, current) {
    if (!next) {
        return `<span class="completed">Maxad!</span>`;
    }

    const percentage = Math.min((current / next.value) * 100, 100);

    return `
        <div class="progress-info">
            <span class="next-goal">Mål ${next.label}: ${current} / ${next.value}</span>
            <div class="progress-bar-bg">
                <div class="progress-bar-fill" style="width: ${percentage}%"></div>
            </div>
        </div>
    `;
}

function renderAchievement(ach) {
    const iconId = getIconId(ach.icon);
    const next = getNextGoal(ach, ach.status);
    const svgPath = getSvgPath();

    return `
        <div class="achievement-card ${ach.status === 'locked' ? 'achievement-card--locked' : ''}"
            data-achievement-id="${ach.id}">
            <div class="icon-circle">
                <svg class="icon ${ach.status}" width="24" height="24">
                    <use href="${svgPath}#${iconId}"></use>
                </svg>
            </div>
            <p class="achievement-card__name">${ach.name}</p>
            ${renderProgress(next, ach.currentProgress)}
        </div>
    `;
}

function renderToContainer(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = data.map(ach => renderAchievement(ach)).join('');
}

function displayUnlocked(unlocked) {
    renderToContainer('unlocked', unlocked);
}

function displayLocked(locked) {
    renderToContainer('locked', locked);
}

async function saveAchievementProgress(userId, achievement, achievementStatus, claimedAchievements) {
    const existingClaim = claimedAchievements.find(c => {
        const idInDb = c.achievement_id || c.achievement?.id;
        return String(idInDb) === String(achievement.id);
    });

    try {
        if (!existingClaim) {
            await createPersonAchievement(userId, achievement.id, achievementStatus);
        } else if (existingClaim.level !== achievementStatus) {
            await updPersonAchievement(userId, achievement.id, achievementStatus);
        }
    } catch (error) {
        console.error("Kunde inte spara framsteg:", error)
    }
}

function getStoredExercises() {
    return JSON.parse(localStorage.getItem("completedExercises")) || [];
}

function getWeekIdFromDate(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const year = d.getFullYear();
    const week = Math.ceil((((d - new Date(year, 0, 1)) / 8.64e7) + 1) / 7);
    return `${year}-W${week}`;
}

function getWeekDiff(currentWeekId, lastWeekId) {
    if (!lastWeekId) return 0;
    const parseId = (id) => {
        const [y, w] = id.split("-W").map(Number);
        return { y, w };
    };

    const current = parseId(currentWeekId);
    const last = parseId(lastWeekId);
    return (current.y * 52 + current.w) - (last.y * 52 + last.w);
}

export async function updateStreak(userId, user) {
    const completedExercises = getStoredExercises();
    const currentWeekId = getWeekIdFromDate(new Date());

    const weeksSinceLastUpdate = getWeekDiff(currentWeekId, user.last_week_update);
    let currentStreak = user.streak || 0;

    if (weeksSinceLastUpdate >= 2 && currentStreak > 0) {
        currentStreak = 0;
        await updUserStreak(userId, 0, user.last_week_update);
    }

    const workoutsThisWeek = completedExercises.filter(ex => {
        if (!ex.date) return false;
        return getWeekIdFromDate(new Date(ex.date)) === currentWeekId;
    }).length;

    if (workoutsThisWeek >= 3 && user.last_week_update !== currentWeekId) {
        await updUserStreak(userId, currentStreak + 1, currentWeekId);
        return currentStreak + 1;
    }

    return currentStreak;
}

function displayStreak(streakValue) {
    let displayStreak = document.getElementById('user-streak');
    let streakSub = document.getElementById('streak-sub');
    if (streakSub) {
        streakSub.textContent = streakValue > 0
            ? "Fantastiskt jobbat - du håller igång!"
            : "";
    }

    if (displayStreak) {
        const unit = streakValue === 1 ? 'vecka' : 'veckor';
        displayStreak.textContent = `${streakValue || 0} ${unit} i rad 🔥`
    }
}

let totalAchievements = [];

const modal = document.getElementById('achievement-modal');

function renderModalProgress(ach, next) {
    if (!next) {
        return `Maxad! Du har uppnått Guld (${ach.currentProgress} reps)`;
    }

    return `${ach.currentProgress} av ${next.value} för ${next.label}`;
}

function renderStatusLabel(status) {
    return status === 'locked' ? 'Inte uppnådd ännu' : status.toUpperCase();
    
}

function formateDate(isoString) {
    return new Date(isoString).toLocaleDateString('sv-SE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
    });
}

function openAchievementModal(id) {
    const svgPath = getSvgPath();
    const ach = totalAchievements.find(a => a.id === id);
    if (!ach) return;

    const iconId = getIconId(ach.icon);
    const next = getNextGoal(ach, ach.status);

    document.getElementById('modal-icon-container').innerHTML = `
        <svg class="icon ${ach.status}" width="80" height="80">
            <use href="${svgPath}#${iconId}"></use>
        </svg>
    `;

    document.getElementById('modal-progress-details').innerHTML = `
        <p class="modal-status-text">Status: <strong>${renderStatusLabel(ach.status)}</strong></p>
        <p class="modal-progress-count">${renderModalProgress(ach, next)}</p>
    `;

    const dateElement = document.getElementById('modal-date');

    if (ach.status !== 'locked' && ach.achieved_at) {
        dateElement.textContent = `Uppnådde ${ach.status} den ${formateDate(ach.achieved_at)}`;
        dateElement.style.display = 'block';
    } else {
        dateElement.style.display = 'none';
    }

    document.getElementById('modal-title').textContent = `${ach.name}`
    document.getElementById('modal-description').textContent = `${ach.description}`

    modal.classList.add('modal--open');
}

const modalContent = document.querySelector('.modal-content')

function closeModal() {
    modal.classList.remove('modal--open');
}

if (modal) {
    modal.addEventListener('click', (event) => {
        if (!modalContent.contains(event.target)) {
            closeModal();
        } 
    });
}

const lockedEl = document.getElementById('locked');
if (lockedEl) lockedEl.addEventListener('click', handleCardClick);

const unLockedEl = document.getElementById('unlocked');
if (unLockedEl) unLockedEl.addEventListener('click', handleCardClick);

function handleCardClick(event) {
    const card = event.target.closest('.achievement-card');

    if (card) {
        const id = Number(card.dataset.achievementId);
        openAchievementModal(id);
    }
}

export async function initAchievements(userId) {
    try {
        const [allAch, stats, claimed, user] = await Promise.all([
            getAchievements(),
            getUserStats(userId),
            getUserAchievements(userId),
            getUser(userId)
        ]);

        const currentStreak = await updateStreak(userId, user);
        const result = prepareAchievements(allAch, stats, claimed);

        await Promise.all(result.unlocked.map(ach => 
            saveAchievementProgress(userId, ach, ach.status, claimed)
        ));

        totalAchievements = [...result.locked, ...result.unlocked];
        displayStreak(currentStreak);
        displayUnlocked(result.unlocked);
        displayLocked(result.locked);
    } catch (error) {
        console.error("Kunde inte ladda achievements:", error);
    }
}

async function startApp() {
    try {
        const data = JSON.parse(localStorage.getItem("fitParents"));
        
        if (data && data.user && data.user.id) {
            const userId = data.user.id;
            console.log('Startar med userId:', userId)
            await initAchievements(userId);
        } else {
            console.warn("Inget användar-ID hittat i exerciseSettings.");
        }
    } catch (err) {
        console.error("Kunde inte läsa från localStorage:", err);
    }
}

startApp();