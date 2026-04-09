import { describe, test, expect, beforeEach, vi } from "vitest";
import { getData } from "../../src/js/training-data.js";

describe("training mock", () => {
    beforeEach(() => {
        vi.resetModules();
       
        vi.mock(import('../../src/js/training-data.js'), () => {
            return {
                getData() {
                    return {
                        "totalNumberOfExercises": 2,
                        "userData": {
                            "id": 5,
                            "lvl": 1,
                            "streak": 0,
                            "name": "Erica",
                            "last_week_update": "2026-W15"
                        },
                        "filteredList": [
                            {
                                "id": 26,
                                "name": "Armhävningar med gummiband",
                                "description": "Armhävning med gummibandsmotstånd som ökar svårighetsgraden och bygger extra toppstyrka i rörelsen.",
                                "with_kids": true,
                                "at_gym": false,
                                "exercise_equipment": [
                                    {
                                        "equipment": {
                                            "name": "Gummiband",
                                            "description": "Elastiskt träningsband i olika motståndsnivåer"
                                        }
                                    }
                                ],
                                "bodyparts": {
                                    "bodypart": "Överkropp-framsida"
                                }
                            },
                            {
                                "id": 14,
                                "name": "Armhävningar med klapp",
                                "description": "Explosiv armhävning med klapp som bygger överkroppsstyrka och reaktionskraft.",
                                "with_kids": true,
                                "at_gym": false,
                                "exercise_equipment": [],
                                "bodyparts": {
                                    "bodypart": "Överkropp-framsida"
                                }
                            },
                        ],
                        "selectedExercises": [{
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
                            "id": 9,
                            "name": "Planka med axeltryck",
                            "description": "Plankvariant med extra fokus på axelstabilitet och skulderbladsaktivering.",
                            "with_kids": true,
                            "at_gym": false,
                            "exercise_equipment": [],
                            "bodyparts": {
                                "bodypart": "Helkropp"
                            }
                        }],
                        "getRepAmount": [{
                            "id": 6,
                            "exercise_id": 8,
                            "amount": 15,
                            "lvl": 1
                        },
                        {
                            "id": 15,
                            "exercise_id": 9,
                            "amount": 12,
                            "lvl": 1
                        },
                        ]
                    }
                },
                variable: 'mock',
            }
        });

        document.body.innerHTML = `
          <section class="page">
                <section class="container section">
                    <section id="filter">
                        <div class="btn--secondary">
                           Back</div>
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
                    <section id="workout-completed" class="exercise-card">
                        <h3>Grattis! Du har slutfört övningen.</h3>
                        <button class="btn btn--primary"><a href="achievements.html">Se vad du redan har uppnått</a></button>
                    </section>
                    <section id="complete-training">
                        <button class="btn btn--primary" id="complete-workout-btn">Avsluta passet</button>
                    </section>
                </section>
            </section>
            `;
    });
    test('Document is populated with correct exercises cards and info on load', async () => {
        let settings = await getData();
        const { populateWorkout } = await import("../../src/js/training.js");
        populateWorkout();
        let totalExercises = document.getElementById("total-exercises").textContent;
        let exerciseCards = document.querySelectorAll(".exercise");
        expect(totalExercises).toBe('2');
        expect(exerciseCards.length).toBe(2);
        let repSets = document.querySelectorAll(".rep-set");
        expect(repSets[0].id).toBe(settings.selectedExercises[0].id.toString());
        expect(repSets[1].id).toBe(settings.selectedExercises[1].id.toString());
        expect(exerciseCards[0].querySelector(".exercise-header h4").textContent).toBe(settings.selectedExercises[0].name);
    });
});




