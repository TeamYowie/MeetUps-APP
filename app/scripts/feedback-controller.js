import { Requester } from "requester";
import { Templates } from "templates";
import { Controller } from "controller";

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
            }
            );
    }
}