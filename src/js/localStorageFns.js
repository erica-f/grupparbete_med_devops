export function storeExerciseSettings(user, time, children, equipment, gym) {
  let exerciseSettings = {
    user: user,
    time: time,
    gym: gym,
    equipment: equipment,
    children: children,
  };
  localStorage.setItem("exerciseSettings", JSON.stringify(exerciseSettings));
}
