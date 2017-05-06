import { Controller } from "controler";

let router = new Navigo(null, true);

router
  .on("/", () => router.navigate("/home"))
  .on("/home", Controller.home)
  .on("/signup", Controller.loadSignup)
  .resolve();

$(document).ready(() => {
  Controller.loadLogin();
});