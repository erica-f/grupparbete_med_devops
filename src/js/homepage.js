import { getUsers } from "../api/getDataFns.js";
import { createUser } from "../api/createDataFns.js";
// import [storeExerciseSettings] from "../"

const getColorsFromCSS = () => {
  const green = getComputedStyle(document.documentElement)
    .getPropertyValue("--color-green")
    .trim();
  const salmon = getComputedStyle(document.documentElement)
    .getPropertyValue("--color-accent")
    .trim();
  return { green, salmon };
};

const saveChoices = (u) => {
  const selectedTime = document.querySelector('input[name="time"]:checked');
  const selectedPlace = document.querySelector(
    'input[name="location"]:checked',
  );
  const selectedEquipment = document.querySelector(
    'input[name="equipment"]:checked',
  );

  const selectedKids = document.querySelector('input[name="kids"]:checked');
  console.log(
    "should save theese to LS",
    u.id,
    selectedTime?.id.split("t")[1],
    selectedPlace.id !== null && selectedPlace.id === "gym" ? true : false,
    selectedEquipment?.id !== null && selectedEquipment.id === "with-equipment"
      ? true
      : false,
    selectedKids?.id !== null && selectedKids.id === "kids-yes" ? true : false,
  );
  // storeExerciseSettings(
  //   u.id,
  //   selectedTime?.id.split("t")[1],
  //   selectedPlace.id !== null && selectedPlace.id === "gym" ? true : false,
  //   selectedEquipment?.id !== null && selectedEquipment.id === "with-equipment"
  //     ? true
  //     : false,
  //   selectedKids?.id !== null && selectedKids.id === "kids-yes" ? true : false,
  // );

  const radios = document.querySelectorAll('input[type="radio"]');

  radios.forEach((radio) => {
    radio.checked = false;
  });
  window.location.href = "/training.html";
};

export const checkForm = () => {
  const time = document.querySelector('input[name="time"]:checked');
  const location = document.querySelector('input[name="location"]:checked');
  const equipment = document.querySelector('input[name="equipment"]:checked');
  const kids = document.querySelector('input[name="kids"]:checked');
  const btn = document.getElementById("trainingBtn");

  if (time && location && equipment && kids) {
    btn.disabled = false;
  } else {
    btn.disabled = true;
  }
};

