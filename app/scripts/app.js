import { Controller } from "controler";

let router = new Navigo(null, true);

router
  .on("/", Controller.home)
  .on("/signup", Controller.loadSignup)
  .resolve();

$(document).ready(() => {
  Controller.loadLogin();
});