import { Requester } from "requester";
import { Templates } from "templates";
const MIN_PASSWORD_LENGTH = 6;
const STORAGE_ID_KEY = "id";
const STORAGE_AUTH_KEY = "auth-key";
const STORAGE_PHOTO_KEY = "profile-image";
const HTTP_HEADER_KEY = "x-auth-key";

export class UserController {
  static isLoggedIn() {
    return Promise
      .resolve()
      .then(() => {
        return !!localStorage.getItem(STORAGE_ID_KEY) && !!localStorage.getItem(STORAGE_AUTH_KEY);
      });
  }

  static login() {
    const username = $("#input-username").val();
    const password = $("#input-password").val();

    if (!username || !password) {
      return this;
    }

    UserController.isLoggedIn()
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
            localStorage.setItem(STORAGE_ID_KEY, authResponse.result.id);
            localStorage.setItem(STORAGE_AUTH_KEY, authResponse.result.authKey);
            localStorage.setItem(STORAGE_PHOTO_KEY, authResponse.result.profileImage);
            UserController.loadNav(authResponse.result.username);
            window.location = "#/";
          })
          .catch(authError => {
            let $errorElement = $("#login-error");
            if (authError.status === 422) {
              UserController.elementPopupAndClearControls($errorElement);
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

    UserController.isLoggedIn()
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
            UserController.postSignup();
          })
          .catch(signUpError => {
            let errorElement = $("#signup-error");
            if (signUpError.status === 422 || signUpError.status === 409) {
              errorElement.text(signUpError.responseText);
              UserController.elementPopupAndClearControls(errorElement);
            }
          });
      });
  }

  static saveProfile() {
    const firstname = $("#new-firstname").val();
    const lastname = $("#new-lastname").val();
    const email = $("#new-email").val();
    const newPassword = $("#new-password").val();
    const newPasswordConfirmation = $("#new-password-confirm").val();
    const profileImage = $("#profile-photo").attr("src").split(/[\/]/).pop();
    const passHash = CryptoJS.SHA256($("#password").val()).toString();
    const newPassHash = CryptoJS.SHA256(newPassword).toString();

    UserController.isLoggedIn()
      .then(isLoggedIn => {
        if (!isLoggedIn) {
          return this;
        }

        let newData = {
          passHash,
          profileImage
        };
        
        if (firstname) {
          newData.firstname = firstname;
        }

        if (lastname) {
          newData.lastname = lastname;
        }
        
        let pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (email) {
          if (pattern.test(email)) {
            newData.email = email;
          }
          else {
            let $errorElement = $("#profile-error");
            $errorElement.text("Please provide valid email.");
            UserController.elementPopup($errorElement);
            return this;
          }
        }
        
        if (newPassword) {
          if (newPassword.length >= MIN_PASSWORD_LENGTH) {
            if (newPassword === newPasswordConfirmation) {
              newData.newPassHash = newPassHash;
            }
            else {
              let $errorElement = $("#profile-error");
              $errorElement.text("Passwords do not match.");
              UserController.elementPopup($errorElement);
              return this;
            }
          }
          else {
            let $errorElement = $("#profile-error");
            $errorElement.text("Password should be at least 6 characters.");
            UserController.elementPopup($errorElement);
            return this;
          }
        }
        
        let endpointOffset = "/api/user/" + localStorage.getItem(STORAGE_ID_KEY);
        let options = {
          headers: {
            [HTTP_HEADER_KEY]: localStorage.getItem(STORAGE_AUTH_KEY)
          }
        };

        return Requester.putJSON(endpointOffset, newData, options)
          .then(profileResponse => {
            let $successElement = $("#save-success");
            $("#password").val("");
            $("#new-password").val("");
            $("#new-password-confirm").val("");
            UserController.elementPopup($successElement);
          })
          .catch(profileError => {
            let $errorElement = $("#profile-error");
            if (profileError.status === 422) {
              $errorElement.text(profileError.responseText);
              UserController.elementPopup($errorElement);
            }
          });
      });
  }

  static logout() {
    let body = {
      id: localStorage.getItem(STORAGE_ID_KEY)
    };
    let options = {
      headers: {
        [HTTP_HEADER_KEY]: localStorage.getItem(STORAGE_AUTH_KEY)
      }
    };

    return Requester.postJSON("/api/logout", body, options)
      .then(logoutResponse => {
        UserController.loadLogin();
        window.location = "#/";
      })
      .catch(logoutError => {
        let errorElement = $("#logout-error");
        if (logoutError.status === 422) {
          UserController.elementPopup(errorElement);
        }
      });
  }

  static loadLogin() {
    Templates
      .get("login")
      .then(template => {
        $("#main-nav").html(template);
        $("#login-error").toggleClass("hidden");
        $("#login-button").on("click", UserController.login);
        $("#signup-button").on("click", () => {
          window.location = "#/signup";
        });
        localStorage.clear();
      });
  }

  static loadNav(username) {
    Templates
      .get("navigation")
      .then(template => {
        let content = {
          username: username,
          profileImage: localStorage.getItem(STORAGE_PHOTO_KEY)
        };
        let compiledHtml = template(content);
        $("#main-nav").html(compiledHtml);
        $("#logout-error").toggleClass("hidden");
        $("#profile-link").prepend(
          $.cloudinary.image(content.profileImage, {
            radius: "max",
            height: 38,
            width: 38,
            crop: "scale"
          })
            .addClass("avatar img-circle img-thumbnail")
        );
        $("#logout-button").on("click", UserController.logout);
      });
  }

  static loadSignup() {
    Templates
      .get("signup")
      .then(template => {
        $("#content").html(template);
        $("#photo-container").prepend(
            $.cloudinary.image("default-profile-picture.svg", {
              radius: "max",
              height: 150,
              width: 150,
              crop: "scale"
            })
              .addClass("avatar img-circle img-thumbnail")
        );
        $("#signup-error").toggleClass("hidden");
        $("#signup-submit").on("click", UserController.signup);
      });
  }

  static loadProfile() {
    Promise.all([UserController.isLoggedIn(), Templates.get("profile"),])
      .then(([isLoggedIn, template]) => {
        if (!isLoggedIn) {
            window.location = "#/";
            return this;
        }
        let endpointOffset = "/api/user/" + localStorage.getItem(STORAGE_ID_KEY);
        let options = {
          headers: {
            [HTTP_HEADER_KEY]: localStorage.getItem(STORAGE_AUTH_KEY)
          }
        };
        Requester.getJSON(endpointOffset, options)
          .then(profileRespose => {
            let compiledHtml = template(profileRespose.result);
            $("#content").html(compiledHtml);
            $("#profile-save").on("click", UserController.saveProfile);
            $("#profile-error").toggleClass("hidden");
            $("#save-success").toggleClass("hidden");
            $("#photo-container").prepend(
              $.cloudinary.image(profileRespose.result.profileImage, {
                radius: "max",
                height: 150,
                width: 150,
                crop: "scale"
              })
                .addClass("avatar img-circle img-thumbnail")
                .attr("id", "profile-photo")
            );
            $("#photo-selector").unsigned_cloudinary_upload("q3olokl1", {
              cloud_name: "teamyowie",
              tags: "browser_uploads"
            })
              .bind("cloudinarydone", (e, data) => {
                $("#profile-photo").remove();
                $("#progress-bar")
                  .addClass("hidden");
                $("#photo-container").html(
                  $.cloudinary.image(data.result.public_id, {
                    radius: "max",
                    height: 150,
                    width: 150,
                    crop: "scale"
                  })
                    .addClass("avatar img-circle img-thumbnail")
                    .attr("id", "profile-photo")
                );
              })
              .bind("cloudinaryprogress", function (e, data) {
                let currentPercentage = Math.round((data.loaded * 100.0) / data.total) + "%";
                $("#photo-selector")
                  .addClass("hidden");
                $("#progress-bar")
                  .removeClass("hidden");
                $(".progress-bar-info")
                  .css("width", currentPercentage)
                  .text(currentPercentage);
              });
          })
          .catch(profileError => {
            let errorElement = $("#profile-error");
            if (profileError.status === 422) {
              errorElement.text(profileError.responseText);
              UserController.elementPopup(errorElement);
            }
          });
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
        $(".item").eq(0).append(
          $.cloudinary.image("fill1.png", {
            height: 920,
            width: 1900,
            crop: "scale"
          })
        );
        $(".item").eq(1).append(
          $.cloudinary.image("fill2.jpg", {
            height: 920,
            width: 1900,
            crop: "scale"
          })
        );
        $(".item").eq(2).append(
          $.cloudinary.image("fill3.jpg", {
            height: 920,
            width: 1900,
            crop: "scale"
          })
        );
        $('.carousel').carousel({
            interval: 5000
        });
      });
  }

  static elementPopupAndClearControls(element) {
    UserController.clearControls();
    UserController.elementPopup(element);
  }

  static elementPopup(element) {
    if (!element.hasClass("hidden")) {
      return;
    }
    element.toggleClass("hidden");
    setTimeout(() => {
      element.toggleClass("hidden");
    }, 3000);
  }

  static clearControls() {
    $(".form-control").val("");
  }
}