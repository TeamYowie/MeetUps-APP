export class Requester {
  static get(url) {
    return $.ajax({
      url,
      method: "GET"
    });
  }
  
  static getJSON(url) {
    return $.ajax({
      url,
      method: "GET",
      contentType: "application/json"
    });
  }

  static putJSON(url, body, options = {}) {
    let headers = options.headers || {};
    return $.ajax({
      url,
      headers,
      method: "PUT",
      contentType: "application/json",
      data: JSON.stringify(body)
    });
  }

  static postJSON(url, body, options = {}) {
    let headers = options.headers || {};
    return $.ajax({
      url,
      headers,
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(body)
    });
  }
}