import { describe, test, expect, beforeEach } from "vitest";
import {
  choosetrainingConditionsHTML,
  chooseUserHTML,
} from "../../src/js/homepage.js";

describe("homepage functions", () => {
  beforeEach(() => {
    const homepageBody = document.body;
    homepageBody.id = "homepage";
    homepageBody.innerHTML = "";
  });

  //prompt: create unit tests for functions in homepage.js, exlude integration and e2e tests
  test("chooseUserHTML should render user selection page", () => {
    chooseUserHTML();
    const pages = document.getElementsByClassName("page");
    expect(pages.length).toBe(1);
  });

  test("chooseUserHTML should create form elements", () => {
    chooseUserHTML();
    const formSection = document.getElementsByClassName("section");
    expect(formSection).toBeTruthy();
    const newUserInput = document.getElementsByClassName("card card--white");
    expect(newUserInput.placeholder === "Skriv ditt namn...");
  });

  test("choosetrainingConditionsHTML should render training conditions page", () => {
    choosetrainingConditionsHTML({ id: 1, name: "test" });
    const pages = document.getElementsByClassName("page");
    expect(pages.length).toBe(1);
  });

  test("choosetrainingConditionsHTML should display user name", () => {
    const user = { id: 1, name: "John Doe" };
    choosetrainingConditionsHTML(user);
    expect(document.body.innerHTML).toContain("John Doe");
  });
});
