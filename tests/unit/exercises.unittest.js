import { describe, test, expect } from "vitest";
import { exerciseBelongsToGroup, getEquipmentItems } from "../../src/js/exercises.js";

describe("exercises unit functions", () => {

    test("exerciseBelongsToGroup returns true for matching group and false for non-matching", () => {
        const exercise = {
            bodyparts: { bodypart: "Överkropp-framsida" },
        };
        expect(exerciseBelongsToGroup(exercise, "överkropp")).toBe(true);
        expect(exerciseBelongsToGroup(exercise, "nederkropp")).toBe(false);
        expect(exerciseBelongsToGroup(exercise, "helkropp")).toBe(false);
    });

    test("getEquipmentItems returns empty array when no equipment, and correct items when equipment exists", () => {
        const noEquipment = { exercise_equipment: [] };
        expect(getEquipmentItems(noEquipment)).toEqual([]);

        const withEquipment = {
            exercise_equipment: [
                { equipment: { name: "Hantel", description: "Fritt hantelvikt i olika vikter" } },
                { equipment: { name: "Gummiband", description: "Elastiskt träningsband" } },
            ],
        };
        const result = getEquipmentItems(withEquipment);
        expect(result).toHaveLength(2);
        expect(result[0].name).toBe("Hantel");
        expect(result[1].name).toBe("Gummiband");
    });

});
