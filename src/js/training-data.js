import { getExercises, getReps, getUser } from "../api/getDataFns.js";
import { getRandomExercises, numberOfExercises, filterExerciseList } from "./training-modular.js";

storeExerciseSettings(5, 5, false, true, false);

// let totalNumberOfExercises = 0;
export let exerciseSettings = JSON.parse(localStorage.getItem("exerciseSettings")) || [];

function storeExerciseSettings(user, time, children, equipment, gym) {
    let exerciseSettings = {
        user: user,
        time: time,
        gym: gym,
        equipment: equipment,
        children: children
    };
    localStorage.setItem("exerciseSettings", JSON.stringify(exerciseSettings));
}

/* Fetch the exercises and create the cards on page load */

export async function getData() {
    let totalNumberOfExercises = numberOfExercises(exerciseSettings.time);
    let userData = await getUser(exerciseSettings.user);
    let exerciseList = Array.from(await getExercises());
    let filteredList = filterExerciseList(exerciseList, exerciseSettings.children, exerciseSettings.equipment, exerciseSettings.gym);
    let selectedExercises = JSON.parse(sessionStorage.getItem("exercisesList")) || [];;
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
    console.log(savedsettings);
    return savedsettings;
}

