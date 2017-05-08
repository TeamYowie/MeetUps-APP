import { Controller } from "controller";
import { FeedbackController } from "feedback";
import { ChatController } from "chat";

let router = new Navigo(null, true);

router
  .on("/", Controller.home)
  .on("/signup", Controller.loadSignup)
  .on("/feedback", FeedbackController.loadFeedback)
  .on("/chat", ChatController.loadChat)
  .resolve();

$(document).ready(() => {
  Controller.loadLogin();
});

$.cloudinary.config({
  cloud_name: 'teamyowie'
});