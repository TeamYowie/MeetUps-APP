import { Templates } from "templates";
import { Data } from "data";
import { Validator } from "validator";
import { Utils } from "utils";

const STORAGE_PHOTO_KEY = "profile-image";

export class UserController {
  static login() {
    const username = $("#input-username").val();
    const password = $("#input-password").val();

    if (!username || !password) {
      return this;
    }

    Utils.isLoggedIn()
      .then(isLoggedIn => {
        if (isLoggedIn) {
          return this;
        }
      });

    const passHash = CryptoJS.SHA256(password).toString();
    let body = {
      username,
      passHash
    };

    return Data.dataLogin(body)
      .then(username => {
        UserController.loadNav(username.username);
        window.location = "#/";
      })
      .catch(authError => {
        let errorElement = $("#login-error");
        if (authError.status === 422) {
          Utils.elementPopupAndClearControls(errorElement);
        }
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

    Utils.isLoggedIn()
      .then(isLoggedIn => {
        if (isLoggedIn) {
          return this;
        }
      });

    if (Validator.validUsername(username)) {
      $(".help-block").eq(0).css("color", "red");
      return this;
    }

    if (Validator.validEmail(email)) {
      $(".help-block").eq(1).css("color", "red");
      return this;
    }

    if (Validator.validPassword(password)) {
      $(".help-block").eq(2).css("color", "red");
      return this;
    }

    if (Validator.confirmPassword(password, passwordConfirmation)) {
      $(".help-block").eq(3).css("color", "red");
      return this;
    }

    let body = {
      username,
      passHash,
      email,
      profileImage
    };

    return Data.dataSignup(body)
      .then(signUpResponse => {
        UserController.postSignup();
      })
      .catch(signUpError => {
        let errorElement = $("#signup-error");
        if (signUpError.status === 422 || signUpError.status === 409) {
          errorElement.text(signUpError.responseText);
          Utils.elementPopupAndClearControls(errorElement);
        }
      });
  }

  static saveProfile() {
    const firstname = $("#new-firstname").val();
    const lastname = $("#new-lastname").val();
    const email = $("#new-email").val();
    const password = $("#password").val();
    const newPassword = $("#new-password").val();
    const newPasswordConfirmation = $("#new-password-confirm").val();
    const profileImage = $("#profile-photo").attr("src").split(/[\/]/).pop();
    const passHash = CryptoJS.SHA256(password).toString();
    const newPassHash = CryptoJS.SHA256(newPassword).toString();

    Utils.isLoggedIn()
      .then(isLoggedIn => {
        if (!isLoggedIn) {
          return this;
        }
      });

    let newData = {
      passHash,
      profileImage
    };

    let errorElement = $("#profile-error");
    if (firstname) {
      if (Validator.validUsername(firstname)) {
        newData.firstname = firstname;
      }
      else {
        errorElement.text("Please provide valid First Name.");
        Utils.elementPopup(errorElement);
        return this;
      }
    }

    if (lastname) {
      if (Validator.validUsername(lastname)) {
        newData.lastname = lastname;
      }
      else {
        errorElement.text("Please provide valid Last Name.");
        Utils.elementPopup(errorElement);
        return this;
      }
    }

    if (email) {
      if (!Validator.validEmail(email)) {
        newData.email = email;
      }
      else {
        errorElement.text("Please provide valid email.");
        Utils.elementPopup(errorElement);
        return this;
      }
    }

    if (newPassword) {
      if (Validator.validPassword(newPassword)) {
        if (Validator.confirmPassword(newPassword, newPasswordConfirmation)) {
          newData.newPassHash = newPassHash;
        }
        else {
          errorElement.text("Passwords do not match.");
          Utils.elementPopup(errorElement);
          return this;
        }
      }
      else {
        errorElement.text("Password should be at least 6 characters.");
        Utils.elementPopup(errorElement);
        return this;
      }
    }

    if (!password) {
      errorElement.text("Enter password to save changes.");
      Utils.elementPopup(errorElement);
      return this;
    }

    return Data.dataSaveProfile(newData)
      .then(profileResponse => {
        localStorage.setItem(STORAGE_PHOTO_KEY, newData.profileImage);
        let successElement = $("#save-success");
        $("#password").val("");
        $("#new-password").val("");
        $("#new-password-confirm").val("");
        $("#profile-link > img").remove();
        $("#profile-link").prepend(
          $.cloudinary.image(newData.profileImage, {
            radius: "max",
            height: 38,
            width: 38,
            crop: "scale"
          })
            .addClass("avatar img-circle img-thumbnail")
        );
        Utils.elementPopup(successElement);
      })
      .catch(profileError => {
        if (profileError.status === 422) {
          errorElement.text(profileError.responseText);
          Utils.elementPopup(errorElement);
        }
      });
  }

  static logout() {
    return Data.dataLogout()
      .then(logoutResponse => {
        UserController.loadLogin();
        window.location = "#/";
      })
      .catch(logoutError => {
        let errorElement = $("#logout-error");
        if (logoutError.status === 422) {
          Utils.elementPopup(errorElement);
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
        $("ul.nav.navbar-nav").find("li").removeClass("active");
        $("nav.navbar.navbar-default").on("click", (e) => {
          $("ul.nav.navbar-nav").find("li").removeClass("active");
          $(e.target).parent().addClass("active");
        });
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
    Promise.all([Utils.isLoggedIn(), Templates.get("profile"),])
      .then(([isLoggedIn, template]) => {
        if (!isLoggedIn) {
          window.location = "#/";
          return this;
        }

        return Data.dataLoadProfile()
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
              Utils.elementPopup(errorElement);
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
}