const API_URL = "http://teamyowie-api.azurewebsites.net";

export class Requester {
  static get(url) {
    return Promise.resolve($.ajax({
      url,
      method: "GET"
    }));
  }

  static getJSON(endpoint) {
    return Promise.resolve($.ajax({
      url: API_URL + endpoint,
      method: "GET",
      contentType: "application/json"
    }));
  }

  static putJSON(endpoint, body, options = {}) {
    let headers = options.headers || {};
    return Promise.resolve($.ajax({
      url: API_URL + endpoint,
      headers,
      method: "PUT",
      contentType: "application/json",
      data: JSON.stringify(body)
    }));
  }

  static postJSON(endpoint, body, options = {}) {
    let headers = options.headers || {};
    return Promise.resolve($.ajax({
      url: API_URL + endpoint,
      headers,
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(body)
    }));
  }
}