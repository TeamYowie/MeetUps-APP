System.config({
  transpiler: "plugin-babel",
  map: {
    "plugin-babel": "./node_modules/systemjs-plugin-babel/plugin-babel.js",
    "systemjs-babel-build": "./node_modules/systemjs-plugin-babel/systemjs-babel-browser.js",
    
    "app": "./scripts/app.js",
    "controler": "./scripts/controller.js",
    "requester": "./scripts/requester.js",
    "templates": "./scripts/templates.js"
  }
});

System.import("app");