export const choosetrainingConditionsHTML = (u) => {
  const homepageBody = document.getElementById("homepage");
  // page
  const page = document.createElement("div");
  page.className = "page";
  homepageBody.append(page);

  // container
  const container = document.createElement("div");
  container.className = "container stack stack--lg";
  page.append(container);

  // ---------------- HEADER ----------------
  const header = document.createElement("div");
  header.className = "stack stack--sm";
  header.style.textAlign = "center";
  container.append(header);

  const brand = document.createElement("div");
  brand.className = "text-brand";
  brand.innerText = "FitParents";
  header.append(brand);

  const backBtn = document.createElement("div");
  backBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left back-btn">
                        <path d="m12 19-7-7 7-7"></path>
                        <path d="M19 12H5"></path>
                    </svg>`;
  backBtn.className = "btn--secondary";
  backBtn.addEventListener("click", () => {
    homepageBody.innerHTML = "";
    chooseUserHTML();
  });
  header.append(backBtn);

  const title = document.createElement("div");
  title.innerHTML = `<h2>Hej, ${u.name}!</h2></br> <h3>Vilka är dina preferenser för träning idag?</h3>`;
  header.append(title);

  const desc = document.createElement("p");
  desc.className = "text-muted";
  desc.innerText =
    "Vi anpassar träningen efter din vardag – oavsett hur mycket tid, energi eller om barnen är med.";
  header.append(desc);

  // ---------------- TIME ----------------
  const section1 = document.createElement("div");
  section1.className = "section";
  container.append(section1);

  const label1 = document.createElement("div");
  label1.className = "section-label";
  label1.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke=${getColorsFromCSS().green} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock text-primary"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> Hur länge kan du träna?`;
  section1.append(label1);

  const grid1 = document.createElement("div");
  grid1.className = "option-grid option-grid--3";
  section1.append(grid1);

  // 10 min
  const t10 = document.createElement("input");
  t10.type = "radio";
  t10.name = "time";
  t10.id = "t10";
  t10.className = "visually-hidden";
  grid1.append(t10);

  const l10 = document.createElement("label");
  l10.htmlFor = "t10";
  l10.className = "option-card bold";
  l10.innerText = "10 min";
  grid1.append(l10);

  // 20 min
  const t20 = document.createElement("input");
  t20.type = "radio";
  t20.name = "time";
  t20.id = "t20";
  t20.className = "visually-hidden";
  grid1.append(t20);

  const l20 = document.createElement("label");
  l20.htmlFor = "t20";
  l20.className = "option-card bold";
  l20.innerText = "20 min";
  grid1.append(l20);

  // 30 min
  const t30 = document.createElement("input");
  t30.type = "radio";
  t30.name = "time";
  t30.id = "t30";
  t30.className = "visually-hidden";
  grid1.append(t30);

  const l30 = document.createElement("label");
  l30.htmlFor = "t30";
  l30.className = "option-card bold";
  l30.innerText = "30 min";
  grid1.append(l30);

  // ---------------- LOCATION ----------------
  const section2 = document.createElement("div");
  section2.className = "section";
  container.append(section2);

  const label2 = document.createElement("div");
  label2.className = "section-label";
  label2.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke=${getColorsFromCSS().green} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-house text-primary"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg> Var vill du träna?`;
  section2.append(label2);

  const grid2 = document.createElement("div");
  grid2.className = "option-grid";
  section2.append(grid2);

  // HOME
  const homeInput = document.createElement("input");
  homeInput.type = "radio";
  homeInput.name = "location";
  homeInput.id = "home";
  homeInput.className = "visually-hidden";
  grid2.append(homeInput);

  const homeLabel = document.createElement("label");
  homeLabel.htmlFor = "home";
  homeLabel.className = "option-card";
  grid2.append(homeLabel);

  const homeIcon = document.createElement("div");
  homeIcon.className = "green";
  homeIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-house text-primary-foreground"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>`;
  homeLabel.append(homeIcon);

  const homeTitle = document.createElement("div");
  homeTitle.className = "option-card__label";
  homeTitle.innerText = "Hemma";
  homeLabel.append(homeTitle);

  const homeSub = document.createElement("div");
  homeSub.className = "option-card__sublabel";
  homeSub.innerText = "Träna i vardagsrummet";
  homeLabel.append(homeSub);

  // GYM
  const gymInput = document.createElement("input");
  gymInput.type = "radio";
  gymInput.name = "location";
  gymInput.id = "gym";
  gymInput.className = "visually-hidden";
  grid2.append(gymInput);

  const gymLabel = document.createElement("label");
  gymLabel.htmlFor = "gym";
  gymLabel.className = "option-card";
  grid2.append(gymLabel);

  const gymIcon = document.createElement("div");
  gymIcon.className = "green";
  gymIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-warehouse-icon lucide-warehouse"><path d="M18 21V10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v11"/><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 1.132-1.803l7.95-3.974a2 2 0 0 1 1.837 0l7.948 3.974A2 2 0 0 1 22 8z"/><path d="M6 13h12"/><path d="M6 17h12"/></svg>`;
  gymLabel.append(gymIcon);

  const gymTitle = document.createElement("div");
  gymTitle.className = "option-card__label";
  gymTitle.innerText = "På gymmet";
  gymLabel.append(gymTitle);

  const gymSub = document.createElement("div");
  gymSub.className = "option-card__sublabel";
  gymSub.innerText = "Med full utrustning";
  gymLabel.append(gymSub);

  // ---------------- EQUIPMENT ----------------
  const section3 = document.createElement("div");
  section3.className = "section";
  container.append(section3);

  const label3 = document.createElement("div");
  label3.className = "section-label";
  label3.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke=${getColorsFromCSS().green} stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-dumbbell text-primary"><path d="M14.4 14.4 9.6 9.6"></path><path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z"></path><path d="m21.5 21.5-1.4-1.4"></path><path d="M3.9 3.9 2.5 2.5"></path><path d="M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z"></path></svg> Ska redskap användas?`;
  section3.append(label3);

  const grid3 = document.createElement("div");
  grid3.className = "option-grid";
  section3.append(grid3);

  // WITH EQUIPMENT
  const equipmentInput = document.createElement("input");
  equipmentInput.type = "radio";
  equipmentInput.name = "equipment";
  equipmentInput.id = "with-equipment";
  equipmentInput.className = "visually-hidden";
  grid3.append(equipmentInput);

  const equipmentLabel = document.createElement("label");
  equipmentLabel.htmlFor = "with-equipment";
  equipmentLabel.className = "option-card";
  grid3.append(equipmentLabel);

  const equipmentIcon = document.createElement("div");
  equipmentIcon.className = "green";
  equipmentIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-dumbbell text-primary"><path d="M14.4 14.4 9.6 9.6"></path><path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z"></path><path d="m21.5 21.5-1.4-1.4"></path><path d="M3.9 3.9 2.5 2.5"></path><path d="M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z"></path></svg>`;
  equipmentLabel.append(equipmentIcon);

  const equipmentTitle = document.createElement("div");
  equipmentTitle.className = "option-card__label";
  equipmentTitle.innerText = "Ja";
  equipmentLabel.append(equipmentTitle);

  const equipmentSub = document.createElement("div");
  equipmentSub.className = "option-card__sublabel";
  equipmentSub.innerText = "Använd vikter & redskap";
  equipmentLabel.append(equipmentSub);

  // NO EQUIPMENT
  const noEquipmentInput = document.createElement("input");
  noEquipmentInput.type = "radio";
  noEquipmentInput.name = "equipment";
  noEquipmentInput.id = "no-equipment";
  noEquipmentInput.className = "visually-hidden";
  grid3.append(noEquipmentInput);

  const noEquipmentLabel = document.createElement("label");
  noEquipmentLabel.htmlFor = "no-equipment";
  noEquipmentLabel.className = "option-card";
  grid3.append(noEquipmentLabel);

  const noEquipmentIcon = document.createElement("div");
  noEquipmentIcon.className = "green";
  noEquipmentIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-person-standing-icon lucide-person-standing"><circle cx="12" cy="5" r="1"/><path d="m9 20 3-6 3 6"/><path d="m6 8 6 2 6-2"/><path d="M12 10v4"/></svg>`;
  noEquipmentLabel.append(noEquipmentIcon);

  const noEquipmentTitle = document.createElement("div");
  noEquipmentTitle.className = "option-card__label";
  noEquipmentTitle.innerText = "Nej";
  noEquipmentLabel.append(noEquipmentTitle);

  const noEquipmentSub = document.createElement("div");
  noEquipmentSub.className = "option-card__sublabel";
  noEquipmentSub.innerText = "Endast kroppsvikt";
  noEquipmentLabel.append(noEquipmentSub);

  // ---------------- KIDS ----------------
  const section4 = document.createElement("div");
  section4.className = "section";
  container.append(section4);

  const label4 = document.createElement("div");
  label4.className = "section-label";
  label4.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke=${getColorsFromCSS().salmon} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-baby text-secondary"><path d="M9 12h.01"></path><path d="M15 12h.01"></path><path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"></path><path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"></path></svg> Har du barn med dig?`;
  section4.append(label4);

  const grid4 = document.createElement("div");
  grid4.className = "option-grid";
  section4.append(grid4);

  // YES (kids)
  const kidsYesInput = document.createElement("input");
  kidsYesInput.type = "radio";
  kidsYesInput.name = "kids";
  kidsYesInput.id = "kids-yes";
  kidsYesInput.value = "yes";
  kidsYesInput.className = "visually-hidden";
  grid4.append(kidsYesInput);

  const kidsYesLabel = document.createElement("label");
  kidsYesLabel.htmlFor = "kids-yes";
  kidsYesLabel.className = "option-card";
  grid4.append(kidsYesLabel);

  const kidsYesIcon = document.createElement("div");
  kidsYesIcon.className = "salmon";
  kidsYesIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-baby text-secondary"><path d="M9 12h.01"></path><path d="M15 12h.01"></path><path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"></path><path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"></path></svg>`;
  kidsYesLabel.append(kidsYesIcon);

  const kidsYesTitle = document.createElement("div");
  kidsYesTitle.className = "option-card__label";
  kidsYesTitle.innerText = "Ja, barnen är med";
  kidsYesLabel.append(kidsYesTitle);

  const kidsYesSub = document.createElement("div");
  kidsYesSub.className = "option-card__sublabel";
  kidsYesSub.innerText = "Vi anpassar övningarna";
  kidsYesLabel.append(kidsYesSub);

  // NO (no kids)
  const kidsNoInput = document.createElement("input");
  kidsNoInput.type = "radio";
  kidsNoInput.name = "kids";
  kidsNoInput.id = "kids-no";
  kidsNoInput.value = "no";
  kidsNoInput.className = "visually-hidden";
  grid4.append(kidsNoInput);

  const kidsNoLabel = document.createElement("label");
  kidsNoLabel.htmlFor = "kids-no";
  kidsNoLabel.className = "option-card";
  grid4.append(kidsNoLabel);

  const kidsNoIcon = document.createElement("div");
  kidsNoIcon.className = "salmon";
  kidsNoIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user text-primary-foreground"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;
  kidsNoLabel.append(kidsNoIcon);

  const kidsNoTitle = document.createElement("div");
  kidsNoTitle.className = "option-card__label";
  kidsNoTitle.innerText = "Nej, jag tränar själv";
  kidsNoLabel.append(kidsNoTitle);

  const kidsNoSub = document.createElement("div");
  kidsNoSub.className = "option-card__sublabel";
  kidsNoSub.innerText = "Fokustid för dig";
  kidsNoLabel.append(kidsNoSub);

  // ---------------- CTA ----------------
  const btn = document.createElement("button");
  btn.id = "trainingBtn";
  btn.className = "btn btn--primary";
  btn.innerHTML = `Skapa mitt pass <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles-icon lucide-sparkles"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/><path d="M20 2v4"/><path d="M22 4h-4"/><circle cx="4" cy="20" r="2"/></svg>`;
  btn.disabled = true;
  btn.addEventListener("click", () => saveChoices(u));

  document.querySelectorAll('input[type="radio"]').forEach((input) => {
    input.addEventListener("change", checkForm);
  });

  container.append(btn);
};

