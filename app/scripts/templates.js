import { Requester } from "requester";

const cache = {};

export class Templates {
    static get(name) {
        if (cache[name]) {
            return Promise.resolve(cache[name]);
        }

        let url = `templates/${name}.handlebars`;
        return Requester.get(url)
            .then(template => {
                let readyTemplate = Handlebars.compile(template);
                cache[name] = readyTemplate;
                return Promise.resolve(readyTemplate);
            });
    }
}
