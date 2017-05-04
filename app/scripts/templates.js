import { Requester } from "requester";

export class Templates {
  static get(name) {
    let url = `templates/${name}.hbs`;
    return Requester.get(url);
  }
}
