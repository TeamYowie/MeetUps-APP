System.config({
  transpiler: "plugin-babel",
  map: {
    "plugin-babel": "./node_modules/systemjs-plugin-babel/plugin-babel.js",
    "systemjs-babel-build": "./node_modules/systemjs-plugin-babel/systemjs-babel-browser.js",

    "app": "./scripts/app.js",
    "controller": "./scripts/controller.js",
    "requester": "./scripts/requester.js",
    "templates": "./scripts/templates.js",
    "feedback": "./scripts/feedback-controller.js"
  }
});

System.import("app");