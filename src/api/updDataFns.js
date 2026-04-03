import { createPersonalBest } from "./createDataFns.js";
import {
  getPersonalBest,
  getPersonalBestFromSpecificExercise,
  getUser,
} from "./getDataFns.js";
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

export const updUserStreak = async (userId) => {
  const workoutsThisWeek = 4; //get number from LS
  if (workoutsThisWeek >= 3) {
    const user = await getUser(userId);
    updDataOnSupabase({
      tableName: "persons",
      updParams: { streak: user.streak + 1 },
      filter: { col: "id", value: userId },
    });
  } else {
    return;
  }
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

export const updTotalReps = async (userId, exerciseId, repNo) => {
  const personalBestSpecificExercise =
    await getPersonalBestFromSpecificExercise(userId, exerciseId);

  updDataOnSupabase({
    tableName: "person_best",
    updParams: { total_reps: personalBestSpecificExercise.total_reps + repNo },
    doubleFilter: [
      { col: "person_id", value: userId },
      { col: "exercise_id", value: exerciseId },
    ],
  });
};

// update  person_achievements
// TODO:update achievement date after reps update
