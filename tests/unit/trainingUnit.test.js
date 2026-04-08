import { describe, test, expect, beforeEach } from "vitest";
import { numberOfExercises } from "../../src/js/training-create.js";

describe("training functions", () => {
    beforeEach(() => {
    });

    test("get the correct amount of exercises", () => {
        let total = numberOfExercises(4);
        expect(total).toBe(2);
    });

});
