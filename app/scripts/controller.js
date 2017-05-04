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

        Controller.loadNav();
      })
      .catch(authError => {
        if (authError.status === 422) {
          $("#login-error").show();
          setTimeout(() => {
            $("#login-error").hide();
          }, 3000);
        }
      });
  }

  static logout() {
    if (!Controller.isLoggedIn()) {
      return this;
    }

    localStorage.removeItem(STORAGE_USERNAME_KEY);
    localStorage.removeItem(STORAGE_AUTH_KEY);

    Controller.loadLogin();
  }
  
  static loadLogin() {
    Templates
      .get("login")
      .then(template => {
        $("#main-nav").html(template);
        $("#login-error").hide();
        $("#login-button").on("click", Controller.login);
    });
  }
  
  static loadNav() {
    Templates
      .get("navigation")
      .then(template => {
        $("#main-nav").html(template);
        $("#logout-button").on("click", Controller.logout);
        $('.dropdown-toggle').dropdown()
    });
  }
}