export const chooseUserHTML = async () => {
  const saveUserToLS = (u) => {
    localStorage.setItem(
      "fitParent",
      JSON.stringify({ is_active: true, user: u }),
    );
    homepageBody.innerHTML = "";
    choosetrainingConditionsHTML(u);
  };
  const homepageBody = document.getElementById("homepage");

  // PAGE
  const page = document.createElement("div");
  page.className = "page userpage";
  homepageBody.append(page);

  const container = document.createElement("div");
  container.className = "container stack stack--lg";
  page.append(container);

  // ---------------- HEADER ----------------
  const headerWrap = document.createElement("div");
  headerWrap.className = "stack stack--sm";
  headerWrap.style.textAlign = "center";
  container.append(headerWrap);

  const title = document.createElement("div");
  title.innerHTML =
    "<h2>Välkommen till FitParent!</h2></br><h3>Vem ska träna?</h3>";
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
  userGrid.className = "option-grid option-grid--auto";
  section.append(userGrid);

  const users = await getUsers();

  users.map((u) => {
    const card = document.createElement("div");
    card.className = "option-card";
    card.dataset.userId = u.id;

    const icon = document.createElement("div");
    icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke=${getColorsFromCSS().green} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user text-primary-foreground"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;

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
  newUserInput.className = "card card--white";
  newUserInput.addEventListener("input", () => {
    newUserBtn.disabled = newUserInput.value.trim() === "";
  });
  formCard.append(newUserInput);

  const newUserBtn = document.createElement("button");
  newUserBtn.className = "btn btn--primary";
  newUserBtn.innerText = "Skapa ny profil";
  newUserBtn.disabled = true;
  newUserBtn.addEventListener("click", async () => {
    const newUserArray = await createUser(newUserInput.value);
    saveUserToLS(newUserArray[0]);
  });

  formCard.append(newUserBtn);
};
