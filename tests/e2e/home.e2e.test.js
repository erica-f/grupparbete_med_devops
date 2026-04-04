import { test, expect } from "@playwright/test";

test("full flow: from choose user to sending user to training page", async ({
  page,
}) => {
  await page.goto("/");
});
test("create new user should add to db and send to training preferences", async ({
  page,
}) => {
  await page.goto("/");
});
