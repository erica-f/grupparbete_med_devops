import { describe, test, expect, beforeEach, vi } from "vitest";
import { displayWorkoutComleted } from "../../src/js/training-modular.js"
import { getUsers } from "../../src/api/getDataFns.js";
// vi.mock("../../src/api/supabaseClient.js", () => {
//     return {
//         supabase: {
//             from: vi.fn(() => ({
//                 select: vi.fn(),
//             })),
//         },
//     };
// });
// // tests/mocks/createSupabaseMock.ts

function createSupabaseMock() {
  const mockSingle = vi.fn();
  const mockMaybeSingle = vi.fn();
  const mockEq = vi.fn(() => ({
    single: mockSingle,
    maybeSingle: mockMaybeSingle,
  }));

  const mockSelect = vi.fn(() => ({
    eq: mockEq,
  }));

  const mockFrom = vi.fn(() => ({
    select: mockSelect,
  }));

  return {
    supabase: {
      from: mockFrom,
    },
    mocks: {
      mockFrom,
      mockSelect,
      mockEq,
      mockSingle,
      mockMaybeSingle,
    },
  };
}
import { supabase } from "../../src/api/supabaseClient.js";
describe("app integration", () => {
    beforeEach(() => {
        vi.resetModules();

        document.body.innerHTML = `<section class="page">
        <section class="container section">
            <section id="filter">
                <div class="btn--secondary"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
                        stroke-linejoin="round" class="lucide lucide-arrow-left">
                        <path d="m12 19-7-7 7-7"></path>
                        <path d="M19 12H5"></path>
                    </svg></div>
            </section>
            <h1 id="headline" class="page-title">Ditt pass idag</h1>
            <section id="progress" class="progress-wrapper">
                <div id="percent-text" class="progress-label">
                    <p><span id="exercises-completed">0</span> av <span id="total-exercises">6</span> övningar klara</p>
                    <p id="progress-percent">0%</p>
                </div>
                <div id="progress-bar" class="progress-bar">
                    <div id="progress-done" class="progress-bar__fill">
                    </div>
                </div>
            </section>
            <section id="exercises">

            </section>
            <section id="workout-completed" class="exercise-card" style="display:none">
                <h3>Grattis! Du har slutfört övningen.</h3>
                <button class="btn btn--primary"><a href="achievements.html">Se vad du redan har uppnått</a></button>
            </section>
            <section id="complete-training">
                <button class="btn btn--primary" id="complete-workout-btn">Avsluta passet</button>
            </section>
        </section>
    </section>`
    });

    let exerciseData = [
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
    ];
    //   test("exercises are fetched from API", async () => {
    //         
    //     fetch.mockResolvedValueOnce({ 
    //         ok: true, 
    //         json: async () => exerciseData 
    //     });
    //      const { getExercises } = await import("../../src/api/getDataFns.js");
    //      let exercises = await getExercises();

    //     expect(exercises).toEqual(exerciseData);
    //     // expect(fetch).toHaveBeenCalledWith("https://oikniusywvuqcybbmzgg.supabase.co");
    //   });
    test("user data is fetched from API", async () => {
        let userData = [{ "id": 1, "name": "Erica", "lvl": 1 }];

        // Mock chained call: from().select()
        supabase.from().select.mockResolvedValue({
            data: userData,
            error: null,
        });
        // const { getUser } = await import("../../src/api/getDataFns.js");
        const user = await getUsers();

        expect(user).toEqual(userData);
    })
    //   test("displayWorkoutComleted sets workout-completed visible", async () => {
    //     let completeWorkoutBtn = document.getElementById("complete-workout-btn");
    //     completeWorkoutBtn.click();

    //     const completeNotice = document.getElementById("workout-completed");
    //     expect(document.getElementById("workout-completed")).toBeVisible();
    // });

});