import { Requester } from "requester";
import { Templates } from "templates";
const STORAGE_USERNAME_KEY = "username";
const STORAGE_AUTH_KEY = "auth-key";

export class Controller {
  static isLoggedIn() {
    return Promise
      .resolve()
      .then(() => {
        return !!localStorage.getItem(STORAGE_USERNAME_KEY);
      });
  }

  static login() {
    const username = $("#input-username").val();
    const passHash = CryptoJS.SHA256($("#input-password").val()).toString();
    $("#login-error").css("display", "none");
    if (!username || !passHash || !Controller.isLoggedIn()) {
      return this;
    }

    return Requester.postJSON("http://teamyowie-api.azurewebsites.net/api/auth", {
      username,
      passHash
    })
      .then(authResponse => {
        localStorage.setItem(STORAGE_USERNAME_KEY, authResponse.result.username);
        localStorage.setItem(STORAGE_AUTH_KEY, authResponse.result.authKey);

        Templates
          .get("navigation")
          .then(template => {
            $("#top").html(template);
            $("#logout-button").on("click", Controller.logout);
        });
      })
      .catch(authError => {
        if (authError.status === 422) {
          $("#login-error").text(`${authError.responseText}`);
          $("#login-error").addClass("alert alert-danger");
          $("#login-error").css("display", "inline-block");
        }
      });
  }
  static logout() {
    if (!Controller.isLoggedIn()) {
      return this;
    }

    localStorage.removeItem(STORAGE_USERNAME_KEY);
    localStorage.removeItem(STORAGE_AUTH_KEY);

    Templates
      .get("login")
      .then(template => {
        $("#top").html(template);
        $("#login-button").on("click", Controller.login);
    });
  }
}