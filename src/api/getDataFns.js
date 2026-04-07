import { supabase } from "./supabaseClient.js";

const getDataFromSupabase = async ({
  tableName,
  filter,
  doubleFilter,
  notStatement,
  selectParams,
}) => {
  console.log(
    "get data in table:",
    tableName,
    ", using:",
    filter || selectParams,
    "to show:",
    selectParams,
  );
  try {
    let query = supabase.from(tableName);
    if (selectParams) {
      query = query.select(selectParams);
    } else {
      query = query.select();
    }

    if (filter) {
      query = query.eq(filter.col, filter.value);
    }
    if (doubleFilter) {
      query = query
        .eq(doubleFilter[0].col, doubleFilter[0].value)
        .eq(doubleFilter[1].col, doubleFilter[1].value);
    }

    if (notStatement) {
      query = query.not(notStatement.col, "is", notStatement.value);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return error;
  }
};

// get data from persons
export const getUsers = async () => {
  return await getDataFromSupabase({ tableName: "persons" });
};

export const getUser = async (userId) => {
  const userArray = await getDataFromSupabase({
    tableName: "persons",
    filter: { col: "id", value: userId },
  });
  return userArray[0];
};

// get data from exercises
export const getExercises = async () => {
  return await getDataFromSupabase({
    tableName: "exercises",
    selectParams: `id, name, description, with_kids, at_gym, exercise_equipment(equipment(name, description)), bodyparts(bodypart)`,

  });
};

export const getExampleExercises = async () => {
  return await getDataFromSupabase({
    tableName: "exercises",
    notStatement: { col: "img_src", value: null },
    selectParams: `id, name, description, with_kids, at_gym, exercise_equipment(equipment(name, description)), bodyparts(bodypart)`,
  });
};

// get data from achievements
export const getAchievements = async () => {
  return await getDataFromSupabase({ tableName: "achievements" });
};

// get data from person_achievements
export const getUserAchievements = async (userId) => {
  return await getDataFromSupabase({
    tableName: "person_achievements",
    filter: { col: "person_id", value: userId },
    selectParams: `achieved_date, 
                  persons(name), 
                  achievements(name, description, requirement_type,bronze, silver, gold, 
                    exercises(name,description,
                      person_best(total_reps)))`,
  });
};

// get data from person_best
export const getPersonalBest = async (userId) => {
  return await getDataFromSupabase({
    tableName: "person_best",
    filter: { col: "person_id", value: userId },
    selectParams: `person_id, exercise_id, persons(name), exercises(name), rep_no, achieved_at`,
  });
};

export const getPersonalBestFromSpecificExercise = async (
  userId,
  exerciseId,
) => {
  const dataArray = await getDataFromSupabase({
    tableName: "person_best",
    doubleFilter: [
      { col: "person_id", value: userId },
      { col: "exercise_id", value: exerciseId },
    ],
    selectParams: `persons(name), exercises(name), rep_no, total_reps, achieved_at`,
  });
  return dataArray[0];
};

// get data from reps
export const getReps = async (level) => {
  return await getDataFromSupabase({
    tableName: "reps",
    filter: { col: "lvl", value: level },
    selectParams: `id, exercise_id, amount, lvl`,
  });
};