// import { chooseUserHTML } from "./homepage.js";

// chooseUserHTML();

import { choosetrainingConditionsHTML, chooseUserHTML } from "./homepage";
const userInLS = JSON.parse(localStorage.getItem("fitParents"));
const activeTrainer = userInLS && userInLS.is_active ? userInLS.user : false;
{
  activeTrainer === false
    ? chooseUserHTML()
    : choosetrainingConditionsHTML(userInLS.user);
}
