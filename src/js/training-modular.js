export function getRandomExercises(filteredList, numberOfExercises) {
    let randomExercises = [];
    for (let i = 0; i < numberOfExercises; i++) {
        let randomIndex = Math.floor(Math.random() * filteredList.length);
        randomExercises.push(filteredList[randomIndex]);
        filteredList.splice(randomIndex, 1);
    }
    return randomExercises;
};
export function numberOfExercises(time) {
    return Math.floor(time / 2);
}
export function filterExerciseList(list, kids, equipment, gym) {
    let filteredList = [];

    list.filter(exercise => {
          //no kids, equipment, at gym
        if (kids == false && equipment == true && gym == true) {
            filteredList.push(exercise);
        }
        //Kids, no equipment, no gym
        if (kids == true && equipment == false && gym == false) {
            if (exercise.with_kids === kids && exercise.exercise_equipment.length == 0 && exercise.at_gym === gym) {
                filteredList.push(exercise);
            }
        }
        //kids, no equipment, at gym
        if (kids == true && equipment == false && gym == true) {
            if (exercise.with_kids === kids && exercise.exercise_equipment.length == 0) {
                filteredList.push(exercise);
            }
        }
        //kids, with equipment, no gym
        if (kids == true && equipment == true && gym == false) {
            if (exercise.with_kids === kids && exercise.at_gym === gym) {
                filteredList.push(exercise);
            }
        }
        //kids, equipment, gym 
         if (kids == true && equipment == true && gym == true) {
            if (exercise.with_kids === kids) {
                filteredList.push(exercise);
            }
        }
        //kids without equipment, at gym
        if (kids == true && equipment == false && gym == true) {
            if (exercise.with_kids === kids && exercise.exercise_equipment.length == 0) {
                filteredList.push(exercise);
            }
        }
        //No kids, no equipment, no gym
        if (kids == false && equipment == false && gym == false) {
            if (exercise.exercise_equipment.length == 0 && exercise.at_gym === gym) {
                filteredList.push(exercise);
            }
        }
        //no kids, no equipment, at gym
        if (kids == false && equipment == false && gym == true) {
            if (exercise.exercise_equipment.length == 0) {
                filteredList.push(exercise);
            }
        }
        //no kids, equipment, no gym
        if (kids == false && equipment == true && gym == false) {
            if (exercise.at_gym === gym) {
                filteredList.push(exercise);
            }
        }
    });
    return filteredList;
}

let completedExercisesList = [];
export function markExerciseCompleted(e) {
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
}

export function displayWorkoutComleted() {
    let congratulationsMessage = document.getElementById("workout-completed");
    congratulationsMessage.style.display = "flex";
}
export function checkCompletedExercises() {
    let completedExercises = JSON.parse(sessionStorage.getItem("completedExercises")) || [];
    for (let i = 0; i < completedExercises.length; i++) {
        document.getElementById("checkbox-" + completedExercises[i]).checked = true;
    }
}