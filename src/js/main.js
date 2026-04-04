import { getUsers } from "../api/getDataFns.js";

const choseUser = async () => {
  const saveUserToLS = (u) => {
    console.log("Save to ls", u.name);
  };
  const homepageBody = document.getElementById("homepage");

  // PAGE
  const page = document.createElement("div");
  page.className = "page";
  homepageBody.append(page);

  const container = document.createElement("div");
  container.className = "container stack stack--lg";
  page.append(container);

  // ---------------- HEADER ----------------
  const headerWrap = document.createElement("div");
  headerWrap.className = "stack stack--sm";
  headerWrap.style.textAlign = "center";
  container.append(headerWrap);

  const title = document.createElement("h2");
  title.innerText = "Vem ska träna?";
  headerWrap.append(title);

  // ---------------- USER LIST ----------------
  const section = document.createElement("div");
  section.className = "section";
  container.append(section);

  const label = document.createElement("div");
  label.className = "section-label";
  label.innerText = "Välj profil";
  section.append(label);

  const userGrid = document.createElement("div");
  userGrid.className = "option-grid";
  section.append(userGrid);

  // FETCH USERS
  const users = await getUsers();

  users.map((u) => {
    const card = document.createElement("div");
    card.className = "option-card";

    const icon = document.createElement("div");
    icon.className = "icon-circle";
    icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user text-primary-foreground"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;

    card.prepend(icon);
    const name = document.createElement("div");
    name.className = "option-card__label";
    name.innerText = u.name;

    card.append(name);

    card.addEventListener("click", () => saveUserToLS(u));

    userGrid.append(card);
  });

  // ---------------- NEW USER ----------------
  const formSection = document.createElement("div");
  formSection.className = "section";
  container.append(formSection);

  const formLabel = document.createElement("div");
  formLabel.className = "section-label";
  formLabel.innerText = "Ny profil";
  formSection.append(formLabel);

  // CARD instead of plain form
  const formCard = document.createElement("div");
  formCard.className = "card stack stack--sm";
  formSection.append(formCard);

  const newUserInput = document.createElement("input");
  newUserInput.type = "text";
  newUserInput.placeholder = "Skriv ditt namn...";
  newUserInput.className = "card card--white"; // reuse styling

  formCard.append(newUserInput);

  const newUserBtn = document.createElement("button");
  newUserBtn.className = "btn btn--primary";
  newUserBtn.innerText = "Skapa ny profil";

  formCard.append(newUserBtn);
};
choseUser();
