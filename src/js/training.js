import { getExercises, getReps, getUser } from "../api/getDataFns.js";
import { updTotalReps, updUserLvl } from "../api/updDataFns.js";
import { updateStreak } from "./achievements.js";

let totalNumberOfExercises = 0;
let exerciseSettings = JSON.parse(localStorage.getItem("exerciseSettings")) || [];

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
storeExerciseSettings(5, 5, false, true, false);

/* Fetch the exercises and create the cards on page load */

async function getExerciseData() {
    return await getExercises();
}
async function getRepetitions(lvl) {
    return await getReps(lvl);
}
async function getUserData(userId) {
    return await getUser(userId);
}

function getRandomExercises(filteredList, numberOfExercises) {
    let randomExercises = [];
    for (let i = 0; i < numberOfExercises; i++) {
        let randomIndex = Math.floor(Math.random() * filteredList.length);
        randomExercises.push(filteredList[randomIndex]);
        filteredList.splice(randomIndex, 1);
    }
    return randomExercises;
};

function filterExerciseList(list, kids, equipment, gym) {
    let filteredList = [];
    let needEquipment = false;

    list.filter(exercise => {
        if (exercise.exercise_equipment.length > 0) {
            needEquipment = true;
        }
        if (kids == true) {
            if (equipment == false) {
                if (gym == false) {
                    //filter for kids, equipment and gym
                    if (exercise.with_kids === kids && needEquipment === equipment && exercise.at_gym === gym) {
                        filteredList.push(exercise);
                    }
                } else {
                    //filter for kids and equipment
                    if (exercise.with_kids === kids && needEquipment === equipment) {
                        filteredList.push(exercise);
                    }
                }
            } else {
                if (gym == false) {
                    //filter for kids and gym
                    if (exercise.with_kids === kids && exercise.at_gym === gym) {
                        filteredList.push(exercise);
                    }
                } else {
                    //filter for kids
                    if (exercise.with_kids === kids) {
                        filteredList.push(exercise);
                    }
                }
            }
        } else {
            if (equipment == false) {
                if (gym == false) {
                    //filter equipment and gym
                    if (needEquipment === equipment && exercise.at_gym === gym) {
                        filteredList.push(exercise);
                    }
                } else {
                    //filter for equipment
                    if (needEquipment === equipment) {
                        filteredList.push(exercise);
                    }
                }
            } else {
                if (gym == false) {
                    //filter for gym
                    if (exercise.at_gym === gym) {
                        filteredList.push(exercise);
                    }
                } else {
                    //no filters applies for this combo
                    filteredList.push(exercise);
                }
            }
        }
    });
    return filteredList;
}
async function getData() {
    let sessionExercises = JSON.parse(sessionStorage.getItem("exercisesList")) || [];
    totalNumberOfExercises = Math.floor(exerciseSettings.time / 2);
    let userData = await getUserData(exerciseSettings.user);
    let exerciseList = Array.from(await getExerciseData());
    let filteredList = filterExerciseList(exerciseList, exerciseSettings.children, exerciseSettings.equipment, exerciseSettings.gym);
    let selectedExercises = sessionExercises;
    //Saving exercises for the same session
    if (sessionExercises.length < 1) {
        selectedExercises = getRandomExercises(filteredList, totalNumberOfExercises);
    } 
    let getRepAmount = await getRepetitions(userData.lvl);
    let numberOfSets = 2;
    if (await userData.lvl > 3) {
        numberOfSets = 3;
    }
    const savedsettings = {
        totalNumberOfExercises: totalNumberOfExercises,
        userData: userData,
        filteredList: filteredList,
        selectedExercises: selectedExercises,
        getRepAmount: getRepAmount,
        numberOfSets: numberOfSets
    }
    return savedsettings;
}

let settings = await getData();

