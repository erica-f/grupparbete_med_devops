import { supabase } from "./supabaseClient.js";

const deleteDataFromSupabase = async ({ tableName, dataId }) => {
  console.log("delete data in table:", tableName, ", with id:", dataId);
  try {
    const { data, error } = await supabase
      .from(tableName)
      .delete()
      .eq("id", dataId);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return error;
  }
};

export const deleteUser = async (userId) => {
  return await deleteDataFromSupabase({
    tableName: "persons",
    dataId: userId,
  });
};
