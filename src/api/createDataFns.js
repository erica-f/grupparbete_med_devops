import { supabase } from "./supabaseClient.js";

const createDataToSupabase = async ({ tableName, dataObject }) => {
  console.log("create data in table:", tableName, ", with data:", dataObject);
  try {
    const { data, error } = await supabase
      .from(tableName)
      .insert(dataObject)
      .select();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return error;
  }
};

// create data to persons
export const createUser = async (newUser) => {
  const newPerson = { lvl: 1, streak: 0, name: newUser, last_week_update: "" };
  await createDataToSupabase({ tableName: "persons", dataObject: newPerson });
};

// create data to person_best
export const createPersonalBest = async (userId, exerciseId, repNo) => {
  const newPersonalBest = {
    exercise_id: exerciseId,
    person_id: userId,
    rep_no: repNo,
    total_reps: repNo,
  };
  await createDataToSupabase({
    tableName: "person_best",
    dataObject: newPersonalBest,
  });
};

// create personal achievement
export const createPersonAchievement = async (userId, achievementId, achievementLevel) => {
  const today = new Date().toISOString().split("T")[0];

  const newAchievement = {
    achievement_id: achievementId,
    person_id: userId,
    achieved_date: today,
    level: achievementLevel
  };
  await createDataToSupabase({
    tableName: "person_achievements",
    dataObject: newAchievement,
  });
};
