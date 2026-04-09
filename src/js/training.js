import { updTotalReps, updUserLvl } from "../api/updDataFns.js";
import { exerciseSettings, getData } from "./training-data.js";
import { markExerciseCompleted, displayWorkoutComleted, checkCompletedExercises } from "./training-modular.js";

let settings = await getData();

  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", populateWorkout);
  } else {
    populateWorkout();
  }

export function populateWorkout(exerciseId, selectedExercise) {
    let card = ``;
    let noOfCards = settings.totalNumberOfExercises;
    let selectedExercises = settings.selectedExercises;
    let reps = settings.getRepAmount;

    if (exerciseId != null) {
        let newExercise = settings.filteredList.filter(l => l.id == exerciseId);
        noOfCards = 1;
        selectedExercises = newExercise;
        settings.selectedExercises.splice(selectedExercise - 1, 1, newExercise[0]);
    }
    sessionStorage.setItem("exercisesList", JSON.stringify(settings.selectedExercises));

    for (let i = 0; i < noOfCards; i++) {
        let repAmount = reps.find((amount) => amount.exercise_id === selectedExercises[i].id);
        let timeOrRep = "reps";
        let currentIndex = i+1;
        if (selectedExercises[i].name.toLowerCase().includes("plank")) {
            timeOrRep = "sek"
        }
        if(exerciseId != null) {
            currentIndex = selectedExercise;
        }

        card += `<div class="exercise exercise-card" id="exercise-card-${currentIndex}">
                    <div>
                        <div class="exercise-header">
                            <h4 >${selectedExercises[i].name}</h4>
                            <p class="text-muted">${selectedExercises[i].description}</p>
                            <p class="text-brand">${settings.userData.lvl < 4 ? 2 : 3} set x ${repAmount.amount} ${timeOrRep}</p>
                        </div>
                        <p class="text-muted">Avklarade ${timeOrRep} per set</p>
                        <div class="rep-set" id="${selectedExercises[i].id}">
                            <input type="number" id="set-1-${currentIndex}" min="0" class="rep-input" value="0">
                            <input type="number" id="set-2-${currentIndex}" min="0" class="rep-input" value="0">
                            <input type="number" id="set-3-${currentIndex}" min="0" class="rep-input input-3" value="0">
                        </div>
                    </div>
                    <div class="exercise-right">
                        <div class="checkbox-wrapper">
                            <input type="checkbox" name="completed" class="completed" id="checkbox-${currentIndex}">
                            <label for="completed">Klar</label>
                        </div>
                        <div class="exchange-exercise">
                            <button id="exercise-${currentIndex}" class="exchange-btn">Byt ut övning</button>
                            
                        </div>
                        <div id="exchange-options-${currentIndex}" class="exercise-card exchange">
      
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
    updateProgress();
}

function postLoading() {
  let exchangeExcerciseBtns = document.querySelectorAll(".exchange-btn");
  let checkboxForExercises = document.querySelectorAll(".completed");

    /* find other exercises, offer them as a suggestion to the user and exchange the correct exercise */
    exchangeExcerciseBtns.forEach(item => {
        item.addEventListener("click", function (e) {
            let selectedExercise = e.currentTarget.id.charAt(e.currentTarget.id.length - 1);
            createAltExercises(selectedExercise);
            createEventListeners(selectedExercise);
        });
    });
    /* Update the progress when an exercise is marked as complete / unchecked */
    checkboxForExercises.forEach(item => {
        item.addEventListener("click", function (e) {
            markExerciseCompleted(e.currentTarget);
            updateProgress();
        });
    });
  });
}

function createAltExercises(selectedExercise) {
  let exhangeOptions = document.getElementById(
    "exchange-options-" + selectedExercise,
  );
  let options = `<button class="close-popup">Stäng</button>`;

  settings.filteredList.forEach((exercise) => {
    options += ` <div class="exchange-option">
                    <button class="exchange-to" id="${exercise.id}">
                    <h5>${exercise.name}</h5>
                    <p class="text-muted">${exercise.description}</p>
                    </button>
                     </div>`;
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
            populateWorkout(e.currentTarget.id, selectedExercise);
        });
    });
    //Close exchange option
    closeBtn.addEventListener("click", function (e) {
        e.currentTarget.parentElement.style.display = "none";
    });
  });
  //Close exchange option
  closeBtn.addEventListener("click", function (e) {
    e.currentTarget.parentElement.style.display = "none";
  });
}

function updateProgress() {
    let completedExercises = document.querySelectorAll(".completed:checked");
    let progressBar = document.getElementById("progress-done");
    let progressText = document.getElementById("progress-percent");
    let exercisesCompletedText = document.getElementById("exercises-completed");
    let percentDone = Math.round((completedExercises.length / settings.totalNumberOfExercises) * 100);
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
  let exerciseSettings =
    JSON.parse(localStorage.getItem("exerciseSettings")) || [];
  let completedExercises =
    JSON.parse(localStorage.getItem("completedExercises")) || [];
  const now = new Date();
  const streakData = {
    user: exerciseSettings.user,
    date: now,
  };
  completedExercises.push(streakData);
  localStorage.setItem(
    "completedExercises",
    JSON.stringify(completedExercises),
  );
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
  repInputs.forEach((rep) => {
    let value = parseInt(rep.value);
    let exerciseId = rep.parentElement.id;
    let repValues = {
      value: value,
      exerciseId: exerciseId,
    };
    if (exerciseIds.find((x) => x == exerciseId)) {
      let existingValue = repArray.findIndex((x) => x.exerciseId == exerciseId);
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
    updTotalReps(
      exerciseSettings.user,
      repArray[i].exerciseId,
      repArray[i].value,
    );
  }
}
