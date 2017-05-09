import { Requester } from "requester";

const STORAGE_ID_KEY = "id";
const STORAGE_AUTH_KEY = "auth-key";
const STORAGE_PHOTO_KEY = "profile-image";
const HTTP_HEADER_KEY = "x-auth-key";

export class Data {
    static dataLogin(user) {
        return Requester.postJSON("/api/auth", user)
            .then(authResponse => {
                localStorage.setItem(STORAGE_ID_KEY, authResponse.result.id);
                localStorage.setItem(STORAGE_AUTH_KEY, authResponse.result.authKey);
                localStorage.setItem(STORAGE_PHOTO_KEY, authResponse.result.profileImage);
                return {
                    username: authResponse.result.username
                };
            });
    }

    static dataSignup(user) {
        return Requester.postJSON("/api/users", user);
    }

    static dataSaveProfile(user) {
        let endpointOffset = "/api/user/" + localStorage.getItem(STORAGE_ID_KEY);
        let options = {
            headers: {
                [HTTP_HEADER_KEY]: localStorage.getItem(STORAGE_AUTH_KEY)
            }
        };

        return Requester.putJSON(endpointOffset, user, options);
    }

    static dataLogout() {
        let body = {
            id: localStorage.getItem(STORAGE_ID_KEY)
        };
        let options = {
            headers: {
                [HTTP_HEADER_KEY]: localStorage.getItem(STORAGE_AUTH_KEY)
            }
        };

        return Requester.postJSON("/api/logout", body, options);
    }

    static dataLoadProfile() {
        let endpointOffset = "/api/user/" + localStorage.getItem(STORAGE_ID_KEY);
        let options = {
            headers: {
                [HTTP_HEADER_KEY]: localStorage.getItem(STORAGE_AUTH_KEY)
            }
        };

        return Requester.getJSON(endpointOffset, options);
    }

    static dataLoadFeedback() {
        return Requester.getJSON("/api/feedback");
    }

    static dataPostFeedback(feedback) {
        return Requester.postJSON("/api/feedback", feedback);
    }
    
    static dataDeleteFeedback(id){
        return Requester.putJSON("/api/feedback/" + id);
    }
}