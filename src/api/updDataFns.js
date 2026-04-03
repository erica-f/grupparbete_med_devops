import { createPersonalBest } from "./createDataFns.js";
import { getPersonalBest, getUser } from "./getDataFns.js";
import { supabase } from "./supabaseClient.js";

const updDataOnSupabase = async ({
  tableName,
  updParams,
  filter,
  doubleFilter,
}) => {
  console.log(
    "update data in table:",
    tableName,
    ", with filter:",
    filter || doubleFilter,
    ", with params:",
    updParams,
  );
  try {
    let query = supabase.from(tableName).update(updParams).select();

    if (filter) {
      query = query.eq(filter.col, filter.value);
    }
    if (doubleFilter) {
      query = query
        .eq(doubleFilter[0].col, doubleFilter[0].value)
        .eq(doubleFilter[1].col, doubleFilter[1].value);
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

// update persons
export const updUserLvl = async (userId) => {
  const user = await getUser(userId);
  updDataOnSupabase({
    tableName: "persons",
    updParams: { lvl: user.lvl + 1 },
    filter: { col: "id", value: userId },
  });
};

// update person_best
export const updPersonalBest = async (userId, exerciseId, repNo) => {
  const personalBestArray = await getPersonalBest(userId);
  const exerciseBest = personalBestArray.filter(
    (pb) => pb.exercise_id === exerciseId,
  );
  if (exerciseBest.length === 0) {
    // a personalBest with that person and exercise doesnt exist
    createPersonalBest(userId, exerciseId, repNo);
  } else {
    updDataOnSupabase({
      tableName: "person_best",
      updParams: { rep_no: repNo },
      doubleFilter: [
        { col: "person_id", value: userId },
        { col: "exercise_id", value: exerciseId },
      ],
    });
  }
};
