"use strict";

var Router = require("backbone").Router;


var AppRouter = Router.extend({
  routes: {
    "": "index",
    about: "about"
  }
});

module.exports = new AppRouter();