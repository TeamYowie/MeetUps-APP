import { Requester } from "requester";
import { Templates } from "templates";
const MIN_PASSWORD_LENGTH = 6;
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
    const password = $("#input-password").val();

    if (!username || !password) {
      return this;
    }

    Controller.isLoggedIn()
      .then(isLoggedIn => {
        if (isLoggedIn) {
          return this;
        }

        const passHash = CryptoJS.SHA256(password).toString();
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
            let errorElement = $("#login-error");
            if (authError.status === 422) {
              Controller.errorPopup(errorElement);
            }
          });
      });
  }

  static signup() {
    const username = $("#signup-username").val();
    const email = $("#signup-email").val();
    const password = $("#signup-password").val();
    const passwordConfirmation = $("#signup-password-confirm").val();
    const profileImage = $("label#photo-container > img").attr("src").split(/[\/]/).pop();
    const passHash = CryptoJS.SHA256(password).toString();
    $(".help-block").css("color", "#737373");

    Controller.isLoggedIn()
      .then(isLoggedIn => {
        if (isLoggedIn) {
          return this;
        }

        if (!username || !(/^[a-zA-Z0-9]+$/.test(username))) {
          $(".help-block").eq(0).css("color", "red");
          return this;
        }

        let pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!email || !(pattern.test(email))) {
          $(".help-block").eq(1).css("color", "red");
          return this;
        }

        if (!password || !(typeof password === "string") || !(password.length >= MIN_PASSWORD_LENGTH)) {
          $(".help-block").eq(2).css("color", "red");
          return this;
        }

        if (!passwordConfirmation || !(password === passwordConfirmation)) {
          $(".help-block").eq(3).css("color", "red");
          return this;
        }

        return Requester.postJSON("/api/users", {
          username,
          passHash,
          email,
          profileImage
        })
          .then(signUpResponse => {
            Controller.postSignup();
          })
          .catch(signUpError => {
            let errorPopup = $("#signup-error");
            if (signUpError.status === 422 || signUpError.status === 409) {
              errorPopup.text(signUpError.responseText);
              errorPopup.toggleClass("hidden");
              setTimeout(() => {
                errorPopup.toggleClass("hidden");
              }, 3000);
            }
          });
      });
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
        let errorElement = $("#logout-error");
        if (logoutError.status === 422) {
          Controller.errorPopup(errorElement);
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
        $("#photo-container").prepend($.cloudinary.image("default-profile-picture.svg", {
          radius: 20,
          width: 150,
          crop: "scale"
        }));
        $("#photo-selector").unsigned_cloudinary_upload("q3olokl1",
          { cloud_name: "teamyowie", tags: "browser_uploads" })
          .bind("cloudinarydone", (e, data) => {
            $("#progress-bar")
              .addClass("hidden");
            $("#photo-container").html($.cloudinary.image(data.result.public_id, {
              width: 150,
              height: 150,
              crop: "thumb",
              gravity: "face",
              effect: "saturation:50",
              radius: 20
            }))
          })
          .bind("cloudinaryprogress", function (e, data) {
            let currentPercentage = Math.round((data.loaded * 100.0) / data.total) + "%";
            $("#progress-bar")
              .removeClass("hidden");
            $(".progress-bar-info")
              .css("width", currentPercentage)
              .text(currentPercentage);
          })
          .addClass("hidden");
        $("#signup-error").toggleClass("hidden");
        $("#signup-submit").on("click", Controller.signup);
      });
  }

  static postSignup() {
    Templates
      .get("post-signup")
      .then(template => {
        $("#content").html(template);
      });
  }

  static loadHome() {
    Templates
      .get("home")
      .then(template => {
        $("#content").html(template);
      });
  }

  static errorPopup(errorElement) {
    if (!errorElement.hasClass("hidden")) {
      return;
    }
    $(".form-control").val("");
    errorElement.toggleClass("hidden");
    setTimeout(() => {
      errorElement.toggleClass("hidden");
    }, 3000);
  }
}
