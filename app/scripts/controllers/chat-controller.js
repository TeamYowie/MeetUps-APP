import { Templates } from "templates";
import { Utils } from "utils";
const API_URL = "http://teamyowie-api.azurewebsites.net";
const CONNECTION_OPTIONS =  {
    "force new connection" : true,
    "reconnectionAttempts": "Infinity",
    "timeout" : 10000,
    "transports" : ["websocket"]
};

export class ChatController {
  static loadChat() {
    const socket = io(API_URL, CONNECTION_OPTIONS);
    Promise.all([Utils.isLoggedIn(), Templates.get("chat")])
      .then(([isLoggedIn, template]) => {
        if (!isLoggedIn) {
          window.location = "#/";
          return this;
        }
        $("#content").html(template);
        $("#chat-submit").on("click", () => {
          ChatController.sendMessage(socket);
        });
        $("#chat-form").on("keyup", (ev) => {
          if (ev.which !== 13) {
            return this;
          }
          ChatController.sendMessage(socket);
        });
      });
    socket.on("updateMessages", (data) => {
      ChatController.showMessage(data);
    })
  }

  static sendMessage(socket) {
    let chatUsername = $("#chat-username");
    let chatMessage = $("#chat-message");
    let messageData = {
      username: chatUsername.val(),
      message: chatMessage.val()
    };
    if (!messageData.username || !messageData.message) {
      return this;
    }
    socket.emit("postMessage", messageData);
    chatMessage.val("");
    chatMessage.focus();
    }

  static showMessage(data) {
    Templates.get("chat-message")
      .then(template => {
        let userStyle = "bg-info chat-text";
        if ($("#chat-username").val() === data.username) {
          userStyle = "bg-success chat-text";
        }
        $(".chat-display").prepend($(template(data)).addClass(userStyle));
      });
  }
}