import { describe, test, expect, beforeEach } from "vitest";
import { renderExercises } from "../../src/js/exercises.js";

const mockExercises = [
    {
        id: 8,
        name: "Armhävningar",
        description: "Klassisk helkroppsövning.",
        how_to: "Håll kroppen rak och sänk ner bröstkorgen mot golvet.",
        exercise_equipment: [],
        bodyparts: { bodypart: "Överkropp-framsida" },
    },
    {
        id: 31,
        name: "Pistol Squat med hantel",
        description: "Avancerad enbensknäböj med hantel.",
        how_to: null,
        exercise_equipment: [
            { equipment: { name: "Hantel", description: "Fritt hantelvikt i olika vikter" } },
        ],
        bodyparts: { bodypart: "Ben-fram" },
    },
];

describe("exercises integration", () => {

    beforeEach(() => {
        document.body.innerHTML = `<div id="exercise_cards"></div>`;
    });

    test("renderExercises renders only exercises matching the active group", () => {
        renderExercises(mockExercises, "överkropp");
        const cards = document.querySelectorAll(".exercise-card");
        expect(cards).toHaveLength(1);
        expect(cards[0].querySelector(".card-title").textContent).toBe("Armhävningar");
    });

    test("renderExercises shows fallback text when no exercises match group", () => {
        renderExercises(mockExercises, "helkropp");
        const fallback = document.querySelector(".text-muted");
        expect(fallback).not.toBeNull();
        expect(fallback.textContent).toBe("Inga övningar hittades.");
    });

});
