import { describe, test, expect } from "vitest";
import { numberOfExercises, getRandomExercises, filterExerciseList } from "../../src/js/training-modular.js";

describe("training functions", () => {

    test("get the correct amount of exercises", () => {
        let total = numberOfExercises(4);
        expect(total).toBe(2);
    });

    test("getRandomExercises returns an array with random data based on how many exercises are needed", () => {
        let testList = [
            {
                "id": 8,
                "name": "Armhävningar",
                "description": "Klassisk helkroppsövning som tränar bröst, axlar och triceps. Kräver ingen utrustning."
            },
            {
                "id": 49,
                "name": "Deadlift med skivstång (konventionell)",
                "description": "Konventionellt marklyft med skivstång – en av de mest effektiva helkroppsövningarna för styrka och muskelmassa."
            },
            {
                "id": 53,
                "name": "Dumbbell Bench Press (dumbbell fly variation)",
                "description": "Flyes-variant med hantlar på bänk som isolerar bröstmuskeln och ger ett stort rörelseomfång."
            },
            {
                "id": 31,
                "name": "Pistol Squat med hantel",
                "description": "Avancerad enbensknäböj med hantel som ökar motståndet och kräver hög grad av balans och styrka."
            },
        ]
        let numberOfExercises = 2;
        let exercises = getRandomExercises(testList, numberOfExercises);
        expect(exercises.length).toBe(2);
    });

    test("filter shows the correct selection of exercises", () => {
        let testList = [
            {
                "id": 8,
                "name": "Armhävningar",
                "description": "Klassisk helkroppsövning som tränar bröst, axlar och triceps. Kräver ingen utrustning.",
                "with_kids": true,
                "at_gym": false,
                "exercise_equipment": [],
                "bodyparts": {
                    "bodypart": "Överkropp-framsida"
                }
            },
            {
                "id": 49,
                "name": "Deadlift med skivstång (konventionell)",
                "description": "Konventionellt marklyft med skivstång – en av de mest effektiva helkroppsövningarna för styrka och muskelmassa.",
                "with_kids": false,
                "at_gym": true,
                "exercise_equipment": [
                    {
                        "equipment": {
                            "name": "Skivstång",
                            "description": "Olympisk skivstång med viktskivor"
                        }
                    }
                ],
                "bodyparts": {
                    "bodypart": "Helkropp"
                }
            },
            {
                "id": 53,
                "name": "Dumbbell Bench Press (dumbbell fly variation)",
                "description": "Flyes-variant med hantlar på bänk som isolerar bröstmuskeln och ger ett stort rörelseomfång.",
                "with_kids": false,
                "at_gym": true,
                "exercise_equipment": [
                    {
                        "equipment": {
                            "name": "Hantel",
                            "description": "Fritt hantelvikt finns i olika vikter"
                        }
                    }
                ],
                "bodyparts": {
                    "bodypart": "Överkropp-framsida"
                }
            },
            {
                "id": 31,
                "name": "Pistol Squat med hantel",
                "description": "Avancerad enbensknäböj med hantel som ökar motståndet och kräver hög grad av balans och styrka.",
                "with_kids": true,
                "at_gym": false,
                "exercise_equipment": [
                    {
                        "equipment": {
                            "name": "Hantel",
                            "description": "Fritt hantelvikt finns i olika vikter"
                        }
                    }
                ],
                "bodyparts": {
                    "bodypart": "Ben-fram"
                }
            },
        ]
        let noKidsEquipGym = filterExerciseList(testList, false, true, true);
        expect(noKidsEquipGym.length).toBe(4);
        expect(noKidsEquipGym[0].id).toBe(8);
        expect(noKidsEquipGym[1].id).toBe(49);
        expect(noKidsEquipGym[2].id).toBe(53);
        expect(noKidsEquipGym[3].id).toBe(31);

        let kidsEquipNoGym = filterExerciseList(testList, true, true, false);
        expect(kidsEquipNoGym.length).toBe(2);
        expect(kidsEquipNoGym[0].id).toBe(8);
        expect(kidsEquipNoGym[1].id).toBe(31);
    });

});
