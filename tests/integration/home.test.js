import { describe, test, expect, beforeEach, vi } from "vitest";
import { chooseUserHTML } from "../../src/js/homepage.js";
import { getUsers } from "../../src/api/getDataFns.js";

describe("homepage integration tests", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal("fetch", vi.fn());
    vi.mock("../../src/api/getDataFns.js", () => ({
      getUsers: vi.fn(),
    }));
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ Response: "False" }),
    });
    const homepageBody = document.body;
    homepageBody.id = "homepage";
    homepageBody.innerHTML = "";
  });

  //prompt: create integration tests for functions in homepage.js, exlude unit and e2e tests
  test("should render users from API and handle user selection", async () => {
    const users = [
      { id: 1, name: "tester1" },
      { id: 2, name: "tester2" },
    ];

    getUsers.mockResolvedValue(users);

    await chooseUserHTML();

    const userOptions = document.querySelectorAll(".option-card");

    expect(userOptions.length).toBe(users.length);
  });

  test("should save user choice and preferences together", async () => {
    const users = [{ id: 1, name: "tester1" }];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => users,
    });

    await chooseUserHTML();

    const userSelect = document.querySelector("[data-user-id='1']");
    expect(userSelect).toBeTruthy();
  });

  //prompt: write a integration test for function checkForm in homepage.js
  test("checkForm should enable submit button only after required preferences are selected", async () => {
    const { choosetrainingConditionsHTML, checkForm } =
      await import("../../src/js/homepage.js");

    const user = { id: 1, name: "tester1" };
    await choosetrainingConditionsHTML(user);

    const submitBtn = document.getElementById("trainingBtn");
    expect(submitBtn).toBeTruthy();
    expect(submitBtn.disabled).toBe(true);

    const controls = Array.from(
      document.querySelectorAll("input, select, textarea"),
    ).filter((control) => !control.disabled && control.type !== "hidden");

    controls.forEach((control) => {
      if (control.tagName === "SELECT") {
        control.value =
          control.options[1]?.value ?? control.options[0]?.value ?? "";
      } else if (control.type === "checkbox" || control.type === "radio") {
        control.checked = true;
      } else {
        control.value = "test";
      }
      control.dispatchEvent(new Event("input", { bubbles: true }));
      control.dispatchEvent(new Event("change", { bubbles: true }));
    });

    checkForm();

    expect(submitBtn.disabled).toBe(false);
  });

  // test("saveChoices should save user and preferences", () => {});
  // test("chosing a user should send user to training preferences", async () => {});
  // test("'Skapa ny profil' should add a new user and send user to training preferences", async () => {});
  // test("chosing all preferences should enable btn", async () => {});
  // test("checkForm should disable btn under right conditions", () => {});

  //to test,coverage homepage 13-47,94-95,394-399,479,488-489
});
