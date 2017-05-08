import { UserController } from "user";
import { FeedbackController } from "feedback";
import { ChatController } from "chat";

let router = new Navigo(null, true);

router
  .on("/", UserController.home)
  .on("/signup", UserController.loadSignup)
  .on("/feedback", FeedbackController.loadFeedback)
  .on("/chat", ChatController.loadChat)
  .resolve();

$(document).ready(() => {
  UserController.loadLogin();
});

$.cloudinary.config({
  cloud_name: 'teamyowie'
});