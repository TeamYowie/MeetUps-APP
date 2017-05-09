const MIN_PASSWORD_LENGTH = 6;
const MAX_PASSWORD_LENGTH = 20;
const USERNAME_PATTERN = /^[a-zA-Z0-9]+$/;
const EMAIL_PATTERN = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export class Validator {
    static validUsername(username) {
        return (!username || !(USERNAME_PATTERN.test(username)));
    }

    static validEmail(email) {
        return (!email || !(EMAIL_PATTERN.test(email)));
    }

    static validPassword(password) {
        return (!password || (typeof password !== "string") || (password.length < MIN_PASSWORD_LENGTH) || (password.length > MAX_PASSWORD_LENGTH));
    }

    static confirmPassword(password, passwordConfirmation) {
        return (!passwordConfirmation || (password !== passwordConfirmation));
    }
}