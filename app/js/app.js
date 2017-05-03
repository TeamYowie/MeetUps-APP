import { Controller } from "controler";
import { Templates } from "templates";

let router = new Navigo(null, true);

$(document).ready(() => {
  Templates.get("login")
    .then(template => {
      $("#top").html(template);
      $("#login-button").on("click", Controller.login);
    });
});