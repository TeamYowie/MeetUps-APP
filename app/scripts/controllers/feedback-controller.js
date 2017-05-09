import { Templates } from "templates";
import { Data } from "data";
import { Utils } from "utils";

const STORAGE_USERNAME_KEY = "username";

export class FeedbackController {
    static loadFeedback() {
        let feedback;
        Promise.all([Utils.isLoggedIn(), Data.dataLoadFeedback()])
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
        let name = $("#span-name").text(),
            title = $("#feedback-form-title").val(),
            message = $("#feedback-form-message").val(),
            errorElement = $("#feedback-error");
        if (!name || !title || !message) {
            errorElement.text("Invalid Post");
            Utils.elementPopupAndClearControls(errorElement);
            return;
        }

        let feedback = {
            name,
            title,
            message
        };

        Data.dataPostFeedback(feedback)
            .then(() => {
                FeedbackController.loadFeedback();
            })
            .catch(templateError => {
                let errorElement = $("#feedback-error");
                if (templateError.status === 422) {
                    errorElement.text(templateError.responseText);
                    Utils.elementPopupAndClearControls(errorElement);
                }
            });
    }

    static deleteFeedback(id) {
        Data.dataDeleteFeedback(id)
            .then(() => {
                FeedbackController.loadFeedback();
            });
    }
}