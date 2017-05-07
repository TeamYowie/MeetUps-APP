import { Controller } from "controller";
import { FeedbackController } from "feedback";

let router = new Navigo(null, true);

router
  .on("/", Controller.home)
  .on("/signup", Controller.loadSignup)
  .on("/feedback", FeedbackController.loadFeedback)
  .resolve();

$(document).ready(() => {
  Controller.loadLogin();
});

$.cloudinary.config({
  cloud_name: 'teamyowie'
});