import { supabase } from "./supabaseClient.js";

const getDataFromSupabase = async ({ tableName, filter }) => {
  const useFilter = filter ? filter : "";
  console.log("get data in table:", tableName, ", using:", filter);
  try {
    let query = supabase.from(tableName).select();

    if (filter) {
      query = query.eq(useFilter.col, useFilter.value);
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
  return await getDataFromSupabase({ tableName: "exercises" });
};

// get data from achievements
export const getAchievements = async () => {
  return await getDataFromSupabase({ tableName: "achievements" });
};

// get data from person_achievements
export const getUserAchievements = async (userId) => {
  const userArray = await getDataFromSupabase({
    tableName: "person_achievements",
    filter: { col: "person_id", value: userId },
  });
  return userArray[0];
};

// get data from person_best
export const getPersonalBest = async (userId) => {
  const userArray = await getDataFromSupabase({
    tableName: "person_best",
    filter: { col: "person_id", value: userId },
  });
  return userArray;
};
