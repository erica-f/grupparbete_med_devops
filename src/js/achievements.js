import { getAchievements } from "../api/getDataFns.js"

function consoleLogAchievements() {
    const achievements = getAchievements();
    console.log(achievements);
};

consoleLogAchievements();
