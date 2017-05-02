import { Controller } from "./controller.js";

let router = new Navigo(null, true);

router.on("/login", Controller.login);

$(window).on("load", () => router.navigate());
$(window).on("hashchange", () => router.navigate());