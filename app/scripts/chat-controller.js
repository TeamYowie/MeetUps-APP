import { Requester } from "requester";
import { Templates } from "templates";
import { Controller } from "controller";

export class ChatController {
    static loadChat() {
        Promise.all([Controller.isLoggedIn(), Templates.get("chat")])
            .then(([isLoggedIn, template]) => {
                if (!isLoggedIn) {
                    window.location = "#/signup";
                    return this;
                }
                $("#content").html(template);
                $("#chat-submit").on("click", (ev) => {
                    ChatController.Communicate();
                });
                $("#chat-form").on("keydown", (ev) => {
                    if (ev.which !== 13) {
                        return;
                    }
                    ChatController.Communicate();
                });
            });
    }
    static Communicate() {
        let chatUsername = $("#chat-username");
        let chatMessage = $("#chat-message");
        let result = {
            username: chatUsername.val(),
            message: chatMessage.val()
        };
        Templates.get("chat-message")
            .then(template => {
                $(".chat-display").prepend(template(result));
                chatMessage.val("");
                chatMessage.focus();
            });
    }
}
