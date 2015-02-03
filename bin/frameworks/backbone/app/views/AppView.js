"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _backbone = require("backbone");

var View = _backbone.View;
var history = _backbone.history;
var router = _interopRequire(require("../routers/AppRouter"));

var IndexView = _interopRequire(require("./IndexView"));

var AboutView = _interopRequire(require("./AboutView"));

module.exports = View.extend({
  el: "#app-mount",
  template: require("../hbs/app.hbs"),

  events: {
    "click nav a": "loadPage"
  },

  initialize: function initialize() {
    this.render();
    this.pages = {
      index: new IndexView({ model: this.model }),
      about: new AboutView({ model: this.model })
    };
  },

  loadPage: function loadPage(event) {
    event.preventDefault();
    var path = event.target.pathname;
    router.navigate(path, { trigger: true });
  },

  render: function render() {
    var ctx = this.model.toJSON();
    var html = this.template(ctx);

    this.$el.html(html);
    return this;
  }
});