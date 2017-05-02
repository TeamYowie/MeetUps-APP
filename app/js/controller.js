import { Requester } from "./requester.js";

const KEY_STORAGE_USERNAME = "username";
const KEY_STORAGE_AUTH_KEY = "authKey";

class Controller {
    static login() {
        const username = $('#input-username').val();
        let passHash = CryptoJS.SHA256($('#input-password').val()).toString();

        return Requester.postJSON("http://teamyowie-api.azurewebsites.net/api/auth", {
                username,
                passHash
        })
        .then(respUser => {
                $('#result').append( `<p>Username: ${respUser.result.username}</p>` );
                $('#result').append( `<p>Auth key: ${respUser.result.authKey}</p>` );
                localStorage.setItem(KEY_STORAGE_USERNAME, respUser.result.username);
                localStorage.setItem(KEY_STORAGE_AUTH_KEY, respUser.result.authKey);
        });
  }
}

export { Controller };