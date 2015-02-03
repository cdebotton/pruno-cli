"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var View = require("backbone").View;
var router = _interopRequire(require("../routers/AppRouter"));

module.exports = View.extend({
  el: "#route-handler",
  template: require("../hbs/about.hbs"),

  initialize: function initialize() {
    this.listenTo(router, "route", this.route.bind(this));
  },

  route: function route(route) {
    if (route === "about") {
      this.render();
      this.delegateEvents();
    } else {
      this.undelegateEvents();
    }
  },

  render: function render() {
    var ctx = this.model.toJSON();
    var html = this.template(ctx);

    this.$el.html(html);
    return this;
  }
});