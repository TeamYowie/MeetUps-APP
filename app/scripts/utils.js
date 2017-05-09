const STORAGE_ID_KEY = "id";
const STORAGE_AUTH_KEY = "auth-key";

export class Utils {
    static isLoggedIn() {
        return Promise
            .resolve()
            .then(() => {
                return !!localStorage.getItem(STORAGE_ID_KEY) && !!localStorage.getItem(STORAGE_AUTH_KEY);
            });
    }
    static elementPopupAndClearControls(element) {
        Utils.clearControls();
        Utils.elementPopup(element);
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