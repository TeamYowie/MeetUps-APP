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
                $(".glyphicon").on("click", (e) => {
                    FeedbackController.deleteFeedback(e.target.id);
                });
            }
            );
    }
    static postFeedback() {
        let name = localStorage.getItem(STORAGE_USERNAME_KEY),
            title = $("#feedback-form-title").val(),
            message = $("#feedback-form-message").val(),
            errorElement = $("#feedback-error");
        //need some better validation
        if (!name || !title || !message) {
            errorElement.text("Invalid Post");
            Controller.errorPopup(errorElement);
            return;
        }

        Requester.postJSON("/api/feedback", {
            name,
            title,
            message
        })
            .then(() => {
                FeedbackController.loadFeedback();
            })
            .catch(templateError => {
                let errorElement = $("#feedback-error");
                if (templateError.status === 422) {
                    errorElement.text(templateError.responseText);
                    Controller.errorPopup(errorElement);
                }
            });
    }

    static deleteFeedback(id) {
        Requester.putJSON("/api/feedback/" + id)
            .then(() => {
                FeedbackController.loadFeedback();
            });
    }
}