import { Controller } from "controler";

let router = new Navigo(null, true);

router
  .on("/", Controller.home)
  .on("/signup", Controller.loadSignup)
  .on("/feedback", Controller.loadFeedback)
  .resolve();

$(document).ready(() => {
  Controller.loadLogin();
});

$.cloudinary.config({
  cloud_name: 'teamyowie'
});