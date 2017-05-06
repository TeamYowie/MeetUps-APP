import { Requester } from "requester";
import { Templates } from "templates";
const STORAGE_USERNAME_KEY = "username";
const STORAGE_AUTH_KEY = "auth-key";
const HTTP_HEADER_KEY = "x-auth-key";

export class Controller {
  static isLoggedIn() {
    return Promise
      .resolve()
      .then(() => {
        return !!localStorage.getItem(STORAGE_USERNAME_KEY) && !!localStorage.getItem(STORAGE_AUTH_KEY);
      });
  }

  static home() {
    Controller.loadHome();
  }

  static login() {
    const username = $("#input-username").val();
    const passHash = CryptoJS.SHA256($("#input-password").val()).toString();

    if (username && $("#input-password").val()) {
      Controller.isLoggedIn()
        .then(isLoggedIn => {
          if (isLoggedIn) {
            return this;
          }
          else {
            let body = {
              username,
              passHash
            };
            return Requester.postJSON("/api/auth", body)
              .then(authResponse => {
                localStorage.setItem(STORAGE_USERNAME_KEY, authResponse.result.username);
                localStorage.setItem(STORAGE_AUTH_KEY, authResponse.result.authKey);

                Controller.loadNav();
                window.location = "#/";
              })
              .catch(authError => {
                let errorPopup = $("#login-error");
                if (authError.status === 422) {
                  errorPopup.toggleClass("hidden");
                  setTimeout(() => {
                    errorPopup.toggleClass("hidden");
                  }, 3000);
                }
              });
          }
        });
    }
  }

  static signup() {
    const username = $("#signup-username").val();
    const passHash = CryptoJS.SHA256($("#signup-password").val()).toString();
    
    if (username && $("#signup-password").val()) {
      Controller.isLoggedIn()
        .then(isLoggedIn => {
          if (isLoggedIn) {
            return this;
          }
          else {
            return Requester.postJSON("/api/users", {
              username,
              passHash
            })
              .then(signUpResponse => {
                window.location = "#/";
              })
              .catch(signUpError => {
                let errorPopup = $("#signup-error");
                if (signUpError.status === 400 || signUpError.status === 409) {
                  errorPopup.toggleClass("hidden");
                  setTimeout(() => {
                    errorPopup.toggleClass("hidden");
                  }, 3000);
                }
              });
          }
        });
    }
  }

  static logout() {
    let body = {
       username: localStorage.getItem(STORAGE_USERNAME_KEY)
    };
    let options = {
      headers: {
        [HTTP_HEADER_KEY]: localStorage.getItem(STORAGE_AUTH_KEY)
      }
    };

    return Requester.postJSON("/api/logout", body, options)
      .then(logoutResponse => {
        localStorage.removeItem(STORAGE_USERNAME_KEY);
        localStorage.removeItem(STORAGE_AUTH_KEY);

        Controller.loadLogin();
        window.location = "#/";
      })
      .catch(logoutError => {
        let errorPopup = $("#logout-error");
        if (logoutError.status === 422) {
          errorPopup.toggleClass("hidden");
          setTimeout(() => {
            errorPopup.toggleClass("hidden");
          }, 3000);
        }
      });
  }

  static loadLogin() {
    Templates
      .get("login")
      .then(template => {
        $("#main-nav").html(template);
        $("#login-error").toggleClass("hidden");
        $("#login-button").on("click", Controller.login);
        $("#signup-button").on("click", () => {
          window.location = "#/signup";
        });
      });
  }

  static loadNav() {
    Templates
      .get("navigation")
      .then(template => {
        $("#main-nav").html(template);
        $("#logout-error").toggleClass("hidden");
        $("#logout-button").on("click", Controller.logout);
      });
  }

  static loadSignup() {
    Templates
      .get("signup")
      .then(template => {
        $("#content").html(template);
        $("#signup-error").toggleClass("hidden");
        $("#signup-submit").on("click", Controller.signup);
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