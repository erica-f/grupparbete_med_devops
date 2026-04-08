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