populateWorkout();
function populateWorkout(exerciseId, selectedExercise) {
    let card = "";
    let noOfCards = settings.totalNumberOfExercises;
    let selectedExercises = settings.selectedExercises;
    let reps = settings.getRepAmount;
    if (exerciseId != null) {
        let newExercise = settings.filteredList.filter(l => l.id == exerciseId);
        noOfCards = 1;
        selectedExercises = newExercise;
        let indexOfOld = selectedExercise - 1;
        settings.selectedExercises.splice(indexOfOld, 1, newExercise[0]);
    }
    sessionStorage.setItem("exercisesList", JSON.stringify(settings.selectedExercises));

    for (let i = 0; i < noOfCards; i++) {
        let repAmount = reps.find((amount) => amount.exercise_id === selectedExercises[i].id);
        let timeOrRep = "reps";
        if (selectedExercises[i].name.toLowerCase().includes("plank")) {
            timeOrRep = "sek"
        }

        card += `<div class="exercise exercise-card" id="exercise-card-${i + 1}">
                    <div>
                        <div class="exercise-header">
                            <h4 >${selectedExercises[i].name}</h4>
                            <p class="text-muted">${selectedExercises[i].description}</p>
                            <p class="text-brand">${settings.numberOfSets} set x ${repAmount.amount} ${timeOrRep}</p>
                        </div>
                        <p class="text-muted">Avklarade ${timeOrRep} per set</p>
                        <div class="rep-set" id="${selectedExercises[i].id}">
                            <input type="number" id="set-1-${i + 1}" min="0" class="rep-input" value="0">
                            <input type="number" id="set-2-${i + 1}" min="0" class="rep-input" value="0">
                            <input type="number" id="set-3-${i + 1}" min="0" class="rep-input input-3" value="0">
                        </div>
                    </div>
                    <div class="exercise-right">
                        <div class="checkbox-wrapper">
                            <input type="checkbox" name="completed" class="completed" id="checkbox-${i + 1}">
                            <label for="completed">Klar</label>
                        </div>
                        <div class="exchange-exercise">
                            <button id="exercise-${i + 1}" class="exchange-btn">Byt ut övning</button>
                            
                        </div>
                        <div id="exchange-options-${i + 1}" class="exercise-card exchange">
      
                        </div>
                    </div>
                </div>`
    }
    document.getElementById("total-exercises").textContent = settings.totalNumberOfExercises;
    if (exerciseId != null) {
        let update = document.getElementById("exercise-card-" + selectedExercise);
        update.outerHTML = card;
    } else {
        document.getElementById("exercises").innerHTML = card;
    }

    if (settings.userData.lvl > 4) {
        let thirdCounter = Array.from(document.querySelectorAll(".input-3"));
        thirdCounter.forEach(element => {
            element.style.display = "inline";
        });
    }
    postLoading();
    checkCompletedExercises();
}

function checkCompletedExercises() {
    let completedExercises = JSON.parse(sessionStorage.getItem("completedExercises")) || [];
    for (let i = 0; i < completedExercises.length; i++) {
        document.getElementById("checkbox-" + completedExercises[i]).checked = true;
    }
    updateProgress();
}
function postLoading() {
    let exchangeExcerciseBtns = document.querySelectorAll(".exchange-btn");
    let checkboxForExercises = document.querySelectorAll(".completed");

    /* find other exercises, offer them as a suggestion to the user and exchange the correct exercise */
    exchangeExcerciseBtns.forEach(item => {
        item.addEventListener("click", function (e) {
            exchangeExercise(e.currentTarget);
        });
    });
    /* Update the progress when an exercise is marked as complete / unchecked */
    checkboxForExercises.forEach(item => {
        item.addEventListener("click", function (e) {
            markExerciseCompleted(e.currentTarget);
        });
    });
}
function exchangeExercise(e) {
    let selectedExercise = e.id.charAt(e.id.length - 1);
    createAltExercises(selectedExercise);
    createEventListeners(selectedExercise);
}
function createAltExercises(selectedExercise) {
    let exhangeOptions = document.getElementById("exchange-options-" + selectedExercise);
    let options = `<button class="close-popup">Stäng</button>`;

    settings.filteredList.forEach(exercise => {
        options += ` <div class="exchange-option">
                    <button class="exchange-to" id="${exercise.id}">
                    <h5>${exercise.name}</h5>
                    <p class="text-muted">${exercise.description}</p>
                    </button>
                     </div>`
    });
    exhangeOptions.style.display = "flex";
    exhangeOptions.innerHTML = options;
}

