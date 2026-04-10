import { getExercises, getReps, getUser } from "../api/getDataFns.js";
import { getRandomExercises, numberOfExercises, filterExerciseList } from "./training-modular.js";

/* Fetch the exercises and create the cards on page load */

export async function getData(exerciseSettings) {
    let totalNumberOfExercises = numberOfExercises(exerciseSettings.time);
    let userData = await getUser(exerciseSettings.user);
    let exerciseList = Array.from(await getExercises());
    let filteredList = filterExerciseList(exerciseList, exerciseSettings.children, exerciseSettings.equipment, exerciseSettings.gym);
    let selectedExercises = JSON.parse(sessionStorage.getItem("exercisesList")) || [];
    //Saving exercises for the same session
    if (selectedExercises.length < 1) {
        selectedExercises = getRandomExercises(filteredList, totalNumberOfExercises);
    } 
    let getRepAmount = await getReps(userData.lvl);
    const savedsettings = {
        totalNumberOfExercises: totalNumberOfExercises,
        userData: userData,
        filteredList: filteredList,
        selectedExercises: selectedExercises,
        getRepAmount: getRepAmount,
    }
    return savedsettings;
}

