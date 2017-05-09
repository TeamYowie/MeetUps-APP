import { UserController } from "user";
import { FeedbackController } from "feedback";
import { ChatController } from "chat";

let router = new Navigo(null, true);

router
  .on("/", UserController.loadHome)
  .on("/signup", UserController.loadSignup)
  .on("/feedback", FeedbackController.loadFeedback)
  .on("/chat", ChatController.loadChat)
  .on("/members", UserController.listAllUsers)
  .on("/profile", UserController.loadProfile)
  .resolve();

$(() => {
  UserController.loadLogin();
});

$.cloudinary.config({
  cloud_name: 'teamyowie'
});