function createEventListeners(selectedExercise) {
    let selectExerciseBtn = document.querySelectorAll(".exchange-to");
    let closeBtn = document.querySelector(".close-popup");
    //Find the replacement exercise 
    selectExerciseBtn.forEach(item => {
        item.addEventListener("click", function (e) {
            exchange(e.currentTarget, selectedExercise);
        });
    });
    //Close exchange option
    closeBtn.addEventListener("click", function (e) {
        e.currentTarget.parentElement.style.display = "none";
    });
}
function exchange(e, selectedExercise) {
    let exerciseId = e.id;
    populateWorkout(exerciseId, selectedExercise);
}
let completedExercisesList = [];
function markExerciseCompleted(e) {
    let selectedExercise = e.id.charAt(e.id.length - 1);

    if (e.checked) {
        if (!completedExercisesList.includes(selectedExercise)) {
            completedExercisesList.push(selectedExercise);
        }
    } else {
        if (completedExercisesList.includes(selectedExercise)) {
            let currentIndex = completedExercisesList.indexOf(selectedExercise);
            completedExercisesList.splice(currentIndex, 1);
        }
    }
    sessionStorage.setItem("completedExercises", JSON.stringify(completedExercisesList));
    updateProgress();
}
function updateProgress() {
    let completedExercises = document.querySelectorAll(".completed:checked");
    let progressBar = document.getElementById("progress-done");
    let progressText = document.getElementById("progress-percent");
    let exercisesCompletedText = document.getElementById("exercises-completed");
    let percentDone = Math.round((completedExercises.length / totalNumberOfExercises) * 100);
    progressBar.style.width = percentDone + "%";
    progressText.textContent = percentDone + "%";
    exercisesCompletedText.textContent = completedExercises.length;
}
/* On completing workout, save to localStorage and show "congratulations" message */
let completeWorkoutBtn = document.getElementById("complete-workout-btn");
completeWorkoutBtn.addEventListener("click", completeWorkout);

function completeWorkout() {
    saveCompletedExercise();
    displayWorkoutComleted();
    loopThroughReps(insertToPersonalBest);
    updateUserLevel();
}
function saveCompletedExercise() {
    let exerciseSettings = JSON.parse(localStorage.getItem("exerciseSettings")) || [];
    let completedExercises = JSON.parse(localStorage.getItem("completedExercises")) || [];
    const now = new Date();
    const streakData = {
        user: exerciseSettings.user,
        date: now
    }
    completedExercises.push(streakData);
    localStorage.setItem("completedExercises", JSON.stringify(completedExercises));
}
function displayWorkoutComleted() {
    let congratulationsMessage = document.getElementById("workout-completed");
    congratulationsMessage.style.display = "flex";
}
function updateUserLevel() {
    if (settings.userData.lvl < 9) {
        updUserLvl(exerciseSettings.user);
    }
}
function loopThroughReps(updatePersonalBest) {
    let repInputs = document.querySelectorAll(".rep-input");
    let exerciseIds = [];
    let repArray = [];
    repInputs.forEach(rep => {
        let value = parseInt(rep.value);
        let exerciseId = rep.parentElement.id;
        let repValues = {
            value: value,
            exerciseId: exerciseId,
        }
        if (exerciseIds.find(x => x == exerciseId)) {
            let existingValue = repArray.findIndex(x => x.exerciseId == exerciseId);
            repArray[existingValue].value += value;
        } else {
            exerciseIds.push(exerciseId);
            repArray.push(repValues);
        }
    });
    updatePersonalBest(repArray);
}
function insertToPersonalBest(repArray) {
    for (let i = 0; i < repArray.length; i++) {
        updTotalReps(exerciseSettings.user, repArray[i].exerciseId, repArray[i].value);
    }
}