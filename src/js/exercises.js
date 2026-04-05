import { getExercises } from '../api/getDataFns.js';

const BODYPART_GROUPS = {
    överkropp: ['Överkropp-framsida', 'Överkropp-baksida'],
    nederkropp: ['Ben-fram', 'Ben-bak'],
    helkropp: ['Helkropp'],
};

const exerciseBelongsToGroup = (exercise, group) => {
    if (!exercise.bodyparts) return false;
    const raw = Array.isArray(exercise.bodyparts) ? exercise.bodyparts : [exercise.bodyparts];
    const bodyparts = raw.map((bp) => bp.bodypart);
    return BODYPART_GROUPS[group].some((part) => bodyparts.includes(part));
};

const getEquipmentText = (exercise) => {
    const raw = exercise.exercise_equipment;
    if (!raw) return 'Ingen utrustning krävs';
    const equipment = (Array.isArray(raw) ? raw : [raw]).map((e) => e.equipment?.name).filter(Boolean);
    if (equipment.length === 0) return 'Ingen utrustning krävs';
    return equipment.join(', ');
};

const createDetailsElement = (exercise) => {
    const details = document.createElement('div');
    details.classList.add('exercise-card__details');
    details.innerHTML = `
        ${exercise.how_to ? `<p class="exercise-how-to">${exercise.how_to}</p>` : ''}
        <p class="exercise-equipment-label">Utrustning: <span>${getEquipmentText(exercise)}</span></p>
    `;
    return details;
};

const createExerciseCard = (exercise) => {
    const card = document.createElement('div');
    card.classList.add('exercise-card', 'card');

    card.innerHTML = `
        <div class="exercise-card__top">
            <div class="exercise-card__body">
                <h3 class="card-title">${exercise.name}</h3>
                <p class="card-description">${exercise.description}</p>
            </div>
            <button class="how-to-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
                    stroke-linejoin="round">
                    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                </svg>
                Visa hur
            </button>
        </div>
    `;

    card.querySelector('.how-to-btn').addEventListener('click', () => {
        const existing = card.querySelector('.exercise-card__details');
        if (existing) {
            existing.remove();
        } else {
            card.appendChild(createDetailsElement(exercise));
        }
    });

    return card;
};

const renderExercises = (exercises, group) => {
    const container = document.getElementById('exercise_cards');
    container.innerHTML = '';

    const filtered = exercises.filter((ex) => exerciseBelongsToGroup(ex, group));

    if (filtered.length === 0) {
        container.innerHTML = '<p class="text-muted">Inga övningar hittades.</p>';
        return;
    }

    filtered.forEach((exercise) => {
        container.appendChild(createExerciseCard(exercise));
    });
};

const initTabs = (exercises) => {
    const tabs = document.querySelectorAll('.btn_switch .tab');
    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            tabs.forEach((t) => t.classList.remove('tab--active'));
            tab.classList.add('tab--active');
            renderExercises(exercises, tab.dataset.group);
        });
    });
};

const init = async () => {
    const exercises = await getExercises();
    const activeTab = document.querySelector('.btn_switch .tab--active');
    renderExercises(exercises, activeTab.dataset.group);
    initTabs(exercises);
};

document.addEventListener('DOMContentLoaded', init);