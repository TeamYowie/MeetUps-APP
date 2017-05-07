import { Requester } from "requester";
import { Templates } from "templates";
import { Controller } from "controller";

const STORAGE_USERNAME_KEY = "username";

export class FeedbackController {
    static loadFeedback() {
        let feedback;
        Promise.all([Controller.isLoggedIn(), Requester.getJSON("/api/feedback")])
            .then(([isLoggedIn, data]) => {
                if (!isLoggedIn) {
                    window.location = "#/signup";
                    return this;
                }
                feedback = data;
                return Templates.get("feedback");
            })
            .then(template => {
                $("#content").html(template(feedback));
                $("#feedback-error").toggleClass("hidden");
                $("#feedback-submit").on("click", FeedbackController.postFeedback);
            }
            );
    }
    static postFeedback() {
        let name = localStorage.getItem(STORAGE_USERNAME_KEY),
            title = $("#feedback-form-title").val(),
            message = $("#feedback-form-message").val();

        //need some better validation
        if (!name || !title || !message) {
            return;
        }

        Requester.postJSON("/api/feedback", {
            name,
            title,
            message
        })
            .then(res => {
                if (res.status === 201) {
                    FeedbackController.loadFeedback();
                }
            })
            .catch(templateError => {
                let errorElement = $("#feedback-error");
                if (templateError.status === 422) {
                    errorElement.text(templateError.responseText);
                    Controller.errorPopup(errorElement);
                }
            });
    }
}