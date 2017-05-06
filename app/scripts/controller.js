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
  static home() {
    Controller.loadHome();
  }
  static login() {
    const username = $("#input-username").val();
    const passHash = CryptoJS.SHA256($("#input-password").val()).toString();

    if (!username || !passHash || !Controller.isLoggedIn()) {
      return this;
    }
    //Changed from post to put request
    return Requester.putJSON("http://teamyowie-api.azurewebsites.net/api/auth", {
      username,
      passHash
    })
      .then(authResponse => {
        localStorage.setItem(STORAGE_USERNAME_KEY, authResponse.result.username);
        localStorage.setItem(STORAGE_AUTH_KEY, authResponse.result.authKey);

        Controller.loadNav();
        document.location = "#/home";
      })
      .catch(authError => {
        let errorPopup = $("#login-error");
        if (authError.status === 422 || authError.status === 404) {
          errorPopup.toggleClass("hidden");
          setTimeout(() => {
            errorPopup.toggleClass("hidden");
          }, 3000);
        }
      });
  }

  static signup() {
    const username = $("#signup-username").val();
    const passHash = CryptoJS.SHA256($("#signup-password").val()).toString();

    if (!username || !passHash || Controller.isLoggedIn()) {
      return this;
    }

    return Requester.postJSON("http://teamyowie-api.azurewebsites.net/api/users", {
      username,
      passHash
    })
      .then(authResponse => {
        // this if is stupid idea maybe -> if Remember me checkbox is not checked
        // it doesn't set the items in the local storage and does not load nav
        if ($("#remember-me")[0].checked) {
          localStorage.setItem(STORAGE_USERNAME_KEY, authResponse.result.username);
          localStorage.setItem(STORAGE_AUTH_KEY, authResponse.result.authKey);
          Controller.loadNav();
        }

        document.location = "#/home";
      })
      .catch(authError => {
        console.log(JSON.stringify(authError));
        let errorPopup = $("#signup-error");
        if (authError.status === 400 || authError.status === 409) {
          errorPopup.toggleClass("hidden");
          setTimeout(() => {
            errorPopup.toggleClass("hidden");
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
    document.location = "#/home";
  }

  static loadLogin() {
    Templates
      .get("login")
      .then(template => {
        $("#main-nav").html(template);
        $("#login-error").toggleClass("hidden");
        $("#login-button").on("click", Controller.login);
        $("#signup-button").on("click", Controller.loadSignup);
        document.location = "#/home";
      });
  }

  static loadNav() {
    Templates
      .get("navigation")
      .then(template => {
        $("#main-nav").html(template);
        $("#logout-button").on("click", Controller.logout);
        $('.dropdown-toggle').dropdown();
        document.location = "#/home";
      });
  }

  static loadSignup() {
    Templates
      .get("signup")
      .then(template => {
        $("#content").html(template);
        $("#signup-error").toggleClass("hidden");
        $("#signup-submit").on("click", Controller.signup);
        document.location = "#/signup";
      });
  }

  static loadHome() {
    Templates
      .get("home")
      .then(template => {
        $("#content").html(template);
      });
  }
}