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

    console.log("returned data", data);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return error;
  }
};

// create data to persons
export const createUser = async (newUser) => {
  const newPerson = { lvl: 1, streak: 0, name: newUser };
  await createDataToSupabase({ tableName: "persons", dataObject: newPerson });
};
