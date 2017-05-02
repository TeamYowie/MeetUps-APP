System.config({
    transpiler: "plugin-babel",
    map: {
        "plugin-babel": "./node_modules/systemjs-plugin-babel/plugin-babel.js",
        "systemjs-babel-build": "./node_modules/systemjs-plugin-babel/systemjs-babel-browser.js",
        "main": "./js/app.js",
        "controler": "./js/controller.js",
        "requester": "./js/requester.js"
    },
});

System.import("main");