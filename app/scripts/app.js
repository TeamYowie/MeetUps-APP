import { UserController } from "user";
import { FeedbackController } from "feedback";
import { ChatController } from "chat";

let router = new Navigo(null, true);

router
  .on("/", UserController.loadHome)
  .on("/signup", UserController.loadSignup)
  .on("/feedback", FeedbackController.loadFeedback)
  .on("/chat", ChatController.loadChat)
  .on("/profile", UserController.loadProfile)
  .on("/members", UsersController.listAll)
  .resolve();

$(() => {
  UserController.loadLogin();
});

$.cloudinary.config({
  cloud_name: 'teamyowie'
});