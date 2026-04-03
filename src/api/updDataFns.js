import { getUser } from "./getDataFns.js";
import { supabase } from "./supabaseClient.js";

const updDataOnSupabase = async ({
  tableName,
  updParams,
  filter,
  double_filter,
}) => {
  console.log(
    "update data in table:",
    tableName,
    ", with filter:",
    filter || double_filter,
    ", with params:",
    updParams,
  );
  try {
    let query = supabase.from(tableName).update(updParams).select();

    if (filter) {
      query = query.eq(filter.col, filter.value);
    }
    if (double_filter) {
      query = query
        .eq(double_filter[0].col, double_filter[0].value)
        .eq(double_filter[1].col, double_filter[1].value);
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
export const updUserBest = async (userId, exercise_id) => {
  updDataOnSupabase({
    tableName: "person_best",
    updParams: { rep_no: 2 },
    double_filter: [
      { col: "person_id", value: userId },
      { col: "exercise_id", value: exercise_id },
    ],
  });
};
