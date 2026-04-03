import { supabase } from "./supabaseClient.js";

const getDataFromSupabase = async ({
  tableName,
  filter,
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
    if (notStatement) {
      query = query.not(notStatement.col, "is", notStatement.value);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }
    console.log("returned data", data);
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
    selectParams: `id, name, description, with_kids, at_gym,  exercise_equipment(equipment(name, description)), bodyparts(bodypart)`,
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
    selectParams: ` persons(name), achievements(name, description, requirement_type, exercise_id,bronze, silver, gold)`,
  });
};

// get data from person_best
export const getPersonalBest = async (userId) => {
  return await getDataFromSupabase({
    tableName: "person_best",
    filter: { col: "person_id", value: userId },
    selectParams: `persons(name), exercises(name), rep_no, achieved_at`,
  });
};
