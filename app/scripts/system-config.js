System.config({
  transpiler: "plugin-babel",
  map: {
    "plugin-babel": "./node_modules/systemjs-plugin-babel/plugin-babel.js",
    "systemjs-babel-build": "./node_modules/systemjs-plugin-babel/systemjs-babel-browser.js",

    "app": "./scripts/app.js",
    "user": "./scripts/controllers/user-controller.js",
    "requester": "./scripts/requester.js",
    "templates": "./scripts/templates.js",
    "feedback": "./scripts/controllers/feedback-controller.js",
    "chat": "./scripts/controllers/chat-controller.js",
    "data": "./scripts/data.js",
    "validator": "./scripts/validator.js",
    "utils": "./scripts/utils.js"
  }
});

System.import("app");